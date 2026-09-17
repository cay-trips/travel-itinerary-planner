import React from 'react';
import { motion } from 'motion/react';

export const ArchitectureSection: React.FC = () => {
  const layers = [
    {
      num: 'LAYER 01',
      title: 'TELEMETRY & GEODATA',
      desc: 'Open-Meteo live weather, atmospheric codes, and coordinates.',
    },
    {
      num: 'LAYER 02',
      title: 'SEASONAL BUDGET SCORER',
      desc: 'Multi-factor alignment across daily burn, duration, and month.',
    },
    {
      num: 'LAYER 03',
      title: 'GROUP SETTLEMENT & HANDSHAKE',
      desc: 'Debt resolution matrix + zero-markup booking redirection.',
    },
  ];

  return (
    <section className="relative w-full py-28 px-6 bg-black text-white flex flex-col items-center border-t border-white/10">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono text-xs tracking-[0.25em] text-[#E3A008] uppercase mb-6"
        >
          CORE ARCHITECTURE
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-mono text-[clamp(28px,5vw,52px)] font-light tracking-[-0.03em] leading-tight mb-8"
        >
          Three layers. Zero friction.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-mono text-sm sm:text-base text-white/60 leading-relaxed max-w-xl mx-auto mb-16"
        >
          Raw meteorological streams are ingested. Algorithmic budget models isolate the optimal destinations.
          The interface layer coordinates group debts and dispatches booking receipts.
        </motion.p>

        {/* Layer Cards */}
        <div className="w-full max-w-lg flex flex-col gap-4">
          {layers.map((l, i) => (
            <motion.div
              key={l.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
              className="w-full h-auto sm:h-[84px] py-4 px-6 border border-white/15 bg-white/[0.03] backdrop-blur-md rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left transition-all"
            >
              <div>
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#E3A008] block">
                  {l.num}
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                  {l.title}
                </span>
              </div>
              <span className="font-mono text-xs text-white/50 max-w-xs text-left sm:text-right">
                {l.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
