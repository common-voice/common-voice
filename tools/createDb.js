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

  let f = ff(
    () => {
      pg.query('SELECT usename FROM pg_shadow ' +
        'WHERE usename = \'' + USERNAME + '\';', f());
    },

    result => {
      if (result && result.rowCount < 1) {
        pg.query(`CREATE USER ${USERNAME};`, f());
      }
    },

    () => {
      pg.query('SELECT datname FROM pg_catalog.pg_database ' +
        'WHERE datname = \'' + DBNAME + '\';', f());
    },

    (result) => {
      if (result && result.rowCount < 1) {
        pg.query(`CREATE DATABASE ${DBNAME} ENCODING UTF8;`, f());
      }
    },

    (result) => {
      // Now let's use the user we just created to create the schema.
      pg.disconnect();
      let pg = new Postgres();
      pg.query(
        `CREATE TABLE users (
          id text primary key,
          email text unique,
          birthyear smallserial
        );`, f()
      );
    })

    .onComplete((err, result) => {
      console.log('database created.');
      pg.disconnect();
      callback();
    });
}

// Allow running as a script and module.
if (require.main === module) {
  run(err => {
    if (err) {
      console.error('Problem creating db', err);
      process.exitCode = 1;
      return;
    }

    console.log('Db created.');
  });
} else {
  exports.run = run;
}
