import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Sparkles, 
  ThumbsUp, 
  Clock, 
  Compass,
  FileImage
} from 'lucide-react';
import { submitTicket, upvoteTicket } from '../services/api';

const CHENNAI_WARDS = [
  "Zone 5 - Koyambedu, Ward 65 (Commercial Market)",
  "Zone 8 - Chetpet / Cooum Corridor, Ward 104 (Waterway Buffer)",
  "Zone 9 - T. Nagar, Ward 114 (Commercial Hub)",
  "Zone 13 - Adyar Estuary, Ward 172 (Ecological Buffer)",
  "Zone 10 - Kodambakkam, Ward 130",
  "Zone 11 - Valasaravakkam, Ward 150",
  "Zone 9 - Mylapore, Ward 122 (Heritage Residential)",
  "Zone 4 - Tondiarpet, Ward 40 (North Chennai)",
  "Zone 15 - Sholinganallur, Ward 195 (IT Corridor)"
];

const BIN_TYPES = [
  { id: 'Commercial', label: 'Commercial Market Overflow' },
  { id: 'Waterway Bank', label: 'Waterbody / Canal Choking' },
  { id: 'Organic', label: 'Wet / Organic Waste Dump' },
  { id: 'Dry Plastic', label: 'Dry Plastic / Packaging Heap' }
];

export default function CitizenPortal({ 
  tickets = [], 
  onTicketAdded, 
  onTicketUpvoted, 
  currentGps, 
  setCurrentGps,
  easyRead,
  onTriggerAlert 
}) {
  const [title, setTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [binType, setBinType] = useState('Commercial');
  const [ward, setWard] = useState(CHENNAI_WARDS[0]);
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState(currentGps || [80.2308, 13.0395]);
  
  // Pipeline Analysis Stages
  const [submitting, setSubmitting] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [submitResult, setSubmitResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const STAGES = [
    "AI Vision: Inspecting waste features with YOLOv8...",
    "Hashing: Computing 64-bit DCT perceptual hash...",
    "Deduplication: Checking 20m spatial radius for duplicates...",
    "LULC GIS: Calculating Chennai environmental risk weight..."
  ];

  const handleAcquireGps = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          if (lng >= 80.12 && lng <= 80.35 && lat >= 12.85 && lat <= 13.25) {
            setCoords([lng, lat]);
            setCurrentGps([lng, lat]);
            setErrorMessage(null);
          } else {
            setErrorMessage(`Coordinates [${lng.toFixed(3)}, ${lat.toFixed(3)}] outside Chennai boundaries. Defaulting to Chennai.`);
            setCoords([80.2308, 13.0395]);
          }
        },
        (err) => {
          console.warn("GPS error:", err.message);
          setCoords([80.2308, 13.0395]);
        }
      );
    }
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadDemoImage = () => {
    const demoUrl = "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80";
    setImagePreview(demoUrl);
    setSelectedImage(demoUrl);
    setTitle("Market Waste Accumulation");
    setLandmark("Near Main Produce Entry");
    setDescription("Discarded vegetable cartons and plastic packaging obstructing transit lane.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setErrorMessage("Please capture or upload a waste incident photograph.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSubmitResult(null);

    setAnalysisStage(0);
    const interval = setInterval(() => {
      setAnalysisStage(prev => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const payload = {
        title: title || `${binType} at ${landmark || 'Chennai'}`,
        description: description || 'Waste overflow reported by citizen.',
        landmark: landmark || 'Chennai Corporation Ward Landmark',
        ward,
        binType,
        coordinates: coords,
        imageUrl: selectedImage
      };

      const res = await submitTicket(payload);
      clearInterval(interval);
      setSubmitting(false);

      if (res && res.success) {
        setSubmitResult(res);
        onTicketAdded(res.data);
        
        setTitle('');
        setImagePreview('');
        setSelectedImage(null);
        setLandmark('');
        setDescription('');

        if (res.data && res.data.priorityScore >= 0.85 && onTriggerAlert) {
          onTriggerAlert({
            id: `alert-${Date.now()}`,
            title: `High Priority Incident: ${res.data.ward}`,
            message: `Incident registered with composite risk score of ${res.data.priorityScore}. Fast-tracked for GCC dispatch.`,
            ward: res.data.ward,
            severity: "High",
            timestamp: "Just Now"
          });
        }
      } else {
        setErrorMessage(res.message || "Failed to register incident.");
      }
    } catch (err) {
      clearInterval(interval);
      setSubmitting(false);
      setErrorMessage(err.response?.data?.message || err.message || "Error communicating with server.");
    }
  };

  const handleUpvote = async (ticketId) => {
    try {
      const res = await upvoteTicket(ticketId);
      if (res && res.success) {
        onTicketUpvoted(ticketId);
      }
    } catch (err) {
      console.warn("Upvote error:", err);
    }
  };

  return (
    <div className={`space-y-8 max-w-6xl mx-auto text-[#17243F] ${easyRead ? 'easy-read' : ''}`}>
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#92BAD5]/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFF478] text-[#17243F] text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
            <Sparkles size={13} />
            AI Geo-Reporting & Detection
          </div>
          <h1 className="font-modular-display text-3xl sm:text-4xl text-[#17243F] tracking-wide uppercase">
            Waste Incident Reporting Console
          </h1>
          <p className="text-xs sm:text-sm text-[#3B4B6E] mt-1 max-w-2xl">
            Report uncollected waste, canal blockages, or market overflow. Real-time YOLOv8 AI verification with automated priority calculation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDemoImage}
          className="self-start md:self-center px-4 py-2 rounded-xl bg-white hover:bg-[#F7F3E6] border border-[#92BAD5]/50 text-xs font-bold text-[#17243F] shadow-sm transition flex items-center gap-2 shrink-0"
        >
          <FileImage size={14} className="text-[#788CE3]" />
          Load Demo Photo
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 flex items-start gap-3 shadow-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">Notice: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Success Notification */}
      {submitResult && (
        <div className="p-5 rounded-2xl bg-white border border-[#DFF478] text-[#17243F] flex items-start gap-3.5 shadow-md">
          <CheckCircle2 size={22} className="text-[#17243F] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <div className="font-bold text-[#17243F] text-sm sm:text-base">
              {submitResult.isDuplicate ? "Duplicate Report Consolidated" : "Incident Successfully Registered!"}
            </div>
            <p className="text-[#3B4B6E] leading-relaxed">
              {submitResult.message}
            </p>
            {submitResult.data && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-[#F7F3E6] text-[#17243F] text-xs font-mono border border-[#92BAD5]/30">
                  Zone: {submitResult.data.ward}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#DFF478] text-[#17243F] text-xs font-mono font-bold">
                  Priority Score: {submitResult.data.priorityScore}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#F7F3E6] text-[#3B4B6E] text-xs font-mono border border-[#92BAD5]/30">
                  Status: {submitResult.data.status}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2-Column Reporting Console */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Photo Upload */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17243F] flex items-center gap-2">
                <Camera size={14} className="text-[#788CE3]" />
                Waste Photo Evidence
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#DFF478] text-[#17243F] font-bold font-mono">Live Vision</span>
            </div>

            {/* Dropzone */}
            <div className="relative aspect-[4/3] rounded-2xl bg-white border-2 border-dashed border-[#92BAD5] hover:border-[#788CE3] transition-all flex flex-col items-center justify-center overflow-hidden group shadow-sm">
              {imagePreview ? (
                <>
                  <img 
                    src={imagePreview} 
                    alt="Waste Evidence" 
                    className="w-full h-full object-cover rounded-2xl" 
                  />
                  <div className="absolute inset-0 bg-[#17243F]/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-xs text-white font-semibold mb-2">Change Image</p>
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#DFF478] text-[#17243F] text-xs font-bold hover:brightness-105 transition">
                      Upload New
                      <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F3E6] flex items-center justify-center text-[#788CE3] mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <span className="text-sm font-bold text-[#17243F] mb-1">
                    Click to Upload Waste Photo
                  </span>
                  <span className="text-xs text-[#6B7C9E]">
                    Supports JPG, PNG • Max 10MB
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                </label>
              )}
            </div>

            {/* AI Staged Progress */}
            {submitting && (
              <div className="p-4 rounded-2xl bg-white border border-[#788CE3]/40 space-y-2.5 shadow-md animate-pulse">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#17243F] flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#788CE3]" />
                    AI Processing Pipeline
                  </span>
                  <span className="font-mono text-[10px] text-[#6B7C9E]">
                    Stage {analysisStage + 1} of 4
                  </span>
                </div>
                <p className="text-xs text-[#3B4B6E] font-medium">
                  {STAGES[analysisStage]}
                </p>
                <div className="w-full h-1.5 bg-[#EBE6D8] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#788CE3] to-[#DFF478] transition-all duration-300"
                    style={{ width: `${((analysisStage + 1) / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Metadata Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17243F]">
                Incident Title / Summary
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Discarded packaging pile on street corner"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#92BAD5]/50 text-[#17243F] placeholder:text-[#92BAD5] text-sm focus:outline-none focus:border-[#788CE3] transition shadow-sm"
              />
            </div>

            {/* Ward & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#17243F]">
                  Chennai Zone & Ward
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-white border border-[#92BAD5]/50 text-[#17243F] text-xs sm:text-sm focus:outline-none focus:border-[#788CE3] transition shadow-sm"
                >
                  {CHENNAI_WARDS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#17243F]">
                  Waste Classification
                </label>
                <select
                  value={binType}
                  onChange={(e) => setBinType(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-white border border-[#92BAD5]/50 text-[#17243F] text-xs sm:text-sm focus:outline-none focus:border-[#788CE3] transition shadow-sm"
                >
                  {BIN_TYPES.map(b => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Landmark & GPS */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#17243F] flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#788CE3]" />
                  Specific Landmark & Location
                </label>
                <button
                  type="button"
                  onClick={handleAcquireGps}
                  className="text-[11px] font-bold text-[#788CE3] hover:underline flex items-center gap-1"
                >
                  <Compass size={12} />
                  Lock My GPS
                </button>
              </div>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near T. Nagar Bus Stand or Gate 3 Entrance"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#92BAD5]/50 text-[#17243F] placeholder:text-[#92BAD5] text-sm focus:outline-none focus:border-[#788CE3] transition shadow-sm"
              />
              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#6B7C9E] font-mono">
                <span>GPS Bounded:</span>
                <span className="text-[#17243F] font-bold">{coords[0].toFixed(4)}° E, {coords[1].toFixed(4)}° N</span>
                <span className="px-1.5 py-0.2 rounded bg-[#DFF478] text-[#17243F] text-[10px] font-bold">Chennai Verified</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17243F]">
                Additional Details (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe estimated volume, odours, or hazards..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#92BAD5]/50 text-[#17243F] placeholder:text-[#92BAD5] text-sm focus:outline-none focus:border-[#788CE3] transition resize-none shadow-sm"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
                submitting
                  ? 'bg-[#EBE6D8] text-[#6B7C9E] cursor-not-allowed'
                  : 'bg-[#DFF478] hover:bg-[#D4EA66] text-[#17243F] shadow-[0_6px_25px_rgba(223,244,120,0.5)] active:scale-[0.99]'
              }`}
            >
              {submitting ? (
                <>
                  <Sparkles size={18} className="animate-spin text-[#17243F]" />
                  Running AI & Spatial GIS Pipeline...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Submit Incident for Real-Time Dispatch
                </>
              )}
            </button>

          </div>
        </div>

      </form>

      {/* Live Incident Stream */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#92BAD5]/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DFF478] border border-[#17243F]" />
            <h2 className="font-modular-display text-2xl text-[#17243F] tracking-wide uppercase">
              Live Incident Stream
            </h2>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#17243F] text-white">
              {tickets.length} Active
            </span>
          </div>
          <span className="text-xs text-[#6B7C9E]">Real-Time Database Feed</span>
        </div>

        {tickets.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#92BAD5]/40 mx-auto flex items-center justify-center text-[#788CE3] shadow-sm">
              <Clock size={24} />
            </div>
            <h3 className="text-base font-bold text-[#17243F]">
              No Incidents In System Yet
            </h3>
            <p className="text-xs text-[#3B4B6E] max-w-md mx-auto leading-relaxed">
              Clean zero-state initialized. Real-time reports submitted above will immediately appear here and on the Chennai GIS Map.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((t) => (
              <div 
                key={t._id || t.id} 
                className="glass-panel rounded-2xl p-4 space-y-3 hover:border-[#788CE3] transition group"
              >
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#17243F] relative shadow-inner">
                  <img 
                    src={t.imageUrl || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"} 
                    alt={t.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#DFF478] text-[#17243F] shadow-sm">
                    Priority: {t.priorityScore}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#17243F] truncate">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-[#3B4B6E] truncate mt-0.5">
                    {t.ward} • {t.landmark}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#92BAD5]/20 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === 'Resolved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : t.status === 'Assigned' 
                      ? 'bg-[#788CE3]/20 text-[#17243F]' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {t.status}
                  </span>

                  <button
                    onClick={() => handleUpvote(t._id || t.id)}
                    className="flex items-center gap-1.5 text-[#17243F] hover:text-[#788CE3] text-xs font-bold transition"
                  >
                    <ThumbsUp size={13} className="text-[#788CE3]" />
                    <span>{t.upvotes || 1} Confirmations</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
