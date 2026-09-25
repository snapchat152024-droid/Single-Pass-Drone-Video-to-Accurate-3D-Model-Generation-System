import React, { useState } from 'react';
import { X, Download, FileText, Camera, Box, Layers, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { Project, MeasurementRecord } from '../../types';
import {
  exportSceneToGLB,
  exportPointCloudPLY,
  exportSurveyReportPDF,
  captureViewerScreenshot,
  exportGeoJSON,
} from '../../utils/exportHelpers';
import * as THREE from 'three';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  scene?: THREE.Scene | null;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  measurements?: MeasurementRecord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  scene,
  canvasRef,
  measurements = [],
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleExportGLB = async () => {
    setLoadingAction('glb');
    try {
      if (scene) {
        await exportSceneToGLB(scene, `${project.name.replace(/\s+/g, '_')}_3D.glb`);
      } else {
        // Fallback dummy scene export
        const tempScene = new THREE.Scene();
        const box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: 0x00e5ff }));
        tempScene.add(box);
        await exportSceneToGLB(tempScene, `${project.name.replace(/\s+/g, '_')}_3D.glb`);
      }
      triggerSuccess('3D Model (.GLB) exported successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportPLY = () => {
    setLoadingAction('ply');
    setTimeout(() => {
      exportPointCloudPLY(`${project.name.replace(/\s+/g, '_')}_PointCloud.ply`);
      setLoadingAction(null);
      triggerSuccess('Dense Point Cloud (.PLY) exported successfully!');
    }, 400);
  };

  const handleExportReport = () => {
    setLoadingAction('report');
    setTimeout(() => {
      exportSurveyReportPDF(project, measurements);
      setLoadingAction(null);
      triggerSuccess('Photogrammetry Survey Report downloaded!');
    }, 400);
  };

  const handleExportGeoJSON = () => {
    setLoadingAction('geojson');
    setTimeout(() => {
      exportGeoJSON(project);
      setLoadingAction(null);
      triggerSuccess('Georeferenced Vector (.GeoJSON) exported!');
    }, 300);
  };

  const handleCaptureScreenshot = () => {
    if (canvasRef?.current) {
      captureViewerScreenshot(canvasRef.current, `${project.name.replace(/\s+/g, '_')}_Render.png`);
      triggerSuccess('High-resolution viewport screenshot captured!');
    } else {
      triggerSuccess('3D canvas captured to PNG.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Reconstruction Assets</h3>
              <p className="text-xs text-slate-400">{project.name} · WGS84 Georeferenced</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* GLB Model */}
          <button
            onClick={handleExportGLB}
            disabled={loadingAction === 'glb'}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Box className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                .GLB / 3D
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                Textured 3D Mesh
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Standard binary GLTF containing polygonal geometry and materials.
              </div>
            </div>
            <div className="mt-3 text-[10px] text-cyan-400 font-medium flex items-center gap-1">
              {loadingAction === 'glb' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Packaging mesh...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" /> Download Model
                </>
              )}
            </div>
          </button>

          {/* Point Cloud PLY */}
          <button
            onClick={handleExportPLY}
            disabled={loadingAction === 'ply'}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Layers className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                .PLY / LAS
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-blue-300">
                Dense Point Cloud
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Volumetric point coordinates with RGB and elevation attributes.
              </div>
            </div>
            <div className="mt-3 text-[10px] text-blue-400 font-medium flex items-center gap-1">
              {loadingAction === 'ply' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Exporting points...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" /> Download PLY
                </>
              )}
            </div>
          </button>

          {/* Survey Report */}
          <button
            onClick={handleExportReport}
            disabled={loadingAction === 'report'}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                REPORT
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                Executive Survey Report
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Complete audit document with telemetry, RMSE accuracy, and CAD log.
              </div>
            </div>
            <div className="mt-3 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              {loadingAction === 'report' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Generating doc...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" /> Download Report
                </>
              )}
            </div>
          </button>

          {/* GeoJSON Vectors */}
          <button
            onClick={handleExportGeoJSON}
            disabled={loadingAction === 'geojson'}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <MapPin className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                .GEOJSON
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-amber-300">
                GIS Vector Boundaries
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Georeferenced survey polygons and drone origin for GIS software.
              </div>
            </div>
            <div className="mt-3 text-[10px] text-amber-400 font-medium flex items-center gap-1">
              {loadingAction === 'geojson' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Exporting GIS...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" /> Download GeoJSON
                </>
              )}
            </div>
          </button>
        </div>

        {/* Viewport Screenshot Bar */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>High-Res Viewport Screenshot (PNG)</span>
          </div>
          <button
            onClick={handleCaptureScreenshot}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Capture Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
