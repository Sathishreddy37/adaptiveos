# AdaptiveOS — AI-Powered Personal Life Coordination System

> **“Your life changes. Your plan should too.”**
> *AI coordinates. People support. You stay in control.*

AdaptiveOS is not a static calendar, alarm clock, or generic productivity dashboard. It is an **agentic personal life coordination system** that understands user goals, routines, priorities, deadlines, sleep, and commitments across diverse life stages. It creates initial schedules, detects interruptions, and dynamically replans the day while guarding sleep and core commitments.

---

## 🌟 Key Highlights & Hackathon Innovations

### 1. Multi-Persona Support
AdaptiveOS is customized for all walks of life:
- 🎓 **Student (Sathish)**: Final-year student balancing classes, Python & AI ML engineering projects, and exam deadlines.
- 💼 **Job / Working Professional (Priya)**: Tech lead managing sprint reviews, team 1-on-1s, deep focus blocks, and family dinner boundaries.
- 🌸 **Mother / Homemaker (Lakshmi)**: Orchestrating household harmony, morning kitchen prep, kids school routines, personal yoga/wellness, and evening dinner.
- 👴 **Older Grandfather / Senior Elder (Ramakrishna)**: Garden strolls, prayers, vital morning BP & evening diabetes medication reminders (via Mom Clock), and afternoon rest.
- ⚽ **Kid / Junior (Aarav)**: School bus timings, football practice, homework fun, screen time limits (30 mins), and bedtime story routines.

### 2. Living 3D Guide (First-Page Requirement Intake)
- Stylized, cartoon-style warm Indian mother character (approx. 50–60 years old) built with **Three.js WebGL**.
- Expressive procedural animation states: **idle breathing, eye blinking, speech lip-sync, head tilts, Namaste / greeting, wake-up entrance, and celebration**.
- Interactive step-by-step requirement intake on the first page: persona selection, daily rhythm, goals, and inviolable protected constraints.

### 3. Mom Clock & Intelligent Alarms
- Real-time animated analog and digital clock.
- Categorized scheduled alarms for Wake-Up, Critical Medications, Focus Sprints, Kids School Bus, and Bedtime.
- **Wake-Up & Alarm Mode**:
  - Screen softly dims into ambient morning lighting.
  - 3D Mother walks into view with warm posture and speaks using an approved consented voice profile.
  - Interactive choices:
    - **"I'm Up"**: Warm encouragement, transitions to next activity.
    - **"5 More Minutes"**: Evaluates schedule conflicts live: *"You have 45 minutes before your next fixed commitment. 5 extra minutes is safe, but your focus block will be reduced by 5 minutes. Sleep schedule protected."*
    - **"Skip Today"**: Reorganizes remaining priorities safely.

### 4. Continuous Multi-Agent Control Loop
Operates through a continuous loop:
$$\text{PLAN} \longrightarrow \text{EXECUTE} \longrightarrow \text{OBSERVE} \longrightarrow \text{DETECT} \longrightarrow \text{REASON} \longrightarrow \text{REPLAN} \longrightarrow \text{CONFIRM} \longrightarrow \text{LEARN}$$

- **Planning Agent**: Synthesizes base schedule from user rhythms and goals.
- **Priority Agent**: Weighs urgency, importance, and deadlines (< 24h impact).
- **Time Agent**: Estimates duration and learns historical estimation drift.
- **Conflict Agent**: Mathematical collision detection; strictly locks sleep windows.
- **Adaptation Agent**: Generates alternative plans when interruptions arrive.
- **Learning Agent**: Continuously personalizes based on completion history.
- **Voice & Human Agent**: Handles consented voice prompts and scoped trusted-person escalation.

### 5. Privacy by Design & Scoped Human Support
- **“Privacy by design. You control your data.”**
- Local-first encrypted storage with SQLite.
- Trusted people (Mom, Dad, Mentor, Doctor, Teacher) added with **granular, explicit permissions only** (e.g. Wake-up voice support, Missed-task alerts, zero access to private notes or location).
- Approved consented voice profiles rather than unauthorized cloning.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React Icons.
- **3D Graphics**: Three.js WebGL procedural avatar & 3D agent network.
- **Backend**: Python FastAPI, Uvicorn.
- **Database**: SQLite (local-first, fully auditable decision logs).
- **Audio & Speech**: Web Speech Synthesis API with warm mother profile + consented voice scripts.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 1. Backend Setup
```bash
cd backend
pip install fastapi uvicorn pydantic
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: `http://localhost:5173/`

### 3. 3D Landing Page
Visit `http://localhost:8000/landing` for the interactive 3D multi-agent neural network visualizer.

---

## 🎬 60-Second Hackathon Demo Workflow

1. **Intake / Onboarding**: Select persona (e.g. Student or Grandfather).
2. **Mom Clock**: Click "Mom Clock" and test "Simulate Alarm & 3D Mom Wake-Up". Test "5 More Mins" to observe real-time conflict checking.
3. **Emergency Disruption**: Tap **"Run 4:00 PM Demo"** on top right.
4. **Agent Processing**: Priority Agent scores task (Score 94), Conflict Agent detects clash, Adaptation Agent rebuilds evening.
5. **Plan Diff Modal**: Review the old vs proposed schedule and accept the update.
6. **Admin Operations**: View the live agent monitor, latency, and full decision log trail.

---

## 📜 License
MIT License. Built for the Hackathon Demonstration.
