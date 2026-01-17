import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UserRole, Route, WeatherData } from "./types";
import { calculateSafestRoute } from "./services/routingService";
import { getRouteExplanation } from "./services/claudeService";
import Sidebar from "./components/Sidebar";
import MapContainer from "./components/MapContainer";
import Dashboard from "./components/Dashboard";

interface EmergencyAlert {
  type: "WEATHER" | "BLOCKAGE" | "MISSION";
  message: string;
  severity: "CRITICAL" | "WARNING";
}

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.PUBLIC);
  const [start, setStart] = useState<string>("Guwahati");
  const [end, setEnd] = useState<string>("Gangtok");

  const [startEmergency, setStartEmergency] = useState(false);
  const [endEmergency, setEndEmergency] = useState(false);

  const [weather, setWeather] = useState<WeatherData>({
    rainfallMm: 45,
    rainfall7DayAvg: 30,
    alertLevel: "YELLOW",
  });

  const [routes, setRoutes] = useState<{
    safest: Route | null;
    shortcut: Route | null;
  }>({ safest: null, shortcut: null });
  const [focusedRouteId, setFocusedRouteId] = useState<"safest" | "shortcut">(
    "safest",
  );
  const [explanation, setExplanation] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const activeRoute = routes[focusedRouteId];
  const altRoute =
    focusedRouteId === "safest" ? routes.shortcut : routes.safest;

  const isEmergencyActive = startEmergency || endEmergency;

  /**
   * Real-time Emergency Alert Monitor
   */
  const activeAlerts = useMemo(() => {
    const alerts: EmergencyAlert[] = [];

    // 1. Weather Alerts
    if (weather.alertLevel === "RED") {
      alerts.push({
        type: "WEATHER",
        message: `EXTREME PRECIPITATION DETECTED (${weather.rainfallMm}mm). HIGH FLOOD RISK ACROSS ALL CORRIDORS.`,
        severity: "CRITICAL",
      });
    }

    // 2. Route Blockage Alerts
    if (activeRoute) {
      activeRoute.segments.forEach((seg) => {
        if (seg.landslideRisk > 0.8 || seg.floodRisk > 0.8) {
          alerts.push({
            type: "BLOCKAGE",
            message: `CRITICAL RISK DETECTED ON ${seg.from.toUpperCase()} - ${seg.to.toUpperCase()} SEGMENT. POTENTIAL BLOCKAGE IMMINENT.`,
            severity: "CRITICAL",
          });
        }
      });
    }

    // 3. Mission SOS Alerts
    if (startEmergency) {
      alerts.push({
        type: "MISSION",
        message: `MISSION START HUB (${start.toUpperCase()}) DECLARED EMERGENCY SOS STATUS.`,
        severity: "WARNING",
      });
    }
    if (endEmergency) {
      alerts.push({
        type: "MISSION",
        message: `MISSION TARGET HUB (${end.toUpperCase()}) DECLARED EMERGENCY SOS STATUS.`,
        severity: "WARNING",
      });
    }

    return alerts;
  }, [weather, activeRoute, startEmergency, endEmergency, start, end]);

  const riskInsights = useMemo(() => {
    if (!activeRoute || !activeRoute.segments.length) return [];
    const segments = [...activeRoute.segments];
    const landslide = [...segments].sort(
      (a, b) => b.landslideRisk - a.landslideRisk,
    )[0];
    const flood = [...segments].sort((a, b) => b.floodRisk - a.floodRisk)[0];

    const insights = [];
    if (landslide.landslideRisk > 0.3) {
      insights.push({
        label: "Landslide Risk",
        location: `${landslide.from} - ${landslide.to}`,
        value: `${(landslide.landslideRisk * 100).toFixed(0)}%`,
        icon: "fa-mountain-sun",
        color: "text-amber-600",
      });
    }
    if (flood.floodRisk > 0.3) {
      insights.push({
        label: "Flood Potential",
        location: `${flood.from} - ${flood.to}`,
        value: `${(flood.floodRisk * 100).toFixed(0)}%`,
        icon: "fa-house-flood-water",
        color: "text-blue-600",
      });
    }
    return insights;
  }, [activeRoute]);

  const handleCalculate = useCallback(
    async (overrideStart?: string, overrideEnd?: string) => {
      setIsCalculating(true);
      const s = overrideStart || start;
      const e = overrideEnd || end;

      const calculated = calculateSafestRoute(s, e, weather, isEmergencyActive);
      setRoutes(calculated);

      const primary = calculated[focusedRouteId] || calculated.safest;
      if (primary) {
        const xai = await getRouteExplanation(
          primary,
          calculated[focusedRouteId === "safest" ? "shortcut" : "safest"],
          weather,
          isEmergencyActive,
        );
        setExplanation(xai);
      }
      setIsCalculating(false);
    },
    [start, end, weather, isEmergencyActive, focusedRouteId],
  );

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-sans bg-slate-900">
      <Sidebar
        role={role}
        setRole={setRole}
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
        startEmergency={startEmergency}
        setStartEmergency={setStartEmergency}
        endEmergency={endEmergency}
        setEndEmergency={setEndEmergency}
        weather={weather}
        setWeather={setWeather}
        onCalculate={handleCalculate}
        isCalculating={isCalculating}
        routes={routes}
        focusedRouteId={focusedRouteId}
        setFocusedRouteId={setFocusedRouteId}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        {/* Real-time Emergency Alert Banner */}
        {activeAlerts.length > 0 && (
          <div className="bg-red-600 text-white px-6 py-2 flex items-center justify-between z-[2000] shadow-lg animate-pulse">
            <div className="flex items-center gap-3 overflow-hidden">
              <i className="fa-solid fa-circle-exclamation text-xl shrink-0"></i>
              <div className="flex gap-4 animate-marquee whitespace-nowrap">
                {activeAlerts.map((alert, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    {alert.type}: {alert.message}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-[9px] font-black border border-white/40 px-2 py-0.5 rounded whitespace-nowrap">
              MISSION CRITICAL
            </div>
          </div>
        )}

        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-500 ${isEmergencyActive ? "bg-red-600 animate-pulse ring-4 ring-red-100" : "bg-blue-600"}`}
            >
              <i
                className={`fa-solid ${isEmergencyActive ? "fa-truck-fast" : "fa-route"} text-xl`}
              ></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                RouteAI-NE
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase font-black tracking-widest">
                  v2.3
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                {isEmergencyActive
                  ? "ACTIVE DISTRESS PROTOCOL"
                  : "Tactical Terrain Analytics"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black transition-all ${
                weather.alertLevel === "RED"
                  ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                  : weather.alertLevel === "YELLOW"
                    ? "bg-amber-50 border-amber-200 text-amber-600"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600"
              }`}
            >
              <i className="fa-solid fa-triangle-exclamation"></i>
              IMD: {weather.alertLevel}
            </div>
            <button
              onClick={() =>
                setRole(
                  role === UserRole.PUBLIC
                    ? UserRole.GOVERNMENT
                    : UserRole.PUBLIC,
                )
              }
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md"
            >
              <i
                className={`fa-solid ${role === UserRole.PUBLIC ? "fa-user-shield" : "fa-users"}`}
              ></i>
              {role === UserRole.PUBLIC ? "Auth View" : "Public View"}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {role === UserRole.PUBLIC ? (
            <>
              <MapContainer
                activeRoute={activeRoute}
                altRoute={altRoute}
                isCalculating={isCalculating}
                startSOS={startEmergency}
                endSOS={endEmergency}
              />

              {activeRoute && !isCalculating && (
                <div className="absolute top-6 right-6 z-[1001] flex flex-col items-end gap-3 pointer-events-none">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 pointer-events-auto ${
                      showExplanation
                        ? "bg-slate-900 border-slate-700 text-white rotate-90"
                        : "bg-white border-blue-500 text-blue-600"
                    }`}
                  >
                    <i
                      className={`fa-solid ${showExplanation ? "fa-xmark" : "fa-brain-circuit"} text-2xl`}
                    ></i>
                  </button>

                  <div
                    className={`w-80 md:w-[400px] bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 rounded-[32px] overflow-hidden transition-all duration-500 origin-top-right pointer-events-auto ${
                      showExplanation
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-75 opacity-0 -translate-y-10 pointer-events-none"
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${activeRoute.id === "safest" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                          >
                            <i
                              className={`fa-solid ${activeRoute.id === "safest" ? "fa-shield-halved" : "fa-bolt-lightning"} text-lg`}
                            ></i>
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                              Tactical Analysis
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              Mode:{" "}
                              {activeRoute.id === "safest"
                                ? "High Resilience"
                                : "High Velocity"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[18px] font-black text-slate-900 leading-none">
                            {(activeRoute.avgSafetyScore * 100).toFixed(0)}%
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            Safety Index
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div
                          className={`p-4 rounded-2xl shadow-inner border relative overflow-hidden group transition-colors ${isEmergencyActive ? "bg-red-950 border-red-800 text-red-100" : "bg-slate-900 border-slate-800 text-slate-100"}`}
                        >
                          <p
                            className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isEmergencyActive ? "text-red-400" : "text-blue-400"}`}
                          >
                            <i
                              className={`fa-solid ${isEmergencyActive ? "fa-triangle-exclamation" : "fa-microchip"} animate-pulse`}
                            ></i>
                            {isEmergencyActive
                              ? "EMERGENCY PROTOCOL ACTIVE"
                              : "Gemini 2.5 Insights"}
                          </p>
                          <p className="text-sm leading-relaxed font-medium relative z-10">
                            "
                            {explanation ||
                              "Synthesizing terrain data and weather patterns..."}
                            "
                          </p>
                        </div>

                        {/* Tactical Place Hubs Directory */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Transit Hubs Connectivity
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {activeRoute.path.map((point, idx) => {
                              const isStart = idx === 0;
                              const isEnd = idx === activeRoute.path.length - 1;
                              const isSOS =
                                (isStart && startEmergency) ||
                                (isEnd && endEmergency);
                              return (
                                <div
                                  key={idx}
                                  className={`border px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-default ${isSOS ? "bg-red-50 border-red-200 ring-2 ring-red-100" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}
                                >
                                  <span
                                    className={`text-[9px] font-black ${isSOS ? "text-red-500" : "text-slate-400"}`}
                                  >
                                    {idx + 1}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold ${isSOS ? "text-red-700" : "text-slate-700"}`}
                                  >
                                    {point.name}
                                  </span>
                                  {isStart && (
                                    <i
                                      className={`fa-solid fa-house-chimney-user text-[8px] ${isSOS ? "text-red-500 animate-pulse" : "text-blue-500"}`}
                                      title="Start Hub"
                                    ></i>
                                  )}
                                  {isEnd && (
                                    <i
                                      className={`fa-solid fa-flag-checkered text-[8px] ${isSOS ? "text-red-500 animate-pulse" : "text-emerald-500"}`}
                                      title="Destination"
                                    ></i>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Dynamic Risk Factors */}
                        {riskInsights.length > 0 && (
                          <div className="grid grid-cols-1 gap-3">
                            {riskInsights.map((insight, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center ${insight.color}`}
                                  >
                                    <i
                                      className={`fa-solid ${insight.icon} text-xs`}
                                    ></i>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                                      {insight.label}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-bold truncate max-w-[150px]">
                                      {insight.location}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  className={`text-xs font-black ${insight.color}`}
                                >
                                  {insight.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-slate-400">
                            <i className="fa-solid fa-road text-[10px]"></i>
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                              {activeRoute.totalDistance} KM TOTAL
                            </span>
                          </div>
                          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">
                            Full Segment Log{" "}
                            <i className="fa-solid fa-chevron-right ml-1"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Dashboard weather={weather} />
          )}
        </div>

        <footer className="bg-slate-900 text-slate-400 text-[9px] px-6 py-2 flex justify-between items-center z-10 uppercase font-black tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-emerald-500"></i> ISRO
              Cartosat Verified
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-emerald-500"></i> BRO
              Strategic Clearance
            </span>
          </div>
          <span>Confidential • Government of India Mission</span>
        </footer>
      </main>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
