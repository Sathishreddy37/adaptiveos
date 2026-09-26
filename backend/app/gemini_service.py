"""
Gemini Service for AdaptiveOS
Connects to Google Gemini API (gemini-3.8-flash) for generative AI reasoning,
intent extraction, voice replies, and contextual plan explanations.
Includes robust fallback if the network or API is temporarily unreachable.
"""

import os
import json
import httpx
from typing import Optional, Dict, Any

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.8-flash")
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.startswith("AQ."))

    def generate_chat_response(
        self,
        user_message: str,
        schedule_context: str,
        diff_context: Optional[str] = None
    ) -> Optional[str]:
        """
        Uses Gemini to generate an empathetic, concise response explaining schedule changes
        and asking for confirmation.
        """
        if not self.is_configured():
            return None

        prompt = f"""
You are AdaptiveOS, an agentic personal-life coordinator AI.
A person's day changes constantly. Your job is not just to be a calendar, but an adaptive control system that protects rest, resolves conflicts, and keeps their human support network in the loop.

CURRENT SCHEDULE CONTEXT:
{schedule_context}

SCHEDULE ADJUSTMENT / DIFF:
{diff_context or 'No changes proposed.'}

USER MESSAGE:
"{user_message}"

INSTRUCTIONS:
1. Respond in 2-3 friendly, concise sentences.
2. Acknowledge what changed in their schedule (or explain what you did).
3. Reassure them that their sleep recovery window (23:00 - 07:00) is strictly protected.
4. If a replan was proposed, ask clearly for their confirmation ("Shall I commit this plan?").
5. Do not use markdown headers or bullet points; keep it conversational for text-to-speech.
"""

        try:
            url = f"{GEMINI_ENDPOINT}?key={self.api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 300,
                }
            }

            with httpx.Client(timeout=15.0) as client:
                res = client.post(url, headers={"Content-Type": "application/json"}, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    parts = data.get("candidates", [])[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
        except Exception as e:
            print(f"[GeminiService] Fallback to deterministic agent reply: {e}")

        return None

    def analyze_intent(self, transcript: str) -> Optional[Dict[str, Any]]:
        """
        Uses Gemini to extract structured task intents (e.g. title, category, duration, urgency, deadline).
        """
        if not self.is_configured():
            return None

        prompt = f"""
You are the Voice Intent Parser for AdaptiveOS.
Analyze the user utterance: "{transcript}"

Extract in JSON format:
{{
  "intent": "ADD_ASSIGNMENT" | "MOVE_TASK" | "WAKE_UP_SUPPORT" | "STATUS_QUERY" | "GENERAL_QUERY",
  "title": "Clean concise task name",
  "duration_minutes": integer (default 120 for assignments/projects, 60 for study),
  "urgency": integer 1-10,
  "importance": integer 1-10,
  "deadline": "e.g. Tomorrow 09:00 AM",
  "category": "study" | "work" | "health" | "routine" | "break"
}}

Respond ONLY with valid JSON. No backticks, no markdown.
"""
        try:
            url = f"{GEMINI_ENDPOINT}?key={self.api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.1, "maxOutputTokens": 200}
            }
            with httpx.Client(timeout=12.0) as client:
                res = client.post(url, headers={"Content-Type": "application/json"}, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data.get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "").strip()
                    # Strip possible backticks
                    raw_text = raw_text.replace("```json", "").replace("```", "").strip()
                    return json.loads(raw_text)
        except Exception as e:
            print(f"[GeminiService] Intent parse fallback: {e}")

        return None

# Singleton instance
gemini = GeminiService()
