import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CayLogo } from './CayLogo';
import { SquashHamburger } from './SquashHamburger';
import { ScrambleText } from './ScrambleText';
import { Profile, ScreenType } from '../types';

interface NavbarProps {
  user: any;
  profile: Profile | null;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  profile,
  currentScreen,
  onNavigate,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks: { label: string; screen: ScreenType }[] = [
    { label: 'TRIPS', screen: 'trips' },
    { label: 'RECOMMEND', screen: 'recommend' },
    { label: 'EXPLORE', screen: 'exploreGlobal' },
    { label: 'BOOKINGS', screen: 'myBookings' },
    { label: 'SAVED', screen: 'favorites' },
    { label: 'QUIZ', screen: 'quiz' },
  ];

  if (profile?.is_admin) {
    navLinks.push({ label: 'ADMIN', screen: 'admin' });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
      {/* Left Navigation Group */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Logo Capsule */}
        <motion.button
          type="button"
          onClick={() => onNavigate('home')}
          className="h-11 sm:h-12 px-4 sm:px-5 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/15 rounded-[14px] flex items-center gap-2.5 text-white transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CayLogo size={20} className="text-[#E3A008]" />
          <span className="font-mono text-sm sm:text-base font-bold tracking-tight uppercase">
            CAY TRIPS
          </span>
          <span className="hidden md:inline-block font-mono text-[10px] tracking-widest text-[#E3A008] border border-[#E3A008]/40 px-1.5 py-0.5 rounded ml-1">
            v2.4
          </span>
        </motion.button>

        {/* Expanding Capsule Menu */}
        <motion.div
          className="h-11 sm:h-12 bg-white/10 backdrop-blur-md border border-white/15 rounded-[14px] flex items-center overflow-hidden"
          animate={{
            width: isMenuOpen ? 'auto' : '48px',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          <div className="flex-shrink-0 w-12 h-full flex items-center justify-center">
            <SquashHamburger
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 hover:bg-white/10 transition-colors"
            />
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 sm:gap-2 px-2 pr-4 overflow-x-auto whitespace-nowrap"
              >
                {navLinks.map((item) => (
                  <button
                    key={item.screen}
                    type="button"
                    onClick={() => {
                      onNavigate(item.screen);
                      setIsMenuOpen(false);
                    }}
                    onMouseEnter={() => setHoveredLink(item.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`px-2.5 py-1 font-mono text-xs sm:text-[13px] tracking-wider rounded-md transition-all cursor-pointer ${
                      currentScreen === item.screen
                        ? 'bg-[#E3A008] text-black font-bold'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <ScrambleText
                      text={item.label}
                      isHovered={hoveredLink === item.label}
                    />
                  </button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right Action Group */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {user ? (
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => onNavigate('trips')}
              onMouseEnter={() => setHoveredLink('NEW_TRIP')}
              onMouseLeave={() => setHoveredLink(null)}
              className="h-11 sm:h-12 px-4 sm:px-6 bg-white hover:bg-[#e2e2e6] text-black font-mono text-xs sm:text-[13px] font-bold tracking-wider uppercase rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="w-2 h-2 rounded-full bg-[#2F6F62] animate-pulse" />
              <ScrambleText
                text="PLAN TRIP"
                isHovered={hoveredLink === 'NEW_TRIP'}
              />
            </motion.button>

            <button
              type="button"
              onClick={onLogout}
              title="Log out"
              className="h-11 sm:h-12 px-3 sm:px-4 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 rounded-full font-mono text-xs text-white/70 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <motion.button
            type="button"
            onClick={() => onNavigate('login')}
            onMouseEnter={() => setHoveredLink('SIGN_IN')}
            onMouseLeave={() => setHoveredLink(null)}
            className="h-11 sm:h-12 px-5 sm:px-7 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(227,160,8,0.3)] transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <i className="bi bi-person-fill text-sm" />
            <ScrambleText
              text="SIGN IN"
              isHovered={hoveredLink === 'SIGN_IN'}
            />
          </motion.button>
        )}
      </div>
    </header>
  );
};
