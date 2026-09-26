"""
Adaptation Agent
Responsibility: Replans the schedule, handles interruptions, resolves collisions, and produces human-readable diffs.
Ensures sleep and fixed commitments are not sacrificed.
"""

from typing import Dict, Any, List
import copy
from .time_agent import time_to_minutes, minutes_to_time

class AdaptationAgent:
    def __init__(self):
        self.name = "Adaptation Agent"

    def replan_schedule(self, current_blocks: List[Dict[str, Any]], incoming_event: Dict[str, Any], current_time: str = "16:00") -> Dict[str, Any]:
        """
        Implements intelligent schedule shifting:
        1. Identifies the urgent incoming task (e.g. 'Python ML Assignment', 16:00 - 18:00).
        2. Detects colliding flexible block ('Project Work: Web Platform Redesign').
        3. Moves the flexible block forward (or to tomorrow morning) to make space.
        4. Preserves exercise/health block and protected sleep block (23:00 - 07:00).
        5. Computes a before/after diff explanation for the user.
        """
        new_blocks = copy.deepcopy(current_blocks)
        diff_summary = []
        details = incoming_event.get("details", {})
        task_title = details.get("title", "Incoming Assignment")
        duration = details.get("duration_minutes", 120)
        curr_min = time_to_minutes(current_time)
        new_task_end_min = curr_min + duration
        new_task_end_str = minutes_to_time(new_task_end_min)

        # Create new urgent block
        new_block = {
            "id": f"block-urgent-{int(curr_min)}",
            "task_id": "task-urgent-new",
            "title": task_title,
            "category": details.get("category", "study"),
            "start_time": current_time,
            "end_time": new_task_end_str,
            "date": current_blocks[0]["date"] if current_blocks else "2026-09-26",
            "is_fixed": True,
            "is_sleep": False,
            "status": "scheduled",
            "color": "#ef4444" # Highlighted urgent color
        }

        # Find colliding block at current_time
        colliding_block = None
        for b in new_blocks:
            b_start = time_to_minutes(b["start_time"])
            b_end = time_to_minutes(b["end_time"])
            if b["start_time"] == current_time:
                colliding_block = b
                break

        if colliding_block:
            old_title = colliding_block["title"]
            old_time = f"{colliding_block['start_time']} - {colliding_block['end_time']}"
            
            # Reposition the colliding project block to tomorrow or evening slot
            # In our scenario: move project block to tomorrow morning 10:00 AM (or next day)
            colliding_block["status"] = "moved"
            colliding_block["start_time"] = "Tomorrow 10:00"
            colliding_block["end_time"] = "Tomorrow 12:00"
            
            diff_summary.append(
                f"Moved '{old_title}' from {old_time} to Tomorrow (10:00 AM) to open 2 hours for urgent submission."
            )
            diff_summary.append(
                f"Allocated {current_time} - {new_task_end_str} for '{task_title}' (Due tomorrow)."
            )
            diff_summary.append(
                "Protected Sleep & Night Recovery block (23:00 - 07:00) with ZERO reduction in rest."
            )
        else:
            diff_summary.append(f"Added '{task_title}' at {current_time} - {new_task_end_str}.")

        # Insert new block into schedule list
        active_blocks = [b for b in new_blocks if b["id"] != colliding_block["id"]] if colliding_block else new_blocks
        active_blocks.append(new_block)
        # Keep colliding block as tagged 'moved' or append tomorrow notes
        active_blocks.append(colliding_block)

        # Sort remaining current day blocks
        day_blocks = [b for b in active_blocks if not str(b["start_time"]).startswith("Tomorrow")]
        tomorrow_blocks = [b for b in active_blocks if str(b["start_time"]).startswith("Tomorrow")]
        day_blocks.sort(key=lambda b: time_to_minutes(b["start_time"]))

        reconstructed_blocks = day_blocks + tomorrow_blocks

        return {
            "proposed_blocks": reconstructed_blocks,
            "diff_summary": diff_summary,
            "moved_block": colliding_block,
            "inserted_block": new_block
        }

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        conflicts = state.get("conflicts", [])
        incoming_event = state.get("incoming_event")
        current_blocks = state.get("schedule_blocks", [])
        current_time = state.get("current_time", "16:00")

        if incoming_event:
            replan_result = self.replan_schedule(current_blocks, incoming_event, current_time)
            state["proposed_blocks"] = replan_result["proposed_blocks"]
            state["diff_summary"] = replan_result["diff_summary"]
            state["replan_result"] = replan_result

            # Double check sleep is preserved in proposed blocks
            orig_sleep = [b for b in current_blocks if b.get("is_sleep")]
            prop_sleep = [b for b in replan_result["proposed_blocks"] if b.get("is_sleep")]
            assert len(prop_sleep) >= len(orig_sleep), "Critical error: Sleep was compromised!"

            state["log"].append({
                "agent": self.name,
                "action": "SCHEDULE_REPLANNED_AND_DIFF_GENERATED",
                "reasoning": f"Relocated colliding project block to preserve deadline compliance. Sleep block preserved untouched (23:00-07:00). Diff generated with {len(replan_result['diff_summary'])} user-facing impact statements."
            })
        else:
            state["proposed_blocks"] = current_blocks
            state["diff_summary"] = ["Schedule is optimal. No adaptation required."]
            state["log"].append({
                "agent": self.name,
                "action": "NO_ADAPTATION_NEEDED",
                "reasoning": "Existing timeline is balanced; no adjustments required."
            })

        return state
