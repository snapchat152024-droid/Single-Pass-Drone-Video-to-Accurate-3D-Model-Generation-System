export type SurveyType =
  | 'Infrastructure Inspection'
  | 'Urban Mapping'
  | 'Disaster Assessment'
  | 'Construction Monitoring'
  | 'Terrain Mapping'
  | 'Digital Twin'
  | 'Other';

export type ProjectStatus = 'Completed' | 'Processing' | 'Ready for Review' | 'Failed';

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
  altitude: number; // meters
}

export interface FlightMetadata {
  droneModel: string;
  cameraModel: string;
  focalLength: string;
  groundSpeed: number; // m/s
  flightAltitude: number; // m
  groundSamplingDistance: number; // cm/px
  totalFlightTime: string;
  fps: number;
  totalFrames: number;
  gpsSamples: number;
  resolution: string;
}

export interface ProcessingConfig {
  quality: 'Preview' | 'Standard' | 'High';
  outputs: {
    pointCloud: boolean;
    texturedMesh: boolean;
    terrain: boolean;
    buildings: boolean;
    infrastructure: boolean;
    digitalTwin: boolean;
  };
  coordinateSystem: 'WGS84' | 'Local Project Coordinates';
  accuracyMode: 'Standard' | 'Precision';
}

export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  surveyType: SurveyType;
  videoFileName: string;
  videoFileSize: string;
  status: ProjectStatus;
  areaHectares: number;
  accuracyPercent: number;
  confidencePercent: number;
  createdAt: string;
  flightData: FlightMetadata;
  gpsCoordinates: GPSCoordinate;
  config: ProcessingConfig;
  estimatedPoints: string;
  meshFaces: string;
  buildingsDetected: number;
  roadLengthKm: number;
  aiInsights?: string[];
  thumbnailUrl?: string;
}

export interface MeasurementPoint {
  x: number;
  y: number;
  z: number;
}

export interface MeasurementRecord {
  id: string;
  type: 'distance' | 'area' | 'height';
  points: MeasurementPoint[];
  value: number; // meters or square meters
  unit: string;
  label: string;
  color: string;
  timestamp: string;
}

export interface ViewerLayers {
  terrain: boolean;
  buildings: boolean;
  roads: boolean;
  vegetation: boolean;
  infrastructure: boolean;
  pointCloud: boolean;
  texturedMesh: boolean;
  gpsTrack: boolean;
  wireframe: boolean;
  grid: boolean;
}

export type ViewerTool = 'select' | 'distance' | 'area' | 'height' | 'marker';

export interface PipelineStage {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  durationMs: number;
  metrics?: Record<string, string | number>;
}
