from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UserProfile(BaseModel):
    id: str = "user-1"
    name: str = "Sathish"
    email: Optional[str] = "sathish@example.com"
    sleep_start: str = "23:00"
    sleep_end: str = "07:00"
    wake_support_person: Optional[str] = "Mom"
    local_encryption_enabled: bool = True
    cloud_sync_enabled: bool = False

class TaskItem(BaseModel):
    id: Optional[str] = None
    title: str
    category: str = "study"  # study, work, health, routine, break
    priority_score: Optional[int] = 50
    urgency: Optional[int] = 5
    importance: Optional[int] = 5
    duration_minutes: int = 60
    deadline: Optional[str] = None  # e.g., "Tomorrow 09:00 AM" or ISO
    status: str = "pending"
    notes: Optional[str] = None

class ScheduleBlock(BaseModel):
    id: str
    task_id: Optional[str] = None
    title: str
    category: str  # study, work, sleep, break, health, routine
    start_time: str  # HH:MM
    end_time: str    # HH:MM
    date: str        # YYYY-MM-DD
    is_fixed: bool = False
    is_sleep: bool = False
    status: str = "scheduled" # scheduled, in_progress, completed, moved
    color: Optional[str] = None

class TrustedPermission(BaseModel):
    id: Optional[str] = None
    person_id: Optional[str] = None
    permission_key: str
    permission_label: str
    is_enabled: bool = False

class TrustedPersonCreate(BaseModel):
    name: str
    relationship: str
    phone: Optional[str] = None
    avatar_color: Optional[str] = "#7c6cff"
    voice_reminder_text: Optional[str] = None
    permissions: List[Dict[str, Any]] = []

class TrustedPerson(BaseModel):
    id: str
    name: str
    relationship: str
    phone: Optional[str] = None
    avatar_color: str = "#7c6cff"
    voice_reminder_text: Optional[str] = None
    voice_audio_sample: Optional[str] = None
    permissions: List[TrustedPermission] = []

class AgentDecisionLogItem(BaseModel):
    id: str
    session_id: str
    agent_name: str
    step_index: int
    action: str
    reasoning: str
    state_diff: Optional[str] = None
    timestamp: str

class ReplanProposal(BaseModel):
    id: str
    session_id: str
    trigger_event: str
    reason: str
    before_blocks: List[ScheduleBlock]
    proposed_blocks: List[ScheduleBlock]
    diff_summary: List[str]
    status: str = "pending" # pending, accepted, rejected
    created_at: str

class VoiceCommandRequest(BaseModel):
    transcript: str
    sender: Optional[str] = "User"

class DemoScenarioStep(BaseModel):
    time: str
    phase: str
    agent: str
    description: str
    action_type: str
    blocks_preview: Optional[List[ScheduleBlock]] = None
    notification: Optional[str] = None
