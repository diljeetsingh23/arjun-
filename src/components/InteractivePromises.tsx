import React, { useState } from 'react';
import { Gift, ShieldCheck, Heart, Sparkles, Check, Send, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Coupon, PromiseItem, MessageCard } from '../types';
import { trackClick, trackVoucherRedeemed } from '../utils/tracker';

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c2',
    title: "Infinite Late Night Ice Cream & Hugs",
    description: "Good for one middle-of-the-night ice cream run. Fits any mood, anytime you need comfort.",
    emoji: "🍦",
    code: "SWEET_DARSHUU",
    redeemed: false,
  },
  {
    id: 'c3',
    title: "A Day of Zero Errands & Spa Attention",
    description: "I will do 100% of the household chores while you relax, read, or watch movies. Your wishes are commands.",
    emoji: "💆‍♀️",
    code: "REST_DARSHUU",
    redeemed: false,
  },
  {
    id: 'c4',
    title: "The Ultimate 'Melt All Anger' Warm Hug",
    description: "Instantly redeemable. One extra long hug (minimum 5 minutes) until all the frustration melts away.",
    emoji: "🫂",
    code: "WARMTH_BANDAR",
    redeemed: false,
  },
];

const PROMISES: PromiseItem[] = [
  {
    id: 'p1',
    title: "Listen with a full heart & calm mind",
    description: "No interrupting, no defensive arguments. Just understanding your perspective.",
    iconName: "ShieldCheck",
    status: "promised",
  },
  {
    id: 'p2',
    title: "Check in on your day, every day",
    description: "Sending sweet updates or asking how you are doing, ensuring you always feel cared for.",
    iconName: "Heart",
    status: "promised",
  },
  {
    id: 'p3',
    title: "Keep communication clear and honest",
    description: "Sharing feelings openly so we both grow stronger together without any misunderstandings.",
    iconName: "Sparkles",
    status: "promised",
  },
];

const SORRY_MESSAGES: MessageCard[] = [
  {
    id: 'sm1',
    message: "Darshuu, you have the most infectious laugh, and my world is instantly brighter when you smile. I am so sorry for taking that for granted.",
    category: "sincere",
  },
  {
    id: 'sm2',
    message: "I realize that sometimes I can be a bit clumsy with my words. But my intention is always to cherish, protect, and love you.",
    category: "sweet",
  },
  {
    id: 'sm3',
    message: "No matter how much space you need, I am right here waiting to hold your hand and build our bridge back even stronger.",
    category: "promise",
  },
  {
    id: 'sm4',
    message: "I promise to be more patient and understanding. Your peace of mind means absolutely everything to me.",
    category: "sincere",
  },
  {
    id: 'sm5',
    message: "I'd climb any mountain or buy every strawberry chocolate in town just to make you giggle again! Please forgive your Bandar.",
    category: "funny",
  },
  {
    id: 'sm6',
    message: "You're my person, my favorite notification, and the sweetest part of every single day. I'm empty without you, Darshuu.",
    category: "sweet",
  },
];

export default function InteractivePromises() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [jarMessage, setJarMessage] = useState<MessageCard | null>(null);
  const [jarOpening, setJarOpening] = useState(false);
  const [activeTab, setActiveTab] = useState<'jar' | 'coupons' | 'promises'>('jar');

  const handleDrawMessage = () => {
    trackClick('jarDraw');
    setJarOpening(true);
    const randomIndex = Math.floor(Math.random() * SORRY_MESSAGES.length);
    setTimeout(() => {
      setJarMessage(SORRY_MESSAGES[randomIndex]);
      setJarOpening(false);
    }, 600);
  };

  const handleRedeemCoupon = (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (coupon) {
      trackClick('couponClaimed');
      trackVoucherRedeemed(coupon.title, coupon.code);
    }
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, redeemed: true } : c));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 select-none">
      
      {/* Tab Selectors */}
      <div className="flex justify-center gap-2 md:gap-4 mb-10 border-b border-rose-100 pb-4">
        {[
          { id: 'jar', label: '🌸 Sorry & Compliment Jar', icon: Heart },
          { id: 'coupons', label: '🎟️ Darshuu\'s Coupons', icon: Gift },
          { id: 'promises', label: '🤝 Bandar\'s Commitments', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                isSelected 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-100' 
                  : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {/* COMPLIMENT JAR */}
        {activeTab === 'jar' && (
          <motion.div
            key="jar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <div className="max-w-md mx-auto">
              <h3 className="font-serif text-2xl text-gray-800 mb-2">Darshuu's Heartwarming Jar</h3>
              <p className="font-sans text-xs text-gray-500 mb-8">
                Whenever you feel a bit doubtful or want to read why you mean the world to Bandar, click the jar to draw out a sweet, heartfelt note.
              </p>
            </div>

            <div className="relative mb-8 cursor-pointer flex justify-center" onClick={handleDrawMessage}>
              
              {/* Spinning/pulsing aura */}
              <div className="absolute inset-0 bg-pink-100 rounded-full blur-3xl opacity-40 scale-75 animate-pulse" />

              {/* Glass Jar Body */}
              <motion.div
                animate={jarOpening ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="relative w-44 h-56 bg-gradient-to-b from-white/30 to-rose-100/40 border-4 border-rose-200 rounded-b-[40px] rounded-t-[20px] shadow-lg flex flex-col items-center justify-center p-4"
              >
                {/* Gold Metal Cap */}
                <div className="absolute top-0 -mt-3.5 w-24 h-6 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 border border-amber-300 rounded-md shadow-sm z-10" />
                
                {/* Inside Heart Particles */}
                <div className="absolute inset-x-4 top-6 bottom-4 flex flex-wrap gap-2 items-center justify-center pointer-events-none opacity-40">
                  <Heart className="w-5 h-5 text-rose-400 fill-current" />
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-current" />
                  <Heart className="w-4 h-4 text-rose-300 fill-current" />
                </div>

                <div className="z-10 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center border border-pink-200">
                    <Heart className="w-8 h-8 text-rose-500 fill-current animate-heartbeat" />
                  </div>
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-rose-400 mt-3 select-none">
                    TAP ME
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Dispensed Message Box */}
            <div className="w-full max-w-lg min-h-[140px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {jarMessage ? (
                  <motion.div
                    key={jarMessage.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-stone-50 border border-stone-200/60 p-6 rounded-2xl shadow-sm text-center relative"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 border border-stone-200 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider text-rose-500">
                      {jarMessage.category} message
                    </div>
                    
                    <p className="font-hand text-2xl text-gray-700 italic leading-relaxed">
                      "{jarMessage.message}"
                    </p>

                    <div className="mt-4 flex justify-center gap-1 text-amber-500">
                      <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    className="text-gray-400 font-sans text-sm italic"
                  >
                    "Click the Jar above to receive a sweet reminder of how loved you are..."
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* RECONCILIATION COUPONS */}
        {activeTab === 'coupons' && (
          <motion.div
            key="coupons"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {coupons.map(coupon => (
              <motion.div
                key={coupon.id}
                whileHover={{ y: -3 }}
                className={`border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-colors bg-white ${
                  coupon.redeemed 
                    ? 'border-gray-200 bg-gray-50/50' 
                    : 'border-pink-100 shadow-sm shadow-rose-50'
                }`}
              >
                {/* Ticket cutouts on the edges */}
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#fffbfa] border-r border-[#ffe4e6] rounded-full z-10" />
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#fffbfa] border-l border-[#ffe4e6] rounded-full z-10" />

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-3xl">{coupon.emoji}</span>
                    <span className="font-mono text-xs text-rose-500 font-semibold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                      VOUCHER
                    </span>
                  </div>

                  <h4 className="font-sans font-bold text-gray-800 text-lg mb-2">{coupon.title}</h4>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed mb-4">{coupon.description}</p>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-100 mt-4 flex items-center justify-between">
                  {coupon.redeemed ? (
                    <div className="w-full">
                      <div className="flex items-center gap-1 text-emerald-600 font-sans text-xs font-semibold uppercase tracking-wider mb-1.5">
                        <Check className="w-3.5 h-3.5" /> Redeemed Successfully!
                      </div>
                      <div className="bg-gray-100 border border-gray-200 text-gray-600 rounded-lg p-2 font-mono text-center text-xs select-all">
                        CODE: {coupon.code}
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="font-sans text-[10px] text-gray-400">Unlock to retrieve coupon code</span>
                      <button
                        onClick={() => handleRedeemCoupon(coupon.id)}
                        id={`redeem-${coupon.id}`}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-sans text-xs font-semibold px-4 py-2 rounded-full shadow-sm select-none transition-all transform hover:scale-105"
                      >
                        Claim Voucher
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* SINCERE COMMITMENTS */}
        {activeTab === 'promises' && (
          <motion.div
            key="promises"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-pink-100 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto"
          >
            <h3 className="font-serif text-2xl text-center text-gray-800 mb-2">Bandar's Forever Prompts</h3>
            <p className="font-sans text-xs text-center text-gray-500 mb-8 max-w-md mx-auto">
              Real apologies are coupled with real changes. Bandar has committed to keeping these promises as baseline rules in your shared path.
            </p>

            <div className="space-y-6">
              {PROMISES.map((item, index) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-bold text-gray-800 text-sm md:text-base">{item.title}</h4>
                      <span className="text-[10px] font-sans font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 uppercase tracking-widest">
                        COMMITTED
                      </span>
                    </div>
                    <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sincere Signature Card */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <span className="font-sans text-xs text-gray-400 block mb-2">Signed with absolute devotion</span>
              <p className="font-hand text-3xl text-rose-500">Bandar</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
