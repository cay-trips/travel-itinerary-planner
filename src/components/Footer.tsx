import React from 'react';
import { CayLogo } from './CayLogo';
import { ScreenType } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-black border-t border-white/10 overflow-hidden text-white">
      <div className="w-full flex flex-col md:flex-row min-h-[420px]">
        {/* Left: Cinematic Flight Telemetry Video */}
        <div className="relative w-full md:w-1/2 h-[260px] md:h-auto overflow-hidden">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4"
            playsInline
            muted
            loop
            autoPlay
            className="w-full h-full object-cover opacity-60 filter contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-black" />
          <div className="absolute bottom-6 left-6 font-mono text-[11px] tracking-widest text-[#E3A008] uppercase bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
            FLIGHT RADAR · CAY GLOBAL TELEMETRY
          </div>
        </div>

        {/* Right: Brand, Navigation & Legal */}
        <div className="w-full md:w-1/2 p-8 sm:p-14 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CayLogo size={24} className="text-[#E3A008]" />
              <span className="font-mono text-lg font-bold tracking-tight">CAY TRIPS</span>
            </div>

            <p className="font-mono text-xs sm:text-sm text-white/50 leading-relaxed max-w-md mb-8">
              The autonomous travel intelligence engine. Built for those who demand
              accurate budget forecasts, fair group split economics, and real-time flight telemetry.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs text-white/70">
              <button
                type="button"
                onClick={() => onNavigate('trips')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // MY TRIPS
              </button>
              <button
                type="button"
                onClick={() => onNavigate('recommend')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // RECOMMEND
              </button>
              <button
                type="button"
                onClick={() => onNavigate('exploreGlobal')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // EXPLORE CITIES
              </button>
              <button
                type="button"
                onClick={() => onNavigate('quiz')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // INSPIRATION QUIZ
              </button>
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // ABOUT
              </button>
              <button
                type="button"
                onClick={() => onNavigate('founders')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // FOUNDERS
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // CONTACT
              </button>
              <button
                type="button"
                onClick={() => onNavigate('privacy')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // PRIVACY
              </button>
              <button
                type="button"
                onClick={() => onNavigate('terms')}
                className="text-left hover:text-[#E3A008] transition-colors cursor-pointer"
              >
                // TERMS
              </button>
            </div>
          </div>

          <div className="font-mono text-[11px] text-white/30 tracking-wider mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-2">
            <span>© 2026 CAY TRIPS LABS. ALL RIGHTS RESERVED.</span>
            <span>POWERED BY SUPABASE POSTGRES</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
