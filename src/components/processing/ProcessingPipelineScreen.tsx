import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  Play,
  Pause,
  X,
  FastForward,
  Box,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project, PipelineStage } from '../../types';

interface ProcessingPipelineScreenProps {
  project: Project;
  onOpenModel: () => void;
  onCancel: () => void;
}

const DEFAULT_STAGES: { id: number; name: string; desc: string; durationMs: number }[] = [
  { id: 1, name: 'Video Ingestion', desc: 'Validating 4K raw container and audio-visual sync.', durationMs: 1200 },
  { id: 2, name: 'Frame Extraction', desc: 'Extracting 3,060 temporal keyframes at 30 fps.', durationMs: 1400 },
  { id: 3, name: 'Frame Quality Analysis', desc: 'Filtering motion blur and photometric noise.', durationMs: 1300 },
  { id: 4, name: 'Camera Motion Estimation', desc: 'Bundle adjustment estimating 6-DoF trajectory.', durationMs: 1600 },
  { id: 5, name: 'GPS/Metadata Alignment', desc: 'Synchronizing RTK timestamps with camera shutter.', durationMs: 1400 },
  { id: 6, name: 'Feature Detection', desc: 'Extracting 45,000 deep invariant visual keypoints.', durationMs: 1600 },
  { id: 7, name: 'Depth Estimation', desc: 'Neural multi-view stereo generating dense disparity.', durationMs: 1800 },
  { id: 8, name: '3D Scene Reconstruction', desc: 'Synthesizing 8.4M georeferenced point cloud.', durationMs: 1800 },
  { id: 9, name: 'Mesh Generation', desc: 'Poisson volumetric surface polygon reconstruction.', durationMs: 1700 },
  { id: 10, name: 'Texture Generation', desc: 'Multi-band seamless photometric texture atlas.', durationMs: 1600 },
  { id: 11, name: 'Georeferencing', desc: 'WGS84 EPSG:4326 rigid spatial transformation.', durationMs: 1300 },
  { id: 12, name: 'Accuracy Validation', desc: 'Validating ground resolution (2.4 cm/px) and RMSE.', durationMs: 1300 },
];

export const ProcessingPipelineScreen: React.FC<ProcessingPipelineScreenProps> = ({
  project,
  onOpenModel,
  onCancel,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Pipeline initialized for project: ${project.name}`,
    `[${new Date().toLocaleTimeString()}] Ingesting ${project.videoFileName} (4K / 30fps)...`,
  ]);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Overall progress percentage calculation
  const totalStages = DEFAULT_STAGES.length;
  const overallPercent = isCompleted
    ? 100
    : Math.min(99, Math.floor(((currentStageIdx + stageProgress / 100) / totalStages) * 100));

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  // Stage progression timer
  useEffect(() => {
    if (isPaused || isCompleted) return;

    const currentStage = DEFAULT_STAGES[currentStageIdx];
    if (!currentStage) {
      setIsCompleted(true);
      triggerConfetti();
      return;
    }

    const intervalTime = 60;
    const increment = (intervalTime / currentStage.durationMs) * 100;

    const timer = setInterval(() => {
      setStageProgress((prev) => {
        if (prev + increment >= 100) {
          // Completed this stage
          const nextIdx = currentStageIdx + 1;
          const timeStr = new Date().toLocaleTimeString();
          const logMsg = `[${timeStr}] Stage ${currentStage.id}: ${currentStage.name} complete ✓`;

          setConsoleLogs((l) => [...l, logMsg]);

          if (nextIdx >= totalStages) {
            setIsCompleted(true);
            triggerConfetti();
            setConsoleLogs((l) => [
              ...l,
              `[${new Date().toLocaleTimeString()}] 3D RECONSTRUCTION COMPLETE: 8.4M Points, 2.6M Faces generated.`,
            ]);
            return 100;
          } else {
            setCurrentStageIdx(nextIdx);
            setConsoleLogs((l) => [
              ...l,
              `[${new Date().toLocaleTimeString()}] Starting: ${DEFAULT_STAGES[nextIdx].name}...`,
            ]);
            return 0;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentStageIdx, isPaused, isCompleted]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00e5ff', '#38bdf8', '#3b82f6', '#10b981'],
      });
    } catch (e) {
      // fallback
    }
  };

  const handleSkipToComplete = () => {
    setCurrentStageIdx(totalStages - 1);
    setStageProgress(100);
    setIsCompleted(true);
    triggerConfetti();
    setConsoleLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Fast-forward completed: 12 of 12 stages validated.`,
      `[${new Date().toLocaleTimeString()}] 3D RECONSTRUCTION COMPLETE. Model ready for inspection.`,
    ]);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              GPU Neural Photogrammetry
            </span>
            <span className="text-xs text-slate-400">• {project.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            AI Reconstruction Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Analyzing your single-pass drone flight…
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {!isCompleted && (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={handleSkipToComplete}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-colors cursor-pointer"
                title="Fast forward for demo presentation"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip to Complete</span>
              </button>

              <button
                onClick={onCancel}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cancel Pipeline"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {isCompleted && (
            <button
              onClick={onOpenModel}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 font-extrabold text-xs shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 cursor-pointer"
            >
              <Box className="w-4 h-4" />
              <span>Open 3D Model</span>
            </button>
          )}
        </div>
      </div>

      {/* Big Cinematic Progress Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#0a0e17] border border-cyan-500/40 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
              {isCompleted ? 'PIPELINE FINISHED' : `STAGE ${currentStageIdx + 1} OF 12`}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {isCompleted
                ? '3D Reconstruction Complete'
                : DEFAULT_STAGES[currentStageIdx]?.name}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {isCompleted
                ? 'High-density textured 3D mesh and georeferenced point cloud generated successfully.'
                : DEFAULT_STAGES[currentStageIdx]?.desc}
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight">
              {overallPercent}%
            </div>
            <span className="text-[11px] text-slate-400">
              {isCompleted ? 'Validated' : 'Processing...'}
            </span>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* 12 Horizontal/Vertical Pipeline Stages */}
      <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Single-Pass Neural Reconstruction Stages
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {DEFAULT_STAGES.map((stg, idx) => {
            const isDone = isCompleted || idx < currentStageIdx;
            const isCurrent = !isCompleted && idx === currentStageIdx;
            const isPending = !isCompleted && idx > currentStageIdx;

            return (
              <div
                key={stg.id}
                className={`p-3 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200'
                    : isCurrent
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-white'
                    : 'bg-slate-900/30 border-white/5 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold">
                    {stg.id < 10 ? `0${stg.id}` : stg.id}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="text-xs font-semibold truncate mb-0.5">
                  {stg.name}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1">
                  {stg.desc}
                </div>

                {isCurrent && (
                  <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all"
                      style={{ width: `${stageProgress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Activity Console */}
      <div className="rounded-2xl bg-[#0a0e17] border border-white/10 overflow-hidden shadow-xl">
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Activity Console</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            STREAMING
          </span>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto bg-black/40">
          {consoleLogs.map((log, i) => (
            <div key={i} className="leading-relaxed">
              <span className="text-cyan-400">root@aero3d-engine:~#</span> {log}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
};
