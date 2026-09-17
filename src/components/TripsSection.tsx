import React, { useState } from 'react';
import { Trip, ScreenType } from '../types';

interface TripsSectionProps {
  trips: Trip[];
  onSelectTrip: (tripId: number) => void;
  onCreateTrip: (tripData: {
    title: string;
    travelers: number;
    start: string;
    end: string;
    budget: number;
  }) => Promise<void>;
  onBack: () => void;
  formError?: string | null;
}

export const TripsSection: React.FC<TripsSectionProps> = ({
  trips,
  onSelectTrip,
  onCreateTrip,
  onBack,
  formError,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [budget, setBudget] = useState(50000);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateTrip({ title, travelers, start, end, budget });
      setIsCreating(false);
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n: number) =>
    'Rs. ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const daysUntilLabel = (dateStr: string) => {
    const target = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
    if (diff > 1) return `${diff} days to departure`;
    if (diff === 1) return 'Departure Tomorrow';
    if (diff === 0) return 'Departs Today';
    if (diff < 0) return 'Completed Expedition';
    return '';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-24 text-white">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button
            type="button"
            onClick={onBack}
            className="hover:underline cursor-pointer"
          >
            MAIN MENU
          </button>
          <span>/</span>
          <span>EXPEDITIONS</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
              FLIGHT MANIFEST
            </h1>
            <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
              Review, track, and manage your booked expeditions and active budget telemetries.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-5 py-3 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-[0_0_20px_rgba(227,160,8,0.25)] active:scale-95"
          >
            {isCreating ? 'CANCEL' : '+ CREATE NEW EXPEDITION'}
          </button>
        </div>
      </div>

      {formError && (
        <div className="mb-8 p-4 bg-red-950/60 border border-red-500/40 rounded-xl font-mono text-xs text-red-300">
          ⚠ {formError}
        </div>
      )}

      {/* New Trip Form Drawer */}
      {isCreating && (
        <div className="mb-12 p-6 sm:p-8 bg-white/[0.04] backdrop-blur-xl border border-white/20 rounded-2xl">
          <div className="font-mono text-xs tracking-widest text-[#E3A008] uppercase mb-6">
            NEW FLIGHT ITINERARY
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                  Expedition Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manali & Spiti Circuit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                  Number of Travelers
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                  Departure Date
                </label>
                <input
                  type="date"
                  required
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  required
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                  Planned Budget (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl font-mono text-sm text-white focus:border-[#E3A008] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-white text-black hover:bg-[#e2e2e6] font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all disabled:opacity-50"
              >
                {submitting ? 'COMMITTING TO SUPABASE...' : 'COMMISSION EXPEDITION'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trips Boarding Pass List */}
      {trips.length === 0 ? (
        <div className="p-16 border border-dashed border-white/20 rounded-2xl text-center font-mono">
          <div className="text-[#E3A008] text-sm uppercase tracking-widest mb-2">
            NO ACTIVE ITINERARIES
          </div>
          <p className="text-white/50 text-xs max-w-sm mx-auto">
            You have not commissioned any trips yet. Use the button above to launch your first expedition plan.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {trips.map((trip) => {
            const spent = trip.spent || 0;
            const isOver = spent > trip.budget;
            const pct = trip.budget ? Math.min(100, Math.round((spent / trip.budget) * 100)) : 0;
            const countdown = daysUntilLabel(trip.start_date);

            return (
              <div
                key={trip.id}
                onClick={() => onSelectTrip(trip.id)}
                className="group relative w-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/15 hover:border-white/35 rounded-2xl overflow-hidden transition-all cursor-pointer flex flex-col md:flex-row shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Boarding Pass Left Stub */}
                <div className="md:w-32 bg-white/[0.04] border-b md:border-b-0 md:border-r border-white/10 p-5 flex md:flex-col justify-between items-center text-center">
                  <span className="font-mono text-xs font-bold tracking-widest text-[#E3A008]">
                    TRIP-{String(trip.id).padStart(3, '0')}
                  </span>
                  <div className="hidden md:flex flex-col gap-1 items-center my-3 opacity-30">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span className="font-mono text-[10px] tracking-wider text-white/40 uppercase">
                    {trip.travelers} PAX
                  </span>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="font-mono text-xl sm:text-2xl font-normal text-white group-hover:text-[#E3A008] transition-colors">
                        {trip.title}
                      </h3>
                      <div className="font-mono text-xs text-white/50 mt-1">
                        {trip.start_date} → {trip.end_date}
                      </div>
                    </div>

                    {countdown && (
                      <span className="font-mono text-xs tracking-wider text-[#E3A008] bg-[#E3A008]/10 border border-[#E3A008]/30 px-3 py-1 rounded-full uppercase self-start">
                        {countdown}
                      </span>
                    )}
                  </div>

                  {/* Budget Telemetry Progress Bar */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-white/60">
                        SPENT: <strong className="text-white">{fmt(spent)}</strong> / BUDGET: {fmt(trip.budget)}
                      </span>
                      <span className={isOver ? 'text-red-400 font-bold' : 'text-[#2F6F62] font-bold'}>
                        {isOver ? 'OVER BUDGET' : `${pct}% UTILIZED`}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isOver ? 'bg-red-500' : 'bg-[#E3A008]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Arrow Action Indicator */}
                <div className="hidden md:flex items-center px-6 border-l border-white/10 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all">
                  →
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
