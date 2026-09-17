import React, { useState } from 'react';
import { Trip, Expense, Transport, TripDestination } from '../types';

interface TripDetailViewProps {
  trip: Trip;
  onBack: () => void;
  onOpenAddExpense: () => void;
  onOpenSplitCost: () => void;
  onDeleteExpense: (id: number) => Promise<void>;
  onDeleteTransport: (id: number) => Promise<void>;
  onDeleteDestination: (id: number) => Promise<void>;
  onMakePublic: (tripId: number) => Promise<void>;
  onMakePrivate: (tripId: number) => Promise<void>;
  onAddDestination: (city: string, country: string) => Promise<void>;
  onAddTransport: (transport: {
    mode: string;
    from: string;
    to: string;
    date: string;
    cost: number;
    ref?: string;
  }) => Promise<void>;
  formError?: string | null;
}

export const TripDetailView: React.FC<TripDetailViewProps> = ({
  trip,
  onBack,
  onOpenAddExpense,
  onOpenSplitCost,
  onDeleteExpense,
  onDeleteTransport,
  onDeleteDestination,
  onMakePublic,
  onMakePrivate,
  onAddDestination,
  onAddTransport,
  formError,
}) => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'itinerary' | 'packing' | 'share'>('expenses');
  const [showAddDest, setShowAddDest] = useState(false);
  const [destCity, setDestCity] = useState('');
  const [destCountry, setDestCountry] = useState('');

  const [showAddTrans, setShowAddTrans] = useState(false);
  const [transMode, setTransMode] = useState('Flight');
  const [transFrom, setTransFrom] = useState('');
  const [transTo, setTransTo] = useState('');
  const [transDate, setTransDate] = useState(trip.start_date);
  const [transCost, setTransCost] = useState(0);
  const [transRef, setTransRef] = useState('');

  const fmt = (n: number) =>
    'Rs. ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const totalSpent = (trip.expenses || []).reduce((acc, e) => acc + Number(e.amount), 0);
  const isOver = totalSpent > trip.budget;
  const remaining = trip.budget - totalSpent;
  const pct = trip.budget ? Math.min(100, Math.round((totalSpent / trip.budget) * 100)) : 0;

  // Category totals
  const categoryTotals: Record<string, number> = {};
  (trip.expenses || []).forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  const categoryRows = Object.keys(categoryTotals)
    .map((cat) => ({
      cat,
      amount: categoryTotals[cat],
      pct: totalSpent ? Math.round((categoryTotals[cat] / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Group by date
  const byDate: Record<string, { transport: Transport[]; expenses: Expense[] }> = {};
  (trip.transport || []).forEach((t) => {
    if (!byDate[t.travel_date]) byDate[t.travel_date] = { transport: [], expenses: [] };
    byDate[t.travel_date].transport.push(t);
  });
  (trip.expenses || []).forEach((e) => {
    if (!byDate[e.expense_date]) byDate[e.expense_date] = { transport: [], expenses: [] };
    byDate[e.expense_date].expenses.push(e);
  });
  const sortedDates = Object.keys(byDate).sort();

  // Packing list
  const days = Math.max(
    1,
    Math.round(
      (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / 86400000
    ) + 1
  );

  const packingList = [
    {
      category: 'IDENTIFICATION & CREDENTIALS',
      items: ['Government ID / Passport', 'Confirmed boarding passes', 'Emergency contacts card', 'Liquid cash reserve + Primary card'],
    },
    {
      category: 'TACTICAL WARDROBE',
      items: [`${days} day-sets`, `${Math.ceil(days / 2)} pairs socks/underlayers`, 'Weather-shell thermal layer', 'All-terrain boots/sneakers'],
    },
    {
      category: 'TECH & TELEMETRY',
      items: ['Universal charger & powerbank', 'Offline maps downloaded', 'Medical kit & personal supplies', 'Refillable insulated hydration flask'],
    },
  ];

  const shareUrl = trip.share_token
    ? `${window.location.origin}${window.location.pathname}?share=${trip.share_token}`
    : '';

  const handleAddDestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destCity.trim()) return;
    await onAddDestination(destCity.trim(), destCountry.trim());
    setDestCity('');
    setDestCountry('');
    setShowAddDest(false);
  };

  const handleAddTransSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transFrom.trim() || !transTo.trim()) return;
    await onAddTransport({
      mode: transMode,
      from: transFrom.trim(),
      to: transTo.trim(),
      date: transDate,
      cost: transCost,
      ref: transRef.trim() || undefined,
    });
    setTransFrom('');
    setTransTo('');
    setTransCost(0);
    setTransRef('');
    setShowAddTrans(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-24 text-white">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-4">
        <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
          EXPEDITIONS
        </button>
        <span>/</span>
        <span className="text-white/70">{trip.title}</span>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 rounded-xl font-mono text-xs text-red-300">
          ⚠ {formError}
        </div>
      )}

      {/* Main Trip Status Deck */}
      <div className="p-6 sm:p-8 bg-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#E3A008] border border-[#E3A008]/40 px-2 py-0.5 rounded uppercase">
                TRIP-{String(trip.id).padStart(3, '0')}
              </span>
              <span className="font-mono text-xs text-white/50">
                {trip.travelers} TRAVELERS
              </span>
            </div>
            <h1 className="font-mono text-2xl sm:text-4xl font-normal text-white mt-2 uppercase">
              {trip.title}
            </h1>
            <div className="font-mono text-xs text-white/60 mt-1">
              SCHEDULE: {trip.start_date} → {trip.end_date} ({days} DAYS)
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAddExpense}
              className="px-5 py-2.5 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(227,160,8,0.2)] active:scale-95"
            >
              + LOG EXPENSE
            </button>
            <button
              type="button"
              onClick={onOpenSplitCost}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-xl border border-white/15 transition-all cursor-pointer active:scale-95"
            >
              SPLIT EQUAL SHARE
            </button>
          </div>
        </div>

        {/* Telemetry Gauge */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border-l border-white/15 pl-4">
            <span className="font-mono text-[11px] text-white/50 tracking-widest uppercase block">
              TOTAL SPENT
            </span>
            <span className="font-mono text-2xl font-bold text-white mt-1 block">
              {fmt(totalSpent)}
            </span>
            <span className="font-mono text-[11px] text-white/40 block mt-1">
              {pct}% of planned {fmt(trip.budget)}
            </span>
          </div>

          <div className="border-l border-white/15 pl-4">
            <span className="font-mono text-[11px] text-white/50 tracking-widest uppercase block">
              REMAINING CEILING
            </span>
            <span className={`font-mono text-2xl font-bold mt-1 block ${isOver ? 'text-red-400' : 'text-[#2F6F62]'}`}>
              {isOver ? `-${fmt(Math.abs(remaining))}` : fmt(remaining)}
            </span>
            <span className="font-mono text-[11px] text-white/40 block mt-1">
              {isOver ? 'Budget overrun detected' : 'Operating within margin'}
            </span>
          </div>

          <div className="border-l border-white/15 pl-4">
            <span className="font-mono text-[11px] text-white/50 tracking-widest uppercase block">
              SECURITY STATUS
            </span>
            <span className="font-mono text-sm font-bold text-white mt-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${trip.is_public ? 'bg-[#E3A008]' : 'bg-[#2F6F62]'}`} />
              {trip.is_public ? 'PUBLIC LINK ACTIVE' : 'SECURE VAULT (PRIVATE)'}
            </span>
            <span className="font-mono text-[11px] text-white/40 block mt-1">
              {trip.is_public ? 'Tokenized read-only link' : 'Encrypted user session only'}
            </span>
          </div>
        </div>
      </div>

      {/* Detail Tabs Navigation */}
      <div className="flex border-b border-white/15 gap-3 mb-8 overflow-x-auto whitespace-nowrap">
        {[
          { id: 'expenses', label: `EXPENSES (${(trip.expenses || []).length})` },
          { id: 'itinerary', label: `ITINERARY & TRANSIT (${(trip.transport || []).length + (trip.trip_destinations || []).length})` },
          { id: 'packing', label: 'PACKING CHECKLIST' },
          { id: 'share', label: 'SHARE MANIFEST' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`font-mono text-xs tracking-wider pb-3 px-2 border-b-2 transition-all cursor-pointer uppercase ${
              activeTab === tab.id
                ? 'border-[#E3A008] text-white font-bold'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Expenses & Spending Breakdown */}
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {(trip.expenses || []).length === 0 ? (
              <div className="p-12 border border-dashed border-white/15 rounded-xl text-center font-mono">
                <span className="text-white/40 text-xs uppercase block">NO EXPENSES LOGGED</span>
                <button
                  type="button"
                  onClick={onOpenAddExpense}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-lg cursor-pointer"
                >
                  Log First Expense
                </button>
              </div>
            ) : (
              trip.expenses!.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-between gap-4 transition-colors"
                >
                  <div>
                    <span className="font-mono text-sm font-bold text-white block">
                      {exp.description || exp.category}
                    </span>
                    <span className="font-mono text-xs text-white/50 mt-0.5 block">
                      {exp.category} · Paid by <strong className="text-white/80">{exp.paid_by}</strong> · {exp.expense_date}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-white">
                      {fmt(exp.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(exp.id)}
                      title="Delete expense"
                      className="text-white/30 hover:text-red-400 font-mono text-xs p-1 cursor-pointer transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Spending By Category Breakdown */}
          <div className="p-6 bg-white/[0.03] border border-white/15 rounded-2xl h-fit">
            <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-4">
              BURNDOWN BY CATEGORY
            </div>
            {categoryRows.length === 0 ? (
              <p className="font-mono text-xs text-white/40">Log expenses to populate category telemetry.</p>
            ) : (
              <div className="space-y-4">
                {categoryRows.map((r) => (
                  <div key={r.cat}>
                    <div className="flex justify-between font-mono text-xs text-white/80 mb-1">
                      <span>{r.cat}</span>
                      <span>
                        {fmt(r.amount)} ({r.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E3A008]" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Itinerary, Transit, Destinations & Timeline */}
      {activeTab === 'itinerary' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Destinations */}
            <div className="p-6 bg-white/[0.03] border border-white/15 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-[#E3A008] tracking-widest uppercase">
                  DESTINATIONS ({(trip.trip_destinations || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddDest(!showAddDest)}
                  className="font-mono text-xs text-white/70 hover:text-white cursor-pointer"
                >
                  {showAddDest ? 'Close' : '+ Add City'}
                </button>
              </div>

              {showAddDest && (
                <form onSubmit={handleAddDestSubmit} className="mb-4 p-3 bg-black/60 rounded-xl space-y-2 border border-white/10">
                  <input
                    type="text"
                    required
                    placeholder="City (e.g. Kyoto)"
                    value={destCity}
                    onChange={(e) => setDestCity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black border border-white/20 rounded font-mono text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Country (e.g. Japan)"
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black border border-white/20 rounded font-mono text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[#E3A008] text-black font-mono text-xs font-bold uppercase rounded cursor-pointer"
                  >
                    Commit Destination
                  </button>
                </form>
              )}

              {(trip.trip_destinations || []).length === 0 ? (
                <p className="font-mono text-xs text-white/40">No destination stops recorded.</p>
              ) : (
                <div className="space-y-2">
                  {trip.trip_destinations!.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 bg-white/[0.02] border border-white/10 rounded-lg flex justify-between items-center"
                    >
                      <span className="font-mono text-xs font-bold text-white">
                        {d.city}, <span className="font-normal text-white/50">{d.country}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteDestination(d.id)}
                        className="text-white/30 hover:text-red-400 font-mono text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transit & Transport */}
            <div className="p-6 bg-white/[0.03] border border-white/15 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-[#E3A008] tracking-widest uppercase">
                  TRANSIT & FLIGHTS ({(trip.transport || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddTrans(!showAddTrans)}
                  className="font-mono text-xs text-white/70 hover:text-white cursor-pointer"
                >
                  {showAddTrans ? 'Close' : '+ Add Transit'}
                </button>
              </div>

              {showAddTrans && (
                <form onSubmit={handleAddTransSubmit} className="mb-4 p-3 bg-black/60 rounded-xl space-y-2 border border-white/10">
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={transMode}
                      onChange={(e) => setTransMode(e.target.value)}
                      className="col-span-1 px-2 py-1.5 bg-black border border-white/20 rounded font-mono text-xs text-white"
                    >
                      <option>Flight</option>
                      <option>Train</option>
                      <option>Bus</option>
                      <option>Car</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Origin"
                      value={transFrom}
                      onChange={(e) => setTransFrom(e.target.value)}
                      className="col-span-1 px-2 py-1.5 bg-black border border-white/20 rounded font-mono text-xs text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Destination"
                      value={transTo}
                      onChange={(e) => setTransTo(e.target.value)}
                      className="col-span-1 px-2 py-1.5 bg-black border border-white/20 rounded font-mono text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      value={transDate}
                      onChange={(e) => setTransDate(e.target.value)}
                      className="px-2 py-1.5 bg-black border border-white/20 rounded font-mono text-xs text-white"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Cost (Rs.)"
                      value={transCost}
                      onChange={(e) => setTransCost(Number(e.target.value))}
                      className="px-2 py-1.5 bg-black border border-white/20 rounded font-mono text-xs text-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Booking Reference / Flight Number"
                    value={transRef}
                    onChange={(e) => setTransRef(e.target.value)}
                    className="w-full px-2 py-1.5 bg-black border border-white/20 rounded font-mono text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[#E3A008] text-black font-mono text-xs font-bold uppercase rounded cursor-pointer"
                  >
                    Commit Transit Leg
                  </button>
                </form>
              )}

              {(trip.transport || []).length === 0 ? (
                <p className="font-mono text-xs text-white/40">No transit legs booked.</p>
              ) : (
                <div className="space-y-2">
                  {trip.transport!.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-white/[0.02] border border-white/10 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-white block">
                          {t.mode}: {t.from_place} → {t.to_place}
                        </span>
                        <span className="font-mono text-[11px] text-white/50">
                          {t.travel_date} {t.booking_ref ? `· REF: ${t.booking_ref}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white">{fmt(t.cost)}</span>
                        <button
                          type="button"
                          onClick={() => onDeleteTransport(t.id)}
                          className="text-white/30 hover:text-red-400 font-mono text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Day-by-day Chronological Timeline */}
          <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/15 rounded-2xl">
            <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-6">
              CHRONOLOGICAL TELEMETRY (DAY-BY-DAY)
            </div>

            {sortedDates.length === 0 ? (
              <p className="font-mono text-xs text-white/40">Add transit legs or expenses with dates to view chronological breakdown.</p>
            ) : (
              <div className="space-y-6">
                {sortedDates.map((d) => (
                  <div key={d} className="border-l-2 border-[#E3A008] pl-4 space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E3A008] tracking-wider block uppercase">
                      TIMESTAMP: {d}
                    </span>
                    {byDate[d].transport.map((t) => (
                      <div key={t.id} className="font-mono text-xs text-white/90">
                        ✈ {t.mode}: {t.from_place} → {t.to_place} ({fmt(t.cost)})
                      </div>
                    ))}
                    {byDate[d].expenses.map((e) => (
                      <div key={e.id} className="font-mono text-xs text-white/60">
                        ◆ {e.category}: {e.description || 'Expense'} ({fmt(e.amount)}) paid by {e.paid_by}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Packing Checklist */}
      {activeTab === 'packing' && (
        <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/15 rounded-2xl max-w-3xl">
          <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
            MISSION CHECKLIST // {days} DAYS EXPEDITION
          </div>
          <p className="font-mono text-xs text-white/50 mb-8">
            Algorithmic payload guide generated based on expedition duration and travel conditions.
          </p>

          <div className="space-y-8">
            {packingList.map((group) => (
              <div key={group.category} className="space-y-3">
                <span className="font-mono text-xs font-bold text-white/80 uppercase tracking-wider block">
                  {group.category}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.items.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-colors"
                    >
                      <input type="checkbox" className="accent-[#E3A008] w-4 h-4 rounded" />
                      <span className="font-mono text-xs text-white/80">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Public Share Manifest */}
      {activeTab === 'share' && (
        <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/15 rounded-2xl max-w-2xl">
          <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-4">
            READ-ONLY EXPEDITION LINK
          </div>
          <p className="font-mono text-xs text-white/60 leading-relaxed mb-6">
            Generate an encrypted read-only share link. Anyone with this link can view your itinerary, stops, and transit times without ever viewing your private expenses or budget allocations.
          </p>

          {trip.is_public ? (
            <div className="space-y-4">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full px-4 py-3 bg-black/60 border border-[#E3A008]/50 rounded-xl font-mono text-xs text-[#E3A008] focus:outline-none"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="px-5 py-2.5 bg-[#E3A008] text-black font-mono text-xs font-bold rounded-lg cursor-pointer uppercase"
                >
                  Copy Share Link
                </button>
                <button
                  type="button"
                  onClick={() => onMakePrivate(trip.id)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-lg cursor-pointer uppercase"
                >
                  Revoke & Make Private
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onMakePublic(trip.id)}
              className="px-6 py-3 bg-white text-black hover:bg-[#e2e2e6] font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Generate Tokenized Share Link
            </button>
          )}
        </div>
      )}
    </div>
  );
};
