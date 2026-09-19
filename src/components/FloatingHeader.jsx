import React from 'react';
import { 
  MapPin, 
  Bell, 
  ShieldCheck, 
  Truck, 
  FileText, 
  Camera, 
  SlidersHorizontal,
  Presentation,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';

export default function FloatingHeader({ 
  activeTab, 
  setActiveTab, 
  easyRead, 
  setEasyRead, 
  alertsCount, 
  soundEnabled, 
  setSoundEnabled,
  currentGps
}) {
  const navTabs = [
    { id: 'citizen', label: 'Citizen Reporter', icon: Camera, badge: 'Mobile-First' },
    { id: 'authority', label: 'Authority GIS Suite', icon: Compass, badge: 'Chennai Command' },
    { id: 'worker', label: 'Field Driver Portal', icon: Truck, badge: 'Task Route' },
    { id: 'alerts', label: 'Civic Alerts', icon: Bell, count: alertsCount, badge: 'Live Warning' },
    { id: 'ogd', label: 'Open Data (OGD)', icon: FileText, badge: 'RFC 7946' },
    { id: 'slides', label: 'PPT Slides & Diagrams', icon: Presentation, badge: '6 HD Diagrams' },
  ];

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto transition-all">
      {/* Top Floating Glass Pill Container */}
      <div className="glass-pill rounded-3xl p-2.5 sm:p-3.5 shadow-[0_8px_30px_rgb(36,60,44,0.06)] flex flex-wrap items-center justify-between gap-3 border border-white/80">
        
        {/* Left: Brand Identity & GPS Lock */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('citizen')}
            className="cursor-pointer flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#243C2C] text-white hover:bg-[#17243F] transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-[#DFF478] flex items-center justify-center text-[#243C2C] font-black text-xs">
              CC
            </div>
            <div>
              <span className="font-modular-display text-lg tracking-wider text-[#DFF478] leading-none block">
                CLEANCHENNAI
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#A9B6C4] block font-semibold">
                GCC Smart Waste
              </span>
            </div>
          </div>

          {/* GPS Coordinates & Bounding Status */}
          <div className="hidden md:flex items-center gap-2 bg-[#F7F3E6] border border-[#ECE69D] px-3 py-1.5 rounded-full text-xs text-[#243C2C]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A9445] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7A9445]"></span>
            </span>
            <span className="font-semibold flex items-center gap-1">
              <MapPin size={13} className="text-[#243C2C]" />
              Chennai Bounded:
            </span>
            <span className="font-mono text-[11px] text-[#59789F]">
              [{currentGps[0].toFixed(3)}°E, {currentGps[1].toFixed(3)}°N]
            </span>
          </div>
        </div>

        {/* Center: Clean Navigation Pills */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 max-w-full no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#243C2C] text-[#DFF478] shadow-md scale-[1.02]'
                    : 'text-[#243C2C] hover:bg-white/80 hover:text-[#7A9445]'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#DFF478]' : 'text-[#7A9445]'} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E54B4B] text-white font-bold animate-pulse">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Controls & Accessibility */}
        <div className="flex items-center gap-2">
          {/* Sound Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute audio alerts" : "Enable audio alerts"}
            className="p-2 rounded-full bg-[#F7F3E6] hover:bg-white text-[#243C2C] border border-[#A9B6C4]/40 transition-all text-xs flex items-center justify-center"
          >
            {soundEnabled ? <Volume2 size={16} className="text-[#7A9445]" /> : <VolumeX size={16} className="text-[#A9B6C4]" />}
          </button>

          {/* Age 10 - 90 Universal Accessibility Toggle */}
          <button
            onClick={() => setEasyRead(!easyRead)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
              easyRead 
                ? 'bg-[#DFF478] text-[#243C2C] border-[#243C2C] shadow-sm' 
                : 'bg-white/80 text-[#243C2C] border-[#A9B6C4]/50 hover:bg-[#F7F3E6]'
            }`}
            title="Toggle high-contrast large fonts for all age groups (10-90)"
          >
            <SlidersHorizontal size={13} />
            <span>{easyRead ? 'Easy-Read ON' : 'Age 10-90 Mode'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
