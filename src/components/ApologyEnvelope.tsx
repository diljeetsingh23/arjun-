import React, { useState } from 'react';
import { Mail, MailOpen, Heart, Sparkles, Feather } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackClick } from '../utils/tracker';

interface EnvelopeProps {
  onOpen: () => void;
}

export default function ApologyEnvelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      trackClick('waxLetterOpen');
    }
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 1200); // Give time for animations to run before scrolling/showing subsequent grid elements
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[450px] px-4 py-8">
      <div className="relative w-full max-w-lg">
        
        {/* Sparkles Floating Behind Envelope */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Envelope Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-white border border-pink-100 p-8 md:p-10 rounded-3xl shadow-xl shadow-rose-100/50 text-center"
        >
          <div className="absolute top-4 right-4 flex gap-1 text-pink-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-gray-800 font-normal italic tracking-wide mb-3">
            To Darshuu
          </h2>
          
          <p className="font-sans text-sm text-rose-500 font-medium tracking-widest uppercase mb-8">
            A Sincere Message Awaits Your Hearts
          </p>

          {/* Interactive Envelope Illustration */}
          <div className="relative w-64 h-48 mx-auto my-8 flex items-center justify-center cursor-pointer select-none" onClick={handleOpen}>
            
            {/* The Backplate of Envelope */}
            <div className="absolute inset-0 bg-pink-50 border-2 border-red-100 rounded-2xl shadow-inner flex items-end p-4 justify-center" />

            {/* Letter Inside Sliding out */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -80, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute w-[90%] h-36 bg-stone-50 border border-amber-100 shadow-md rounded-lg p-3 z-10 flex flex-col items-center justify-center"
                >
                  <div className="w-6 h-[1.5px] bg-amber-200 mb-1" />
                  <p className="font-hand text-lg text-amber-800 leading-none">Dearest Darshuu...</p>
                  <p className="text-[10px] font-sans text-stone-400 mt-1">Please read this message</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Envelope Triangles & Folds */}
            <div className="absolute inset-x-0 bottom-0 top-[40%] bg-pink-100 rounded-b-2xl border-t border-pink-200/50 clip-path-envelope z-20" 
              style={{
                clipPath: 'polygon(0% 100%, 50% 35%, 100% 100%)',
                background: 'linear-gradient(135deg, #ffe4e6 0%, #ffd1d3 100%)'
              }}
            />
            <div className="absolute inset-x-0 bottom-0 top-0 rounded-2xl pointer-events-none z-20"
              style={{
                background: 'linear-gradient(to right, rgba(254,205,211,0.25) 0%, transparent 15%, transparent 85%, rgba(254,205,211,0.25) 100%)',
                border: '2px solid rgba(254,205,211,0.6)'
              }}
            />

            {/* Envelope Top Lip / Seal */}
            {!isOpen ? (
              <motion.div
                className="absolute inset-x-0 top-0 h-28 bg-rose-100 border-b border-rose-200 origin-top z-30"
                style={{
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                }}
              />
            ) : (
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 180 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-x-0 top-0 h-28 bg-rose-50 border-b border-rose-100 origin-top z-10"
                style={{
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  transformStyle: 'preserve-3d'
                }}
              />
            )}

            {/* Glowing Wax Heart Seal */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="absolute z-40 bg-pink-500 text-white rounded-full p-4 shadow-xl flex items-center justify-center border-4 border-pink-100"
                  style={{ top: '35%' }}
                >
                  <Heart className="w-8 h-8 fill-current text-white animate-heartbeat" />
                  <div className="absolute font-serif text-[11px] font-semibold text-rose-100 uppercase tracking-widest mt-1">
                    B + D
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Helper Tips */}
          <p className="font-sans text-xs text-gray-400 max-w-sm mx-auto mt-4">
            {!isOpen 
              ? "Darshuu, please tap the pink heart wax seal to open Bandar's handwritten letter." 
              : "Opening the envelope... Preparing the message."}
          </p>

          <AnimatePresence>
            {!isOpen && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-6 inline-flex items-center gap-1.5 text-xs text-rose-500 font-semibold bg-rose-50 px-3 py-1 rounded-full border border-rose-100 animate-pulse"
              >
                <Feather className="w-3.5 h-3.5" /> Hand-crafted with absolute sincerity
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
