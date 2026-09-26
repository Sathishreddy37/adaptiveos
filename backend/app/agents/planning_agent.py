"""
Planning Agent
Responsibility: Builds the initial schedule from goals, preferences, and fixed commitments.
Maps out the foundational slots of the day (sleep, morning routine, fixed meetings, deep work).
"""

from typing import List, Dict, Any
from datetime import datetime

class PlanningAgent:
    def __init__(self):
        self.name = "Planning Agent"

    def build_initial_schedule(self, user_profile: Dict[str, Any], date_str: str) -> List[Dict[str, Any]]:
        """
        Generates standard foundational blocks for a user's day:
        - Sleep block (non-negotiable protected anchor)
        - Morning routine
        - Core focus work
        - Afternoon project session
        - Evening wind-down
        """
        sleep_start = user_profile.get("sleep_start", "23:00")
        sleep_end = user_profile.get("sleep_end", "07:00")

        base_blocks = [
            {
                "id": f"block-sleep-prev-{date_str}",
                "task_id": None,
                "title": "Sleep & Recovery (Protected)",
                "category": "sleep",
                "start_time": "00:00",
                "end_time": sleep_end,
                "date": date_str,
                "is_fixed": True,
                "is_sleep": True,
                "status": "completed" if "08:00" > sleep_end else "scheduled",
                "color": "#6366f1"
            },
            {
                "id": f"block-morning-routine-{date_str}",
                "task_id": None,
                "title": "Morning Routine & Breakfast",
                "category": "routine",
                "start_time": sleep_end,
                "end_time": "08:00",
                "date": date_str,
                "is_fixed": False,
                "is_sleep": False,
                "status": "completed",
                "color": "#10b981"
            },
            {
                "id": f"block-focus-morning-{date_str}",
                "task_id": "task-core-study",
                "title": "Deep Focus: Systems Architecture",
                "category": "study",
                "start_time": "09:00",
                "end_time": "12:00",
                "date": date_str,
                "is_fixed": False,
                "is_sleep": False,
                "status": "completed",
                "color": "#7c6cff"
            },
            {
                "id": f"block-lunch-{date_str}",
                "task_id": None,
                "title": "Lunch & Mindful Walk",
                "category": "break",
                "start_time": "12:00",
                "end_time": "13:30",
                "date": date_str,
                "is_fixed": False,
                "is_sleep": False,
                "status": "completed",
                "color": "#14b8a6"
            },
            {
                "id": f"block-work-team-{date_str}",
                "task_id": "task-team-sync",
                "title": "Engineering Team Standup & Sync",
                "category": "work",
                "start_time": "14:00",
                "end_time": "15:30",
                "date": date_str,
                "is_fixed": True,
                "is_sleep": False,
                "status": "completed",
                "color": "#f59e0b"
            },
            {
                "id": f"block-project-afternoon-{date_str}",
                "task_id": "task-project-work",
                "title": "Project Work: Web Platform Redesign",
                "category": "work",
                "start_time": "16:00",
                "end_time": "18:00",
                "date": date_str,
                "is_fixed": False,
                "is_sleep": False,
                "status": "scheduled",
                "color": "#3b82f6"
            },
            {
                "id": f"block-exercise-{date_str}",
                "task_id": None,
                "title": "Gym / Cardiovascular Fitness",
                "category": "health",
                "start_time": "18:30",
                "end_time": "19:30",
                "date": date_str,
                "is_fixed": False,
                "is_sleep": False,
                "status": "scheduled",
                "color": "#ec4899"
            },
            {
                "id": f"block-dinner-{date_str}",
                "task_id": None,
                "title": "Dinner & Family Time",
                "category": "routine",
                "start_time": "19:30",
                "end_time": "20:30",
                "date": date_str,
                "is_fixed": False,
                "is_sleep": False,
                "status": "scheduled",
                "color": "#10b981"
            },
            {
                "id": f"block-evening-reading-{date_str}",
                "task_id": "task-light-reading",
                "title": "Review & Light Reading",
                "category": "study",
                "start_time": "21:00",
                "end_time": "22:00",
                "date": date_str,
                "is_fixed": False,
                "is_sleep": False,
                "status": "scheduled",
                "color": "#8b5cf6"
            },
            {
                "id": f"block-sleep-night-{date_str}",
                "task_id": None,
                "title": "Sleep & Night Recovery (Protected)",
                "category": "sleep",
                "start_time": sleep_start,
                "end_time": "23:59",
                "date": date_str,
                "is_fixed": True,
                "is_sleep": True,
                "status": "scheduled",
                "color": "#6366f1"
            }
        ]
        return base_blocks

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Receives current state and produces planned task blocks.
        """
        user_profile = state.get("user_profile", {})
        date_str = state.get("date", datetime.now().strftime("%Y-%m-%d"))
        schedule = state.get("schedule_blocks", [])

        if not schedule:
            schedule = self.build_initial_schedule(user_profile, date_str)
            state["schedule_blocks"] = schedule
            state["log"].append({
                "agent": self.name,
                "action": "INITIAL_SCHEDULE_BUILT",
                "reasoning": f"Synthesized foundational day template with protected sleep [{user_profile.get('sleep_start','23:00')}-{user_profile.get('sleep_end','07:00')}]."
            })
        else:
            state["log"].append({
                "agent": self.name,
                "action": "SCHEDULE_OBSERVED",
                "reasoning": f"Current schedule active with {len(schedule)} registered blocks."
            })
        return state
