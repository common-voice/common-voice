require('dotenv').config()
const mysql = require('mysql2')
const { promisify } = require('util')

const dbConfig = {
  host: process.env.CV_MYSQLHOST || 'localhost',
  user: process.env.CV_MYSQLUSER || 'voicecommons',
  password: process.env.CV_MYSQLPASS || 'voicecommons',
  database: process.env.CV_MYSQLDBNAME || 'voiceweb',
}

const deletionSummary = {
  emails: [],
  s3Ids: [],
  datasetIds: [],
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

const promptAsync = question => {
  return new Promise(resolve => {
    readline.question(question, resolve)
  })
}

const isValidDate = dateStr => {
  const dateObj = new Date(dateStr)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

const parseResults = (results, email) => {
  const lastDatasetDate = isValidDate(process.env.LAST_DATASET_DATE)
    ? new Date(process.env.LAST_DATASET_DATE)
    : new Date()

  return {
    email,
    length: results.length,
    ids: results.map(each => each.client_id),
    clipTotal: results.reduce((acc, curr) => acc + curr.clip_count, 0),
    firstClip: results[0] ? results[0].first_clip : null,
    inPastDataset: results[0] && lastDatasetDate >= results[0].first_clip,
  }
}

const readlineLoop = async (prompt, options) => {
  const answer = await promptAsync(prompt)
  const callback = options[answer.toLowerCase()]

  if (callback) await callback()
  else await readlineLoop(prompt, options)
}

const processIteration = isLast => {
  console.log(`=======================================`)

  if (isLast) {
    printSummary()
    readline.close()
    process.exit(1)
  }
}

const printSummary = () => {
  console.log('Deletion summary: \n')
  if (deletionSummary.emails.length)
    console.log(
      `Removed user information related to ${deletionSummary.emails.join(', ')}`
    )

  if (deletionSummary.s3Ids.length)
    console.log(
      `Please manually remove the following folders from S3: ${deletionSummary.s3Ids.join(
        ', '
      )}.`
    )

  if (deletionSummary.datasetIds.length)
    console.log(
      `The following client_ids were included in a past dataset: ${deletionSummary.datasetIds.join(
        ', '
      )}.`
    )
}

const printUserStats = stats => {
  console.log(`
Email: ${stats.email}
Associated client_ids: ${stats.length}
Total clips contributed: ${stats.clipTotal}
First contribution: ${stats.firstClip}
  `)
}

const deleteClipRecords = async (connectAsync, userStats, isLast) => {
  const idStrings = userStats.ids.map(id => `"${id}"`)
  try {
    const results = await connectAsync(
      `DELETE FROM clips WHERE client_id IN (${idStrings})`
    )

    if (results.affectedRows) {
      deletionSummary.s3Ids.push(...userStats.ids)

      if (userStats.in_past_dataset)
        deletionSummary.datasetIds.push(...userStats.ids)

      console.log(`Records for ${results.affectedRows} clips were deleted.\n`)
    }

    processIteration(isLast)
  } catch (error) {
    throw error
  }
}

const deleteUserRecords = async (connectAsync, userStats, isLast) => {
  try {
    const results = await connectAsync(
      `DELETE FROM user_clients WHERE email = ${userStats.email}`
    )

    deletionSummary.emails.push(userStats.email)

    if (userStats.clipTotal) {
      await readlineLoop(
        `\nWould you also like to delete the ${userStats.clipTotal} associated clips? \nThis CANNOT be reversed [Y/N] `,
        {
          y: async () =>
            await deleteClipRecords(connectAsync, userStats, isLast),
          n: () => processIteration(isLast),
        }
      )
    } else {
      processIteration(isLast)
    }
  } catch (error) {
    throw error
  }
}

const deleteUser = async (connectAsync, email, isLast) => {
  try {
    const results = await connectAsync(
      `
        SELECT email, u.client_id, COUNT(c.id) clip_count, c.created_at first_clip
        FROM user_clients u
        LEFT JOIN clips c ON u.client_id = c.client_id
        WHERE email = ${email}
        GROUP BY u.client_id
        ORDER BY c.created_at ASC;
      `
    )

    const userStats = parseResults(results, email)

    if (userStats.length) {
      printUserStats(userStats)

      await readlineLoop(
        `Are you sure you want to delete all data associated with ${email}? \nThis CANNOT be reversed [Y/N] `,
        {
          y: async () =>
            await deleteUserRecords(connectAsync, userStats, isLast),
          n: () => processIteration(isLast),
        }
      )
    } else {
      console.log(
        `There are no user accounts associated with the email address ${email}.`
      )
      processIteration(isLast)
    }
  } catch (error) {
    throw error
  }
}

try {
  if (process.argv.length < 3)
    throw new Error('Please enter at least one email address')

  const emails = process.argv.slice(2)
  const pool = mysql.createPool(dbConfig)

  pool.getConnection(async (err, connection) => {
    if (err) throw err
    const connectAsync = promisify(connection.query).bind(connection)

    for (const [index, email] of emails.entries()) {
      const clean_email = connection.escape(email)

      await deleteUser(connectAsync, clean_email, index + 1 === emails.length)
    }
  })
} catch (e) {
  console.error(e.message)
  process.exit(0)
}
