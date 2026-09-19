import React, { useState } from 'react';
import { 
  Truck, 
  Navigation, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  Clock, 
  Upload, 
  ChevronRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { resolveTicket } from '../services/api';

export default function FieldWorkerPortal({ 
  tickets = [], 
  onTicketUpdated, 
  currentGps = [80.2308, 13.0395], 
  easyRead 
}) {
  const [workerId, setWorkerId] = useState('EMP-GCC-SANITATION-09');
  const [activeTask, setActiveTask] = useState(null);
  const [clearedPhoto, setClearedPhoto] = useState(null);
  const [notes, setNotes] = useState('');
  const [resolving, setResolving] = useState(false);
  const [resolvedSuccess, setResolvedSuccess] = useState(null);

  const calculateDistanceKm = (coords) => {
    if (!coords) return 1.2;
    const [lng, lat] = coords;
    const [userLng, userLat] = currentGps;
    const dLat = (lat - userLat) * Math.PI / 180;
    const dLng = (lng - userLng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((6371 * c).toFixed(1));
  };

  const sortedTasks = [...tickets]
    .map(t => ({
      ...t,
      distanceKm: calculateDistanceKm(t.location?.coordinates || t.coordinates)
    }))
    .sort((a, b) => {
      if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
      if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
      return a.distanceKm - b.distanceKm;
    });

  const handleOpenTurnByTurn = (coords) => {
    if (!coords) return;
    const [lng, lat] = coords;
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(gmapsUrl, '_blank');
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setClearedPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!activeTask) return;

    setResolving(true);
    const proofUrl = clearedPhoto || "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80";

    try {
      const res = await resolveTicket(activeTask._id || activeTask.id, {
        proofImageUrl: proofUrl,
        workerId: workerId,
        notes: notes || "Waste cleared, surrounding area disinfected."
      });

      setResolving(false);
      if (res && res.success) {
        onTicketUpdated(res.data);
        setResolvedSuccess(res.data);
        setActiveTask(null);
        setClearedPhoto(null);
        setNotes('');

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // Canvas fallback
        }
      }
    } catch (err) {
      setResolving(false);
      console.warn("Resolve error:", err);
    }
  };

  return (
    <div className={`space-y-6 max-w-6xl mx-auto text-[#17243F] ${easyRead ? 'easy-read' : ''}`}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#92BAD5]/30">
        <div>
          <h1 className="font-modular-display text-2xl sm:text-3xl text-[#17243F] uppercase tracking-wide">
            Field Operations & Driver Portal
          </h1>
          <p className="text-xs text-[#3B4B6E] mt-0.5">
            Proximity-optimized collection tasks for Greater Chennai Corporation sanitation units.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#92BAD5]/40 text-xs shadow-sm">
          <Truck size={14} className="text-[#788CE3]" />
          <span className="font-mono text-[#17243F] text-[11px] font-bold">{workerId}</span>
        </div>
      </div>

      {/* Success Notice */}
      {resolvedSuccess && (
        <div className="p-4 rounded-2xl bg-white border border-[#DFF478] text-[#17243F] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#17243F]" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-[#17243F]">Task Completed: </span>
              {resolvedSuccess.title} marked as Resolved.
            </div>
          </div>
          <button 
            onClick={() => setResolvedSuccess(null)}
            className="text-[#6B7C9E] hover:text-[#17243F] text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#92BAD5]/40 mx-auto flex items-center justify-center text-[#788CE3] shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-base font-bold text-[#17243F]">
            No Pending Collection Tasks
          </h3>
          <p className="text-xs text-[#3B4B6E] max-w-md mx-auto">
            Zero active incidents in the system. As citizens report new waste hotspots, they will appear here automatically, ordered by distance to your current GPS.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTasks.map((task) => {
            const isResolved = task.status === 'Resolved';
            return (
              <div 
                key={task._id || task.id}
                className={`glass-panel p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-sm ${
                  isResolved 
                    ? 'border-emerald-300 opacity-75' 
                    : 'border-[#92BAD5]/40 hover:border-[#788CE3]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-[#DFF478] text-[#17243F]'
                    }`}>
                      {task.status}
                    </span>
                    <span className="font-mono text-xs text-[#17243F] font-bold flex items-center gap-1">
                      <Navigation size={12} className="text-[#788CE3]" />
                      {task.distanceKm} km away
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#17243F] shrink-0 shadow-inner">
                      <img 
                        src={task.imageUrl || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"} 
                        alt={task.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-[#17243F] truncate">
                        {task.title}
                      </h3>
                      <p className="text-xs text-[#3B4B6E] truncate mt-0.5">
                        {task.ward}
                      </p>
                      <p className="text-[11px] text-[#6B7C9E] truncate mt-0.5">
                        {task.landmark}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#92BAD5]/20">
                  <button
                    onClick={() => handleOpenTurnByTurn(task.location?.coordinates || task.coordinates)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-[#F7F3E6] text-[#17243F] text-xs font-bold transition flex items-center justify-center gap-1.5 border border-[#92BAD5]/40 shadow-sm"
                  >
                    <Navigation size={13} className="text-[#788CE3]" />
                    Route GPS
                  </button>

                  {!isResolved ? (
                    <button
                      onClick={() => setActiveTask(task)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#DFF478] hover:bg-[#D4EA66] text-[#17243F] text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(223,244,120,0.4)]"
                    >
                      <Camera size={13} />
                      Verify & Clear
                    </button>
                  ) : (
                    <span className="flex-1 py-2.5 px-3 text-center text-emerald-700 text-xs font-bold">
                      ✓ Cleared
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Proof Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 bg-[#17243F]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full space-y-4 border border-[#92BAD5]/50 bg-white shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#17243F] flex items-center gap-2">
                <Camera size={18} className="text-[#788CE3]" />
                Upload Cleared Bin Proof
              </h3>
              <button 
                onClick={() => setActiveTask(null)}
                className="p-1 rounded-lg text-[#6B7C9E] hover:text-[#17243F]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#3B4B6E]">
              Upload photo certifying waste removal at <span className="text-[#17243F] font-bold">{activeTask.landmark}</span>.
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div className="aspect-video rounded-2xl bg-[#F7F3E6] border-2 border-dashed border-[#92BAD5] flex flex-col items-center justify-center overflow-hidden relative">
                {clearedPhoto ? (
                  <img src={clearedPhoto} alt="Proof" className="w-full h-full object-cover" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-4 text-center w-full h-full">
                    <Upload size={24} className="text-[#788CE3] mb-2" />
                    <span className="text-xs font-bold text-[#17243F]">Tap to Snap / Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#17243F]">Driver Remarks</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Waste collected, disinfected with bleaching powder."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#92BAD5]/50 text-xs text-[#17243F] focus:outline-none focus:border-[#788CE3]"
                />
              </div>

              <button
                type="submit"
                disabled={resolving}
                className="w-full py-3 rounded-xl bg-[#DFF478] hover:bg-[#D4EA66] text-[#17243F] font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                {resolving ? 'Submitting Resolution...' : 'Mark Incident Resolved'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
