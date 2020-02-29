import * as sendRequest from 'request-promise-native';
import { getConfig } from '../config-helper';
import { getMySQLInstance } from './model/db/mysql';
import { computeGoals } from './model/goals';

const { BASKET_API_KEY, ENVIRONMENT } = getConfig();
const db = getMySQLInstance();

export const API_URL =
  ENVIRONMENT == 'prod' || ENVIRONMENT == 'stage'
    ? 'https://basket.mozilla.org'
    : 'https://basket-dev.allizom.org';

const basketConfig = {
  uri: API_URL + '/news/common-voice-goals/',
  method: 'POST',
  headers: {
    'x-api-key': BASKET_API_KEY,
  },
};

function toISO(date: string) {
  return date ? new Date(date).toISOString().slice(0, -5) + 'Z' : null;
}

async function getCurrentStatus(client_id: string) {
  const [[row]] = await db.query(
    `SELECT u.*,
      NOW() AS new_last_active,
      HOUR(TIMEDIFF(NOW(), u.last_active)) AS hours_elapsed
    FROM user_client_newsletter_prefs AS u
    WHERE client_id = ?`,
    [client_id]
  );

  return row;
}

function updateLastActive(currentUserStats: any) {
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

  sendRequest({
    ...basketConfig,
    form: data,
  }).catch(err => console.error(err.message));

  console.log('basket', JSON.stringify(data, null, 2));
  return;
}

async function updateFullBasket(currentUserStats: any) {
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
      WHERE newsletter.client_id = "11aa5a4b-4a0f-43ea-94d9-9b1158551d63"
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

  sendRequest({
    ...basketConfig,
    form: data,
  }).catch(err => console.error(err.message));

  console.log('basket', JSON.stringify(data, null, 2));
}

export async function sync(client_id: string) {
  await computeGoals(client_id);
  const currUserStats = await getCurrentStatus(client_id);

  // If no newsletter prefs exist, they don't get email triggers
  // If last update was within the past hour, do not send another sync
  if (!currUserStats || currUserStats.hours_elapsed === 0) {
    return;
  }

  // If all email triggers have been hit at least once, no need to recalculate values
  if (
    currUserStats.first_contrib &&
    currUserStats.goal_created &&
    currUserStats.goal_reached &&
    currUserStats.two_day_streak
  ) {
    return updateLastActive(currUserStats);
  }

  // otherwise, do a full calculation
  return updateFullBasket(currUserStats);
}
