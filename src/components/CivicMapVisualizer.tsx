import React, { useState } from 'react';
import { Complaint, SeverityLevel } from '../types';
import { getSeverityStyle } from '../utils/theme';
import { MapPin, Navigation, Info, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';

interface CivicMapVisualizerProps {
  complaints: Complaint[];
  selectedWard: string;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const CivicMapVisualizer: React.FC<CivicMapVisualizerProps> = ({
  complaints,
  selectedWard,
  onSelectComplaint,
}) => {
  const [hoveredComplaint, setHoveredComplaint] = useState<Complaint | null>(null);

  // Filter complaints if a specific ward is selected
  const filtered = selectedWard === 'all' 
    ? complaints 
    : complaints.filter(c => c.location.ward === selectedWard);

  // Map geographic bounding box approx for municipal area
  const minLat = 28.57;
  const maxLat = 28.69;
  const minLng = 77.15;
  const maxLng = 77.26;

  const getCoordinatesPct = (lat?: number, lng?: number, index?: number) => {
    if (!lat || !lng) {
      // Deterministic spread fallback
      const hash = (index || 1) * 37;
      return {
        x: 20 + (hash % 60),
        y: 20 + ((hash * 7) % 60),
      };
    }
    const x = Math.max(8, Math.min(92, ((lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.max(8, Math.min(92, 100 - ((lat - minLat) / (maxLat - minLat)) * 100));
    return { x, y };
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-sky-400" />
            <span>Municipal Incident Density & Ward Scatter Map</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time geospatial clustering across municipal wards
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center gap-1 text-red-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block mr-0.5" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block -ml-3.5" />
            Critical
          </span>
          <span className="flex items-center gap-1 text-orange-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
            High
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Medium
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Low/Resolved
          </span>
        </div>
      </div>

      {/* Map Canvas Visualizer */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden select-none">
        
        {/* Subtle Map Grid Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#city-grid)" />
          {/* Simulated arterial rivers & ring roads */}
          <path d="M0,180 Q300,240 600,160 Q900,120 1200,200" fill="none" stroke="#0284c7" strokeWidth="4" strokeDasharray="6,6" opacity="0.4" />
          <path d="M200,0 Q400,300 800,600" fill="none" stroke="#475569" strokeWidth="6" opacity="0.5" />
          <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="12,8" opacity="0.3" />
        </svg>

        {/* Zone Labels on Map */}
        <div className="absolute top-3 left-4 text-[10px] uppercase font-bold tracking-wider text-slate-500">North Zone (Sector 11-19)</div>
        <div className="absolute bottom-3 left-4 text-[10px] uppercase font-bold tracking-wider text-slate-500">West Zone (Sector 05-10)</div>
        <div className="absolute top-3 right-4 text-[10px] uppercase font-bold tracking-wider text-slate-500">East Zone (Sector 01-08)</div>
        <div className="absolute bottom-3 right-4 text-[10px] uppercase font-bold tracking-wider text-slate-500">South Zone (Sector 20-28)</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-600 border border-slate-800/80 px-2 py-0.5 rounded bg-slate-900/40">
          Central Administrative Zone
        </div>

        {/* Render Complaint Geo Pins */}
        {filtered.map((item, idx) => {
          const { x, y } = getCoordinatesPct(item.location.latitude, item.location.longitude, idx + 1);
          const isCritical = item.aiAnalysis.severity === 'Critical';
          const isHigh = item.aiAnalysis.severity === 'High';
          const isResolved = item.status === 'Resolved' || item.status === 'Verified';

          const pinColor = isResolved 
            ? 'bg-emerald-500 text-white' 
            : isCritical 
            ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30' 
            : isHigh 
            ? 'bg-orange-500 text-white ring-2 ring-orange-500/30' 
            : 'bg-amber-500 text-slate-950';

          return (
            <div
              key={item.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              onClick={() => onSelectComplaint(item)}
              onMouseEnter={() => setHoveredComplaint(item)}
              onMouseLeave={() => setHoveredComplaint(null)}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg transition-transform group-hover:scale-125 ${pinColor}`}>
                {item.aiAnalysis.severity[0]}
              </div>

              {/* Pin Hover Quick Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-52 p-2.5 rounded-xl bg-slate-900/95 border border-slate-700 text-white shadow-2xl text-left pointer-events-none">
                <div className="flex items-center justify-between text-[10px] font-bold pb-1 border-b border-slate-800">
                  <span className="font-mono text-teal-400">{item.id}</span>
                  <span className="text-amber-400">Score: {item.aiAnalysis.priority_score}</span>
                </div>
                <div className="text-xs font-semibold mt-1 text-slate-100 line-clamp-1">{item.aiAnalysis.issue_type}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1">{item.location.ward}</div>
                <div className="text-[10px] text-teal-300 font-semibold mt-1">Status: {item.status}</div>
              </div>
            </div>
          );
        })}

        {/* Interactive Stats Overlay inside map */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 backdrop-blur-xs flex items-center gap-3">
          <span>Active Geo-Pins: <strong className="text-white font-mono">{filtered.length}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Click any pin to inspect & dispatch</span>
        </div>

      </div>
    </div>
  );
};
