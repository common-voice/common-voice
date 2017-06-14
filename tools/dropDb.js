const ff = require('ff');
const config = require('../config.json');
const Mysql = require('../server/js/lib/db/mysql').default;

const DBNAME = '' || config.MSQLDBNAME;
const USERNAME = '' || config.MSQLUSER;

/**
 * Drop the database.
 */
function run(callback) {
  // Make sure we have a superuser username and password
  let user = config.DB_ROOT_USER || 'root';
  let pass = config.DB_ROOT_PASS || '';

  if (!user) {
    console.error('need DB_ROOT_USER defined in config.json');
    process.exitCode = 1;
    return;
  }

  let mysql = new Mysql({
    user: user,
    password: pass,
    database: 'sys'
  });

  let f = ff(() => {
    mysql.query(`DROP DATABASE IF EXISTS ${DBNAME};`, null, f.slot());
  }, () => {
    mysql.query(`DROP USER IF EXISTS ${USERNAME}@localhost;`, null, f.slot());
  }).onComplete((err, result) => {
    if (err) {
      console.error('drop error', err);
      process.exitCode = 1;
      return;
    }

    console.log('database dropped.');
    mysql.end();
    callback();
  });
}

// Allow running as a script and module.
if (require.main === module) {
  run(err => {
    if (err) {
      console.error('Problem dropping db', err);
      process.exitCode = 1;
      return;
    }

    console.log('Db dropped.');
  });
} else {
  exports.run = run;
}
