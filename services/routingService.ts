
import { ROAD_NETWORK, NE_HUBS } from '../constants';
import { RoadSegment, GeoPoint, Route, WeatherData } from '../types';

/**
 * Internal core router using Dijkstra with configurable weights
 */
const findPath = (
  startName: string,
  endName: string,
  weather: WeatherData,
  isEmergency: boolean,
  mode: 'safest' | 'shortcut'
): Route | null => {
  const nodes = NE_HUBS.map(h => h.name);
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();

  nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[startName] = 0;

  while (visited.size < nodes.length) {
    let minNode: string | null = null;
    nodes.forEach(node => {
      if (!visited.has(node) && (minNode === null || distances[node] < distances[minNode])) {
        minNode = node;
      }
    });

    if (minNode === null || distances[minNode] === Infinity) break;
    if (minNode === endName) break;

    visited.add(minNode);

    const neighbors = ROAD_NETWORK.filter(r => {
      const isConnected = r.from === minNode || r.to === minNode;
      if (!isConnected) return false;
      if (isEmergency) {
        return r.isEmergencyShortcut === true || typeof r.isEmergencyShortcut === 'undefined';
      }
      return !r.isEmergencyShortcut;
    });

    neighbors.forEach(edge => {
      const neighbor = edge.from === minNode ? edge.to : edge.from;
      if (visited.has(neighbor)) return;

      let weight = edge.distanceKm;

      if (mode === 'safest') {
        const weatherMultiplier = 1 + (weather.rainfallMm / 100);
        const safetyFactor = (edge.landslideRisk * 2.5 * weatherMultiplier) + 
                             (edge.floodRisk * 1.5 * weatherMultiplier) + 
                             (edge.slopeDegrees / 15);
        weight = edge.distanceKm + (safetyFactor * 150);
      } else {
        // Shortcut mode: purely distance-focused, but slight penalty for extremely poor roads
        weight = edge.distanceKm * (1 + (1 - edge.roadQuality) * 0.1);
        // Tactical bonus for emergency shortcuts in emergency mode
        if (edge.isEmergencyShortcut && isEmergency) {
          weight *= 0.5; 
        }
      }

      const alt = distances[minNode!] + weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = minNode!;
      }
    });
  }

  const pathNames: string[] = [];
  let curr: string | null = endName;
  while (curr !== null) {
    pathNames.unshift(curr);
    curr = previous[curr];
  }

  if (pathNames[0] !== startName) return null;

  const pathPoints = pathNames.map(name => NE_HUBS.find(h => h.name === name)!);
  const segments: RoadSegment[] = [];
  let hasEmergencyShortcut = false;

  for (let i = 0; i < pathNames.length - 1; i++) {
    const edge = ROAD_NETWORK.find(
      r => ((r.from === pathNames[i] && r.to === pathNames[i+1]) || 
           (r.to === pathNames[i] && r.from === pathNames[i+1])) &&
           (isEmergency ? (r.isEmergencyShortcut === true || typeof r.isEmergencyShortcut === 'undefined') : !r.isEmergencyShortcut)
    );
    if (edge) {
      segments.push(edge);
      if (edge.isEmergencyShortcut) hasEmergencyShortcut = true;
    }
  }

  const totalDistance = segments.reduce((acc, s) => acc + s.distanceKm, 0);
  const totalRisk = segments.reduce((acc, s) => acc + (s.landslideRisk + s.floodRisk), 0) / (segments.length || 1);

  return {
    id: mode,
    path: pathPoints,
    totalDistance,
    totalRiskScore: totalRisk,
    avgSafetyScore: 1 - totalRisk,
    explanation: "",
    segments,
    hasEmergencyShortcut
  };
};

export const calculateSafestRoute = (
  startName: string,
  endName: string,
  weather: WeatherData,
  isEmergency: boolean
): { safest: Route | null; shortcut: Route | null } => {
  return {
    safest: findPath(startName, endName, weather, isEmergency, 'safest'),
    shortcut: findPath(startName, endName, weather, isEmergency, 'shortcut')
  };
};

export const getRiskColor = (score: number) => {
  if (score < 0.25) return '#10b981';
  if (score < 0.55) return '#f59e0b';
  return '#ef4444';
};
