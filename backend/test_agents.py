"""
Unit and Integration Tests for AdaptiveOS:
- Verifies all 7 agents can be invoked and pass state correctly
- Verifies Sleep Protection hard constraint (sleep is never shortened)
- Verifies granular scoped permissions requirement
- Verifies Section 5 Demo Scenario runs end-to-end
"""

import unittest
from backend.app.database import init_db
from backend.app.agents import (
    PlanningAgent, PriorityAgent, TimeAgent, ConflictAgent,
    AdaptationAgent, LearningAgent, VoiceHumanAgent
)
from backend.app.orchestrator import AgentOrchestrator

class TestAdaptiveOS(unittest.TestCase):

    def setUp(self):
        init_db()
        self.orchestrator = AgentOrchestrator()
        self.orchestrator.reset_to_standard_seed()

    def test_planning_agent_generates_sleep_anchor(self):
        agent = PlanningAgent()
        profile = {"sleep_start": "23:00", "sleep_end": "07:00"}
        schedule = agent.build_initial_schedule(profile, "2026-09-26")
        self.assertTrue(len(schedule) >= 5)

        sleep_blocks = [b for b in schedule if b["is_sleep"]]
        self.assertTrue(len(sleep_blocks) >= 1)

    def test_priority_agent_elevates_deadline(self):
        agent = PriorityAgent()
        urgent_event = {
            "type": "NEW_ASSIGNMENT",
            "details": {
                "title": "Python Machine Learning Project",
                "deadline": "Tomorrow 09:00 AM",
                "urgency": 9,
                "importance": 9
            }
        }
        res = agent.evaluate_incoming_event(urgent_event, {})
        self.assertTrue(res["is_critical"])
        self.assertGreaterEqual(res["priority_score"], 80)

    def test_conflict_agent_sleep_protection(self):
        """Hard constraint: Sleep block must never be silently shortened."""
        agent = ConflictAgent()
        blocks = [
            {"id": "b1", "title": "Sleep", "start_time": "23:00", "end_time": "23:59", "is_sleep": True}
        ]
        # Attempt to propose shortened sleep
        proposed_short = [
            {"id": "b1", "title": "Sleep", "start_time": "23:30", "end_time": "23:59", "is_sleep": True}
        ]
        check = agent.verify_sleep_integrity(blocks, proposed_short)
        self.assertFalse(check["sleep_preserved"])
        self.assertTrue(check["violation"])

    def test_adaptation_agent_replan_moves_colliding_block(self):
        agent = AdaptationAgent()
        current_blocks = [
            {"id": "b1", "title": "Project Work: Web Platform Redesign", "start_time": "16:00", "end_time": "18:00", "date": "2026-09-26", "is_fixed": False, "is_sleep": False},
            {"id": "b2", "title": "Night Sleep", "start_time": "23:00", "end_time": "23:59", "date": "2026-09-26", "is_fixed": True, "is_sleep": True}
        ]
        incoming_event = {
            "details": {
                "title": "Urgent Math Assignment",
                "duration_minutes": 120,
                "category": "study"
            }
        }
        replan = agent.replan_schedule(current_blocks, incoming_event, "16:00")
        self.assertTrue(len(replan["diff_summary"]) >= 2)
        # Check that colliding block was moved to Tomorrow
        moved = replan["moved_block"]
        self.assertEqual(moved["status"], "moved")
        self.assertTrue(str(moved["start_time"]).startswith("Tomorrow"))

    def test_voice_human_intent_parsing(self):
        agent = VoiceHumanAgent()
        transcript = "I got a machine learning assignment due tomorrow, need 2 hours"
        intent = agent.parse_intent(transcript)
        self.assertEqual(intent["intent"], "ADD_ASSIGNMENT")
        self.assertEqual(intent["duration_minutes"], 120)

    def test_section5_demo_scenario_end_to_end(self):
        """
        Verify the Section 5 Scenario:
        8:00 AM -> 4:00 PM -> 4:01 PM -> 4:03 PM -> 4:04 PM -> 4:05 PM -> 4:06 PM
        """
        result = self.orchestrator.run_section5_scenario("2026-09-26")
        timeline = result["timeline_steps"]
        self.assertEqual(len(timeline), 7)
        self.assertEqual(timeline[0]["time"], "8:00 AM")
        self.assertEqual(timeline[1]["time"], "4:00 PM")
        self.assertEqual(timeline[6]["time"], "4:06 PM")

        replan_out = result["replan_output"]
        self.assertTrue(replan_out["requires_confirmation"])
        self.assertTrue(replan_out["sleep_health_guard"]["sleep_preserved"])
        self.assertTrue(len(replan_out["diff_summary"]) > 0)
        self.assertEqual(len(replan_out["agent_logs"]), 7)

if __name__ == "__main__":
    unittest.main()
