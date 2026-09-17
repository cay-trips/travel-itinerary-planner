import React, { useState } from 'react';
import { Trip } from '../types';

interface AddExpenseModalProps {
  trip: Trip;
  onClose: () => void;
  onAddExpense: (data: {
    category: string;
    description: string;
    amount: number;
    paid_by: string;
    expense_date: string;
  }) => Promise<void>;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  trip,
  onClose,
  onAddExpense,
}) => {
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !paidBy.trim()) return;
    setLoading(true);
    try {
      await onAddExpense({
        category,
        description: description.trim(),
        amount: Number(amount),
        paid_by: paidBy.trim(),
        expense_date: date,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0A0D14] border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
          <div>
            <span className="font-mono text-xs text-[#E3A008] uppercase tracking-widest block">
              LOG DISBURSEMENT
            </span>
            <h2 className="font-mono text-xl font-bold uppercase mt-1">
              Add Expense
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-white/70 uppercase mb-2">
              Expense Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
            >
              <option>Food</option>
              <option>Stay</option>
              <option>Transport</option>
              <option>Sightseeing</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase mb-2">
              Item Description
            </label>
            <input
              type="text"
              placeholder="e.g. Airport shuttle or bistro dinner"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                Amount (Rs.)
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                placeholder="2500"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase mb-2">
                Paid By
              </label>
              <input
                type="text"
                required
                placeholder="Traveler name"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase mb-2">
              Transaction Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl font-mono text-xs text-white focus:border-[#E3A008] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? 'COMMITTING...' : 'COMMIT DISBURSEMENT TO SUPABASE'}
          </button>
        </form>
      </div>
    </div>
  );
};
