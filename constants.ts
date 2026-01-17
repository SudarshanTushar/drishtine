
import { GeoPoint, RoadSegment } from './types';

export const NE_HUBS: GeoPoint[] = [
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
  { name: 'Shillong', lat: 25.5788, lng: 91.8933 },
  { name: 'Gangtok', lat: 27.3314, lng: 88.6138 },
  { name: 'Itanagar', lat: 27.0844, lng: 93.6053 },
  { name: 'Kohima', lat: 25.6751, lng: 94.1086 },
  { name: 'Imphal', lat: 24.8170, lng: 93.9368 },
  { name: 'Aizawl', lat: 23.7271, lng: 92.7176 },
  { name: 'Agartala', lat: 23.8315, lng: 91.2868 },
  { name: 'Silchar', lat: 24.8333, lng: 92.7789 },
  { name: 'Tawang', lat: 27.5861, lng: 91.8594 },
];

export const ROAD_NETWORK: RoadSegment[] = [
  { id: '1', from: 'Guwahati', to: 'Shillong', distanceKm: 98, slopeDegrees: 12, roadQuality: 0.8, landslideRisk: 0.3, floodRisk: 0.1, isTribalRegion: true },
  { id: '2', from: 'Guwahati', to: 'Itanagar', distanceKm: 325, slopeDegrees: 5, roadQuality: 0.7, landslideRisk: 0.2, floodRisk: 0.4, isTribalRegion: false },
  { id: '3', from: 'Guwahati', to: 'Silchar', distanceKm: 310, slopeDegrees: 8, roadQuality: 0.5, landslideRisk: 0.5, floodRisk: 0.6, isTribalRegion: true },
  { id: '4', from: 'Shillong', to: 'Silchar', distanceKm: 210, slopeDegrees: 15, roadQuality: 0.4, landslideRisk: 0.7, floodRisk: 0.3, isTribalRegion: true },
  { id: '5', from: 'Itanagar', to: 'Kohima', distanceKm: 280, slopeDegrees: 10, roadQuality: 0.6, landslideRisk: 0.4, floodRisk: 0.2, isTribalRegion: true },
  { id: '6', from: 'Kohima', to: 'Imphal', distanceKm: 140, slopeDegrees: 14, roadQuality: 0.5, landslideRisk: 0.6, floodRisk: 0.1, isTribalRegion: true },
  { id: '7', from: 'Imphal', to: 'Aizawl', distanceKm: 450, slopeDegrees: 18, roadQuality: 0.4, landslideRisk: 0.8, floodRisk: 0.1, isTribalRegion: true },
  { id: '8', from: 'Silchar', to: 'Agartala', distanceKm: 250, slopeDegrees: 6, roadQuality: 0.6, landslideRisk: 0.3, floodRisk: 0.5, isTribalRegion: false },
  { id: '9', from: 'Gangtok', to: 'Guwahati', distanceKm: 520, slopeDegrees: 20, roadQuality: 0.7, landslideRisk: 0.9, floodRisk: 0.1, isTribalRegion: true },
  { id: '10', from: 'Itanagar', to: 'Tawang', distanceKm: 440, slopeDegrees: 25, roadQuality: 0.5, landslideRisk: 0.8, floodRisk: 0.1, isTribalRegion: true },
  
  // Restricted Emergency Shortcuts (e.g. military/service tracks)
  { id: 'sc1', from: 'Guwahati', to: 'Tawang', distanceKm: 280, slopeDegrees: 28, roadQuality: 0.2, landslideRisk: 0.85, floodRisk: 0.05, isTribalRegion: true, isEmergencyShortcut: true },
  { id: 'sc2', from: 'Silchar', to: 'Aizawl', distanceKm: 160, slopeDegrees: 22, roadQuality: 0.3, landslideRisk: 0.7, floodRisk: 0.2, isTribalRegion: true, isEmergencyShortcut: true },
  { id: 'sc3', from: 'Shillong', to: 'Guwahati', distanceKm: 75, slopeDegrees: 15, roadQuality: 0.4, landslideRisk: 0.5, floodRisk: 0.1, isTribalRegion: false, isEmergencyShortcut: true }
];

export const EMERGENCY_CORRIDORS = [
  { label: 'Air-Evac: Guwahati → Tawang', start: 'Guwahati', end: 'Tawang' },
  { label: 'Relief: Silchar → Aizawl', start: 'Silchar', end: 'Aizawl' },
  { label: 'Critical: Shillong → Guwahati', start: 'Shillong', end: 'Guwahati' },
];

export const APP_THEME = {
  primary: '#0f172a',
  secondary: '#334155',
  accent: '#3b82f6',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981'
};
