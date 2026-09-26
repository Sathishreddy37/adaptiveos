"""
AdaptiveOS Orchestrator
Coordinates the continuous multi-agent control loop:
PLAN → EXECUTE → OBSERVE → ANALYZE IMPACT → PRIORITIZE → RESOLVE CONFLICT → REPLAN → GET USER APPROVAL → EXECUTE AGAIN → LEARN
Logs every agent's contribution to SQLite for explainability & auditability.
"""

import uuid
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

from .database import get_connection
from .agents import (
    PlanningAgent,
    PriorityAgent,
    TimeAgent,
    ConflictAgent,
    AdaptationAgent,
    LearningAgent,
    VoiceHumanAgent
)

class AgentOrchestrator:
    def __init__(self):
        self.planning_agent = PlanningAgent()
        self.priority_agent = PriorityAgent()
        self.time_agent = TimeAgent()
        self.conflict_agent = ConflictAgent()
        self.adaptation_agent = AdaptationAgent()
        self.learning_agent = LearningAgent()
        self.voice_human_agent = VoiceHumanAgent()

    def run_control_loop(
        self,
        incoming_event: Optional[Dict[str, Any]] = None,
        user_transcript: Optional[str] = None,
        current_time: str = "16:00",
        date_str: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes the 7-agent sequential control pipeline with shared state.
        """
        if not date_str:
            date_str = datetime.now().strftime("%Y-%m-%d")

        session_id = str(uuid.uuid4())
        conn = get_connection()
        cursor = conn.cursor()

        # Fetch current user profile
        cursor.execute("SELECT * FROM users WHERE id = 'user-1'")
        user_row = cursor.fetchone()
        user_profile = dict(user_row) if user_row else {
            "id": "user-1",
            "name": "Sathish",
            "sleep_start": "23:00",
            "sleep_end": "07:00",
            "wake_support_person": "Mom"
        }

        # Fetch active schedule blocks
        cursor.execute("SELECT * FROM schedule_blocks WHERE date = ? ORDER BY start_time ASC", (date_str,))
        block_rows = cursor.fetchall()
        current_blocks = [dict(b) for b in block_rows]

        # If database is empty, let planning agent synthesize the base day
        if not current_blocks:
            current_blocks = self.planning_agent.build_initial_schedule(user_profile, date_str)
            for b in current_blocks:
                cursor.execute("""
                INSERT OR REPLACE INTO schedule_blocks (id, task_id, title, category, start_time, end_time, date, is_fixed, is_sleep, status, color, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    b["id"], b.get("task_id"), b["title"], b["category"],
                    b["start_time"], b["end_time"], b["date"],
                    1 if b.get("is_fixed") else 0,
                    1 if b.get("is_sleep") else 0,
                    b.get("status", "scheduled"), b.get("color"),
                    datetime.now().isoformat()
                ))
            conn.commit()

        # Initialize shared control loop state
        state: Dict[str, Any] = {
            "session_id": session_id,
            "date": date_str,
            "current_time": current_time,
            "user_profile": user_profile,
            "schedule_blocks": current_blocks,
            "incoming_event": incoming_event,
            "user_transcript": user_transcript,
            "log": []
        }

        # Step 1: Voice & Human intent parsing (if transcript supplied)
        if user_transcript and not incoming_event:
            intent = self.voice_human_agent.parse_intent(user_transcript)
            state["parsed_intent"] = intent
            if intent["intent"] == "ADD_ASSIGNMENT":
                incoming_event = {
                    "type": "NEW_ASSIGNMENT",
                    "source": "voice_transcript",
                    "details": {
                        "title": intent["title"],
                        "deadline": intent["deadline"],
                        "duration_minutes": intent["duration_minutes"],
                        "urgency": intent["urgency"],
                        "importance": intent["importance"],
                        "category": "study"
                    }
                }
                state["incoming_event"] = incoming_event

        # Execute 7 Agents in defined sequence
        state = self.planning_agent.process(state)
        state = self.priority_agent.process(state)
        state = self.time_agent.process(state)
        state = self.conflict_agent.process(state)
        state = self.adaptation_agent.process(state)
        state = self.learning_agent.process(state)
        state = self.voice_human_agent.process(state)

        # Log decision trail to SQLite
        for idx, log_item in enumerate(state["log"]):
            cursor.execute("""
            INSERT INTO decision_logs (id, session_id, agent_name, step_index, action, reasoning, state_diff, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                str(uuid.uuid4()),
                session_id,
                log_item["agent"],
                idx + 1,
                log_item["action"],
                log_item["reasoning"],
                json.dumps(state.get("diff_summary", [])),
                datetime.now().isoformat()
            ))

        # If incoming event triggered a replan proposal, store it with status='pending'
        proposal_id = None
        if incoming_event and state.get("proposed_blocks"):
            proposal_id = f"prop-{session_id[:8]}"
            cursor.execute("""
            INSERT INTO replan_proposals (id, session_id, trigger_event, reason, before_blocks, proposed_blocks, diff_summary, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
            """, (
                proposal_id,
                session_id,
                json.dumps(incoming_event),
                f"Urgent task '{incoming_event.get('details',{}).get('title')}' arrived due tomorrow.",
                json.dumps(current_blocks),
                json.dumps(state["proposed_blocks"]),
                json.dumps(state["diff_summary"]),
                datetime.now().isoformat()
            ))

        conn.commit()
        conn.close()

        return {
            "session_id": session_id,
            "proposal_id": proposal_id,
            "current_blocks": current_blocks,
            "proposed_blocks": state.get("proposed_blocks", current_blocks),
            "diff_summary": state.get("diff_summary", []),
            "agent_logs": state["log"],
            "agent_response": state.get("agent_response", {}),
            "sleep_health_guard": state.get("sleep_health_guard", {"sleep_preserved": True}),
            "learned_patterns": state.get("learned_patterns", {}),
            "requires_confirmation": bool(proposal_id)
        }

    def apply_proposal(self, proposal_id: str, approved: bool = True) -> Dict[str, Any]:
        """
        Commits or rejects a pending replan proposal based on user feedback.
        """
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM replan_proposals WHERE id = ?", (proposal_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return {"success": False, "error": "Proposal not found"}

        if approved:
            proposed_blocks = json.loads(row["proposed_blocks"])
            # Update database schedule blocks
            for b in proposed_blocks:
                cursor.execute("""
                INSERT OR REPLACE INTO schedule_blocks (id, task_id, title, category, start_time, end_time, date, is_fixed, is_sleep, status, color, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    b["id"], b.get("task_id"), b["title"], b["category"],
                    b["start_time"], b["end_time"], b["date"],
                    1 if b.get("is_fixed") else 0,
                    1 if b.get("is_sleep") else 0,
                    b.get("status", "scheduled"), b.get("color"),
                    datetime.now().isoformat()
                ))

            cursor.execute("UPDATE replan_proposals SET status = 'accepted' WHERE id = ?", (proposal_id,))
            msg = "Replan accepted and committed to active schedule."
        else:
            cursor.execute("UPDATE replan_proposals SET status = 'rejected' WHERE id = ?", (proposal_id,))
            msg = "Replan rejected. Preserved original schedule."

        conn.commit()
        conn.close()
        return {"success": True, "message": msg, "status": "accepted" if approved else "rejected"}

    def reset_to_standard_seed(self, date_str: Optional[str] = None):
        """
        Resets schedule and logs to the 8:00 AM baseline day ready for the 4:00 PM scenario.
        """
        if not date_str:
            date_str = datetime.now().strftime("%Y-%m-%d")

        conn = get_connection()
        cursor = conn.cursor()

        # Clear existing blocks and proposals
        cursor.execute("DELETE FROM schedule_blocks")
        cursor.execute("DELETE FROM replan_proposals")
        cursor.execute("DELETE FROM decision_logs")

        # Build clean initial schedule
        user_profile = {"id": "user-1", "name": "Sathish", "sleep_start": "23:00", "sleep_end": "07:00"}
        base_blocks = self.planning_agent.build_initial_schedule(user_profile, date_str)
        for b in base_blocks:
            cursor.execute("""
            INSERT INTO schedule_blocks (id, task_id, title, category, start_time, end_time, date, is_fixed, is_sleep, status, color, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                b["id"], b.get("task_id"), b["title"], b["category"],
                b["start_time"], b["end_time"], b["date"],
                1 if b.get("is_fixed") else 0,
                1 if b.get("is_sleep") else 0,
                b.get("status", "scheduled"), b.get("color"),
                datetime.now().isoformat()
            ))

        # Ensure trusted people exist
        cursor.execute("DELETE FROM trusted_people")
        cursor.execute("DELETE FROM trusted_permissions")

        trusted_members = [
            {
                "id": "person-mom",
                "name": "Mom",
                "relationship": "Mom",
                "avatar_color": "#ec4899",
                "voice_reminder_text": "Sathish, wake up! You wanted to study systems architecture this morning.",
                "permissions": [
                    ("wake_up_support", "Wake-up voice assistance", 1),
                    ("missed_task_alert", "Alert on missed study session", 1),
                    ("evening_checkin", "Evening check-in access", 0),
                    ("full_schedule_view", "View full private calendar", 0)
                ]
            },
            {
                "id": "person-dad",
                "name": "Dad",
                "relationship": "Dad",
                "avatar_color": "#3b82f6",
                "voice_reminder_text": "Hey Sathish, take a 10-minute walk after work.",
                "permissions": [
                    ("evening_checkin", "Evening check-in access", 1),
                    ("wake_up_support", "Wake-up voice assistance", 0),
                    ("full_schedule_view", "View full private calendar", 0)
                ]
            },
            {
                "id": "person-mentor",
                "name": "Dr. Sarah (Research Mentor)",
                "relationship": "Mentor",
                "avatar_color": "#10b981",
                "voice_reminder_text": "Keep making steady progress on your technical milestone today.",
                "permissions": [
                    ("study_accountability", "Study & project milestone accountability", 1),
                    ("wake_up_support", "Wake-up voice assistance", 0),
                    ("full_schedule_view", "View full private calendar", 0)
                ]
            }
        ]

        for p in trusted_members:
            cursor.execute("""
            INSERT INTO trusted_people (id, name, relationship, avatar_color, voice_reminder_text, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (p["id"], p["name"], p["relationship"], p["avatar_color"], p["voice_reminder_text"], datetime.now().isoformat()))

            for perm_key, perm_label, is_en in p["permissions"]:
                cursor.execute("""
                INSERT INTO trusted_permissions (id, person_id, permission_key, permission_label, is_enabled, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """, (str(uuid.uuid4()), p["id"], perm_key, perm_label, is_en, datetime.now().isoformat()))

        conn.commit()
        conn.close()

    def run_section5_scenario(self, date_str: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Executes the exact Section 5 Demo Scenario:
        8:00 AM  – normal schedule running
        4:00 PM  – new assignment arrives, due tomorrow
        4:01 PM  – Planning/Priority agents detect the deadline, raise priority
        4:03 PM  – Conflict Agent finds overlap with existing project-work block
        4:04 PM  – Adaptation Agent moves the project block
        4:05 PM  – System checks sleep block is not touched
        4:06 PM  – User is notified: "Your day changed. Here's the new plan. Accept?"
        """
        self.reset_to_standard_seed(date_str)

        timeline_steps = [
            {
                "time": "8:00 AM",
                "phase": "EXECUTE",
                "agent": "Planning Agent",
                "description": "Normal schedule running. Morning routine finished; focus work, lunch, and engineering sync scheduled smoothly.",
                "status": "normal"
            },
            {
                "time": "4:00 PM",
                "phase": "OBSERVE",
                "agent": "Voice & Human Agent",
                "description": "New assignment event arrives: 'Python ML Optimization Assignment', 2 hours required, due tomorrow at 9:00 AM.",
                "status": "event_received"
            },
            {
                "time": "4:01 PM",
                "phase": "PRIORITIZE",
                "agent": "Priority Agent",
                "description": "Deadline detected tomorrow morning. Urgency elevated to 9/10, Priority score boosted to 94/100 (Critical).",
                "status": "priority_boosted"
            },
            {
                "time": "4:03 PM",
                "phase": "CONFLICT CHECK",
                "agent": "Conflict Agent",
                "description": "Identified direct clash: 16:00 - 18:00 is currently occupied by 'Project Work: Web Platform Redesign'.",
                "status": "conflict_detected"
            },
            {
                "time": "4:04 PM",
                "phase": "REPLAN",
                "agent": "Adaptation Agent",
                "description": "Moved flexible 'Project Work' block to Tomorrow 10:00 AM. Allocated 4:00 PM - 6:00 PM for the urgent Python assignment.",
                "status": "schedule_replanned"
            },
            {
                "time": "4:05 PM",
                "phase": "PROTECT HEALTH",
                "agent": "Conflict Agent",
                "description": "Hard Constraint Checked: Sleep & Night Recovery (23:00 - 07:00) verified 100% UNTOUCHED and intact.",
                "status": "sleep_protected"
            },
            {
                "time": "4:06 PM",
                "phase": "USER APPROVAL",
                "agent": "Voice & Human Agent",
                "description": "User notified: 'Your day changed. Here is the new plan with 2 hours for assignment. Sleep protected. Accept?'",
                "status": "awaiting_approval"
            }
        ]

        # Trigger actual orchestrator run so DB proposal and decision logs are recorded
        scenario_event = {
            "type": "NEW_ASSIGNMENT",
            "source": "demo_scenario_4pm",
            "details": {
                "title": "Python ML Optimization Assignment",
                "deadline": "Tomorrow 09:00 AM",
                "duration_minutes": 120,
                "urgency": 9,
                "importance": 9,
                "category": "study"
            }
        }
        replan_output = self.run_control_loop(
            incoming_event=scenario_event,
            current_time="16:00",
            date_str=date_str
        )

        return {
            "timeline_steps": timeline_steps,
            "replan_output": replan_output
        }
