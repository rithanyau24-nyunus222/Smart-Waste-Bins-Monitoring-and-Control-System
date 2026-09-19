import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CitizenPortal from './components/CitizenPortal';
import AuthorityCommandSuite from './components/AuthorityCommandSuite';
import FieldWorkerPortal from './components/FieldWorkerPortal';
import AlertsCenter from './components/AlertsCenter';
import { fetchTickets, fetchAlerts } from './services/api';
import { Bell, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen');
  const [easyRead, setEasyRead] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentGps, setCurrentGps] = useState([80.2308, 13.0395]); // T. Nagar, Chennai
  const [tickets, setTickets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [toastAlert, setToastAlert] = useState(null);

  // Initial load from backend
  useEffect(() => {
    async function initData() {
      try {
        const ticketData = await fetchTickets();
        setTickets(ticketData || []);

        const alertData = await fetchAlerts();
        setAlerts(alertData || []);
      } catch (err) {
        console.warn("Failed to load initial data from server:", err);
      }
    }
    initData();
  }, []);

  // Web Audio API Harmonic Chime Synthesizer (Works completely offline without external files)
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq, delay, duration) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        }, delay);
      };

      // Friendly 3-tone chime (C5 - E5 - G5)
      playTone(523.25, 0, 0.25);
      playTone(659.25, 120, 0.25);
      playTone(783.99, 240, 0.4);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  const handleTicketAdded = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
    playAlertSound();
    setToastAlert({
      title: "Incident Registered",
      message: `Report in ${newTicket.ward} queued for GCC zonal dispatch.`,
      type: "success"
    });
    setTimeout(() => setToastAlert(null), 5000);
  };

  const handleTicketUpdated = (updatedTicket) => {
    setTickets(prev => prev.map(t => 
      (t._id === updatedTicket._id || t.id === updatedTicket.id) ? updatedTicket : t
    ));
    playAlertSound();
  };

  const handleTicketUpvoted = (ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t._id === ticketId || t.id === ticketId) {
        const upvotes = (t.upvotes || 1) + 1;
        return { ...t, upvotes };
      }
      return t;
    }));
    playAlertSound();
  };

  const handleAlertBroadcasted = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
    playAlertSound();
    setToastAlert({
      title: `Civic Alert: ${newAlert.title}`,
      message: `${newAlert.ward} • ${newAlert.message}`,
      type: "urgent"
    });
    setTimeout(() => setToastAlert(null), 6000);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'citizen':
        return 'Smart Waste Bins Monitoring and Control System';
      case 'map':
        return 'Chennai GIS Map Monitor';
      case 'operations':
        return 'Field Driver Operations';
      default:
        return 'Smart Waste Bins Monitoring and Control System';
    }
  };


  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-ambient-glow text-text-primary ${easyRead ? 'easy-read' : ''}`}>
      
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        easyRead={easyRead}
        ticketsCount={tickets.length}
        alertsCount={alerts.filter(a => a.severity === 'Critical' || a.severity === 'High').length}
        onOpenAlerts={() => setShowAlertsModal(true)}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        
        {/* Top-Right Status & Header Bar */}
        <TopBar
          currentGps={currentGps}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          easyRead={easyRead}
          setEasyRead={setEasyRead}
          alertsCount={alerts.length}
          onOpenAlerts={() => setShowAlertsModal(true)}
          activeTabTitle={getTabTitle()}
        />

        {/* Floating Notification Toast */}
        {toastAlert && (
          <div className="fixed top-16 right-4 z-50 max-w-sm w-full animate-bounce">
            <div className="p-4 rounded-2xl shadow-xl border border-[#92BAD5]/60 flex items-start gap-3 bg-white/95 text-[#17243F]">
              <div className="p-2 rounded-xl bg-[#DFF478] text-[#17243F] shrink-0 shadow-sm">
                <Bell size={18} />
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <span className="font-bold text-xs text-[#17243F] block truncate">{toastAlert.title}</span>
                <p className="text-[11px] text-[#3B4B6E] leading-tight">{toastAlert.message}</p>
              </div>
            </div>
          </div>
        )}


        {/* Dynamic Panel Workspace */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'citizen' && (
            <CitizenPortal
              tickets={tickets}
              onTicketAdded={handleTicketAdded}
              onTicketUpvoted={handleTicketUpvoted}
              currentGps={currentGps}
              setCurrentGps={setCurrentGps}
              easyRead={easyRead}
              onTriggerAlert={handleAlertBroadcasted}
            />
          )}

          {activeTab === 'map' && (
            <AuthorityCommandSuite
              tickets={tickets}
              onTicketUpdated={handleTicketUpdated}
              easyRead={easyRead}
            />
          )}

          {activeTab === 'operations' && (
            <FieldWorkerPortal
              tickets={tickets}
              onTicketUpdated={handleTicketUpdated}
              currentGps={currentGps}
              easyRead={easyRead}
            />
          )}
        </main>

        {/* Civic Alerts Modal */}
        {showAlertsModal && (
          <AlertsCenter
            alerts={alerts}
            onAlertBroadcasted={handleAlertBroadcasted}
            onClose={() => setShowAlertsModal(false)}
            onPlaySound={playAlertSound}
            easyRead={easyRead}
          />
        )}

      </div>
    </div>
  );
}
