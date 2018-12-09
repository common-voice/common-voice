export interface Goal {
  goal: number;
  date: null | string;
}

export interface AllGoals {
  streaks: [number, Goal[]];
  clips: [number, Goal[]];
  votes: [number, Goal[]];
}
