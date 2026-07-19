/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface DegreeLogoProps {
  id: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const DegreeLogo: React.FC<DegreeLogoProps> = ({ id, className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-36 w-36"
  };

  const selectedSize = sizeClasses[size];

  switch (id) {
    case "MBBS":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-2 shadow-inner ${selectedSize} ${className}`}>
          {/* Glowing aura */}
          <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-md -z-10 animate-pulse"></div>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            {/* Elegant Shield Outline */}
            <path d="M50 12 L82 22 V50 C82 68 68 83 50 88 C32 83 18 68 18 50 V22 L50 12 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(255,255,255,0.08)" />
            {/* Glowing Golden Accents */}
            <circle cx="50" cy="50" r="30" stroke="#FFD700" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            {/* Rod of Asclepius (Central Staff with Serpent) */}
            <line x1="50" y1="25" x2="50" y2="72" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            {/* Asclepius Snake winding around staff */}
            <path d="M42 64 C48 64 54 60 50 54 C46 48 42 46 50 40 C58 34 52 30 46 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Floating Stars of Academic Excellence */}
            <path d="M28 35 L30 38 L34 38 L31 40 L32 44 L28 41 L24 44 L25 40 L22 38 L26 38 Z" fill="#FFD700" opacity="0.9" />
            <path d="M72 35 L74 38 L78 38 L75 40 L76 44 L72 41 L68 44 L69 40 L66 38 L70 38 Z" fill="#FFD700" opacity="0.9" />
            {/* Crossed DNA double helix background detail */}
            <path d="M38 52 Q50 48 62 52" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            <path d="M38 56 Q50 60 62 56" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            {/* Small decorative stethoscope loop at bottom */}
            <path d="M36 68 C36 78 64 78 64 68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>
      );

    case "BAMS":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-2 shadow-inner ${selectedSize} ${className}`}>
          <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-md -z-10 animate-pulse"></div>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            {/* Traditional Indian Mandala Border */}
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="35" stroke="#A7F3D0" strokeWidth="0.75" strokeDasharray="2 2" />
            {/* Sacred Lotus Base petal outline */}
            <path d="M30 65 C40 78 60 78 70 65 C60 68 40 68 30 65 Z" fill="#A7F3D0" opacity="0.25" />
            <path d="M50 78 C53 73 57 73 50 64 C43 73 47 73 50 78 Z" fill="#A7F3D0" opacity="0.4" />
            {/* Mortar & Pestle (Traditional Ayurvedic Prep) */}
            <path d="M32 45 C32 58 68 58 68 45 H32 Z" fill="rgba(255,255,255,0.15)" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <line x1="38" y1="56" x2="62" y2="56" stroke="currentColor" strokeWidth="1.5" />
            {/* Angled Pestle */}
            <path d="M60 25 L40 50 L45 54 L65 29 Z" fill="#FFD700" stroke="#FFD700" strokeWidth="1" />
            {/* Emerging Ayurvedic Tulsi/Neem Healing Herbs */}
            <path d="M50 42 C45 35 38 35 44 26 C50 35 48 35 50 42 Z" fill="#A7F3D0" stroke="currentColor" strokeWidth="1.5" />
            <path d="M50 42 C55 35 62 35 56 26 C50 35 52 35 50 42 Z" fill="#A7F3D0" stroke="currentColor" strokeWidth="1.5" />
            {/* Dynamic Herb Dew Drop */}
            <circle cx="50" cy="20" r="2.5" fill="#FFD700" />
          </svg>
        </div>
      );

    case "BHMS":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 p-2 shadow-inner ${selectedSize} ${className}`}>
          <div className="absolute inset-0 bg-teal-400/20 rounded-2xl blur-md -z-10 animate-pulse"></div>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            {/* Crystalline Water Structure Backdrop */}
            <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="rgba(255,255,255,0.05)" />
            <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" stroke="#99F6E4" strokeWidth="0.75" strokeDasharray="3 2" />
            {/* Balance Scale (Representing Homeopathic Dilution/Equilibrium) */}
            <line x1="50" y1="28" x2="50" y2="72" stroke="#FFD700" strokeWidth="2.5" />
            <line x1="30" y1="36" x2="70" y2="36" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            {/* Left Pan */}
            <line x1="30" y1="36" x2="24" y2="54" stroke="currentColor" strokeWidth="1" />
            <line x1="30" y1="36" x2="36" y2="54" stroke="currentColor" strokeWidth="1" />
            <path d="M22 54 C22 58 38 58 38 54 H22 Z" fill="rgba(255,255,255,0.2)" stroke="currentColor" strokeWidth="1.5" />
            {/* Right Pan */}
            <line x1="70" y1="36" x2="64" y2="54" stroke="currentColor" strokeWidth="1" />
            <line x1="70" y1="36" x2="76" y2="54" stroke="currentColor" strokeWidth="1" />
            <path d="M62 54 C62 58 78 58 78 54 H62 Z" fill="rgba(255,255,255,0.2)" stroke="currentColor" strokeWidth="1.5" />
            {/* Central Potentized Water Droplet */}
            <path d="M50 38 C44 48 44 56 50 56 C56 56 56 48 50 38 Z" fill="#99F6E4" stroke="currentColor" strokeWidth="1.5" />
            {/* Hahnemann's Similia Emblem Star */}
            <polygon points="50,60 52,65 57,65 53,68 55,73 50,70 45,73 47,68 43,65 48,65" fill="#FFD700" />
          </svg>
        </div>
      );

    case "BPT":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-2 shadow-inner ${selectedSize} ${className}`}>
          <div className="absolute inset-0 bg-orange-400/20 rounded-2xl blur-md -z-10 animate-pulse"></div>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            {/* Geometric Kinetic Motion Rays */}
            <circle cx="50" cy="50" r="36" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <path d="M50 14 A36 36 0 0 1 86 50" stroke="#FFE4E6" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 4" />
            {/* Simplified Human Spine (Leverage of Physical Motion) */}
            <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="50" y1="22" x2="50" y2="74" />
              {/* Vertebrae ribs / kinetic forces */}
              <path d="M40 30 Q50 26 60 30" stroke="#FED7AA" />
              <path d="M38 38 Q50 34 62 38" />
              <path d="M36 46 Q50 42 64 46" stroke="#FED7AA" />
              <path d="M35 54 Q50 50 65 54" />
              <path d="M36 62 Q50 58 64 62" stroke="#FED7AA" />
              <path d="M38 70 Q50 66 62 70" />
            </g>
            {/* Joint Range of Motion Circles (Goniometry) */}
            <circle cx="50" cy="38" r="4" fill="#FFD700" />
            <circle cx="50" cy="54" r="5" fill="#FED7AA" stroke="currentColor" strokeWidth="1.5" />
            {/* Active Running/Kinesiology Wave */}
            <path d="M22 78 Q50 62 78 78" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 82 Q50 68 72 82" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "BSC NURSING":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-2 shadow-inner ${selectedSize} ${className}`}>
          <div className="absolute inset-0 bg-pink-400/20 rounded-2xl blur-md -z-10 animate-pulse"></div>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            {/* Protective Heart Outline */}
            <path d="M16 42 C16 26 36 22 50 36 C64 22 84 26 84 42 C84 62 58 78 50 82 C42 78 16 62 16 42 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,255,255,0.05)" />
            {/* Caring Hands embracing Nightingale Lamp */}
            <path d="M24 64 C28 60 38 52 50 58" stroke="#FECDD3" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M76 64 C72 60 62 52 50 58" stroke="#FECDD3" strokeWidth="2.5" strokeLinecap="round" />
            {/* Florence Nightingale's Oil Lamp of Compassion */}
            <path d="M36 50 H64 L60 42 H40 L36 50 Z" fill="rgba(255,255,255,0.15)" stroke="currentColor" strokeWidth="2" />
            {/* Lamp base and handle */}
            <path d="M34 50 C34 54 66 54 66 50" stroke="currentColor" strokeWidth="2" />
            <path d="M64 50 C68 46 72 52 64 54" stroke="currentColor" strokeWidth="1.5" />
            <path d="M36 50 C30 46 32 40 38 42" stroke="currentColor" strokeWidth="1.5" />
            {/* Shining flame (representing life & wisdom) */}
            <path d="M50 30 C53 36 50 42 50 42 C50 42 47 36 50 30 Z" fill="#FFD700" stroke="#FFD700" strokeWidth="1" />
            {/* Healing Stars */}
            <circle cx="32" cy="28" r="2.5" fill="#FFD700" />
            <circle cx="68" cy="28" r="2.5" fill="#FFD700" />
          </svg>
        </div>
      );

    case "BDS":
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-2 shadow-inner ${selectedSize} ${className}`}>
          <div className="absolute inset-0 bg-indigo-400/20 rounded-2xl blur-md -z-10 animate-pulse"></div>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            {/* High-Tech Diamond Pattern Border */}
            <polygon points="50,12 84,30 84,70 50,88 16,70 16,30" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,255,255,0.06)" />
            {/* Geometrical Tooth silhouette */}
            <path d="M34 32 C34 26 44 26 50 32 C56 26 66 26 66 32 V54 C66 64 60 74 58 74 C56 74 54 68 50 68 C46 68 44 74 42 74 C40 74 34 64 34 54 V32 Z" fill="rgba(255,255,255,0.12)" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Shimmer facets representing enamel strength */}
            <path d="M50 38 V62" stroke="#DDD6FE" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M38 44 H62" stroke="#DDD6FE" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Cross Dental Mirror & Precision Caliper lines */}
            <path d="M24 72 L36 60" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22" cy="74" r="3" stroke="#FFD700" strokeWidth="2" />
            <path d="M76 72 L64 60" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
            {/* Dentin protection star sparks */}
            <path d="M50 18 L51 22 L55 22 L52 24 L53 28 L50 25 L47 28 L48 24 L45 22 L49 22 Z" fill="#FFD700" />
            <circle cx="30" cy="50" r="2" fill="#FFD700" />
            <circle cx="70" cy="50" r="2" fill="#FFD700" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 p-2 shadow-inner ${selectedSize} ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            <rect x="20" y="20" width="60" height="60" rx="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      );
  }
};
