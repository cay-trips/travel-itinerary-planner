import React, { useState } from 'react';
import { Trip, SplitPerson } from '../types';

interface SplitCostModalProps {
  trip: Trip;
  onClose: () => void;
}

export const SplitCostModal: React.FC<SplitCostModalProps> = ({ trip, onClose }) => {
  const [namesInput, setNamesInput] = useState('');
  const [splitResult, setSplitResult] = useState<SplitPerson[] | null>(null);

  const total = (trip.expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);

  const fmt = (n: number) =>
    'Rs. ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const names = namesInput
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    const share = names.length ? total / names.length : 0;
    const paidMap: Record<string, number> = {};
    (trip.expenses || []).forEach((e) => {
      paidMap[e.paid_by] = (paidMap[e.paid_by] || 0) + Number(e.amount);
    });

    const calculated: SplitPerson[] = names.map((name) => {
      const paid = paidMap[name] || 0;
      const balance = paid - share;
      const status =
        Math.abs(balance) < 0.01 ? 'settled' : balance > 0 ? 'gets_back' : 'owes';
      return { name, paid, share, balance, status };
    });

    setSplitResult(calculated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0A0D14] border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
          <div>
            <span className="font-mono text-xs text-[#E3A008] uppercase tracking-widest block">
              DEBT RESOLUTION MATRIX
            </span>
            <h2 className="font-mono text-xl font-bold uppercase mt-1">
              Split Cost: {trip.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white font-mono text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-white/[0.02] border border-white/10 rounded-xl font-mono text-xs flex justify-between">
          <span className="text-white/50">TOTAL EXPENSES LOGGED:</span>
          <strong className="text-white">{fmt(total)}</strong>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-white/70 uppercase mb-2">
              Traveler Names (Comma Separated)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aarush, Priya, Rohit, Maya"
              value={namesInput}
              onChange={(e) => setNamesInput(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
          >
            CALCULATE EQUAL SHARE SETTLEMENT
          </button>
        </form>

        {splitResult && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <div className="font-mono text-xs text-white/50 mb-3">
              EQUAL SHARE BURDEN: <strong className="text-white">{fmt(total / splitResult.length)}</strong> PER PERSON
            </div>

            <div className="space-y-2">
              {splitResult.map((p) => (
                <div
                  key={p.name}
                  className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between font-mono text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-white/40 text-[10px]">Contributed: {fmt(p.paid)}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'owes'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : p.status === 'gets_back'
                          ? 'bg-[#2F6F62]/30 text-[#4EAA98] border border-[#2F6F62]/50'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {p.status === 'owes'
                        ? `Owes ${fmt(Math.abs(p.balance))}`
                        : p.status === 'gets_back'
                        ? `Reimburse ${fmt(p.balance)}`
                        : 'Settled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
