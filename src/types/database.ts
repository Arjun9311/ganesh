export interface Profile {
  id: string;
  username: string;
  city: string;
  latitude?: number;
  longitude?: number;
  avatar: string;
  created_at: string;
  updated_at?: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  score: number;
  distance: number;
  duration: number;
  vighnas_destroyed: number;
  modaks_collected: number;
  powerups_collected: number;
  max_combo: number;
  weather: string;
  environment: string;
  completed: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_key: string;
  achievement_name: string;
  unlocked_at: string;
}

export interface PlayerStats {
  user_id: string;
  total_score: number;
  best_score: number;
  total_distance: number;
  total_vighnas: number;
  total_modaks: number;
  best_combo: number;
  games_played: number;
  updated_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar: string;
  score: number;
  vighnas_destroyed: number;
  max_combo: number;
  city: string;
  created_at: string;
  isCurrentUser?: boolean;
}
