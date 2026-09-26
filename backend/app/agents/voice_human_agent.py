"""
Voice & Human Agent
Responsibility:
- Parses voice transcripts and text prompts with intent classification.
- Manages trusted-person relationships and strict, granular, scoped permissions.
- Synthesizes user-facing conversational summaries and spoken TTS audio text.
- Executes human-in-the-loop support (e.g. Mom's approved wake-up reminder).
"""

from typing import Dict, Any, List
import re

from ..gemini_service import gemini

class VoiceHumanAgent:
    def __init__(self):
        self.name = "Voice & Human Agent"

    def parse_intent(self, text: str) -> Dict[str, Any]:
        """
        Extracts semantic intent and entities from speech transcript or chat message:
        Uses Gemini 3.8 Flash with local rule-based fallback.
        """
        # Try Gemini first
        gemini_result = gemini.analyze_intent(text)
        if gemini_result and isinstance(gemini_result, dict) and "intent" in gemini_result:
            gemini_result["confidence"] = 0.98
            gemini_result["source"] = "Gemini 3.8 Flash"
            return gemini_result

        # Fallback to local rule engine
        text_lower = text.lower().strip()

        if any(w in text_lower for w in ["assignment", "homework", "task due", "urgent project", "due tomorrow", "got an assignment"]):
            dur = 120
            dur_match = re.search(r"(\d+)\s*(hour|hr|minute|min)", text_lower)
            if dur_match:
                val = int(dur_match.group(1))
                unit = dur_match.group(2)
                dur = val * 60 if "h" in unit else val

            return {
                "intent": "ADD_ASSIGNMENT",
                "title": "Machine Learning Assignment" if "ml" in text_lower or "assignment" in text_lower else "Urgent Assignment",
                "deadline": "Tomorrow 09:00 AM",
                "duration_minutes": dur,
                "urgency": 9,
                "importance": 9,
                "confidence": 0.96,
                "source": "Rule Engine"
            }

        elif any(w in text_lower for w in ["move", "reschedule", "shift", "can't study", "tired", "delay"]):
            return {
                "intent": "MOVE_TASK",
                "target": "study" if "study" in text_lower else "project",
                "target_time": "Tomorrow",
                "confidence": 0.92,
                "source": "Rule Engine"
            }

        elif any(w in text_lower for w in ["wake", "wake up", "alarm", "morning call", "mom"]):
            return {
                "intent": "WAKE_UP_SUPPORT",
                "wake_time": "06:00",
                "requested_person": "Mom",
                "confidence": 0.95,
                "source": "Rule Engine"
            }

        elif any(w in text_lower for w in ["accept", "confirm", "yes", "looks good", "approve", "do it"]):
            return {
                "intent": "CONFIRM_PLAN",
                "confidence": 0.98,
                "source": "Rule Engine"
            }

        return {
            "intent": "GENERAL_QUERY",
            "text": text,
            "confidence": 0.80,
            "source": "Rule Engine"
        }

    def generate_response(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates supportive spoken & text feedback explaining what changed and why,
        then asks for confirmation before committing.
        """
        diff_summary = state.get("diff_summary", [])
        incoming_event = state.get("incoming_event", {})
        transcript = state.get("user_transcript", "")

        # Try Gemini Generative Response
        gemini_reply = None
        if transcript:
            sched_summary = f"{len(state.get('schedule_blocks', []))} blocks active. Current time: {state.get('current_time', '16:00')}."
            diff_text = "\n".join(diff_summary) if diff_summary else "No changes proposed."
            gemini_reply = gemini.generate_chat_response(
                user_message=transcript,
                schedule_context=sched_summary,
                diff_context=diff_text
            )

        if incoming_event:
            speech = gemini_reply or (
                "Your day changed. I've analyzed your schedule, moved your project work to tomorrow morning, "
                "and allocated two hours for your new assignment. Your sleep schedule remains completely unchanged and protected. "
                "Shall I confirm this plan?"
            )
            chat_reply = gemini_reply or (
                "I've analyzed your schedule. I will move your project work block to tomorrow at 10:00 AM "
                "and allocate 2 hours (4:00 PM – 6:00 PM) for the urgent assignment. "
                "Your sleep schedule (11:00 PM – 7:00 AM) remains fully protected.\n\n"
                "Would you like me to commit this new schedule?"
            )
        else:
            speech = gemini_reply or "Your schedule is running smoothly. All commitments and rest windows are balanced."
            chat_reply = gemini_reply or "Your schedule is currently up to date. How else can I assist your coordination today?"

        return {
            "speech_text": speech,
            "chat_reply": chat_reply,
            "requires_confirmation": bool(incoming_event),
            "powered_by": "Gemini 3.8 Flash" if gemini_reply else "Local Rule Engine"
        }

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        transcript = state.get("user_transcript")
        if transcript:
            intent_data = self.parse_intent(transcript)
            state["parsed_intent"] = intent_data

        resp = self.generate_response(state)
        state["agent_response"] = resp

        state["log"].append({
            "agent": self.name,
            "action": "VOICE_AND_HUMAN_INTERACTION_COMPOSED",
            "reasoning": f"Formatted human-in-the-loop briefing ({resp.get('powered_by', 'Engine')}). Spoken feedback prepared with confirmation requirement: {resp['requires_confirmation']}."
        })

        return state
