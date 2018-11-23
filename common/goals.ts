export interface Goal {
  goal: number;
  date: null | string;
}

export interface AllGoals {
  streaks: Goal[];
  clips: Goal[];
  votes: Goal[];
}
