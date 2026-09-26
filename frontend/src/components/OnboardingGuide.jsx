import React, { useState } from 'react';
import ThreeMomAvatar from './ThreeMomAvatar';
import { PERSONAS } from '../data/personas';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Heart,
  User,
  GraduationCap,
  Briefcase,
  Baby,
  Smile,
  Check,
  ChevronRight,
  BellRing,
  Volume2
} from 'lucide-react';

export default function OnboardingGuide({
  onComplete,
  onCancel,
  currentPersonaId = 'student'
}) {
  const [step, setStep] = useState(0); // 0 = Intro Hero, 1 = Choose Persona, 2 = Daily Rhythm, 3 = Protect First, 4 = Human Support
  const [selectedPersonaKey, setSelectedPersonaKey] = useState(currentPersonaId);
  const persona = PERSONAS[selectedPersonaKey] || PERSONAS.student;

  const [formData, setFormData] = useState({
    name: persona.name,
    roleTag: persona.roleTag,
    wakeTime: persona.wakeTime,
    sleepTime: persona.sleepTime,
    focusStart: '09:00',
    focusEnd: '17:00',
    primaryGoal: persona.goals[0],
    protectFirst: 'Sleep',
    trustedName: 'Mom',
    trustedRelationship: 'Mom',
    trustedVoiceApproved: true,
    permissions: {
      wakeUpSupport: true,
      voiceReminders: true,
      missedTaskAlert: true,
      fullSchedule: false,
      privateNotes: false,
      location: false
    }
  });

  const [avatarAnim, setAvatarAnim] = useState('greeting');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSpoken, setVoiceSpoken] = useState(false);

  // Play browser speech synthesis with warm gentle pitch
  const speakMomGuide = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1; // Warm, friendly tone
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setVoiceSpoken(true);
    }
  };

  const handleSelectPersona = (key) => {
    setSelectedPersonaKey(key);
    const p = PERSONAS[key];
    setFormData(prev => ({
      ...prev,
      name: p.name,
      roleTag: p.roleTag,
      wakeTime: p.wakeTime,
      sleepTime: p.sleepTime,
      primaryGoal: p.goals[0],
      protectFirst: p.protectPriority.split('&')[0].trim() || 'Sleep'
    }));
    setAvatarAnim('celebrating');
    setTimeout(() => setAvatarAnim('greeting'), 1200);
    speakMomGuide(`Wonderful choice! I will help coordinate your schedule as a ${p.roleTag}. Let's configure your daily timings.`);
  };

  const personaOptions = [
    {
      key: 'student',
      title: 'Student',
      desc: 'College lectures, exams, Python & ML projects, sleep protection',
      icon: GraduationCap,
      color: '#7c6cff'
    },
    {
      key: 'professional',
      title: 'Job / Professional',
      desc: 'Engineering manager, sprint standups, deep work, family dinner balance',
      icon: Briefcase,
      color: '#00e0c8'
    },
    {
      key: 'mother',
      title: 'Mother / Homemaker',
      desc: 'Family wellness, kids school routines, meals, yoga, home management',
      icon: Heart,
      color: '#ff5fa2'
    },
    {
      key: 'grandfather',
      title: 'Senior / Grandfather',
      desc: 'Morning garden stroll, prayer, vital heart/BP medicines, afternoon rest',
      icon: User,
      color: '#f59e0b'
    },
    {
      key: 'kid',
      title: 'Kid / Junior',
      desc: 'School bus, football play, fun homework, screen limit, bedtime stories',
      icon: Baby,
      color: '#3b82f6'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a12]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#121224] border border-[#2a2a45] rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col md:flex-row relative">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ff5fa2]/10 to-[#7c6cff]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: 3D Living Mother Guide */}
        <div className="w-full md:w-5/12 bg-gradient-to-b from-[#181832] to-[#0e0e1e] p-6 sm:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#2a2a45] relative">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e0c8] animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#a0a0c0]">
                Living 3D Guide
              </span>
            </div>
            <button
              onClick={() => speakMomGuide(
                step === 0 ? "Welcome to AdaptiveOS. Your life changes, and your plan should too. Let's create your perfect daily rhythm." :
                step === 1 ? "Select the persona that matches your life. We support students, working professionals, mothers, grandparents, and children." :
                step === 2 ? "Set your wake-up time and sleep schedule. Mom Clock will protect your rest." :
                "You decide who supports you and what permissions they have. Your privacy is protected."
              )}
              className="p-2 rounded-xl bg-[#2a2a45]/40 hover:bg-[#ff5fa2]/20 text-[#ff5fa2] border border-[#ff5fa2]/30 transition-colors"
              title="Speak with Living Guide"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Model Canvas */}
          <div className="w-full my-auto flex flex-col items-center">
            <ThreeMomAvatar
              mode="guide"
              animationState={avatarAnim}
              isSpeaking={isSpeaking}
              className="w-full max-w-[280px]"
            />
            <div className="text-center mt-2">
              <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <span>Lakshmi</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ff5fa2]/20 text-[#ff5fa2]">
                  Adaptive Living Companion
                </span>
              </h4>
              <p className="text-xs text-[#a0a0c0] mt-1 max-w-xs">
                {step === 0 && "“Welcome! I am here to guide your daily rhythm with warmth, care, and intelligent planning.”"}
                {step === 1 && "“Whether studying, leading a team, managing a home, or retiring peacefully—we coordinate with you.”"}
                {step === 2 && "“Your sleep and health are sacred. I will ensure no schedule change silently shortens your rest.”"}
                {step === 3 && "“Tell me your top priority so my agents guard it against interruptions.”"}
                {step === 4 && "“You always stay in control. Only consented voices and scoped permissions are allowed.”"}
              </p>
            </div>
          </div>

          {/* Step Dots */}
          <div className="flex items-center gap-2 mt-4">
            {[0, 1, 2, 3, 4].map(i => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  step === i ? 'w-6 bg-[#ff5fa2]' : 'w-2 bg-[#2a2a45]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Clean Apple-Style Step Content */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-between">
          {/* Step 0: Minimal Apple-Style Intro */}
          {step === 0 && (
            <div className="space-y-6 my-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c6cff]/10 border border-[#7c6cff]/30 text-[#7c6cff] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AdaptiveOS · Intelligent Life Coordination</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Your life changes.<br />
                  <span className="bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] bg-clip-text text-transparent">
                    Your plan should too.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#a0a0c0] mt-3 leading-relaxed">
                  AdaptiveOS is not a static calendar or a passive alarm. It is an autonomous multi-agent operating system that understands your commitments, protects your sleep, and dynamically replans your day when interruptions happen.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#d0d0e0]">
                  <span className="w-5 h-5 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center font-bold">✓</span>
                  <span>7 Autonomous Agents running Plan → Observe → Replan → Confirm → Learn</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#d0d0e0]">
                  <span className="w-5 h-5 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center font-bold">✓</span>
                  <span>Mom Clock & Consented Human Voice Support</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#d0d0e0]">
                  <span className="w-5 h-5 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center font-bold">✓</span>
                  <span>Designed for Students, Jobs, Mothers, Grandparents & Kids</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    setStep(1);
                    speakMomGuide("Step 1: Choose your persona. Who are we planning for today?");
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] hover:opacity-95 text-white shadow-xl shadow-[#ff5fa2]/25 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="px-4 py-3 rounded-xl text-xs font-semibold text-[#a0a0c0] hover:text-white transition-colors"
                  >
                    Skip to App
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Choose Persona */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff5fa2]">
                  Step 1 of 4 · Profile Persona
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Who is AdaptiveOS coordinating for?
                </h2>
                <p className="text-xs text-[#a0a0c0] mt-1">
                  Select a persona. AdaptiveOS adapts its agent rules, routine timings, and voice prompts accordingly.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {personaOptions.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = selectedPersonaKey === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSelectPersona(opt.key)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#ff5fa2] bg-[#ff5fa2]/10 shadow-md shadow-[#ff5fa2]/10'
                          : 'border-[#2a2a45] bg-[#16162a]/60 hover:border-[#7c6cff]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${opt.color}25`, color: opt.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                            {isSelected && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#ff5fa2] text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#a0a0c0] mt-0.5 line-clamp-1">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#ff5fa2]' : 'text-[#a0a0c0]'}`} />
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#2a2a45]">
                <button
                  onClick={() => setStep(0)}
                  className="text-xs font-semibold text-[#a0a0c0] hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setStep(2);
                    speakMomGuide("Great! Now tell me your wake up time and sleep schedule so we can configure Mom Clock.");
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7c6cff] hover:bg-[#6c5af5] text-white shadow-md shadow-[#7c6cff]/20 flex items-center gap-1.5"
                >
                  <span>Next: Daily Rhythm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Daily Rhythm & Mom Clock Timings */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e0c8]">
                  Step 2 of 4 · Routine & Mom Clock
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Daily Rhythm for {formData.name}
                </h2>
                <p className="text-xs text-[#a0a0c0] mt-1">
                  Define your wake-up, core commitments, and rest boundaries.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#16162a] border border-[#2a2a45]">
                  <label className="text-xs font-semibold text-[#a0a0c0] flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#ff5fa2]" />
                    <span>Mom Clock Wake-Up Time</span>
                  </label>
                  <input
                    type="time"
                    value={formData.wakeTime}
                    onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                    className="w-full bg-[#0e0e1a] border border-[#2a2a45] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#ff5fa2]"
                  />
                  <span className="text-[11px] text-[#a0a0c0] mt-1.5 block">
                    Mom will greet and gently prompt you.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#16162a] border border-[#2a2a45]">
                  <label className="text-xs font-semibold text-[#a0a0c0] flex items-center gap-1.5 mb-2">
                    <Shield className="w-3.5 h-3.5 text-[#7c6cff]" />
                    <span>Target Sleep Time (Hard Guard)</span>
                  </label>
                  <input
                    type="time"
                    value={formData.sleepTime}
                    onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
                    className="w-full bg-[#0e0e1a] border border-[#2a2a45] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#7c6cff]"
                  />
                  <span className="text-[11px] text-[#a0a0c0] mt-1.5 block">
                    Conflict Agent locks this time window.
                  </span>
                </div>
              </div>

              {/* Primary Focus / Goal */}
              <div className="p-4 rounded-2xl bg-[#16162a] border border-[#2a2a45]">
                <label className="text-xs font-semibold text-[#a0a0c0] mb-2 block">
                  Today's Primary Goal / Focus
                </label>
                <input
                  type="text"
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full bg-[#0e0e1a] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00e0c8]"
                  placeholder="e.g. Complete AI Project, Take BP Pills, Yoga..."
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#2a2a45]">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#a0a0c0] hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setStep(3);
                    speakMomGuide("What should AdaptiveOS protect first? Sleep, Health, Family, or Work?");
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7c6cff] hover:bg-[#6c5af5] text-white shadow-md shadow-[#7c6cff]/20 flex items-center gap-1.5"
                >
                  <span>Next: Protect First</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: What to Protect First */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f59e0b]">
                  Step 3 of 4 · Priority Guard
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  What should AdaptiveOS protect first?
                </h2>
                <p className="text-xs text-[#a0a0c0] mt-1">
                  When emergencies or changes arrive, the Conflict Agent will defend this priority above all others.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Sleep', label: 'Sleep & Rest', icon: Shield, note: 'Non-negotiable 8hr window' },
                  { id: 'Health', label: 'Health & Meds', icon: Heart, note: 'Medication & doctor times' },
                  { id: 'Family', label: 'Family Time', icon: Smile, note: 'Protected dinner & kids time' },
                  { id: 'Work', label: 'Deep Work / Study', icon: Briefcase, note: 'Sprint blocks & project work' }
                ].map(opt => {
                  const Icon = opt.icon;
                  const isChecked = formData.protectFirst === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, protectFirst: opt.id })}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked
                          ? 'border-[#f59e0b] bg-[#f59e0b]/10'
                          : 'border-[#2a2a45] bg-[#16162a]/60 hover:border-[#f59e0b]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-4 h-4 ${isChecked ? 'text-[#f59e0b]' : 'text-[#a0a0c0]'}`} />
                        {isChecked && <Check className="w-4 h-4 text-[#f59e0b]" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{opt.label}</div>
                        <div className="text-[11px] text-[#a0a0c0] mt-0.5">{opt.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#2a2a45]">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-[#a0a0c0] hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setStep(4);
                    speakMomGuide("Finally, who can support you? Mom or a mentor? And what permissions do they have?");
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7c6cff] hover:bg-[#6c5af5] text-white shadow-md shadow-[#7c6cff]/20 flex items-center gap-1.5"
                >
                  <span>Next: Human Support</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Human-in-the-Loop & Consented Voice Support */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff5fa2]">
                  Step 4 of 4 · Human Support & Consent
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Trusted Support & Permissions
                </h2>
                <p className="text-xs text-[#a0a0c0] mt-1">
                  “AI coordinates. People support. You stay in control.”
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#16162a] border border-[#2a2a45] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#ff5fa2]/20 border border-[#ff5fa2]/40 text-[#ff5fa2] flex items-center justify-center font-bold text-sm">
                      Mom
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Mom (Primary Trusted Support)</h4>
                      <p className="text-[11px] text-[#10b981] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Consented Voice Profile Active
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981]">
                    Approved
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#2a2a45]/60 text-xs">
                  <label className="flex items-center justify-between text-white cursor-pointer">
                    <span className="text-[#d0d0e0]">Wake-up & Alarm Voice Support</span>
                    <input
                      type="checkbox"
                      checked={formData.permissions.wakeUpSupport}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, wakeUpSupport: e.target.checked }
                      })}
                      className="accent-[#ff5fa2] w-4 h-4 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between text-white cursor-pointer">
                    <span className="text-[#d0d0e0]">Voice Reminders on Critical Tasks</span>
                    <input
                      type="checkbox"
                      checked={formData.permissions.voiceReminders}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, voiceReminders: e.target.checked }
                      })}
                      className="accent-[#ff5fa2] w-4 h-4 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between text-white cursor-pointer">
                    <span className="text-[#d0d0e0]">Missed-Task Escalation Notification</span>
                    <input
                      type="checkbox"
                      checked={formData.permissions.missedTaskAlert}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, missedTaskAlert: e.target.checked }
                      })}
                      className="accent-[#ff5fa2] w-4 h-4 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between text-[#707090] cursor-not-allowed">
                    <span>Full Schedule / Private Notes / Location (Protected)</span>
                    <span className="text-[10px] text-[#ef4444] font-semibold">✕ Denied</span>
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#00e0c8]/10 border border-[#00e0c8]/25 text-[11px] text-[#a0a0c0] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00e0c8] shrink-0" />
                <span>
                  Privacy by Design: Voice uses an approved consent profile. Zero unauthorized cloning. Local encrypted storage.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#2a2a45]">
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-semibold text-[#a0a0c0] hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setAvatarAnim('celebrating');
                    speakMomGuide(`All set, ${formData.name}! Your AdaptiveOS plan is synthesized. Taking you to Mom Clock.`);
                    setTimeout(() => {
                      onComplete({
                        personaKey: selectedPersonaKey,
                        formData
                      });
                    }, 1200);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] hover:opacity-95 text-white shadow-xl shadow-[#ff5fa2]/25 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Activate AdaptiveOS & Open Mom Clock</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
