/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MIAU CALL – El llamador de gatitos 🐱
 * Android Mobile App & Web Audio Feline Synthesizer
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Square,
  Repeat,
  Sparkles,
  Heart,
  Smartphone,
  RefreshCw,
  Palette,
  Info,
} from 'lucide-react';
import { catAudio, SOUND_BUTTONS, SoundAction } from './audio/CatAudioEngine';
import { KawaiiCat, CatAnimState, CatBreed, CAT_BREEDS } from './components/KawaiiCat';
import { AndroidCapacitorModal } from './components/AndroidCapacitorModal';

const CUTE_GREETINGS = [
  '¡Un michi feliz te está esperando! 🐾',
  'Hoy es un día perfecto para mimar a tu gato ❤️',
  '¡Ps ps ps! ¿Dónde está el rey de la casa? 👑',
  'Tu michi te ama (aunque a veces disimule) 😻',
  '¡Prepará los mimitos y el platito de comida! 🐟',
  '¡Los maullidos y mimos hacen muy feliz a tu gato! 🥰',
  'Un maullido al día alegra el corazón 💖',
  '¿Escuchaste ese ronroneo? ¡Es pura felicidad! ✨',
];

export default function App() {
  // Application State
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [animState, setAnimState] = useState<CatAnimState>('idle');
  const [volume, setVolume] = useState<number>(90);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [selectedBreed, setSelectedBreed] = useState<CatBreed>('orange');
  const [greeting, setGreeting] = useState<string>('');
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [showBreedPicker, setShowBreedPicker] = useState<boolean>(false);
  const [pettedCount, setPettedCount] = useState<number>(0);
  const [lastActionTitle, setLastActionTitle] = useState<string>('');

  const animTimeoutRef = useRef<number | null>(null);

  // Initialize random greeting and audio listener
  useEffect(() => {
    const randomMsg = CUTE_GREETINGS[Math.floor(Math.random() * CUTE_GREETINGS.length)];
    setGreeting(randomMsg);

    catAudio.setOnStateChange((isPlaying, soundId) => {
      if (!isPlaying) {
        setActiveSoundId(null);
        if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
        animTimeoutRef.current = window.setTimeout(() => {
          setAnimState('idle');
        }, 1500);
      } else if (soundId) {
        setActiveSoundId(soundId);
      }
    });

    return () => {
      catAudio.stop();
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  // Handle Main Sound Buttons
  const handleButtonClick = async (btn: SoundAction, event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent multiple sounds overlapping by stopping active first
    catAudio.stop();

    // Trigger visual confetti / hearts burst from button position
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      origin: { x, y },
      particleCount: 18,
      spread: 60,
      ticks: 120,
      gravity: 0.8,
      scalar: 0.9,
      colors: ['#FF6B8B', '#FFA8C5', '#FFD166', '#A8E6CF', '#DED2F9'],
      shapes: ['circle'],
    });

    // Update cat animation and description
    setAnimState(btn.animState);
    setLastActionTitle(btn.title);
    setActiveSoundId(btn.id);

    // Play real audio via CatAudioEngine
    await catAudio.playSound(btn.id);
  };

  // Stop button
  const handleStop = () => {
    catAudio.stop();
    setActiveSoundId(null);
    setAnimState('idle');
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = catAudio.toggleMute();
    setIsMuted(muted);
    if (muted) {
      setActiveSoundId(null);
      setAnimState('idle');
    }
  };

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    catAudio.setVolume(val / 100);
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  };

  // Loop toggle
  const handleToggleLoop = () => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    catAudio.setLoop(nextLoop);
  };

  // Roll new greeting
  const handleNewGreeting = () => {
    const filtered = CUTE_GREETINGS.filter((g) => g !== greeting);
    const next = filtered[Math.floor(Math.random() * filtered.length)];
    setGreeting(next);
  };

  // Pet the cat directly
  const handlePetCat = () => {
    setPettedCount((prev) => prev + 1);
    catAudio.playPetReaction();
    setAnimState('love');
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = window.setTimeout(() => {
      setAnimState('idle');
    }, 2000);
  };

  const isAudioPlaying = activeSoundId !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] via-[#F6F0FF] to-[#EAF4FF] text-slate-800 flex flex-col justify-between selection:bg-pink-300 selection:text-pink-900 pb-10">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Brand title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce" style={{ animationDuration: '3s' }}>🐱</span>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-kawaii tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                MIAU CALL
                <span className="text-[10px] font-sans font-bold bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full border border-pink-200">
                  Android
                </span>
              </h1>
              <p className="text-[11px] text-pink-500 font-medium leading-tight">
                El llamador de gatitos
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1.5">
            {/* Breed Picker Trigger */}
            <button
              onClick={() => setShowBreedPicker(!showBreedPicker)}
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200/80 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Cambiar raza de gato"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Michi</span>
            </button>

            {/* Android APK Modal Trigger */}
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="p-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200/80 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Exportar a Android APK con Capacitor"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">APK</span>
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-colors ${
                isMuted
                  ? 'bg-rose-100 text-rose-700 border-rose-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Stop Sound Button */}
            <button
              onClick={handleStop}
              disabled={!isAudioPlaying}
              className={`p-2 rounded-xl border transition-all ${
                isAudioPlaying
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
              }`}
              title="Detener sonido actual"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Expandable Breed Selector Bar */}
        {showBreedPicker && (
          <div className="bg-pink-50/95 border-t border-pink-200 p-2 animate-in slide-in-from-top-2 duration-150">
            <div className="max-w-xl mx-auto flex items-center justify-between gap-1 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-pink-900 shrink-0 px-1">
                Elegí tu michi:
              </span>
              <div className="flex items-center gap-1.5">
                {CAT_BREEDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBreed(b.id);
                      setShowBreedPicker(false);
                      catAudio.playSound('hola-gatito');
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                      selectedBreed === b.id
                        ? 'bg-pink-500 text-white shadow-xs scale-105'
                        : 'bg-white text-slate-700 hover:bg-pink-100 border border-pink-200'
                    }`}
                  >
                    <span>{b.icon}</span>
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-xl w-full mx-auto px-4 pt-3 flex-1 flex flex-col justify-start">
        {/* Sweet Daily Message Banner */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-xs border border-pink-200/80 mb-3 flex items-center justify-between gap-2 transition-all">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-pink-500 text-sm shrink-0">✨</span>
            <p className="text-xs sm:text-sm font-semibold text-pink-950 truncate">
              {greeting}
            </p>
          </div>
          <button
            onClick={handleNewGreeting}
            className="p-1.5 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors shrink-0"
            title="Cambiar frase tierna"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Centerpiece: Animated Kawaii Cat & Petting Station */}
        <section className="relative my-1 flex flex-col items-center">
          {/* Active Sound Indicator Badge */}
          {isAudioPlaying && (
            <div className="mb-2 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md animate-bounce flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Llamando: {lastActionTitle}</span>
            </div>
          )}

          {/* Master Animated Kawaii Cat SVG */}
          <div className="relative">
            <KawaiiCat
              animState={animState}
              breed={selectedBreed}
              onPet={handlePetCat}
              isAudioPlaying={isAudioPlaying}
            />
          </div>

          {/* Main Question Heading */}
          <div className="text-center mt-1 mb-2">
            <h2 className="text-lg sm:text-xl font-bold font-kawaii text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
              <span>¿Qué le querés decir a tu michi?</span>
              <span className="text-rose-500">🐾</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Tocá cualquier botón para reproducir sonido y ver su reacción
            </p>
          </div>
        </section>

        {/* Audio Utilities Toolbar (Volume slider & Loop mode) */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2.5 border border-pink-200/60 shadow-xs mb-3 flex items-center justify-between gap-3 text-xs">
          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1 max-w-[220px]">
            <span className="text-slate-500 font-medium">Vol:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full accent-pink-500 cursor-pointer h-1.5 bg-pink-100 rounded-lg"
              title={`Volumen: ${volume}%`}
            />
            <span className="font-mono text-[11px] text-slate-500 w-7 text-right">
              {isMuted ? '0%' : `${volume}%`}
            </span>
          </div>

          {/* Repeat / Loop Sound Toggle */}
          <button
            onClick={handleToggleLoop}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              isLooping
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
            }`}
            title="Repetir sonido automáticamente"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Repetir {isLooping ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* The 8 Main Buttons in 2 Columns x 4 Rows */}
        <section className="grid grid-cols-2 gap-2.5 sm:gap-3.5 mb-4">
          {SOUND_BUTTONS.map((btn) => {
            const isActive = activeSoundId === btn.id;

            return (
              <button
                key={btn.id}
                onClick={(e) => handleButtonClick(btn, e)}
                className={`relative group overflow-hidden rounded-3xl p-3.5 sm:p-4 text-left transition-all duration-200 border-2 kawaii-btn-shadow ${
                  btn.borderColor
                } ${btn.bgColor} ${
                  isActive
                    ? 'ring-4 ring-pink-400 ring-offset-2 scale-[0.98] bg-white'
                    : 'hover:-translate-y-0.5 hover:shadow-lg'
                }`}
              >
                {/* Active Soundwave Pulse Ring */}
                {isActive && (
                  <span className="absolute inset-0 bg-pink-400/10 animate-pulse pointer-events-none" />
                )}

                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm bg-gradient-to-br ${btn.color} text-white group-hover:scale-110 transition-transform`}
                  >
                    <span>{btn.badge}</span>
                  </div>

                  {/* Sound Wave Indicator for Active Sound */}
                  {isActive ? (
                    <div className="flex items-end gap-0.5 h-5 pt-1">
                      <span className="w-1 bg-pink-500 rounded-full animate-bounce h-3" style={{ animationDelay: '0s' }} />
                      <span className="w-1 bg-pink-500 rounded-full animate-bounce h-5" style={{ animationDelay: '0.15s' }} />
                      <span className="w-1 bg-pink-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0.3s' }} />
                      <span className="w-1 bg-pink-500 rounded-full animate-bounce h-4" style={{ animationDelay: '0.45s' }} />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200">
                      Tocar
                    </span>
                  )}
                </div>

                {/* Button Title */}
                <h3 className={`text-base sm:text-lg font-bold font-kawaii tracking-tight mb-1 ${btn.textColor}`}>
                  {btn.name}
                </h3>

                {/* Subtitle / Description */}
                <p className="text-[11px] sm:text-xs text-slate-600 leading-tight line-clamp-2">
                  {btn.description}
                </p>
              </button>
            );
          })}
        </section>

        {/* Pet Counter & Tips */}
        <div className="bg-white/60 rounded-2xl p-3 border border-pink-100 flex items-center justify-between text-xs text-slate-600 mb-2">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Mimos dados hoy:</span>
            <span className="font-bold text-rose-600 font-mono text-sm">{pettedCount}</span>
          </div>
          <button
            onClick={() => setIsApkModalOpen(true)}
            className="text-pink-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
          >
            <Smartphone className="w-3.5 h-3.5" />
            ¿Cómo instalar en Android?
          </button>
        </div>
      </main>

      {/* Subtle Mobile Footer */}
      <footer className="max-w-xl mx-auto px-4 text-center mt-2">
        <p className="text-[11px] text-slate-400">
          MIAU CALL – Creado con amor para amantes de los gatos 🐱 · 100% Offline
        </p>
      </footer>

      {/* Capacitor Android Packaging Modal */}
      <AndroidCapacitorModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
