import * as sendRequest from 'request-promise-native';
import { getConfig } from '../config-helper';
import { getMySQLInstance } from './model/db/mysql';
import { computeGoals } from './model/goals';

type UserEmailStats = {
  client_id: string;
  email: string;
  basket_token: string;

  first_contrib: string;
  goal_created: string;
  goal_reached: string;
  two_day_streak: string;
  last_active: string;

  new_last_active: string;
  hours_elapsed: number;
};

const { BASKET_API_KEY, ENVIRONMENT } = getConfig();
const db = getMySQLInstance();

export const BASKET_API_URL =
  ENVIRONMENT == 'prod' || ENVIRONMENT == 'stage'
    ? 'https://basket.mozilla.org'
    : 'https://basket-dev.allizom.org';

const basketConfig = {
  uri: BASKET_API_URL + '/news/common-voice-goals/',
  method: 'POST',
  headers: {
    'x-api-key': BASKET_API_KEY,
  },
};

function toISO(date: string) {
  return date ? new Date(date).toISOString().slice(0, -5) + 'Z' : null;
}

/*
 * Wrapper function to sync user activity to email provider
 * - Basket = MoCo internal
 */
async function syncToEmailProvider(data: any) {
  sendRequest({
    ...basketConfig,
    form: data,
  }).catch(err => console.error(err.message));
}

/*
 * Fetch the most recent time the user was synced
 */
async function getCurrentStatus(client_id: string) {
  const [[row]] = await db.query(
    `SELECT u.*,
      NOW() AS new_last_active,
      MINUTE(TIMEDIFF(NOW(), u.last_active)) AS mins_elapsed
    FROM user_client_newsletter_prefs AS u
    WHERE client_id = ?`,
    [client_id]
  );

  return row;
}

/*
 * Only send the last time the user was active
 */
function syncLastActive(currentUserStats: UserEmailStats) {
  db.query(
    `UPDATE user_client_newsletter_prefs
      SET last_active = ?
    WHERE client_id = ?`,
    [currentUserStats.new_last_active, currentUserStats.client_id]
  );

  const data = {
    email: currentUserStats.email,
    last_active_date: toISO(currentUserStats.new_last_active),
  };

  syncToEmailProvider(data);
}

/*
 * Send full account info to user
 */
async function syncFullAccount(currentUserStats: UserEmailStats) {
  const [[computed]] = await db.query(
    `
      SELECT
        email,
        basket_token,
        LEAST(
          IFNULL((SELECT MIN(clips.created_at) FROM clips WHERE client_id = newsletter.client_id), NOW()),
          IFNULL((SELECT MIN(votes.created_at) FROM votes WHERE client_id = newsletter.client_id), NOW())
        ) AS first_contribution_date,
        current_goal.created_at AS goal_created_at,
        current_goal.days_interval,
        MAX(awards.created_at) AS goal_reached_at,
        (
          NOT EXISTS(
            SELECT 1
            FROM reached_goals
            WHERE type = 'streak' AND client_id = newsletter.client_id
              AND count = 3
          ) AND EXISTS(
            SELECT 1
            FROM streaks
            WHERE client_id = newsletter.client_id
              AND DATEDIFF(NOW(), started_at) >= 2
              AND DATEDIFF(NOW(), last_activity_at) <= 1
          )
        ) AS two_day_streak
      FROM user_client_newsletter_prefs AS newsletter
      LEFT JOIN custom_goals goals ON newsletter.client_id = goals.client_id
                                      AND goals.locale_id = 1
      LEFT JOIN custom_goals current_goal ON (
        newsletter.client_id = current_goal.client_id AND
        current_goal.created_at >= goals.created_at
      )
      LEFT JOIN awards ON current_goal.id = awards.custom_goal_id
      WHERE newsletter.client_id = ?
      GROUP BY newsletter.client_id
    `,
    [currentUserStats.client_id]
  );

  db.query(
    `
      UPDATE user_client_newsletter_prefs
      SET
        first_contrib = ?,
        goal_created = ?,
        goal_reached = ?,
        two_day_streak = ?,
        last_active = ?
      WHERE client_id = ?`,
    [
      computed.first_contribution_date,
      computed.goal_created_at,
      computed.goal_reached_at,
      Boolean(computed.two_day_streak),
      currentUserStats.new_last_active,
      currentUserStats.client_id,
    ]
  );

  const data = {
    email: currentUserStats.email,

    first_contribution_date: toISO(computed.first_contribution_date),
    created_at: toISO(computed.goal_created_at),
    days_interval: computed.days_interval,
    goal_reached_at: toISO(computed.goal_reached_at),

    last_active_date: toISO(currentUserStats.new_last_active),
    two_day_streak: Boolean(computed.two_day_streak),
  };

  syncToEmailProvider(data);
}

/*
 * Sync current account info to email provider if
 * there is updated data and it's been more than 5 minutes
 */
export async function sync(client_id: string, firstSubscribe?: boolean) {
  await computeGoals(client_id);
  const currUserStats = await getCurrentStatus(client_id);

  // If no newsletter prefs exist, they don't get email triggers
  // If last update was within the past 5 minutes, do not send another sync to
  // prevent spamming endpoint
  if (
    !currUserStats ||
    (parseInt(currUserStats.mins_elapsed) <= 5 && !firstSubscribe)
  ) {
    return;
  }

  // If all email triggers have been hit at least once, no need to recalculate values
  if (
    currUserStats.first_contrib &&
    currUserStats.goal_created &&
    currUserStats.goal_reached &&
    currUserStats.two_day_streak
  ) {
    return syncLastActive(currUserStats);
  }

  // otherwise, do a full calculation
  return syncFullAccount(currUserStats);
}
