import React from 'react';
import { Trip } from '../types';

interface SharedTripViewProps {
  trip: Trip;
  onGoHome: () => void;
}

export const SharedTripView: React.FC<SharedTripViewProps> = ({ trip, onGoHome }) => {
  const fmt = (n: number) =>
    'Rs. ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-24 text-white">
      <div className="mb-10">
        <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          PUBLIC FLIGHT MANIFEST // READ-ONLY
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          {trip.title}
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
          SCHEDULE: {trip.start_date} → {trip.end_date} · {trip.travelers} TRAVELERS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Destinations */}
        <div className="p-6 bg-white/[0.03] border border-white/15 rounded-2xl">
          <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-4">
            EXPEDITION STOPS ({(trip.trip_destinations || []).length})
          </div>
          {(trip.trip_destinations || []).length === 0 ? (
            <p className="font-mono text-xs text-white/40">No stops recorded.</p>
          ) : (
            <div className="space-y-2">
              {trip.trip_destinations!.map((d) => (
                <div key={d.id} className="p-3 bg-white/[0.02] border border-white/10 rounded-lg font-mono text-xs text-white">
                  <strong>{d.city}</strong>, <span className="text-white/50">{d.country}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transport */}
        <div className="p-6 bg-white/[0.03] border border-white/15 rounded-2xl">
          <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-4">
            TRANSIT LEGS ({(trip.transport || []).length})
          </div>
          {(trip.transport || []).length === 0 ? (
            <p className="font-mono text-xs text-white/40">No transit legs listed.</p>
          ) : (
            <div className="space-y-2">
              {trip.transport!.map((t) => (
                <div key={t.id} className="p-3 bg-white/[0.02] border border-white/10 rounded-lg font-mono text-xs text-white flex justify-between">
                  <span>{t.mode}: {t.from_place} → {t.to_place}</span>
                  <span className="text-white/40">{t.travel_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl font-mono text-xs text-white/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>Budget allocations and private expenses remain encrypted and inaccessible on public manifests.</span>
        <button
          type="button"
          onClick={onGoHome}
          className="px-5 py-2.5 bg-[#E3A008] text-black font-mono text-xs font-bold uppercase rounded-lg cursor-pointer whitespace-nowrap"
        >
          Plan Your Own Expedition →
        </button>
      </div>
    </div>
  );
};
