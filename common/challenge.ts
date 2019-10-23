export interface WeeklyChallenge {
  current_week: number;
  user: {
    speak: number;
    speak_total: number;
    listen: number;
    listen_total: number;
  };
  team: {
    invite: number;
    invite_total: number;
  };
}
