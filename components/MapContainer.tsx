import React, { useEffect } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import { Route } from "../types";

interface Props {
  activeRoute: Route | null;
  altRoute: Route | null;
  isCalculating: boolean;
  startSOS?: boolean;
  endSOS?: boolean;
}

// Custom icons for SOS and Standard markers
const createMarkerIcon = (color: string, pulse: boolean) => {
  const colorClass = color === "red" ? "bg-red-500" : "bg-blue-600";
  const pingClass = pulse ? "bg-red-500" : "";
  return L.divIcon({
    html: `<div class="relative flex items-center justify-center">
             ${pulse ? `<div class="absolute w-10 h-10 rounded-full ${pingClass} animate-ping opacity-30"></div>` : ""}
             <div class="w-6 h-6 rounded-full bg-white border-4 ${color === "red" ? "border-red-600" : "border-blue-600"} shadow-xl flex items-center justify-center">
               <div class="w-2 h-2 rounded-full ${colorClass}"></div>
             </div>
           </div>`,
    className: "custom-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const StandardIcon = createMarkerIcon("blue", false);
const SOSIcon = createMarkerIcon("red", true);

const RouteBounds: React.FC<{ routes: (Route | null)[] }> = ({ routes }) => {
  const map = useMap();
  useEffect(() => {
    const allPoints = routes
      .flatMap((r) => r?.path || [])
      .map((p) => [p.lat, p.lng] as [number, number]);
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [100, 100], animate: true });
    }
  }, [routes, map]);
  return null;
};

const MapContainer: React.FC<Props> = ({
  activeRoute,
  altRoute,
  isCalculating,
  startSOS,
  endSOS,
}) => {
  const defaultPos: [number, number] = [26.1445, 91.7362];

  return (
    <div className="h-full w-full relative">
      <LeafletMap
        center={defaultPos}
        zoom={7}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <RouteBounds routes={[activeRoute, altRoute]} />

        {/* Render Alternative Route (Ghost Layer) */}
        {altRoute && (
          <Polyline
            positions={altRoute.path.map((p) => [p.lat, p.lng])}
            color="#cbd5e1"
            weight={3}
            opacity={0.4}
            dashArray="10, 15"
          />
        )}

        {/* Render Active Route */}
        {activeRoute && (
          <>
            {activeRoute.segments.map((seg, idx) => {
              const fromNode = activeRoute.path[idx];
              const toNode = activeRoute.path[idx + 1];
              if (!fromNode || !toNode) return null;

              const isEmergencySeg = seg.isEmergencyShortcut;

              return (
                <Polyline
                  key={seg.id}
                  positions={[
                    [fromNode.lat, fromNode.lng],
                    [toNode.lat, toNode.lng],
                  ]}
                  color={
                    isEmergencySeg
                      ? "#ef4444"
                      : activeRoute.id === "safest"
                        ? "#10b981"
                        : "#f59e0b"
                  }
                  weight={isEmergencySeg ? 10 : 7}
                  opacity={1}
                  dashArray={isEmergencySeg ? "5, 5" : undefined}
                >
                  <Popup>
                    <div className="text-xs font-black">
                      {isEmergencySeg
                        ? "RESTRICTED BRO CORRIDOR"
                        : "Regional Highway"}
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                        Landslide Risk: {(seg.landslideRisk * 100).toFixed(0)}%
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">
                        Distance: {seg.distanceKm} KM
                      </p>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

            {activeRoute.path.map((point, i) => {
              const isStart = i === 0;
              const isEnd = i === activeRoute.path.length - 1;
              const isSOS = (isStart && startSOS) || (isEnd && endSOS);

              return (
                <React.Fragment key={i}>
                  <Marker
                    position={[point.lat, point.lng]}
                    icon={isSOS ? SOSIcon : StandardIcon}
                  >
                    <Popup>
                      <div
                        className={`p-2 font-black text-xs uppercase tracking-widest ${isSOS ? "text-red-600" : "text-blue-600"}`}
                      >
                        {isSOS ? "🚨 Hub in SOS Mode" : "Strategic Hub"}
                        <p className="text-slate-900 mt-1">{point.name}</p>
                      </div>
                    </Popup>
                  </Marker>
                  {isSOS && (
                    <Circle
                      center={[point.lat, point.lng]}
                      radius={15000}
                      pathOptions={{
                        fillColor: "red",
                        color: "red",
                        weight: 1,
                        opacity: 0.1,
                        fillOpacity: 0.05,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </LeafletMap>

      {isCalculating && (
        <div className="absolute inset-0 z-[2000] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <i className="fa-solid fa-satellite fa-spin text-5xl text-blue-600"></i>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">
              Calculating Mission Path
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
