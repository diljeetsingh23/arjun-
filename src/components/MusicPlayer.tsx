import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, Volume2, VolumeX, Sparkles, Disc, Radio, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackClick } from '../utils/tracker';

interface Track {
  id: string;
  title: string;
  artist: string;
  description: string;
}

const TRACKS: Track[] = [
  {
    id: 'blue',
    title: "blue (instrumental)",
    artist: "DiabolicalAvenger 69",
    description: "A deep, bittersweet aesthetic rhythm specially requested by Bandar for Darshuu.",
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [animatedBars, setAnimatedBars] = useState<number[]>([10, 20, 15, 30, 25, 40, 20, 35, 15, 25, 10]);
  
  // Audio sources status
  const [audioMode, setAudioMode] = useState<'mp3' | 'synth'>('mp3');
  const [mp3HasError, setMp3HasError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Synthesizer Web Audio API references
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const activeTrack = TRACKS[0];

  // Web Audio Initializer
  const initSynthAudio = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.setValueAtTime(volume * 0.4, audioContextRef.current.currentTime); // keep synth cozy and gentle
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playSynthesizedTone = (freqs: number[], duration = 3.5) => {
    const ctx = audioContextRef.current;
    const dest = gainNodeRef.current;
    if (!ctx || !dest) return;

    const t = ctx.currentTime;
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Soft triangle or sine sounds to match the "blue" bittersweet vibe
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      
      // Warm slow-attack envelope
      oscGain.gain.setValueAtTime(0, t);
      oscGain.gain.linearRampToValueAtTime(0.045 - idx * 0.008, t + 0.5);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(oscGain);
      oscGain.connect(dest);
      
      osc.start(t);
      osc.stop(t + duration);
      
      activeOscillatorsRef.current.push(osc);
      
      setTimeout(() => {
        try {
          osc.disconnect();
          oscGain.disconnect();
        } catch (e) {}
      }, duration * 1000 + 100);
    });
  };

  const startSynthMode = () => {
    stopSynthMode();
    initSynthAudio();

    // Deep bittersweet chord progression matching Gm chords of 'blue (instrumental)'
    const chords = [
      [146.83, 196.00, 233.08, 293.66, 349.23], // Gm9 (G, Bb, D, F, A)
      [155.56, 196.00, 233.08, 293.66, 392.00], // Ebmaj7 / Ebmaj9
      [130.81, 155.56, 196.00, 233.08, 293.66], // Cm9 (C, Eb, G, Bb, D)
      [174.61, 233.08, 261.63, 311.13, 392.00], // Fsus4 / F7
    ];
    let chordIdx = 0;

    const playStep = () => {
      // Play atmospheric background pad
      playSynthesizedTone(chords[chordIdx], 4.5);
      
      // Sparkly random bell highlights
      const notes = chords[chordIdx];
      const bellNote = notes[Math.floor(Math.random() * notes.length)] * 2; // Octave higher
      setTimeout(() => {
        if (isPlaying && audioMode === 'synth') {
          playSynthesizedTone([bellNote], 2.0);
        }
      }, 1500);

      chordIdx = (chordIdx + 1) % chords.length;
    };

    playStep();
    synthIntervalRef.current = setInterval(playStep, 5000); // 5 sec bars
  };

  const stopSynthMode = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    activeOscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    activeOscillatorsRef.current = [];
  };

  // Sync state for actual MP3 element
  useEffect(() => {
    const audio = new Audio("/blue_instrumental.mp3");
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    // Detect if MP3 is missing, empty, or fails to play
    audio.addEventListener('error', () => {
      console.log("MP3 file is empty or missing. Switching safely to Live Synth Fail-safe.");
      setMp3HasError(true);
      setAudioMode('synth');
    });

    // Check if empty file (duration is 0 or NaN but loaded)
    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration === 0 || isNaN(audio.duration)) {
        console.log("Empty MP3 file detected, shifting to Live Synth backup.");
        setMp3HasError(true);
        setAudioMode('synth');
      }
    });

    if (isPlaying && audioMode === 'mp3') {
      audio.play().catch(err => {
        console.log("Browser autoplay restriction - waiting for user touch.", err);
      });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Control playback based on state
  useEffect(() => {
    if (isPlaying) {
      if (audioMode === 'mp3' && !mp3HasError && audioRef.current) {
        stopSynthMode();
        audioRef.current.play().catch(() => {
          // Fallback to synth if play fails
          setAudioMode('synth');
        });
      } else {
        if (audioRef.current) audioRef.current.pause();
        startSynthMode();
      }
    } else {
      if (audioRef.current) audioRef.current.pause();
      stopSynthMode();
    }
  }, [isPlaying, audioMode, mp3HasError]);

  // Auto-resume audio on general click/touch interaction
  useEffect(() => {
    const handleGesture = () => {
      if (isPlaying) {
        if (audioMode === 'mp3' && audioRef.current && audioRef.current.paused && !mp3HasError) {
          audioRef.current.play().catch(() => {});
        } else if (audioMode === 'synth') {
          initSynthAudio();
        }
      }
    };
    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [isPlaying, audioMode]);

  // Dynamically update bars for visualization
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnimatedBars(prev => prev.map(() => Math.floor(Math.random() * 32) + 12));
      }, 150);
    } else {
      setAnimatedBars([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 0.4, audioContextRef.current.currentTime);
    }
  }, [volume, isMuted]);

  const handleTogglePlay = () => {
    trackClick('musicPlayPause');
    setIsPlaying(!isPlaying);
  };

  const forceToggleMode = () => {
    if (audioMode === 'mp3') {
      setAudioMode('synth');
    } else {
      if (!mp3HasError) {
        setAudioMode('mp3');
      } else {
        alert("The custom MP3 is offline/empty - utilizing optimized live synthesizer to keep Darshuu's music playing!");
      }
    }
  };

  return (
    <div id="music-player-card" className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-pink-100 shadow-sm flex flex-col md:flex-row items-center gap-5 justify-between max-w-xl mx-auto my-6">
      
      {/* Album Disk */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md relative z-10"
          >
            <Disc className="w-8 h-8 opacity-90" />
            <div className="absolute w-4 h-4 bg-white rounded-full border border-rose-500" />
          </motion.div>
          <div className="absolute inset-0 bg-red-100 -m-1.5 rounded-full animate-ping opacity-30 z-0" style={{ display: isPlaying ? 'block' : 'none' }} />
        </div>

        <div className="text-left select-none flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-400" /> 24/7 Sincerity Radio
            </span>

            {/* Live Playback Module Badge */}
            {audioMode === 'synth' ? (
              <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-200 font-bold flex items-center gap-0.5 animate-pulse">
                <Radio className="w-2.5 h-2.5" /> LIVE SYNTH ACTIVE
              </span>
            ) : (
              <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-0.5">
                <Music className="w-2.5 h-2.5" /> MP3 ACTIVE
              </span>
            )}
          </div>
          <h4 className="font-sans font-semibold text-gray-800 text-sm line-clamp-1">{activeTrack.title}</h4>
          <p className="font-sans text-xs text-rose-400 font-medium">{activeTrack.artist}</p>
        </div>
      </div>

      {/* Controller & Visualizer */}
      <div className="flex flex-col items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            id="play-music-button"
            className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white transition-all transform hover:scale-105 shadow-sm shadow-pink-200 cursor-pointer"
            title={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Toggle Engine buttons */}
          <button
            onClick={forceToggleMode}
            id="toggle-audio-source"
            className="text-[11px] font-sans font-medium text-gray-400 hover:text-rose-500 border border-gray-100 hover:border-pink-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer bg-stone-50"
            title="Switch between live synth chords or standard audio file"
          >
            Switch Source
          </button>

          <div className="h-4 w-[1px] bg-gray-200 mx-1" />

          <button
            onClick={() => {
              trackClick('musicMute');
              setIsMuted(!isMuted);
            }}
            id="mute-music-button"
            className="p-2 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer animate-none"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex items-center gap-[3.5px] h-6 px-3">
          {animatedBars.map((height, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 4 }}
              animate={{ height }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-[3px] bg-pink-300 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Gentle notice */}
      <div className="hidden lg:block text-right max-w-[200px]">
        <p className="text-[10px] font-sans text-gray-400 font-normal leading-tight">
          {activeTrack.description} 
          <span className="block mt-1 text-[9px] text-pink-400">Tap anywhere on the page to start background audio</span>
        </p>
      </div>
    </div>
  );
}

