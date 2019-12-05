require('dotenv').config();
const mysql = require('mysql');

const dbConfig = {
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'voicecommons',
  password: process.env.MYSQLPASS || 'voicecommons',
  database: process.env.MYSQLDBNAME || 'voiceweb',
};

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

let safeToDelete = true;
const deletionSummary = {
  emails: [],
  s3Ids: [],
  datasetIds: [],
};

const isValidDate = dateStr => {
  const dateObj = new Date(dateStr);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

const parseResults = (results, email) => {
  const lastDatasetDate = isValidDate(process.env.LAST_DATASET_DATE)
    ? new Date(process.env.LAST_DATASET_DATE)
    : new Date();
  const clipTotal = results.reduce((acc, curr) => acc + curr.clip_count, 0);
  const clientIds = results.map(each => each.client_id);

  const summary = {
    email,
    length: results.length,
    ids: clientIds,
    clipTotal: clipTotal,
    firstClip: results[0] ? results[0].first_clip : null,
    inPastDataset: results[0] && lastDatasetDate >= results[0].first_clip,
  };

  return summary;
};

const readlineLoop = (prompt, options) => {
  readline.question(prompt, answer => {
    const callback = options[answer.toLowerCase()];
    if (callback) callback();
    else readlineLoop(prompt, options);
  });
};

const processIteration = isLast => {
  console.log(`=======================================`);
  safeToDelete = true;

  if (isLast) {
    printSummary();
    readline.close();
    process.exit(1);
  }
};

const printSummary = () => {
  console.log('Deletion summary: \n');
  if (deletionSummary.emails.length)
    console.log(
      `Removed user information related to ${deletionSummary.emails.join(', ')}`
    );

  if (deletionSummary.s3Ids.length)
    console.log(
      `Please manually remove the following folders from S3: ${deletionSummary.s3Ids.join(
        ', '
      )}.`
    );

  if (deletionSummary.datasetIds.length)
    console.log(
      `The following client_ids were included in a past dataset: ${deletionSummary.datasetIds.join(
        ', '
      )}.`
    );
};

const printUserStats = stats => {
  console.log(`
    Email: ${stats.email}
    Associated client_ids: ${stats.length}
    Total clips contributed: ${stats.clipTotal}
    First contribution: ${stats.firstClip}
    `);
};

const deleteClipRecords = (connection, userStats, isLast) => {
  const idStrings = userStats.ids.map(id => `"${id}"`);
  connection.query(
    `DELETE FROM clips WHERE client_id IN (${idStrings})`,
    (clip_error, clip_results, clip_fields) => {
      if (clip_error) throw clip_error;

      if (clip_results.affectedRows) {
        deletionSummary.s3Ids = deletionSummary.s3Ids.concat(userStats.ids);

        if (userStats.in_past_dataset)
          deletionSummary.datasetIds = deletionSummary.datasetIds.concat(
            userStats.ids
          );

        console.log(
          `Records for ${clip_results.affectedRows} clips were deleted.\n`
        );
      }

      processIteration(isLast);
    }
  );
};

const deleteUserRecords = (connection, userStats, isLast) => {
  connection.query(
    `DELETE FROM user_clients WHERE email = ${userStats.email}`,
    (delete_error, delete_results, delete_fields) => {
      if (delete_error) throw delete_error;

      deletionSummary.emails.push(userStats.email);

      if (userStats.clipTotal) {
        readlineLoop(
          `\nWould you also like to delete the ${userStats.clip_total} associated clips? \nThis CANNOT be reversed [Y/N] `,
          {
            y: () => deleteClipRecords(connection, userStats, isLast),
            n: () => processIteration(isLast),
          }
        );
      } else {
        processIteration(isLast);
      }
    }
  );
};

const deleteUser = (connection, email, isLast) => {
  if (safeToDelete) {
    safeToDelete = false;
    const clean_email = connection.escape(email);

    connection.query(
      `
        SELECT email, u.client_id, COUNT(c.id) clip_count, c.created_at first_clip
        FROM user_clients u
        LEFT JOIN clips c ON u.client_id = c.client_id
        WHERE email = ${clean_email}
        GROUP BY u.client_id
        ORDER BY c.created_at ASC;
      `,
      (error, results, fields) => {
        if (error) throw error;
        const userStats = parseResults(results, clean_email);

        if (userStats.length) {
          printUserStats(userStats);

          readlineLoop(
            `Are you sure you want to delete all data associated with ${clean_email}? \nThis CANNOT be reversed [Y/N] `,
            {
              y: () => deleteUserRecords(connection, userStats, isLast),
              n: () => processIteration(isLast),
            }
          );
        } else {
          console.log(
            `There are no user accounts associated with the email address ${clean_email}.`
          );
          processIteration(isLast);
        }
      }
    );
  } else {
    setTimeout(() => {
      deleteUser(connection, email, isLast);
    }, 200);
  }
};

try {
  if (process.argv.length < 3)
    throw new Error('Please enter at least one email address');
  const emails = process.argv.slice(2);
  const pool = mysql.createPool(dbConfig);

  pool.getConnection((err, connection) => {
    if (err) throw err;
    emails.forEach((email, index) => {
      deleteUser(connection, email, index + 1 === emails.length);
    });
  });
} catch (e) {
  console.error(e.message);
  process.exit(0);
}
