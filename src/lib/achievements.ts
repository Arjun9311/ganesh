export interface AchievementDef {
  key: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  {
    key: 'FIRST_VIGHNA',
    name: 'First Vighna Removed',
    description: 'Strike and destroy your first obstacle with divine force.',
    icon: 'Hammer',
    isUnlocked: true,
    unlockedAt: '2026-09-15T10:00:00Z'
  },
  {
    key: 'MODAK_MASTER',
    name: 'Modak Master',
    description: 'Collect 50 delicious modaks on the festival path.',
    icon: 'Sparkles',
    isUnlocked: true,
    unlockedAt: '2026-09-15T10:20:00Z'
  },
  {
    key: 'GOLDEN_BLESSING',
    name: 'Golden Blessing',
    description: 'Collect a rare Golden Modak and activate Divine Mode.',
    icon: 'Sun',
    isUnlocked: true,
    unlockedAt: '2026-09-16T08:15:00Z'
  },
  {
    key: 'MUSHIKA_MASTER',
    name: 'Mushika Master',
    description: 'Ride alongside faithful Mushika for 10 speed boosts.',
    icon: 'Zap',
    isUnlocked: false
  },
  {
    key: 'COMBO_KING',
    name: 'Combo King',
    description: 'Achieve a continuous combo multiplier of x10 or higher.',
    icon: 'Flame',
    isUnlocked: false
  },
  {
    key: 'STORM_BREAKER',
    name: 'Storm Breaker',
    description: 'Navigate through the Monsoon Festival storm hazards.',
    icon: 'CloudLightning',
    isUnlocked: false
  },
  {
    key: '108_COMPLETE',
    name: '108 Vighnas Conqueror',
    description: 'Overcome all 108 obstacles and reach the final milestone.',
    icon: 'Crown',
    isUnlocked: false
  },
  {
    key: 'VIGHNAHARTA',
    name: 'The True Vighnaharta',
    description: 'Defeat the Final Vighna and complete the divine journey.',
    icon: 'Award',
    isUnlocked: false
  }
];

const ACHIEVEMENTS_STORAGE_KEY = 'vighnaharta_unlocked_achievements';

export function getUnlockedAchievements(): Record<string, string> {
  if (typeof window === 'undefined') return { 'FIRST_VIGHNA': '2026-09-15T10:00:00Z', 'MODAK_MASTER': '2026-09-15T10:20:00Z', 'GOLDEN_BLESSING': '2026-09-16T08:15:00Z' };
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { 'FIRST_VIGHNA': '2026-09-15T10:00:00Z', 'MODAK_MASTER': '2026-09-15T10:20:00Z', 'GOLDEN_BLESSING': '2026-09-16T08:15:00Z' };
}

export function unlockAchievement(key: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getUnlockedAchievements();
  if (current[key]) return false; // Already unlocked

  current[key] = new Date().toISOString();
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(current));
  } catch {}
  return true;
}

export function getAchievementsList(): AchievementDef[] {
  const unlocked = getUnlockedAchievements();
  return ALL_ACHIEVEMENTS.map(ach => ({
    ...ach,
    isUnlocked: Boolean(unlocked[ach.key]),
    unlockedAt: unlocked[ach.key] || undefined
  }));
}
