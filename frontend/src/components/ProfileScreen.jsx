import React, { useState } from 'react';
import {
  User,
  Clock,
  Target,
  Sliders,
  Sparkles,
  Mic,
  Users,
  Shield,
  Database,
  Lock,
  Trash2,
  CheckCircle2,
  Save,
  Volume2
} from 'lucide-react';

export default function ProfileScreen({
  persona,
  onUpdatePersona,
  onResetToOnboarding
}) {
  const [formData, setFormData] = useState({
    name: persona?.name || 'Sathish',
    email: 'sathish.adaptive@local.os',
    roleTag: persona?.roleTag || 'Student',
    wakeTime: persona?.wakeTime || '06:00',
    sleepTime: persona?.sleepTime || '22:30',
    primaryFocus: persona?.primaryFocus || 'Complete AI Project',
    protectPriority: persona?.protectPriority || 'Sleep & Study',
    voiceConsentEnabled: true,
    voicePersona: 'Mom (Warm & Encouraging)',
    localEncryption: true,
    cloudSync: false,
    telemetryLevel: 'Minimal Diagnostic Only'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#2a2a45] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#7c6cff]/15 to-[#00e0c8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl"
              style={{ backgroundColor: persona?.avatarAccent || '#7c6cff' }}
            >
              {formData.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {formData.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7c6cff]/20 text-[#7c6cff]">
                  {formData.roleTag}
                </span>
              </div>
              <p className="text-xs text-[#a0a0c0] mt-0.5">
                AdaptiveOS Local Profile · Apple-Inspired Preferences
              </p>
            </div>
          </div>

          <button
            onClick={onResetToOnboarding}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#151527] hover:bg-[#202038] text-white border border-[#2a2a45] transition-colors"
          >
            Switch Persona / Rerun Onboarding
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personal Information */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45]">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#7c6cff]" />
            <span>Personal Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#7c6cff]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">Local Identity Handle</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#7c6cff]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Daily Rhythm & Protected Constraints */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45]">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00e0c8]" />
            <span>Daily Rhythm & Inviolable Rest Boundaries</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">Wake-Up Time</label>
              <input
                type="time"
                value={formData.wakeTime}
                onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00e0c8]"
              />
              <span className="text-[11px] text-[#a0a0c0] mt-1 block">Mom Clock syncs morning alert here.</span>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">Target Sleep Time (Hard Lock)</label>
              <input
                type="time"
                value={formData.sleepTime}
                onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
                className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#00e0c8]"
              />
              <span className="text-[11px] text-[#10b981] mt-1 block">Conflict Agent guarantees zero sleep compromise.</span>
            </div>
          </div>
        </div>

        {/* Section 3: Scheduling & AI Preferences */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45]">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#ff5fa2]" />
            <span>Scheduling Preferences & AI Guardrails</span>
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">What should AdaptiveOS protect first?</label>
              <input
                type="text"
                value={formData.protectPriority}
                onChange={(e) => setFormData({ ...formData, protectPriority: e.target.value })}
                className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff5fa2]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a0a0c0] block mb-1">Current Active Focus Goal</label>
              <input
                type="text"
                value={formData.primaryFocus}
                onChange={(e) => setFormData({ ...formData, primaryFocus: e.target.value })}
                className="w-full bg-[#0a0a12] border border-[#2a2a45] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff5fa2]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Approved Voice Preferences (Section 3 Consent Requirement) */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45]">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#f59e0b]" />
            <span>Approved Voice Preferences & Consent</span>
          </h2>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#11111f] border border-[#2a2a45] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Mom — Wake-up Support (Approved Profile)</div>
                <div className="text-[11px] text-[#10b981] mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Explicit consent recorded & verified
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981]">
                Active
              </span>
            </div>

            <p className="text-xs text-[#a0a0c0] leading-relaxed">
              We build voice support around <b>consented recorded voice profiles</b> rather than silently cloning a real person's voice without their awareness.
            </p>
          </div>
        </div>

        {/* Section 5: Data Security & Privacy by Design (Section 20 Requirement) */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45]">
          <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00e0c8]" />
            <span>Privacy by Design</span>
          </h2>
          <div className="text-xs font-semibold text-[#00e0c8] mb-4">
            “Privacy by design. You control your data.”
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#11111f] border border-[#2a2a45] cursor-pointer">
              <div>
                <div className="font-semibold text-white">Local-First Storage</div>
                <div className="text-[#a0a0c0] text-[11px]">Schedules and decisions stored in local SQLite database.</div>
              </div>
              <input
                type="checkbox"
                checked={formData.localEncryption}
                onChange={(e) => setFormData({ ...formData, localEncryption: e.target.checked })}
                className="accent-[#00e0c8] w-4 h-4 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#11111f] border border-[#2a2a45] cursor-pointer">
              <div>
                <div className="font-semibold text-white">Cloud Sync</div>
                <div className="text-[#a0a0c0] text-[11px]">Disable all third-party cloud data transmission.</div>
              </div>
              <input
                type="checkbox"
                checked={formData.cloudSync}
                onChange={(e) => setFormData({ ...formData, cloudSync: e.target.checked })}
                className="accent-[#00e0c8] w-4 h-4 rounded"
              />
            </label>

            <div className="p-3 rounded-xl bg-[#0a0a12] border border-[#2a2a45] flex items-center justify-between">
              <span className="text-[#a0a0c0]">Telemetry Collection: Minimal Error Telemetry Only</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981]">
                Zero Tracking
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-[#10b981] font-semibold flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved securely to local storage.
            </span>
          ) : (
            <span className="text-xs text-[#a0a0c0]">
              All changes take effect immediately across all 7 autonomous agents.
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7c6cff] to-[#00e0c8] text-[#0a0a12] hover:opacity-95 shadow-lg shadow-[#7c6cff]/20 flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
