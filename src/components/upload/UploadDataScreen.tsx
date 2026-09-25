import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileVideo,
  Clock,
  Navigation,
  Compass,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Project } from '../../types';
import { generateSampleFrames, DroneFrame } from '../../utils/droneVideoSimulation';

interface UploadDataScreenProps {
  project: Project;
  onProceedToProcessing: () => void;
}

export const UploadDataScreen: React.FC<UploadDataScreenProps> = ({
  project,
  onProceedToProcessing,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(14);
  const [selectedFrame, setSelectedFrame] = useState<DroneFrame | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frames = useRef(generateSampleFrames(8)).current;

  // Video HUD canvas simulation
  useEffect(() => {
    let animId: number;
    let t = currentTime;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isPlaying) {
        t = (t + 0.05) % 102;
        setCurrentTime(t);
      }

      const w = canvas.width;
      const h = canvas.height;

      // Aerial background gradient (simulating flight over terrain/buildings)
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0a0f1d');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Moving ground grid perspective
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const offset = (t * 25) % 40;
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        ctx.lineTo(w, y + offset);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Simulated moving building blocks underneath
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1;

      const bY1 = ((t * 30 + 100) % (h + 80)) - 40;
      ctx.fillRect(w * 0.25, bY1, 90, 70);
      ctx.strokeRect(w * 0.25, bY1, 90, 70);

      const bY2 = ((t * 30 + 260) % (h + 80)) - 40;
      ctx.fillStyle = '#1e3a8a';
      ctx.strokeStyle = '#38bdf8';
      ctx.fillRect(w * 0.62, bY2, 110, 80);
      ctx.strokeRect(w * 0.62, bY2, 110, 80);

      // Drone Nadir Reticle Crosshair
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.5;
      const cx = w / 2;
      const cy = h / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 45, cy);
      ctx.lineTo(cx - 15, cy);
      ctx.moveTo(cx + 15, cy);
      ctx.lineTo(cx + 45, cy);
      ctx.moveTo(cx, cy - 45);
      ctx.lineTo(cx, cy - 15);
      ctx.moveTo(cx, cy + 15);
      ctx.lineTo(cx, cy + 45);
      ctx.stroke();

      // Artificial Horizon Pitch Ladder
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy - 30);
      ctx.lineTo(cx - 50, cy - 30);
      ctx.moveTo(cx + 50, cy - 30);
      ctx.lineTo(cx + 80, cy - 30);
      ctx.stroke();

      // Telemetry HUD Text Overlays
      ctx.font = '11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`ALT: 75.0 m AGL`, 20, 30);
      ctx.fillText(`SPD: 8.5 m/s`, 20, 50);
      ctx.fillText(`PITCH: -15°  ROLL: 0°`, 20, 70);
      ctx.fillText(`HDG: 042° NNE`, 20, 90);

      ctx.fillStyle = '#10b981';
      ctx.fillText(`RTK FIX (18 SATS)`, w - 160, 30);
      ctx.fillText(`WGS84: 26.9124°N, 75.7873°E`, w - 240, 50);
      ctx.fillText(`ISO 100  1/1000s  f/2.8`, w - 180, 70);
      ctx.fillText(`BAT: 84% [22.4V]`, w - 140, 90);

      // Timecode
      const mins = Math.floor(t / 60);
      const secs = Math.floor(t % 60);
      const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`TC: ${formatted} / 01:42`, cx - 65, h - 25);

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              Data Pre-Processing Stage
            </span>
            <span className="text-xs text-slate-400">• {project.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Project Input Data & Frame Quality Audit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-pass temporal frame sampling and sensor co-registration.
          </p>
        </div>

        <button
          onClick={onProceedToProcessing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 font-extrabold text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
        >
          <span>Run AI Reconstruction Pipeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Video Player Preview with HUD */}
      <div className="rounded-2xl bg-black border border-cyan-500/30 overflow-hidden shadow-2xl relative">
        <canvas
          ref={canvasRef}
          width={960}
          height={420}
          className="w-full h-72 sm:h-96 block object-cover"
        />

        {/* Video Control Bar */}
        <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
            </button>
            <div className="text-xs font-mono text-slate-300">
              {project.videoFileName}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>4K RAW STREAM VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Video Information Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10">
          <span className="text-slate-400 text-[11px] block">Resolution</span>
          <span className="text-sm font-bold text-white font-mono mt-1 block">4K (2160p)</span>
          <span className="text-[10px] text-slate-400">3840 x 2160</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10">
          <span className="text-slate-400 text-[11px] block">Frame Rate</span>
          <span className="text-sm font-bold text-cyan-400 font-mono mt-1 block">30 FPS</span>
          <span className="text-[10px] text-slate-400">Progressive scan</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10">
          <span className="text-slate-400 text-[11px] block">Duration</span>
          <span className="text-sm font-bold text-white font-mono mt-1 block">01:42</span>
          <span className="text-[10px] text-slate-400">102 seconds</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10">
          <span className="text-slate-400 text-[11px] block">Total Frames</span>
          <span className="text-sm font-bold text-white font-mono mt-1 block">3,060</span>
          <span className="text-[10px] text-slate-400">Sampled stream</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0f172a] border border-white/10 col-span-2 sm:col-span-1">
          <span className="text-slate-400 text-[11px] block">GPS Samples</span>
          <span className="text-sm font-bold text-emerald-400 font-mono mt-1 block">1,024</span>
          <span className="text-[10px] text-slate-400">10 Hz RTK fixes</span>
        </div>
      </div>

      {/* Frame Timeline (Sampled Thumbnails) */}
      <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Sampled Keyframe Extraction Timeline
            </h3>
            <p className="text-[11px] text-slate-400">
              Click any frame to inspect temporal keypoints and blur diagnostics.
            </p>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono">
            8 Keyframe Batches
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {frames.map((frame) => (
            <div
              key={frame.id}
              onClick={() => setSelectedFrame(frame)}
              className={`rounded-xl overflow-hidden border p-1 transition-all cursor-pointer group ${
                selectedFrame?.id === frame.id
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-white/10 bg-slate-900/60 hover:border-cyan-500/40'
              }`}
            >
              <img
                src={frame.thumbnailSvg}
                alt={`Keyframe ${frame.id}`}
                className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="mt-1 px-1 flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-300">{frame.timeFormatted}</span>
                <span
                  className={`font-mono font-bold ${
                    frame.qualityScore > 85 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {frame.qualityScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Frame Quality Analysis & Diagnostic Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quality Metrics */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              AI Frame Quality Analysis
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 font-mono">
              91% OVERALL
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Frame Sharpness & Feature Retention</span>
                <span className="font-mono text-cyan-400 font-bold">91%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[91%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Motion Blur Index</span>
                <span className="font-mono text-emerald-400 font-bold">Low (Optimal)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[94%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Photometric Exposure & Contrast</span>
                <span className="font-mono text-emerald-400 font-bold">Good</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[89%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>GPS / Telemetry Temporal Alignment</span>
                <span className="font-mono text-cyan-400 font-bold">96%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[96%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Warning System */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Automated Preprocessing Diagnostics
            </h3>
            <span className="text-[10px] text-amber-400 font-mono">2 ADVISORIES</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block">12% of frames contain motion blur</strong>
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  Frames captured during quick yaw adjustments have been deprioritized to preserve sub-centimeter point cloud accuracy.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Low-angle surfaces may have incomplete reconstruction</strong>
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  Single-pass nadir orientation provides 94.2% top surface clarity. Vertical sheer facades will use neural depth inpainting.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
