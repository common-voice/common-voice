import { ChallengeToken, AchievementType } from 'common/challenge';
import { getMySQLInstance } from './db/mysql';

const bonus_condition_sql = {
  // challenge, client_id
  sign_up_first_three_days: `
    SELECT enrolled_at < TIMESTAMPADD(DAY, 3, challenges.start_date) AS win_bonus, client_id AS bonus_winner
    FROM enroll
    LEFT JOIN challenges ON enroll.challenge_id = challenges.id AND challenges.url_token = ?
    WHERE client_id = ?
    `,
  //client_id, invite, invite, challenge
  invite_signup: `
    SELECT (invitee.id IS NOT NULL) AS win_bonus, invitor.client_id AS bonus_winner
    FROM challenges
    LEFT JOIN enroll invitee ON invitee.client_id = ?
        AND invitee.invited_by = ? AND invitee.enrolled_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    LEFT JOIN enroll invitor ON invitor.url_token = ?
    WHERE challenges.url_token = ?
    `,
  three_day_streak: ``, // [TODO]
  //challenge, client_id
  first_contribution: `
    SELECT count(distinct clips.id) + count(distinct votes.id) = 1 AS win_bonus, user_clients.client_id AS bonus_winner
    FROM user_clients
    LEFT JOIN challenges ON url_token = ?
    LEFT JOIN clips ON clips.client_id = user_clients.client_id AND clips.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    LEFT JOIN votes ON votes.client_id = user_clients.client_id AND votes.created_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    WHERE user_clients.client_id = ?
    GROUP BY user_clients.client_id
    `,
  // client_id, client_id, challenge
  invite_send: `
    SELECT earn.id IS NULL AS win_bonus, ? AS bonus_winner
    FROM challenges
    LEFT JOIN achievements ON achievements.name = 'invite_send' AND achievements.challenge_id = challenges.id
    LEFT JOIN earn ON earn.client_id = ?
        AND achievement_id = achievements.id
        AND earn.earned_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 3, start_date)
    WHERE challenges.url_token = ?
    `,
  // client_id, client_id, challenge
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
