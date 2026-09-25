import React from 'react';
import { Layers, Eye, EyeOff, Mountain, Building2, Car, Trees, Radio, Navigation, Grid, Box } from 'lucide-react';
import { ViewerLayers } from '../../types';

interface LayersPanelProps {
  layers: ViewerLayers;
  onToggleLayer: (key: keyof ViewerLayers) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ layers, onToggleLayer }) => {
  const layerItems: { key: keyof ViewerLayers; label: string; icon: any; count?: string }[] = [
    { key: 'terrain', label: 'Terrain', icon: Mountain, count: '100m²' },
    { key: 'buildings', label: 'Buildings', icon: Building2, count: '17' },
    { key: 'roads', label: 'Roads & Corridors', icon: Car, count: '3.8km' },
    { key: 'vegetation', label: 'Vegetation Canopy', icon: Trees, count: '14' },
    { key: 'infrastructure', label: 'Infrastructure', icon: Radio, count: '2' },
    { key: 'pointCloud', label: 'Dense Point Cloud', icon: Box, count: '14k pts' },
    { key: 'gpsTrack', label: 'Drone Flight Trajectory', icon: Navigation, count: 'RTK Fix' },
    { key: 'wireframe', label: 'Wireframe Geometry', icon: Layers },
    { key: 'grid', label: 'Spatial Datum Grid', icon: Grid },
  ];

  return (
    <div className="bg-[#0f172a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-xl w-64 select-none">
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            3D Spatial Layers
          </h4>
        </div>
        <span className="text-[10px] text-cyan-400 font-mono">
          {Object.values(layers).filter(Boolean).length}/9 Active
        </span>
      </div>

      <div className="space-y-1">
        {layerItems.map((item) => {
          const Icon = item.icon;
          const isEnabled = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onToggleLayer(item.key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                isEnabled
                  ? 'bg-slate-800/80 text-white border border-white/10'
                  : 'bg-transparent text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${isEnabled ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="text-[11px] font-medium">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.count && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                    {item.count}
                  </span>
                )}
                {isEnabled ? (
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
