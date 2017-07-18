const ff = require('ff');
const config = require('../config.json');
const Mysql = require('../server/js/lib/db/mysql').default;
const DB = require('../server/js/lib/db').default;

const DEFAULT = 'voiceweb';
const USERNAME = config.MYSQLUSER || DEFAULT;
const PASSWORD = config.MYSQLPASS || DEFAULT;
const DBNAME = config.MYSQLDBNAME || DEFAULT;

/**
 * Create the database.
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

  // Log in as superuser to create user and tables for voice-web.
  let mysql = new Mysql({
    user: user,
    password: pass,
    database: 'mysql'
  });

  let db; // db object, for when we connect through the server api.

  let f = ff(
    () => {
      mysql.query('SELECT User FROM mysql.user  ' +
        'WHERE user = \'' + USERNAME + '\';', null, f.slot());
    },

    result => {
      if (result && result.length < 1) {
        mysql.query(`CREATE USER '${USERNAME}'@'localhost' IDENTIFIED BY '${PASSWORD}';`, null, f.slot());
      } else {
        f.fail('User already exists');
      }
    },

    () => {
      mysql.query('show databases like ' +
        '\'' + DBNAME + '\';', null, f.slot());
    },

    (result) => {
      if (result && result.length < 1) {
        mysql.query(`CREATE DATABASE ${DBNAME} CHARACTER SET utf8 COLLATE utf8_general_ci;`, null, f.slot());
      } else {
        f.fail('Database already exists');
      }
    },

    (result) => {
      mysql.query(`GRANT ALL PRIVILEGES ON ${DBNAME}.* TO '${USERNAME}'@'localhost';`, null, f.slot());
    },

    (result) => {
      // Now let's use the user we just created to create the schema.
      // To do so, we will need to as the server (through db object).
      mysql.end();
      mysql = null;
      db = new DB();
      db.createAll().then( () =>  {
        db.end();
        f.slot();
      })
        // Forward promise errors to ff.
        .catch((err) => {
            console.error('database create error', err);
            db.end();
            f.fail(err);
        });
    })

    .onComplete((err, result) => {
      if (mysql) {
          mysql.end();
          mysql = null;
      }
      if (err) {
        console.error('database create error', err);
        process.exitCode = 1;
      }
      callback(err);
    })
}

// Allow running as a script and module.
if (require.main === module) {
  run(err => {
    if (!err) {
      console.log('Db created.');
    }
  });
} else {
  exports.run = run;
}
