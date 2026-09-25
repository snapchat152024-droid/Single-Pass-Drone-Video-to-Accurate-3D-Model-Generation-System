import React from 'react';
import { Info, MapPin, CheckCircle, ShieldCheck, Box, Layers, Building, Ruler, HelpCircle } from 'lucide-react';
import { Project } from '../../types';

interface ModelSummaryPanelProps {
  project: Project;
  selectedObject: { name: string; type: string; height?: string; area?: string; coords?: string } | null;
  onClearSelection: () => void;
}

export const ModelSummaryPanel: React.FC<ModelSummaryPanelProps> = ({
  project,
  selectedObject,
  onClearSelection,
}) => {
  return (
    <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl w-72 select-none text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Reconstruction Summary
          </h4>
          <span className="text-[9px] text-amber-400/90 font-mono">
            ★ PROTOTYPE DEMO VALUES
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          {project.confidencePercent}% Confidence
        </span>
      </div>

      {/* Selected Object Card (when user clicks something in the 3D viewer) */}
      {selectedObject ? (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-300">
              Selected 3D Asset
            </span>
            <button
              onClick={onClearSelection}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              ✕ Deselect
            </button>
          </div>
          <div className="font-bold text-white text-xs">{selectedObject.name}</div>
          <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
            <Building className="w-3 h-3 text-cyan-400" />
            <span>Type: {selectedObject.type}</span>
          </div>
          {selectedObject.height && (
            <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
              <Ruler className="w-3 h-3 text-amber-400" />
              <span>Elevation/Height: <strong className="text-white">{selectedObject.height}</strong></span>
            </div>
          )}
          {selectedObject.area && (
            <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
              <Box className="w-3 h-3 text-emerald-400" />
              <span>Footprint Area: <strong className="text-white">{selectedObject.area}</strong></span>
            </div>
          )}
          {selectedObject.coords && (
            <div className="text-[10px] text-slate-400 font-mono">
              WGS84: {selectedObject.coords}
            </div>
          )}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400">
          💡 <span className="text-slate-300">Inspect mode:</span> Click any building or terrain point in the 3D scene to inspect heights and coordinates.
        </div>
      )}

      {/* Metrics Grid */}
      <div className="space-y-2 text-slate-300">
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Project</span>
          <span className="font-semibold text-white truncate max-w-[130px]">{project.name}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Model Type</span>
          <span className="text-cyan-300 font-medium">Textured 3D Mesh</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Survey Area</span>
          <span className="font-mono text-white">{project.areaHectares} hectares</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Estimated Points</span>
          <span className="font-mono text-cyan-400 font-semibold">{project.estimatedPoints}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Mesh Faces</span>
          <span className="font-mono text-white">{project.meshFaces}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Buildings Detected</span>
          <span className="font-mono text-white font-semibold">{project.buildingsDetected} structures</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Road Length</span>
          <span className="font-mono text-white">{project.roadLengthKm} km</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Ground Resolution</span>
          <span className="font-mono text-emerald-400 font-semibold">
            {project.flightData.groundSamplingDistance} cm/pixel
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">Georeferencing</span>
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3 h-3" /> Available (WGS84)
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400">Model Confidence</span>
          <span className="font-mono text-cyan-300 font-bold">{project.confidencePercent}%</span>
        </div>
      </div>
    </div>
  );
};
