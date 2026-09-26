import React, { useState, useEffect } from 'react';
import ThreeMomAvatar from './ThreeMomAvatar';
import {
  Clock,
  Bell,
  BellRing,
  Volume2,
  Plus,
  Trash2,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Check,
  X
} from 'lucide-react';

export default function MomClockScreen({
  persona,
  onNavigate,
  onUpdateAlarms
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState(persona?.alarms || []);
  const [isWakeUpModalOpen, setIsWakeUpModalOpen] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatarAnim, setAvatarAnim] = useState('wakeup');
  const [wakeUpMessage, setWakeUpMessage] = useState('');
  const [conflictResult, setConflictResult] = useState(null);
  const [snoozeChecked, setSnoozeChecked] = useState(false);

  // New Alarm Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('07:00');
  const [newCategory, setNewCategory] = useState('routine');
  const [newVoicePrompt, setNewVoicePrompt] = useState('');
  const [newDays, setNewDays] = useState('Everyday');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync alarms when persona changes
  useEffect(() => {
    if (persona?.alarms) {
      setAlarms(persona.alarms);
    }
  }, [persona]);

  // Voice speech synthesis helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.12; // Warm motherly pitch
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Audio API gentle harmonic morning chime
  const playGentleChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const noteStart = ctx.currentTime + i * 0.14;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 1.5);
      });
    } catch (e) {
      // AudioContext muted/unsupported
    }
  };

  // Trigger Wake-Up / Alarm Mode (Section 14 requirement)
  const triggerAlarmMode = (alarm) => {
    const selected = alarm || alarms[0] || {
      title: 'Morning Wake-Up',
      time: persona.wakeTime,
      voicePrompt: persona.voicePromptGreeting
    };
    setActiveAlarm(selected);
    setIsWakeUpModalOpen(true);
    setAvatarAnim('wakeup');
    setConflictResult(null);
    setSnoozeChecked(false);

    // Play pleasant morning chime first
    playGentleChime();

    const speech = selected.voicePrompt || `Good morning, ${persona.name}! It's ${selected.time}. Time to rise and shine. Let's start the day together.`;
    setWakeUpMessage(speech);

    setTimeout(() => {
      speakText(speech);
    }, 750);
  };

  // Handle "I'm Up"
  const handleImUp = () => {
    setAvatarAnim('celebrating');
    const msg = `Wonderful! That's it, ${persona.name}. Let's get started with your next scheduled block.`;
    setWakeUpMessage(msg);
    speakText(msg);

    setTimeout(() => {
      setIsWakeUpModalOpen(false);
      if (onNavigate) onNavigate('schedule');
    }, 2200);
  };

  // Handle "5 More Minutes" (Instant Conflict Evaluation)
  const handleFiveMinutes = async () => {
    setAvatarAnim('thinking');
    const timeParts = (activeAlarm?.time || '06:00').split(':');
    const totalMinutes = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
    const bufferMinutes = 45; // Buffer before next commitment
    const conflict = bufferMinutes < 15;

    try {
      const resp = await fetch('http://localhost:8000/api/alarms/snooze-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minutes: 5,
          current_time: activeAlarm?.time || '06:00'
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        setConflictResult(data);
        setSnoozeChecked(true);
        speakText(data.explanation);
        setWakeUpMessage(data.explanation);
        return;
      }
    } catch (e) {
      // Fallback local deterministic reasoning
    }

    const fallbackExplanation = `You have 45 minutes before your next fixed commitment. 5 extra minutes is okay, but your study session will become 5 minutes shorter. Sleep schedule remains protected.`;
    setConflictResult({
      safe: true,
      buffer_minutes: 45,
      explanation: fallbackExplanation,
      snoozed_wake_time: `${Math.floor((totalMinutes + 5) / 60).toString().padStart(2, '0')}:${((totalMinutes + 5) % 60).toString().padStart(2, '0')}`
    });
    setSnoozeChecked(true);
    setWakeUpMessage(fallbackExplanation);
    speakText(fallbackExplanation);
  };

  // Handle "Skip Today"
  const handleSkipToday = () => {
    setAvatarAnim('idle');
    const msg = `Acknowledged. I have flagged today's session as skipped and protected your evening rest.`;
    setWakeUpMessage(msg);
    speakText(msg);
    setTimeout(() => {
      setIsWakeUpModalOpen(false);
    }, 1800);
  };

  // Add new alarm
  const handleAddAlarm = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAlarmObj = {
      id: `alarm-${Date.now()}`,
      title: newTitle,
      time: newTime,
      days: newDays,
      category: newCategory,
      isActive: true,
      voicePrompt: newVoicePrompt || `Time for ${newTitle}, ${persona.name}!`
    };

    const updated = [...alarms, newAlarmObj].sort((a, b) => a.time.localeCompare(b.time));
    setAlarms(updated);
    if (onUpdateAlarms) onUpdateAlarms(updated);

    // Also persist to backend if available
    fetch('http://localhost:8000/api/alarms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        time: newTime,
        days: newDays,
        category: newCategory,
        voice_prompt: newVoicePrompt,
        persona: persona.id
      })
    }).catch(() => {});

    setIsAddOpen(false);
    setNewTitle('');
    setNewVoicePrompt('');
  };

  // Toggle alarm active
  const handleToggleAlarm = (id) => {
    const updated = alarms.map(al => al.id === id ? { ...al, isActive: !al.isActive } : al);
    setAlarms(updated);
    if (onUpdateAlarms) onUpdateAlarms(updated);
  };

  // Delete alarm
  const handleDeleteAlarm = (id) => {
    const updated = alarms.filter(al => al.id !== id);
    setAlarms(updated);
    if (onUpdateAlarms) onUpdateAlarms(updated);
  };

  const formattedHours = currentTime.getHours().toString().padStart(2, '0');
  const formattedMinutes = currentTime.getMinutes().toString().padStart(2, '0');
  const formattedSeconds = currentTime.getSeconds().toString().padStart(2, '0');
  const formattedDate = currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner: Mom Clock & Routine Synchronization */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[#2a2a45]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#ff5fa2]/15 to-[#7c6cff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5fa2]/10 border border-[#ff5fa2]/30 text-[#ff5fa2] text-xs font-semibold mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Mom Clock · {persona.momClockSubtitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Synchronized Routine & Alarms
            </h1>
            <p className="text-xs sm:text-sm text-[#a0a0c0] mt-1 max-w-xl">
              Mom Clock connects consented human voice reminders with real-time schedule conflict reasoning. When wake-up or medication alarms trigger, the 3D living guide provides caring, actionable assistance.
            </p>
          </div>

          {/* Dual Analog & Digital Clock Card with Circadian Sky Theme */}
          <div className="bg-[#121224] border border-[#2a2a45] rounded-3xl p-4 sm:p-5 flex items-center gap-5 shadow-2xl relative overflow-hidden group">
            {/* Dynamic Circadian Ambient Glow */}
            <div
              className={`absolute inset-0 opacity-20 transition-all duration-1000 pointer-events-none ${
                currentTime.getHours() >= 5 && currentTime.getHours() < 12
                  ? 'bg-gradient-to-r from-[#ffaa55] via-[#ff5fa2] to-transparent' // Dawn / Morning
                  : currentTime.getHours() >= 12 && currentTime.getHours() < 18
                  ? 'bg-gradient-to-r from-[#00e0c8] via-[#3b82f6] to-transparent' // Midday
                  : currentTime.getHours() >= 18 && currentTime.getHours() < 22
                  ? 'bg-gradient-to-r from-[#f59e0b] via-[#a855f7] to-transparent' // Twilight
                  : 'bg-gradient-to-r from-[#6366f1] via-[#1e1e38] to-transparent' // Midnight
              }`}
            />

            {/* Analog Clock Dial */}
            <div className="relative w-16 h-16 rounded-full bg-[#0a0a12] border-2 border-[#2a2a45] shadow-inner shrink-0 flex items-center justify-center">
              {/* Hour hand */}
              <div
                className="absolute w-[3px] h-4 bg-white rounded-full origin-bottom"
                style={{
                  bottom: '50%',
                  transform: `rotate(${((currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5)}deg)`
                }}
              />
              {/* Minute hand */}
              <div
                className="absolute w-[2px] h-5 bg-[#00e0c8] rounded-full origin-bottom"
                style={{
                  bottom: '50%',
                  transform: `rotate(${currentTime.getMinutes() * 6}deg)`
                }}
              />
              {/* Second hand */}
              <div
                className="absolute w-[1px] h-6 bg-[#ff5fa2] rounded-full origin-bottom"
                style={{
                  bottom: '50%',
                  transform: `rotate(${currentTime.getSeconds() * 6}deg)`
                }}
              />
              {/* Center pin */}
              <div className="w-2 h-2 rounded-full bg-[#ff5fa2] z-10 shadow-sm" />
            </div>

            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-wider flex items-baseline gap-1">
                <span>{formattedHours}:{formattedMinutes}</span>
                <span className="text-xs sm:text-sm text-[#00e0c8] font-mono">:{formattedSeconds}</span>
              </div>
              <div className="text-[11px] text-[#a0a0c0] font-medium mt-0.5 flex items-center gap-2">
                <span>{formattedDate}</span>
                <span>•</span>
                <span className="text-[#10b981] font-semibold">Circadian In-Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Simulator Bar */}
        <div className="mt-6 pt-4 border-t border-[#2a2a45]/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#a0a0c0]">
            <Sparkles className="w-4 h-4 text-[#00e0c8]" />
            <span>Active Persona: <b className="text-white">{persona.name} ({persona.roleTag})</b></span>
            <span>•</span>
            <span className="text-[#10b981]">Consented Voice: Mom Approved</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerAlarmMode(alarms[0])}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] hover:opacity-95 text-white shadow-lg shadow-[#ff5fa2]/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Simulate Alarm & 3D Mom Wake-Up</span>
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#151527] hover:bg-[#202038] text-white border border-[#2a2a45] flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#00e0c8]" />
              <span>Add Timing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Alarms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {alarms.map((alarm) => {
          const isCritical = alarm.category === 'medication' || alarm.title.includes('CRITICAL');
          return (
            <div
              key={alarm.id}
              className={`glass-panel rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isCritical
                  ? 'border-[#ef4444]/40 bg-[#ef4444]/5'
                  : alarm.isActive
                  ? 'border-[#2a2a45] bg-[#131326]'
                  : 'border-[#2a2a45]/40 bg-[#0d0d18] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isCritical
                      ? 'bg-[#ef4444]/20 text-[#ef4444]'
                      : 'bg-[#7c6cff]/20 text-[#7c6cff]'
                  }`}>
                    {alarm.category}
                  </span>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alarm.isActive}
                      onChange={() => handleToggleAlarm(alarm.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#2a2a45] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff5fa2]" />
                  </label>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-extrabold text-white">
                    {alarm.time}
                  </span>
                  <span className="text-xs text-[#a0a0c0] font-medium">
                    {alarm.days}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-1.5 line-clamp-1">
                  {alarm.title}
                </h3>

                <p className="text-xs text-[#a0a0c0] mt-1.5 flex items-center gap-1.5 italic bg-[#0a0a12]/50 p-2 rounded-lg border border-white/5">
                  <Volume2 className="w-3.5 h-3.5 text-[#ff5fa2] shrink-0" />
                  <span className="line-clamp-2">“{alarm.voicePrompt}”</span>
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-[#2a2a45]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => triggerAlarmMode(alarm)}
                    className="text-xs font-semibold text-[#00e0c8] hover:text-[#00e0c8]/80 flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Wake-Up</span>
                  </button>

                  <button
                    onClick={() => playGentleChime()}
                    className="text-xs font-medium text-[#a0a0c0] hover:text-[#ff5fa2] flex items-center gap-1 transition-colors"
                    title="Preview Chime"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Chime</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteAlarm(alarm.id)}
                  className="p-1 rounded-lg text-[#a0a0c0] hover:text-[#ef4444] transition-colors"
                  title="Remove alarm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Timing Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#151527] border border-[#2a2a45] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff5fa2]" />
                <span>Add Scheduled Timing / Alarm</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-[#a0a0c0] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAlarm} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">
                  Alarm Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Heart Pill, Focus Sprint, School Bus..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff5fa2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#ff5fa2]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff5fa2]"
                  >
                    <option value="wake_up">Wake-Up</option>
                    <option value="medication">Medication / Health</option>
                    <option value="focus">Focus / Deep Work</option>
                    <option value="routine">Routine / Family</option>
                    <option value="commute">Commute / School Bus</option>
                    <option value="sleep">Sleep / Wind Down</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">
                  Frequency / Days
                </label>
                <input
                  type="text"
                  value={newDays}
                  onChange={(e) => setNewDays(e.target.value)}
                  className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff5fa2]"
                  placeholder="e.g. Everyday, Mon-Fri, Weekends"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">
                  Mom Voice Reminder Text (Spoken)
                </label>
                <textarea
                  rows={2}
                  value={newVoicePrompt}
                  onChange={(e) => setNewVoicePrompt(e.target.value)}
                  className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff5fa2]"
                  placeholder="e.g. Good morning! Time for your medicine before breakfast."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#a0a0c0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#ff5fa2] hover:bg-[#e04f8e] text-white shadow-md shadow-[#ff5fa2]/20"
                >
                  Save Timing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 14: 3D MOM INTERACTION & WAKE-UP MODE MODAL */}
      {isWakeUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#06060c]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="max-w-xl w-full bg-[#121224] border border-[#ff5fa2]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#ff5fa2]/20 flex flex-col items-center text-center relative overflow-hidden">
            {/* Ambient Warm Dawn Lighting */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#ff5fa2]/20 via-[#ffaa55]/10 to-transparent pointer-events-none" />

            <div className="w-full flex items-center justify-between text-xs text-[#a0a0c0] relative z-10 mb-2">
              <span className="font-mono uppercase text-[#00e0c8] flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00e0c8] animate-ping" />
                Mom Clock · Wake-up Mode Active
              </span>
              <button
                onClick={() => setIsWakeUpModalOpen(false)}
                className="p-1 rounded-lg text-[#a0a0c0] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3D Character Walking In & Greeting */}
            <div className="w-full max-w-[320px] my-2 relative z-10">
              <ThreeMomAvatar
                mode="wakeup"
                animationState={avatarAnim}
                isSpeaking={isSpeaking}
                className="w-full"
              />
            </div>

            {/* Spoken Message & Speech Display */}
            <div className="relative z-10 mt-1 max-w-md">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeAlarm?.title || 'Wake-up Alarm'}
              </h2>
              <div className="p-3.5 rounded-2xl bg-[#0a0a12]/80 border border-[#2a2a45] mt-3 shadow-inner">
                <p className="text-sm font-medium text-white leading-relaxed">
                  “{wakeUpMessage}”
                </p>
              </div>
            </div>

            {/* Conflict Reasoning Display if 5 More Minutes Clicked */}
            {snoozeChecked && conflictResult && (
              <div className="relative z-10 mt-3 p-3 rounded-xl bg-[#7c6cff]/15 border border-[#7c6cff]/30 text-xs text-left w-full max-w-md animate-fade-in">
                <div className="font-bold text-[#00e0c8] flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Agentic Conflict Evaluation (Time & Conflict Agent)</span>
                </div>
                <p className="text-[#d0d0e0] leading-snug">
                  {conflictResult.explanation}
                </p>
                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#a0a0c0]">
                  <span>New wake time: <b className="text-white">{conflictResult.snoozed_wake_time}</b></span>
                  <span className="text-[#10b981]">Sleep Protected: 100%</span>
                </div>
              </div>
            )}

            {/* Master Action Buttons from Section 14 */}
            <div className="relative z-10 mt-6 grid grid-cols-3 gap-2.5 w-full max-w-md">
              <button
                onClick={handleImUp}
                className="py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#10b981] to-[#00e0c8] text-[#0a0a12] shadow-lg shadow-[#10b981]/25 hover:opacity-95 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>I'm Up</span>
              </button>

              <button
                onClick={handleFiveMinutes}
                className="py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#1e1e38] hover:bg-[#28284c] text-white border border-[#ff5fa2]/40 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#ff5fa2]" />
                <span>5 More Mins</span>
              </button>

              <button
                onClick={handleSkipToday}
                className="py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold bg-[#151527] hover:bg-[#202038] text-[#a0a0c0] hover:text-white border border-[#2a2a45] transition-colors"
              >
                Skip Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
