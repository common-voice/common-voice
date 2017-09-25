'use strict';

const CWD = process.cwd() + '/';

const APP_NAME = 'common-voice';
const TS_CONFIG = 'tsconfig.json';
const TS_GLOB = '**/*.ts*';
const DIR_CLIENT = CWD + 'web/';
const DIR_CLIENT_SRC = DIR_CLIENT + 'src/';
const DIR_SERVER = CWD + 'server/';
const DIR_SERVER_SRC = DIR_SERVER + 'src/';
const DIR_UPLOAD = DIR_SERVER + 'upload/';
const DIR_SERVER_JS = DIR_SERVER + 'js/';
const DIR_DIST = DIR_CLIENT + 'dist/';

const PATH_CSS = DIR_CLIENT + 'css/*.css';
const PATH_TS = DIR_CLIENT_SRC + TS_GLOB;
const PATH_TS_CONFIG = DIR_CLIENT + TS_CONFIG;
const PATH_TS_SERVER = DIR_SERVER_SRC + TS_GLOB;
const PATH_TS_CONFIG_SERVER = DIR_SERVER + TS_CONFIG;
const PATH_VENDOR = DIR_CLIENT + 'vendor/';
const SERVER_SCRIPT = 'server/js/server.js'

const RELOAD_DELAY = 2500;

// Add gulp help functionality.
let gulp = require('gulp-help')(require('gulp'));
let shell = require('gulp-shell');
let path = require('path');
let ts = require('gulp-typescript');
let insert = require('gulp-insert');
let eslint = require('gulp-eslint');

function listen() {
  require('gulp-nodemon')({
    script: SERVER_SCRIPT,
    // Use [c] here to workaround nodemon bug #951
    watch: [DIR_SERVER_JS, DIR_CLIENT, '[c]onfig.json'],
    delay: RELOAD_DELAY,
  });
}

function watch() {
  gulp.watch('package.json', ['npm-install']);
  gulp.watch(PATH_TS, ['ts']);
  gulp.watch(PATH_VENDOR, ['ts']);
  gulp.watch(PATH_TS_SERVER, ['ts-server']);
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

  // Always lint before compiling.
  return lint(pathSrc)
    .pipe(project())
    .js;
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
  return compile(PATH_TS_CONFIG_SERVER, PATH_TS_SERVER)
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
    .pipe(eslint.failAfterError());
}

function lintAll() {
  return lint([PATH_TS, PATH_TS_SERVER]);
}

function prettify(src) {
  return gulp.src(src, { base: CWD })
    .pipe(eslint({ fix: true }))
    .pipe(gulp.dest(CWD));
}

function prettifyAll() {
  return prettify([PATH_TS, PATH_TS_SERVER]);
}

gulp.task('lint', 'Perform style checks on all typescript code', lintAll);

gulp.task('prettify', 'Auto-format all typescript code', prettifyAll);

gulp.task('css', 'Minify CSS files', compileCSS);

gulp.task('ts', 'Compile typescript files into bundle.js', compileClient);

gulp.task('ts-server', 'Compile typescript server files.', compileServer);

gulp.task('build', 'Build both server and client js', ['ts', 'ts-server', 'css']);

gulp.task('npm-install', 'Install npm dependencies.',
  shell.task(['npm install']));

gulp.task('clean', 'Remove uploaded clips.',
  shell.task([`git clean -idx ${DIR_UPLOAD}`]));

gulp.task('listen', 'Run development server.', listen);

gulp.task('run', 'Just run the server', shell.task(['node ' + SERVER_SCRIPT]));

gulp.task('watch', 'Rebuild, rebundle, re-install on file changes.', watch);

gulp.task('create', 'Create the database.', ['ts-server'], (done) => {
  let create = require('./tools/createDb');
  create.run(err => {
    if (!err) {
      console.log('Db created.');
    }
    done();
  });
});

gulp.task('drop', 'Detroy the database.', ['ts-server'], (done) => {
  let drop = require('./tools/dropDb');
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

gulp.task('default', 'Running just `gulp`.', ['build'], () => {
  watchAndListen();
});

// Deploy script also runs this file, so exec the default task.
if (require.main === module) {
  doEverything();
}
