/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KawaiiCat.tsx - Interactive Animated SVG Cat Component
 * Adorable Kawaii feline animations matching each Miau Call button:
 * idle, calling, love, waving, eating, kisses, sleeping, meowing, running
 */

import React, { useState } from 'react';

export type CatAnimState =
  | 'idle'
  | 'calling'
  | 'love'
  | 'waving'
  | 'eating'
  | 'kisses'
  | 'sleeping'
  | 'meowing'
  | 'running';

export type CatBreed = 'orange' | 'white' | 'calico' | 'black' | 'siamese';

interface KawaiiCatProps {
  animState: CatAnimState;
  breed?: CatBreed;
  onPet?: () => void;
  isAudioPlaying?: boolean;
}

export const CAT_BREEDS: { id: CatBreed; name: string; icon: string; desc: string }[] = [
  { id: 'orange', name: 'Naranjito', icon: '🟧', desc: 'Atigrado naranja alegre' },
  { id: 'white', name: 'Copito', icon: '🤍', desc: 'Blanco como una nube' },
  { id: 'calico', name: 'Calicó', icon: '🐾', desc: 'Manchitas de la suerte' },
  { id: 'black', name: 'Panterita', icon: '🖤', desc: 'Negrito con ojos dorados' },
  { id: 'siamese', name: 'Siamés', icon: '🤎', desc: 'Elegante crema y café' },
];

export const KawaiiCat: React.FC<KawaiiCatProps> = ({
  animState,
  breed = 'orange',
  onPet,
  isAudioPlaying = false,
}) => {
  const [petHearts, setPetHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isWinking, setIsWinking] = useState(false);

  // Quick wink on tap
  const handleCatClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now() + Math.random(), x, y };
    setPetHearts((prev) => [...prev.slice(-6), newHeart]);

    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 900);

    if (onPet) {
      onPet();
    }
  };

  // Fur and ear palette based on breed
  const getFurColors = (b: CatBreed) => {
    switch (b) {
      case 'white':
        return {
          bodyGrad: ['#FFFFFF', '#F3F4F6'],
          patchColor: '#E5E7EB',
          earPink: '#FFB8D2',
          muzzle: '#FFFFFF',
          stripes: 'transparent',
          eyeColor: '#4A90E2', // Blue eyes for white cat
          collar: '#FF6B8B',
        };
      case 'calico':
        return {
          bodyGrad: ['#FFFFFF', '#FFF7F0'],
          patchColor: '#F97316',
          earPink: '#FFAAA6',
          muzzle: '#FFFFFF',
          stripes: '#374151',
          eyeColor: '#059669', // Emerald eyes
          collar: '#8B5CF6',
        };
      case 'black':
        return {
          bodyGrad: ['#23232C', '#13131A'],
          patchColor: '#1E1E26',
          earPink: '#D97706',
          muzzle: '#2C2C38',
          stripes: 'transparent',
          eyeColor: '#F59E0B', // Golden glowing eyes
          collar: '#EC4899',
        };
      case 'siamese':
        return {
          bodyGrad: ['#FFF8ED', '#EADBC8'],
          patchColor: '#5D4037', // Dark brown mask
          earPink: '#795548',
          muzzle: '#4E342E',
          stripes: 'transparent',
          eyeColor: '#0284C7', // Deep blue eyes
          collar: '#10B981',
        };
      case 'orange':
      default:
        return {
          bodyGrad: ['#FFA962', '#F97316'],
          patchColor: '#EA580C',
          earPink: '#FFAEC7',
          muzzle: '#FFF5EB',
          stripes: '#EA580C',
          eyeColor: '#2D2B38',
          collar: '#EF4444',
        };
    }
  };

  const colors = getFurColors(breed);

  return (
    <div
      onClick={handleCatClick}
      role="button"
      tabIndex={0}
      title="¡Tocame para acariciarme y hacerme ronronear!"
      className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto cursor-pointer transition-transform duration-300 active:scale-95 group focus:outline-none"
    >
      {/* Floating Petting Hearts */}
      {petHearts.map((heart) => (
        <span
          key={heart.id}
          className="pointer-events-none absolute text-2xl font-bold animate-float-up z-30"
          style={{ left: heart.x, top: heart.y }}
        >
          💖
        </span>
      ))}

      {/* Sleeping ZZZ */}
      {animState === 'sleeping' && (
        <div className="absolute right-6 top-4 z-20 pointer-events-none select-none flex flex-col items-center">
          <span className="text-xl font-bold text-indigo-400 animate-sleep-zzz" style={{ animationDelay: '0s' }}>Z</span>
          <span className="text-2xl font-bold text-purple-400 animate-sleep-zzz" style={{ animationDelay: '0.4s' }}>z</span>
          <span className="text-3xl font-black text-pink-400 animate-sleep-zzz" style={{ animationDelay: '0.8s' }}>Z</span>
        </div>
      )}

      {/* Love Floating Hearts */}
      {(animState === 'love' || animState === 'kisses') && (
        <div className="absolute inset-0 pointer-events-none z-20 flex justify-center items-center">
          <span className="absolute -top-3 left-8 text-3xl animate-bounce" style={{ animationDuration: '1.2s' }}>
            {animState === 'kisses' ? '💋' : '💖'}
          </span>
          <span className="absolute -top-6 right-10 text-4xl animate-bounce" style={{ animationDuration: '0.9s' }}>
            {animState === 'kisses' ? '😘' : '💕'}
          </span>
          <span className="absolute top-8 -right-3 text-2xl animate-pulse">
            ✨
          </span>
        </div>
      )}

      {/* Food Plate Overlay for Eating */}
      {animState === 'eating' && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce" style={{ animationDuration: '1.4s' }}>
          <div className="flex items-center gap-1 bg-white/95 px-3 py-1 rounded-full shadow-md border border-amber-200">
            <span className="text-xl">🐟</span>
            <span className="text-xs font-bold text-amber-900">¡Ñam ñam!</span>
          </div>
        </div>
      )}

      {/* Interactive Ripple / Petting Prompt Tooltip on hover */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-rose-600 px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap border border-rose-100 pointer-events-none">
        🐾 ¡Acaríciame aquí!
      </div>

      {/* SVG Kawaii Cat Master Character */}
      <svg
        viewBox="0 0 320 320"
        className={`w-full h-full filter drop-shadow-xl transition-all duration-300 ${
          animState === 'running'
            ? 'animate-bounce scale-105'
            : animState === 'calling'
            ? 'animate-gentle-bounce'
            : animState === 'sleeping'
            ? 'scale-95 opacity-90'
            : isAudioPlaying
            ? 'scale-102'
            : ''
        }`}
      >
        <defs>
          <linearGradient id={`catFur-${breed}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color={colors.bodyGrad[0]} />
            <stop offset="100%" stop-color={colors.bodyGrad[1]} />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tail (Animated) */}
        <g className={animState === 'sleeping' ? '' : 'animate-tail-wag'}>
          <path
            d="M 230 240 C 275 235 290 190 270 160 C 255 140 240 160 250 175 C 260 190 245 220 220 230 Z"
            fill={`url(#catFur-${breed})`}
            stroke={colors.stripes}
            strokeWidth={colors.stripes !== 'transparent' ? 2 : 0}
          />
          {breed === 'siamese' && (
            <path
              d="M 270 160 C 255 140 240 160 250 175 C 260 185 255 175 265 168 Z"
              fill={colors.patchColor}
            />
          )}
        </g>

        {/* Cat Main Body */}
        <ellipse
          cx="160"
          cy="225"
          rx="72"
          ry="64"
          fill={`url(#catFur-${breed})`}
        />

        {/* Belly Patch (Soft cream) */}
        <ellipse
          cx="160"
          cy="235"
          rx="44"
          ry="46"
          fill={colors.muzzle}
          opacity="0.9"
        />

        {/* Calico Patches on Body */}
        {breed === 'calico' && (
          <>
            <path d="M 115 195 Q 130 180 145 190 Q 135 215 118 215 Z" fill="#F97316" />
            <path d="M 190 215 Q 210 205 220 225 Q 200 245 185 230 Z" fill="#374151" />
          </>
        )}

        {/* Siamese Dark Mask on Chest */}
        {breed === 'siamese' && (
          <ellipse cx="160" cy="255" rx="30" ry="20" fill={colors.bodyGrad[1]} opacity="0.4" />
        )}

        {/* Cat Ears */}
        {/* Left Ear */}
        <g className={animState === 'calling' ? 'animate-ear-wiggle' : ''} style={{ transformOrigin: '100px 120px' }}>
          <polygon
            points="95,130 115,50 155,108"
            fill={`url(#catFur-${breed})`}
          />
          <polygon
            points="105,122 120,68 145,106"
            fill={colors.earPink}
          />
          {breed === 'calico' && (
            <polygon points="98,125 116,55 130,90" fill="#374151" opacity="0.8" />
          )}
          {breed === 'siamese' && (
            <polygon points="95,130 115,50 155,108" fill={colors.patchColor} />
          )}
        </g>

        {/* Right Ear */}
        <g className={animState === 'calling' ? 'animate-ear-wiggle' : ''} style={{ transformOrigin: '220px 120px' }}>
          <polygon
            points="225,130 205,50 165,108"
            fill={`url(#catFur-${breed})`}
          />
          <polygon
            points="215,122 200,68 175,106"
            fill={colors.earPink}
          />
          {breed === 'calico' && (
            <polygon points="220,125 204,55 190,90" fill="#F97316" opacity="0.8" />
          )}
          {breed === 'siamese' && (
            <polygon points="225,130 205,50 165,108" fill={colors.patchColor} />
          )}
        </g>

        {/* Head */}
        <ellipse
          cx="160"
          cy="145"
          rx="76"
          ry="62"
          fill={`url(#catFur-${breed})`}
        />

        {/* Siamese Face Mask */}
        {breed === 'siamese' && (
          <ellipse cx="160" cy="150" rx="46" ry="38" fill={colors.patchColor} />
        )}

        {/* Orange Tabby Forehead Stripes */}
        {breed === 'orange' && (
          <g stroke="#EA580C" strokeWidth="3" strokeLinecap="round">
            <line x1="160" y1="95" x2="160" y2="112" />
            <line x1="150" y1="98" x2="146" y2="114" />
            <line x1="170" y1="98" x2="174" y2="114" />
          </g>
        )}

        {/* Muzzle */}
        <ellipse
          cx="160"
          cy="165"
          rx="38"
          ry="26"
          fill={colors.muzzle}
        />

        {/* Eyes Expressions */}
        {animState === 'sleeping' ? (
          // Sleeping curved happy closed eyes
          <g stroke={colors.eyeColor} strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 120 148 Q 132 158 144 148" />
            <path d="M 176 148 Q 188 158 200 148" />
          </g>
        ) : animState === 'love' ? (
          // Heart-shaped eyes
          <g fill="#EF4444">
            <path d="M 132 138 C 132 133 124 130 120 137 C 116 130 108 133 108 138 C 108 146 120 152 120 154 C 120 152 132 146 132 138 Z" transform="scale(1.2) translate(-20,-20)" />
            <path d="M 192 138 C 192 133 184 130 180 137 C 176 130 168 133 168 138 C 168 146 180 152 180 154 C 180 152 192 146 192 138 Z" transform="scale(1.2) translate(-10,-20)" />
          </g>
        ) : isWinking ? (
          // Playful Wink on tap!
          <g>
            {/* Left Eye open */}
            <ellipse cx="130" cy="142" rx="10" ry="14" fill={colors.eyeColor} />
            <circle cx="127" cy="138" r="4" fill="#FFFFFF" />
            <circle cx="134" cy="147" r="2" fill="#FFFFFF" />
            {/* Right Eye winking */}
            <path d="M 178 144 Q 190 154 202 144" stroke={colors.eyeColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          // Open Kawaii Big Shiny Eyes
          <g>
            <ellipse cx="130" cy="142" rx="11" ry="15" fill={colors.eyeColor} />
            <circle cx="127" cy="137" r="4.5" fill="#FFFFFF" />
            <circle cx="134" cy="147" r="2.2" fill="#FFFFFF" />

            <ellipse cx="190" cy="142" rx="11" ry="15" fill={colors.eyeColor} />
            <circle cx="187" cy="137" r="4.5" fill="#FFFFFF" />
            <circle cx="194" cy="147" r="2.2" fill="#FFFFFF" />
          </g>
        )}

        {/* Rosy Cheeks (Blush) */}
        <ellipse
          cx="110"
          cy="158"
          rx="12"
          ry="8"
          fill="#FF759E"
          opacity={animState === 'love' || animState === 'kisses' || isAudioPlaying ? 0.9 : 0.65}
        />
        <ellipse
          cx="210"
          cy="158"
          rx="12"
          ry="8"
          fill="#FF759E"
          opacity={animState === 'love' || animState === 'kisses' || isAudioPlaying ? 0.9 : 0.65}
        />

        {/* Triangle Cute Nose */}
        <polygon points="160,158 153,151 167,151" fill="#FF5E86" />

        {/* Mouth Formations */}
        {animState === 'meowing' ? (
          // Open meowing mouth (animating open/close)
          <g className="animate-pulse">
            <ellipse cx="160" cy="168" rx="8" ry="9" fill="#FF3366" />
            <path d="M 152 165 Q 160 174 168 165" stroke="#4A3B32" strokeWidth="2.5" fill="none" />
            <ellipse cx="160" cy="172" rx="5" ry="3" fill="#FF8BA7" />
          </g>
        ) : animState === 'kisses' ? (
          // Kissing cute puckered lips (chuik!)
          <ellipse cx="160" cy="166" rx="5" ry="6" fill="#FF3366" stroke="#4A3B32" strokeWidth="2" />
        ) : (
          // Classic Kawaii W-Smile :3
          <g stroke="#4A3B32" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M 153 158 Q 146 168 138 163" />
            <path d="M 167 158 Q 174 168 182 163" />
          </g>
        )}

        {/* Whiskers */}
        <g stroke={breed === 'black' ? '#FFFFFF' : '#8A583A'} strokeWidth="2" strokeLinecap="round" opacity="0.75">
          <line x1="105" y1="150" x2="65" y2="142" />
          <line x1="105" y1="160" x2="65" y2="164" />
          <line x1="215" y1="150" x2="255" y2="142" />
          <line x1="215" y1="160" x2="255" y2="164" />
        </g>

        {/* Collar & Golden Bell */}
        <path
          d="M 116 195 Q 160 215 204 195"
          stroke={colors.collar}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        {/* Golden Jingle Bell */}
        <circle cx="160" cy="208" r="10" fill="#FFD166" stroke="#E6A800" strokeWidth="1.5" />
        <circle cx="160" cy="208" r="8" fill="#FFE885" />
        <circle cx="160" cy="211" r="2.2" fill="#8C6B00" />
        <line x1="153" y1="208" x2="167" y2="208" stroke="#8C6B00" strokeWidth="1.5" />

        {/* Front Paws */}
        {/* Left Paw (waving when in waving state!) */}
        {animState === 'waving' ? (
          <g className="animate-paw-wave">
            {/* Raised waving paw */}
            <path
              d="M 115 175 C 100 150 95 130 110 120 C 125 110 135 130 130 160 Z"
              fill={`url(#catFur-${breed})`}
              stroke={colors.muzzle}
              strokeWidth="2"
            />
            {/* Paw pads (pink toe beans) */}
            <ellipse cx="112" cy="130" rx="6" ry="5" fill="#FF8BA7" />
            <circle cx="106" cy="122" r="2" fill="#FF8BA7" />
            <circle cx="112" cy="120" r="2" fill="#FF8BA7" />
            <circle cx="118" cy="122" r="2" fill="#FF8BA7" />
          </g>
        ) : (
          <ellipse
            cx="135"
            cy="278"
            rx="16"
            ry="12"
            fill={colors.muzzle}
            stroke={colors.stripes !== 'transparent' ? colors.stripes : 'none'}
            strokeWidth="1.5"
          />
        )}

        {/* Right Paw */}
        <ellipse
          cx="185"
          cy="278"
          rx="16"
          ry="12"
          fill={colors.muzzle}
          stroke={colors.stripes !== 'transparent' ? colors.stripes : 'none'}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
