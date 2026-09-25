import React, { useRef, useEffect } from 'react';
import {
  Plus,
  Play,
  Layers,
  CheckCircle2,
  Clock,
  MapPin,
  FileVideo,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Trash2,
  Copy,
  ExternalLink,
  ChevronRight,
  Download,
  ShieldCheck,
} from 'lucide-react';
import * as THREE from 'three';
import { Project, ProjectStatus } from '../../types';

interface DashboardProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onOpenNewProject: () => void;
  onLaunchInteractiveDemo: () => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenExport: (project: Project) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  onOpenProject,
  onOpenNewProject,
  onLaunchInteractiveDemo,
  onDuplicateProject,
  onDeleteProject,
  onOpenExport,
}) => {
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const latestProject = projects[0] || null;

  // Render miniature interactive Three.js 3D model for dashboard preview
  useEffect(() => {
    if (!miniCanvasRef.current) return;
    const canvas = miniCanvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(22, 18, 26);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(15, 25, 10);
    scene.add(dirLight);

    // Mini terrain
    const grid = new THREE.GridHelper(30, 20, 0x00e5ff, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Mini building cluster
    const cluster = new THREE.Group();
    const matA = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const matB = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const matC = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });

    const bConfigs = [
      { x: -5, z: -4, w: 4, d: 4, h: 8, mat: matA },
      { x: 3, z: -3, w: 5, d: 4, h: 11, mat: matB },
      { x: -3, z: 4, w: 4, d: 5, h: 6, mat: matC },
      { x: 4, z: 3, w: 3, d: 3, h: 9, mat: matA },
      { x: 0, z: 0, w: 3, d: 3, h: 14, mat: matB },
    ];

    bConfigs.forEach((cfg) => {
      const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      geo.translate(0, cfg.h / 2, 0);
      const mesh = new THREE.Mesh(geo, cfg.mat);
      cluster.add(mesh);
    });

    // Glowing flight line
    const flightPts = [
      new THREE.Vector3(-12, 14, -12),
      new THREE.Vector3(0, 14, 0),
      new THREE.Vector3(12, 14, 12),
    ];
    const curve = new THREE.CatmullRomCurve3(flightPts);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
    const curveMat = new THREE.LineBasicMaterial({ color: 0x00e5ff });
    cluster.add(new THREE.Line(curveGeo, curveMat));

    scene.add(cluster);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      cluster.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Processing
          </span>
        );
      case 'Ready for Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Ready for Review
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
              Autonomous Spatial Intelligence
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-400">Single-Pass Photogrammetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Good morning.
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Transform drone footage into actionable 3D intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Launch Interactive Demo Presentation CTA */}
          <button
            onClick={onLaunchInteractiveDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-bold text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all transform hover:scale-105 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch Interactive Demo</span>
          </button>

          {/* New Reconstruction CTA */}
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>+ New Reconstruction</span>
          </button>
        </div>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Projects */}
        <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Projects</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">4</span>
            <span className="text-xs text-cyan-400 font-medium">1 in pipeline</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Corridor & infrastructure surveys
          </div>
        </div>

        {/* Card 2: Completed Models */}
        <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Completed Models</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">12</span>
            <span className="text-xs text-emerald-400 font-medium">+3 this week</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            95.8% average metric accuracy
          </div>
        </div>

        {/* Card 3: Total Area Mapped */}
        <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-white/10 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Area Mapped</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">148.5</span>
            <span className="text-xs text-blue-400 font-medium">hectares</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Across 8 municipal sectors
          </div>
        </div>

        {/* Card 4: Average Processing Time */}
        <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Processing Time</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">3m 42s</span>
            <span className="text-xs text-amber-400 font-medium">Single-pass GPU</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            75% faster than grid flights
          </div>
        </div>
      </div>

      {/* Large Dashboard Visualization: "Latest 3D Reconstruction" */}
      {latestProject && (
        <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#0a0d14] border border-cyan-500/30 p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {/* Left information */}
            <div className="lg:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    Latest 3D Reconstruction
                  </span>
                  <span className="text-xs text-slate-400">• {latestProject.createdAt}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  {latestProject.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {latestProject.description}
                </p>
              </div>

              {/* Key Specs Matrix */}
              <div className="grid grid-cols-3 gap-2.5 py-3 border-y border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Survey Area</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {latestProject.areaHectares} ha
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Point Cloud</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {latestProject.estimatedPoints}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Accuracy</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {latestProject.accuracyPercent}%
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenProject(latestProject)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  <span>Open Full 3D Model</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenExport(latestProject)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export Assets</span>
                </button>
              </div>
            </div>

            {/* Right: Miniature Interactive Three.js Preview */}
            <div className="lg:w-1/2 h-64 sm:h-72 rounded-xl overflow-hidden border border-white/10 relative bg-black">
              <canvas ref={miniCanvasRef} className="w-full h-full block" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-cyan-400 border border-white/10">
                LIVE 3D PREVIEW
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 border border-white/10">
                17 Buildings · 3.8 km Corridor
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Projects Table */}
      <div className="rounded-2xl bg-[#0f172a]/70 border border-white/10 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Projects
            </h3>
            <p className="text-xs text-slate-400">
              Single-pass photogrammetric survey history and processing states
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {projects.length} Total Projects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/60 text-slate-400 font-medium">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Video Ingest</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((proj) => (
                <tr
                  key={proj.id}
                  className="hover:bg-cyan-950/20 transition-colors group cursor-pointer"
                  onClick={() => onOpenProject(proj)}
                >
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{proj.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {proj.location}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <FileVideo className="w-3 h-3 text-blue-400" />
                      {proj.videoFileName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(proj.status)}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {proj.areaHectares} ha
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                    {proj.accuracyPercent}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {proj.createdAt}
                  </td>
                  <td
                    className="py-3.5 px-4 text-right space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onOpenProject(proj)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold transition-colors cursor-pointer"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => onDuplicateProject(proj)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Duplicate Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenExport(proj)}
                      className="p-1 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Export Assets"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
