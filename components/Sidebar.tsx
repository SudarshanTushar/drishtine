
import React, { useMemo } from 'react';
import { UserRole, WeatherData, Route } from '../types';
import { NE_HUBS, EMERGENCY_CORRIDORS, ROAD_NETWORK } from '../constants';

interface SidebarProps {
  role: UserRole;
  setRole: (r: UserRole) => void;
  start: string;
  setStart: (s: string) => void;
  end: string;
  setEnd: (e: string) => void;
  startEmergency: boolean;
  setStartEmergency: (b: boolean) => void;
  endEmergency: boolean;
  setEndEmergency: (b: boolean) => void;
  weather: WeatherData;
  setWeather: (w: WeatherData) => void;
  onCalculate: (s?: string, e?: string) => void;
  isCalculating: boolean;
  routes: { safest: Route | null; shortcut: Route | null };
  focusedRouteId: 'safest' | 'shortcut';
  setFocusedRouteId: (id: 'safest' | 'shortcut') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  start, setStart, end, setEnd, startEmergency, setStartEmergency, endEmergency, setEndEmergency, weather, setWeather, onCalculate, isCalculating, routes, focusedRouteId, setFocusedRouteId
}) => {
  const handleCorridorClick = (s: string, e: string) => {
    setStart(s);
    setEnd(e);
    setStartEmergency(false);
    setEndEmergency(true); // Predefined corridors usually imply end-point distress
    onCalculate(s, e);
  };

  /**
   * Calculates a simplified accessibility score for each hub based on current weather and adjacent road risks.
   */
  const hubStatuses = useMemo(() => {
    return NE_HUBS.map(hub => {
      const adjacentRoads = ROAD_NETWORK.filter(r => r.from === hub.name || r.to === hub.name);
      const avgRisk = adjacentRoads.reduce((acc, r) => acc + (r.landslideRisk + r.floodRisk), 0) / (adjacentRoads.length || 1);
      const weatherFactor = weather.rainfallMm / 200;
      const safetyIndex = Math.max(0, 1 - (avgRisk + weatherFactor));
      
      return {
        name: hub.name,
        safety: safetyIndex,
        status: safetyIndex > 0.7 ? 'ACCESSIBLE' : safetyIndex > 0.4 ? 'DEGRADED' : 'CRITICAL'
      };
    });
  }, [weather]);

  return (
    <aside className="w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col p-6 overflow-y-auto scrollbar-hide">
      <div className="mb-8">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block underline decoration-slate-200 underline-offset-4">Mission Configuration</label>
        
        {/* Origin Selector with SOS */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase">Origin Hub</span>
            <button 
              onClick={() => setStartEmergency(!startEmergency)}
              className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter transition-all ${startEmergency ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
            >
              <i className="fa-solid fa-triangle-exclamation mr-1"></i> SOS
            </button>
          </div>
          <select 
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-semibold focus:ring-2 outline-none shadow-sm transition-all duration-300 ${startEmergency ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:ring-blue-500'}`}
          >
            {NE_HUBS.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
          </select>
        </div>

        <div className="flex justify-center -my-1"><i className="fa-solid fa-arrows-up-down text-slate-300"></i></div>

        {/* Destination Selector with SOS */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase">Target Hub</span>
            <button 
              onClick={() => setEndEmergency(!endEmergency)}
              className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter transition-all ${endEmergency ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
            >
              <i className="fa-solid fa-triangle-exclamation mr-1"></i> SOS
            </button>
          </div>
          <select 
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-semibold focus:ring-2 outline-none shadow-sm transition-all duration-300 ${endEmergency ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:ring-blue-500'}`}
          >
            {NE_HUBS.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
          </select>
        </div>
      </div>

      {/* Path Comparison */}
      {(routes.safest || routes.shortcut) && (
        <div className="mb-8 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4 block">Select Strategy</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'safest', label: 'Safest Path', icon: 'fa-shield-heart', color: 'emerald' },
              { id: 'shortcut', label: 'Tactical Shortcut', icon: 'fa-bolt', color: 'amber' }
            ].map(opt => {
              const route = routes[opt.id as 'safest' | 'shortcut'];
              const isActive = focusedRouteId === opt.id;
              if (!route) return null;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFocusedRouteId(opt.id as 'safest' | 'shortcut')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive 
                      ? `border-${opt.color}-500 bg-${opt.color}-50 ring-2 ring-${opt.color}-100` 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold flex items-center gap-2 ${isActive ? `text-${opt.color}-700` : 'text-slate-600'}`}>
                      <i className={`fa-solid ${opt.icon}`}></i>
                      {opt.label}
                    </span>
                    {isActive && <i className={`fa-solid fa-circle-check text-${opt.color}-500`}></i>}
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{route.totalDistance} km</span>
                    <span>Safety: {(route.avgSafetyScore * 100).toFixed(0)}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Strategic Hubs List */}
      <div className="mb-8">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block underline decoration-slate-200 underline-offset-4">Regional Status</label>
        <div className="grid grid-cols-2 gap-2">
          {hubStatuses.map(hub => (
            <div key={hub.name} className="bg-white border border-slate-200 p-2 rounded-lg flex items-center justify-between group hover:border-blue-200 transition-colors">
              <span className="text-[10px] font-bold text-slate-600 truncate mr-1">{hub.name}</span>
              <div 
                className={`w-2 h-2 rounded-full shadow-sm ${
                  hub.status === 'ACCESSIBLE' ? 'bg-emerald-500' : 
                  hub.status === 'DEGRADED' ? 'bg-amber-400 animate-pulse' : 
                  'bg-red-500 animate-ping'
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className={`mb-8 p-4 border rounded-xl shadow-sm transition-all duration-300 ${(startEmergency || endEmergency) ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <label className={`text-sm font-bold ${(startEmergency || endEmergency) ? 'text-red-700' : 'text-slate-700'}`}>Emergency Corridors</label>
          <i className={`fa-solid fa-truck-medical ${(startEmergency || endEmergency) ? 'text-red-600 animate-bounce' : 'text-slate-300'}`}></i>
        </div>
        <div className="mt-3 space-y-2">
          {EMERGENCY_CORRIDORS.map((c, i) => (
            <button key={i} onClick={() => handleCorridorClick(c.start, c.end)} className="w-full text-left p-2 rounded bg-white border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Rainfall: {weather.rainfallMm}mm</label>
        <input type="range" min="0" max="250" value={weather.rainfallMm} onChange={(e) => setWeather({...weather, rainfallMm: parseInt(e.target.value), alertLevel: parseInt(e.target.value) > 150 ? 'RED' : 'YELLOW'})} className="w-full accent-blue-600" />
      </div>

      <button onClick={() => onCalculate()} disabled={isCalculating} className="mt-auto w-full font-black py-4 rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 text-white uppercase text-sm tracking-wider transition-all active:scale-95 disabled:opacity-50">
        {isCalculating ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (startEmergency || endEmergency) ? 'Initialize Rescue Route' : 'Analyze Strategic Path'}
      </button>
    </aside>
  );
};

export default Sidebar;
