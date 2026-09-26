import React from 'react';
import {
  TrendingUp,
  Moon,
  Clock,
  CheckCircle2,
  RotateCw,
  Sparkles,
  BarChart3,
  Flame,
  Brain,
  Shield
} from 'lucide-react';

export default function AnalyticsScreen({ persona }) {
  const currentPersona = persona || {
    name: 'Sathish',
    roleTag: 'Student',
    learnedInsights: [
      { metric: 'Python Study Drift', value: '+18 min', note: 'Sessions average 18 minutes longer than planned.' },
      { metric: 'Task Completion Rate', value: '88%', note: 'High compliance when tasks are scheduled before 8:00 PM.' },
      { metric: 'Mom Voice Lift', value: '+28%', note: 'Morning wake-up promptness improved significantly with approved voice.' }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#2a2a45] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#10b981]/15 to-[#00e0c8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-xs font-semibold mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Grounded Behavioral Intelligence · {currentPersona.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Actionable Life Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#a0a0c0] mt-1 max-w-xl">
              AdaptiveOS does not present vanity vanity charts. Every metric directly informs the 7 autonomous agents to make future schedule synthesis more resilient, realistic, and protective of your rest.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-[#121224] border border-[#2a2a45] text-center">
              <div className="text-2xl font-black text-[#10b981]">100%</div>
              <div className="text-[11px] text-[#a0a0c0] mt-0.5">Sleep Protected</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#121224] border border-[#2a2a45] text-center">
              <div className="text-2xl font-black text-[#00e0c8]">14</div>
              <div className="text-[11px] text-[#a0a0c0] mt-0.5">Adapts Accepted</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Sleep Consistency */}
        <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#a0a0c0] mb-2">
            <span>Sleep Consistency</span>
            <Moon className="w-4 h-4 text-[#7c6cff]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">7.8 hrs</div>
            <div className="text-xs text-[#10b981] mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero bedtime compromises</span>
            </div>
          </div>
          <p className="text-[11px] text-[#a0a0c0] mt-3 pt-3 border-t border-[#2a2a45]/60">
            Conflict Agent successfully repelled 5 evening schedule clashes.
          </p>
        </div>

        {/* Metric 2: Completion Rate */}
        <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#a0a0c0] mb-2">
            <span>Schedule Completion</span>
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">88%</div>
            <div className="text-xs text-[#00e0c8] mt-1 flex items-center gap-1">
              <span>+14% vs previous week</span>
            </div>
          </div>
          <p className="text-[11px] text-[#a0a0c0] mt-3 pt-3 border-t border-[#2a2a45]/60">
            Tasks scheduled prior to 8:00 PM have an 88% completion probability.
          </p>
        </div>

        {/* Metric 3: Estimation Drift Bias */}
        <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#a0a0c0] mb-2">
            <span>Learned Duration Drift</span>
            <Clock className="w-4 h-4 text-[#ff5fa2]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">+18 min</div>
            <div className="text-xs text-[#ff5fa2] mt-1 flex items-center gap-1">
              <span>Auto-buffered by Time Agent</span>
            </div>
          </div>
          <p className="text-[11px] text-[#a0a0c0] mt-3 pt-3 border-t border-[#2a2a45]/60">
            Python and technical focus sessions run 18m longer than original estimate.
          </p>
        </div>

        {/* Metric 4: Mom Voice Lift */}
        <div className="glass-panel rounded-2xl p-5 border border-[#2a2a45] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#a0a0c0] mb-2">
            <span>Mom Wake-Up Lift</span>
            <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">+28%</div>
            <div className="text-xs text-[#10b981] mt-1 flex items-center gap-1">
              <span>Promptness boost</span>
            </div>
          </div>
          <p className="text-[11px] text-[#a0a0c0] mt-3 pt-3 border-t border-[#2a2a45]/60">
            Consented audio greeting reduced morning snooze duration from 22m to 5m.
          </p>
        </div>
      </div>

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Persona Specific Learned Insights */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45]">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#00e0c8]" />
            <span>Learned Behavioral Insights ({currentPersona.roleTag})</span>
          </h3>

          <div className="space-y-3.5">
            {currentPersona.learnedInsights?.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#11111f] border border-[#2a2a45] flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white">{item.metric}</div>
                  <p className="text-[11px] text-[#a0a0c0] mt-0.5">{item.note}</p>
                </div>
                <span className="font-mono text-base font-extrabold text-[#00e0c8] shrink-0">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Cognitive Hours Distribution */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2a2a45]">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff5fa2]" />
            <span>Peak Cognitive Energy Curve</span>
          </h3>

          <div className="space-y-3">
            {[
              { time: '06:00 – 09:00', label: 'Morning Awakening & Routine', energy: 65, color: '#7c6cff' },
              { time: '09:00 – 12:30', label: 'Deep Focus & Maximum Cognitive Acuity', energy: 95, color: '#10b981' },
              { time: '13:00 – 15:30', label: 'Digestive Dip & Collaborative Calls', energy: 55, color: '#f59e0b' },
              { time: '16:00 – 18:30', label: 'Secondary Focus & Technical Projects', energy: 82, color: '#00e0c8' },
              { time: '19:30 – 22:30', label: 'Family Dinner, Wind Down & Sleep Prep', energy: 40, color: '#ff5fa2' }
            ].map((slot, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs text-[#a0a0c0] mb-1">
                  <span><b className="text-white">{slot.time}</b> · {slot.label}</span>
                  <span className="font-mono">{slot.energy}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#11111f] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${slot.energy}%`, backgroundColor: slot.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
