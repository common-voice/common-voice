import { pick } from 'common'
import { getLocaleId } from './db'
import { getMySQLInstance } from './db/mysql'
import CustomGoal from './custom-goal'
import { has } from 'fp-ts/lib/ReadonlyRecord'
import { isPropertyAccessChain } from 'typescript'






export default {

  isReached(


  )

  async checkProgress(
    client_id: string,
    locale: { id: number } | { name: string }
  ) {
    const localeId = 'id' in locale ? locale.id : await getLocaleId(locale.name)
    console.log('localeId: ', localeId)

    const [goal] = await CustomGoal.find(client_id, localeId)
    console.log('goal: ', goal)

    if (!goal) return

    const isReached = Object.values(goal.current).every(v => v >= goal.amount)

    console.log('isReached: ', isReached)
    if (!isReached) return

    const intervalStart = new Date(goal.current_interval_start)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')

    // how could we get a negative internval start date
    // interval could have the wrong positively / negativity
    // can timestamp
    // new datetimes that are the reverse
    // create a timeline using Date() to replicate behaviour
    // is this function testable
    // can I write a function to test this and cause it to fail
    // to protect from regression - we need to write this function so it's testable
    // and then write a test so we don't get regression in the future
    // to make functions testable, pass dependencies inside the function parameter
    // dependency injection / inversion of control
    // unit tests you don't want side effects, repeatable without side effects
    // mock the db - don't write anything to db, log to console for the query string
    // as much logic as possible in pure functions
    // interface vs types 
    // type is usually a Type - like an object - a collection of primitive datatypes - e.g. Car - maker, color, engine
    // use interface - for methods, that are extensible 
    // interfaces = behaviours / methods 
    // types - properties / attributes
    // need to check speak / listen 

    console.log('intervalStart: ', intervalStart)

    const [[hasAwardAlready]] = await db.query(
      `
        SELECT *
        FROM awards
        WHERE custom_goal_id = ? AND goal_interval_start = TIMESTAMP(?)
      `,
      [goal.id, intervalStart]
    )

    console.log('hasAwardAlready: ', hasAwardAlready)
    console.log('[[hasAwardAlready]]: ', [[hasAwardAlready]])

    if (hasAwardAlready) return

    await db.query(
      `
        INSERT INTO awards (client_id, custom_goal_id, goal_interval_start)
        VALUES (?, ?, TIMESTAMP(?))
      `,
      [client_id, goal.id, intervalStart]
    )
  },

  async find(client_id: string) {
    const [rows] = await db.query(
      `
        SELECT *, locales.name AS locale
        FROM awards
        LEFT JOIN custom_goals ON awards.custom_goal_id = custom_goals.id
        LEFT JOIN locales ON custom_goals.locale_id = locales.id
        WHERE awards.client_id = ?
      `,
      [client_id]
    )
    return rows.map((row: any) =>
      pick(row, [
        'locale',
        'notification_seen_at',
        'seen_at',
        'type',
        'days_interval',
        'amount',
      ])
    )
  },

  async seen(client_id: string, kind: 'notification' | 'award') {
    const column = kind == 'notification' ? 'notification_seen_at' : 'seen_at'
    await db.query(
      `
        UPDATE awards
        SET ${column} = now()
        WHERE ${column} IS NULL AND client_id = ?
      `,
      [client_id]
    )
  },

  setupDB() {
    return getMySQLInstance()
  },
}
