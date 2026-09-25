import React from 'react';
import { Play, Plus, Network, ShieldCheck, Cpu } from 'lucide-react';
import { Project } from '../../types';

interface HeaderProps {
  currentProject: Project;
  onOpenNewProject: () => void;
  onLaunchInteractiveDemo: () => void;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  onOpenNewProject,
  onLaunchInteractiveDemo,
  onOpenArchitecture,
}) => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0d14]/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          {/* Geometric Drone + Terrain + Cube SVG Logo */}
          <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            {/* 3D Cube */}
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
            {/* Drone Rotors Corner Accents */}
            <circle cx="5" cy="5" r="1.5" fill="#38bdf8" />
            <circle cx="19" cy="5" r="1.5" fill="#38bdf8" />
            <circle cx="12" cy="12" r="1" fill="#00e5ff" />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Aero3D<span className="text-cyan-400 font-extrabold">AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              PROTOTYPE / DEMO MODE
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            Turn One Drone Flight Into a Digital 3D World
          </p>
        </div>
      </div>

      {/* Center project identifier */}
      <div className="hidden xl:flex items-center gap-2 bg-slate-900/60 border border-white/10 px-3 py-1.5 rounded-lg text-xs">
        <span className="text-slate-400">Active Project:</span>
        <span className="font-medium text-slate-200 truncate max-w-[200px]">
          {currentProject.name}
        </span>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
          {currentProject.status}
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Architecture diagram CTA */}
        <button
          onClick={onOpenArchitecture}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 rounded-lg transition-colors cursor-pointer"
          title="View Single-Pass Photogrammetry Architecture"
        >
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pipeline Architecture</span>
        </button>

        {/* Launch Interactive Demo (Primary Demo Highlight!) */}
        <button
          onClick={onLaunchInteractiveDemo}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform hover:scale-[1.02] cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Interactive Demo</span>
        </button>

        {/* New Reconstruction CTA */}
        <button
          onClick={onOpenNewProject}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-white/15 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">+ New Reconstruction</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </header>
  );
};
