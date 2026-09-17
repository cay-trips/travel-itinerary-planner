import React from 'react';

interface CayLogoProps {
  className?: string;
  size?: number;
}

export const CayLogo: React.FC<CayLogoProps> = ({ className = 'w-5 h-5', size = 20 }) => {
  const pathD = "M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z";

  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <g opacity="0.95">
        <path d={pathD} transform="rotate(0)" />
        <path d={pathD} transform="rotate(90)" />
        <path d={pathD} transform="rotate(180)" />
        <path d={pathD} transform="rotate(270)" />
      </g>
      {/* Central avionics compass needle */}
      <circle cx="0" cy="0" r="4" fill="#E3A008" />
    </svg>
  );
};
