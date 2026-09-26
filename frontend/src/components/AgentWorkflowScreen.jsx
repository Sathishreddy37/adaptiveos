import React, { useState } from 'react';
import {
  Brain,
  Compass,
  Target,
  Clock,
  AlertTriangle,
  RotateCw,
  TrendingUp,
  Mic,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Shield,
  Activity
} from 'lucide-react';

export default function AgentWorkflowScreen({ onTriggerDemo }) {
  const [activeStep, setActiveStep] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationIndex, setSimulationIndex] = useState(0);

  const agents = [
    {
      id: 'planning',
      title: 'Planning Agent',
      role: 'Schedule Synthesizer',
      desc: 'Creates the baseline schedule from user goals, rhythms, and routines.',
      icon: Compass,
      color: '#7c6cff',
      status: 'Active',
      sampleOutput: 'Synthesized 9 core blocks. Aligned high cognitive load with 9 AM window.'
    },
    {
      id: 'priority',
      title: 'Priority Agent',
      role: 'Urgency & Importance Scorer',
      desc: 'Weighs deadlines, exam dates, client expectations, and task gravity.',
      icon: Target,
      color: '#ff5fa2',
      status: 'Active',
      sampleOutput: 'Evaluated surprise assignment: Score 94/100 (Urgency 9, Deadline < 24 hrs).'
    },
    {
      id: 'time',
      title: 'Time Agent',
      role: 'Duration Estimator & Bufferer',
      desc: 'Calculates real task completion times based on learned historical bias.',
      icon: Clock,
      color: '#00e0c8',
      status: 'Idle',
      sampleOutput: 'Estimated 90 mins needed. Added 18 min historical Python study buffer.'
    },
    {
      id: 'conflict',
      title: 'Conflict Agent',
      role: 'Clash & Constraint Defender',
      desc: 'Detects overlapping events, preserves meal times, and guards sleep windows.',
      icon: AlertTriangle,
      color: '#f59e0b',
      status: 'Active',
      sampleOutput: 'Collision detected with 4:00 PM AI Project. Sleep guard 22:30 strictly locked.'
    },
    {
      id: 'adaptation',
      title: 'Adaptation Agent',
      role: 'Dynamic Replanner',
      desc: 'Reorganizes flexible blocks and generates minimal-disruption alternatives.',
      icon: RotateCw,
      color: '#a855f7',
      status: 'Processing',
      sampleOutput: 'Generated 2 viable options: Move AI Project to 8:30 PM or Tomorrow 6:00 PM.'
    },
    {
      id: 'learning',
      title: 'Learning Agent',
      role: 'Continuous Personalization',
      desc: 'Learns actual completion drift, morning promptness, and energy peaks.',
      icon: TrendingUp,
      color: '#10b981',
      status: 'Active',
      sampleOutput: 'Model updated: +28% morning wake promptness when Mom voice reminder played.'
    },
    {
      id: 'voice_human',
      title: 'Voice & Human Agent',
      role: 'Scoped Human-in-the-Loop',
      desc: 'Manages consented voice reminders, family escalations, and speech intent.',
      icon: Mic,
      color: '#ec4899',
      status: 'Active',
      sampleOutput: 'Mom wake-up support approved. Spoken intent: ADD_ASSIGNMENT executed.'
    }
  ];

  const workflowSteps = [
    { label: 'USER INPUT', desc: 'Transcript / Calendar Event' },
    { label: 'UNDERSTANDING', desc: 'Natural Language Intent' },
    { label: 'PLANNING AGENT', desc: 'Routine Synthesis' },
    { label: 'PRIORITY AGENT', desc: 'Score Urgency & Impact' },
    { label: 'TIME AGENT', desc: 'Duration Estimation' },
    { label: 'CONFLICT AGENT', desc: 'Defend Sleep & Hard Events' },
    { label: 'ADAPTATION AGENT', desc: 'Generate Alternatives' },
    { label: 'USER CONFIRMATION', desc: 'Human Approval' },
    { label: 'ACTION', desc: 'Update Live Schedule' },
    { label: 'OBSERVE & MONITOR', desc: 'Track Completion' },
    { label: 'LEARNING AGENT', desc: 'Update Prior Estimates' },
    { label: 'FUTURE IMPROVEMENT', desc: 'Refined Next Day' }
  ];

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationIndex(0);
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setSimulationIndex(idx);
      if (idx >= workflowSteps.length) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 700);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#2a2a45] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#7c6cff]/15 to-[#00e0c8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e0c8]/10 border border-[#00e0c8]/30 text-[#00e0c8] text-xs font-semibold mb-3">
              <Brain className="w-3.5 h-3.5" />
              <span>Multi-Agent Architecture · 7 Autonomous Agents</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Adaptive Intelligence Control Loop
            </h1>
            <p className="text-xs sm:text-sm text-[#a0a0c0] mt-1 max-w-xl">
              AdaptiveOS does not rely solely on an LLM for scheduling. It employs a hybrid architecture: deterministic Python algorithms for time bounds, sleep protection, and mathematical conflict checks, paired with GenAI for natural language intent and personalized rationale.
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-5 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#00e0c8] to-[#7c6cff] text-[#0a0a12] shadow-xl shadow-[#00e0c8]/20 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-[#0a0a12]" />
            <span>{isSimulating ? 'Simulating Agent Pipeline...' : 'Simulate 12-Step Loop'}</span>
          </button>
        </div>

        {/* Live Step Progression Bar */}
        <div className="mt-8 pt-6 border-t border-[#2a2a45]/60 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-[780px]">
            {workflowSteps.map((step, idx) => {
              const isCurrent = isSimulating && simulationIndex === idx;
              const isPassed = isSimulating && simulationIndex > idx;
              return (
                <React.Fragment key={step.label}>
                  <div className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                    isCurrent
                      ? 'border-[#00e0c8] bg-[#00e0c8]/20 scale-105 shadow-md shadow-[#00e0c8]/20'
                      : isPassed
                      ? 'border-[#10b981]/50 bg-[#10b981]/10 text-white'
                      : 'border-[#2a2a45] bg-[#11111f] text-[#a0a0c0]'
                  }`}>
                    <span className="text-[10px] font-mono font-bold">{step.label}</span>
                    <span className="text-[9px] opacity-75 mt-0.5 line-clamp-1">{step.desc}</span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isPassed ? 'text-[#10b981]' : 'text-[#a0a0c0]/40'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7 Agents Cards Grid */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#ff5fa2]" />
          <span>Active Agent Nodes & Decision Roles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="glass-panel rounded-2xl p-5 border border-[#2a2a45] hover:border-[#7c6cff]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${agent.color}25`, color: agent.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                      agent.status === 'Active'
                        ? 'bg-[#10b981]/20 text-[#10b981]'
                        : agent.status === 'Processing'
                        ? 'bg-[#ff5fa2]/20 text-[#ff5fa2] animate-pulse'
                        : 'bg-[#a0a0c0]/20 text-[#a0a0c0]'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{agent.title}</h3>
                  <div className="text-[11px] font-semibold text-[#00e0c8]">{agent.role}</div>
                  <p className="text-xs text-[#a0a0c0] mt-2 leading-relaxed">
                    {agent.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2a2a45]/60 text-xs">
                  <div className="text-[10px] uppercase font-mono text-[#a0a0c0] mb-1">
                    Latest Decision Output:
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0a0a12]/80 border border-white/5 font-mono text-[11px] text-[#e0e0f0]">
                    {agent.sampleOutput}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
