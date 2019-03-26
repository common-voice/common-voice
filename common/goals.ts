export interface GlobalGoal {
  goal: number;
  date: null | string;
}

export interface CustomGoalParams {
  type: string;
  daysInterval: number;
  amount: number;
}

export interface CustomGoal {
  days_interval: 1 | 7;
  amount: number;
  created_at: string;
  current: { speak?: number; listen?: number };
}

export interface AllGoals {
  globalGoals: {
    streaks: [number, GlobalGoal[]];
    clips: [number, GlobalGoal[]];
    votes: [number, GlobalGoal[]];
  };
}
