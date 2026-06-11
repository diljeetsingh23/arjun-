// Custom statistical tracker for user interactions
export interface TrackerStats {
  totalTimeSpent: number; // in seconds
  clicks: {
    musicPlayPause: number;
    musicMute: number;
    waxLetterOpen: number;
    jarDraw: number;
    couponClaimed: number;
    noHoverCount: number;
    yesForgiveClaim: number;
    totalClicks: number;
  };
  tensionHistory: Array<{ value: number; timestamp: string }>;
  redeemedVouchers: string[];
  isForgiven: boolean;
  activityLogs: Array<{ action: string; timestamp: string }>;
  lastUpdated: string;
}

const STORAGE_KEY = "darshuu_bandar_apology_tracker_v3";

const DEFAULT_STATS: TrackerStats = {
  totalTimeSpent: 0,
  clicks: {
    musicPlayPause: 0,
    musicMute: 0,
    waxLetterOpen: 0,
    jarDraw: 0,
    couponClaimed: 0,
    noHoverCount: 0,
    yesForgiveClaim: 0,
    totalClicks: 0
  },
  tensionHistory: [],
  redeemedVouchers: [],
  isForgiven: false,
  activityLogs: [],
  lastUpdated: new Date().toISOString()
};

export const getTrackerStats = (): TrackerStats => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) || {};
      return {
        totalTimeSpent: typeof parsed.totalTimeSpent === 'number' ? parsed.totalTimeSpent : 0,
        clicks: {
          musicPlayPause: parsed.clicks?.musicPlayPause ?? 0,
          musicMute: parsed.clicks?.musicMute ?? 0,
          waxLetterOpen: parsed.clicks?.waxLetterOpen ?? 0,
          jarDraw: parsed.clicks?.jarDraw ?? 0,
          couponClaimed: parsed.clicks?.couponClaimed ?? 0,
          noHoverCount: parsed.clicks?.noHoverCount ?? 0,
          yesForgiveClaim: parsed.clicks?.yesForgiveClaim ?? 0,
          totalClicks: parsed.clicks?.totalClicks ?? 0,
        },
        tensionHistory: Array.isArray(parsed.tensionHistory) ? parsed.tensionHistory : [],
        redeemedVouchers: Array.isArray(parsed.redeemedVouchers) ? parsed.redeemedVouchers : [],
        isForgiven: !!parsed.isForgiven,
        activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : [],
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      };
    }
  } catch (e) {
    console.error("Error loading stats:", e);
  }
  return {
    totalTimeSpent: 0,
    clicks: {
      musicPlayPause: 0,
      musicMute: 0,
      waxLetterOpen: 0,
      jarDraw: 0,
      couponClaimed: 0,
      noHoverCount: 0,
      yesForgiveClaim: 0,
      totalClicks: 0
    },
    tensionHistory: [],
    redeemedVouchers: [],
    isForgiven: false,
    activityLogs: [],
    lastUpdated: new Date().toISOString()
  };
};

export const saveTrackerStats = (stats: TrackerStats) => {
  try {
    stats.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    // Dispatch a custom event so other components (e.g. AdminPanel) receive live updates!
    window.dispatchEvent(new CustomEvent("darshuu_tracker_update", { detail: stats }));
  } catch (e) {
    console.error("Error saving stats:", e);
  }
};

export const trackTimeSpent = (seconds = 1) => {
  const stats = getTrackerStats();
  stats.totalTimeSpent += seconds;
  saveTrackerStats(stats);
};

export const trackClick = (buttonType: keyof TrackerStats["clicks"]) => {
  const stats = getTrackerStats();
  if (stats.clicks[buttonType] !== undefined) {
    stats.clicks[buttonType]++;
  }
  stats.clicks.totalClicks++;
  
  // Add quick log of what happened
  let label = "Interacted with system";
  switch (buttonType) {
    case "musicPlayPause": label = "Toggled music playback state"; break;
    case "musicMute": label = "Toggled sound mute state"; break;
    case "waxLetterOpen": label = "Opened primary handwritten wax envelope"; break;
    case "jarDraw": label = "Drew a sweet message from Apology Jar"; break;
    case "couponClaimed": label = "Unlocked/claimed a relationship coupon"; break;
    case "noHoverCount": label = "Hovered/evaded No button in forgiveness test"; break;
    case "yesForgiveClaim": label = "Clicked YES - officially forgave Bandar"; break;
  }
  
  addActivityLog(label, stats);
};

export const trackTensionValue = (value: number) => {
  const stats = getTrackerStats();
  // Check if value is different from the last one in history to avoid spam
  const lastValObj = stats.tensionHistory[stats.tensionHistory.length - 1];
  if (!lastValObj || lastValObj.value !== value) {
    stats.tensionHistory.push({
      value,
      timestamp: new Date().toLocaleTimeString()
    });
    // Cap history length at 30 to stay performant and elegant
    if (stats.tensionHistory.length > 30) {
      stats.tensionHistory.shift();
    }
    addActivityLog(`Slid Forgiveness tension meter to ${value}%`, stats);
  }
};

export const trackVoucherRedeemed = (title: string, code: string) => {
  const stats = getTrackerStats();
  if (!stats.redeemedVouchers.includes(code)) {
    stats.redeemedVouchers.push(code);
    addActivityLog(`Claimed voucher: "${title}" (Code: ${code})`, stats);
  }
};

export const trackForgivenessStatus = (forgiven: boolean) => {
  const stats = getTrackerStats();
  stats.isForgiven = forgiven;
  if (forgiven) {
    trackClick("yesForgiveClaim");
  } else {
    addActivityLog("Re-entered or changed Decisions center", stats);
  }
};

export const addActivityLog = (action: string, statsObj?: TrackerStats) => {
  const stats = statsObj || getTrackerStats();
  stats.activityLogs.push({
    action,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });
  // Cap at 50 logs for beautiful scannability
  if (stats.activityLogs.length > 50) {
    stats.activityLogs.shift();
  }
  if (!statsObj) {
    saveTrackerStats(stats);
  }
};

export const resetTrackerStats = () => {
  saveTrackerStats({ ...DEFAULT_STATS });
};
