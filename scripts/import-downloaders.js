const mysql = require('mysql')
const path = require('path')
const fs = require('fs/promises')
const { getConfig } = require('../server/js/config-helper')

const DOWNLOADERS_FOLDER = path.join(__dirname, 'downloaders')

const { MYSQLHOST, MYSQLUSER, MYSQLPASS, MYSQLDBNAME } = getConfig()

const dbConfig = {
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: MYSQLDBNAME,
}

const db = mysql.createConnection(dbConfig)

const BATCH_SIZE = 1000

const queryDb = (query, params) =>
  new Promise((resolve, reject) => {
    db.query(query, params, (err, results, fields) => {
      if (err) reject(err)
      try {
        const res = results[0]
        resolve(res)
      } catch {
        console.log(results)
        reject('Something went wrong')
      }
    })
  })

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const processRelease = async filepath => {
  const contents = await fs.readFile(path.join(DOWNLOADERS_FOLDER, filepath))
  const users = JSON.parse(contents)
  const userEmails = users.map(entry => entry.user.email)
  const referrer = 'Hugging Face'
  const releaseDir = filepath.split('.json')[0]

  const referrerId = await queryDb(`SELECT id FROM referrers WHERE name = ?`, [
    referrer,
  ])
  const datasetId = await queryDb(
    `SELECT id FROM datasets WHERE release_dir = ?`,
    [releaseDir]
  )
  const unknownLocaleId = await queryDb(
    `SELECT id FROM locales WHERE name = ?`,
    ['unknown']
  )

  let start = 0
  let end = BATCH_SIZE
  let batch = userEmails.slice(start, end)

  while (batch.length > 0) {
    const values = batch.map(email => [
      email,
      unknownLocaleId.id,
      datasetId.id,
      referrerId.id,
    ])

    console.log(values)

    await queryDb(
      `
      INSERT INTO downloaders (email, locale_id, dataset_id, referrer_id)
      VALUES ?
	  `,
      [values]
    )

    start += BATCH_SIZE
    end += BATCH_SIZE
    batch = userEmails.slice(start, end)

    await sleep(2000)
  }
}

const main = async () => {
  const releases = await fs.readdir(DOWNLOADERS_FOLDER)

  for (const release of releases) {
    await processRelease(release)
  }
}

main()
