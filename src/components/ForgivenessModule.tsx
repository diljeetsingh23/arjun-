import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sliders, Sparkles, Smile, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackClick, trackTensionValue, trackForgivenessStatus } from '../utils/tracker';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  emoji: string;
  delay: number;
  duration: number;
}

const PLEAD_TEXTS = [
  "Wait! Give me one more chance, Darshuu! 🍫",
  "Are you sure? I will prepare customized tea for you! ☕",
  "What if I let you win every argument for a month? 🏆",
  "The 'No' button seems to have a system bug! 🐛",
  "Please? Bandar is waiting with infinite hugs! 🥺",
  "Wait... the button is escaping! 🏃‍♂️",
  "Bandar promise to listen perfectly! 🌟",
  "No is not an option in our forever handbook! ❤️"
];

export default function ForgivenessModule() {
  const [angerLevel, setAngerLevel] = useState(100);
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [pleadText, setPleadText] = useState("No, rethink it!");
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isAccepted, setIsAccepted] = useState(false);
  const [hoveringNo, setHoveringNo] = useState(false);
  const [roseParticles, setRoseParticles] = useState<Particle[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger floating rose petals on successful acceptance
  const triggerCelebration = () => {
    trackForgivenessStatus(true);
    setIsAccepted(true);
    const particles: Particle[] = [];
    const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fca5a5'];
    const emojis = ['🌸', '❤️', '🌹', '✨', '💖', '💐'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100, // percentage spacing
        y: -10 - Math.random() * 20, // start above viewport
        size: Math.random() * 20 + 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 4,
      });
    }
    setRoseParticles(particles);
  };

  const handleHoverNo = () => {
    trackClick('noHoverCount');
    setNoHoverCount(prev => prev + 1);
    
    // Choose next plead statement
    const textIdx = noHoverCount % PLEAD_TEXTS.length;
    setPleadText(PLEAD_TEXTS[textIdx]);

    // Calculate a safe random position to fly to
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 65;
      
      // Keep inside local frame to prevent breaking layout or leaking out of the screen
      const maxX = Math.min(200, rect.width / 2 - padding);
      const minX = -Math.min(200, rect.width / 2 - padding);
      const maxY = Math.min(100, rect.height / 2 - padding);
      const minY = -Math.min(100, rect.height / 2 - padding);

      const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      setNoButtonPos({ x: randomX, y: randomY });
    }
  };

  const resetAll = () => {
    trackForgivenessStatus(false);
    setIsAccepted(false);
    setAngerLevel(100);
    setNoHoverCount(0);
    setPleadText("No, rethink it!");
    setNoButtonPos({ x: 0, y: 0 });
    setRoseParticles([]);
  };

  // Log tension updates with debounce/delay to avoid slider congestion
  useEffect(() => {
    const timeout = setTimeout(() => {
      trackTensionValue(angerLevel);
    }, 400);
    return () => clearTimeout(timeout);
  }, [angerLevel]);

  // Determine avatar and message based on her tension slider
  const getAvatarReaction = () => {
    if (angerLevel > 80) {
      return {
        emoji: "😰",
        className: "bg-red-50 border-red-200 text-red-500",
        message: "Bandar is shivering... 'Oh no, Darshuu looks very upset! Let me make things right...'",
        statusLabel: "Severe Alert Mode"
      };
    } else if (angerLevel > 40) {
      return {
        emoji: "🥺",
        className: "bg-amber-50 border-amber-200 text-amber-500",
        message: "Bandar is listening... 'I'm learning, Darshuu. I cherish you and promise to correct my actions.'",
        statusLabel: "Mending In Progress"
      };
    } else if (angerLevel > 10) {
      return {
        emoji: "🫣",
        className: "bg-pink-50 border-pink-200 text-pink-500",
        message: "Bandar gets hopeful... 'Is that a little smile creeping up? I miss you so much!'",
        statusLabel: "Almost Forgiven"
      };
    } else {
      return {
        emoji: "🥰",
        className: "bg-emerald-50 border-emerald-200 text-emerald-500",
        message: "Bandar is dancing! 'Darshuu, you have the biggest heart! I am ready to pamper you forever!'",
        statusLabel: "Pure Sunshine & Forgiven!"
      };
    }
  };

  const reaction = getAvatarReaction();

  return (
    <div ref={containerRef} id="forgiveness-module-container" className="relative w-full max-w-3xl mx-auto px-4 py-12 select-none overflow-hidden">
      
      {/* Absolute floating particles of acceptance */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none overflow-hidden z-50">
        {roseParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: `${p.y}vh`, x: `${p.x}%`, opacity: 0, rotate: 0 }}
            animate={{ 
              y: '120vh', 
              opacity: [0, 1, 1, 0], 
              rotate: 360,
              x: `${p.x + (Math.random() * 20 - 10)}%` 
            }}
            transition={{ 
              delay: p.delay, 
              duration: p.duration, 
              ease: "linear",
              repeat: Infinity 
            }}
            style={{ 
              position: 'absolute', 
              fontSize: p.size,
              zIndex: 100 
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isAccepted ? (
          <motion.div
            key="decision-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border-2 border-pink-100 rounded-3xl p-6 md:p-10 shadow-lg shadow-pink-100/50"
          >
            <div className="text-center max-w-lg mx-auto mb-8">
              <span className="font-mono text-xs text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 font-bold uppercase tracking-widest">
                Action Center
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-gray-800 mt-3 mb-2 font-normal">
                Will You Forgive Me, Darshuu?
              </h3>
              <p className="font-sans text-xs text-gray-500">
                You hold full control of Bandar's emotional climate. Use the dials below to ease the tension.
              </p>
            </div>

            {/* INTERACTIVE ANGER SLIDER */}
            <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-5 md:p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans font-bold text-xs text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-rose-400" /> Darshuu's Tension Meter:
                </span>
                <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${reaction.className}`}>
                  {reaction.statusLabel} ({angerLevel}%)
                </span>
              </div>

              {/* Real slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={angerLevel}
                onChange={(e) => setAngerLevel(Number(e.target.value))}
                className="w-full h-2.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none mb-6"
                id="anger-slider"
              />

              {/* Dynamic Interactive Avatar Feedback */}
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center pt-2">
                <motion.div
                  key={reaction.emoji}
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-4xl shadow-md border border-pink-100 shrink-0"
                >
                  {reaction.emoji}
                </motion.div>

                <div className="text-center md:text-left">
                  <p className="font-sans text-xs text-gray-400 italic">Bandar says:</p>
                  <p className="font-sans text-sm text-gray-700 font-medium mt-0.5">{reaction.message}</p>
                </div>
              </div>
            </div>

            {/* YES & NO ACTION BUTTONS */}
            <div className="relative min-h-[140px] flex flex-col items-center justify-center gap-5">
              
              {/* Guidance advice based on anger level */}
              {angerLevel > 10 && (
                <p className="font-sans text-xs text-gray-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Try cooling your tension to 0% to see Bandar's joyful response!
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                {/* YES BUTTON (Grows as anger is cooled) */}
                <motion.button
                  onClick={triggerCelebration}
                  animate={{
                    scale: 1 + (100 - angerLevel) * 0.0035,
                    boxShadow: angerLevel < 20 ? "0px 10px 25px rgba(244, 63, 94, 0.3)" : "none"
                  }}
                  id="accept-yes-button"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-sans text-sm font-bold px-8 py-3.5 rounded-full transition-all focus:outline-none active:scale-95 flex items-center gap-2 cursor-pointer z-10"
                >
                  <Heart className="w-4 h-4 fill-current animate-heartbeat" />
                  Yes, I Forgive You!
                </motion.button>

                {/* NO BUTTON (Evades cursor and shrinks) */}
                {noHoverCount < 8 ? (
                  <motion.button
                    onMouseEnter={handleHoverNo}
                    onClick={handleHoverNo}
                    animate={{
                      x: noButtonPos.x,
                      y: noButtonPos.y,
                      scale: Math.max(0.65, 1 - noHoverCount * 0.05),
                      opacity: Math.max(0.4, 1 - noHoverCount * 0.05),
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 15 }}
                    id="accept-no-button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-sans text-xs font-normal px-5 py-3 rounded-full cursor-pointer focus:outline-none whitespace-nowrap"
                  >
                    {pleadText}
                  </motion.button>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    onClick={triggerCelebration}
                    className="bg-pink-300 text-white font-sans text-xs font-medium px-5 py-3 rounded-full animate-bounce cursor-pointer"
                  >
                    Alright, I give up! Click YES ❤️
                  </motion.button>
                )}
              </div>
            </div>

          </motion.div>
        ) : (
          /* CELEBRATION / APOLOGY ACCEPTED DISPLAY SCREEN */
          <motion.div
            key="celebration-card"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-emerald-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-emerald-50 text-center relative overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100"
              >
                <Heart className="w-10 h-10 fill-current text-white animate-heartbeat" />
              </motion.div>

              <span className="font-sans text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 font-bold uppercase tracking-widest">
                Mutual Love Restored! 🎉
              </span>
              
              <h3 className="font-serif text-3xl md:text-5xl text-gray-800 mt-4 mb-4">
                Thank You, Darshuu!
              </h3>

              <div className="max-w-md mx-auto bg-stone-50 border border-stone-200/60 p-6 rounded-2xl mb-8">
                <p className="font-hand text-2xl text-stone-700 leading-relaxed italic">
                  "Your huge heart is the greatest gift, Darshuu. Bandar is officially the happiest person on earth! Today is a new chapter of patience, better listening, infinite laughter, and deeper connections."
                </p>
                <p className="font-sans text-[11px] text-gray-400 mt-4 tracking-widest uppercase">
                  Contract sealed in both your hearts
                </p>
              </div>

              {/* Interactive Coupon Code Reminder */}
              <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl max-w-sm mx-auto mb-8">
                <p className="font-sans text-xs text-emerald-800 font-semibold mb-1">
                  🎁 BONUS FORGIVENESS GIFT
                </p>
                <p className="font-sans text-[11px] text-emerald-600 text-center">
                  Claim your relationship vouchers on the tab above! Use code <strong className="font-mono">FOREVER_DARSHUU</strong> for infinite pampering.
                </p>
              </div>

              {/* Reset to see animation again */}
              <button
                onClick={resetAll}
                id="reset-forgiveness-button"
                className="text-gray-400 hover:text-rose-500 font-sans text-xs flex items-center gap-1.5 mx-auto transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-read or change options
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
