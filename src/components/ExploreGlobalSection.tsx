import React, { useState } from 'react';

interface GlobalCity {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface ExploreGlobalSectionProps {
  onBack: () => void;
  onConfirmGlobalBooking: (booking: {
    city: GlobalCity;
    duration: number;
    travelers: number;
    date: string;
    email: string;
    name: string;
  }) => Promise<{ travelUrl: string; stayUrl: string }>;
  formError?: string | null;
}

export const ExploreGlobalSection: React.FC<ExploreGlobalSectionProps> = ({
  onBack,
  onConfirmGlobalBooking,
  formError,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalCity[] | null>(null);
  const [selectedCity, setSelectedCity] = useState<GlobalCity | null>(null);
  const [cityWeather, setCityWeather] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Booking Form State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [duration, setDuration] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingState, setBookingState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [providerUrls, setProviderUrls] = useState<{ travelUrl: string; stayUrl: string } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSelectedCity(null);
    setCityWeather(null);
    setShowBookingForm(false);
    setBookingState('idle');

    try {
      const resp = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query.trim()
        )}&count=6&language=en&format=json`
      );
      const data = await resp.json();
      setResults(data.results || []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = async (city: GlobalCity) => {
    setSelectedCity(city);
    setCityWeather('Acquiring live atmospheric telemetry...');
    setShowBookingForm(false);
    setBookingState('idle');

    try {
      const resp = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weathercode&timezone=auto`
      );
      if (!resp.ok) throw new Error('Weather fetch failed');
      const data = await resp.json();
      const temp = Math.round(data.current?.temperature_2m ?? 20);
      setCityWeather(`🌤 ${temp}°C CURRENT TEMPERATURE AT COORDINATES (${city.latitude.toFixed(2)}, ${city.longitude.toFixed(2)})`);
    } catch (err) {
      setCityWeather('Atmospheric sensor offline for selected hub.');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) return;
    setBookingState('sending');
    try {
      const urls = await onConfirmGlobalBooking({
        city: selectedCity,
        duration,
        travelers,
        date,
        email,
        name,
      });
      setProviderUrls(urls);
      setBookingState('sent');
    } catch (err) {
      setBookingState('error');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-24 text-white">
      {/* Navigation Breadcrumb */}
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            MAIN MENU
          </button>
          <span>/</span>
          <span>GLOBAL GEOCODING</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          EXPLORE ANY DESTINATION
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
          Real-time worldwide geocoding. Enter any municipality on Earth for live Open-Meteo telemetry and zero-markup booking.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 rounded-xl font-mono text-xs text-red-300">
          ⚠ {formError}
        </div>
      )}

      {/* Search Input Bar */}
      <div className="p-6 sm:p-8 bg-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl mb-10 max-w-2xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="e.g. Reykjavik, Kyoto, Zurich, Cape Town"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-[0_0_20px_rgba(227,160,8,0.25)] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'LOCATING...' : 'QUERY SATELLITE →'}
          </button>
        </form>
      </div>

      {/* Search Results List */}
      {results && !selectedCity && (
        <div className="space-y-4 max-w-2xl mb-12">
          <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase">
            GEODATA COORDINATES FOUND ({results.length})
          </div>

          {results.length === 0 ? (
            <p className="font-mono text-xs text-white/40">No coordinates matched query. Refine municipality spelling.</p>
          ) : (
            <div className="space-y-2">
              {results.map((r, idx) => (
                <div
                  key={`${r.name}-${r.latitude}-${idx}`}
                  onClick={() => handleSelectCity(r)}
                  className="p-4 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <span className="font-mono text-sm font-bold text-white block">
                      {r.name}{r.admin1 ? `, ${r.admin1}` : ''}
                    </span>
                    <span className="font-mono text-xs text-white/50">{r.country}</span>
                  </div>
                  <span className="font-mono text-xs text-[#E3A008] uppercase">
                    Select Hub →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected City Telemetry Deck */}
      {selectedCity && (
        <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/15 rounded-2xl max-w-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs text-[#E3A008] uppercase tracking-widest block">
                GLOBAL TELEMETRY NODE
              </span>
              <h2 className="font-mono text-3xl font-normal text-white mt-1">
                {selectedCity.name}, {selectedCity.country}
              </h2>
              <div className="font-mono text-xs text-white/50 mt-1">
                LAT {selectedCity.latitude.toFixed(4)}° / LON {selectedCity.longitude.toFixed(4)}°
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCity(null)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-lg uppercase cursor-pointer"
            >
              Change Location
            </button>
          </div>

          {/* Atmospheric Telemetry */}
          <div className="font-mono text-xs text-[#E3A008] bg-[#E3A008]/10 border border-[#E3A008]/20 p-4 rounded-xl">
            {cityWeather}
          </div>

          {/* Booking Flow Trigger */}
          {bookingState === 'sent' && providerUrls ? (
            <div className="space-y-4 pt-2">
              <div className="font-mono text-xs text-[#4EAA98]">
                ✓ CONFIRMATION DISPATCHED — DETAILED ITINERARY DELIVERED TO YOUR INBOX.
              </div>
              <div className="flex gap-3 flex-wrap">
                <a
                  href={providerUrls.travelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#E3A008] text-black font-mono text-xs font-bold rounded-lg uppercase"
                >
                  Search Flights on Google Flights →
                </a>
                <a
                  href={providerUrls.stayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-white/10 text-white font-mono text-xs rounded-lg uppercase border border-white/15"
                >
                  Search Stays on Booking.com →
                </a>
              </div>
            </div>
          ) : showBookingForm ? (
            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2 border-t border-white/10">
              <div className="font-mono text-xs text-white/80 uppercase tracking-wider">
                CONFIRM EXPEDITION RESERVATION
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Duration (Days)"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="px-3 py-2 bg-black border border-white/20 rounded font-mono text-xs text-white"
                />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Travelers"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="px-3 py-2 bg-black border border-white/20 rounded font-mono text-xs text-white"
                />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-3 py-2 bg-black border border-white/20 rounded font-mono text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Primary Traveler Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 bg-black border border-white/20 rounded font-mono text-xs text-white"
                />
                <input
                  type="email"
                  required
                  placeholder="Itinerary Recipient Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 bg-black border border-white/20 rounded font-mono text-xs text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={bookingState === 'sending'}
                  className="px-5 py-2.5 bg-[#E3A008] text-black font-mono text-xs font-bold rounded-lg uppercase cursor-pointer"
                >
                  {bookingState === 'sending' ? 'TRANSMITTING...' : 'DISPATCH CONFIRMATION INVOICE'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-4 py-2 text-white/50 hover:text-white font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowBookingForm(true)}
                className="px-6 py-3 bg-white text-black hover:bg-[#e2e2e6] font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                PROCEED TO ZERO-MARKUP BOOKING →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
