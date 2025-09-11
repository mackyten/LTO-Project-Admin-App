import React from "react";

const BackgroundSVG: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    viewBox="0 0 1200 800"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full object-cover -z-10"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      {/* Gradient definitions using your colors */}
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1a2e" stopOpacity={1} />
        <stop offset="100%" stopColor="#16213e" stopOpacity={1} />
      </linearGradient>

      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#16213e" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#0f3460" stopOpacity={0.9} />
      </linearGradient>

      <linearGradient id="grad3" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0f3460" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#1a1a2e" stopOpacity={0.6} />
      </linearGradient>

      <radialGradient id="radial1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0f3460" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#16213e" stopOpacity={0.8} />
      </radialGradient>
    </defs>

    {/* Base background */}
    <rect width="1200" height="800" fill="#1a1a2e" />

    {/* Large flowing shape */}
    <path
      d="M0,200 Q300,100 600,250 T1200,200 L1200,600 Q900,500 600,550 T0,500 Z"
      fill="url(#grad1)"
    />

    {/* Organic blob shape */}
    <ellipse
      cx="300"
      cy="150"
      rx="200"
      ry="100"
      transform="rotate(-20 300 150)"
      fill="url(#grad2)"
    />

    {/* Curved abstract shape */}
    <path
      d="M800,0 Q1000,150 1200,100 L1200,400 Q1000,250 800,300 Q700,200 800,0"
      fill="url(#grad3)"
    />

    {/* Circular accent */}
    <circle cx="950" cy="600" r="150" fill="url(#radial1)" />

    {/* Flowing bottom element */}
    <path
      d="M0,600 Q200,650 400,600 T800,650 Q1000,600 1200,650 L1200,800 L0,800 Z"
      fill="#16213e"
      opacity={0.8}
    />

    {/* Small accent shapes */}
    <ellipse
      cx="150"
      cy="400"
      rx="80"
      ry="40"
      transform="rotate(45 150 400)"
      fill="#0f3460"
      opacity={0.6}
    />
    <ellipse
      cx="1050"
      cy="300"
      rx="60"
      ry="120"
      transform="rotate(-30 1050 300)"
      fill="#0f3460"
      opacity={0.5}
    />

    {/* Subtle geometric accent */}
    <polygon
      points="500,50 550,100 500,150 450,100"
      fill="#16213e"
      opacity={0.7}
    />
  </svg>
);

export default BackgroundSVG;
