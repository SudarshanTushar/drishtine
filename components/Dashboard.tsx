
import React, { useMemo } from 'react';
import { WeatherData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie 
} from 'recharts';

const mockRiskTrend = [
  { day: '08:00', risk: 20 },
  { day: '10:00', risk: 25 },
  { day: '12:00', risk: 45 },
  { day: '14:00', risk: 80 },
  { day: '16:00', risk: 65 },
  { day: '18:00', risk: 40 },
  { day: '20:00', risk: 30 },
];

const mockResourceData = [
  { name: 'Medical', value: 45, color: '#3b82f6' },
  { name: 'Relief', value: 30, color: '#10b981' },
  { name: 'Rescue', value: 15, color: '#ef4444' },
  { name: 'Standby', value: 10, color: '#64748b' },
];

const mockIncidents = [
  { id: 1, type: 'Landslide', location: 'NH-10 near Gangtok', time: '12 mins ago', severity: 'CRITICAL' },
  { id: 2, type: 'Flash Flood', location: 'Teesta River Basin', time: '45 mins ago', severity: 'HIGH' },
  { id: 3, type: 'Blockage', location: 'Shillong Bypass', time: '1 hr ago', severity: 'MEDIUM' },
  { id: 4, type: 'Bridge Inspection', location: 'Itanagar Crossing', time: '2 hrs ago', severity: 'LOW' },
];

const Dashboard: React.FC<{ weather: WeatherData }> = ({ weather }) => {
  const currentTimestamp = useMemo(() => new Date().toLocaleTimeString(), []);

  return (
    <div className="h-full w-full bg-[#f8fafc] overflow-y-auto p-4 md:p-8 scrollbar-hide">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Top Navigation / Context */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Tactical Feed • {currentTimestamp}</p>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Authority Command Center</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
              <i className="fa-solid fa-download"></i> Export SitRep
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
              <i className="fa-solid fa-satellite-dish"></i> Sync Global DEM
            </button>
          </div>
        </div>

        {/* Tactical Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Alerts', value: '34', change: '+12%', icon: 'fa-radiation', color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Responders En Route', value: '08', change: '-2', icon: 'fa-truck-medical', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Connectivity Index', value: '68%', change: 'Stable', icon: 'fa-tower-broadcast', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Model Confidence', value: '94.2%', change: 'High', icon: 'fa-brain', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-200 transition-all group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                  <i className={`fa-solid ${stat.icon} text-xl`}></i>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.includes('+') ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Visual Intelligence */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Regional Saturation Forecast</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Landslide Probability Distribution (Today)</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span> ACTUAL</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-200"></span> PREDICTED</span>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRiskTrend}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} 
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px'}}
                      labelStyle={{fontWeight: 900, marginBottom: '8px', color: '#1e293b'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorRisk)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Deployment Efficiency */}
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Asset Distribution</h3>
                <div className="h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockResourceData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {mockResourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900">105</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Total Units</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {mockResourceData.map((res, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: res.color }}></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{res.name}: {res.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Correlation */}
              <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Terrain Saturation</h3>
                  <p className="text-xs text-slate-400 font-bold mb-6 italic">Current: {weather.rainfallMm}mm/hr intensity</p>
                  
                  <div className="flex-1 flex items-end gap-2 mb-6">
                    {[40, 70, 45, 90, 65, 85, 30].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg relative group/bar transition-all hover:bg-blue-500/40" style={{ height: `${h}%` }}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">{h}%</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-slate-300 font-bold leading-relaxed">
                      <i className="fa-solid fa-circle-info mr-2 text-blue-400"></i>
                      Automatic emergency corridor lock enabled for precipitation &gt; 150mm.
                    </p>
                  </div>
                </div>
                <i className="fa-solid fa-cloud-showers-heavy absolute -right-4 -top-4 text-9xl text-white/5 rotate-12 group-hover:scale-110 transition-transform"></i>
              </div>
            </div>
          </div>

          {/* Real-time Logistics Stream */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Active Incidents</h3>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-lg animate-pulse">LIVE</span>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                {mockIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                        incident.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                        incident.severity === 'HIGH' ? 'bg-amber-100 text-amber-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {incident.severity}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">{incident.time}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{incident.type}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1 flex items-center gap-1">
                      <i className="fa-solid fa-location-dot"></i> {incident.location}
                    </p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Acknowledge All Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Briefing / Explainable AI */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[32px] flex items-center justify-center shadow-2xl border border-white/20 mb-4 animate-bounce-slow">
                <i className="fa-solid fa-microchip text-5xl"></i>
              </div>
              <div className="px-3 py-1 bg-emerald-400 text-emerald-900 text-[9px] font-black rounded-full uppercase tracking-widest">Model Online</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-2xl font-black tracking-tight">AI Tactical Briefing <span className="text-blue-300 font-medium">#NE-4492</span></h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-blue-100 leading-relaxed font-medium bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm italic">
                    "Predictive models indicate a 78% probability of route degradation along the NH-10 corridor in the next 4 hours. Automated prioritization is currently shifting logistics flow to the Gangtok-Shillong secondary bypass to ensure continuous medical supply chains."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Latency', value: '14ms', icon: 'fa-bolt' },
                    { label: 'Uptime', value: '99.99%', icon: 'fa-circle-up' },
                    { label: 'Audit Trail', value: 'Active', icon: 'fa-fingerprint' },
                    { label: 'Privacy', value: 'DPDP+', icon: 'fa-user-shield' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                      <i className={`fa-solid ${item.icon} text-blue-300`}></i>
                      <div>
                        <p className="text-[8px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                        <p className="text-xs font-black">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="bg-white text-blue-800 font-black px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all text-[10px] uppercase tracking-widest shadow-xl">
                Inspect Decision Tree
              </button>
              <button className="bg-transparent border border-white/30 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest">
                Manual Override
              </button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-[120px]"></div>
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <i className="fa-solid fa-shield-halved text-[200px]"></i>
          </div>
        </div>

      </div>
      
      {/* Footer Branding for Dashboard */}
      <div className="max-w-[1600px] mx-auto mt-12 mb-8 flex justify-between items-center px-4">
        <div className="flex items-center gap-6">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Secure Enclave Access Only
          </p>
          <div className="h-4 w-px bg-slate-200"></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Node: DISASTER-MGNT-NE-01</p>
        </div>
        <div className="flex items-center gap-2 opacity-30">
          <div className="w-8 h-8 rounded bg-slate-200"></div>
          <div className="w-8 h-8 rounded bg-slate-200"></div>
          <div className="w-8 h-8 rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
