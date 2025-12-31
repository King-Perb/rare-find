/**
 * Parallax Theme Icons
 *
 * SVG icons related to the Rare Find theme (bargain detection, collectibles)
 * These can be used for parallax effects and exported as PNGs
 */

import React from 'react';

interface ParallaxIconProps {
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
}

/**
 * Magnifying glass icon - core theme
 */
export const MagnifyingGlass: React.FC<ParallaxIconProps> = ({
  className = '',
  size = 80,
  opacity = 0.35,
  color = '#3b82f6'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" fill="none" />
    <path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Price tag icon - bargain theme
 */
export const PriceTag: React.FC<ParallaxIconProps> = ({
  className = '',
  size = 80,
  opacity = 0.35,
  color = '#16a34a'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <path
      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <circle cx="7" cy="7" r="1.5" fill={color} />
  </svg>
);

/**
 * Coin/currency icon - value theme
 */
export const Coin: React.FC<ParallaxIconProps> = ({
  className = '',
  size = 80,
  opacity = 0.35,
  color = '#ca8a04'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M12 6v12M9 9h6M9 15h6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Sparkle/star icon - highlight/deal theme
 */
export const Sparkle: React.FC<ParallaxIconProps> = ({
  className = '',
  size = 80,
  opacity = 0.4,
  color = '#4f46e5'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <path
      d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2L12 16.8l-6 4.8 2.4-7.2-6-4.8h7.6L12 2z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

/**
 * Trending up arrow - market value theme
 */
export const TrendingUp: React.FC<ParallaxIconProps> = ({
  className = '',
  size = 80,
  opacity = 0.35,
  color = '#2563eb'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <path
      d="M23 6l-9.5 9.5-5-5L1 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 6h6v6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Shield icon - trust/confidence theme
 */
export const Shield: React.FC<ParallaxIconProps> = ({
  className = '',
  size = 80,
  opacity = 0.35,
  color = '#3b82f6'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <path
      d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);
