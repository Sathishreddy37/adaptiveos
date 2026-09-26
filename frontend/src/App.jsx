import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeScreen from './components/HomeScreen';
import ScheduleScreen from './components/ScheduleScreen';
import MomClockScreen from './components/MomClockScreen';
import AssistantScreen from './components/AssistantScreen';
import AgentWorkflowScreen from './components/AgentWorkflowScreen';
import FamilyTrustedScreen from './components/FamilyTrustedScreen';
import VoiceScreen from './components/VoiceScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import AdminPanelScreen from './components/AdminPanelScreen';
import ProfileScreen from './components/ProfileScreen';
import OnboardingGuide from './components/OnboardingGuide';

import DecisionLogModal from './components/DecisionLogModal';
import PlanDiffModal from './components/PlanDiffModal';
import DemoRunner from './components/DemoRunner';
import CommandPalette from './components/CommandPalette';

import { PERSONAS } from './data/personas';
import {
  fetchSchedule,
  resetSchedule,
  fetchPendingProposals,
  triggerReplan
} from './api';
import { playMorningChime, playSuccess } from './utils/sound';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedPersonaKey, setSelectedPersonaKey] = useState('student');
  const persona = PERSONAS[selectedPersonaKey] || PERSONAS.student;

  const [schedule, setSchedule] = useState({ blocks: persona.scheduleBlocks });
  const [pendingProposals, setPendingProposals] = useState([]);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [selectedDiffProposal, setSelectedDiffProposal] = useState(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshAll = async () => {
    try {
      const sched = await fetchSchedule();
      if (sched && sched.blocks && sched.blocks.length > 0) {
        setSchedule(sched);
      } else {
        setSchedule({ blocks: persona.scheduleBlocks });
      }
      const props = await fetchPendingProposals();
      setPendingProposals(props || []);
    } catch (err) {
      console.warn("Backend sync fallback to persona dataset:", err);
      setSchedule({ blocks: persona.scheduleBlocks });
    }
  };

  useEffect(() => {
    refreshAll();
  }, [selectedPersonaKey]);

  const handleSelectPersona = (key) => {
    setSelectedPersonaKey(key);
    const p = PERSONAS[key] || PERSONAS.student;
    setSchedule({ blocks: p.scheduleBlocks });
    playSuccess();
  };

  const handleReset = async () => {
    try {
      await resetSchedule();
      await refreshAll();
    } catch (err) {
      setSchedule({ blocks: persona.scheduleBlocks });
    }
  };

  const handleOpenDiff = (proposal) => {
    setSelectedDiffProposal(proposal || (pendingProposals.length > 0 ? pendingProposals[0] : null));
  };

  const handleOnboardingComplete = ({ personaKey, formData }) => {
    setSelectedPersonaKey(personaKey);
    setIsOnboardingOpen(false);
    localStorage.setItem('adaptiveos_onboarded_completed', 'true');
    setCurrentScreen('momclock'); // User requested: First page requirement guide, and next with mom clock!
    playSuccess();
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-[#f0f0fa] flex flex-col font-sans selection:bg-[#7c6cff] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        onRunDemo={() => setIsDemoOpen(true)}
        onResetSchedule={handleReset}
        onOpenLogs={() => setIsLogsOpen(true)}
        pendingProposalCount={pendingProposals.length}
        persona={persona}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentScreen === 'home' && (
          <HomeScreen
            schedule={schedule}
            pendingProposals={pendingProposals}
            onOpenDiffModal={handleOpenDiff}
            onNavigate={(screen) => setCurrentScreen(screen)}
            persona={persona}
            onSelectPersona={handleSelectPersona}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onTriggerFastReplan={async () => {
              await triggerReplan({
                transcript: "I got a surprise assignment due tomorrow morning.",
                current_time: "16:00"
              });
              await refreshAll();
            }}
          />
        )}

        {currentScreen === 'schedule' && (
          <ScheduleScreen
            schedule={schedule}
            pendingProposals={pendingProposals}
            onOpenDiffModal={handleOpenDiff}
            onResetSchedule={handleReset}
            onTriggerFastReplan={async () => {
              await triggerReplan({
                transcript: "I got a surprise assignment due tomorrow morning.",
                current_time: "16:00"
              });
              await refreshAll();
            }}
          />
        )}

        {currentScreen === 'momclock' && (
          <MomClockScreen
            persona={persona}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onUpdateAlarms={(newAlarms) => {
              persona.alarms = newAlarms;
            }}
          />
        )}

        {currentScreen === 'assistant' && (
          <AssistantScreen
            onRefreshSchedule={refreshAll}
            onOpenLogs={() => setIsLogsOpen(true)}
            pendingProposals={pendingProposals}
            onOpenDiffModal={handleOpenDiff}
          />
        )}

        {currentScreen === 'workflow' && (
          <AgentWorkflowScreen
            onTriggerDemo={() => setIsDemoOpen(true)}
          />
        )}

        {currentScreen === 'family' && (
          <FamilyTrustedScreen />
        )}

        {currentScreen === 'voice' && (
          <VoiceScreen
            onRefreshSchedule={refreshAll}
            onOpenDiffModal={handleOpenDiff}
          />
        )}

        {currentScreen === 'analytics' && (
          <AnalyticsScreen
            persona={persona}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminPanelScreen />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            persona={persona}
            onUpdatePersona={(updated) => {}}
            onResetToOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}
      </main>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onSelectPersona={handleSelectPersona}
        onRunDemo={() => setIsDemoOpen(true)}
        onResetSchedule={handleReset}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onTestChime={playMorningChime}
      />

      {/* Onboarding Guide Modal (First Page 3D Model Guide & Requirement Intake) */}
      {isOnboardingOpen && (
        <OnboardingGuide
          onComplete={handleOnboardingComplete}
          onCancel={() => setIsOnboardingOpen(false)}
          currentPersonaId={selectedPersonaKey}
        />
      )}

      {/* Modals */}
      <DecisionLogModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
      />

      <PlanDiffModal
        isOpen={Boolean(selectedDiffProposal)}
        proposal={selectedDiffProposal}
        onClose={() => setSelectedDiffProposal(null)}
        onRefreshSchedule={refreshAll}
      />

      <DemoRunner
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onRefreshSchedule={refreshAll}
        onOpenDiffModal={handleOpenDiff}
      />

      {/* Footer */}
      <footer className="border-t border-[#2a2a45]/80 py-4 px-6 text-center text-xs text-[#a0a0c0]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AdaptiveOS — Continuous Agentic Control Loop & Scoped Human Support</span>
          <div className="flex items-center gap-4">
            <span className="text-[#00e0c8]">Local-First · Privacy by Design</span>
            <span>•</span>
            <span className="text-white">Active: {persona.name} ({persona.roleTag})</span>
            <span>•</span>
            <a href="http://localhost:8000/landing" target="_blank" rel="noreferrer" className="hover:text-white underline">
              3D Agent Network
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
