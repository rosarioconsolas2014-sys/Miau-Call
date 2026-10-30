/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MIAU CALL - Cat Audio Engine
 * 100% Authentic Feline Recordings Engine
 * Plays exclusively real cat meows, purrs, and feline vocalizations.
 * Absolutely NO human voices or speech synthesis.
 * Works 100% offline using local audio files and Web Audio API.
 */

export interface SoundAction {
  id: string;
  name: string;
  title: string;
  badge: string;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  animState: 'calling' | 'love' | 'waving' | 'eating' | 'kisses' | 'sleeping' | 'meowing' | 'running';
  description: string;
  soundFile: string;
}

export const SOUND_BUTTONS: SoundAction[] = [
  {
    id: 'ven',
    name: 'VEN',
    title: 'VEN',
    badge: '🐱',
    color: 'from-amber-400 to-orange-400',
    borderColor: 'border-orange-300',
    bgColor: 'bg-orange-50/90',
    textColor: 'text-orange-950',
    animState: 'calling',
    description: 'Maullidos cortos y repetidos de un gato llamando',
    soundFile: '/sounds/ven.mp3',
  },
  {
    id: 'te-amo',
    name: 'TE AMO',
    title: 'TE AMO',
    badge: '❤️',
    color: 'from-rose-400 to-pink-500',
    borderColor: 'border-rose-300',
    bgColor: 'bg-rose-50/90',
    textColor: 'text-rose-950',
    animState: 'love',
    description: 'Ronroneos suaves y maullidos cariñosos',
    soundFile: '/sounds/te-amo.mp3',
  },
  {
    id: 'hola-gatito',
    name: 'HOLA, GATITO',
    title: 'HOLA, GATITO',
    badge: '🥰',
    color: 'from-sky-400 to-blue-500',
    borderColor: 'border-sky-300',
    bgColor: 'bg-sky-50/90',
    textColor: 'text-sky-950',
    animState: 'waving',
    description: 'Maullido alegre de bienvenida',
    soundFile: '/sounds/hola-gatito.mp3',
  },
  {
    id: 'a-comer',
    name: 'A COMER',
    title: 'A COMER',
    badge: '🐟',
    color: 'from-teal-400 to-emerald-500',
    borderColor: 'border-teal-300',
    bgColor: 'bg-teal-50/90',
    textColor: 'text-teal-950',
    animState: 'eating',
    description: 'Maullidos insistentes de gato pidiendo comida',
    soundFile: '/sounds/a-comer.mp3',
  },
  {
    id: 'besitos',
    name: 'BESITOS',
    title: 'BESITOS',
    badge: '😻',
    color: 'from-fuchsia-400 to-pink-500',
    borderColor: 'border-fuchsia-300',
    bgColor: 'bg-fuchsia-50/90',
    textColor: 'text-fuchsia-950',
    animState: 'kisses',
    description: 'Ronroneos y pequeños maullidos tiernos',
    soundFile: '/sounds/besitos.mp3',
  },
  {
    id: 'a-dormir',
    name: 'A DORMIR',
    title: 'A DORMIR',
    badge: '💤',
    color: 'from-indigo-400 to-purple-500',
    borderColor: 'border-indigo-300',
    bgColor: 'bg-indigo-50/90',
    textColor: 'text-indigo-950',
    animState: 'sleeping',
    description: 'Ronroneos relajantes de un gato tranquilo',
    soundFile: '/sounds/a-dormir.mp3',
  },
  {
    id: 'miau-miau',
    name: 'MIAU MIAU',
    title: 'MIAU MIAU',
    badge: '🎵',
    color: 'from-yellow-400 to-amber-500',
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50/90',
    textColor: 'text-amber-950',
    animState: 'meowing',
    description: 'Diferentes variedades de maullidos reales',
    soundFile: '/sounds/miau-miau.mp3',
  },
  {
    id: 'veni-mi-amor',
    name: 'VENÍ, MI AMOR',
    title: 'VENÍ, MI AMOR',
    badge: '🐾',
    color: 'from-violet-400 to-purple-500',
    borderColor: 'border-violet-300',
    bgColor: 'bg-violet-50/90',
    textColor: 'text-violet-950',
    animState: 'running',
    description: 'Maullidos repetidos y suaves para atraer al gato',
    soundFile: '/sounds/veni-mi-amor.mp3',
  },
];

class CatAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private audioBufferCache: Map<string, AudioBuffer> = new Map();
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private currentHtmlAudio: HTMLAudioElement | null = null;
  private volume: number = 0.9;
  private isMuted: boolean = false;
  private activeSoundId: string | null = null;
  private isLooping: boolean = false;
  private onStateChange: ((isPlaying: boolean, soundId: string | null) => void) | null = null;

  constructor() {
    // Pre-cache sounds if possible in browser
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => this.preloadAll(), { once: true });
      window.addEventListener('touchstart', () => this.preloadAll(), { once: true });
    }
  }

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Preload audio files into memory buffers for zero-latency instant playback
   */
  public async preloadAll() {
    const ctx = this.initContext();
    for (const btn of SOUND_BUTTONS) {
      if (!this.audioBufferCache.has(btn.id)) {
        try {
          const res = await fetch(btn.soundFile);
          const arrayBuffer = await res.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          this.audioBufferCache.set(btn.id, audioBuffer);
        } catch {
          // Preload fail is non-fatal; playback will load on demand or fallback
        }
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.currentHtmlAudio) {
      this.currentHtmlAudio.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.currentHtmlAudio) {
      this.currentHtmlAudio.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setLoop(loop: boolean) {
    this.isLooping = loop;
    if (this.currentSourceNode) {
      this.currentSourceNode.loop = loop;
    }
    if (this.currentHtmlAudio) {
      this.currentHtmlAudio.loop = loop;
    }
  }

  public getIsLooping(): boolean {
    return this.isLooping;
  }

  public setOnStateChange(cb: (isPlaying: boolean, soundId: string | null) => void) {
    this.onStateChange = cb;
  }

  public stop() {
    // 1. Stop active AudioBufferSourceNode
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
        this.currentSourceNode.disconnect();
      } catch {
        // already stopped
      }
      this.currentSourceNode = null;
    }

    // 2. Stop HTMLAudio fallback if active
    if (this.currentHtmlAudio) {
      try {
        this.currentHtmlAudio.pause();
        this.currentHtmlAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentHtmlAudio = null;
    }

    const wasActive = this.activeSoundId;
    this.activeSoundId = null;

    if (this.onStateChange && wasActive) {
      this.onStateChange(false, null);
    }
  }

  public getActiveSoundId(): string | null {
    return this.activeSoundId;
  }

  /**
   * Main entry point to play sound by button ID
   * Reproduces exclusively authentic feline recordings
   */
  public async playSound(soundId: string) {
    // Stop any existing playback first to guarantee single playback
    this.stop();

    if (this.isMuted) return;

    const soundAction = SOUND_BUTTONS.find((b) => b.id === soundId);
    if (!soundAction) return;

    this.activeSoundId = soundId;
    if (this.onStateChange) {
      this.onStateChange(true, soundId);
    }

    try {
      const ctx = this.initContext();

      // Check cache or fetch & decode
      let buffer = this.audioBufferCache.get(soundId);
      if (!buffer) {
        const res = await fetch(soundAction.soundFile);
        const arrayBuf = await res.arrayBuffer();
        buffer = await ctx.decodeAudioData(arrayBuf);
        this.audioBufferCache.set(soundId, buffer);
      }

      if (buffer && this.masterGain) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = this.isLooping;
        source.connect(this.masterGain);

        source.onended = () => {
          if (!this.isLooping && this.activeSoundId === soundId) {
            this.activeSoundId = null;
            if (this.onStateChange) {
              this.onStateChange(false, null);
            }
          }
        };

        this.currentSourceNode = source;
        source.start(0);
      }
    } catch {
      // Robust HTML5 Audio fallback for older Android webviews
      try {
        const audio = new Audio(soundAction.soundFile);
        audio.volume = this.isMuted ? 0 : this.volume;
        audio.loop = this.isLooping;
        audio.onended = () => {
          if (!this.isLooping && this.activeSoundId === soundId) {
            this.activeSoundId = null;
            if (this.onStateChange) {
              this.onStateChange(false, null);
            }
          }
        };
        this.currentHtmlAudio = audio;
        await audio.play();
      } catch (audioErr) {
        console.warn('Audio playback error', audioErr);
        this.activeSoundId = null;
        if (this.onStateChange) {
          this.onStateChange(false, null);
        }
      }
    }
  }

  /**
   * Authentic Feline Pet Reaction (Sweet purr from a-dormir/te-amo)
   */
  public playPetReaction(): void {
    if (this.isMuted) return;
    this.playSound('a-dormir');
  }
}

export const catAudio = new CatAudioEngine();
