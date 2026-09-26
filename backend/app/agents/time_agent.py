"""
Time Agent
Responsibility: Estimates duration, checks availability, calculates remaining time budget, and identifies available windows.
"""

from typing import Dict, Any, List

def time_to_minutes(time_str: str) -> int:
    try:
        parts = time_str.split(":")
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 0

def minutes_to_time(minutes: int) -> str:
    h = (minutes // 60) % 24
    m = minutes % 60
    return f"{h:02d}:{m:02d}"

class TimeAgent:
    def __init__(self):
        self.name = "Time Agent"

    def estimate_duration(self, title: str, category: str, requested_minutes: int = 0) -> int:
        if requested_minutes > 0:
            return requested_minutes
        title_lower = title.lower()
        if "assignment" in title_lower or "project" in title_lower or "exam" in title_lower:
            return 120 # 2 hours default
        if "review" in title_lower or "reading" in title_lower:
            return 60
        if "workout" in title_lower or "gym" in title_lower:
            return 60
        return 45

    def analyze_availability(self, schedule_blocks: List[Dict[str, Any]], current_time_str: str = "16:00") -> Dict[str, Any]:
        """
        Calculates time usage from current_time_str onwards until midnight.
        """
        curr_min = time_to_minutes(current_time_str)
        upcoming_blocks = []
        occupied_minutes = 0

        for block in sorted(schedule_blocks, key=lambda b: time_to_minutes(b["start_time"])):
            b_start = time_to_minutes(block["start_time"])
            b_end = time_to_minutes(block["end_time"])
            if b_end > curr_min:
                upcoming_blocks.append(block)
                # Overlap with post curr_min window
                effective_start = max(curr_min, b_start)
                occupied_minutes += max(0, b_end - effective_start)

        remaining_in_day = max(0, (24 * 60) - curr_min)
        free_minutes = max(0, remaining_in_day - occupied_minutes)

        return {
            "current_time": current_time_str,
            "remaining_day_minutes": remaining_in_day,
            "occupied_minutes": occupied_minutes,
            "free_minutes": free_minutes,
            "upcoming_block_count": len(upcoming_blocks)
        }

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        current_time = state.get("current_time", "16:00")
        schedule_blocks = state.get("schedule_blocks", [])
        incoming_event = state.get("incoming_event")

        time_analysis = self.analyze_availability(schedule_blocks, current_time)
        state["time_analysis"] = time_analysis

        if incoming_event:
            details = incoming_event.get("details", {})
            required_dur = self.estimate_duration(
                details.get("title", ""),
                details.get("category", "study"),
                details.get("duration_minutes", 120)
            )
            state["estimated_duration_minutes"] = required_dur
            state["log"].append({
                "agent": self.name,
                "action": "DURATION_ESTIMATED_AND_AVAILABILITY_CHECKED",
                "reasoning": f"Incoming commitment requires {required_dur} mins ({required_dur/60:.1f} hrs). Available free unallocated time post-{current_time}: {time_analysis['free_minutes']} mins."
            })
        else:
            state["log"].append({
                "agent": self.name,
                "action": "TIME_BUDGET_VERIFIED",
                "reasoning": f"Day capacity monitored. {time_analysis['free_minutes']} unallocated minutes remaining."
            })

        return state
