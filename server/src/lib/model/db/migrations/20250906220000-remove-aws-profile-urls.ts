// Removes lefover amazonaws links from user profile images
// There are 3264 such cases
// These give not-found errors on client browsers, slow them down, and clutter the internet


// do it in small batches not to lock the users much or trigger autoscale
// it will take longer but uses less resources
const BATCH_SIZE = 1000
export const up = async function (db: any): Promise<any> {
  // do it in small batches
  let totalAffected = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { affectedRows } = await db.runSql(
      `
      UPDATE user_clients
      SET avatar_url = NULL
      WHERE avatar_url LIKE "%amazonaws%"
      LIMIT ?
      `,
      [BATCH_SIZE]
    )
    totalAffected += affectedRows
    if (affectedRows < BATCH_SIZE) break
  }
  console.log(`Updated [${totalAffected}] users.`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async function (): Promise<any> {
  // no reversal
  return null
}
