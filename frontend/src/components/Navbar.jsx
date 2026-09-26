import React from 'react';
import {
  Sparkles,
  Calendar,
  Home,
  MessageSquare,
  Users,
  Mic,
  Play,
  RotateCcw,
  Activity,
  ExternalLink,
  Clock,
  Brain,
  BarChart,
  Shield,
  User,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  currentScreen,
  setCurrentScreen,
  onRunDemo,
  onResetSchedule,
  onOpenLogs,
  pendingProposalCount,
  persona,
  onOpenOnboarding
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'momclock', label: 'Mom Clock', icon: Clock },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, badge: pendingProposalCount > 0 ? '1' : null },
    { id: 'workflow', label: 'Agents', icon: Brain },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a12]/85 backdrop-blur-xl border-b border-[#2a2a45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5fa2] via-[#7c6cff] to-[#00e0c8] p-[1.5px] shadow-lg shadow-[#ff5fa2]/15">
              <div className="w-full h-full bg-[#0a0a12] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#ff5fa2] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
                Adaptive<span className="bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] bg-clip-text text-transparent">OS</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e0c8] animate-ping" />
                <span className="text-[9px] font-mono tracking-wider uppercase text-[#a0a0c0]">
                  7 Agents
                </span>
              </div>
            </div>
          </div>

          {/* Active Persona Pill / Switcher */}
          {persona && (
            <button
              onClick={onOpenOnboarding}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#16162a] hover:bg-[#202038] border border-[#2a2a45] text-xs transition-colors"
              title="Click to change Persona or rerun 3D Onboarding Guide"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: persona.avatarAccent || '#7c6cff' }}
              />
              <span className="font-semibold text-white">{persona.name}</span>
              <span className="text-[10px] text-[#a0a0c0]">({persona.roleTag})</span>
              <ChevronDown className="w-3 h-3 text-[#a0a0c0]" />
            </button>
          )}
        </div>

        {/* Center: Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#151527]/90 p-1.5 rounded-2xl border border-[#2a2a45]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#7c6cff] to-[#6366f1] text-white shadow-md shadow-[#7c6cff]/25'
                    : 'text-[#a0a0c0] hover:text-white hover:bg-[#2a2a45]/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#ef4444] text-white animate-bounce">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Section 5 Demo Button */}
          <button
            onClick={onRunDemo}
            title="Run Section 5 scripted demo: 4:00 PM new assignment arrival"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ff5fa2] to-[#7c6cff] text-white hover:opacity-95 shadow-md shadow-[#ff5fa2]/20 transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Run 4:00 PM Demo</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetSchedule}
            title="Reset schedule to standard baseline state"
            className="p-2 rounded-xl text-[#a0a0c0] hover:text-white hover:bg-[#151527] border border-[#2a2a45] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Agent Decision Logs Button */}
          <button
            onClick={onOpenLogs}
            title="View 7-Agent Decision Logs & Audit Trail"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#00e0c8] bg-[#00e0c8]/10 hover:bg-[#00e0c8]/20 border border-[#00e0c8]/30 transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Decision Logs</span>
          </button>

          {/* 3D Landing Page Link */}
          <a
            href="http://localhost:8000/landing"
            target="_blank"
            rel="noopener noreferrer"
            title="Open 3D Landing Page"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-[#a0a0c0] hover:text-white border border-[#2a2a45] hover:bg-[#151527] transition-colors"
          >
            <span>3D Site</span>
            <ExternalLink className="w-3 h-3 text-[#a0a0c0]" />
          </a>
        </div>
      </div>

      {/* Responsive Navigation Row (Tablet & Mobile) */}
      <div className="flex xl:hidden px-3 py-2 bg-[#11111f] border-t border-[#2a2a45] overflow-x-auto gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                active ? 'bg-[#7c6cff] text-white' : 'text-[#a0a0c0] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1 py-0.2 text-[9px] font-bold rounded-full bg-[#ef4444] text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
