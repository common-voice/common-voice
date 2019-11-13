export type AchievementType =
  | {
      type: 'invite';
    }
  | {
      type: 'contribute';
      firstContribute: boolean;
      firstStreak: boolean;
      hasAchieved: boolean;
    };
export function handleAchievements(
  achievement: AchievementType,
  addAchievement: any,
  setInviteContributeAchievement: any
): void {
  if (achievement.type === 'invite') {
    if (JSON.parse(sessionStorage.getItem('firstInvite'))) {
      addAchievement(50, 'You sent your first invite!');
    }
    if (
      !JSON.parse(sessionStorage.getItem('hasAchieved')) &&
      JSON.parse(sessionStorage.getItem('hasContributed'))
    ) {
      addAchievement(
        50,
        "You're on a roll! You sent an invite and contributed in the same session."
      );
      // Tell back-end user get unexpected achievement: invite + contribute in the same session
      // Each user can only get once.
      setInviteContributeAchievement();
      // Remove items from session storage.
      sessionStorage.removeItem('hasAchieved');
      sessionStorage.removeItem('hasContributed');
      sessionStorage.removeItem('firstInvite');
    }
  } else if (achievement.type === 'contribute') {
    sessionStorage.setItem('hasContributed', 'true');
    if (achievement.firstContribute) {
      addAchievement(
        50,
        "You're on your way! Congrats on your first contribution.",
        'success'
      );
    }
    if (achievement.firstStreak) {
      addAchievement(
        50,
        'You completed a three-day streak! Keep it up.',
        'success'
      );
    }
    if (
      JSON.parse(sessionStorage.getItem('hasShared')) &&
      !achievement.hasAchieved
    ) {
      addAchievement(
        50,
        "You're on a roll! You sent an invite and contributed in the same session.",
        'success'
      );
      // Tell back-end user get unexpected achievement: invite + contribute in the same session
      // Each user can only get once.
      setInviteContributeAchievement();

      // Remove items from session storage.
      sessionStorage.removeItem('hasShared');
    }
  }
}
