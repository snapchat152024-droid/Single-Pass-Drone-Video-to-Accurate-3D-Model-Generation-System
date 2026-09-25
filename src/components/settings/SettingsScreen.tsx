import React, { useState } from 'react';
import { Settings, Shield, HardDrive, Cpu, Compass, Lock, CheckCircle2 } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [crs, setCrs] = useState('WGS84 (EPSG:4326)');
  const [pointBudget, setPointBudget] = useState('10M');
  const [wireframeDefault, setWireframeDefault] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            System Preferences
          </span>
          <span className="text-xs text-slate-400">• Enterprise Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">Platform Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure photogrammetric units, geodetic datums, and rendering budgets.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Platform preferences updated successfully.</span>
        </div>
      )}

      {/* Photogrammetry & Geospatial Units */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          Geospatial & Metric Units
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Measurement System
            </label>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value as any)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
            >
              <option value="metric">Metric (meters, cm, hectares)</option>
              <option value="imperial">Imperial (feet, inches, acres)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Default Coordinate Reference System (CRS)
            </label>
            <select
              value={crs}
              onChange={(e) => setCrs(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
            >
              <option value="WGS84 (EPSG:4326)">WGS84 (EPSG:4326) - Global GNSS</option>
              <option value="UTM Zone 43N (EPSG:32643)">UTM Zone 43N (EPSG:32643) - India/Rajasthan</option>
              <option value="Web Mercator (EPSG:3857)">Web Mercator (EPSG:3857)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3D Rendering Performance */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          WebGL & Point Cloud Budget
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Maximum Point Cloud Density Budget
            </label>
            <select
              value={pointBudget}
              onChange={(e) => setPointBudget(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
            >
              <option value="5M">5 Million Points (Balanced / Laptops)</option>
              <option value="10M">10 Million Points (High Performance)</option>
              <option value="25M">25 Million Points (Ultra Workstation)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Shadow Quality & Shading
            </label>
            <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white">
              <option>PCF Soft Shadows (High Quality)</option>
              <option>Basic Shadows (Performance)</option>
              <option>Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security & Data Retention Notice */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-cyan-500/20 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Data Privacy & Retention Policy
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Uploaded survey data, raw video telemetry, and reconstructed 3D meshes should be handled according to the deployment environment&apos;s security and data retention policies. In enterprise deployments, point cloud models and vector GIS outputs are processed in isolated sandboxes and encrypted using AES-256.
        </p>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero telemetry logs transmitted to public indexing nodes.</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
