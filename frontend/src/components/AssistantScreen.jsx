import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Check,
  X,
  Clock,
  ArrowRight,
  Shield,
  RotateCcw,
  Zap,
  Mic,
  Volume2
} from 'lucide-react';
import { triggerReplan, decideProposal } from '../api';

export default function AssistantScreen({
  onRefreshSchedule,
  onOpenLogs,
  pendingProposals,
  onOpenDiffModal
}) {
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello Sathish! I'm AdaptiveOS, your personal life coordinator. I observe your day, reason about your constraints, and keep your schedule balanced. How can I help you right now?",
      timestamp: '08:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProposal, setActiveProposal] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeProposal]);

  // Sync pending proposals
  useEffect(() => {
    if (pendingProposals && pendingProposals.length > 0) {
      setActiveProposal(pendingProposals[0]);
    } else {
      setActiveProposal(null);
    }
  }, [pendingProposals]);

  const quickPrompts = [
    "I got an assignment. I need it finished by tomorrow.",
    "I'm tired. Move my study session to tomorrow.",
    "Wake me at 6 AM and enable Mom's voice assistance.",
    "Check if any upcoming task conflicts with my sleep."
  ];

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isProcessing) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await triggerReplan({
        transcript: text,
        current_time: "16:00"
      });

      const aiReplyText = response.agent_response?.chat_reply ||
        "I've evaluated your request across all 7 agents and generated an adaptive response.";

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        proposal: response.proposal_id ? {
          id: response.proposal_id,
          diff_summary: response.diff_summary,
          proposed_blocks: response.proposed_blocks,
          sleep_health_guard: response.sleep_health_guard
        } : null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      if (response.proposal_id) {
        setActiveProposal({
          id: response.proposal_id,
          diff_summary: response.diff_summary,
          proposed_blocks: response.proposed_blocks
        });
      }
      onRefreshSchedule();
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `Error processing request: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecision = async (proposalId, approved) => {
    try {
      await decideProposal(proposalId, approved);
      setActiveProposal(null);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-dec-${Date.now()}`,
          sender: 'ai',
          text: approved
            ? "✅ Plan confirmed and committed! Your active schedule has been updated with the moved project block and protected sleep."
            : "❌ Proposed changes discarded. Your previous schedule remains completely intact.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      onRefreshSchedule();
    } catch (err) {
      alert("Failed to commit decision: " + err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] animate-fade-in">
      {/* Main Chat Stream */}
      <div className="lg:col-span-3 glass-panel rounded-2xl border border-[#2a2a45] flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#2a2a45] flex items-center justify-between bg-[#11111f]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7c6cff] to-[#ff5fa2] p-[1.5px]">
              <div className="w-full h-full bg-[#0a0a12] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#ff5fa2]" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Adaptive Life Coordinator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981]">
                  Online
                </span>
              </h2>
              <p className="text-[11px] text-[#a0a0c0]">
                Perceives interruptions, checks sleep guardrails, and negotiates solutions.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenLogs}
            className="text-xs text-[#00e0c8] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View 7-Agent Chain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi ? 'bg-[#7c6cff]/20 text-[#7c6cff] border border-[#7c6cff]/40' : 'bg-[#00e0c8]/20 text-[#00e0c8] border border-[#00e0c8]/40'
                }`}>
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-3 max-w-xl">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isAi
                      ? 'bg-[#151527] text-white border border-[#2a2a45]'
                      : 'bg-gradient-to-r from-[#7c6cff] to-[#6366f1] text-white'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="block text-[10px] text-[#a0a0c0] mt-2 text-right">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Inline Replan Proposal Card */}
                  {msg.proposal && (
                    <div className="p-4 rounded-2xl border border-[#ff5fa2]/40 bg-[#1f1025]/80 shadow-lg shadow-[#ff5fa2]/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#ff5fa2] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Proposed Schedule Diff
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Sleep 100% Protected
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-white/90">
                        {msg.proposal.diff_summary?.map((diff, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2 bg-[#11111f]/60 p-2.5 rounded-xl border border-white/5">
                            <ArrowRight className="w-3.5 h-3.5 text-[#00e0c8] shrink-0 mt-0.5" />
                            <span>{diff}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleDecision(msg.proposal.id, true)}
                          className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center gap-1.5 shadow transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Commit Plan</span>
                        </button>
                        <button
                          onClick={() => handleDecision(msg.proposal.id, false)}
                          className="py-2 px-3 rounded-xl text-xs font-semibold bg-[#2a2a45] hover:bg-[#323250] text-[#a0a0c0] hover:text-white transition-all flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Discard</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-3 text-xs text-[#a0a0c0] animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-[#7c6cff]/10 border border-[#7c6cff]/30 flex items-center justify-center text-[#7c6cff]">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span>7 Agents are reasoning, checking conflicts, and balancing timeline...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#2a2a45] bg-[#11111f]/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 'I got an assignment. I need it finished by tomorrow.'"
              className="flex-1 bg-[#151527] border border-[#2a2a45] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#a0a0c0] focus:outline-none focus:border-[#7c6cff] transition-colors"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#7c6cff] hover:bg-[#6a58f5] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#7c6cff]/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar: One-Click Demo Prompts & Control Loop Status */}
      <div className="space-y-4">
        <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ff5fa2]" />
            <h3 className="text-sm font-bold text-white">Suggested Inputs</h3>
          </div>
          <p className="text-[11px] text-[#a0a0c0]">
            Click any prompt to trigger the multi-agent control loop:
          </p>

          <div className="space-y-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="w-full text-left p-2.5 rounded-xl bg-[#11111f] hover:bg-[#1a1a2e] border border-[#2a2a45] hover:border-[#7c6cff]/40 text-xs text-white/90 transition-all leading-snug group"
              >
                <span className="group-hover:text-[#00e0c8] transition-colors">{p}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#10b981]" />
            <h3 className="text-sm font-bold text-white">Non-Negotiable Rules</h3>
          </div>
          <ul className="text-xs text-[#a0a0c0] space-y-2 list-disc list-inside">
            <li><strong className="text-white">Sleep Protection:</strong> Conflict Agent never silently cuts your 8hr rest.</li>
            <li><strong className="text-white">Visible Diff:</strong> Every schedule change generates an explicit explanation.</li>
            <li><strong className="text-white">User Approval:</strong> Changes are only committed when you click Accept.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
