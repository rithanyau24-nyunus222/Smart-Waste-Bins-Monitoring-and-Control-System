import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle2, 
  Code, 
  ExternalLink, 
  ShieldCheck, 
  Database,
  BarChart3,
  Globe2
} from 'lucide-react';
import { fetchOgdGeoJSON } from '../services/api';

export default function OgdTransparencyPortal({ tickets, easyRead }) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchOgdGeoJSON();
      if (data) {
        setGeoJsonData(data);
      } else {
        // Build live client RFC 7946 GeoJSON
        const features = tickets.map(t => {
          const coords = t.location?.coordinates || t.coordinates || [80.23, 13.04];
          return {
            type: "Feature",
            id: t._id || t.id,
            geometry: {
              type: "Point",
              coordinates: [coords[0], coords[1]]
            },
            properties: {
              title: t.title,
              ward: t.ward,
              binType: t.binType,
              landmark: t.landmark,
              lulcCategory: t.lulcCategory,
              priorityScore: t.priorityScore,
              status: t.status,
              reportedAt: t.createdAt
            }
          };
        });

        setGeoJsonData({
          type: "FeatureCollection",
          name: "Greater_Chennai_Corporation_Open_Waste_Data",
          crs: {
            type: "name",
            properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
          },
          metadata: {
            publisher: "Greater Chennai Corporation (GCC) Solid Waste Management Dept",
            standard: "RFC 7946 GeoJSON",
            generatedAt: new Date().toISOString(),
            totalIncidents: features.length,
            boundingBox: [80.1200, 12.8500, 80.3500, 13.2500]
          },
          features: features
        });
      }
      setLoading(false);
    }
    loadData();
  }, [tickets]);

  const handleCopy = () => {
    if (!geoJsonData) return;
    navigator.clipboard.writeText(JSON.stringify(geoJsonData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    if (!geoJsonData) return;
    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chennai-waste-${new Date().toISOString().substring(0, 10)}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Metric stats
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const clearanceRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const waterbodyIncidents = tickets.filter(t => t.lulcCategory === 'Waterbody_Buffer').length;

  return (
    <div className={`space-y-6 max-w-5xl mx-auto ${easyRead ? 'easy-read' : ''}`}>
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59789F] text-white text-xs font-bold uppercase tracking-wider mb-2">
            <Globe2 size={12} />
            Open Government Data (OGD) Pipeline
          </div>
          <h1 className="font-retro-title text-2xl sm:text-3xl text-[#243C2C]">
            Chennai Municipal Waste Transparency Feed
          </h1>
          <p className="text-xs sm:text-sm text-[#243C2C]/80 mt-0.5">
            Public, audited RFC 7946 GeoJSON telemetry providing open access for environmental planners and researchers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-2xl bg-[#F7F3E6] hover:bg-white text-[#243C2C] border border-[#ECE69D] text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            {copied ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} className="text-[#59789F]" />}
            <span>{copied ? 'Copied JSON!' : 'Copy GeoJSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-2xl bg-[#243C2C] hover:bg-[#17243F] text-[#DFF478] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download size={14} />
            <span>Download .geojson</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel rounded-3xl p-4 sm:p-5 text-center">
          <span className="text-[11px] font-bold text-[#59789F] uppercase tracking-wider block">Total Incidents</span>
          <span className="font-modular-display text-4xl sm:text-5xl text-[#243C2C] block mt-1">
            {total}
          </span>
          <span className="text-[10px] text-[#A9B6C4] mt-0.5 block">Audited Reports</span>
        </div>

        <div className="glass-panel rounded-3xl p-4 sm:p-5 text-center">
          <span className="text-[11px] font-bold text-[#59789F] uppercase tracking-wider block">Resolution Rate</span>
          <span className="font-modular-display text-4xl sm:text-5xl text-[#7A9445] block mt-1">
            {clearanceRate}%
          </span>
          <span className="text-[10px] text-[#7A9445] mt-0.5 block">{resolved} of {total} Cleared</span>
        </div>

        <div className="glass-panel rounded-3xl p-4 sm:p-5 text-center">
          <span className="text-[11px] font-bold text-[#59789F] uppercase tracking-wider block">Waterbody Chokes</span>
          <span className="font-modular-display text-4xl sm:text-5xl text-[#E54B4B] block mt-1">
            {waterbodyIncidents}
          </span>
          <span className="text-[10px] text-[#E54B4B] mt-0.5 block">Ecological Priority</span>
        </div>

        <div className="glass-panel rounded-3xl p-4 sm:p-5 text-center">
          <span className="text-[11px] font-bold text-[#59789F] uppercase tracking-wider block">Standard Format</span>
          <span className="font-modular-display text-2xl sm:text-3xl text-[#243C2C] block mt-2">
            RFC 7946
          </span>
          <span className="text-[10px] text-[#59789F] mt-1 block">OGD GeoJSON</span>
        </div>
      </div>

      {/* GeoJSON Live Inspector */}
      <div className="glass-panel rounded-3xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={16} className="text-[#7A9445]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#243C2C]">
              Live RFC 7946 GeoJSON FeatureCollection Inspector
            </span>
          </div>
          <span className="text-xs font-mono text-[#59789F]">GET /api/v1/ogd/chennai-waste.geojson</span>
        </div>

        <div className="relative rounded-2xl bg-[#17243F] p-4 text-[#DFF478] font-mono text-xs overflow-x-auto max-h-96 border border-black/20 shadow-inner">
          <pre>{JSON.stringify(geoJsonData, null, 2)}</pre>
        </div>
      </div>

    </div>
  );
}
