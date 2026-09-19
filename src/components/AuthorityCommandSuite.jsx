import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap 
} from 'react-leaflet';
import { 
  Truck, 
  Filter, 
  Send, 
  X, 
  CheckCircle2, 
  Layers, 
  Info
} from 'lucide-react';
import { dispatchTruck } from '../services/api';
import { createPinpointMarker } from '../utils/leafletIcons';

// Strict Greater Chennai Corporation center and boundary
const CHENNAI_CENTER = [13.0827, 80.2707];
const CHENNAI_BOUNDS = [
  [12.8500, 80.1200],
  [13.2500, 80.3500]
];

function MapController({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function AuthorityCommandSuite({ 
  tickets = [], 
  onTicketUpdated, 
  easyRead 
}) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignedTruck, setAssignedTruck] = useState('GCC Truck #CH-04-A (T. Nagar Zonal)');
  const [dispatching, setDispatching] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [tileTheme, setTileTheme] = useState('voyager'); // 'voyager' (streets) | 'positron' (clean light)

  // Crisp, accurate light map tiles matching the Silky White / Floral Blue palette
  const tileUrl = tileTheme === 'voyager' 
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const filteredTickets = tickets.filter(t => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'HIGH_PRIORITY') return t.priorityScore >= 0.8;
    if (filterCategory === 'WATERWAY') return t.lulcCategory === 'Waterbody_Buffer' || t.binType === 'Waterway Bank';
    if (filterCategory === 'COMMERCIAL') return t.lulcCategory === 'Commercial' || t.binType === 'Commercial';
    if (filterCategory === 'PENDING') return t.status !== 'Resolved';
    return true;
  });

  const handleDispatch = async () => {
    if (!selectedTicket) return;
    setDispatching(true);
    try {
      const res = await dispatchTruck(selectedTicket._id || selectedTicket.id, assignedTruck);
      setDispatching(false);
      if (res && res.success) {
        onTicketUpdated(res.data);
        setSelectedTicket(res.data);
      }
    } catch (err) {
      setDispatching(false);
      console.warn("Dispatch error:", err);
    }
  };

  return (
    <div className={`space-y-4 max-w-7xl mx-auto text-[#17243F] ${easyRead ? 'easy-read' : ''}`}>
      
      {/* Top Header & Map Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#92BAD5]/30">
        <div>
          <h1 className="font-modular-display text-2xl sm:text-3xl text-[#17243F] uppercase tracking-wide">
            Greater Chennai GIS Waste Monitor
          </h1>
          <p className="text-xs text-[#3B4B6E] mt-0.5">
            High-precision spatial monitoring bounded to Greater Chennai Corporation jurisdiction.
          </p>
        </div>

        {/* Filter Pills & Map Tile Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'HIGH_PRIORITY', 'WATERWAY', 'COMMERCIAL', 'PENDING'].map(filter => (
            <button
              key={filter}
              onClick={() => setFilterCategory(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                filterCategory === filter 
                  ? 'bg-[#17243F] text-[#DFF478]' 
                  : 'bg-white hover:bg-[#F7F3E6] text-[#17243F] border border-[#92BAD5]/40'
              }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}

          <div className="h-4 w-px bg-[#92BAD5]/40 mx-1 hidden sm:block" />

          <button
            onClick={() => setTileTheme(tileTheme === 'voyager' ? 'positron' : 'voyager')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F7F3E6] text-[#17243F] text-xs font-bold flex items-center gap-1.5 border border-[#92BAD5]/40 transition shadow-sm"
          >
            <Layers size={13} className="text-[#788CE3]" />
            {tileTheme === 'voyager' ? 'Street View' : 'Positron'}
          </button>
        </div>
      </div>

      {/* Main Map & Triage Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
        
        {/* Leaflet GIS Map Canvas */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden glass-panel border border-[#92BAD5]/40 relative h-[500px] lg:h-[620px] shadow-sm">
          <MapContainer
            center={CHENNAI_CENTER}
            zoom={12}
            maxBounds={CHENNAI_BOUNDS}
            minZoom={11}
            maxZoom={18}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> OpenStreetMap contributors'
              url={tileUrl}
            />

            <MapController 
              center={selectedTicket ? [selectedTicket.location?.coordinates?.[1] || 13.0827, selectedTicket.location?.coordinates?.[0] || 80.2707] : null} 
              zoom={selectedTicket ? 15 : 12}
            />

            {filteredTickets.map(ticket => {
              const lng = ticket.location?.coordinates?.[0];
              const lat = ticket.location?.coordinates?.[1];
              if (!lng || !lat) return null;

              const isCritical = ticket.priorityScore >= 0.85;

              return (
                <Marker
                  key={ticket._id || ticket.id}
                  position={[lat, lng]}
                  icon={createPinpointMarker(ticket.priorityScore, isCritical)}
                  eventHandlers={{
                    click: () => setSelectedTicket(ticket)
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2.5 text-xs text-[#17243F] bg-white rounded-xl shadow-md border border-[#92BAD5]/30">
                      <div className="font-bold text-sm text-[#17243F]">{ticket.title}</div>
                      <div className="text-[11px] text-[#3B4B6E] mt-0.5">{ticket.ward}</div>
                      <div className="mt-1 flex items-center justify-between font-mono">
                        <span className="font-bold text-[#788CE3]">P: {ticket.priorityScore}</span>
                        <span className="text-[#17243F] font-bold px-1.5 py-0.5 rounded bg-[#DFF478]">{ticket.status}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#92BAD5]/40 text-xs flex items-center gap-3 shadow-md">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#17243F]" />
              <span className="text-[11px] text-[#17243F] font-bold">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#788CE3]" />
              <span className="text-[11px] text-[#17243F] font-bold">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#92BAD5]" />
              <span className="text-[11px] text-[#17243F] font-bold">Standard</span>
            </div>
          </div>
        </div>

        {/* Right Side: Incident Triage & Inspection Drawer */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {selectedTicket ? (
            <div className="glass-panel p-5 rounded-3xl space-y-4 flex-grow flex flex-col justify-between animate-fadeIn shadow-sm border border-[#788CE3]/40">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    selectedTicket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#DFF478] text-[#17243F]'
                  }`}>
                    {selectedTicket.status}
                  </span>
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="p-1 rounded-lg hover:bg-white text-[#3B4B6E]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Evidence Image */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-[#17243F] border border-[#92BAD5]/40 shadow-inner">
                  <img 
                    src={selectedTicket.imageUrl || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"} 
                    alt={selectedTicket.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#17243F]">
                    {selectedTicket.title}
                  </h3>
                  <p className="text-xs text-[#3B4B6E] mt-0.5">
                    {selectedTicket.ward} • {selectedTicket.landmark}
                  </p>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#92BAD5]/30 space-y-0.5 shadow-sm">
                    <span className="text-[10px] text-[#6B7C9E] uppercase font-bold">Composite Priority</span>
                    <p className="font-mono text-base font-extrabold text-[#17243F]">
                      {selectedTicket.priorityScore}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#92BAD5]/30 space-y-0.5 shadow-sm">
                    <span className="text-[10px] text-[#6B7C9E] uppercase font-bold">LULC Zone</span>
                    <p className="text-xs font-bold text-[#17243F] truncate">
                      {selectedTicket.lulcCategory || 'General Ward'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#92BAD5]/30 space-y-0.5 shadow-sm">
                    <span className="text-[10px] text-[#6B7C9E] uppercase font-bold">YOLO Confidence</span>
                    <p className="font-mono text-xs font-bold text-[#788CE3]">
                      {selectedTicket.cvConfidence ? `${(selectedTicket.cvConfidence * 100).toFixed(0)}%` : 'Validated'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#92BAD5]/30 space-y-0.5 shadow-sm">
                    <span className="text-[10px] text-[#6B7C9E] uppercase font-bold">Perceptual Hash</span>
                    <p className="font-mono text-[10px] text-[#3B4B6E] truncate">
                      {selectedTicket.phash || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Truck Dispatch Panel */}
              <div className="space-y-3 pt-3 border-t border-[#92BAD5]/30">
                <label className="text-xs font-bold uppercase tracking-wider text-[#17243F] flex items-center gap-1.5">
                  <Truck size={14} className="text-[#788CE3]" />
                  Dispatch Municipal Truck
                </label>
                <select
                  value={assignedTruck}
                  onChange={(e) => setAssignedTruck(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#92BAD5]/50 text-xs text-[#17243F] focus:outline-none focus:border-[#788CE3] shadow-sm font-medium"
                >
                  <option value="GCC Truck #CH-04-A (T. Nagar Zonal)">GCC Truck #CH-04-A (T. Nagar Zonal)</option>
                  <option value="GCC Truck #CH-12-C (Koyambedu Compactor)">GCC Truck #CH-12-C (Koyambedu Compactor)</option>
                  <option value="GCC Truck #CH-08-F (Adyar Waterway Unit)">GCC Truck #CH-08-F (Adyar Waterway Unit)</option>
                  <option value="GCC Truck #CH-19-E (Marina Beach Roamer)">GCC Truck #CH-19-E (Marina Beach Roamer)</option>
                </select>

                <button
                  onClick={handleDispatch}
                  disabled={dispatching || selectedTicket.status === 'Resolved'}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition ${
                    selectedTicket.status === 'Resolved'
                      ? 'bg-[#EBE6D8] text-[#6B7C9E] cursor-not-allowed'
                      : 'bg-[#DFF478] hover:bg-[#D4EA66] text-[#17243F] shadow-[0_4px_15px_rgba(223,244,120,0.5)]'
                  }`}
                >
                  <Send size={14} />
                  {dispatching ? 'Dispatching...' : selectedTicket.status === 'Assigned' ? 'Re-Dispatch Collection Unit' : 'Assign & Dispatch Truck'}
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between flex-grow shadow-sm">
              <div className="space-y-3">
                <h3 className="font-modular-display text-xl text-[#17243F] uppercase tracking-wide">
                  Incident Triage Queue
                </h3>
                <p className="text-xs text-[#3B4B6E]">
                  Click any pin on the Chennai map or select from the live list below to inspect telemetry and dispatch collection units.
                </p>
              </div>

              {/* Queue List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 my-3">
                {filteredTickets.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#6B7C9E]">
                    No active incidents in this filter category.
                  </div>
                ) : (
                  filteredTickets.map(t => (
                    <button
                      key={t._id || t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="w-full p-3 rounded-xl bg-white hover:bg-[#F7F3E6] border border-[#92BAD5]/30 transition flex items-center justify-between text-left group shadow-sm"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-xs text-[#17243F] truncate">
                          {t.title}
                        </div>
                        <div className="text-[10px] text-[#6B7C9E] truncate mt-0.5">
                          {t.ward}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#DFF478] text-[#17243F] shrink-0">
                        P: {t.priorityScore}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#92BAD5]/30 text-[11px] text-[#3B4B6E] flex items-center gap-2 shadow-sm">
                <Info size={14} className="text-[#788CE3] shrink-0" />
                <span>Bounded to Greater Chennai Corporation.</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
