import React from 'react';
import { motion } from 'motion/react';

export const MetricsSection: React.FC = () => {
  const metrics = [
    {
      value: '0%',
      label: 'HIDDEN FEES & MARKUPS',
      sub: 'Direct partner handshakes with zero commission padding.',
    },
    {
      value: '99.8%',
      label: 'METEOROLOGICAL ACCURACY',
      sub: 'Live Open-Meteo telemetry across every global coordinate.',
    },
    {
      value: '<120ms',
      label: 'EXPENSE SETTLEMENT SPEED',
      sub: 'Algorithmic debt reconciliation for groups of any scale.',
    },
  ];

  return (
    <section className="relative w-full min-h-[80vh] py-28 px-6 bg-black flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4"
          playsInline
          muted
          loop
          autoPlay
          className="w-full h-full object-cover opacity-25 filter contrast-125 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono text-xs sm:text-[13px] tracking-[0.25em] text-[#E3A008] uppercase mb-16 text-center"
        >
          TELEMETRY // PERFORMANCE BENCHMARKS
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full">
          {metrics.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="flex flex-col items-center md:items-start text-center md:text-left border-t border-white/15 pt-6"
            >
              <span className="font-mono font-light text-[clamp(48px,8vw,80px)] text-white tracking-[-0.04em] leading-none">
                {m.value}
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-white/90 mt-4 tracking-wider uppercase">
                {m.label}
              </span>
              <span className="font-mono text-xs text-white/50 mt-2 leading-relaxed max-w-xs">
                {m.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
