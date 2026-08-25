import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isOffline: boolean;
  onToggleOffline: () => void;
  pendingSyncCount: number;
  onSync: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  isOffline,
  onToggleOffline,
  pendingSyncCount,
  onSync
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'fullscreen'>('mobile');
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF0F2] text-[#3B2C30] flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
      {/* Top Utility Bar for Device Simulator controls */}
      <div className="w-full max-w-4xl mb-3 hidden sm:flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-pink-600 font-display text-sm tracking-wide">CakeBox Studio Preview</span>
          <span className="bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full border border-pink-200">
            React + Offline PWA
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Offline simulator toggle */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
              isOffline
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
            title="Simulate losing internet connection"
          >
            {isOffline ? <WifiOff size={14} className="text-amber-600" /> : <Wifi size={14} className="text-emerald-600" />}
            <span>{isOffline ? 'Offline Mode (Active)' : 'Online Mode'}</span>
          </button>

          {pendingSyncCount > 0 && (
            <button
              onClick={onSync}
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs animate-bounce"
            >
              <RefreshCw size={12} className="animate-spin" />
              <span>Sync {pendingSyncCount} Order{pendingSyncCount > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md flex items-center gap-1 transition-all ${
                deviceMode === 'mobile' ? 'bg-white shadow-xs text-pink-600 font-semibold' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Mobile Device Frame View"
            >
              <Smartphone size={14} />
              <span className="hidden md:inline">Mobile Frame</span>
            </button>
            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`p-1.5 rounded-md flex items-center gap-1 transition-all ${
                deviceMode === 'fullscreen' ? 'bg-white shadow-xs text-pink-600 font-semibold' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Full Responsive View"
            >
              <Monitor size={14} />
              <span className="hidden md:inline">Full Width</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      {deviceMode === 'mobile' ? (
        <div className="w-full max-w-[412px] bg-[#FFF8F8] sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-[#3B2C30]/85 overflow-hidden flex flex-col relative h-[100dvh] sm:h-[860px] max-h-[890px]">
          {/* Status Bar */}
          <div className="w-full bg-inherit text-[#3B2C30] px-6 pt-2 pb-1 flex justify-between items-center text-xs font-semibold select-none z-50 shrink-0">
            <span>{currentTime}</span>
            {/* Camera cutout pill */}
            <div className="w-20 h-4 bg-[#3B2C30]/20 rounded-full hidden sm:block"></div>
            <div className="flex items-center gap-1.5">
              {isOffline ? <WifiOff size={13} className="text-amber-600" /> : <Wifi size={13} />}
              <span className="text-[11px]">5G</span>
              <div className="w-5 h-2.5 border border-current rounded-xs p-0.5 flex items-center">
                <div className="h-full w-full bg-current rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* Phone Screen App Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative">
            {children}
          </div>

          {/* Android / iOS bottom home pill indicator */}
          <div className="w-full bg-[#FFF8F8] py-1.5 flex justify-center items-center z-40 shrink-0 border-t border-pink-50">
            <div className="w-32 h-1 bg-[#3B2C30]/30 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-[#FFF8F8] rounded-3xl shadow-xl border border-pink-100 overflow-hidden flex flex-col relative min-h-[820px]">
          {/* Top minimal status */}
          <div className="bg-pink-100/50 px-6 py-2 border-b border-pink-200/50 flex justify-between items-center text-xs text-pink-900 font-medium">
            <span>CakeBox Artisanal Online App</span>
            <div className="flex items-center gap-2">
              {isOffline ? (
                <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  <WifiOff size={12} /> Local Offline Storage Mode
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <Wifi size={12} /> Online & Sync Active
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
