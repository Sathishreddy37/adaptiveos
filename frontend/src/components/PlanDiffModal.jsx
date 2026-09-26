import React from 'react';
import {
  Sparkles,
  Check,
  X,
  Shield,
  ArrowRight,
  Clock,
  AlertTriangle,
  MoveRight,
  ShieldCheck
} from 'lucide-react';
import { decideProposal } from '../api';

export default function PlanDiffModal({ proposal, isOpen, onClose, onRefreshSchedule }) {
  if (!isOpen || !proposal) return null;

  const handleDecision = async (approved) => {
    try {
      await decideProposal(proposal.id, approved);
      onRefreshSchedule();
      onClose();
    } catch (err) {
      alert("Error submitting decision: " + err.message);
    }
  };

  const beforeBlocks = proposal.before_blocks || [];
  const proposedBlocks = proposal.proposed_blocks || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow max-w-4xl w-full max-h-[90vh] rounded-3xl border border-[#2a2a45] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#2a2a45] flex items-center justify-between bg-[#11111f]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff5fa2] to-[#7c6cff] flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Autonomous Replan Proposal & Diff</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff5fa2]/20 text-[#ff5fa2]">
                  Human-in-the-Loop Gate
                </span>
              </h2>
              <p className="text-xs text-[#a0a0c0]">
                Every schedule adjustment requires explicit human review and approval.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#a0a0c0] hover:text-white hover:bg-[#151527] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Highlights & Sleep Check Guard */}
        <div className="p-5 bg-[#0a0a12]/70 border-b border-[#2a2a45] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff5fa2] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>What Changed and Why</span>
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 flex items-center gap-1.5 self-start">
              <ShieldCheck className="w-4 h-4" />
              <span>Sleep Schedule: 100% Protected (23:00 – 07:00)</span>
            </span>
          </div>

          <div className="space-y-2">
            {proposal.diff_summary?.map((diff, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#151527] border border-[#2a2a45] text-xs text-white"
              >
                <ArrowRight className="w-4 h-4 text-[#00e0c8] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{diff}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Stream */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Before */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2a2a45]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a0a0c0]">
                Before (Original Schedule)
              </span>
              <span className="text-[10px] text-[#a0a0c0] font-mono">{beforeBlocks.length} Blocks</span>
            </div>

            <div className="space-y-2">
              {beforeBlocks.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-[#11111f] border border-[#2a2a45] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white/90">{b.title}</span>
                    <span className="font-mono text-[10px] text-[#a0a0c0]">{b.start_time} - {b.end_time}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#7c6cff]">{b.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Proposed After */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2a2a45]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00e0c8]">
                Proposed After (Adaptive Replan)
              </span>
              <span className="text-[10px] text-[#00e0c8] font-mono">{proposedBlocks.length} Blocks</span>
            </div>

            <div className="space-y-2">
              {proposedBlocks.map((b) => {
                const isUrgent = b.title?.toLowerCase().includes('assignment') || b.color === '#ef4444';
                const isMoved = b.status === 'moved' || String(b.start_time).startsWith('Tomorrow');

                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                      isUrgent
                        ? 'bg-[#ef4444]/15 border-[#ef4444]/50 shadow-md shadow-[#ef4444]/10'
                        : isMoved
                        ? 'bg-[#f59e0b]/15 border-[#f59e0b]/40 border-dashed'
                        : 'bg-[#11111f] border-[#2a2a45]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{b.title}</span>
                      <span className={`font-mono text-[10px] font-bold ${isUrgent ? 'text-[#ef4444]' : isMoved ? 'text-[#f59e0b]' : 'text-[#a0a0c0]'}`}>
                        {b.start_time} - {b.end_time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#00e0c8]">{b.category}</span>
                      {isUrgent && (
                        <span className="text-[10px] font-bold text-[#ef4444] bg-[#ef4444]/20 px-1.5 py-0.2 rounded">
                          Added (Urgent)
                        </span>
                      )}
                      {isMoved && (
                        <span className="text-[10px] font-bold text-[#f59e0b] bg-[#f59e0b]/20 px-1.5 py-0.2 rounded">
                          Moved to Tomorrow
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-5 border-t border-[#2a2a45] bg-[#11111f]/90 flex items-center justify-end gap-3">
          <button
            onClick={() => handleDecision(false)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2a2a45] hover:bg-[#323250] text-[#a0a0c0] hover:text-white transition-all flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Discard Proposed Plan</span>
          </button>
          <button
            onClick={() => handleDecision(true)}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:opacity-95 shadow-lg shadow-[#10b981]/25 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Accept & Commit Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
}
