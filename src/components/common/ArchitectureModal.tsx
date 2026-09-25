import React from 'react';
import { X, ArrowRight, CheckCircle2, Zap, Layers, Compass, Video, Cpu, ShieldCheck } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pipelineSteps = [
    { num: '01', title: 'Single-Pass Video Ingest', desc: '4K/1080p single corridor flight footage ingested with embedded audio timecodes.', icon: Video },
    { num: '02', title: 'Adaptive Frame Extraction', desc: 'Dynamic temporal sampling extracting 30-60 keyframes/sec based on drone velocity.', icon: Layers },
    { num: '03', title: 'Quality & Blur Filtering', desc: 'AI filter discards motion blur, glare, and low-contrast frames (91%+ threshold).', icon: ShieldCheck },
    { num: '04', title: 'Visual Feature Detection', desc: 'Deep-learned keypoint descriptors detect invariant spatial features across frames.', icon: Zap },
    { num: '05', title: 'Structure from Motion (SfM)', desc: 'Bundle adjustment optimizes relative camera pose and focal length trajectory.', icon: Cpu },
    { num: '06', title: 'RTK/GNSS Co-Registration', desc: 'Synchronizes camera timestamps with dual-frequency RTK and IMU attitude data.', icon: Compass },
    { num: '07', title: 'Multi-View Depth Estimation', desc: 'Dense stereo matching estimates millimeter-level disparity maps per keyframe.', icon: Layers },
    { num: '08', title: 'Volumetric Point Cloud', desc: 'Fuses depth maps into an 8M+ georeferenced point cloud with RGB colorization.', icon: CheckCircle2 },
    { num: '09', title: 'Poisson Mesh Reconstruction', desc: 'Extracts watertight polygonal 3D mesh surface with topology decimation.', icon: CheckCircle2 },
    { num: '10', title: 'Photorealistic Texture Atlas', desc: 'Multi-band seamless blending maps high-res imagery onto 3D surfaces.', icon: CheckCircle2 },
    { num: '11', title: 'WGS84 Georeferencing', desc: 'Transforms local Cartesian coordinates into absolute EPSG:4326 geospatial CRS.', icon: Compass },
    { num: '12', title: 'AI Quality & Digital Twin', desc: 'Gemini-assisted structural segmentation and metric accuracy validation.', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                TECHNICAL WHITE-PAPER SUMMARY
              </span>
              <h2 className="text-lg font-bold text-white">
                Aero3D AI Architecture & Pipeline
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              How Aero3D turns a single drone pass into a georeferenced metric 3D digital twin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Comparison Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-red-500/20">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                Traditional Photogrammetry
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Requires 70-80% cross-lap & front-lap grid flights</li>
                <li>Multiple drone passes (3-5x battery consumption)</li>
                <li>Long data acquisition and flight mission duration</li>
                <li>Hours to days of heavy server cluster photogrammetry</li>
                <li>Risk of airspace clearance expiration</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Aero3D AI Single-Pass Innovation
              </h4>
              <ul className="text-xs text-slate-200 space-y-1.5 list-disc list-inside">
                <li><strong className="text-cyan-300">Single continuous flight pass:</strong> One corridor or orbital pass</li>
                <li><strong className="text-cyan-300">75% reduction</strong> in drone mission time and battery usage</li>
                <li>Continuous video stream leverages dense temporal parallax</li>
                <li>AI pre-filtering discards motion artifacts in real time</li>
                <li>Automated WGS84 metric georeferencing & Gemini insight</li>
              </ul>
            </div>
          </div>

          {/* 12-Step Architecture Pipeline */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span>End-to-End 12-Stage Reconstruction Pipeline</span>
              <span className="text-[10px] text-cyan-400 font-normal">Deterministic Verification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pipelineSteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="p-3 rounded-xl bg-slate-900/70 border border-white/5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                        STAGE {step.num}
                      </span>
                      <StepIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="text-xs font-semibold text-slate-100 mb-1">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span>Patent-pending single-pass neural photogrammetry methodology.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
};
