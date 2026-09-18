import { Profile, GameSession, PlayerStats, LeaderboardEntry, Achievement } from '@/types/database';
import { supabase, isSupabaseConfigured } from './supabase';

const PROFILE_KEY = 'vighnaharta_profile';
const SESSIONS_KEY = 'vighnaharta_sessions';
const STATS_KEY = 'vighnaharta_stats';
const ACHIEVEMENTS_KEY = 'vighnaharta_achievements';

// Default guest profile
const DEFAULT_PROFILE: Profile = {
  id: 'guest-player-001',
  username: 'Arjun Devotee',
  city: 'Mumbai',
  avatar: 'saffron',
  created_at: new Date().toISOString()
};

// Seed leaderboard data for high quality presentation
export const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user_id: 'seed-1', username: 'Aarav Sharma', avatar: 'golden', score: 28450, vighnas_destroyed: 108, max_combo: 14, city: 'Pune', created_at: '2026-09-15T18:30:00Z' },
  { rank: 2, user_id: 'seed-2', username: 'Priya Iyer', avatar: 'lotus', score: 24320, vighnas_destroyed: 96, max_combo: 12, city: 'Mumbai', created_at: '2026-09-16T04:15:00Z' },
  { rank: 3, user_id: 'seed-3', username: 'Rahul Varma', avatar: 'divine', score: 21840, vighnas_destroyed: 88, max_combo: 10, city: 'Hyderabad', created_at: '2026-09-16T08:00:00Z' },
  { rank: 4, user_id: 'seed-4', username: 'Kiran Patel', avatar: 'saffron', score: 19950, vighnas_destroyed: 75, max_combo: 9, city: 'Ahmedabad', created_at: '2026-09-16T09:20:00Z' },
  { rank: 5, user_id: 'seed-5', username: 'Sneha Deshmukh', avatar: 'golden', score: 17870, vighnas_destroyed: 69, max_combo: 8, city: 'Varanasi', created_at: '2026-09-16T10:45:00Z' },
  { rank: 6, user_id: 'seed-6', username: 'Vikram Joshi', avatar: 'lotus', score: 15400, vighnas_destroyed: 58, max_combo: 7, city: 'Bengaluru', created_at: '2026-09-16T11:10:00Z' },
  { rank: 7, user_id: 'seed-7', username: 'Ananya Rao', avatar: 'divine', score: 14200, vighnas_destroyed: 52, max_combo: 6, city: 'Delhi', created_at: '2026-09-16T11:40:00Z' },
  { rank: 8, user_id: 'seed-8', username: 'Devraj Kulkarni', avatar: 'saffron', score: 12850, vighnas_destroyed: 44, max_combo: 5, city: 'Jaipur', created_at: '2026-09-16T12:05:00Z' }
];

export function getStoredProfile(): Profile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PROFILE;
}

export function saveStoredProfile(profile: Profile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

export function getStoredPlayerStats(): PlayerStats {
  const profile = getStoredProfile();
  const defaultStats: PlayerStats = {
    user_id: profile.id,
    total_score: 18450,
    best_score: 12450,
    total_distance: 6800,
    total_vighnas: 74,
    total_modaks: 103,
    best_combo: 8,
    games_played: 3,
    updated_at: new Date().toISOString()
  };

  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultStats;
}

export function getStoredGameSessions(): GameSession[] {
  const profile = getStoredProfile();
  const defaultSessions: GameSession[] = [
    {
      id: 'sess-1',
      user_id: profile.id,
      score: 12450,
      distance: 3800,
      duration: 145,
      vighnas_destroyed: 74,
      modaks_collected: 103,
      powerups_collected: 5,
      max_combo: 8,
      weather: 'Sunny',
      environment: 'Festival Street',
      completed: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: 'sess-2',
      user_id: profile.id,
      score: 6000,
      distance: 3000,
      duration: 110,
      vighnas_destroyed: 35,
      modaks_collected: 54,
      powerups_collected: 2,
      max_combo: 5,
      weather: 'Sunset',
      environment: 'Temple Street',
      completed: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    }
  ];

  if (typeof window === 'undefined') return defaultSessions;
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultSessions;
}

export async function recordGameSession(session: Omit<GameSession, 'id' | 'created_at'>): Promise<GameSession> {
  const newSession: GameSession = {
    ...session,
    id: 'sess_' + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString()
  };

  // Update local sessions
  const sessions = getStoredGameSessions();
  sessions.unshift(newSession);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 50)));
    } catch {}
  }

  // Update player stats
  const stats = getStoredPlayerStats();
  stats.total_score += session.score;
  stats.best_score = Math.max(stats.best_score, session.score);
  stats.total_distance += session.distance;
  stats.total_vighnas += session.vighnas_destroyed;
  stats.total_modaks += session.modaks_collected;
  stats.best_combo = Math.max(stats.best_combo, session.max_combo);
  stats.games_played += 1;
  stats.updated_at = new Date().toISOString();

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {}
  }

  // If Supabase is connected, attempt sync
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('game_sessions').insert(newSession);
      await supabase.from('player_stats').upsert(stats);
    } catch (err) {
      console.warn('Supabase sync skipped, continuing offline:', err);
    }
  }

  return newSession;
}

export async function getLiveLeaderboard(): Promise<LeaderboardEntry[]> {
  const profile = getStoredProfile();
  const stats = getStoredPlayerStats();

  let board = [...SEED_LEADERBOARD];

  // Insert or update current user in leaderboard
  const existingUserIndex = board.findIndex(b => b.user_id === profile.id);
  const userEntry: LeaderboardEntry = {
    rank: 0,
    user_id: profile.id,
    username: profile.username || 'You',
    avatar: profile.avatar || 'saffron',
    score: stats.best_score,
    vighnas_destroyed: stats.total_vighnas,
    max_combo: stats.best_combo,
    city: profile.city || 'Mumbai',
    created_at: stats.updated_at,
    isCurrentUser: true
  };

  if (existingUserIndex >= 0) {
    board[existingUserIndex] = userEntry;
  } else {
    board.push(userEntry);
  }

  // Sort descending by score
  board.sort((a, b) => b.score - a.score);

  // Assign ranks
  board = board.map((entry, idx) => ({
    ...entry,
    rank: idx + 1
  }));

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          user_id,
          best_score,
          total_vighnas,
          best_combo,
          profiles (username, avatar, city)
        `)
        .order('best_score', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        // Map data if available
      }
    } catch {
      // Graceful fallback to seeded board
    }
  }

  return board;
}

// ---------------------------------------------------------------------------
// HILL CLIMB RACING PERSISTENCE
// ---------------------------------------------------------------------------
import { HillClimbSaveData } from '@/types/hillClimb';

const HILL_CLIMB_KEY = 'vighnaharta_hill_climb_save';

export const DEFAULT_HILL_CLIMB_SAVE: HillClimbSaveData = {
  coins: 5000, // Generous divine bonus for immediate upgrades
  selectedVehicle: 'mushika_rath',
  selectedStage: 'kailash_foothills',
  vehicles: {
    mushika_rath: {
      unlocked: true,
      upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 }
    },
    airavata_rover: {
      unlocked: true,
      upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 }
    },
    kailash_quad: {
      unlocked: true,
      upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 }
    },
    garuda_turbo: {
      unlocked: true,
      upgrades: { engine: 1, suspension: 1, tires: 1, fuelTank: 1 }
    }
  },
  stages: {
    kailash_foothills: {
      unlocked: true,
      bestDistance: 0,
      highScore: 0
    },
    western_ghats: {
      unlocked: true,
      bestDistance: 0,
      highScore: 0
    },
    varanasi_dunes: {
      unlocked: true,
      bestDistance: 0,
      highScore: 0
    },
    svarga_heights: {
      unlocked: true,
      bestDistance: 0,
      highScore: 0
    }
  }
};

export function getStoredHillClimbData(): HillClimbSaveData {
  if (typeof window === 'undefined') return DEFAULT_HILL_CLIMB_SAVE;
  try {
    const raw = localStorage.getItem(HILL_CLIMB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults and guarantee ALL vehicles and stages are unlocked and playable
      const mergedVehicles = { ...DEFAULT_HILL_CLIMB_SAVE.vehicles };
      for (const key of ['mushika_rath', 'airavata_rover', 'kailash_quad', 'garuda_turbo'] as const) {
        mergedVehicles[key] = {
          unlocked: true,
          upgrades: parsed.vehicles?.[key]?.upgrades || { engine: 1, suspension: 1, tires: 1, fuelTank: 1 }
        };
      }

      const mergedStages = { ...DEFAULT_HILL_CLIMB_SAVE.stages };
      for (const key of ['kailash_foothills', 'western_ghats', 'varanasi_dunes', 'svarga_heights'] as const) {
        mergedStages[key] = {
          unlocked: true,
          bestDistance: parsed.stages?.[key]?.bestDistance || 0,
          highScore: parsed.stages?.[key]?.highScore || 0
        };
      }

      return {
        ...DEFAULT_HILL_CLIMB_SAVE,
        ...parsed,
        coins: Math.max(parsed.coins !== undefined ? parsed.coins : 5000, 2000),
        vehicles: mergedVehicles,
        stages: mergedStages
      };
    }
  } catch {}
  return DEFAULT_HILL_CLIMB_SAVE;
}

export function saveStoredHillClimbData(data: HillClimbSaveData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HILL_CLIMB_KEY, JSON.stringify(data));
  } catch {}
}

