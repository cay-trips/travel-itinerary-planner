import React, { useState } from 'react';
import { Destination } from '../types';

interface QuizSectionProps {
  destinations: Destination[];
  onBack: () => void;
  onGoToRecommend: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  destinations,
  onBack,
  onGoToRecommend,
}) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matchedDest, setMatchedDest] = useState<Destination | null>(null);

  const questions = [
    {
      key: 'vibe',
      title: 'PRIMARY EXPEDITION VIBE',
      options: [
        { label: 'COASTLINE & ISLAND DRIFT', value: 'beach' },
        { label: 'HIGH-ALTITUDE ALPINE & ADVENTURE', value: 'mountain' },
        { label: 'METROPOLITAN NIGHTS & CULTURAL HUBS', value: 'city' },
      ],
    },
    {
      key: 'budget',
      title: 'PROJECTED DAILY ALLOCATION',
      options: [
        { label: 'LEAN EXPEDITION (< RS.2,500/DAY)', value: 'low' },
        { label: 'BALANCED RANGE (RS.2,500 - 5,000/DAY)', value: 'mid' },
        { label: 'PREMIUM LUXURY (RS.5,000+/DAY)', value: 'high' },
      ],
    },
    {
      key: 'company',
      title: 'EXPEDITION MANIFEST CREW',
      options: [
        { label: 'SOLO TRAVELER', value: 'solo' },
        { label: 'DUO / PARTNER', value: 'duo' },
        { label: 'SYNDICATE / GROUP EXPEDITION', value: 'group' },
      ],
    },
  ];

  const handleSelectOption = (key: string, val: string) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Pick matching destination
      const budgetRanges: Record<string, [number, number]> = {
        low: [0, 2500],
        mid: [2500, 5000],
        high: [5000, 999999],
      };
      const [min, max] = budgetRanges[updated.budget] || [0, 999999];

      let filtered = destinations.filter(
        (d) => Number(d.avg_daily_budget) >= min && Number(d.avg_daily_budget) <= max
      );
      if (filtered.length === 0) filtered = destinations;

      const vibeKeywords: Record<string, string[]> = {
        beach: ['beach', 'sea', 'island', 'coral', 'coast', 'water'],
        mountain: ['mountain', 'valley', 'snow', 'trek', 'pass', 'hill'],
        city: ['temple', 'museum', 'market', 'palace', 'heritage', 'city'],
      };
      const keys = vibeKeywords[updated.vibe] || [];

      let chosen = filtered.find((d) => {
        const text = (d.attractions || '').toLowerCase();
        return keys.some((k) => text.includes(k));
      });

      if (!chosen && filtered.length > 0) {
        chosen = filtered[Math.floor(Math.random() * filtered.length)];
      }

      setMatchedDest(chosen || null);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setMatchedDest(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-24 text-white">
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E3A008] tracking-widest uppercase mb-2">
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            MAIN MENU
          </button>
          <span>/</span>
          <span>INSPIRATION TELEMETRY</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-5xl font-normal tracking-tight uppercase">
          EXPEDITION INSPIRATION QUIZ
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 mt-2">
          Three rapid telemetry checks to determine your optimal expedition alignment.
        </p>
      </div>

      {matchedDest ? (
        <div className="p-8 bg-white/[0.03] border border-white/20 rounded-2xl space-y-6">
          <div className="font-mono text-xs text-[#E3A008] tracking-widest uppercase">
            // ALIGNED EXPEDITION DESTINATION
          </div>
          <div>
            <h2 className="font-mono text-3xl sm:text-4xl font-normal text-white">
              {matchedDest.name}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-white/60 leading-relaxed mt-2 max-w-xl">
              {matchedDest.attractions || 'Ideal cultural hubs, local gastronomy, and outdoor expeditions.'}
            </p>
            <div className="font-mono text-xs text-[#E3A008] mt-3">
              AVERAGE BURN: Rs.{matchedDest.avg_daily_budget} / DAY / TRAVELER
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10 flex-wrap">
            <button
              type="button"
              onClick={onGoToRecommend}
              className="px-6 py-3 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              RUN PRECISE BUDGET SCORER →
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white/[0.03] border border-white/20 rounded-2xl max-w-xl">
          <div className="flex justify-between font-mono text-xs text-white/40 mb-6">
            <span>QUESTION 0{step + 1} OF 0{questions.length}</span>
            <span className="text-[#E3A008]">{questions[step].title}</span>
          </div>

          <div className="space-y-3">
            {questions[step].options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectOption(questions[step].key, opt.value)}
                className="w-full p-4 bg-black/60 hover:bg-white/10 border border-white/15 hover:border-[#E3A008] rounded-xl text-left font-mono text-xs sm:text-sm font-bold tracking-wide text-white transition-all cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
