const ff = require('ff');
const config = require('../config.json');
const Postgres = require('../server/js/lib/db/postgres').default;

const DBNAME = 'voiceweb' || config.PBDATABASE;
const USERNAME = 'voiceweb' || config.PGUSER;

/**
 * Create the database.
 */
function run(callback) {
  // Make sure we have a superuser username and password
  let user = config.DB_ROOT_USER;
  let pass = config.DB_ROOT_PASS;
  if (!user) {
    console.error('need DB_ROOT_USER defined in config.json');
    process.exitCode = 1;
    return;
  }

  if (!pass) {
    console.error('need DB_ROOT_PASS defined in config.json');
    process.exitCode = 1;
    return;
  }

  let pg = new Postgres({
    user: user,
    pass: pass,
    database: 'template1'
  });

  let f = ff(() => {
    pg.query(`DROP DATABASE IF EXISTS ${DBNAME};`, f());
  }, () => {
    pg.query(`DROP USER IF EXISTS ${USERNAME};`, f());
  }).onComplete((err, result) => {
    if (err) {
      console.error('drop error', err);
      process.exitCode = 1;
      return;
    }

    console.log('database dropped.');
    pg.end();
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
