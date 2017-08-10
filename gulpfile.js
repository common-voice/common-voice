'use strict';

const APP_NAME = 'common-voice';
const TS_CONFIG = 'tsconfig.json';
const TS_GLOB = 'src/**/*';
const DIR_CLIENT = './web/';
const DIR_SERVER = './server/';
const DIR_UPLOAD = DIR_SERVER + 'upload/';
const DIR_SERVER_JS = DIR_SERVER + 'js/';
const DIR_DIST = DIR_CLIENT + 'dist/';

const PATH_CSS = DIR_CLIENT + 'css/*.css';
const PATH_TS = DIR_CLIENT + TS_GLOB;
const PATH_TS_SERVER = DIR_SERVER + TS_GLOB;
const PATH_VENDOR = DIR_CLIENT + 'vendor/';
const RELOAD_DELAY = 2500;
const SERVER_SCRIPT = 'server/js/server.js'


// Add gulp help functionality.
let gulp = require('gulp-help')(require('gulp'));
let shell = require('gulp-shell');
let path = require('path');
let ts = require('gulp-typescript');
let insert = require('gulp-insert');

function compile(project) {
  return project.src().pipe(project()).js;
}

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

function compileCSS() {
  var postcss = require('gulp-postcss');
  var cssnext = require('postcss-cssnext');
  var cssnano = require('cssnano');
  var plugins = [
    cssnext({browsers: ['last 2 versions']}),
    cssnano()
  ];
  return gulp.src(PATH_CSS)
    .pipe(postcss(plugins))
    .pipe(gulp.dest(DIR_DIST));
}

function compileClient() {
  let project = ts.createProject(DIR_CLIENT + TS_CONFIG);
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

  return compile(project)
    .pipe(uglify(uglifyOptions))
    .pipe(insert.prepend(getVendorJS()))
    .pipe(gulp.dest(DIR_DIST));
}

function compileServer() {
  let project = ts.createProject(DIR_SERVER + TS_CONFIG);
  return compile(project)
    .pipe(gulp.dest(DIR_SERVER_JS));
}

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
