import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Layers,
  ArrowUpRight,
  Copy,
  Trash2,
  Download,
  Box,
  FileVideo,
} from 'lucide-react';
import { Project, ProjectStatus } from '../../types';

interface ProjectsScreenProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onOpenNewProject: () => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenExport: (project: Project) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  onOpenProject,
  onOpenNewProject,
  onDuplicateProject,
  onDeleteProject,
  onOpenExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.surveyType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse">
            Processing
          </span>
        );
      case 'Ready for Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Ready for Review
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              Survey Database
            </span>
            <span className="text-xs text-slate-400">• Persistent localStorage</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Project History</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage photogrammetric single-pass reconstructions and spatial exports.
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Reconstruction</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by name, city, or survey type..."
            className="w-full bg-[#0f172a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Ready for Review">Ready for Review</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  {proj.surveyType}
                </span>
                {getStatusBadge(proj.status)}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {proj.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {proj.description}
              </p>

              <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Location</span>
                  <span className="text-slate-200 truncate block text-[11px]">
                    {proj.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Area</span>
                  <span className="text-slate-200 font-mono text-[11px]">
                    {proj.areaHectares} ha
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Accuracy</span>
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                    {proj.accuracyPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Created: {proj.createdAt}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onDuplicateProject(proj)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenExport(proj)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Export Assets"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenProject(proj)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer ml-1"
                >
                  <span>Open 3D</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
