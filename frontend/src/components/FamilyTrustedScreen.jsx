import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldAlert,
  Plus,
  Trash2,
  Volume2,
  Check,
  X,
  Lock,
  Heart,
  UserCheck,
  AlertTriangle,
  Play
} from 'lucide-react';
import {
  fetchTrustedPeople,
  addTrustedPerson,
  updatePermission,
  deleteTrustedPerson,
  triggerMomWakeSupport
} from '../api';

export default function FamilyTrustedScreen() {
  const [trustedPeople, setTrustedPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [audioSimulation, setAudioSimulation] = useState(null);

  // New person form state (NO SELECT ALL: explicit permissions required)
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('Mentor');
  const [newPhone, setNewPhone] = useState('');
  const [newVoiceReminder, setNewVoiceReminder] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({
    wake_up_support: false,
    missed_task_alert: false,
    evening_checkin: false,
    study_accountability: false,
  });
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTrustedPeople();
      setTrustedPeople(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePermission = async (personId, permissionKey, currentValue) => {
    try {
      await updatePermission(personId, permissionKey, !currentValue);
      loadData();
    } catch (err) {
      alert("Failed to update permission: " + err.message);
    }
  };

  const handleDelete = async (personId) => {
    if (!window.confirm("Revoke all access and remove this trusted person?")) return;
    try {
      await deleteTrustedPerson(personId);
      loadData();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handlePlayVoiceReminder = async (person) => {
    try {
      const res = await triggerMomWakeSupport();
      if (!res.allowed) {
        alert(res.message);
        return;
      }
      setAudioSimulation(res);

      // Play synthesized audio using Web Speech API
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(res.audio_script);
        utterance.rate = 0.95;
        utterance.pitch = 1.1; // Warm tone
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      alert("Error playing voice reminder: " + err.message);
    }
  };

  const handleCreatePerson = async (e) => {
    e.preventDefault();
    setFormError('');

    // PRODUCT RULE: Scoped permissions only. Must select specific permissions, no blank or select-all bypass.
    const activePerms = Object.entries(selectedPermissions)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => {
        const labels = {
          wake_up_support: 'Wake-up voice assistance',
          missed_task_alert: 'Alert on missed study session',
          evening_checkin: 'Evening check-in access',
          study_accountability: 'Study & project milestone accountability'
        };
        return {
          permission_key: key,
          permission_label: labels[key],
          is_enabled: true
        };
      });

    if (activePerms.length === 0) {
      setFormError('Product Policy Violation: Trusted people cannot be added without explicitly scoped, granted permissions. Please check at least one specific permission.');
      return;
    }

    try {
      await addTrustedPerson({
        name: newName,
        relationship: newRelationship,
        phone: newPhone,
        voice_reminder_text: newVoiceReminder || `Hi ${newName}, here to support your daily goals!`,
        permissions: activePerms
      });

      setShowAddModal(false);
      setNewName('');
      setNewVoiceReminder('');
      setSelectedPermissions({
        wake_up_support: false,
        missed_task_alert: false,
        evening_checkin: false,
        study_accountability: false,
      });
      loadData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Privacy Policy & Scoped Permissions Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00e0c8]">
              <Heart className="w-4 h-4 text-[#ff5fa2]" />
              <span>Human-in-the-Loop · Scoped Support Network</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              AI Coordinates Your Life. Humans Support You. You Remain In Control.
            </h1>
            <p className="text-xs text-[#a0a0c0] max-w-2xl">
              Parents, mentors, and partners never receive raw calendar surveillance or silent monitoring. Access is strictly opt-in, explicitly scoped, granularly segmented, and instantly revocable.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7c6cff] to-[#00e0c8] text-[#0a0a12] hover:opacity-95 shadow-lg shadow-[#7c6cff]/20 flex items-center gap-2 shrink-0 font-mono"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Trusted Person</span>
          </button>
        </div>

        {/* Security badges */}
        <div className="mt-5 pt-4 border-t border-[#2a2a45]/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#a0a0c0]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#10b981]" />
            <span><strong>No 'Select All'</strong>: Every grant must be explicit</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#7c6cff]" />
            <span><strong>Zero Silent Monitoring</strong>: Full transparency</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#00e0c8]" />
            <span><strong>Revocable Anytime</strong>: Single click killswitch</span>
          </div>
        </div>
      </div>

      {/* Audio Simulation Banner if triggered */}
      {audioSimulation && (
        <div className="glass-panel-glow rounded-2xl p-5 border border-[#ff5fa2]/40 bg-[#1f1025] animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff5fa2]">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>Playing Approved Audio Reminder: Mom (Wake-up Support)</span>
            </div>
            <button
              onClick={() => setAudioSimulation(null)}
              className="text-xs text-[#a0a0c0] hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0a12] border border-[#2a2a45] text-sm text-white italic">
            "{audioSimulation.audio_script}"
          </div>

          {/* Escalation ladder */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#a0a0c0] uppercase tracking-wider">
              Human Escalation Protocol Execution:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
              {audioSimulation.escalation_chain?.map((step) => (
                <div key={step.step} className="p-2 rounded-lg bg-[#151527] border border-[#2a2a45]">
                  <span className="font-mono text-[#00e0c8]">{step.time}</span>
                  <p className="text-white mt-0.5">{step.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List of Trusted People Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trustedPeople.map((person) => {
          const isMom = person.relationship === 'Mom';
          const hasWakeSupport = person.permissions?.some(p => p.permission_key === 'wake_up_support' && p.is_enabled);

          return (
            <div
              key={person.id}
              className="glass-panel rounded-2xl p-5 border border-[#2a2a45] flex flex-col justify-between hover:border-[#7c6cff]/40 transition-colors"
            >
              <div>
                {/* Person Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white text-base shadow-md"
                      style={{ backgroundColor: person.avatar_color || '#7c6cff' }}
                    >
                      {person.name[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{person.name}</h3>
                      <span className="text-xs text-[#a0a0c0]">{person.relationship}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(person.id)}
                    title="Revoke and delete"
                    className="p-1.5 rounded-lg text-[#a0a0c0] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Voice Reminder Audio Trigger */}
                {isMom && (
                  <div className="mb-4 p-3 rounded-xl bg-[#0a0a12]/70 border border-[#2a2a45] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#ff5fa2]" />
                        <span>Mom's Voice Sample</span>
                      </span>
                      <span className="text-[10px] text-[#10b981] font-mono">Approved</span>
                    </div>
                    <p className="text-xs text-[#a0a0c0] italic line-clamp-2">
                      "{person.voice_reminder_text}"
                    </p>
                    <button
                      onClick={() => handlePlayVoiceReminder(person)}
                      disabled={!hasWakeSupport}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-[#ff5fa2]/20 hover:bg-[#ff5fa2]/30 text-[#ff5fa2] disabled:opacity-40 disabled:cursor-not-allowed border border-[#ff5fa2]/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Simulate Wake-Up Audio Call</span>
                    </button>
                  </div>
                )}

                {/* Granular Scoped Permissions Checklist */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#a0a0c0] uppercase tracking-wider block mb-1">
                    Scoped Permissions (Visible & Revocable)
                  </span>

                  {person.permissions?.map((perm) => (
                    <div
                      key={perm.permission_key}
                      onClick={() => handleTogglePermission(person.id, perm.permission_key, perm.is_enabled)}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#11111f] border border-[#2a2a45] hover:border-[#7c6cff]/40 cursor-pointer transition-colors"
                    >
                      <span className="text-xs text-white/90">{perm.permission_label}</span>
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        perm.is_enabled
                          ? 'bg-[#10b981] text-white'
                          : 'bg-[#2a2a45] text-[#a0a0c0]'
                      }`}>
                        {perm.is_enabled ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3" />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-[#2a2a45]/60 flex items-center justify-between text-[11px] text-[#a0a0c0]">
                <span>Permission state: Synchronized</span>
                <span className="text-[#00e0c8] font-mono">Active</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Trusted Person Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel-glow max-w-lg w-full rounded-3xl p-6 border border-[#2a2a45] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7c6cff]" />
                <span>Add Trusted Person</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[#a0a0c0] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#a0a0c0]">
              You must explicitly grant specific permissions. There is intentionally no 'Select All' option to prevent unintentional over-granting.
            </p>

            {formError && (
              <div className="p-3 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-xs text-[#ef4444] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePerson} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/90 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jennifer Vance or Brother"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#11111f] border border-[#2a2a45] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#7c6cff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/90 block mb-1">Relationship</label>
                  <select
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value)}
                    className="w-full bg-[#11111f] border border-[#2a2a45] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#7c6cff]"
                  >
                    <option value="Mentor">Mentor</option>
                    <option value="Teacher">Teacher / Professor</option>
                    <option value="Teammate">Teammate / Peer</option>
                    <option value="Mom">Mom</option>
                    <option value="Dad">Dad</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/90 block mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 555-0199"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#11111f] border border-[#2a2a45] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#7c6cff]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/90 block mb-1">Custom Voice Reminder Text</label>
                <input
                  type="text"
                  placeholder="e.g. 'Keep pushing on your coding sprint today!'"
                  value={newVoiceReminder}
                  onChange={(e) => setNewVoiceReminder(e.target.value)}
                  className="w-full bg-[#11111f] border border-[#2a2a45] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#7c6cff]"
                />
              </div>

              {/* Scoped permissions checkboxes (No Select All!) */}
              <div>
                <label className="text-xs font-bold text-white block mb-1.5 flex items-center justify-between">
                  <span>Scoped Permissions (Select at least one)</span>
                  <span className="text-[10px] text-[#ff5fa2] font-mono font-normal">Explicit Selection Required</span>
                </label>

                <div className="space-y-2">
                  {[
                    { key: 'wake_up_support', label: 'Wake-up assistance only' },
                    { key: 'missed_task_alert', label: 'Alert if high-priority study session is missed' },
                    { key: 'evening_checkin', label: 'Evening wellness check-in access' },
                    { key: 'study_accountability', label: 'Study & project milestone accountability' },
                  ].map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#11111f] border border-[#2a2a45] cursor-pointer hover:border-[#7c6cff]/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions[perm.key]}
                        onChange={(e) => setSelectedPermissions(prev => ({
                          ...prev,
                          [perm.key]: e.target.checked
                        }))}
                        className="w-4 h-4 rounded text-[#7c6cff] bg-[#151527] border-[#2a2a45] focus:ring-0"
                      />
                      <span className="text-xs text-white/90">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#a0a0c0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7c6cff] hover:bg-[#6a58f5] text-white shadow"
                >
                  Grant Permissions & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
