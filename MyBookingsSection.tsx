import React from 'react';
import { Booking } from '../types';

interface MyBookingsSectionProps {
  bookings: Booking[];
  onBack: () => void;
}

export const MyBookingsSection: React.FC<MyBookingsSectionProps> = ({ bookings, onBack }) => {
  const fmt = (n: number | null) =>
    n != null
      ? 'Rs. ' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : 'N/A';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-24 text-white">
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            MAIN MENU
          </button>
          <span>/</span>
          <span>BOOKINGS</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          RESERVATION VAULT
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
          Historical ledger of confirmed expedition bookings, provider handshakes, and emailed itineraries.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="p-16 border border-dashed border-white/15 rounded-2xl text-center font-mono">
          <span className="text-[#E3A008] text-xs uppercase tracking-widest block mb-2">
            VAULT EMPTY
          </span>
          <p className="text-white/40 text-xs max-w-sm mx-auto">
            No reservations on file. Book a destination via the Autonomous Scorer or Global City Search to log an invoice.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-6 bg-white/[0.03] border border-white/15 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#E3A008] border border-[#E3A008]/40 px-2 py-0.5 rounded uppercase">
                    BOOKING #{b.id}
                  </span>
                  <span className="font-mono text-xs text-[#4EAA98] uppercase">
                    ✓ {b.status}
                  </span>
                </div>
                <h3 className="font-mono text-xl font-bold text-white mt-2">
                  {b.destination}
                </h3>
                <div className="font-mono text-xs text-white/50 mt-1">
                  DEPARTURE: {b.travel_date} · DURATION: {b.duration} DAYS · TRAVELERS: {b.travelers} PAX
                </div>
              </div>

              <div className="md:text-right border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                <span className="font-mono text-[11px] text-white/40 uppercase block">
                  PROVIDER HANDSHAKE
                </span>
                <span className="font-mono text-sm font-bold text-white block mt-0.5">
                  {b.provider}
                </span>
                <span className="font-mono text-xs text-[#E3A008] block mt-1">
                  EST. BUDGET: {fmt(b.estimated_cost)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
