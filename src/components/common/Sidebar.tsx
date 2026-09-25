import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Video,
  Cpu,
  Box,
  BarChart3,
  FolderGit2,
  Settings,
  Sparkles,
  Radio,
  Compass,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'new-project'
  | 'upload-data'
  | 'processing'
  | 'viewer'
  | 'analytics'
  | 'projects'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  processingActive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  processingActive = false,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'new-project' as NavTab,
      label: 'New Project',
      icon: PlusCircle,
      badge: undefined,
    },
    {
      id: 'upload-data' as NavTab,
      label: 'Upload & Data',
      icon: Video,
      badge: '4K Ingest',
    },
    {
      id: 'processing' as NavTab,
      label: 'AI Processing',
      icon: Cpu,
      badge: processingActive ? 'Active' : undefined,
      pulse: processingActive,
    },
    {
      id: 'viewer' as NavTab,
      label: '3D Viewer',
      icon: Box,
      badge: '3D',
      highlight: true,
    },
    {
      id: 'analytics' as NavTab,
      label: 'Analytics',
      icon: BarChart3,
      badge: '95.8%',
    },
    {
      id: 'projects' as NavTab,
      label: 'Projects',
      icon: FolderGit2,
      badge: undefined,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <aside className="w-60 bg-[#0d1117] border-r border-white/10 flex flex-col justify-between shrink-0 select-none">
      {/* Top Nav links */}
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-cyan-400'
                      : item.highlight
                      ? 'text-cyan-400'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    item.pulse
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      : isActive
                      ? 'bg-cyan-500/20 text-cyan-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status Panel */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Engine</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Online
          </span>
        </div>

        <div className="text-[10px] text-slate-400 space-y-1 pt-1 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-cyan-400" />
              RTK GNSS
            </span>
            <span className="text-slate-300 font-mono">FIXED (18 Sats)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Compass className="w-2.5 h-2.5 text-cyan-400" />
              Datum
            </span>
            <span className="text-slate-300 font-mono">WGS84 EPSG:4326</span>
          </div>
        </div>

        <div className="pt-1">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[94%]" />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 mt-1">
            <span>GPU Reconstruction</span>
            <span className="text-cyan-400 font-mono">94% Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
