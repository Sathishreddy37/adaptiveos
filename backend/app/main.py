"""
AdaptiveOS Backend API (FastAPI)
"""

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import json
import uuid
import os
from typing import Dict, Any, List, Optional

from .database import init_db, get_connection
from .orchestrator import AgentOrchestrator
from .models import (
    UserProfile, TaskItem, ScheduleBlock,
    TrustedPersonCreate, TrustedPerson, VoiceCommandRequest
)

init_db()

app = FastAPI(
    title="AdaptiveOS API",
    description="Agentic personal-life coordination system with continuous decision loop and human-in-the-loop support.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = AgentOrchestrator()

# Serve 3D landing page (adaptiveos.html)
from fastapi.responses import HTMLResponse, FileResponse

@app.get("/landing", response_class=HTMLResponse)
@app.get("/adaptiveos.html", response_class=HTMLResponse)
def get_landing_page():
    landing_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "adaptiveos.html"))
    if os.path.exists(landing_file):
        with open(landing_file, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Landing page not found</h1>", status_code=404)

# Initialize baseline seed if empty
orchestrator.reset_to_standard_seed()

# ----------------- User Profile -----------------
@app.get("/api/user/profile")
def get_user_profile():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = 'user-1'")
    row = cursor.fetchone()
    conn.close()
    if not row:
        return UserProfile().dict()
    return dict(row)

@app.post("/api/user/profile")
def update_user_profile(profile: UserProfile):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO users (id, name, email, sleep_start, sleep_end, wake_support_person, local_encryption_enabled, cloud_sync_enabled, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        profile.id, profile.name, profile.email, profile.sleep_start, profile.sleep_end,
        profile.wake_support_person, 1 if profile.local_encryption_enabled else 0,
        1 if profile.cloud_sync_enabled else 0, datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()
    return {"success": True, "profile": profile}

# ----------------- Schedule -----------------
@app.get("/api/schedule")
def get_schedule(date: Optional[str] = None):
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schedule_blocks WHERE date = ? ORDER BY start_time ASC", (date,))
    rows = cursor.fetchall()
    blocks = [dict(r) for r in rows]

    # Also check if there are tomorrow blocks
    cursor.execute("SELECT * FROM schedule_blocks WHERE start_time LIKE 'Tomorrow%'")
    tomorrow_rows = cursor.fetchall()
    blocks.extend([dict(r) for r in tomorrow_rows])

    conn.close()
    return {"date": date, "blocks": blocks}

@app.post("/api/schedule/reset")
def reset_schedule():
    orchestrator.reset_to_standard_seed()
    return {"success": True, "message": "Schedule reset to 8:00 AM baseline state"}

# ----------------- Continuous Agent Loop & Replanning -----------------
@app.post("/api/replan/trigger")
def trigger_replan(payload: Dict[str, Any] = Body(...)):
    """
    Triggers the 7-agent loop with either an explicit event or a user transcript.
    """
    event = payload.get("event")
    transcript = payload.get("transcript")
    current_time = payload.get("current_time", "16:00")
    date_str = payload.get("date", datetime.now().strftime("%Y-%m-%d"))

    result = orchestrator.run_control_loop(
        incoming_event=event,
        user_transcript=transcript,
        current_time=current_time,
        date_str=date_str
    )
    return result

@app.get("/api/replan/proposals/pending")
def get_pending_proposals():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM replan_proposals WHERE status = 'pending' ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    proposals = []
    for r in rows:
        item = dict(r)
        item["diff_summary"] = json.loads(item["diff_summary"])
        item["before_blocks"] = json.loads(item["before_blocks"])
        item["proposed_blocks"] = json.loads(item["proposed_blocks"])
        proposals.append(item)
    return proposals

@app.post("/api/replan/proposals/{proposal_id}/decision")
def decide_proposal(proposal_id: str, decision: Dict[str, bool] = Body(...)):
    approved = decision.get("approved", True)
    res = orchestrator.apply_proposal(proposal_id, approved=approved)
    return res

# ----------------- Decision Logs (All 7 Agents) -----------------
@app.get("/api/agents/decision-logs")
def get_decision_logs(session_id: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("SELECT * FROM decision_logs WHERE session_id = ? ORDER BY step_index ASC", (session_id,))
    else:
        cursor.execute("SELECT * FROM decision_logs ORDER BY timestamp DESC LIMIT 60")
    rows = cursor.fetchall()
    conn.close()
    logs = []
    for r in rows:
        d = dict(r)
        if d.get("state_diff"):
            try:
                d["state_diff"] = json.loads(d["state_diff"])
            except Exception:
                pass
        logs.append(d)
    return logs

# ----------------- Trusted People & Scoped Permissions -----------------
@app.get("/api/trusted-people")
def get_trusted_people():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trusted_people ORDER BY created_at ASC")
    people_rows = cursor.fetchall()

    result = []
    for p in people_rows:
        person = dict(p)
        cursor.execute("SELECT * FROM trusted_permissions WHERE person_id = ?", (person["id"],))
        perm_rows = cursor.fetchall()
        person["permissions"] = [
            {
                "id": pr["id"],
                "permission_key": pr["permission_key"],
                "permission_label": pr["permission_label"],
                "is_enabled": bool(pr["is_enabled"])
            }
            for pr in perm_rows
        ]
        result.append(person)

    conn.close()
    return result

@app.post("/api/trusted-people")
def add_trusted_person(person_in: TrustedPersonCreate):
    """
    Enforces product rule: Scoped permissions only. Must select specific checkboxes.
    """
    if not person_in.permissions or not any(p.get("is_enabled") for p in person_in.permissions):
        raise HTTPException(
            status_code=400,
            detail="Product Policy: Trusted people cannot be added without explicitly scoped, granted permissions. Select at least one specific permission."
        )

    conn = get_connection()
    cursor = conn.cursor()
    person_id = f"person-{str(uuid.uuid4())[:8]}"

    cursor.execute("""
    INSERT INTO trusted_people (id, name, relationship, avatar_color, phone, voice_reminder_text, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        person_id, person_in.name, person_in.relationship,
        person_in.avatar_color or "#7c6cff", person_in.phone,
        person_in.voice_reminder_text or f"Hi {person_in.name}, you have my support today.",
        datetime.now().isoformat()
    ))

    for p in person_in.permissions:
        cursor.execute("""
        INSERT INTO trusted_permissions (id, person_id, permission_key, permission_label, is_enabled, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            str(uuid.uuid4()), person_id, p["permission_key"],
            p["permission_label"], 1 if p.get("is_enabled") else 0,
            datetime.now().isoformat()
        ))

    conn.commit()
    conn.close()
    return {"success": True, "person_id": person_id}

@app.post("/api/trusted-people/{person_id}/permissions")
def update_permission(person_id: str, payload: Dict[str, Any] = Body(...)):
    permission_key = payload.get("permission_key")
    is_enabled = payload.get("is_enabled", False)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE trusted_permissions
    SET is_enabled = ?, updated_at = ?
    WHERE person_id = ? AND permission_key = ?
    """, (1 if is_enabled else 0, datetime.now().isoformat(), person_id, permission_key))
    conn.commit()
    conn.close()
    return {"success": True, "person_id": person_id, "permission_key": permission_key, "is_enabled": is_enabled}

@app.delete("/api/trusted-people/{person_id}")
def delete_trusted_person(person_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM trusted_permissions WHERE person_id = ?", (person_id,))
    cursor.execute("DELETE FROM trusted_people WHERE id = ?", (person_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted": person_id}

# ----------------- Voice Interaction -----------------
@app.post("/api/voice/process")
def process_voice(command: VoiceCommandRequest):
    """
    Speech transcript intent detection and agent pipeline invocation.
    """
    res = orchestrator.run_control_loop(user_transcript=command.transcript)
    return res

@app.post("/api/voice/mom-wake-support")
def trigger_mom_wake_support():
    """
    Simulates the Human-in-the-Loop wake up escalation:
    AI voice -> no response -> plays Mom's approved recorded voice reminder
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT tp.name, tp.voice_reminder_text, perm.is_enabled
    FROM trusted_people tp
    JOIN trusted_permissions perm ON tp.id = perm.person_id
    WHERE tp.relationship = 'Mom' AND perm.permission_key = 'wake_up_support'
    """)
    row = cursor.fetchone()
    conn.close()

    if not row or not row["is_enabled"]:
        return {
            "allowed": False,
            "message": "Mom does not have approved 'wake_up_support' permission enabled in your privacy settings."
        }

    return {
        "allowed": True,
        "person": "Mom",
        "audio_script": row["voice_reminder_text"] or "Sathish, wake up! You wanted to study this morning.",
        "escalation_chain": [
            {"step": 1, "time": "6:00 AM", "action": "Standard gentle AI chime and audio reminder"},
            {"step": 2, "time": "6:05 AM", "action": "Second AI alert: No motion or device interaction detected"},
            {"step": 3, "time": "6:08 AM", "action": "Human Escalation: Played Mom's approved recorded voice reminder"},
            {"step": 4, "time": "6:15 AM", "action": "Sathish awoke and checked in; study session commenced"}
        ]
    }

# ----------------- Scripted Demo Scenario (Section 5) -----------------
@app.post("/api/scenario/run-demo")
def run_demo_scenario():
    """
    Executes the exact 8:00 AM -> 4:00 PM -> 4:06 PM demo scenario from Section 5.
    """
    demo_result = orchestrator.run_section5_scenario()
    return demo_result

# ----------------- Mom Clock & Alarms System -----------------
@app.get("/api/alarms")
def get_alarms(persona: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    if persona:
        cursor.execute("SELECT * FROM alarms WHERE persona = ? ORDER BY time ASC", (persona,))
    else:
        cursor.execute("SELECT * FROM alarms ORDER BY time ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/alarms")
def create_alarm(payload: Dict[str, Any] = Body(...)):
    alarm_id = f"alarm-{str(uuid.uuid4())[:8]}"
    title = payload.get("title", "Morning Wake-Up")
    time_val = payload.get("time", "06:00")
    days = payload.get("days", "Everyday")
    category = payload.get("category", "wake_up")
    voice_prompt = payload.get("voice_prompt", f"Time for {title}!")
    persona = payload.get("persona", "student")

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO alarms (id, title, time, days, category, is_active, voice_prompt, persona, created_at)
    VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)
    """, (alarm_id, title, time_val, days, category, voice_prompt, persona, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    return {"success": True, "id": alarm_id, "title": title, "time": time_val}

@app.post("/api/alarms/{alarm_id}/toggle")
def toggle_alarm(alarm_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT is_active FROM alarms WHERE id = ?", (alarm_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Alarm not found")
    new_state = 0 if row["is_active"] else 1
    cursor.execute("UPDATE alarms SET is_active = ? WHERE id = ?", (new_state, alarm_id))
    conn.commit()
    conn.close()
    return {"success": True, "id": alarm_id, "is_active": bool(new_state)}

@app.delete("/api/alarms/{alarm_id}")
def delete_alarm(alarm_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM alarms WHERE id = ?", (alarm_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted": alarm_id}

@app.post("/api/alarms/snooze-check")
def check_snooze_conflict(payload: Dict[str, Any] = Body(...)):
    """
    Intelligent Snooze Evaluation:
    Evaluates if '5 More Minutes' causes conflicts with next commitments.
    """
    snooze_minutes = payload.get("minutes", 5)
    current_time = payload.get("current_time", "06:00")
    date_str = payload.get("date", datetime.now().strftime("%Y-%m-%d"))

    # Convert time to minutes from midnight
    parts = current_time.split(":")
    curr_total = int(parts[0]) * 60 + int(parts[1])
    snoozed_total = curr_total + snooze_minutes

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schedule_blocks WHERE date = ? ORDER BY start_time ASC", (date_str,))
    rows = cursor.fetchall()
    conn.close()

    blocks = [dict(r) for r in rows]
    # Find next block after current_time
    next_fixed = None
    next_flex = None

    for b in blocks:
        st_parts = b["start_time"].split(":")
        st_total = int(st_parts[0]) * 60 + int(st_parts[1])
        if st_total > curr_total:
            if b.get("is_fixed") and not next_fixed:
                next_fixed = b
            elif not b.get("is_fixed") and not next_flex:
                next_flex = b

    buffer_minutes = 45
    if next_fixed:
        st_parts = next_fixed["start_time"].split(":")
        buffer_minutes = (int(st_parts[0]) * 60 + int(st_parts[1])) - curr_total

    has_conflict = buffer_minutes < 15
    explanation = (
        f"You have {buffer_minutes} minutes before your next fixed commitment ('{next_fixed['title'] if next_fixed else 'Daily Agenda'}'). "
        f"{snooze_minutes} extra minutes is safe, but your focus block will be shortened by {snooze_minutes} minutes. Sleep schedule protected."
        if not has_conflict else
        f"Warning: Only {buffer_minutes} minutes remaining before fixed event '{next_fixed['title']}'. Snoozing will cut into prep time!"
    )

    return {
        "safe": not has_conflict,
        "buffer_minutes": max(0, buffer_minutes),
        "explanation": explanation,
        "snoozed_wake_time": f"{snoozed_total // 60:02d}:{snoozed_total % 60:02d}"
    }

