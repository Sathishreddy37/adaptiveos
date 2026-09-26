import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoveRight,
  Plus,
  Check,
  X,
  Zap,
  Info
} from 'lucide-react';
import { playTap, playSuccess, playAlert } from '../utils/sound';

export default function ScheduleScreen({
  schedule,
  pendingProposals,
  onOpenDiffModal,
  onResetSchedule,
  onTriggerFastReplan
}) {
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const [filterCategory, setFilterCategory] = useState('all');
  const [completedMap, setCompletedMap] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('study');
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('15:30');
  const [customBlocks, setCustomBlocks] = useState([]);

  const baseBlocks = schedule?.blocks || [];
  const allBlocks = [...baseBlocks, ...customBlocks];

  const categoryColors = {
    study: { bg: 'bg-[#7c6cff]/15', border: 'border-[#7c6cff]/40', text: 'text-[#a78bfa]', badge: 'bg-[#7c6cff]' },
    work: { bg: 'bg-[#3b82f6]/15', border: 'border-[#3b82f6]/40', text: 'text-[#60a5fa]', badge: 'bg-[#3b82f6]' },
    sleep: { bg: 'bg-[#6366f1]/20', border: 'border-[#6366f1]/50', text: 'text-[#818cf8]', badge: 'bg-[#6366f1]' },
    break: { bg: 'bg-[#14b8a6]/15', border: 'border-[#14b8a6]/40', text: 'text-[#2dd4bf]', badge: 'bg-[#14b8a6]' },
    health: { bg: 'bg-[#ec4899]/15', border: 'border-[#ec4899]/40', text: 'text-[#f472b6]', badge: 'bg-[#ec4899]' },
    routine: { bg: 'bg-[#10b981]/15', border: 'border-[#10b981]/40', text: 'text-[#34d399]', badge: 'bg-[#10b981]' },
  };

  const filteredBlocks = allBlocks.filter(b => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory;
  });

  const pendingProposal = pendingProposals && pendingProposals.length > 0 ? pendingProposals[0] : null;

  const toggleComplete = (id) => {
    playTap();
    setCompletedMap(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        playSuccess();
      }
      return next;
    });
  };

  const handleAddCustomBlock = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newBlock = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      start_time: newStartTime,
      end_time: newEndTime,
      status: 'confirmed'
    };
    setCustomBlocks(prev => [...prev, newBlock]);
    setNewTitle('');
    setIsAddModalOpen(false);
    playSuccess();
  };

  // 7-day week schedule generator
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with View Controls & Actions */}
      <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Adaptive Schedule Timeline</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#00e0c8]/10 text-[#00e0c8] border border-[#00e0c8]/30">
              Living Schedule
            </span>
          </div>
          <p className="text-xs text-[#a0a0c0] mt-0.5">
            Balanced autonomously by 7 agents. Safeguards sleep windows and dynamically reorganizes around surprises.
          </p>
        </div>

        {/* View mode switcher & actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Day / Week / Month Mode Buttons */}
          <div className="bg-[#11111f] p-1 rounded-xl border border-[#2a2a45] flex items-center">
            {['day', 'week', 'month'].map((m) => (
              <button
                key={m}
                onClick={() => {
                  playTap();
                  setViewMode(m);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  viewMode === m
                    ? 'bg-gradient-to-r from-[#7c6cff] to-[#6366f1] text-white shadow'
                    : 'text-[#a0a0c0] hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Quick Add Block Button */}
          <button
            onClick={() => {
              playTap();
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1a1a32] hover:bg-[#252545] text-white border border-[#2a2a45] transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#00e0c8]" />
            <span>Add Event</span>
          </button>

          {/* Fast Replan Trigger */}
          <button
            onClick={async () => {
              playAlert();
              await onTriggerFastReplan();
              playSuccess();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff5fa2]/20 hover:bg-[#ff5fa2]/30 text-[#ff5fa2] border border-[#ff5fa2]/40 transition-all flex items-center gap-1.5"
            title="Simulate sudden 4:00 PM new assignment arrival"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulate Surprise</span>
          </button>

          {/* Compare Diff Button if Pending */}
          {pendingProposal && (
            <button
              onClick={() => {
                playTap();
                onOpenDiffModal(pendingProposal);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff5fa2] text-white hover:bg-[#ff4090] shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Compare Diff</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[#a0a0c0] flex items-center gap-1 shrink-0 font-medium pl-1">
          <Filter className="w-3.5 h-3.5 text-[#7c6cff]" /> Category:
        </span>
        {['all', 'study', 'work', 'sleep', 'break', 'health', 'routine'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playTap();
              setFilterCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-xl capitalize shrink-0 font-medium transition-all ${
              filterCategory === cat
                ? 'bg-gradient-to-r from-[#7c6cff]/30 to-[#00e0c8]/20 text-white border border-[#7c6cff]/50 font-semibold shadow-sm'
                : 'text-[#a0a0c0] hover:text-white hover:bg-[#151527] border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Day Timeline View */}
      {viewMode === 'day' && (
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2a2a45] gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <CalendarIcon className="w-4 h-4 text-[#7c6cff]" />
              <span>Today's Chronological Flow (00:00 – 24:00)</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-[#10b981]">
                <ShieldCheck className="w-4 h-4" />
                <span>Sleep Protected (23:00 – 07:00)</span>
              </div>
              <div className="text-[#a0a0c0]">
                Completed: <span className="font-bold text-white">{Object.values(completedMap).filter(Boolean).length}</span> / {filteredBlocks.length}
              </div>
            </div>
          </div>

          {/* Interactive Timeline Blocks List */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#2a2a45] space-y-4 py-3">
            {/* Live Time Laser Line Marker at ~16:00 / Interactive Replan Moment */}
            <div className="relative -ml-6 sm:-ml-8 my-2 flex items-center gap-2 group">
              <div className="w-4 h-4 rounded-full bg-[#ef4444] border-2 border-white shadow-lg shadow-[#ef4444]/60 z-10 animate-pulse flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-[#ef4444] via-[#ff5fa2] to-transparent shadow-sm shadow-[#ef4444]/50" />
              <span className="font-mono text-[11px] font-bold text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 px-2 py-0.5 rounded-md">
                16:00 · Active Context & Replan Trigger Window
              </span>
            </div>

            {filteredBlocks.map((block) => {
              const theme = categoryColors[block.category] || categoryColors.work;
              const isUrgent = block.title.toLowerCase().includes('assignment') || block.color === '#ef4444';
              const isMoved = block.status === 'moved' || String(block.start_time).startsWith('Tomorrow');
              const isDone = Boolean(completedMap[block.id]);

              return (
                <div
                  key={block.id}
                  className={`relative p-4 rounded-xl border transition-all duration-300 transform hover:-translate-y-0.5 ${
                    isDone
                      ? 'bg-[#111120]/60 border-[#2a2a40] opacity-60'
                      : isUrgent
                      ? 'bg-[#ef4444]/15 border-[#ef4444]/50 shadow-lg shadow-[#ef4444]/15'
                      : isMoved
                      ? 'bg-[#f59e0b]/10 border-[#f59e0b]/40 border-dashed'
                      : `${theme.bg} ${theme.border}`
                  }`}
                >
                  {/* Timeline indicator node */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a12] transition-colors ${
                      isDone
                        ? 'bg-[#10b981]'
                        : isUrgent
                        ? 'bg-[#ef4444] animate-ping'
                        : isMoved
                        ? 'bg-[#f59e0b]'
                        : block.is_sleep
                        ? 'bg-[#6366f1]'
                        : 'bg-[#00e0c8]'
                    }`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Interactive completion checkbox */}
                      <button
                        onClick={() => toggleComplete(block.id)}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-[#10b981] border-[#10b981] text-white'
                            : 'border-[#444466] hover:border-[#7c6cff] bg-[#0d0d1b]'
                        }`}
                        title={isDone ? "Mark incomplete" : "Mark completed"}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white ${
                            isUrgent ? 'bg-[#ef4444]' : isMoved ? 'bg-[#f59e0b]' : theme.badge
                          }`}>
                            {isMoved ? 'Rescheduled' : block.category}
                          </span>

                          {block.is_sleep && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6366f1]/30 text-[#818cf8] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Protected Anchor
                            </span>
                          )}

                          {isUrgent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ef4444]/20 text-[#ef4444] animate-pulse">
                              High Priority Replan
                            </span>
                          )}
                        </div>

                        <h3 className={`text-base font-bold text-white mt-1.5 ${isDone ? 'line-through text-[#8080a0]' : ''}`}>
                          {block.title}
                        </h3>

                        {isMoved && (
                          <p className="text-xs text-[#f59e0b] mt-1 flex items-center gap-1 font-medium">
                            <MoveRight className="w-3.5 h-3.5" />
                            <span>Shifted to accommodate urgent deadline without violating sleep curfew</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Time pill */}
                    <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs font-semibold text-white/90 bg-[#0a0a12]/70 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-[#00e0c8]" />
                      <span>{block.start_time} – {block.end_time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real 7-Day Multi-Day Week Matrix View */}
      {viewMode === 'week' && (
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2a45]">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <CalendarIcon className="w-4 h-4 text-[#7c6cff]" />
              <span>7-Day Living Rhythm Matrix</span>
            </div>
            <span className="text-xs text-[#00e0c8]">Adaptive Routine Synchronization</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === 1; // Tuesday / today marker
              return (
                <div
                  key={day}
                  className={`rounded-xl p-3 border flex flex-col space-y-2.5 transition-all ${
                    isToday
                      ? 'bg-[#181830] border-[#7c6cff]/50 shadow-md shadow-[#7c6cff]/10'
                      : 'bg-[#111122]/70 border-[#222238]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="text-xs font-bold text-white">{day.slice(0, 3)}</span>
                    {isToday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#7c6cff] text-white">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Day Blocks Preview */}
                  <div className="space-y-1.5 flex-1">
                    {allBlocks.slice(0, 4).map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-1.5 rounded-lg bg-[#0a0a14] border border-white/5 text-[11px]"
                      >
                        <div className="font-semibold text-white truncate">{b.title}</div>
                        <div className="text-[9px] text-[#8e8eb0] font-mono">{b.start_time}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-center text-[#10b981] font-semibold pt-1 border-t border-white/5">
                    7h Sleep Protected
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2a45]">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <CalendarIcon className="w-4 h-4 text-[#7c6cff]" />
              <span>Monthly Circadian & Consistency Overview</span>
            </div>
            <span className="text-xs text-[#10b981]">98.2% Sleep Window Adherence</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="font-bold text-[#8e8eb0] py-1">{d}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(dayNum => {
              const isCurrent = dayNum === 15;
              const hasAlert = dayNum === 16;
              return (
                <div
                  key={dayNum}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between min-h-[60px] transition-all ${
                    isCurrent
                      ? 'bg-[#7c6cff]/20 border-[#7c6cff] text-white font-bold'
                      : hasAlert
                      ? 'bg-[#ff5fa2]/15 border-[#ff5fa2]/40 text-white'
                      : 'bg-[#121224] border-[#222238] text-[#a0a0c0] hover:border-white/20'
                  }`}
                >
                  <span className="text-xs">{dayNum}</span>
                  <div className="flex gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    {hasAlert && <span className="w-1.5 h-1.5 rounded-full bg-[#ff5fa2]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Block Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#121226] border border-[#2a2a48] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2a45] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00e0c8]" />
                <span>Add Event to Schedule</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#a0a0c0] hover:text-white hover:bg-[#1f1f3a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomBlock} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a0a0c0] mb-1 font-semibold">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Model Training or Doctor Follow-up"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#191932] border border-[#2a2a48] text-white outline-none focus:border-[#7c6cff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a0a0c0] mb-1 font-semibold">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#191932] border border-[#2a2a48] text-white outline-none focus:border-[#7c6cff]"
                  />
                </div>
                <div>
                  <label className="block text-[#a0a0c0] mb-1 font-semibold">End Time</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#191932] border border-[#2a2a48] text-white outline-none focus:border-[#7c6cff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a0a0c0] mb-1 font-semibold">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#191932] border border-[#2a2a48] text-white outline-none focus:border-[#7c6cff]"
                >
                  <option value="study">Study</option>
                  <option value="work">Work</option>
                  <option value="health">Health & Wellness</option>
                  <option value="routine">Routine</option>
                  <option value="break">Break / Leisure</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a0a0c0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7c6cff] text-white hover:bg-[#6a58f5]"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
