export interface Level {
  id: number;
  name: string;
  description: string;
  content: string[];
  minWpm: number;
  minAccuracy: number;
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  errors: number;
  timeTaken: number;
}

export interface UserProgress {
  currentLevel: number;
  completedLevels: number[];
  bestStats: Record<number, GameStats>;
}
