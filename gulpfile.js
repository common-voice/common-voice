'use strict';

const CWD = process.cwd() + '/';

const APP_NAME = 'common-voice';
const TS_CONFIG = 'tsconfig.json';
const TS_GLOB = '**/*.ts*';
const JS_GLOB = '**/*.js';
const DIR_CLIENT = CWD + 'web/';
const DIR_CLIENT_SRC = DIR_CLIENT + 'src/';
const DIR_SERVER = CWD + 'server/';
const DIR_SERVER_SRC = DIR_SERVER + 'src/';
const DIR_SERVER_DEFS = DIR_SERVER + '@types/';
const DIR_UPLOAD = DIR_SERVER + 'upload/';
const DIR_SERVER_JS = DIR_SERVER + 'js/';
const DIR_DIST = DIR_CLIENT + 'dist/';
const DIR_TOOLS = CWD + 'tools/';
const DIR_TEST_TS = DIR_SERVER_SRC + 'test/'
const DIR_TEST_JS = DIR_SERVER_JS + 'test/';

const PATH_CSS = DIR_CLIENT + 'css/*.css';
const PATH_TS = DIR_CLIENT_SRC + TS_GLOB;
const PATH_TS_CONFIG = DIR_CLIENT + TS_CONFIG;
const PATH_TS_SERVER = DIR_SERVER_SRC + TS_GLOB;
const PATH_TS_DEFS_SERVER = DIR_SERVER_DEFS + TS_GLOB;
const PATH_TS_CONFIG_SERVER = DIR_SERVER + TS_CONFIG;
const PATH_CLIENT_JS = DIR_DIST + JS_GLOB;
const PATH_VENDOR = DIR_CLIENT + 'vendor/';
const PATH_TEST_JS = DIR_TEST_JS + '*.js';
const SERVER_SCRIPT = './server/js/server.js'

const RELOAD_DELAY = 2500;

// Add gulp help functionality.
const gulp = require('gulp-help')(require('gulp'));
const shell = require('gulp-shell');
const path = require('path');
const ts = require('gulp-typescript');
const insert = require('gulp-insert');
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');

function listen() {
  const stream = nodemon({
    script: SERVER_SCRIPT,
    // Use [c] here to workaround nodemon bug #951
    watch: [DIR_SERVER_JS, DIR_CLIENT, '[c]onfig.json'],
    delay: RELOAD_DELAY,
  });

  stream.on('crash', () => {
    console.error('\n** Mostly likely your build failed. Fix errors and try again. **\n');
  });
}

function watch() {
  gulp.watch('package.json', ['npm-install']);
  gulp.watch(PATH_TS, [ 'ts' ]);
  gulp.watch(PATH_VENDOR, [ 'ts' ]);
  gulp.watch(PATH_TS_SERVER, [ 'lint-server', 'ts-server' ]);
  gulp.watch(PATH_CSS, ['css']);
}

function watchAndListen() {
  watch();
  listen();
}

function doEverything() {
  return Promise.all([compileClient, compileServer, compileCSS])
    .then(watchAndListen);
}

function getVendorJS() {
  let fs = require('fs');
  let files = fs.readdirSync(PATH_VENDOR);
  return files.reduce((acc, file) => {
    return acc + fs.readFileSync(PATH_VENDOR + file) + '\n';
  }, '');
}

function compile(pathConfig, pathSrc) {
  let project = ts.createProject(pathConfig);
  return gulp.src(pathSrc)
    .pipe(project()).js;
}

function compileClient() {
  let insert = require('gulp-insert');
  let uglify = require('gulp-uglify');
  let uglifyOptions = {
    mangle: false,
    compress: false,
    output: {
      beautify: true,
      indent_level: 2,
      semicolons: false
    }
  };

  return compile(PATH_TS_CONFIG, PATH_TS)
    .pipe(uglify(uglifyOptions))
    .pipe(insert.prepend(getVendorJS()))
    .pipe(gulp.dest(DIR_DIST));
}

function compileServer() {
  return compile(PATH_TS_CONFIG_SERVER, [PATH_TS_SERVER, PATH_TS_DEFS_SERVER])
    .pipe(gulp.dest(DIR_SERVER_JS));
}

function compileCSS() {
  var postcss = require('gulp-postcss');
  var cssnext = require('postcss-cssnext');
  var cssnano = require('cssnano');
  var plugins = [
    cssnext({
      browsers: ['last 2 versions' ],
      features: {
        customProperties: {
          warnings: false
        }
      },
    }),
    cssnano({ autoprefixer: false })
  ];
  return gulp.src(PATH_CSS)
    .pipe(postcss(plugins))
    .pipe(gulp.dest(DIR_DIST));
}

function lint(src) {
  return gulp.src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.results(results => {
      if (results.errorCount > 0) {
        console.error('Lint failed. Run `gulp prettify` to format your code.\n');
      }
    }))
    .pipe(eslint.failAfterError());
}

function cleanFolder(src) {
  return gulp.src(src, { read: false })
    .pipe(clean());
}

function prettify(src) {
  return gulp.src(src, { base: CWD })
    .pipe(eslint({ fix: true }))
    .pipe(gulp.dest(CWD));
}

function prettifyAll() {
  return prettify([PATH_TS, PATH_TS_SERVER]);
}

gulp.task('lint-web', lint.bind(null, PATH_TS));
gulp.task('lint-server', lint.bind(null, PATH_TS_SERVER));
gulp.task('lint', 'Perform style checks on all typescript code',
  ['lint-web', 'lint-server']);

gulp.task('prettify', 'Auto-format all typescript code', prettifyAll);

gulp.task('css', 'Minify CSS files', compileCSS);

gulp.task('ts', 'Compile typescript files into bundle.js',
  ['clean-web', 'lint-web'], compileClient);

gulp.task('ts-server', 'Compile typescript server files.',
  ['clean-server', 'lint-server'], compileServer);

gulp.task('build', 'Build both server and client js', ['ts', 'ts-server', 'css']);

gulp.task('npm-install', 'Install npm dependencies.',
  shell.task(['npm install']));

gulp.task('clean-web', cleanFolder.bind(null, PATH_CLIENT_JS));

gulp.task('clean-server', cleanFolder.bind(null, DIR_SERVER_JS));

gulp.task('clean', 'Remove all build files.',
  ['clean-web', 'clean-server']);

gulp.task('clean-upload', 'Remove uploaded clips.',
  shell.task([`git clean -idx ${DIR_UPLOAD}`]));

gulp.task('listen', 'Run development server.', listen);

gulp.task('run', 'Just run the server', shell.task(['node ' + SERVER_SCRIPT]));

gulp.task('watch', 'Rebuild, rebundle, re-install on file changes.', watch);

gulp.task('create', 'Create the database.', ['ts-server'], (done) => {
  let create = require(DIR_TOOLS + 'createDb');
  create.run(err => {
    if (!err) {
      console.log('Db created.');
    }
    done();
  });
});

gulp.task('drop', 'Detroy the database.', ['ts-server'], (done) => {
  let drop = require(DIR_TOOLS + 'dropDb');
  drop.run(done);
});

gulp.task('deploy', 'deploy production',
  ['npm-install', 'build'], (done) => {
    let config = require('./config.json');
    let pm2 = require('pm2');
    let ff = require('ff');
    let f = ff(() => {
      pm2.connect(f.wait());
    }, () => {
      pm2.stop(APP_NAME, f.waitPlain());
    }, () => {
      pm2.start({
        name: APP_NAME,
        script: "./gulpfile.js",
        output: config.logfile || "log.txt",
        error: config.logfile || "log.txt",
      }, f());
    }).onComplete((err) => {
      if (err) {
        console.log('prod error', err);
      }
      pm2.disconnect();
      done();
    });
  });

gulp.task('count', 'Print sentence collection count.', ['ts-server'], () => {
  const Server = require(SERVER_SCRIPT).default;
  let server = new Server();
  return server.countCorpus()
});


gulp.task('default', 'Running just `gulp`.', ['build'], () => {
  watchAndListen();
});

gulp.task('test', 'Run all tests.', ['ts-server'], () => {
  const tape = require('gulp-tape');
  const colorize = require('tap-colorize');
  return gulp.src(PATH_TEST_JS)
    .pipe(tape({
      bail: true,
      reporter: colorize(),
    }));
});

// Deploy script also runs this file, so exec the default task.
if (require.main === module) {
  doEverything();
}
