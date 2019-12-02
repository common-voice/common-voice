const mysql = require('mysql');
const config = require('../config.json');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

let safeToDelete = true;
let deletionSummary = {
  emails: [],
  s3_ids: [],
  dataset_ids: [],
};

const parseResults = (results, email) => {
  const LAST_DATASET = config.LAST_DATASET || new Date();
  const clip_total = results.reduce((acc, curr) => acc + curr.clip_count, 0);
  const client_ids = results.map(each => each.client_id);

  const summary = {
    email: email,
    length: results.length,
    ids: client_ids,
    clip_total: clip_total,
    first_clip: null,
    in_past_dataset: false,
  };

  if (summary.clip_total) {
    summary.first_clip = results[0].first_clip;

    if (LAST_DATASET >= new Date(summary.first_clip))
      summary.in_past_dataset = true;
  }

  return summary;
};

const processIteration = last => {
  console.log(`=======================================`);
  safeToDelete = true;

  if (last) {
    printSummary(deletionSummary);
    readline.close();
    process.exit(1);
  }
};

const printSummary = summary => {
  console.log('Deletion summary: \n');
  if (deletionSummary.emails.length)
    console.log(
      `Removed user information related to ${deletionSummary.emails.join(', ')}`
    );

  if (deletionSummary.s3_ids.length)
    console.log(
      `Please manually remove the following folders from S3: ${deletionSummary.s3_ids.join(
        ', '
      )}.`
    );

  if (deletionSummary.dataset_ids.length)
    console.log(
      `The following client_ids were included in a past dataset: ${deletionSummary.dataset_ids.join(
        ', '
      )}.`
    );
};

const printUserStats = stats => {
  console.log(`
    Email: ${stats.email}
    Associated client_ids: ${stats.length}
    Total clips contributed: ${stats.clip_total}
    First contribution: ${stats.first_clip}
    `);
};

const deleteClipRecords = (connection, userStats, isLast) => {
  const idStrings = userStats.ids.map(id => `"${id}"`);
  connection.query(
    `DELETE FROM clips WHERE client_id IN (${idStrings})`,
    (clip_error, clip_results, clip_fields) => {
      if (clip_error) throw clip_error;

      if (clip_results.affectedRows) {
        deletionSummary.s3_ids = deletionSummary.s3_ids.concat(userStats.ids);

        if (userStats.in_past_dataset)
          deletionSummary.dataset_ids = deletionSummary.dataset_ids.concat(
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

      if (userStats.clip_total) {
        readline.question(
          `\nWould you also like to delete the ${userStats.clip_total} associated clips? \nThis CANNOT be reversed [Y/N] `,
          answer => {
            if (answer.toLowerCase() === 'y')
              deleteClipRecords(connection, userStats, isLast);
            else processIteration(isLast);
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

          readline.question(
            `Are you sure you want to delete all data associated with ${clean_email}? \nThis CANNOT be reversed [Y/N] `,
            answer => {
              if (answer.toLowerCase() === 'y')
                deleteUserRecords(connection, userStats, isLast);
              else processIteration(isLast);
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

  const pool = mysql.createPool({
    host: config.MYSQLHOST,
    user: config.MYSQLUSER,
    password: config.MYSQLPASS,
    database: config.MYSQLDBNAME,
  });

  pool.getConnection((err, connection) => {
    emails.map((email, index) => {
      deleteUser(connection, email, index + 1 === emails.length);
    });
  });
} catch (e) {
  console.error(e.message);
  process.exit(0);
}
