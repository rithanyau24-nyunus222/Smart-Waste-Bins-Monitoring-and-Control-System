import React from 'react';
import { 
  Camera, 
  Map, 
  ClipboardList, 
  Bell, 
  Radio, 
  ChevronRight,
  Trash2
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  easyRead, 
  ticketsCount = 0, 
  alertsCount = 0,
  onOpenAlerts
}) {
  const navItems = [
    {
      id: 'citizen',
      label: 'Report Waste',
      sublabel: 'Camera & AI Detection',
      icon: Camera,
      badge: 'Report',
      badgeColor: 'bg-[#DFF478] text-[#17243F]'
    },
    {
      id: 'map',
      label: 'Chennai Map',
      sublabel: 'GIS Bounded • Zero Clutter',
      icon: Map,
      badge: ticketsCount > 0 ? `${ticketsCount} Live` : 'Clean',
      badgeColor: ticketsCount > 0 ? 'bg-[#788CE3] text-white' : 'bg-white/10 text-[#92BAD5]'
    },
    {
      id: 'operations',
      label: 'Live Operations',
      sublabel: 'Driver Dispatch & Proof',
      icon: ClipboardList,
      badge: ticketsCount > 0 ? `${ticketsCount} Tasks` : '0 Active',
      badgeColor: 'bg-[#DFF478]/20 text-[#DFF478] border border-[#DFF478]/40'
    }
  ];

  return (
    <aside className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col md:min-h-screen bg-[#17243F] text-white select-none z-30 shadow-2xl border-r border-white/10">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#DFF478] text-[#17243F] flex items-center justify-center shadow-[0_0_20px_rgba(223,244,120,0.35)] shrink-0">
            <Trash2 size={22} className="stroke-[2.4]" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-modular-display text-2xl tracking-wide text-white uppercase leading-none">
              Smart Waste Bins
            </h1>
            <p className="text-[11px] text-[#92BAD5] font-semibold tracking-tight mt-1">
              Monitoring & Control System
            </p>
          </div>
        </div>
      </div>

      {/* Main 3 Panels Navigation */}
      <div className="p-4 space-y-2.5 flex-grow">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#92BAD5]/80">
          Management Console
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between group ${
                isActive
                  ? 'bg-white/12 border border-[#DFF478]/50 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                  : 'hover:bg-white/5 border border-transparent text-[#92BAD5] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#DFF478] text-[#17243F] shadow-[0_0_15px_rgba(223,244,120,0.4)]'
                      : 'bg-white/10 text-[#92BAD5] group-hover:text-[#788CE3] group-hover:bg-white/15'
                  }`}
                >
                  <Icon size={19} className="stroke-[2.2]" />
                </div>
                <div className="truncate">
                  <div className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-white/90'}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[#92BAD5] truncate">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <ChevronRight 
                  size={14} 
                  className={`transition-transform duration-200 ${
                    isActive ? 'text-[#DFF478] translate-x-0.5' : 'text-[#92BAD5]/60 group-hover:text-[#92BAD5]'
                  }`} 
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Strip */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {/* Civic Alert Strip */}
        <button
          onClick={onOpenAlerts}
          className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell size={16} className="text-[#DFF478]" />
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </div>
            <span className="text-xs font-semibold text-white">
              Civic Alerts & Notices
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#DFF478] text-[#17243F]">
            {alertsCount} active
          </span>
        </button>

        {/* Real-time sync indicator */}
        <div className="px-3 py-2 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DFF478] animate-ping" />
            <span className="font-semibold text-[#92BAD5]">Live Sensor Sync</span>
          </div>
          <span className="text-[#DFF478] font-mono text-[10px]">Real-Time</span>
        </div>
      </div>

    </aside>
  );
}
