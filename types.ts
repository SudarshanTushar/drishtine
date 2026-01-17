
export interface GeoPoint {
  lat: number;
  lng: number;
  name: string;
}

export interface RoadSegment {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  slopeDegrees: number;
  roadQuality: number; // 0-1 (1 is perfect)
  landslideRisk: number; // 0-1
  floodRisk: number; // 0-1
  isTribalRegion: boolean;
  isEmergencyShortcut?: boolean; // New: Restricted paths for relief/medical
}

export interface WeatherData {
  rainfallMm: number;
  rainfall7DayAvg: number;
  alertLevel: 'GREEN' | 'YELLOW' | 'RED';
}

export interface Route {
  id: 'safest' | 'shortcut';
  path: GeoPoint[];
  totalDistance: number;
  totalRiskScore: number;
  avgSafetyScore: number;
  explanation: string;
  segments: RoadSegment[];
  hasEmergencyShortcut: boolean;
}

export enum UserRole {
  PUBLIC = 'PUBLIC',
  GOVERNMENT = 'GOVERNMENT'
}

export interface DashboardStats {
  activeAlerts: number;
  emergencyVehicles: number;
  avgRoadSafety: number;
  riskTrend: number[];
}
