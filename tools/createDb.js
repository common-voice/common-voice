const ff = require('ff');
const config = require('../config.json');
const Postgres = require('../server/js/lib/db/postgres').default;
const DB = require('../server/js/lib/db').default;

const DEFAULT = 'voiceweb';
const USERNAME = config.PGUSER || DEFAULT;
const PASSWORD = config.PGPASS || DEFAULT;
const DBNAME = config.PGNAME || DEFAULT;

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

  // Log in as superuser to create user and tables for voice-web.
  let pg = new Postgres({
    user: user,
    password: pass,
    database: 'template1' // Default db for postgres.
  });

  let db; // db object, for when we connect through the server api.

  let f = ff(
    () => {
      pg.query('SELECT usename FROM pg_shadow ' +
        'WHERE usename = \'' + USERNAME + '\';', f());
    },

    result => {
      if (result && result.rowCount < 1) {
        pg.query(`CREATE USER ${USERNAME} WITH PASSWORD '${PASSWORD}';`, f());
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
      // To do so, we will need to as the server (through db object).
      pg.end();
      pg = null;
      db = new DB();
      db.createAll().then(f.slotPlain())

        // Forward promise errors to ff.
        .catch(f.fail.bind(f));
    })

    .onComplete((err, result) => {
      if (err) {
        console.error('database create error', err);
      }

      // Clean up any open connections.
      db && db.end();
      pg && pg.end();

      callback(err);
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
