import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "adaptiveos.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # User profile
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        sleep_start TEXT DEFAULT '23:00',
        sleep_end TEXT DEFAULT '07:00',
        wake_support_person TEXT,
        local_encryption_enabled INTEGER DEFAULT 1,
        cloud_sync_enabled INTEGER DEFAULT 0,
        created_at TEXT
    )
    """)

    # Tasks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        priority_score INTEGER DEFAULT 50,
        urgency INTEGER DEFAULT 5,
        importance INTEGER DEFAULT 5,
        duration_minutes INTEGER DEFAULT 60,
        deadline TEXT,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at TEXT
    )
    """)

    # Schedule Blocks (active schedule)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS schedule_blocks (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        title TEXT NOT NULL,
        category TEXT NOT NULL, -- study, work, sleep, break, health, routine
        start_time TEXT NOT NULL, -- HH:MM
        end_time TEXT NOT NULL,   -- HH:MM
        date TEXT NOT NULL,       -- YYYY-MM-DD
        is_fixed INTEGER DEFAULT 0,
        is_sleep INTEGER DEFAULT 0,
        status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, moved
        color TEXT,
        created_at TEXT
    )
    """)

    # Trusted People
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trusted_people (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        relationship TEXT NOT NULL, -- Mom, Dad, Mentor, Teacher, Teammate
        avatar_color TEXT DEFAULT '#7c6cff',
        phone TEXT,
        voice_reminder_text TEXT,
        voice_audio_sample TEXT,
        created_at TEXT
    )
    """)

    # Scoped Permissions (Explicit only, no select-all)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trusted_permissions (
        id TEXT PRIMARY KEY,
        person_id TEXT NOT NULL,
        permission_key TEXT NOT NULL, -- wake_up_support, evening_checkin, study_accountability, emergency_only, missed_task_alert
        permission_label TEXT NOT NULL,
        is_enabled INTEGER DEFAULT 0,
        updated_at TEXT,
        FOREIGN KEY (person_id) REFERENCES trusted_people(id) ON DELETE CASCADE
    )
    """)

    # Agent Decision Log (7 agents audit trail)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS decision_logs (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        step_index INTEGER NOT NULL,
        action TEXT NOT NULL,
        reasoning TEXT NOT NULL,
        state_diff TEXT,
        timestamp TEXT NOT NULL
    )
    """)

    # Replan Proposals (pending user approval with human-readable diff)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS replan_proposals (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        trigger_event TEXT NOT NULL,
        reason TEXT NOT NULL,
        before_blocks TEXT NOT NULL,
        proposed_blocks TEXT NOT NULL,
        diff_summary TEXT NOT NULL,
        status TEXT DEFAULT 'pending', -- pending, accepted, rejected
        created_at TEXT NOT NULL
    )
    """)

    # Alarms / Mom Clock Timings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alarms (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        time TEXT NOT NULL,
        days TEXT DEFAULT 'Everyday',
        category TEXT DEFAULT 'wake_up',
        is_active INTEGER DEFAULT 1,
        voice_prompt TEXT,
        persona TEXT DEFAULT 'student',
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized at", DB_PATH)
