import React from 'react';
import { 
  MapPin, 
  Volume2, 
  VolumeX, 
  Eye, 
  Bell, 
  Radio
} from 'lucide-react';

export default function TopBar({ 
  currentGps, 
  soundEnabled, 
  setSoundEnabled, 
  easyRead, 
  setEasyRead, 
  alertsCount,
  onOpenAlerts,
  activeTabTitle
}) {
  return (
    <header className="w-full bg-[#F7F3E6]/90 backdrop-blur-xl border-b border-[#92BAD5]/30 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
      
      {/* Current Active Panel Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#788CE3] animate-pulse" />
          <h2 className="font-modular-display text-xl sm:text-2xl text-[#17243F] tracking-wide uppercase">
            {activeTabTitle || 'Smart Waste Bins Monitoring and Control System'}
          </h2>
        </div>
      </div>

      {/* Top Right Bars & Quick Action Controls */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 ml-auto">
        
        {/* Bar 1: Sensor & Cloud Network Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#92BAD5]/40 text-xs text-[#17243F] shadow-sm">
          <Radio size={13} className="text-[#788CE3] animate-pulse" />
          <span className="font-bold text-[11px] text-[#17243F]">NETWORK</span>
          <span className="text-[10px] text-[#17243F] font-mono px-1.5 py-0.5 rounded bg-[#DFF478] font-extrabold">LIVE</span>
        </div>

        {/* Bar 2: Live Chennai GPS Lock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#92BAD5]/40 text-xs text-[#17243F] shadow-sm">
          <MapPin size={13} className="text-[#788CE3] shrink-0" />
          <span className="font-mono text-[11px] text-[#17243F] font-semibold">
            {currentGps ? `${currentGps[0].toFixed(3)}°E, ${currentGps[1].toFixed(3)}°N` : 'Chennai'}
          </span>
          <span className="hidden md:inline text-[9px] px-1.5 py-0.5 rounded bg-[#788CE3]/20 text-[#17243F] font-bold">
            GCC BOUNDED
          </span>
        </div>

        {/* Bar 3: Civic Alerts Toggle Button */}
        <button
          onClick={onOpenAlerts}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F7F3E6] border border-[#92BAD5]/40 transition text-xs font-bold text-[#17243F] shadow-sm"
          title="View Civic Warnings & Municipal Alerts"
        >
          <Bell size={14} className="text-[#788CE3]" />
          <span className="hidden sm:inline text-[11px]">Alerts</span>
          {alertsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#DFF478] text-[#17243F]">
              {alertsCount}
            </span>
          )}
        </button>

        {/* Bar 4: Audio Chime Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-xl border transition shadow-sm ${
            soundEnabled 
              ? 'bg-[#DFF478] text-[#17243F] border-[#DFF478]' 
              : 'bg-white text-[#92BAD5] border-[#92BAD5]/40'
          }`}
          title={soundEnabled ? 'Alert Chimes Enabled' : 'Alert Chimes Muted'}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Bar 5: Universal Ages 10-90 Easy-Read Mode */}
        <button
          onClick={() => setEasyRead(!easyRead)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition shadow-sm ${
            easyRead
              ? 'bg-[#17243F] text-[#DFF478] border-[#17243F]'
              : 'bg-white text-[#17243F] hover:bg-[#F7F3E6] border-[#92BAD5]/40'
          }`}
          title="Toggle Large-Print Accessible Mode (Ages 10-90)"
        >
          <Eye size={14} className={easyRead ? 'text-[#DFF478]' : 'text-[#788CE3]'} />
          <span className="text-[11px] whitespace-nowrap">
            {easyRead ? 'Easy-Read ON' : 'Ages 10–90'}
          </span>
        </button>

      </div>
    </header>
  );
}
