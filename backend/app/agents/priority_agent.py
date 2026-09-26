"""
Priority Agent
Responsibility: Scores urgent vs. important, analyzes deadlines, and computes task priority.
Dynamically elevates priority when unexpected high-urgency inputs/assignments are detected.
"""

from typing import Dict, Any, List

class PriorityAgent:
    def __init__(self):
        self.name = "Priority Agent"

    def calculate_priority_score(self, task: Dict[str, Any]) -> int:
        """
        Calculates a 0-100 priority score based on:
        - Deadline proximity (urgent)
        - Importance rating (1-10)
        - Category weighting (e.g., study assignment > optional reading)
        """
        urgency = task.get("urgency", 5)
        importance = task.get("importance", 5)
        deadline = str(task.get("deadline", "")).lower()

        # Boost for urgent impending deadlines
        deadline_boost = 0
        if "tomorrow" in deadline or "today" in deadline or "asap" in deadline or "hours" in deadline:
            deadline_boost = 35
        elif "urgent" in deadline:
            deadline_boost = 25

        base_score = (urgency * 4) + (importance * 4) + deadline_boost
        return min(100, max(10, base_score))

    def evaluate_incoming_event(self, event: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes an incoming trigger event (e.g., new assignment arriving at 4:00 PM).
        """
        event_type = event.get("type", "unknown")
        details = event.get("details", {})
        title = details.get("title", "Incoming Task")
        deadline = details.get("deadline", "Tomorrow")

        urgency = 9 if ("tomorrow" in str(deadline).lower() or "today" in str(deadline).lower()) else 6
        importance = details.get("importance", 9)
        task_data = {
            "title": title,
            "category": details.get("category", "study"),
            "urgency": urgency,
            "importance": importance,
            "deadline": deadline,
            "duration_minutes": details.get("duration_minutes", 120),
        }
        score = self.calculate_priority_score(task_data)
        task_data["priority_score"] = score

        return {
            "evaluated_task": task_data,
            "priority_score": score,
            "is_critical": score >= 75,
            "rationale": f"High priority detected (Score: {score}/100) due to impending deadline '{deadline}' and high educational value."
        }

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        incoming_event = state.get("incoming_event")
        if incoming_event:
            evaluation = self.evaluate_incoming_event(incoming_event, state)
            state["priority_evaluation"] = evaluation
            state["log"].append({
                "agent": self.name,
                "action": "PRIORITY_ELEVATED" if evaluation["is_critical"] else "PRIORITY_ASSESSED",
                "reasoning": evaluation["rationale"]
            })
        else:
            state["log"].append({
                "agent": self.name,
                "action": "PRIORITY_CHECK_PASSED",
                "reasoning": "Baseline schedule priority ordering is stable."
            })
        return state
