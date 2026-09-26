import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoveRight
} from 'lucide-react';

export default function ScheduleScreen({
  schedule,
  pendingProposals,
  onOpenDiffModal,
  onResetSchedule,
  onTriggerFastReplan
}) {
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const [filterCategory, setFilterCategory] = useState('all');

  const blocks = schedule?.blocks || [];

  const categoryColors = {
    study: { bg: 'bg-[#7c6cff]/20', border: 'border-[#7c6cff]/50', text: 'text-[#a78bfa]', badge: 'bg-[#7c6cff]' },
    work: { bg: 'bg-[#3b82f6]/20', border: 'border-[#3b82f6]/50', text: 'text-[#60a5fa]', badge: 'bg-[#3b82f6]' },
    sleep: { bg: 'bg-[#6366f1]/25', border: 'border-[#6366f1]/60', text: 'text-[#818cf8]', badge: 'bg-[#6366f1]' },
    break: { bg: 'bg-[#14b8a6]/20', border: 'border-[#14b8a6]/50', text: 'text-[#2dd4bf]', badge: 'bg-[#14b8a6]' },
    health: { bg: 'bg-[#ec4899]/20', border: 'border-[#ec4899]/50', text: 'text-[#f472b6]', badge: 'bg-[#ec4899]' },
    routine: { bg: 'bg-[#10b981]/20', border: 'border-[#10b981]/50', text: 'text-[#34d399]', badge: 'bg-[#10b981]' },
  };

  const filteredBlocks = blocks.filter(b => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory;
  });

  const pendingProposal = pendingProposals && pendingProposals.length > 0 ? pendingProposals[0] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with View Controls */}
      <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Adaptive Schedule Timeline</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#00e0c8]/10 text-[#00e0c8] border border-[#00e0c8]/20">
              Living Schedule
            </span>
          </div>
          <p className="text-xs text-[#a0a0c0] mt-0.5">
            Continuously balanced by the 7-agent loop. Rearranges seamlessly when real life intervenes.
          </p>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-[#11111f] p-1 rounded-xl border border-[#2a2a45] flex items-center">
            {['day', 'week', 'month'].map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  viewMode === m ? 'bg-[#7c6cff] text-white shadow' : 'text-[#a0a0c0] hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {pendingProposal && (
            <button
              onClick={() => onOpenDiffModal(pendingProposal)}
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
        <span className="text-[#a0a0c0] flex items-center gap-1 shrink-0 font-medium">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {['all', 'study', 'work', 'sleep', 'break', 'health', 'routine'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg capitalize shrink-0 font-medium transition-all ${
              filterCategory === cat
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-[#a0a0c0] hover:text-white hover:bg-[#151527]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Day Timeline View */}
      {viewMode === 'day' && (
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2a45]">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <CalendarIcon className="w-4 h-4 text-[#7c6cff]" />
              <span>Today's Chronological Flow (00:00 – 24:00)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#10b981]">
              <ShieldCheck className="w-4 h-4" />
              <span>Sleep Protected (23:00 – 07:00)</span>
            </div>
          </div>

          {/* Timeline Blocks List */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#2a2a45] space-y-4 py-2">
            {filteredBlocks.map((block) => {
              const theme = categoryColors[block.category] || categoryColors.work;
              const isUrgent = block.title.toLowerCase().includes('assignment') || block.color === '#ef4444';
              const isMoved = block.status === 'moved' || String(block.start_time).startsWith('Tomorrow');

              return (
                <div
                  key={block.id}
                  className={`relative p-4 rounded-xl border transition-all duration-300 transform hover:-translate-y-0.5 ${
                    isUrgent
                      ? 'bg-[#ef4444]/15 border-[#ef4444]/50 shadow-lg shadow-[#ef4444]/15'
                      : isMoved
                      ? 'bg-[#f59e0b]/10 border-[#f59e0b]/40 border-dashed'
                      : `${theme.bg} ${theme.border}`
                  }`}
                >
                  {/* Timeline indicator node */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a12] ${
                      isUrgent
                        ? 'bg-[#ef4444] animate-ping'
                        : isMoved
                        ? 'bg-[#f59e0b]'
                        : block.is_sleep
                        ? 'bg-[#6366f1]'
                        : 'bg-[#00e0c8]'
                    }`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
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

                      <h3 className="text-base font-bold text-white mt-1.5">
                        {block.title}
                      </h3>

                      {isMoved && (
                        <p className="text-xs text-[#f59e0b] mt-1 flex items-center gap-1 font-medium">
                          <MoveRight className="w-3.5 h-3.5" />
                          <span>Shifted to Tomorrow 10:00 AM by Adaptation Agent to accommodate urgent submission</span>
                        </p>
                      )}
                    </div>

                    {/* Time pill */}
                    <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs font-semibold text-white/90 bg-[#0a0a12]/60 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
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

      {/* Week / Month Placeholder View */}
      {viewMode !== 'day' && (
        <div className="glass-panel rounded-2xl p-12 border border-[#2a2a45] text-center space-y-3">
          <CalendarIcon className="w-10 h-10 text-[#7c6cff] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-white capitalize">{viewMode} Multi-Day View</h3>
          <p className="text-xs text-[#a0a0c0] max-w-md mx-auto">
            AdaptiveOS organizes 7-day recurring rhythms, tracking your average bedtime consistency and study hour quota across the week.
          </p>
          <button
            onClick={() => setViewMode('day')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7c6cff] text-white hover:bg-[#6a58f5]"
          >
            Switch to Detailed Day View
          </button>
        </div>
      )}
    </div>
  );
}
