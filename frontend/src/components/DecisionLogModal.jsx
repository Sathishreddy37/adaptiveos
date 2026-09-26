import React, { useState, useEffect } from 'react';
import {
  Activity,
  X,
  RefreshCw,
  Filter,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { fetchDecisionLogs } from '../api';

export default function DecisionLogModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAgent, setFilterAgent] = useState('all');

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const data = await fetchDecisionLogs();
      setLogs(data);
    } catch (err) {
      console.error("Error loading logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const agentNames = [
    'all',
    'Planning Agent',
    'Priority Agent',
    'Time Agent',
    'Conflict Agent',
    'Adaptation Agent',
    'Learning Agent',
    'Voice & Human Agent'
  ];

  const filteredLogs = logs.filter(l => {
    if (filterAgent === 'all') return true;
    return l.agent_name === filterAgent;
  });

  const getAgentColor = (name) => {
    if (name.includes('Planning')) return 'text-[#7c6cff] bg-[#7c6cff]/15 border-[#7c6cff]/30';
    if (name.includes('Priority')) return 'text-[#ff5fa2] bg-[#ff5fa2]/15 border-[#ff5fa2]/30';
    if (name.includes('Time')) return 'text-[#00e0c8] bg-[#00e0c8]/15 border-[#00e0c8]/30';
    if (name.includes('Conflict')) return 'text-[#ef4444] bg-[#ef4444]/15 border-[#ef4444]/30';
    if (name.includes('Adaptation')) return 'text-[#a855f7] bg-[#a855f7]/15 border-[#a855f7]/30';
    if (name.includes('Learning')) return 'text-[#3b82f6] bg-[#3b82f6]/15 border-[#3b82f6]/30';
    return 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow max-w-4xl w-full max-h-[85vh] rounded-3xl border border-[#2a2a45] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2a2a45] flex items-center justify-between bg-[#11111f]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00e0c8]/15 border border-[#00e0c8]/30 flex items-center justify-center text-[#00e0c8]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Agent Decision Logs & Audit Trail</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#7c6cff]/20 text-[#7c6cff]">
                  7 Agents Explainability
                </span>
              </h2>
              <p className="text-xs text-[#a0a0c0]">
                Every autonomous perception, constraint check, and replanning step is verified and logged.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadLogs}
              title="Refresh logs"
              className="p-2 rounded-xl text-[#a0a0c0] hover:text-white hover:bg-[#151527] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#a0a0c0] hover:text-white hover:bg-[#151527] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-3 border-b border-[#2a2a45] bg-[#0a0a12]/50 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#a0a0c0] flex items-center gap-1 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter by Agent:
          </span>
          {agentNames.map((name) => (
            <button
              key={name}
              onClick={() => setFilterAgent(name)}
              className={`px-3 py-1 rounded-lg shrink-0 font-medium capitalize transition-all ${
                filterAgent === name
                  ? 'bg-[#7c6cff] text-white shadow'
                  : 'text-[#a0a0c0] hover:text-white hover:bg-[#151527]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Log Entries Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#a0a0c0] animate-pulse">
              Loading agent logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#a0a0c0]">
              No decision logs found for this filter.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const colorClass = getAgentColor(log.agent_name);
              return (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-[#11111f] border border-[#2a2a45] hover:border-[#7c6cff]/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${colorClass}`}>
                        {log.agent_name}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {log.action}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#a0a0c0] font-mono">
                      <Clock className="w-3 h-3 text-[#00e0c8]" />
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#a0a0c0] leading-relaxed">
                    <strong className="text-white/90">Reasoning: </strong>
                    {log.reasoning}
                  </p>

                  {log.state_diff && Array.isArray(log.state_diff) && log.state_diff.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-[#00e0c8] uppercase tracking-wider block mb-1">
                        State Diff:
                      </span>
                      <div className="space-y-1">
                        {log.state_diff.map((d, di) => (
                          <div key={di} className="text-[11px] text-white/80 bg-[#0a0a12] p-2 rounded-lg border border-white/5 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-[#00e0c8] shrink-0" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
