import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Project } from '../../types';

interface AIInsightsPanelProps {
  project: Project;
  onUpdateInsights?: (insights: string[]) => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  project,
  onUpdateInsights,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string[]>(
    project.aiInsights || [
      '17 building structures detected with crisp roofline boundaries.',
      'Primary road network successfully reconstructed with sub-5cm vertical accuracy.',
      'Vegetation is concentrated along the northern boundary and civic greenway.',
      'Several roof surfaces have limited viewing coverage from single-pass nadir.',
      'Potential reconstruction uncertainty detected near occluded perimeter walls.'
    ]
  );
  const [summary, setSummary] = useState<string>(
    'Single-pass photogrammetric reconstruction shows optimal parallax across central corridor. Surface normal consistency exceeds 92.4%.'
  );

  const handleAnalyzeScene = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.name,
          surveyType: project.surveyType,
          area: `${project.areaHectares} hectares`,
          buildingsDetected: project.buildingsDetected,
          roadLength: project.roadLengthKm,
          customContext: 'Single-pass 4K nadir drone video with RTK and IMU timestamps.',
        }),
      });

      const data = await res.json();
      if (data.insights && data.insights.length > 0) {
        setInsights(data.insights);
        if (onUpdateInsights) onUpdateInsights(data.insights);
      }
      if (data.structuralSummary) {
        setSummary(data.structuralSummary);
      }
    } catch (err) {
      console.warn('Analysis fallback:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl w-72 select-none text-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Gemini AI Scene Analysis
          </h4>
        </div>
        <span className="text-[10px] text-cyan-400 font-mono">v3.8 Flash</span>
      </div>

      {/* Summary Box */}
      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-slate-300 text-[11px] leading-relaxed">
        {summary}
      </div>

      {/* Observations List */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Photogrammetric Observations
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-slate-900/60 border border-white/5 text-[11px] text-slate-300 flex items-start gap-2"
            >
              {idx === 3 || idx === 4 ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analyze Scene Button */}
      <button
        onClick={handleAnalyzeScene}
        disabled={isAnalyzing}
        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-60"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing Scene Geometry...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-Analyze Scene</span>
          </>
        )}
      </button>
    </div>
  );
};
