import React, { useState } from 'react';
import { X, MapPin, Search, Navigation, Phone, Clock, ExternalLink, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { CakeDoodles } from './CakeDoodles';

interface BakeryLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  phone: string;
  specialty: string;
  pickupAvailable: boolean;
  deliveryMinutes: number;
}

interface BakeryMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPickupLocation?: (locationName: string) => void;
}

export const BakeryMapModal: React.FC<BakeryMapModalProps> = ({
  isOpen,
  onClose,
  onSelectPickupLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('Downtown Springfield');
  const [isLoading, setIsLoading] = useState(false);
  const [aiGroundedText, setAiGroundedText] = useState<string | null>(null);
  const [sources, setSources] = useState<{ title?: string; uri?: string }[]>([]);
  const [selectedBakery, setSelectedBakery] = useState<string>('hub-1');

  if (!isOpen) return null;

  const defaultLocations: BakeryLocation[] = [
    {
      id: 'hub-1',
      name: 'CakeBox Flagship Atelier & Kitchen',
      address: '104 Sweetwater Avenue, Downtown',
      distance: '0.8 miles away',
      hours: 'Open Today: 8:00 AM – 9:00 PM',
      phone: '+1 (555) 438-2253',
      specialty: 'Signature Multi-Tier Drip Cakes & Custom Inscriptions',
      pickupAvailable: true,
      deliveryMinutes: 30
    },
    {
      id: 'hub-2',
      name: 'The Sugar Blossom Pastry Studio',
      address: '742 Evergreen Plaza, Suite B',
      distance: '2.1 miles away',
      hours: 'Open Today: 8:30 AM – 7:30 PM',
      phone: '+1 (555) 892-1100',
      specialty: 'Gluten-Free Sponges & Vintage Lambeth Piping',
      pickupAvailable: true,
      deliveryMinutes: 45
    },
    {
      id: 'hub-3',
      name: 'Velvet & Crumbs Gourmet Bakery',
      address: '520 Blossom Hill Road',
      distance: '3.4 miles away',
      hours: 'Open Today: 9:00 AM – 8:00 PM',
      phone: '+1 (555) 671-9988',
      specialty: 'Dark Chocolate Ganache & Fresh Fruit Tarts',
      pickupAvailable: true,
      deliveryMinutes: 50
    }
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/nearby-bakeries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setAiGroundedText(data.text || null);
      setSources(data.sources || []);
    } catch (err) {
      console.error('Error fetching bakery map grounding:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none">
      <div className="w-full max-w-md h-[92vh] max-h-[720px] bg-[#FFF8F8] rounded-t-[36px] sm:rounded-[36px] border-t-2 sm:border-2 border-pink-200 shadow-2xl flex flex-col overflow-hidden relative">
        <CakeDoodles density="low" />

        {/* Top Header */}
        <div className="px-4 py-3 bg-[#FFF0F5] border-b border-pink-200 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-xs">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="font-bold font-display text-sm text-[#3B2C30] flex items-center gap-1.5">
                <span>CakeBox Bakeries & Pickup</span>
                <span className="text-[10px] bg-pink-200 text-pink-800 px-1.5 py-0.5 rounded-full font-bold">
                  Maps Grounded
                </span>
              </h3>
              <span className="text-[10px] text-pink-600 font-semibold block">
                Find local kitchens, pickup spots & delivery radii
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-pink-700 hover:bg-pink-100 flex items-center justify-center border border-pink-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-white border-b border-pink-100 z-10 shrink-0">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center bg-[#FFF8F8] border border-pink-200 rounded-full px-3 py-2">
              <Search size={14} className="text-pink-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Enter city, neighborhood, or zip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#3B2C30] placeholder-gray-400 outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3.5 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 btn-bounce"
            >
              {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
              <span>Find</span>
            </button>
          </form>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 z-10">
          {/* Simulated Map Visual Card */}
          <div className="w-full h-36 bg-gradient-to-br from-pink-100 via-[#FFE4E6] to-[#FED7AA] rounded-2xl border border-pink-200 relative overflow-hidden flex flex-col justify-between p-3 shadow-inner">
            <div className="flex justify-between items-start">
              <span className="bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#3B2C30] px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active 5-Mile Delivery Radius</span>
              </span>
              <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                Express Courier
              </span>
            </div>

            {/* Pins on map illustration */}
            <div className="relative h-14 flex items-center justify-around">
              <div className="flex flex-col items-center animate-bounce">
                <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                  🍰
                </div>
                <span className="text-[9px] font-extrabold text-[#3B2C30] bg-white/90 px-1 rounded-sm mt-0.5">
                  Downtown
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                  🎂
                </div>
                <span className="text-[9px] font-extrabold text-[#3B2C30] bg-white/90 px-1 rounded-sm mt-0.5">
                  Plaza
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                  🧁
                </div>
                <span className="text-[9px] font-extrabold text-[#3B2C30] bg-white/90 px-1 rounded-sm mt-0.5">
                  Hill Rd
                </span>
              </div>
            </div>

            <div className="text-[10px] text-[#584146] font-semibold text-center bg-white/80 rounded-lg py-0.5">
              Live Bakery Fleet Status: 4 Couriers on the road
            </div>
          </div>

          {/* AI Grounded Summary if searched */}
          {aiGroundedText && (
            <div className="p-3 bg-white rounded-2xl border border-pink-200 shadow-xs text-xs text-[#3B2C30] leading-relaxed">
              <div className="flex items-center gap-1.5 text-pink-600 font-bold text-[11px] mb-1.5">
                <Sparkles size={13} />
                <span>Google Grounded Bakery Guide for "{searchQuery}"</span>
              </div>
              <div className="whitespace-pre-wrap text-[11px] text-[#584146]">
                {aiGroundedText}
              </div>
              {sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-pink-100 flex flex-wrap gap-1.5">
                  {sources.slice(0, 3).map((s, idx) => (
                    <a
                      key={idx}
                      href={s.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-pink-600 hover:underline flex items-center gap-1 bg-pink-50 px-2 py-0.5 rounded-full"
                    >
                      <ExternalLink size={10} />
                      <span className="truncate max-w-[140px]">{s.title || 'Source'}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* List of Bakery Hubs */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-[#3B2C30] uppercase tracking-wider flex items-center gap-1">
              <span>Nearby CakeBox Hubs & Kitchens</span>
            </h4>

            {defaultLocations.map((loc) => {
              const isSelected = selectedBakery === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedBakery(loc.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-pink-500 ring-2 ring-pink-100 shadow-sm'
                      : 'border-pink-100 hover:border-pink-300 shadow-2xs'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-xs text-[#3B2C30]">{loc.name}</h5>
                      <p className="text-[11px] text-[#584146] mt-0.5">{loc.address}</p>
                    </div>
                    <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                      {loc.distance}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-pink-50 flex flex-col gap-1 text-[10px] text-gray-500">
                    <div className="flex items-center gap-1 text-[#584146]">
                      <Clock size={11} className="text-pink-400" />
                      <span>{loc.hours}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#584146]">
                      <Phone size={11} className="text-pink-400" />
                      <span>{loc.phone}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] text-pink-700 font-semibold italic">
                      ✨ {loc.specialty}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPickupLocation) {
                          onSelectPickupLocation(loc.name);
                        }
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-[10px] shadow-2xs transition-all btn-bounce"
                    >
                      Select for Pickup
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-pink-200 z-10 shrink-0 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs shadow-xs btn-bounce"
          >
            Close Bakery Locator
          </button>
        </div>
      </div>
    </div>
  );
};
