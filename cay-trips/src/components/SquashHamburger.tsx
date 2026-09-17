import React from 'react';
import { motion } from 'motion/react';

interface SquashHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const SquashHamburger: React.FC<SquashHamburgerProps> = ({
  isOpen,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle navigation menu"
      className={`relative flex items-center justify-center p-2 focus:outline-none ${className}`}
    >
      <div className="relative w-[18px] h-[12px] sm:w-[18px] sm:h-[12px]">
        {/* Top bar */}
        <motion.span
          className="absolute left-0 w-full h-[1.5px] bg-white rounded-full"
          animate={{
            top: isOpen ? '5px' : '0px',
            rotate: isOpen ? 45 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
        {/* Middle bar */}
        <motion.span
          className="absolute left-0 top-[5px] w-full h-[1.5px] bg-white rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.2 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
        {/* Bottom bar */}
        <motion.span
          className="absolute left-0 w-full h-[1.5px] bg-white rounded-full"
          animate={{
            top: isOpen ? '5px' : '10px',
            rotate: isOpen ? -45 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
    </button>
  );
};
