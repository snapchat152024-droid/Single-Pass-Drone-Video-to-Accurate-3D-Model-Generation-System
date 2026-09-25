import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { ExportModal } from './components/common/ExportModal';
import { AeroAIAssistant } from './components/common/AeroAIAssistant';
import { Dashboard } from './components/dashboard/Dashboard';
import { NewProjectWizard } from './components/new-project/NewProjectWizard';
import { UploadDataScreen } from './components/upload/UploadDataScreen';
import { ProcessingPipelineScreen } from './components/processing/ProcessingPipelineScreen';
import { ViewerScreen } from './components/viewer/ViewerScreen';
import { QualityReportScreen } from './components/analytics/QualityReportScreen';
import { ProjectsScreen } from './components/projects/ProjectsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { INITIAL_PROJECTS } from './data/sampleProjects';
import { Project } from './types';

const STORAGE_KEY = 'aero3d_ai_projects';

export default function App() {
  // Load saved projects or use initial
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved projects:', e);
    }
    return INITIAL_PROJECTS;
  });

  const [currentProject, setCurrentProject] = useState<Project>(projects[0] || INITIAL_PROJECTS[0]);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isProcessingActive, setIsProcessingActive] = useState(false);

  // Global modals
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [exportModalProject, setExportModalProject] = useState<Project | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [projects]);

  // Handle Launch Interactive Demo (End-to-end presentation flow)
  const handleLaunchInteractiveDemo = () => {
    const demoProj = projects.find((p) => p.id === 'proj-jaipur-demo') || projects[0];
    setCurrentProject(demoProj);
    setIsProcessingActive(true);
    setCurrentTab('upload-data');
  };

  // Open a specific project
  const handleOpenProject = (proj: Project) => {
    setCurrentProject(proj);
    if (proj.status === 'Processing') {
      setCurrentTab('processing');
    } else {
      setCurrentTab('viewer');
    }
  };

  // Duplicate a project
  const handleDuplicateProject = (proj: Project) => {
    const duplicated: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      name: `${proj.name} (Copy)`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setProjects((prev) => [duplicated, ...prev]);
  };

  // Delete a project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (currentProject.id === id && filtered.length > 0) {
        setCurrentProject(filtered[0]);
      }
      return filtered;
    });
  };

  // Add newly created project from Wizard
  const handleNewProjectCreated = (newProj: Project) => {
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProject(newProj);
    setIsProcessingActive(true);
    setCurrentTab('processing');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <Header
        currentProject={currentProject}
        onOpenNewProject={() => setCurrentTab('new-project')}
        onLaunchInteractiveDemo={handleLaunchInteractiveDemo}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          processingActive={isProcessingActive}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#0a0e17] relative">
          {currentTab === 'dashboard' && (
            <Dashboard
              projects={projects}
              onOpenProject={handleOpenProject}
              onOpenNewProject={() => setCurrentTab('new-project')}
              onLaunchInteractiveDemo={handleLaunchInteractiveDemo}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onOpenExport={(p) => setExportModalProject(p)}
            />
          )}

          {currentTab === 'new-project' && (
            <NewProjectWizard
              onComplete={handleNewProjectCreated}
              onCancel={() => setCurrentTab('dashboard')}
            />
          )}

          {currentTab === 'upload-data' && (
            <UploadDataScreen
              project={currentProject}
              onProceedToProcessing={() => {
                setIsProcessingActive(true);
                setCurrentTab('processing');
              }}
            />
          )}

          {currentTab === 'processing' && (
            <ProcessingPipelineScreen
              project={currentProject}
              onOpenModel={() => {
                setIsProcessingActive(false);
                // Mark project as Completed
                setProjects((prev) =>
                  prev.map((p) => (p.id === currentProject.id ? { ...p, status: 'Completed' } : p))
                );
                setCurrentProject((prev) => ({ ...prev, status: 'Completed' }));
                setCurrentTab('viewer');
              }}
              onCancel={() => {
                setIsProcessingActive(false);
                setCurrentTab('dashboard');
              }}
            />
          )}

          {currentTab === 'viewer' && (
            <ViewerScreen
              project={currentProject}
              onUpdateProject={(updated) => {
                setCurrentProject(updated);
                setProjects((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                );
              }}
            />
          )}

          {currentTab === 'analytics' && (
            <QualityReportScreen project={currentProject} />
          )}

          {currentTab === 'projects' && (
            <ProjectsScreen
              projects={projects}
              onOpenProject={handleOpenProject}
              onOpenNewProject={() => setCurrentTab('new-project')}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onOpenExport={(p) => setExportModalProject(p)}
            />
          )}

          {currentTab === 'settings' && <SettingsScreen />}
        </main>
      </div>

      {/* Floating Aero AI Assistant */}
      <AeroAIAssistant project={currentProject} />

      {/* Architecture Whitepaper Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Global Export Modal */}
      {exportModalProject && (
        <ExportModal
          isOpen={Boolean(exportModalProject)}
          onClose={() => setExportModalProject(null)}
          project={exportModalProject}
        />
      )}
    </div>
  );
}
