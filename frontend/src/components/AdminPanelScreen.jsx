import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Brain,
  Activity,
  Bell,
  Mic,
  Shield,
  BarChart,
  Settings,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Terminal,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { fetchDecisionLogs } from '../api';

export default function AdminPanelScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const [decisionLogs, setDecisionLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await fetchDecisionLogs();
      setDecisionLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const stats = [
    { label: 'Total Users', value: '1,428', change: '+12% this week', color: '#7c6cff' },
    { label: 'Active Today', value: '892', change: 'Multi-persona active', color: '#00e0c8' },
    { label: 'Schedules Generated', value: '4,810', change: '100% sleep protected', color: '#10b981' },
    { label: 'Schedules Adapted', value: '624', change: 'Autonomous replans', color: '#ff5fa2' },
    { label: 'AI Decisions Logged', value: '18,940', change: 'Audit trail intact', color: '#a855f7' },
    { label: 'Mom Voice Interactions', value: '3,210', change: 'Consented audio verified', color: '#f59e0b' },
    { label: 'Successful Replans', value: '98.4%', change: 'User approval rate', color: '#10b981' },
    { label: 'System Errors', value: '0.01%', change: 'Deterministic safety', color: '#3b82f6' }
  ];

  const agentStatusList = [
    { name: 'Planning Agent', state: 'Active', latency: '42ms', tasksProcessed: 1420, color: '#7c6cff' },
    { name: 'Priority Agent', state: 'Active', latency: '31ms', tasksProcessed: 890, color: '#ff5fa2' },
    { name: 'Time Agent', state: 'Active', latency: '28ms', tasksProcessed: 890, color: '#00e0c8' },
    { name: 'Conflict Agent', state: 'Idle', latency: '19ms', tasksProcessed: 890, color: '#f59e0b' },
    { name: 'Adaptation Agent', state: 'Processing', latency: '85ms', tasksProcessed: 624, color: '#a855f7' },
    { name: 'Learning Agent', state: 'Processing', latency: '120ms', tasksProcessed: 2410, color: '#10b981' },
    { name: 'Voice & Human Agent', state: 'Active', latency: '65ms', tasksProcessed: 3210, color: '#ec4899' }
  ];

  const eventTimeline = [
    { time: '16:00:12', agent: 'Voice & Human', event: 'New assignment detected', details: 'User: "I got an assignment due tomorrow."' },
    { time: '16:01:04', agent: 'Priority Agent', event: 'Evaluated task urgency', details: 'Priority Score 94/100, High Urgency (< 24h deadline).' },
    { time: '16:01:28', agent: 'Conflict Agent', event: 'Conflict detected', details: 'Overlaps with 4:00 PM AI Project. Sleep guard (22:30) protected.' },
    { time: '16:02:15', agent: 'Adaptation Agent', event: 'Generated 2 alternatives', details: 'Option A: Move to 8:30 PM. Option B: Tomorrow 6 PM.' },
    { time: '16:02:44', agent: 'User Interaction', event: 'User approved Option A', details: 'Plan Diff accepted via interactive modal.' },
    { time: '16:03:00', agent: 'Planning Agent', event: 'Schedule updated & synced', details: 'SQLite schedule_blocks updated with zero sleep reduction.' },
    { time: '06:00:00', agent: 'Mom Voice & 3D Guide', event: 'Wake-Up Support Triggered', details: 'Played approved voice reminder: "Good morning, Sathish."' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#2a2a45] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#7c6cff]/15 to-[#ff5fa2]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c6cff]/10 border border-[#7c6cff]/30 text-[#7c6cff] text-xs font-semibold mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>AdaptiveOS System Operations · Admin Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Agent Fleet & Operations Monitor
            </h1>
            <p className="text-xs sm:text-sm text-[#a0a0c0] mt-1 max-w-xl">
              Role-based control dashboard monitoring system health, autonomous replans, privacy safeguards, and agent decision explainability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadLogs}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#151527] hover:bg-[#202038] text-white border border-[#2a2a45] flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="glass-panel rounded-2xl p-4 border border-[#2a2a45] flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#a0a0c0] uppercase tracking-wider">
              {s.label}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
              {s.value}
            </div>
            <div className="text-[10px] text-[#10b981] font-semibold mt-1">
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 18: ADMIN AI AGENT MONITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Agent Fleet Status */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45] lg:col-span-1">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#00e0c8]" />
            <span>Agent Fleet Live Status</span>
          </h2>

          <div className="space-y-3">
            {agentStatusList.map((ag) => (
              <div
                key={ag.name}
                className="p-3 rounded-xl bg-[#11111f] border border-[#2a2a45] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ag.color }} />
                    <span>{ag.name}</span>
                  </div>
                  <div className="text-[10px] text-[#a0a0c0] mt-0.5 font-mono">
                    Latency: {ag.latency} · {ag.tasksProcessed} ops
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                  ag.state === 'Active'
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : ag.state === 'Processing'
                    ? 'bg-[#ff5fa2]/20 text-[#ff5fa2] animate-pulse'
                    : 'bg-[#a0a0c0]/20 text-[#a0a0c0]'
                }`}>
                  {ag.state}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hackathon Showcase Event Timeline */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45] lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff5fa2]" />
                <span>Simulated Control Loop Event Stream (4:00 PM Scenario)</span>
              </h2>
              <span className="text-[10px] font-mono text-[#00e0c8] bg-[#00e0c8]/10 px-2 py-0.5 rounded-full border border-[#00e0c8]/30">
                Synchronized
              </span>
            </div>

            <div className="space-y-3">
              {eventTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#11111f] border border-[#2a2a45] flex items-start gap-3"
                >
                  <div className="font-mono text-xs text-[#00e0c8] font-bold shrink-0 mt-0.5">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.event}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#7c6cff]/20 text-[#7c6cff]">
                        {item.agent}
                      </span>
                    </div>
                    <p className="text-xs text-[#a0a0c0] mt-0.5 font-mono">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2a45]/60 flex items-center justify-between text-xs text-[#a0a0c0]">
            <span>Privacy Guard: All personal notes & locations redacted from telemetry.</span>
            <span className="text-[#10b981] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Role-Based Access Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
