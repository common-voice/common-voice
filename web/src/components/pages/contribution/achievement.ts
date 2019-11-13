export default function handleAchievement(
  firstContribute = false,
  firstStreak = false,
  hasAchieved = false,
  addAchievement: any,
  api: any
): void {
  sessionStorage.setItem('hasContributed', 'true');
  if (firstContribute) {
    addAchievement(
      50,
      "You're on your way! Congrats on your first contribution.",
      'success'
    );
  }
  if (firstStreak) {
    addAchievement(
      50,
      'You completed a three-day streak! Keep it up.',
      'success'
    );
  }
  if (JSON.parse(sessionStorage.getItem('hasShared')) && !hasAchieved) {
    addAchievement(
      50,
      "You're on a roll! You sent an invite and contributed in the same session.",
      'success'
    );
    // Tell back-end user get unexpected achievement: invite + contribute in the same session
    // Each user can only get once.
    // TODO: send the sessionStorage value on initial request.
    api.setInviteContributeAchievement();
  }
}
