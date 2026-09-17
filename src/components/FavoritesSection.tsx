import React from 'react';
import { Destination } from '../types';

interface FavoritesSectionProps {
  favorites: Destination[];
  onToggleFavorite: (id: number) => Promise<void>;
  onBack: () => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favorites,
  onToggleFavorite,
  onBack,
}) => {
  const fmt = (n: number) =>
    'Rs. ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-24 text-white">
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            MAIN MENU
          </button>
          <span>/</span>
          <span>BOOKMARKS</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          SAVED DESTINATIONS
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
          Curated destinations pinned from autonomous recommendations.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="p-16 border border-dashed border-white/15 rounded-2xl text-center font-mono">
          <span className="text-[#E3A008] text-xs uppercase tracking-widest block mb-2">
            NO SAVED DESTINATIONS
          </span>
          <p className="text-white/40 text-xs max-w-sm mx-auto">
            Click the heart icon on any destination recommendation to archive it to this list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((d) => (
            <div
              key={d.id}
              className="p-6 bg-white/[0.03] border border-white/15 rounded-2xl flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#E3A008] uppercase">
                    DESTINATION #{d.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(d.id)}
                    className="text-red-400 hover:text-white text-base cursor-pointer"
                  >
                    ❤️
                  </button>
                </div>
                <h3 className="font-mono text-xl font-bold text-white mt-2">{d.name}</h3>
                <p className="font-mono text-xs text-white/60 mt-1 leading-relaxed">
                  {d.attractions || 'Cultural corridors, historic centers, and natural trails.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center font-mono text-xs text-white/50">
                <span>BURN RATE: {fmt(d.avg_daily_budget)}/DAY</span>
                <span>MONTHS: {(d.best_months || []).join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
