import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info,
  BarChart2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Project } from '../../types';

interface QualityReportScreenProps {
  project: Project;
}

export const QualityReportScreen: React.FC<QualityReportScreenProps> = ({ project }) => {
  const metrics = [
    { label: 'Geolocation Accuracy', value: '95.8%', desc: 'RMS Horizontal Error < 1.4 cm', color: 'text-emerald-400' },
    { label: 'Model Completeness', value: '91.4%', desc: 'Surface closure with zero holes', color: 'text-cyan-400' },
    { label: 'Texture Coverage', value: '94.1%', desc: 'Seamless photometric blending', color: 'text-blue-400' },
    { label: 'Frame Utilization', value: '88.7%', desc: '2,714 of 3,060 frames keyed', color: 'text-indigo-400' },
    { label: 'Reconstruction Confidence', value: '93%', desc: 'Multi-view ray convergence', color: 'text-teal-400' },
    { label: 'GPS / RTK Alignment', value: '96%', desc: 'Fixed carrier phase integer', color: 'text-emerald-400' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              Photogrammetric Quality Audit
            </span>
            <span className="text-xs text-slate-400">• {project.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            AI Accuracy & Quality Evaluation Report
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical convergence analysis and sensor co-registration tolerances.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Simulated Photogrammetric Calibration Metrics</span>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[#0f172a] border border-white/10 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px] block">{m.label}</span>
            <div className={`text-2xl font-extrabold font-mono mt-2 ${m.color}`}>
              {m.value}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {m.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Frame Quality Score Over Flight Time */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Frame Quality Score Over Flight Duration
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Mean: 91.2%</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Temporal sharpness index across 102 seconds of single-pass flight.
          </p>

          {/* SVG Line Chart */}
          <div className="h-48 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 160">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4 4" />

              {/* Area */}
              <path
                d="M 0,60 Q 70,30 140,45 T 280,35 T 400,50 L 500,30 L 500,160 L 0,160 Z"
                fill="url(#chartGrad)"
              />
              {/* Line */}
              <path
                d="M 0,60 Q 70,30 140,45 T 280,35 T 400,50 L 500,30"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2.5"
              />

              {/* Labels */}
              <text x="10" y="35" fill="#64748b" fontSize="10" fontFamily="monospace">100%</text>
              <text x="10" y="75" fill="#64748b" fontSize="10" fontFamily="monospace">90%</text>
              <text x="10" y="115" fill="#64748b" fontSize="10" fontFamily="monospace">80%</text>
              <text x="20" y="155" fill="#64748b" fontSize="10" fontFamily="monospace">00:00</text>
              <text x="240" y="155" fill="#64748b" fontSize="10" fontFamily="monospace">00:51</text>
              <text x="460" y="155" fill="#64748b" fontSize="10" fontFamily="monospace">01:42</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Reconstruction Confidence by Asset Classification */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Reconstruction Confidence by Asset Class
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Classified</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Geometric fidelity across building roofs, roadways, terrain, and towers.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Arterial Road Network', score: 97, color: 'bg-emerald-400' },
              { name: 'Flat Building Roofs', score: 94, color: 'bg-cyan-400' },
              { name: 'Terrain & Ground Elevation', score: 96, color: 'bg-blue-400' },
              { name: 'Bridge / Overpass Structures', score: 92, color: 'bg-indigo-400' },
              { name: 'Vertical Facades & Overhangs', score: 86, color: 'bg-amber-400' },
              { name: 'Vegetation & Dense Foliage', score: 82, color: 'bg-emerald-500' },
            ].map((cls, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>{cls.name}</span>
                  <span className="font-mono font-bold text-white">{cls.score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`${cls.color} h-full`} style={{ width: `${cls.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geodetic Verification Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0f172a] border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            WGS84 EPSG:4326 Datum Alignment Verified
          </h4>
          <p className="text-xs text-slate-300 max-w-xl">
            Single-pass bundle adjustment successfully aligned 1,024 RTK dual-frequency carrier-phase fixes with zero coordinate drift across the 12.8 hectare boundary.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-white/5 text-center">
            <span className="text-slate-400 text-[10px] block">RMSE Horizontal</span>
            <span className="font-bold text-emerald-400 text-sm">±1.4 cm</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-white/5 text-center">
            <span className="text-slate-400 text-[10px] block">RMSE Vertical</span>
            <span className="font-bold text-cyan-400 text-sm">±3.8 cm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
