import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Music, Star, ArrowDown, Mail, PenTool } from 'lucide-react';
import MusicPlayer from './components/MusicPlayer';
import ApologyEnvelope from './components/ApologyEnvelope';
import InteractivePromises from './components/InteractivePromises';
import ForgivenessModule from './components/ForgivenessModule';
import AdminPanel from './components/AdminPanel';
import { trackTimeSpent, addActivityLog } from './utils/tracker';

export default function App() {
  const [isLetterOpened, setIsLetterOpened] = useState(false);

  // Active quiet time tracker and session starter logger
  useEffect(() => {
    addActivityLog("Landed on Private Sanctuary / Session started");
    
    const interval = setInterval(() => {
      trackTimeSpent(1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="romantic-grid-bg min-h-screen pb-24 text-gray-800 font-sans relative overflow-x-hidden selection:bg-rose-100 selection:text-rose-700">
      
      {/* Sparkly corner visual decorations (Aesthetic Pairings) */}
      <div className="absolute top-8 left-8 text-rose-200 pointer-events-none select-none hidden lg:block">
        <Heart className="w-12 h-12 fill-current opacity-20 rotate-12" />
        <Star className="w-6 h-6 fill-current text-pink-200 opacity-40 ml-12 animate-pulse" />
      </div>
      <div className="absolute top-20 right-12 text-rose-200 pointer-events-none select-none hidden lg:block">
        <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '8s', opacity: 0.25 }} />
      </div>

      {/* Primary Header Hero Selection */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/65 hover:bg-white border border-rose-100 rounded-full shadow-sm text-xs font-semibold text-rose-500 uppercase tracking-widest mb-4 transition-colors"
        >
          <Heart className="w-3.5 h-3.5 fill-current text-rose-500 animate-heartbeat" />
          A Private Sanctuary for Darshuu
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl text-gray-900 tracking-tight leading-tight"
        >
          Darshuu & Bandar's <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 italic font-normal">
            Path of Love & Sincerity
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 text-xs md:text-sm text-gray-500 font-normal max-w-xl mx-auto px-4 leading-relaxed"
        >
          Apologies aren't just words; they are attempts to listen closer, understand deeper, and protect what is sacred. Bandar made this cozy room for you, Darshuu.
        </motion.p>
      </header>

      {/* Ambient Synthesizer Background Control */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4"
      >
        <MusicPlayer />
      </motion.section>

      {/* STEP 1: WAX SEALED ENVELOPE */}
      <section className="relative my-6">
        <ApologyEnvelope onOpen={() => setIsLetterOpened(true)} />
      </section>

      {/* STEP 2: HANDWRITTEN LETTER & MEMORY GRID & FORGIVENESS MODULE */}
      <AnimatePresence>
        {isLetterOpened && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="px-4 relative z-10"
          >
            
            {/* Elegant Separator */}
            <div className="flex flex-col items-center justify-center my-12 text-rose-300">
              <motion.div 
                animate={{ y: [0, 6, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-rose-400">
                  Scroll down to read
                </span>
                <ArrowDown className="w-4 h-4" />
              </motion.div>
            </div>

            {/* HANDWRITTEN STATIONERY CARD */}
            <div id="handwritten-letter-card" className="max-w-2xl mx-auto bg-[#fbf9f5] border border-stone-200/50 p-8 md:p-12 rounded-3xl shadow-lg relative overflow-hidden my-12">
              {/* Notebook rule lines decoration */}
              <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)',
                  backgroundSize: '100% 24px',
                  lineHeight: '24px'
                }}
              />
              
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-rose-50 rounded-full blur-2xl opacity-65" />
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-amber-50 rounded-full blur-2xl opacity-65" />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-[10px] text-stone-400 border border-stone-300/40 px-3 py-1 rounded-full uppercase tracking-wider">
                    Hand-crafted Stationery
                  </span>
                  <div className="flex gap-1 text-amber-500">
                    <PenTool className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-stone-800 mb-6 italic border-b border-stone-200/50 pb-3">
                  My Dearest Darshuu,
                </h3>

                <div className="font-serif text-base md:text-lg text-stone-700 leading-relaxed space-y-6 md:space-y-8 italic">
                  <p>
                    Writing this is not easy, but owning up to my clumsiness is. I constructed this small visual corner with the absolute deepest respect and sincerest intentions, because simple texts felt flat.
                  </p>
                  <p>
                    I know my recent actions caused frustration and took away your wonderful smile. Knowing that I am the reason you felt heavy or upset breaks my heart. You deserve the absolute purest care, warmth, and constant protection—and I deeply regret falling short of that standard.
                  </p>
                  <p>
                    You are my grounding force, my favorite conversation partner, and the absolute highlight of my days. Our memories and our bond are far too beautiful and precious to let a temporary slip-up disrupt. I am fully committed to learning from this, listening harder, and speaking with gentler patience.
                  </p>
                  <p>
                    Please browse the tabs below, draw a note from the apologize jar, review my commitments, and redeem the coupons I made especially for you. And when you are ready, use the controls below to let me know if we can start a new chapter together.
                  </p>
                </div>

                <div className="mt-10 pt-8 border-t border-stone-200/50 flex flex-col items-end">
                  <span className="font-sans text-xs text-stone-400 font-medium">With devotion and deep regret,</span>
                  <span className="font-hand text-4xl text-rose-500 mt-2">Bandar</span>
                </div>
              </div>
            </div>

            {/* BENTO SECTION: INTERACTIVE TABS, JAR, & COUPONS */}
            <InteractivePromises />

            {/* THE FORGIVENESS CENTRE AND OUTCOMES */}
            <ForgivenessModule />

          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual footer details */}
      <footer className="w-full text-center mt-12 px-4 select-none">
        <div className="h-[1px] w-48 bg-rose-100/60 mx-auto mb-4" />
        <p className="font-serif text-sm text-gray-400 flex items-center justify-center gap-1.5 italic font-normal">
          Designed with infinite hope & devotion by Bandar for Darshuu <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
        </p>
      </footer>

      {/* Admin Panel Console */}
      <AdminPanel />

    </div>
  );
}
