import React, { useState } from 'react';
import { Destination } from '../types';

interface AdminSectionProps {
  destinations: Destination[];
  onAddDestination: (d: Partial<Destination>) => Promise<void>;
  onUpdateDestination: (id: number, d: Partial<Destination>) => Promise<void>;
  onDeleteDestination: (id: number) => Promise<void>;
  onBack: () => void;
  formError?: string | null;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  destinations,
  onAddDestination,
  onUpdateDestination,
  onDeleteDestination,
  onBack,
  formError,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  // New Destination Form State
  const [name, setName] = useState('');
  const [avgDaily, setAvgDaily] = useState<number>(3000);
  const [months, setMonths] = useState('10,11,12,1,2,3');
  const [attractions, setAttractions] = useState('');
  const [lat, setLat] = useState<number | ''>('');
  const [lon, setLon] = useState<number | ''>('');
  const [travelName, setTravelName] = useState('');
  const [travelUrl, setTravelUrl] = useState('');
  const [stayName, setStayName] = useState('');
  const [stayUrl, setStayUrl] = useState('');

  // Editing Form State
  const [editName, setEditName] = useState('');
  const [editAvgDaily, setEditAvgDaily] = useState<number>(0);
  const [editMonths, setEditMonths] = useState('');
  const [editAttractions, setEditAttractions] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMonths = months
      .split(',')
      .map((m) => Number(m.trim()))
      .filter((m) => m >= 1 && m <= 12);

    await onAddDestination({
      name,
      avg_daily_budget: avgDaily,
      best_months: parsedMonths,
      attractions,
      latitude: lat === '' ? null : Number(lat),
      longitude: lon === '' ? null : Number(lon),
      travel_provider_name: travelName || null,
      travel_provider_url: travelUrl || null,
      stay_provider_name: stayName || null,
      stay_provider_url: stayUrl || null,
    });

    setName('');
    setAttractions('');
  };

  const startEdit = (d: Destination) => {
    setEditingId(d.id);
    setEditName(d.name);
    setEditAvgDaily(d.avg_daily_budget);
    setEditMonths((d.best_months || []).join(','));
    setEditAttractions(d.attractions || '');
  };

  const handleUpdate = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const parsedMonths = editMonths
      .split(',')
      .map((m) => Number(m.trim()))
      .filter((m) => m >= 1 && m <= 12);

    await onUpdateDestination(id, {
      name: editName,
      avg_daily_budget: editAvgDaily,
      best_months: parsedMonths,
      attractions: editAttractions,
    });
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-24 text-white">
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            MAIN MENU
          </button>
          <span>/</span>
          <span>ADMINISTRATOR PANEL</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          DESTINATION CATALOG ENGINE
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
          Shared catalog powering the recommendation scoring matrix across all connected client nodes.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 rounded-xl font-mono text-xs text-red-300">
          ⚠ {formError}
        </div>
      )}

      {/* Add New Destination Form */}
      <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/15 rounded-2xl mb-12">
        <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-6">
          COMMISSION NEW HUB TO SUPABASE
        </div>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Hub Name (e.g. Kyoto, Japan)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 bg-black border border-white/20 rounded-xl font-mono text-xs text-white"
            />
            <input
              type="number"
              required
              placeholder="Daily Burn Rate (Rs.)"
              value={avgDaily}
              onChange={(e) => setAvgDaily(Number(e.target.value))}
              className="px-3 py-2 bg-black border border-white/20 rounded-xl font-mono text-xs text-white"
            />
            <input
              type="text"
              required
              placeholder="Best Months (e.g. 3,4,10,11)"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="px-3 py-2 bg-black border border-white/20 rounded-xl font-mono text-xs text-white"
            />
          </div>

          <input
            type="text"
            placeholder="Primary Landmarks / Attractions"
            value={attractions}
            onChange={(e) => setAttractions(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-xl font-mono text-xs text-white"
          />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude (for weather)"
              value={lat}
              onChange={(e) => setLat(e.target.value ? Number(e.target.value) : '')}
              className="px-3 py-2 bg-black border border-white/20 rounded-xl font-mono text-xs text-white"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude (for weather)"
              value={lon}
              onChange={(e) => setLon(e.target.value ? Number(e.target.value) : '')}
              className="px-3 py-2 bg-black border border-white/20 rounded-xl font-mono text-xs text-white"
            />
            <input
              type="text"
              placeholder="Flight Partner Name (e.g. IndiGo)"
              value={travelName}
              onChange={(e) => setTravelName(e.target.value)}
              className="px-3 py-2 bg-black border border-white/20 rounded-xl font-mono text-xs text-white"
            />
            <input
              type="text"
              placeholder="Hotel Partner Name"
              value={stayName}
              onChange={(e) => setStayName(e.target.value)}
              className="px-3 py-2 bg-black border border-white/20 rounded-xl font-mono text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
          >
            + ADD HUB TO CATALOG
          </button>
        </form>
      </div>

      {/* Catalog Listing */}
      <div className="space-y-3">
        <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          ACTIVE HUBS IN SUPABASE ({destinations.length})
        </div>

        {destinations.map((d) => (
          <div
            key={d.id}
            className="p-4 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
          >
            {editingId === d.id ? (
              <form onSubmit={(e) => handleUpdate(e, d.id)} className="w-full space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-2 py-1 bg-black border border-white/20 rounded text-white"
                  />
                  <input
                    type="number"
                    value={editAvgDaily}
                    onChange={(e) => setEditAvgDaily(Number(e.target.value))}
                    className="px-2 py-1 bg-black border border-white/20 rounded text-white"
                  />
                  <input
                    type="text"
                    value={editMonths}
                    onChange={(e) => setEditMonths(e.target.value)}
                    className="px-2 py-1 bg-black border border-white/20 rounded text-white"
                  />
                </div>
                <input
                  type="text"
                  value={editAttractions}
                  onChange={(e) => setEditAttractions(e.target.value)}
                  className="w-full px-2 py-1 bg-black border border-white/20 rounded text-white"
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-3 py-1 bg-[#E3A008] text-black font-bold rounded">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-white/10 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <span className="font-bold text-white block text-sm">{d.name}</span>
                  <span className="text-white/50 text-[11px] mt-0.5 block">
                    Rs.{d.avg_daily_budget}/day · Months: {(d.best_months || []).join(', ')}
                  </span>
                  <span className="text-white/40 text-[11px] block mt-0.5">{d.attractions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(d)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteDestination(d.id)}
                    className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
