import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export const CinematicQuote: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const springConfig = { stiffness: 20, damping: 30, mass: 1.5 };
  const rawY = useTransform(scrollYProgress, [0.1, 0.9], [40, -60]);
  const y = useSpring(rawY, springConfig);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.95], [0.2, 1, 1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] py-24 sm:py-36 bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4"
          playsInline
          muted
          loop
          autoPlay
          className="w-full h-full object-cover opacity-35 filter contrast-125 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black pointer-events-none" />
      </div>

      {/* 3D Perspective Quote Container */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 flex flex-col items-center"
        style={{ perspective: '600px' }}
      >
        <div className="font-mono text-xs tracking-[0.25em] text-[#E3A008] uppercase mb-8">
          PHILOSOPHY // 01
        </div>

        <motion.p
          style={{
            y,
            opacity,
            rotateX: 12,
            transformStyle: 'preserve-3d',
          }}
          className="font-mono font-normal text-[19px] sm:text-[26px] md:text-[32px] lg:text-[36px] text-white leading-[1.45] tracking-[-0.02em] select-none text-center"
        >
          An autonomous travel engine engineered to dismantle the friction of human exploration.
          CAY Trips continuously translates group expense variance, seasonal meteorological patterns,
          and budget constraints into absolute mathematical clarity.
        </motion.p>

        <div className="mt-10 flex items-center gap-3">
          <span className="w-12 h-[1px] bg-white/30" />
          <span className="font-mono text-xs text-white/50 tracking-widest uppercase">
            AUTONOMOUS FLIGHT PLANNER
          </span>
          <span className="w-12 h-[1px] bg-white/30" />
        </div>
      </div>
    </section>
  );
};
