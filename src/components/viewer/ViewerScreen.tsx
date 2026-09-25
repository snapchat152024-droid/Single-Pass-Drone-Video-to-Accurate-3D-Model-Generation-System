import React, { useState, useRef } from 'react';
import {
  ThreeViewer,
  ThreeViewerRef,
} from './ThreeViewer';
import { ViewerToolbar } from './ViewerToolbar';
import { LayersPanel } from './LayersPanel';
import { ModelSummaryPanel } from './ModelSummaryPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { MeasurementsListPanel } from './MeasurementsListPanel';
import { ExportModal } from '../common/ExportModal';
import {
  Project,
  ViewerLayers,
  ViewerTool,
  MeasurementRecord,
} from '../../types';
import { Layers, Info, Sparkles, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';

interface ViewerScreenProps {
  project: Project;
  onUpdateProject?: (updated: Project) => void;
}

export const ViewerScreen: React.FC<ViewerScreenProps> = ({ project, onUpdateProject }) => {
  const viewerRef = useRef<ThreeViewerRef>(null);

  // Layers state
  const [layers, setLayers] = useState<ViewerLayers>({
    terrain: true,
    buildings: true,
    roads: true,
    vegetation: true,
    infrastructure: true,
    pointCloud: false,
    texturedMesh: true,
    gpsTrack: true,
    wireframe: false,
    grid: true,
  });

  // Active tool
  const [activeTool, setActiveTool] = useState<ViewerTool>('select');

  // Measurements
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([
    {
      id: 'm-sample-1',
      type: 'distance',
      points: [{ x: -14, y: 0, z: -30 }, { x: 14, y: 0, z: -32 }],
      value: 42.6,
      unit: 'm',
      label: 'Corridor Width M1',
      color: '#00e5ff',
      timestamp: '10:32:15',
    },
    {
      id: 'm-sample-2',
      type: 'height',
      points: [{ x: 15, y: 0, z: 4 }, { x: 15, y: 20, z: 4 }],
      value: 18.4,
      unit: 'm',
      label: 'Smart Tower Elevation M2',
      color: '#f59e0b',
      timestamp: '10:34:02',
    },
  ]);

  // Selected object data from raycaster
  const [selectedObject, setSelectedObject] = useState<{
    name: string;
    type: string;
    height?: string;
    area?: string;
    coords?: string;
  } | null>(null);

  // Right sidebar tab state
  const [rightTab, setRightTab] = useState<'summary' | 'insights' | 'measurements'>('summary');
  const [showLayers, setShowLayers] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleToggleLayer = (key: keyof ViewerLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddMeasurement = (record: MeasurementRecord) => {
    setMeasurements((prev) => [...prev, record]);
  };

  const handleDeleteMeasurement = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearMeasurements = () => {
    setMeasurements([]);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#0a0e17] overflow-hidden select-none flex flex-col">
      {/* 3D Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <ThreeViewer
          ref={viewerRef}
          project={project}
          layers={layers}
          activeTool={activeTool}
          onAddMeasurement={handleAddMeasurement}
          onSelectObject={setSelectedObject}
          measurements={measurements}
        />

        {/* Top Floating Control Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <ViewerToolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            onResetCamera={() => viewerRef.current?.resetCamera()}
            onSetCameraPreset={(preset) => viewerRef.current?.setCameraPreset(preset)}
            onClearMeasurements={handleClearMeasurements}
            measurementsCount={measurements.length}
            onOpenExport={() => setShowExportModal(true)}
          />
        </div>

        {/* Left Layers Overlay Toggle & Panel */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
          <button
            onClick={() => setShowLayers(!showLayers)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white text-xs font-semibold shadow-lg transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Layers</span>
          </button>

          {showLayers && (
            <div className="animate-fadeIn">
              <LayersPanel layers={layers} onToggleLayer={handleToggleLayer} />
            </div>
          )}
        </div>

        {/* Right Info Overlay Toggle & Panel */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-lg">
            <button
              onClick={() => {
                setRightTab('summary');
                setShowRightPanel(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                showRightPanel && rightTab === 'summary'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Summary</span>
            </button>

            <button
              onClick={() => {
                setRightTab('insights');
                setShowRightPanel(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                showRightPanel && rightTab === 'insights'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Insights</span>
            </button>

            <button
              onClick={() => {
                setRightTab('measurements');
                setShowRightPanel(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                showRightPanel && rightTab === 'measurements'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Log ({measurements.length})</span>
            </button>

            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="p-1 rounded-lg text-slate-400 hover:text-white ml-1"
              title={showRightPanel ? 'Collapse Panel' : 'Expand Panel'}
            >
              {showRightPanel ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Right Panel Content */}
          {showRightPanel && (
            <div className="animate-fadeIn">
              {rightTab === 'summary' && (
                <ModelSummaryPanel
                  project={project}
                  selectedObject={selectedObject}
                  onClearSelection={() => setSelectedObject(null)}
                />
              )}

              {rightTab === 'insights' && (
                <AIInsightsPanel
                  project={project}
                  onUpdateInsights={(newInsights) => {
                    if (onUpdateProject) {
                      onUpdateProject({ ...project, aiInsights: newInsights });
                    }
                  }}
                />
              )}

              {rightTab === 'measurements' && (
                <MeasurementsListPanel
                  measurements={measurements}
                  onDeleteMeasurement={handleDeleteMeasurement}
                  onClearAll={handleClearMeasurements}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        project={project}
        scene={viewerRef.current?.getScene()}
        canvasRef={{ current: viewerRef.current?.getCanvas() || null }}
        measurements={measurements}
      />
    </div>
  );
};
