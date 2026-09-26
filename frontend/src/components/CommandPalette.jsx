import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  Sparkles,
  Calendar,
  Home,
  Clock,
  MessageSquare,
  Brain,
  Users,
  Mic,
  BarChart,
  Shield,
  User,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  Check
} from 'lucide-react';
import { PERSONAS } from '../data/personas';
import { playTap, playSuccess, toggleSound, isSoundMuted } from '../utils/sound';

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onSelectPersona,
  onRunDemo,
  onResetSchedule,
  onOpenLogs,
  onOpenOnboarding,
  onTestChime
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allItems = [
    // Navigation
    { id: 'nav-home', category: 'Navigation', label: 'Go to Home Dashboard', icon: Home, action: () => onNavigate('home') },
    { id: 'nav-schedule', category: 'Navigation', label: 'Go to Adaptive Schedule', icon: Calendar, action: () => onNavigate('schedule') },
    { id: 'nav-momclock', category: 'Navigation', label: 'Go to Mom Clock & Alarms', icon: Clock, action: () => onNavigate('momclock') },
    { id: 'nav-assistant', category: 'Navigation', label: 'Go to AI Assistant', icon: MessageSquare, action: () => onNavigate('assistant') },
    { id: 'nav-workflow', category: 'Navigation', label: 'Go to 7-Agent Autonomous Loop', icon: Brain, action: () => onNavigate('workflow') },
    { id: 'nav-family', category: 'Navigation', label: 'Go to Family & Trusted Support', icon: Users, action: () => onNavigate('family') },
    { id: 'nav-voice', category: 'Navigation', label: 'Go to Voice Profiles', icon: Mic, action: () => onNavigate('voice') },
    { id: 'nav-analytics', category: 'Navigation', label: 'Go to Life & Routine Analytics', icon: BarChart, action: () => onNavigate('analytics') },
    { id: 'nav-admin', category: 'Navigation', label: 'Go to Admin & Fleet Operations', icon: Shield, action: () => onNavigate('admin') },
    { id: 'nav-profile', category: 'Navigation', label: 'Go to Profile & Privacy Settings', icon: User, action: () => onNavigate('profile') },

    // Personas
    ...Object.entries(PERSONAS).map(([key, p]) => ({
      id: `persona-${key}`,
      category: 'Switch Persona',
      label: `Switch to ${p.name} (${p.roleTag})`,
      icon: Sparkles,
      color: p.avatarAccent,
      action: () => onSelectPersona(key)
    })),

    // Quick Actions
    {
      id: 'act-demo',
      category: 'Quick Action',
      label: 'Simulate 4:00 PM Surprise Assignment Replan',
      icon: Play,
      badge: 'Section 5',
      action: () => {
        onRunDemo();
      }
    },
    {
      id: 'act-onboarding',
      category: 'Quick Action',
      label: 'Launch 3D Living Guide Requirement Intake',
      icon: Sparkles,
      badge: 'First Page',
      action: () => onOpenOnboarding()
    },
    {
      id: 'act-logs',
      category: 'Quick Action',
      label: 'Audit 7-Agent Decision Logs',
      icon: Brain,
      action: () => onOpenLogs()
    },
    {
      id: 'act-chime',
      category: 'Quick Action',
      label: 'Play Morning Harmonic Chime',
      icon: Volume2,
      action: () => onTestChime()
    },
    {
      id: 'act-sound',
      category: 'Preferences',
      label: isSoundMuted() ? 'Unmute Audio Feedback' : 'Mute Audio Feedback',
      icon: isSoundMuted() ? Volume2 : VolumeX,
      action: () => {
        toggleSound();
      }
    },
    {
      id: 'act-reset',
      category: 'Quick Action',
      label: 'Reset Schedule to Baseline State',
      icon: RotateCcw,
      action: () => onResetSchedule()
    }
  ];

  const filteredItems = allItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      playTap();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      playTap();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const executeItem = (item) => {
    playSuccess();
    item.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#111122]/95 border border-[#2a2a48] rounded-2xl shadow-2xl shadow-[#7c6cff]/10 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#2a2a45] gap-3 bg-[#151528]/80">
          <Search className="w-5 h-5 text-[#7c6cff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search screens, personas, replans, or quick actions... (or type ⌘K)"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#6a6a8e]"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1e1e36] text-[#a0a0c0] rounded border border-[#2a2a45]">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[#2a2a45]/30">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#7e7e9a]">
              No matching actions or commands found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#7c6cff]/20 to-[#ff5fa2]/20 border border-[#7c6cff]/50 text-white'
                      : 'text-[#c0c0d8] hover:bg-[#181830] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#7c6cff] text-white shadow-sm' : 'bg-[#1b1b32] text-[#8e8ea8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-[#717192]">{item.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ff5fa2]/20 text-[#ff5fa2] border border-[#ff5fa2]/40">
                        {item.badge}
                      </span>
                    )}
                    {isSelected && (
                      <span className="flex items-center text-[10px] text-[#7c6cff] font-semibold gap-1">
                        <span>Execute</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#0e0e1a] border-t border-[#2a2a45] flex items-center justify-between text-[11px] text-[#787898]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[#1c1c30] text-[10px] text-white">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#1c1c30] text-[10px] text-white">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[#1c1c30] text-[10px] text-white">↵</kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="text-[#a0a0c0]">AdaptiveOS Spotlight</span>
        </div>
      </div>
    </div>
  );
}
