import { ChallengeToken, AchievementType } from 'common/challenge';
import { getMySQLInstance } from './db/mysql';

const bonus_condition_sql = {
  // Arguments: [challenge, client_id]
  // No need to check if user has already won the bonus because it must happend after a successful enrollment.
  sign_up_first_three_days: `
    SELECT enrolled_at < TIMESTAMPADD(DAY, 3, challenges.start_date) AS win_bonus, client_id AS bonus_winner
    FROM enroll
    LEFT JOIN challenges ON enroll.challenge_id = challenges.id AND challenges.url_token = ?
    WHERE client_id = ?
    `,
  // Arguments: [client_id, invite, invite, challenge]
  // Make sure invitees are enrolled during the challenge, no need to do that for the invitor
  invite_signup: `
    SELECT (invitee.id IS NOT NULL) AS win_bonus, invitor.client_id AS bonus_winner
    FROM challenges
    LEFT JOIN enroll invitee ON invitee.client_id = ?
        AND invitee.invited_by = ? AND invitee.enrolled_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    LEFT JOIN enroll invitor ON invitor.url_token = ?
    WHERE challenges.url_token = ?
    `,
  // Arguments: [client_id, client_id, challenge]
  // To earn an three_day_streak bonus, user has to satisfy all the following conditions:
  // 1) has been enrolled;
  // 2) not earned three_day_streak bonus before;
  // 3) already set a customer goal
  // 4) already reached a 3-day-streak goal OR haven't reached such a goal but has streak activity that lasts for AT LEAST 3 days
  //    just in case no such bonus are missed
  three_day_streak: `
    SELECT
        (enroll.client_id IS NOT NULL) AND (earn.client_id IS NULL) AND (custom_goals.id IS NOT NULL) AND ((reached_goals.client_id IS NOT NULL) OR (streaks.id IS NOT NULL)) AS win_bonus,
        ? AS bonus_winner
    FROM challenges
    LEFT JOIN achievements ON achievements.name = 'three_day_streak' AND challenges.id = achievements.challenge_id
    LEFT JOIN enroll ON enroll.client_id = ?
        AND challenges.id = enroll.challenge_id
        AND enroll.enrolled_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    LEFT JOIN earn ON enroll.client_id = earn.client_id
        AND earn.achievement_id = achievements.id
        AND earned_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    LEFT JOIN custom_goals ON custom_goals.client_id = enroll.client_id
        AND custom_goals.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    LEFT JOIN reached_goals ON reached_goals.client_id = enroll.client_id
        AND reached_goals.type = 'streak'
        AND reached_goals.count >= 3
        AND reached_goals.reached_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    LEFT JOIN streaks ON streaks.client_id = enroll.client_id
        AND streaks.started_at BETWEEN start_date AND TIMESTAMPADD(DAY, 18, start_date)
        AND TIMESTAMPDIFF(DAY, streaks.started_at, streaks.last_activity_at) > 3
    WHERE challenges.url_token = ?
  `,
  // Arguments: [challenge, client_id]
  // To earn an first_contribution, user's contribution must be exact 1.
  first_contribution: `
    SELECT count(distinct clips.id) + count(distinct votes.id) = 1 AS win_bonus, user_clients.client_id AS bonus_winner
    FROM user_clients
    LEFT JOIN challenges ON url_token = ?
    LEFT JOIN clips ON clips.client_id = user_clients.client_id AND clips.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    LEFT JOIN votes ON votes.client_id = user_clients.client_id AND votes.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    WHERE user_clients.client_id = ?
    GROUP BY user_clients.client_id
    `,
  // Arguments: [client_id, client_id, challenge]
  // Check if user has already earned the bonus
  invite_send: `
    SELECT earn.id IS NULL AS win_bonus, ? AS bonus_winner
    FROM challenges
    LEFT JOIN achievements ON achievements.name = 'invite_send' AND achievements.challenge_id = challenges.id
    LEFT JOIN earn ON earn.client_id = ?
        AND achievement_id = achievements.id
        AND earn.earned_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    WHERE challenges.url_token = ?
    `,
  // Arguments: [client_id, client_id, challenge]
  // Check if user has already won the bonus
  invite_contribute_same_session: `
    SELECT earn.id IS NULL AS win_bonus, ? AS bonus_winner
    FROM challenges
    LEFT JOIN achievements ON achievements.name = 'invite_contribute_same_session' AND achievements.challenge_id = challenges.id
    LEFT JOIN earn ON earn.client_id = ?
        AND achievement_id = achievements.id
        AND earn.earned_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    WHERE challenges.url_token = ?
    `,
};
const db = getMySQLInstance();
export default {
  async earnBonus(type: AchievementType, args: any[]) {
    let earned = false;

    const [[res]] = await db.query(bonus_condition_sql[type], args);
    const { win_bonus, bonus_winner } = res || {
      win_bonus: false,
      bonus_winner: '',
    };
    if (win_bonus && bonus_winner) {
      const ret = await db.query(
        `
              INSERT INTO earn (achievement_id, client_id) VALUES ((SELECT id FROM achievements WHERE name = ?), ?)
            `,
        [type, bonus_winner]
      );
      earned = ret && ret[0] && ret[0].affectedRows > 0 ? true : false;
    }
    return earned;
  },

  async hasEarnedBonus(
    type: AchievementType,
    client_id: string,
    challenge: ChallengeToken
  ) {
    const [[{ earned }]] = await db.query(
      `
        SELECT earn.client_id IS NOT NULL AS earned
        FROM challenges
        LEFT JOIN achievements ON challenges.id = achievements.challenge_id AND achievements.name = ?
        LEFT JOIN earn ON achievements.id = earn.achievement_id
            AND earn.client_id = ?
            AND earn.earned_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
        WHERE challenges.url_token = ?
        `,
      [type, client_id, challenge]
    );
    return earned;
  },
};
