import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
  Volume2,
  Activity,
  Bot
} from 'lucide-react';
import { runDemoScenario, decideProposal } from '../api';

export default function DemoRunner({ isOpen, onClose, onRefreshSchedule, onOpenDiffModal }) {
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoOutput, setDemoOutput] = useState(null);
  const [loading, setLoading] = useState(true);

  const initDemo = async () => {
    try {
      setLoading(true);
      const res = await runDemoScenario();
      setTimelineSteps(res.timeline_steps || []);
      setDemoOutput(res.replan_output);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    } catch (err) {
      alert("Error initializing demo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initDemo();
    }
  }, [isOpen]);

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying && timelineSteps.length > 0) {
      if (currentStepIdx < timelineSteps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIdx(prev => prev + 1);
        }, 1800);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, timelineSteps]);

  if (!isOpen) return null;

  const currentStep = timelineSteps[currentStepIdx] || {};

  const handleCommitDemo = async (approved) => {
    if (demoOutput?.proposal_id) {
      await decideProposal(demoOutput.proposal_id, approved);
      onRefreshSchedule();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-glow max-w-3xl w-full rounded-3xl border border-[#2a2a45] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#2a2a45] flex items-center justify-between bg-[#11111f]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff5fa2] to-[#7c6cff] flex items-center justify-center text-white shadow-lg shadow-[#ff5fa2]/20">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Section 5 Scripted Demo: 4:00 PM Scenario</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981]">
                  Automated End-to-End
                </span>
              </h2>
              <p className="text-xs text-[#a0a0c0]">
                8:00 AM normal run → 4:00 PM surprise assignment → 7 agents adapt → 4:06 PM user approval.
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

        {/* Stepper Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#a0a0c0] animate-pulse">
              Initializing 4:00 PM Demo Scenario...
            </div>
          ) : (
            <>
              {/* Stepper Timeline Badges */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {timelineSteps.map((step, idx) => {
                  const isActive = idx === currentStepIdx;
                  const isDone = idx < currentStepIdx;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx(idx);
                      }}
                      className={`p-2 rounded-xl border text-[11px] font-mono font-bold transition-all ${
                        isActive
                          ? 'border-[#ff5fa2] bg-[#ff5fa2]/20 text-white shadow-md'
                          : isDone
                          ? 'border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]'
                          : 'border-[#2a2a45] bg-[#11111f] text-[#a0a0c0]'
                      }`}
                    >
                      <div className="text-[10px]">{step.time}</div>
                      <div className="truncate text-[9px] mt-0.5 opacity-80">{step.phase}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Feature Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a102a] to-[#151527] border border-[#ff5fa2]/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#ff5fa2] bg-[#ff5fa2]/15 px-3 py-1 rounded-lg border border-[#ff5fa2]/30">
                      {currentStep.time}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Phase: {currentStep.phase}
                    </span>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#7c6cff]/20 text-[#7c6cff] border border-[#7c6cff]/30 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    <span>{currentStep.agent}</span>
                  </span>
                </div>

                <p className="text-base text-white font-medium leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Specific Step Explanations */}
                {currentStep.time === '4:03 PM' && (
                  <div className="p-3 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-xs text-white">
                    <strong>Collision Identified:</strong> 16:00 – 18:00 was reserved for 'Project Work: Web Platform Redesign'. Cannot overlap without schedule violation.
                  </div>
                )}

                {currentStep.time === '4:04 PM' && (
                  <div className="p-3 rounded-xl bg-[#00e0c8]/15 border border-[#00e0c8]/30 text-xs text-white space-y-1">
                    <div className="font-bold text-[#00e0c8]">Adaptation Solution:</div>
                    <p>• Moved Project Work to Tomorrow (10:00 AM – 12:00 PM).</p>
                    <p>• Allocated 4:00 PM – 6:00 PM for Python ML Optimization Assignment.</p>
                  </div>
                )}

                {currentStep.time === '4:05 PM' && (
                  <div className="p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-xs text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0" />
                    <span><strong>Hard Sleep Check Guard:</strong> 23:00 – 07:00 sleep block verified 100% untouched. Rest budget remains intact.</span>
                  </div>
                )}

                {currentStep.time === '4:06 PM' && (
                  <div className="p-4 rounded-xl bg-[#ff5fa2]/20 border border-[#ff5fa2]/40 text-xs text-white space-y-3">
                    <div className="font-bold text-[#ff5fa2] flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      <span>User Spoken Notification Delivered:</span>
                    </div>
                    <p className="italic text-sm">
                      "Your day changed. Here's the new plan: 2 hours allocated for the assignment, project moved to tomorrow morning, and sleep remains strictly protected. Accept?"
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleCommitDemo(true)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#10b981] text-white hover:bg-[#059669]"
                      >
                        Accept & Apply New Schedule
                      </button>
                      <button
                        onClick={() => handleCommitDemo(false)}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-[#2a2a45] text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Player Controls */}
        <div className="p-4 border-t border-[#2a2a45] bg-[#11111f]/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7c6cff] hover:bg-[#6a58f5] text-white flex items-center gap-1.5 shadow"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'Pause Auto-Play' : 'Auto-Play Scenario'}</span>
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(0);
              }}
              title="Restart"
              className="p-2 rounded-xl text-[#a0a0c0] hover:text-white hover:bg-[#151527] border border-[#2a2a45]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentStepIdx === 0}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(prev => Math.max(0, prev - 1));
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#151527] hover:bg-[#202038] disabled:opacity-30 text-white border border-[#2a2a45]"
            >
              Previous Step
            </button>
            <button
              disabled={currentStepIdx === timelineSteps.length - 1}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(prev => Math.min(timelineSteps.length - 1, prev + 1));
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00e0c8] hover:bg-[#00c8b2] text-[#0a0a12] disabled:opacity-30 flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
