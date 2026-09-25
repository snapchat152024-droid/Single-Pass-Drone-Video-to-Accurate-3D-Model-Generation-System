import React from 'react';
import {
  MousePointer,
  Ruler,
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  Camera,
  Trash2,
  Layers,
  Sparkles,
  MapPin,
  Compass,
  ArrowUpRight,
  Square,
  Plane,
} from 'lucide-react';
import { ViewerTool } from '../../types';

interface ViewerToolbarProps {
  activeTool: ViewerTool;
  onSelectTool: (tool: ViewerTool) => void;
  onResetCamera: () => void;
  onSetCameraPreset: (preset: 'perspective' | 'top' | 'side' | 'drone') => void;
  onClearMeasurements: () => void;
  measurementsCount: number;
  onOpenExport: () => void;
}

export const ViewerToolbar: React.FC<ViewerToolbarProps> = ({
  activeTool,
  onSelectTool,
  onResetCamera,
  onSetCameraPreset,
  onClearMeasurements,
  measurementsCount,
  onOpenExport,
}) => {
  return (
    <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex items-center gap-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)] select-none">
      {/* Tool Selection Group */}
      <div className="flex items-center gap-1 pr-2 border-r border-white/10">
        <button
          onClick={() => onSelectTool('select')}
          className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'select'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Select & Inspect 3D Geometry"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectTool('distance')}
          className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
            activeTool === 'distance'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Measure 3D Distance (Click 2 points)"
        >
          <Ruler className="w-4 h-4" />
          <span className="text-[11px] hidden sm:inline">Distance</span>
        </button>

        <button
          onClick={() => onSelectTool('height')}
          className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
            activeTool === 'height'
              ? 'bg-amber-400 text-slate-950 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Measure Structure Height (Base to Top)"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span className="text-[11px] hidden sm:inline">Height</span>
        </button>

        <button
          onClick={() => onSelectTool('area')}
          className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
            activeTool === 'area'
              ? 'bg-emerald-400 text-slate-950 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Measure Ground/Roof Area (Click 3 points)"
        >
          <Square className="w-4 h-4" />
          <span className="text-[11px] hidden sm:inline">Area</span>
        </button>

        <button
          onClick={() => onSelectTool('marker')}
          className={`p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            activeTool === 'marker'
              ? 'bg-pink-500 text-white font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Drop Spatial Survey Marker"
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>

      {/* Camera Angle Presets */}
      <div className="flex items-center gap-1 px-1 border-r border-white/10">
        <button
          onClick={() => onSetCameraPreset('perspective')}
          className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
          title="Perspective View (Isometric Angle)"
        >
          Perspective
        </button>

        <button
          onClick={() => onSetCameraPreset('top')}
          className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
          title="Top Plan / Orthographic Nadir View"
        >
          Top View
        </button>

        <button
          onClick={() => onSetCameraPreset('side')}
          className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
          title="Side Elevation View"
        >
          Side View
        </button>

        <button
          onClick={() => onSetCameraPreset('drone')}
          className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
          title="Drone Flight Perspective"
        >
          <Plane className="w-3 h-3 text-cyan-400" />
          <span className="hidden md:inline">Drone POV</span>
        </button>

        <button
          onClick={onResetCamera}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset Camera Target"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Measurement Clear & Export */}
      <div className="flex items-center gap-1 pl-1">
        {measurementsCount > 0 && (
          <button
            onClick={onClearMeasurements}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title={`Clear ${measurementsCount} measurements`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Export Assets</span>
        </button>
      </div>
    </div>
  );
};
