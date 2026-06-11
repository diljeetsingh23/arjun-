import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Activity, Clock, Heart, Sliders, Music, Ticket, RotateCcw, ShieldCheck, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTrackerStats, resetTrackerStats, TrackerStats } from '../utils/tracker';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState<TrackerStats | null>(null);

  // Safe fallback definitions in case any array/nested property inside live tracker is empty or missing
  const clicks = stats?.clicks || {
    musicPlayPause: 0,
    musicMute: 0,
    waxLetterOpen: 0,
    jarDraw: 0,
    couponClaimed: 0,
    noHoverCount: 0,
    yesForgiveClaim: 0,
    totalClicks: 0
  };
  const redeemedVouchers = stats?.redeemedVouchers || [];
  const tensionHistory = stats?.tensionHistory || [];
  const activityLogs = stats?.activityLogs || [];

  // Sync state with actual localStorage tracker
  useEffect(() => {
    // Load initial stats
    setStats(getTrackerStats());

    // Listen to custom tracker update events
    const handleStatsUpdate = (event: any) => {
      if (event.detail) {
        setStats(event.detail);
      }
    };

    window.addEventListener('darshuu_tracker_update', handleStatsUpdate);

    // Fallback polling interval to ensure instantaneous local storage synchronization
    const pollInterval = setInterval(() => {
      setStats(getTrackerStats());
    }, 1000);

    return () => {
      window.removeEventListener('darshuu_tracker_update', handleStatsUpdate);
      clearInterval(pollInterval);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'arjun' && password === '2306') {
      setIsLoggedIn(true);
      setLoginError('');
      // Force reload stats just to make sure
      setStats(getTrackerStats());
    } else {
      setLoginError('Incorrect Username or Pass. Please try again!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to completely reset Darshuu's interaction tracking statistics?")) {
      resetTrackerStats();
      setStats(getTrackerStats());
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0 seconds';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(`${hrs} hour${hrs > 1 ? 's' : ''}`);
    if (mins > 0) parts.push(`${mins} minute${mins > 1 ? 's' : ''}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} second${secs > 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  return (
    <div id="admin-panel-outer" className="w-full max-w-4xl mx-auto px-4 mt-16 pb-12">
      <div className="border border-stone-200/80 bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm md:p-6 transition-all duration-300">
        
        {/* Toggle Panel Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className={`w-4 h-4 ${isLoggedIn ? 'text-emerald-500' : 'text-stone-400'}`} />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-stone-500">
              {isLoggedIn ? "Arjun's Live Tracking Dashboard" : "Sincerity System Gate"}
            </span>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="admin-collapsible-trigger"
            className="text-xs font-sans font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            {isOpen ? "Hide Panel" : "Expand Sincerity Console"}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-5 pt-5 border-t border-dashed border-stone-200"
            >
              {!isLoggedIn ? (
                /* LOGIN SCREEN (SQUARE BOX AS REQUESTED) */
                <div className="max-w-xs mx-auto py-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                    <div className="w-10 h-10 bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center mb-3">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-lg text-gray-800 font-medium mb-1 text-center">Admin Access</h4>
                    <p className="font-sans text-[11px] text-gray-400 text-center mb-4">
                      Enter credentials to monitor her live session progress and metrics.
                    </p>

                    <form onSubmit={handleLogin} className="w-full space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="arjun"
                          className="w-full px-3 py-1.5 text-xs font-sans border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white"
                          id="admin-user-input"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Pass
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••"
                            className="w-full px-3 py-1.5 text-xs font-mono border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white"
                            id="admin-pass-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {loginError && (
                        <p className="text-[10px] font-sans font-medium text-red-500 text-center">
                          {loginError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-sans font-semibold tracking-wider transition-colors cursor-pointer"
                        id="admin-login-button"
                      >
                        Sign In
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                /* LIVE ADMIN STATS PANEL DASHBOARD DISPLAY */
                stats && (
                  <div className="space-y-6">
                    
                    {/* Header Summary Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-stone-50 border border-stone-200/60 p-4 rounded-xl">
                      <div>
                        <p className="text-xs text-stone-400">Current Apology Acceptance Status</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {stats.isForgiven ? (
                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 select-none">
                              <CheckCircle className="w-4 h-4 text-emerald-500 fill-current" /> Forgiven! Happy Reunion ❤️
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1 select-none animate-pulse">
                              <AlertTriangle className="w-4 h-4 text-amber-500 fill-current" /> Waiting for Decision...
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-1 text-[11px] font-sans font-semibold text-stone-500 hover:text-rose-600 bg-stone-100 hover:bg-rose-50 border border-stone-200 hover:border-rose-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.2 h-3.2" /> Reset Session Stats
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-1 text-[11px] font-sans font-semibold text-stone-500 hover:text-gray-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.2 h-3.2" /> Sign Out
                        </button>
                      </div>
                    </div>

                    {/* Numeric Bento-like Grid Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      <div className="bg-stone-50/50 border border-stone-100 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2.5 bg-rose-50 rounded-lg text-rose-500">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest leading-none">Time Spent</p>
                          <p className="text-xs font-semibold text-gray-800 mt-1.5 line-clamp-1">{formatTime(stats ? stats.totalTimeSpent : 0)}</p>
                        </div>
                      </div>

                      <div className="bg-stone-50/50 border border-stone-100 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-500">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest leading-none">Total Clicks</p>
                          <p className="text-sm font-bold text-gray-800 mt-1">{clicks.totalClicks} interaction clicks</p>
                        </div>
                      </div>

                      <div className="bg-stone-50/50 border border-stone-100 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-lg text-amber-500">
                          <Sliders className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest leading-none">Escapes (No button)</p>
                          <p className="text-sm font-bold text-gray-800 mt-1">{clicks.noHoverCount} hovers</p>
                        </div>
                      </div>

                      <div className="bg-stone-50/50 border border-stone-100 p-3 rounded-xl flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 rounded-lg text-pink-500">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest leading-none">Envelope State</p>
                          <p className="text-sm font-bold text-gray-800 mt-1">{clicks.waxLetterOpen > 0 ? "Opened" : "Never Opened"}</p>
                        </div>
                      </div>

                    </div>

                    {/* Detailed Layout - Logs & History */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      
                      {/* Left Side: Click items breakdown table & Vouchers */}
                      <div className="space-y-4">
                        <div className="bg-stone-50/20 border border-rose-100/50 rounded-xl p-4">
                          <h5 className="font-sans font-bold text-xs text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-rose-500" /> Interaction Counters
                          </h5>
                          
                          <div className="space-y-2 font-mono text-[11px] text-gray-600">
                            <div className="flex justify-between border-b border-stone-100 pb-1.5">
                              <span>🎧 Toggled Music:</span>
                              <span className="font-bold text-gray-800">{clicks.musicPlayPause}</span>
                            </div>
                            <div className="flex justify-between border-b border-stone-100 pb-1.5">
                              <span>🔇 Muted Music:</span>
                              <span className="font-bold text-gray-800">{clicks.musicMute}</span>
                            </div>
                            <div className="flex justify-between border-b border-stone-100 pb-1.5">
                              <span>🌸 Opened Wax Envelope:</span>
                              <span className="font-bold text-gray-800">{clicks.waxLetterOpen}</span>
                            </div>
                            <div className="flex justify-between border-b border-stone-100 pb-1.5">
                              <span>🍯 Drew Notes from Jar:</span>
                              <span className="font-bold text-gray-800">{clicks.jarDraw}</span>
                            </div>
                            <div className="flex justify-between border-b border-stone-100 pb-1.5">
                              <span>🎟️ Claimed coupons count:</span>
                              <span className="font-bold text-gray-800">{clicks.couponClaimed}</span>
                            </div>
                          </div>
                        </div>

                        {/* Claimed Relationship Vouchers list */}
                        <div className="bg-stone-50/20 border border-emerald-100/50 rounded-xl p-4">
                          <h5 className="font-sans font-bold text-xs text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Ticket className="w-3.5 h-3.5 text-emerald-500" /> Redeemed Relationship Vouchers
                          </h5>

                          {redeemedVouchers.length === 0 ? (
                            <p className="text-xs text-gray-400 italic font-sans py-1">No coupons have been unlocked yet...</p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                              {redeemedVouchers.map((code) => {
                                let titleStr = "Couponclaimed";
                                if (code === 'SWEET_DARSHUU') titleStr = "🍦 Late Night Ice Cream";
                                if (code === 'REST_DARSHUU') titleStr = "💆‍♀️ Zero Errands Day";
                                if (code === 'WARMTH_BANDAR') titleStr = "🫂 Warm Hug Coupon";
                                return (
                                  <span key={code} className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                                    {titleStr} ({code})
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Slider tension meter adjustment records */}
                        <div className="bg-stone-50/20 border border-indigo-100/50 rounded-xl p-4">
                          <h5 className="font-sans font-bold text-xs text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Forgiveness Meter History
                          </h5>
                          {tensionHistory.length === 0 ? (
                            <p className="text-xs text-gray-400 italic font-sans py-1">She hasn't touched the anger/tension slider yet.</p>
                          ) : (
                            <div className="max-h-[100px] overflow-y-auto space-y-1 font-mono text-[10px] text-stone-500 pr-1">
                              {/* Display top 10 reverse cron */}
                              {[...tensionHistory].reverse().map((record, i) => (
                                <div key={i} className="flex justify-between border-b border-stone-50 py-0.5">
                                  <span>Tension dial set to {record.value}%</span>
                                  <span>at {record.timestamp}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Right Side: Streaming Activity Logs */}
                      <div className="bg-stone-50/20 border border-stone-200/80 rounded-xl p-4 flex flex-col h-full">
                        <h5 className="font-sans font-bold text-xs text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Live Streaming Activity Log
                        </h5>

                        {activityLogs.length === 0 ? (
                          <div className="flex-1 flex items-center justify-center py-10">
                            <p className="text-xs text-gray-400 italic font-sans">No interactions logged yet...</p>
                          </div>
                        ) : (
                          <div className="flex-1 max-h-[300px] overflow-y-auto space-y-2 pr-1 font-mono text-[10px]">
                            {/* Reverse chron logs */}
                            {[...activityLogs].reverse().map((log, idx) => (
                              <div key={idx} className="flex items-start gap-1 pb-1 border-b border-stone-100">
                                <span className="text-rose-400 font-bold shrink-0">[{log.timestamp}]</span>
                                <span className="text-gray-600 font-sans leading-tight">{log.action}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
