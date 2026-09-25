import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  FileVideo,
  MapPin,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  Radio,
  FileCheck,
  Zap,
} from 'lucide-react';
import { Project, SurveyType, ProcessingConfig } from '../../types';

interface NewProjectWizardProps {
  onComplete: (project: Project) => void;
  onCancel: () => void;
}

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('Corridor Alpha Reconstruction');
  const [location, setLocation] = useState('Sector 14 Corridor, Jaipur, India');
  const [description, setDescription] = useState(
    'Single-pass nadir corridor flight over commercial artery for GIS baseline update and digital twin generation.'
  );
  const [surveyType, setSurveyType] = useState<SurveyType>('Urban Mapping');

  // Video State
  const [videoFile, setVideoFile] = useState<{
    name: string;
    size: string;
    duration: string;
    resolution: string;
    fps: number;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(100);

  // Flight & GPS Data
  const [latitude, setLatitude] = useState(26.9124);
  const [longitude, setLongitude] = useState(75.7873);
  const [altitude, setAltitude] = useState(75.0);
  const [droneModel, setDroneModel] = useState('DJI Matrice 350 RTK');
  const [cameraSensor, setCameraSensor] = useState('Zenmuse P1 35mm');
  const [rtkEnabled, setRtkEnabled] = useState(true);
  const [imuDataIncluded, setImuDataIncluded] = useState(true);

  // Processing Configuration
  const [quality, setQuality] = useState<'Preview' | 'Standard' | 'High'>('High');
  const [outputs, setOutputs] = useState({
    pointCloud: true,
    texturedMesh: true,
    terrain: true,
    buildings: true,
    infrastructure: true,
    digitalTwin: true,
  });
  const [coordinateSystem, setCoordinateSystem] = useState<'WGS84' | 'Local Project Coordinates'>('WGS84');
  const [accuracyMode, setAccuracyMode] = useState<'Standard' | 'Precision'>('Precision');

  const surveyTypes: SurveyType[] = [
    'Infrastructure Inspection',
    'Urban Mapping',
    'Disaster Assessment',
    'Construction Monitoring',
    'Terrain Mapping',
    'Digital Twin',
    'Other',
  ];

  const handleUseSampleVideo = () => {
    setVideoFile({
      name: 'DJI_0492_CorridorSurvey_4K.MP4',
      size: '1.42 GB',
      duration: '01:42',
      resolution: '3840 x 2160 (4K)',
      fps: 30,
    });
    setUploadProgress(100);
  };

  const handleStartProcessing = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: name || 'Untitled Drone Reconstruction',
      location: location || 'Survey Site',
      description: description || 'Single pass drone photogrammetric reconstruction.',
      surveyType,
      videoFileName: videoFile?.name || 'DJI_0492_CorridorSurvey_4K.MP4',
      videoFileSize: videoFile?.size || '1.42 GB',
      status: 'Processing',
      areaHectares: 12.8,
      accuracyPercent: 95.8,
      confidencePercent: 93,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      flightData: {
        droneModel,
        cameraModel: cameraSensor,
        focalLength: '35 mm',
        groundSpeed: 8.5,
        flightAltitude: altitude,
        groundSamplingDistance: 2.4,
        totalFlightTime: videoFile?.duration || '01:42',
        fps: videoFile?.fps || 30,
        totalFrames: 3060,
        gpsSamples: 1024,
        resolution: videoFile?.resolution || '3840 x 2160 (4K)',
      },
      gpsCoordinates: {
        latitude,
        longitude,
        altitude,
      },
      config: {
        quality,
        outputs,
        coordinateSystem,
        accuracyMode,
      },
      estimatedPoints: '8.4M',
      meshFaces: '2.6M',
      buildingsDetected: 17,
      roadLengthKm: 3.8,
      aiInsights: [
        '17 building structures detected with distinct roof footprints and height profiles.',
        'Primary road network successfully reconstructed with clean curb delineations.',
        'Vegetation is concentrated along the northern boundary and civic park area.',
        'Several roof surfaces have limited viewing coverage due to single-pass nadir angle.',
        'Potential reconstruction uncertainty detected near occluded perimeter walls.'
      ],
    };

    onComplete(newProj);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8">
      {/* Container */}
      <div className="rounded-2xl bg-[#0f172a] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Header with Progress Steps */}
        <div className="p-6 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Project Creation Wizard
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                New 3D Reconstruction Mission
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { num: 1, label: '1. Project Info' },
              { num: 2, label: '2. Drone Video' },
              { num: 3, label: '3. Flight & GPS' },
              { num: 4, label: '4. AI Configuration' },
            ].map((s) => (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border transition-all ${
                  step === s.num
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold'
                    : step > s.num
                    ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900/40 border-white/5 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {step > s.num ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full text-[10px] flex items-center justify-center font-mono">
                      {s.num}
                    </span>
                  )}
                  <span className="truncate">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6">
          {/* STEP 1: Project Information */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jaipur Infrastructure Corridor Flight"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Survey Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State, Country"
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Survey Type *
                  </label>
                  <select
                    value={surveyType}
                    onChange={(e) => setSurveyType(e.target.value as SurveyType)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {surveyTypes.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mission Description & Objective
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly state flight parameters, survey corridor targets, or inspection focus..."
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Upload Drone Video */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Drag & Drop Zone */}
              <div
                onClick={handleUseSampleVideo}
                className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400/80 bg-slate-900/50 hover:bg-cyan-950/20 rounded-2xl p-8 text-center transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Upload your single-pass drone video
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Drag and drop raw corridor or orbital video file here, or click to browse.
                </p>
                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-mono">MP4</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-mono">MOV</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-mono">AVI</span>
                  <span className="text-cyan-400">• Recommended: 1080p or 4K</span>
                </div>
              </div>

              {/* Sample Drone Video Button */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="text-xs">
                  <span className="font-semibold text-cyan-300 block">
                    No drone video on hand right now?
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Load our verified 4K corridor sample flight to test the full 3D pipeline.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleUseSampleVideo}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  Use Sample Drone Video
                </button>
              </div>

              {/* Uploaded File Card */}
              {videoFile && (
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <FileVideo className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{videoFile.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {videoFile.size} · {videoFile.duration} · {videoFile.resolution} · {videoFile.fps} FPS
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-emerald-400">
                    <span>Upload verification complete</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Location & Flight Data */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Latitude (WGS84)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Longitude (WGS84)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Flight Altitude AGL (m)
                  </label>
                  <input
                    type="number"
                    value={altitude}
                    onChange={(e) => setAltitude(parseFloat(e.target.value))}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Hardware & Sensor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Drone Model
                  </label>
                  <input
                    type="text"
                    value={droneModel}
                    onChange={(e) => setDroneModel(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Camera & Lens Intrinsics
                  </label>
                  <input
                    type="text"
                    value={cameraSensor}
                    onChange={(e) => setCameraSensor(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Telemetry Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rtkEnabled}
                    onChange={(e) => setRtkEnabled(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">RTK / PPK Corrections</span>
                    <span className="text-[10px] text-slate-400">Sub-centimeter kinematic positioning fix</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={imuDataIncluded}
                    onChange={(e) => setImuDataIncluded(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">Synchronized IMU Attitude</span>
                    <span className="text-[10px] text-slate-400">Pitch, roll, and yaw gyro alignment</span>
                  </div>
                </label>
              </div>

              {/* Map Preview Placeholder */}
              <div className="h-32 rounded-xl bg-slate-900/90 border border-white/10 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative text-center space-y-1">
                  <MapPin className="w-6 h-6 text-cyan-400 mx-auto animate-bounce" />
                  <div className="text-xs font-semibold text-white">
                    Survey Origin Pin: Lat {latitude}° N, Lon {longitude}° E
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Datum: WGS84 (EPSG:4326) · Estimated Corridor Swath: 12.8 Hectares
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Processing Configuration */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Quality Preset */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reconstruction Quality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Preview', 'Standard', 'High'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuality(q)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        quality === q
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs">{q}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {q === 'Preview' && 'Rapid SfM sparse cloud'}
                        {q === 'Standard' && 'Balanced dense mesh'}
                        {q === 'High' && 'Full Poisson 8M+ points'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Outputs Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target 3D Spatial Outputs
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(outputs).map(([key, val]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer hover:border-white/10"
                    >
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) =>
                          setOutputs((prev) => ({ ...prev, [key]: e.target.checked }))
                        }
                        className="rounded text-cyan-500"
                      />
                      <span className="capitalize text-slate-200 text-[11px]">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Coordinate System & Accuracy Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Coordinate Reference System
                  </label>
                  <select
                    value={coordinateSystem}
                    onChange={(e) => setCoordinateSystem(e.target.value as any)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="WGS84">WGS84 (EPSG:4326) - Global GPS</option>
                    <option value="Local Project Coordinates">Local Project Coordinates (UTM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Accuracy Mode
                  </label>
                  <select
                    value={accuracyMode}
                    onChange={(e) => setAccuracyMode(e.target.value as any)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Precision">Precision (Sub-5cm Ground Sampling)</option>
                    <option value="Standard">Standard (General Terrain Survey)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 2 && !videoFile) {
                  handleUseSampleVideo();
                }
                setStep((s) => (s + 1) as any);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleStartProcessing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 font-extrabold text-xs shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Start AI Reconstruction</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
