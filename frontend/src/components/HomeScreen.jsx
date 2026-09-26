import React, { useState, useEffect } from 'react';
import ThreeMomAvatar from './ThreeMomAvatar';
import { PERSONAS } from '../data/personas';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Shield,
  ArrowRight,
  TrendingUp,
  Brain,
  Moon,
  Zap,
  RotateCw,
  BellRing,
  Volume2,
  ChevronRight,
  MessageCircle,
  X
} from 'lucide-react';

export default function HomeScreen({
  schedule,
  pendingProposals,
  onOpenDiffModal,
  onNavigate,
  onTriggerFastReplan,
  persona,
  onSelectPersona,
  onOpenOnboarding
}) {
  const currentPersona = persona || PERSONAS.student;
  const [greeting, setGreeting] = useState(`Good morning, ${currentPersona.name}`);
  const [isCompanionExpanded, setIsCompanionExpanded] = useState(true);
  const [companionAnim, setCompanionAnim] = useState('idle');
  const [companionSpeaking, setCompanionSpeaking] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(`Good morning, ${currentPersona.name}`);
    else if (hour < 17) setGreeting(`Good afternoon, ${currentPersona.name}`);
    else setGreeting(`Good evening, ${currentPersona.name}`);
  }, [currentPersona]);

  const blocks = schedule?.blocks?.length ? schedule.blocks : currentPersona.scheduleBlocks;
  const completedCount = blocks.filter(b => b.status === 'completed').length;
  const totalCount = blocks.filter(b => !b.is_sleep).length || 6;

  // Active time window block
  const currentBlock = blocks.find(b => b.status === 'in_progress') ||
    blocks.find(b => b.start_time <= '16:00' && b.end_time > '16:00') ||
    blocks[2] || { title: currentPersona.primaryFocus, category: 'work', start_time: '16:00', end_time: '17:30' };

  // Up next block
  const nextBlock = blocks.find(b => b.start_time >= currentBlock?.end_time && !b.is_sleep) ||
    blocks[3] || { title: 'Evening Routine & Wellness', category: 'routine', start_time: '18:00', end_time: '19:30' };

  const pendingProposal = pendingProposals && pendingProposals.length > 0 ? pendingProposals[0] : null;

  const speakCompanion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.12;
      utterance.onstart = () => {
        setCompanionSpeaking(true);
        setCompanionAnim('speaking');
      };
      utterance.onend = () => {
        setCompanionSpeaking(false);
        setCompanionAnim('idle');
      };
      utterance.onerror = () => {
        setCompanionSpeaking(false);
        setCompanionAnim('idle');
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Persona Quick Switcher Bar */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#121224] border border-[#2a2a45] overflow-x-auto gap-2">
        <div className="flex items-center gap-2 pl-2 text-xs text-[#a0a0c0] font-semibold whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-[#00e0c8]" />
          <span>Switch Persona:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {Object.entries(PERSONAS).map(([key, p]) => {
            const isActive = currentPersona.id === p.id;
            return (
              <button
                key={key}
                onClick={() => onSelectPersona(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] text-white shadow-md shadow-[#ff5fa2]/20 font-bold'
                    : 'bg-[#181830] text-[#a0a0c0] hover:text-white hover:bg-[#222240] border border-[#2a2a45]/60'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.avatarAccent }}
                />
                <span>{p.name}</span>
                <span className="text-[10px] opacity-80">({p.roleTag.split('/')[0].trim()})</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenOnboarding}
          className="text-xs text-[#00e0c8] hover:underline whitespace-nowrap pr-2 font-medium"
        >
          3D Guide Intake
        </button>
      </div>

      {/* Pending Replan Banner Alert (Section 7 & 8) */}
      {pendingProposal ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#ff5fa2]/50 bg-gradient-to-r from-[#201026] via-[#16162a] to-[#121224] p-4 sm:p-5 shadow-xl shadow-[#ff5fa2]/15 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#ff5fa2]/20 border border-[#ff5fa2]/40 text-[#ff5fa2] mt-0.5">
                <BellRing className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ff5fa2]">
                    Adaptive Status: Schedule Needs Attention
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff5fa2]/20 text-white">
                    Approval Required
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  Surprise assignment arrived. Adaptation Agent rebuilt your schedule.
                </h3>
                <p className="text-xs text-[#a0a0c0] mt-1 line-clamp-1">
                  {pendingProposal.diff_summary?.[0] || 'Collision detected with AI Project. Sleep guard (22:30) protected 100%.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenDiffModal(pendingProposal)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] text-white hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Review Plan Diff</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-between text-xs text-[#10b981]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            <span className="font-semibold">Adaptive Status: Your schedule is stable. All commitments protected.</span>
          </div>
          <span className="text-[11px] text-[#a0a0c0]">Zero conflicts detected</span>
        </div>
      )}

      {/* Hero Greeting & Control Loop Indicator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[#2a2a45]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#7c6cff]/15 to-[#00e0c8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e0c8]/10 border border-[#00e0c8]/25 text-[#00e0c8] text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentPersona.roleTag} · AI Personal Coordination System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {greeting}
            </h1>
            <p className="text-sm sm:text-base text-[#a0a0c0] mt-1 max-w-xl">
              Today's Focus: <b className="text-white">{currentPersona.primaryFocus}</b>. Progress: <b className="text-[#10b981]">{completedCount}/{totalCount} tasks complete</b>.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('momclock')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] hover:opacity-95 text-white shadow-lg shadow-[#ff5fa2]/20 transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Open Mom Clock</span>
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#151527] hover:bg-[#202038] text-white border border-[#2a2a45] transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#00e0c8]" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>

        {/* The 7-Step Control Loop Visualizer */}
        <div className="mt-7 pt-5 border-t border-[#2a2a45]/60">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#a0a0c0] mb-2.5 flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-[#00e0c8]" />
            <span>Autonomous Control Loop Architecture (Continuous Replanning)</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {[
              { label: 'PLAN', active: true, color: 'text-[#7c6cff] bg-[#7c6cff]/15' },
              { label: 'EXECUTE', active: true, color: 'text-[#3b82f6] bg-[#3b82f6]/15' },
              { label: 'OBSERVE', active: true, color: 'text-[#00e0c8] bg-[#00e0c8]/15' },
              { label: 'ANALYZE', active: true, color: 'text-[#f59e0b] bg-[#f59e0b]/15' },
              { label: 'PRIORITIZE', active: true, color: 'text-[#ff5fa2] bg-[#ff5fa2]/15' },
              { label: 'REPLAN', active: true, color: 'text-[#a855f7] bg-[#a855f7]/15' },
              { label: 'CONFIRM', active: true, color: 'text-[#10b981] bg-[#10b981]/15' },
              { label: 'LEARN', active: true, color: 'text-[#06b6d4] bg-[#06b6d4]/15' },
            ].map((step, idx, arr) => (
              <React.Fragment key={step.label}>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border border-white/5 ${step.color}`}>
                  {step.label}
                </span>
                {idx < arr.length - 1 && (
                  <span className="text-[#a0a0c0]/40 text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Key Product Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Current Active Window */}
        <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00e0c8] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00e0c8] animate-ping" />
              Active Time Window ({currentBlock.start_time})
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#3b82f6]/20 text-[#3b82f6]">
              {currentBlock.category || 'work'}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white leading-snug">
              {currentBlock.title}
            </h3>
            <p className="text-xs text-[#a0a0c0] mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00e0c8]" />
              <span>{currentBlock.start_time} – {currentBlock.end_time}</span>
            </p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-[#a0a0c0] mb-1">
              <span>Task Execution</span>
              <span className="font-mono text-white">In Progress</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#11111f] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#7c6cff] to-[#00e0c8] rounded-full w-[65%]" />
            </div>
          </div>
        </div>

        {/* Card 2: Next Scheduled Activity */}
        <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a0a0c0]">
              Up Next Today
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#ff5fa2]/20 text-[#ff5fa2]">
              {nextBlock.category || 'routine'}
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white leading-snug">
              {nextBlock.title}
            </h3>
            <p className="text-xs text-[#a0a0c0] mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ff5fa2]" />
              <span>{nextBlock.start_time} – {nextBlock.end_time}</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2a45]/60 flex items-center justify-between text-xs">
            <span className="text-[#a0a0c0]">Buffer gap: 15 mins</span>
            <span className="text-[#10b981] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>
        </div>

        {/* Card 3: Inviolable Sleep Guard */}
        <div className="glass-panel rounded-2xl p-5 border border-[#6366f1]/30 bg-gradient-to-b from-[#181830] to-[#151527] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6366f1] flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5" />
              Sleep Guard ({currentPersona.protectPriority})
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#10b981]/20 text-[#10b981]">
              Protected 100%
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">
              {currentPersona.sleepTime} – {currentPersona.wakeTime}
            </h3>
            <p className="text-xs text-[#a0a0c0] mt-1">
              Conflict Agent guarantees zero silent shortening of your recovery window, regardless of workload changes.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2a45]/60 flex items-center gap-2 text-xs text-[#10b981]">
            <Shield className="w-4 h-4 shrink-0" />
            <span className="font-medium">Sleep budget intact. Zero compromise.</span>
          </div>
        </div>
      </div>

      {/* Floating Living 3D Companion Widget (Section 7 Requirement) */}
      <div className="fixed bottom-6 right-6 z-30 max-w-sm w-full">
        {isCompanionExpanded ? (
          <div className="bg-[#121224]/95 border border-[#ff5fa2]/40 rounded-3xl p-4 shadow-2xl shadow-black/80 backdrop-blur-xl relative animate-fade-in flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[#2a2a45]/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span className="font-bold text-white">Mom Living Guide</span>
                <span className="text-[10px] text-[#00e0c8] font-mono">Lakshmi</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => speakCompanion(
                    pendingProposal
                      ? "You have a new assignment. I can help reorganize your evening while keeping sleep protected."
                      : `Hello ${currentPersona.name}! Your schedule is running smoothly. Remember to drink water and enjoy your day.`
                  )}
                  className="p-1 rounded-lg text-[#ff5fa2] hover:bg-[#ff5fa2]/20"
                  title="Speak advice"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsCompanionExpanded(false)}
                  className="p-1 rounded-lg text-[#a0a0c0] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="w-24 h-24 shrink-0 overflow-hidden rounded-2xl bg-[#0a0a12]/60 border border-white/5 flex items-center justify-center">
                <ThreeMomAvatar
                  mode="companion"
                  animationState={companionAnim}
                  isSpeaking={companionSpeaking}
                  className="w-full h-full"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white leading-relaxed">
                  {pendingProposal
                    ? "“You have a new assignment. I can help reorganize your evening.”"
                    : `“Your schedule is stable. Up next: ${nextBlock.title}. I'm here if you need to adjust.”`}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('momclock')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#ff5fa2]/20 text-[#ff5fa2] border border-[#ff5fa2]/30 hover:bg-[#ff5fa2]/30"
                  >
                    Mom Clock
                  </button>
                  <button
                    onClick={() => onNavigate('assistant')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#7c6cff]/20 text-[#7c6cff] border border-[#7c6cff]/30 hover:bg-[#7c6cff]/30"
                  >
                    AI Assistant
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCompanionExpanded(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#121224] border border-[#ff5fa2]/50 text-white shadow-2xl shadow-[#ff5fa2]/20 hover:scale-105 transition-all text-xs font-bold"
          >
            <div className="w-6 h-6 rounded-full bg-[#ff5fa2] flex items-center justify-center text-[#0a0a12]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>Mom Guide</span>
          </button>
        )}
      </div>
    </div>
  );
}
