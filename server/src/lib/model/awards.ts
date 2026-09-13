import { pick } from 'common'
import { getLocaleId } from './db'
import { getMySQLInstance } from './db/mysql'
import CustomGoal from './custom-goal'

const db = getMySQLInstance()

export default {
  async checkProgress(
    client_id: string,
    locale: { id: number } | { name: string }
  ) {
    const localeId = 'id' in locale ? locale.id : await getLocaleId(locale.name)

    // check to see if a) there is a custom goal and b) if it has been reached
    const customGoalReached = await this.checkCustomGoalReached(
      client_id,
      localeId
    )

    // if a CustomGoal is reached, we want to create an Award
    if (customGoalReached) {
      // define
      const intervalStart = new Date(goal.current_interval_start)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')

      console.log('intervalStart: ', intervalStart)
    }

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

  /**
   *
   * @param client_id TODO DOCS
   * @param localeId
   */
  async checkCustomGoalExists(client_id: string, localeId: number) {
    const [goal] = await CustomGoal.find(client_id, localeId)
    console.log('goal: ', goal)
    if (goal) {
      return goal
    } else {
      return false
    }
  },

  /**
   * Checks to see if a CustomGoal has been reached
   *
   * @param client_id - The unique identifier of the data contributor, who has previously created one or more Custom Goals
   * @param localeId - The unique identifier of the Locale of the Custom Goal (as Custom Goals can be set on multiple Locales)
   * @returns If there is no Custom Goal for the given client_id and localeID, returns false.
   *          if there IS a Custom Goal for the given client_id and localeID AND the goal is reached, returns true.
   * @example
   * // TODO
   */
  async checkCustomGoalReached(goal: typeof CustomGoal) {
    // there is a CustomGoal; check to see if the amount has been reached for the CustomGoal
    const isReached = Object.values(goal.current).every(v => v >= goal.amount)
    console.log('isReached: ', isReached)

    if (!isReached) {
      return false
    } else {
      return true
    }
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
