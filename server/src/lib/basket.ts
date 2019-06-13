import * as sendRequest from 'request-promise-native';
import { getConfig } from '../config-helper';
import { getMySQLInstance } from './model/db/mysql';

const { BASKET_API_KEY, ENVIRONMENT } = getConfig();
const db = getMySQLInstance();

export const API_URL =
  ENVIRONMENT == 'prod' || ENVIRONMENT == 'stage'
    ? 'https://basket.mozilla.org'
    : 'https://basket-dev.allizom.org';

function toISO(date: string) {
  return date ? new Date(date).toISOString().slice(0, -5) + 'Z' : null;
}

export async function sync(client_id: string) {
  const [[row]] = await db.query(
    `
      SELECT
        email,
        basket_token,
        LEAST(
          (SELECT MIN(clips.created_at) FROM clips WHERE client_id = user_clients.client_id),
          (SELECT MIN(votes.created_at) FROM votes WHERE client_id = user_clients.client_id)
        ) AS first_contribution_date,
        current_goal.created_at AS goal_created_at,
        current_goal.days_interval,
        MAX(awards.created_at) AS goal_reached_at,
        NOW() as last_active_date
      FROM user_clients
      LEFT JOIN custom_goals goals ON user_clients.client_id = goals.client_id
      LEFT JOIN custom_goals current_goal ON (
        user_clients.client_id = current_goal.client_id AND
        current_goal.created_at >= goals.created_at
      )
      LEFT JOIN awards ON current_goal.id = awards.custom_goal_id
      WHERE user_clients.client_id = ? AND has_login
      GROUP BY user_clients.client_id
    `,
    [client_id]
  );
  if (
    !row ||
    !row.basket_token ||
    (!row.first_contribution_date && !row.goal_created_at)
  ) {
    return;
  }
  const data = {
    email: row.email,

    first_contribution_date: toISO(row.first_contribution_date),

    created_at: toISO(row.goal_created_at),
    days_interval: row.days_interval,
    goal_reached_at: toISO(row.goal_reached_at),

    last_active_date: toISO(row.last_active_date),
    two_day_streak: false,
  };
  console.log('basket', JSON.stringify(data, null, 2));
  await sendRequest({
    uri: API_URL + '/news/common-voice-goals/',
    method: 'POST',
    headers: {
      'x-api-key': BASKET_API_KEY,
    },
    form: data,
  });
}
