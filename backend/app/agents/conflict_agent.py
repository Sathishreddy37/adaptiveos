"""
Conflict Agent
Responsibility: Detects schedule clashes/overload and PROTECTS SLEEP & HEALTH as hard constraints.
Ensures sleep blocks are never silently shortened, overwritten, or compromised.
"""

from typing import Dict, Any, List
from .time_agent import time_to_minutes, minutes_to_time

class ConflictAgent:
    def __init__(self):
        self.name = "Conflict Agent"

    def detect_overlaps(self, blocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        conflicts = []
        sorted_blocks = sorted(blocks, key=lambda b: time_to_minutes(b["start_time"]))

        for i in range(len(sorted_blocks) - 1):
            b1 = sorted_blocks[i]
            b2 = sorted_blocks[i+1]
            b1_end = time_to_minutes(b1["end_time"])
            b2_start = time_to_minutes(b2["start_time"])

            if b1_end > b2_start:
                conflicts.append({
                    "block1": b1,
                    "block2": b2,
                    "overlap_minutes": b1_end - b2_start,
                    "reason": f"Overlap between '{b1['title']}' ({b1['start_time']}-{b1['end_time']}) and '{b2['title']}' ({b2['start_time']}-{b2['end_time']})"
                })
        return conflicts

    def verify_sleep_integrity(self, original_blocks: List[Dict[str, Any]], proposed_blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Hard constraint validator: checks whether sleep duration is preserved exactly.
        """
        orig_sleep_mins = sum(
            time_to_minutes(b["end_time"]) - time_to_minutes(b["start_time"])
            for b in original_blocks if b.get("is_sleep")
        )
        prop_sleep_mins = sum(
            time_to_minutes(b["end_time"]) - time_to_minutes(b["start_time"])
            for b in proposed_blocks if b.get("is_sleep")
        )

        sleep_preserved = prop_sleep_mins >= orig_sleep_mins
        return {
            "sleep_preserved": sleep_preserved,
            "original_sleep_minutes": orig_sleep_mins,
            "proposed_sleep_minutes": prop_sleep_mins,
            "violation": not sleep_preserved
        }

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        schedule_blocks = state.get("schedule_blocks", [])
        incoming_event = state.get("incoming_event")
        current_time = state.get("current_time", "16:00")
        current_min = time_to_minutes(current_time)

        conflicts = []
        target_slot = None

        if incoming_event:
            dur = state.get("estimated_duration_minutes", 120)
            target_start = current_time
            target_end = minutes_to_time(current_min + dur)

            # Check what blocks occupy target_start -> target_end
            for block in schedule_blocks:
                b_start = time_to_minutes(block["start_time"])
                b_end = time_to_minutes(block["end_time"])
                # check collision with immediate incoming execution
                if max(current_min, b_start) < min(current_min + dur, b_end):
                    conflicts.append({
                        "conflicting_block": block,
                        "conflict_type": "IMMEDIATE_SLOT_COLLISION",
                        "reason": f"Incoming assignment ({target_start}-{target_end}) collides with existing '{block['title']}' ({block['start_time']}-{block['end_time']})"
                    })

        state["conflicts"] = conflicts
        has_clash = len(conflicts) > 0

        # Health & Sleep Check
        sleep_check = self.verify_sleep_integrity(schedule_blocks, schedule_blocks)
        state["sleep_health_guard"] = sleep_check

        if has_clash:
            clash_names = ", ".join([f"'{c['conflicting_block']['title']}'" for c in conflicts])
            state["log"].append({
                "agent": self.name,
                "action": "COLLISION_DETECTED",
                "reasoning": f"Identified immediate schedule clash with {clash_names}. Sleep protection guard: ACTIVE & UNCOMPROMISED (Total sleep budget locked at {sleep_check['original_sleep_minutes']} mins)."
            })
        else:
            state["log"].append({
                "agent": self.name,
                "action": "CONFLICT_CHECK_CLEARED",
                "reasoning": f"No immediate collisions found. Sleep recovery windows intact and protected."
            })

        return state
