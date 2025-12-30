/**
 * Parallax Geometric Shapes
 *
 * SVG components for parallax background effects
 * These can be used directly or exported as PNGs
 */

import React from 'react';

interface ParallaxShapeProps {
  className?: string;
  opacity?: number;
}

/**
 * Large gradient blob - moves slowly (far background)
 */
export const GradientBlob: React.FC<ParallaxShapeProps> = ({
  className = '',
  opacity = 0.3
}) => (
  <svg
    width="1000"
    height="1000"
    viewBox="0 0 1000 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    <path
      d="M500,167 C667,83 833,250 917,417 C1000,583 917,750 750,833 C583,917 417,833 333,667 C250,500 333,250 500,167 Z"
      fill="url(#blob-gradient)"
    />
  </svg>
);

/**
 * Medium circle cluster - moves at medium speed (mid background)
 * Irregular, scattered pattern
 */
export const CircleCluster: React.FC<ParallaxShapeProps> = ({
  className = '',
  opacity = 0.35
}) => (
  <svg
    width="400"
    height="400"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <circle cx="85" cy="120" r="38" fill="#3b82f6" fillOpacity="0.5" />
    <circle cx="220" cy="95" r="28" fill="#4f46e5" fillOpacity="0.45" />
    <circle cx="310" cy="185" r="42" fill="#2563eb" fillOpacity="0.5" />
    <circle cx="140" cy="270" r="22" fill="#3b82f6" fillOpacity="0.5" />
    <circle cx="265" cy="315" r="33" fill="#4f46e5" fillOpacity="0.45" />
    <circle cx="175" cy="340" r="19" fill="#2563eb" fillOpacity="0.5" />
    <circle cx="50" cy="280" r="26" fill="#3b82f6" fillOpacity="0.45" />
  </svg>
);

/**
 * Alternative circle cluster configuration - different arrangement
 */
export const CircleClusterAlt: React.FC<ParallaxShapeProps> = ({
  className = '',
  opacity = 0.35
}) => (
  <svg
    width="400"
    height="400"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <circle cx="50" cy="80" r="35" fill="#4f46e5" fillOpacity="0.5" />
    <circle cx="180" cy="120" r="40" fill="#2563eb" fillOpacity="0.5" />
    <circle cx="320" cy="180" r="28" fill="#3b82f6" fillOpacity="0.5" />
    <circle cx="100" cy="280" r="32" fill="#4f46e5" fillOpacity="0.45" />
    <circle cx="280" cy="320" r="38" fill="#2563eb" fillOpacity="0.5" />
    <circle cx="200" cy="50" r="22" fill="#3b82f6" fillOpacity="0.45" />
  </svg>
);

/**
 * Small floating dots - move faster (near background)
 */
export const FloatingDots: React.FC<ParallaxShapeProps> = ({
  className = '',
  opacity = 0.4
}) => (
  <svg
    width="300"
    height="300"
    viewBox="0 0 300 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <circle cx="50" cy="50" r="4" fill="#3b82f6" fillOpacity="0.7" />
    <circle cx="150" cy="80" r="3" fill="#4f46e5" fillOpacity="0.65" />
    <circle cx="250" cy="120" r="5" fill="#2563eb" fillOpacity="0.7" />
    <circle cx="80" cy="180" r="4" fill="#3b82f6" fillOpacity="0.7" />
    <circle cx="200" cy="220" r="3" fill="#4f46e5" fillOpacity="0.65" />
    <circle cx="120" cy="260" r="4" fill="#2563eb" fillOpacity="0.7" />
  </svg>
);

/**
 * Abstract wave pattern - moves slowly
 */
export const WavePattern: React.FC<ParallaxShapeProps> = ({
  className = '',
  opacity = 0.25
}) => (
  <svg
    width="800"
    height="200"
    viewBox="0 0 800 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
        <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    <path
      d="M0,100 Q200,50 400,100 T800,100 L800,200 L0,200 Z"
      fill="url(#wave-gradient)"
    />
    <path
      d="M0,150 Q200,120 400,150 T800,150 L800,200 L0,200 Z"
      fill="url(#wave-gradient)"
      fillOpacity="0.6"
    />
  </svg>
);

/**
 * Hexagon grid pattern - subtle background texture
 */
export const HexagonGrid: React.FC<ParallaxShapeProps> = ({
  className = '',
  opacity = 0.2
}) => (
  <svg
    width="400"
    height="400"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <pattern id="hex-pattern" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
        <polygon
          points="50,0 93,25 93,75 50,100 7,75 7,25"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#hex-pattern)" />
  </svg>
);
