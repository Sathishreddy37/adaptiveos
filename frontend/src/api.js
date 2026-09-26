const API_BASE = "http://localhost:8000/api";

export async function fetchUserProfile() {
  const res = await fetch(`${API_BASE}/user/profile`);
  return res.json();
}

export async function saveUserProfile(profile) {
  const res = await fetch(`${API_BASE}/user/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });
  return res.json();
}

export async function fetchSchedule(date) {
  const url = date ? `${API_BASE}/schedule?date=${date}` : `${API_BASE}/schedule`;
  const res = await fetch(url);
  return res.json();
}

export async function resetSchedule() {
  const res = await fetch(`${API_BASE}/schedule/reset`, { method: "POST" });
  return res.json();
}

export async function triggerReplan(payload) {
  const res = await fetch(`${API_BASE}/replan/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchPendingProposals() {
  const res = await fetch(`${API_BASE}/replan/proposals/pending`);
  return res.json();
}

export async function decideProposal(proposalId, approved) {
  const res = await fetch(`${API_BASE}/replan/proposals/${proposalId}/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approved })
  });
  return res.json();
}

export async function fetchDecisionLogs(sessionId = "") {
  const url = sessionId ? `${API_BASE}/agents/decision-logs?session_id=${sessionId}` : `${API_BASE}/agents/decision-logs`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchTrustedPeople() {
  const res = await fetch(`${API_BASE}/trusted-people`);
  return res.json();
}

export async function addTrustedPerson(personData) {
  const res = await fetch(`${API_BASE}/trusted-people`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to add trusted person");
  }
  return res.json();
}

export async function updatePermission(personId, permissionKey, isEnabled) {
  const res = await fetch(`${API_BASE}/trusted-people/${personId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permission_key: permissionKey, is_enabled: isEnabled })
  });
  return res.json();
}

export async function deleteTrustedPerson(personId) {
  const res = await fetch(`${API_BASE}/trusted-people/${personId}`, {
    method: "DELETE"
  });
  return res.json();
}

export async function processVoiceCommand(transcript) {
  const res = await fetch(`${API_BASE}/voice/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript })
  });
  return res.json();
}

export async function triggerMomWakeSupport() {
  const res = await fetch(`${API_BASE}/voice/mom-wake-support`, { method: "POST" });
  return res.json();
}

export async function runDemoScenario() {
  const res = await fetch(`${API_BASE}/scenario/run-demo`, { method: "POST" });
  return res.json();
}

export async function fetchAlarms(persona = "") {
  const url = persona ? `${API_BASE}/alarms?persona=${persona}` : `${API_BASE}/alarms`;
  const res = await fetch(url);
  return res.json();
}

export async function createAlarm(payload) {
  const res = await fetch(`${API_BASE}/alarms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function toggleAlarm(alarmId) {
  const res = await fetch(`${API_BASE}/alarms/${alarmId}/toggle`, { method: "POST" });
  return res.json();
}

export async function deleteAlarm(alarmId) {
  const res = await fetch(`${API_BASE}/alarms/${alarmId}`, { method: "DELETE" });
  return res.json();
}

export async function checkSnoozeConflict(minutes = 5, currentTime = "06:00") {
  const res = await fetch(`${API_BASE}/alarms/snooze-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ minutes, current_time: currentTime })
  });
  return res.json();
}

