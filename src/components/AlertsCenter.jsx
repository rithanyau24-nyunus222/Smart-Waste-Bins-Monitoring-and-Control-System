import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Waves, 
  Building2, 
  CloudRain, 
  Send, 
  X, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { broadcastAlert } from '../services/api';

export default function AlertsCenter({ 
  alerts = [], 
  onAlertBroadcasted, 
  onClose,
  onPlaySound, 
  easyRead 
}) {
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [title, setTitle] = useState('');
  const [ward, setWard] = useState('Zone 9 - T. Nagar');
  const [severity, setSeverity] = useState('High');
  const [message, setMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(null);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcasting(true);

    try {
      const newAlert = {
        title: title || 'GCC Civic Sanitation Advisory',
        ward: ward,
        severity: severity,
        message: message || 'Municipal waste alert issued for ward residents.',
        type: 'URGENT_CIVIC',
        timestamp: 'Just now'
      };

      const res = await broadcastAlert(newAlert);
      setBroadcasting(false);
      
      const finalAlert = res && res.data ? res.data : newAlert;
      onAlertBroadcasted(finalAlert);
      setBroadcastSuccess("Civic alert successfully broadcasted across GCC network.");
      setShowBroadcastForm(false);
      setTitle('');
      setMessage('');
      if (onPlaySound) onPlaySound();
    } catch (err) {
      setBroadcasting(false);
      console.warn("Broadcast error:", err);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'ECOLOGICAL_CRITICAL':
        return <Waves size={18} className="text-rose-600" />;
      case 'MARKET_OVERFLOW':
        return <Building2 size={18} className="text-[#788CE3]" />;
      case 'MONSOON_DRAINAGE':
        return <CloudRain size={18} className="text-[#92BAD5]" />;
      default:
        return <AlertTriangle size={18} className="text-[#17243F]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#17243F]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className={`glass-panel p-6 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col justify-between border border-[#92BAD5]/50 bg-white shadow-2xl text-[#17243F] ${easyRead ? 'easy-read' : ''}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#92BAD5]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DFF478] text-[#17243F] flex items-center justify-center shadow-sm">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="font-modular-display text-xl text-[#17243F] uppercase tracking-wide">
                Greater Chennai Municipal Alerts
              </h3>
              <p className="text-[11px] text-[#3B4B6E]">
                Ecological hazard advisories and emergency sanitation alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBroadcastForm(!showBroadcastForm)}
              className="px-3 py-1.5 rounded-xl bg-[#DFF478] hover:bg-[#D4EA66] text-[#17243F] text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              Broadcast Alert
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-[#F7F3E6] text-[#6B7C9E] hover:text-[#17243F] transition"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {broadcastSuccess && (
          <div className="p-3 my-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span>{broadcastSuccess}</span>
            <button onClick={() => setBroadcastSuccess(null)} className="text-[#6B7C9E] hover:text-[#17243F]">✕</button>
          </div>
        )}

        {/* Form Drawer */}
        {showBroadcastForm && (
          <form onSubmit={handleBroadcast} className="my-3 p-4 rounded-2xl bg-[#F7F3E6] border border-[#92BAD5]/40 space-y-3">
            <div className="font-bold text-xs text-[#17243F] uppercase tracking-wider">
              Issue Official Municipal Broadcast
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Alert Title (e.g. Canal Emergency Clog)"
                className="px-3 py-2 rounded-xl bg-white border border-[#92BAD5]/50 text-xs text-[#17243F] focus:outline-none focus:border-[#788CE3]"
                required
              />
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#92BAD5]/50 text-xs text-[#17243F] focus:outline-none focus:border-[#788CE3]"
              >
                <option value="Critical">Critical (Immediate Hazard)</option>
                <option value="High">High Priority</option>
                <option value="Medium">Standard Advisory</option>
              </select>
            </div>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Advisory message for citizens and zonal sanitation teams..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#92BAD5]/50 text-xs text-[#17243F] focus:outline-none focus:border-[#788CE3] resize-none"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBroadcastForm(false)}
                className="px-3 py-1.5 rounded-xl bg-white text-[#3B4B6E] text-xs font-semibold border border-[#92BAD5]/40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={broadcasting}
                className="px-4 py-1.5 rounded-xl bg-[#17243F] text-white text-xs font-bold shadow-sm"
              >
                {broadcasting ? 'Publishing...' : 'Publish Broadcast'}
              </button>
            </div>
          </form>
        )}

        {/* Alerts Feed */}
        <div className="space-y-2.5 overflow-y-auto max-h-[50vh] my-3 pr-1">
          {alerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6B7C9E]">
              No civic emergency alerts at this time. GCC network operating normally.
            </div>
          ) : (
            alerts.map((a) => (
              <div 
                key={a.id || a._id} 
                className="p-4 rounded-2xl bg-[#F7F3E6] border border-[#92BAD5]/30 space-y-1.5 hover:border-[#788CE3] transition shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(a.type)}
                    <span className="font-bold text-xs sm:text-sm text-[#17243F]">
                      {a.title}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    a.severity === 'Critical' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : 'bg-[#DFF478] text-[#17243F]'
                  }`}>
                    {a.severity}
                  </span>
                </div>
                <p className="text-xs text-[#3B4B6E] leading-relaxed">
                  {a.message}
                </p>
                <div className="text-[10px] text-[#6B7C9E] font-mono pt-1">
                  {a.ward} • {a.timestamp || 'Active Advisory'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#92BAD5]/30 flex items-center justify-between text-xs text-[#3B4B6E]">
          <span>Real-time Emergency Dispatch Link</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F7F3E6] hover:bg-[#EBE6D8] text-[#17243F] text-xs font-bold transition border border-[#92BAD5]/40"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
