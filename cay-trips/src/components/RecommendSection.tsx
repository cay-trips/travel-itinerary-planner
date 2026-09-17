import React, { useState, useEffect } from 'react';
import { Destination, ScoredDestination } from '../types';

interface RecommendSectionProps {
  destinations: Destination[];
  favorites: number[];
  onToggleFavorite: (destId: number) => Promise<void>;
  onConfirmBooking: (bookingData: {
    destination: ScoredDestination;
    travelDate: string;
    duration: number;
    travelers: number;
    email: string;
    name: string;
  }) => Promise<{ travelUrl: string; stayUrl: string }>;
  onBack: () => void;
  formError?: string | null;
}

export const RecommendSection: React.FC<RecommendSectionProps> = ({
  destinations,
  favorites,
  onToggleFavorite,
  onConfirmBooking,
  onBack,
  formError,
}) => {
  const [budget, setBudget] = useState<number>(35000);
  const [duration, setDuration] = useState<number>(5);
  const [travelers, setTravelers] = useState<number>(2);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [results, setResults] = useState<ScoredDestination[] | null>(null);
  const [weatherMap, setWeatherMap] = useState<Record<number, string>>({});
  const [bookingOpenId, setBookingOpenId] = useState<number | null>(null);
  const [bookingEmail, setBookingEmail] = useState<string>('');
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingState, setBookingState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [bookingUrls, setBookingUrls] = useState<{ travelUrl: string; stayUrl: string } | null>(null);

  const fmt = (n: number) =>
    'Rs. ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    const month = Number(startDate.split('-')[1]);

    const scored: ScoredDestination[] = destinations.map((d) => {
      const avgDaily = Number(d.avg_daily_budget);
      const estimatedCost = avgDaily * duration * travelers;
      const diffRatio = Math.abs(estimatedCost - budget) / budget;
      const budgetFit = Math.max(0, Math.min(60, 60 * (1 - diffRatio)));
      const inSeason = (d.best_months || []).includes(month);
      const seasonalFit = inSeason ? 40 : 15;
      const bf = Math.round(budgetFit);
      const combined = bf + seasonalFit;

      let reason = 'Balanced match across budget and season';
      if (bf >= 45 && inSeason) reason = 'Exceptional budget alignment, prime in-season';
      else if (bf >= 45 && !inSeason) reason = 'Optimal budget fit, shoulder/off-season';
      else if (bf < 45 && inSeason) reason = 'Peak travel season, slight budget stretch';
      else reason = 'Off-season period with extended budget demands';

      return {
        ...d,
        estimatedCost,
        budgetFit: bf,
        seasonalFit,
        combined,
        inSeason,
        reason,
      };
    });

    scored.sort((a, b) => b.combined - a.combined);
    setResults(scored.slice(0, 3));
    setBookingOpenId(null);
    setBookingState('idle');
  };

  // Weather telemetry
  useEffect(() => {
    if (!results) return;

    results.forEach(async (r) => {
      if (r.latitude == null || r.longitude == null) return;
      try {
        const resp = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${r.latitude}&longitude=${r.longitude}&current=temperature_2m,weathercode&timezone=auto`
        );
        if (!resp.ok) return;
        const data = await resp.json();
        const temp = Math.round(data.current?.temperature_2m ?? 24);
        setWeatherMap((prev) => ({
          ...prev,
          [r.id]: `🌤 ${temp}°C CURRENT AIR TEMPERATURE`,
        }));
      } catch (err) {
        // Silent fallback
      }
    });
  }, [results]);

  const handleConfirmSubmit = async (e: React.FormEvent, dest: ScoredDestination) => {
    e.preventDefault();
    setBookingState('sending');
    try {
      const urls = await onConfirmBooking({
        destination: dest,
        travelDate: startDate,
        duration,
        travelers,
        email: bookingEmail,
        name: bookingName,
      });
      setBookingUrls(urls);
      setBookingState('sent');
    } catch (err) {
      setBookingState('error');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-24 text-white">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            MAIN MENU
          </button>
          <span>/</span>
          <span>AUTONOMOUS SCORER</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          RECOMMEND DESTINATION
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
          Scoring engine queries {destinations.length} cataloged hubs, weighing estimated burn rate against seasonal climatology.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 rounded-xl font-mono text-xs text-red-300">
          ⚠ {formError}
        </div>
      )}

      {/* Input Parameters Deck */}
      <div className="p-6 sm:p-8 bg-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl mb-12 max-w-2xl">
        <form onSubmit={handleRecommend} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                Available Budget (Rs.)
              </label>
              <input
                type="number"
                min="1000"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                Expedition Length (Days)
              </label>
              <input
                type="number"
                min="1"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                Travelers
              </label>
              <input
                type="number"
                min="1"
                required
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                Target Departure Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-[0_0_20px_rgba(227,160,8,0.25)] active:scale-95"
          >
            EXECUTE SCORING MATRIX →
          </button>
        </form>
      </div>

      {/* Scored Recommendations List */}
      {results && (
        <div className="space-y-6">
          <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase">
            TOP 3 ALIGNED DESTINATIONS
          </div>

          <div className="grid grid-cols-1 gap-6">
            {results.map((dest, i) => {
              const isFav = favorites.includes(dest.id);

              return (
                <div
                  key={dest.id}
                  className="p-6 sm:p-8 bg-white/[0.03] border border-white/15 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-6"
                >
                  {/* Rank Badge */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#E3A008] border border-[#E3A008]/40 px-2 py-0.5 rounded">
                        RANK 0{i + 1}
                      </span>
                      <span
                        className={`font-mono text-[11px] px-2.5 py-0.5 rounded-full uppercase ${
                          dest.inSeason
                            ? 'bg-[#2F6F62]/30 text-[#4EAA98] border border-[#2F6F62]/50'
                            : 'bg-white/10 text-white/50 border border-white/10'
                        }`}
                      >
                        {dest.inSeason ? 'In-Season' : 'Off-Season'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(dest.id)}
                        className="text-lg text-white/50 hover:text-red-400 cursor-pointer transition-colors ml-auto md:ml-0"
                      >
                        {isFav ? '❤️' : '🤍'}
                      </button>
                    </div>

                    <h3 className="font-mono text-2xl sm:text-3xl font-normal text-white">
                      {dest.name}
                    </h3>
                    <p className="font-mono text-xs text-white/60 leading-relaxed max-w-xl">
                      {dest.attractions || 'Cultural heritage hubs, authentic culinary corridors, and natural trails.'}
                    </p>

                    <div className="font-mono text-xs text-white/40 pt-2 space-y-1">
                      <div>
                        ESTIMATED COST: <strong className="text-white">{fmt(dest.estimatedCost)}</strong> (Burn: {fmt(dest.avg_daily_budget)}/day/pax)
                      </div>
                      <div className="text-[#E3A008]">{weatherMap[dest.id] || 'Loading telemetry...'}</div>
                      <div className="italic text-white/50">"{dest.reason}"</div>
                    </div>

                    {/* Booking Form Integration */}
                    {bookingOpenId === dest.id ? (
                      <div className="mt-4 p-5 bg-black/80 border border-white/20 rounded-xl space-y-3">
                        {bookingState === 'sent' && bookingUrls ? (
                          <div className="space-y-3">
                            <div className="font-mono text-xs text-[#4EAA98]">
                              ✓ CONFIRMATION DISPATCHED — INVOICE TRANSMITTED TO YOUR INBOX.
                            </div>
                            <div className="flex gap-3 flex-wrap">
                              <a
                                href={bookingUrls.travelUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-[#E3A008] text-black font-mono text-xs font-bold rounded-lg uppercase"
                              >
                                Book Flights on Google Flights →
                              </a>
                              <a
                                href={bookingUrls.stayUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-white/10 text-white font-mono text-xs rounded-lg uppercase border border-white/15"
                              >
                                Book Stays on Booking.com →
                              </a>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleConfirmSubmit(e, dest)} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Lead Traveler Name"
                                value={bookingName}
                                onChange={(e) => setBookingName(e.target.value)}
                                className="px-3 py-2 bg-black border border-white/20 rounded font-mono text-xs text-white focus:outline-none"
                              />
                              <input
                                type="email"
                                required
                                placeholder="Invoice Email Recipient"
                                value={bookingEmail}
                                onChange={(e) => setBookingEmail(e.target.value)}
                                className="px-3 py-2 bg-black border border-white/20 rounded font-mono text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={bookingState === 'sending'}
                                className="px-4 py-2 bg-[#E3A008] text-black font-mono text-xs font-bold rounded uppercase cursor-pointer"
                              >
                                {bookingState === 'sending' ? 'TRANSMITTING...' : 'CONFIRM & TRANSMIT INVOICE'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setBookingOpenId(null)}
                                className="px-3 py-2 text-white/50 hover:text-white font-mono text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBookingOpenId(dest.id);
                            setBookingState('idle');
                          }}
                          className="px-4 py-2 bg-white text-black hover:bg-[#e2e2e6] font-mono text-xs font-bold uppercase rounded-lg cursor-pointer transition-all"
                        >
                          LOCK & BOOK EXPEDITION
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Combined Score Indicator Wheel */}
                  <div className="flex flex-col items-center justify-center p-4 min-w-[120px]">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(227,160,8,0.2)]"
                      style={{
                        background: `conic-gradient(#E3A008 ${dest.combined}%, rgba(255,255,255,0.08) 0)`,
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center">
                        <span className="font-mono text-xl font-bold text-white leading-none">
                          {dest.combined}
                        </span>
                        <span className="font-mono text-[9px] text-white/50 tracking-tighter">
                          / 100
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase mt-2">
                      MATCH SCORE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
