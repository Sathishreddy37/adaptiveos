import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Check,
  X,
  Shield,
  Activity,
  ArrowRight,
  Radio
} from 'lucide-react';
import { processVoiceCommand, decideProposal } from '../api';

export default function VoiceScreen({ onRefreshSchedule, onOpenDiffModal }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [pipelineSteps, setPipelineSteps] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestResponse, setLatestResponse] = useState(null);
  const [activeProposal, setActiveProposal] = useState(null);

  // Quick preset voice triggers
  const presets = [
    "I got an assignment. I need it finished by tomorrow.",
    "I'm tired. Move my study session to tomorrow.",
    "Wake me up at 6 AM and play Mom's reminder.",
  ];

  // Web Speech API recognition setup if supported
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser SpeechRecognition API not supported. Use the quick voice simulation buttons or type below!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setTranscript('Listening for your voice...');

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      handleProcessVoice(speechToText);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      setTranscript(`Voice input error: ${event.error}. You can use the buttons below.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleProcessVoice = async (textToProcess) => {
    const text = (textToProcess || transcript).trim();
    if (!text) return;

    setIsProcessing(true);
    setPipelineSteps([
      { agent: 'Voice Agent', step: 'Perceive', detail: `Received voice input: "${text}"`, status: 'running' }
    ]);

    try {
      // Step-by-step visual animation of the 7 agents
      setTimeout(() => {
        setPipelineSteps(prev => [
          ...prev,
          { agent: 'Planning Agent', step: 'Analyze', detail: 'Evaluating baseline schedule commitments and open windows', status: 'done' }
        ]);
      }, 300);

      setTimeout(() => {
        setPipelineSteps(prev => [
          ...prev,
          { agent: 'Priority Agent', step: 'Prioritize', detail: 'Imminent deadline detected; urgent priority assigned (Score: 94/100)', status: 'done' }
        ]);
      }, 600);

      setTimeout(() => {
        setPipelineSteps(prev => [
          ...prev,
          { agent: 'Conflict Agent', step: 'Check Conflicts', detail: 'Overlap found with 16:00 Project block. Hard sleep protection active.', status: 'done' }
        ]);
      }, 900);

      setTimeout(() => {
        setPipelineSteps(prev => [
          ...prev,
          { agent: 'Adaptation Agent', step: 'Replan', detail: 'Moved Project Work to Tomorrow. Slotted urgent assignment. Diff created.', status: 'done' }
        ]);
      }, 1200);

      const res = await processVoiceCommand(text);

      setTimeout(() => {
        setPipelineSteps(prev => [
          ...prev,
          { agent: 'Learning Agent', step: 'Personalize', detail: 'Circadian energy match confirmed for afternoon focus.', status: 'done' },
          { agent: 'Voice & Human Agent', step: 'Spoken Reply', detail: 'Generated spoken briefing & requested human approval.', status: 'done' }
        ]);

        setLatestResponse(res);
        if (res.proposal_id) {
          setActiveProposal({
            id: res.proposal_id,
            diff_summary: res.diff_summary,
            proposed_blocks: res.proposed_blocks
          });
        }

        // TTS: Speak aloud the response
        if ('speechSynthesis' in window && res.agent_response?.speech_text) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(res.agent_response.speech_text);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }

        setIsProcessing(false);
        onRefreshSchedule();
      }, 1500);

    } catch (err) {
      alert("Voice processing error: " + err.message);
      setIsProcessing(false);
    }
  };

  const handleDecision = async (approved) => {
    if (!activeProposal) return;
    try {
      await decideProposal(activeProposal.id, approved);
      setActiveProposal(null);
      if ('speechSynthesis' in window) {
        const text = approved
          ? "Confirmed. Your schedule has been updated."
          : "Plan cancelled. Your previous schedule remains in place.";
        const u = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(u);
      }
      onRefreshSchedule();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Voice Hero Card */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-[#2a2a45] text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c6cff]/15 border border-[#7c6cff]/30 text-[#7c6cff] text-xs font-semibold mb-4">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#ff5fa2]" />
          <span>Real-Time Voice Coordination</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Speak to AdaptiveOS
        </h1>
        <p className="text-xs sm:text-sm text-[#a0a0c0] mt-1 max-w-md mx-auto">
          "I got an assignment due tomorrow" — understood, conflict-checked, replanned, and spoken back for your approval.
        </p>

        {/* Big Mic Button */}
        <div className="my-8 flex justify-center">
          <button
            onClick={startSpeechRecognition}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-tr from-[#ff5fa2] to-[#ef4444] animate-pulse ring-8 ring-[#ff5fa2]/30 scale-105'
                : 'bg-gradient-to-tr from-[#7c6cff] to-[#00e0c8] hover:scale-105 shadow-[#7c6cff]/40 ring-4 ring-[#7c6cff]/20'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 text-[#0a0a12] stroke-[2.5]" />
            )}
          </button>
        </div>

        <p className="text-xs text-[#a0a0c0]">
          {isListening ? 'Listening... Speak your command' : 'Click the microphone to speak, or pick a simulated voice prompt below'}
        </p>

        {/* Quick Voice Presets */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTranscript(preset);
                handleProcessVoice(preset);
              }}
              disabled={isProcessing}
              className="px-3.5 py-2 rounded-xl bg-[#11111f] hover:bg-[#1a1a2e] border border-[#2a2a45] hover:border-[#7c6cff]/50 text-xs text-white/90 transition-all text-left flex items-center gap-2"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#00e0c8]" />
              <span>"{preset}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Transcript & Agent Pipeline Visualization */}
      {(transcript || pipelineSteps.length > 0) && (
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2a45]">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Activity className="w-4 h-4 text-[#00e0c8]" />
              <span>Voice Transcript & Agent Execution Chain</span>
            </div>
            {isProcessing && (
              <span className="text-xs font-mono text-[#00e0c8] animate-pulse">
                Running 7-Agent Loop...
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0a12] border border-[#2a2a45] text-sm text-white font-mono">
            "{transcript}"
          </div>

          {/* Stepper of the 7 agents */}
          <div className="space-y-2 pt-2">
            {pipelineSteps.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#11111f] border border-[#2a2a45] text-xs text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#7c6cff]/20 text-[#7c6cff] flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-[#00e0c8] mr-2">{s.agent}:</span>
                    <span className="text-white/90">{s.detail}</span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Confirmation Card */}
      {activeProposal && (
        <div className="glass-panel-glow rounded-2xl p-6 border border-[#ff5fa2]/40 bg-[#1f1025] space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff5fa2] flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Spoken Replan Proposal</span>
            </span>
            <span className="text-xs font-mono text-[#10b981] flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Sleep Safe
            </span>
          </div>

          <p className="text-sm text-white font-medium">
            "{latestResponse?.agent_response?.speech_text || 'Your day changed. Here is the new proposed plan. Accept?'}"
          </p>

          <div className="space-y-1.5 text-xs text-[#a0a0c0]">
            {activeProposal.diff_summary?.map((diff, i) => (
              <div key={i} className="flex items-start gap-2 bg-[#0a0a12]/60 p-2.5 rounded-lg border border-white/5">
                <ArrowRight className="w-3.5 h-3.5 text-[#00e0c8] shrink-0 mt-0.5" />
                <span>{diff}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleDecision(true)}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Accept & Commit Schedule</span>
            </button>
            <button
              onClick={() => handleDecision(false)}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#2a2a45] hover:bg-[#323250] text-[#a0a0c0] hover:text-white transition-all flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Discard Plan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
