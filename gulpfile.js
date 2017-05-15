(function() {
  'use strict';

  // Add gulp help functionality.
  let gulp = require('gulp-help')(require('gulp'));
  let shell = require('gulp-shell');
  let path = require('path');
  let ts = require('gulp-typescript');
  let insert = require('gulp-insert');
  let fs = require('fs');
  let uglify = require('gulp-uglify');
  let sourcemaps = require('gulp-sourcemaps');
  let config = require('./config.json');

  const DIR_SERVER = path.join(__dirname, 'server');
  const DIR_UPLOAD = path.join(DIR_SERVER, 'upload');
  const DIR_JS = path.join(__dirname, '/client/js/');
  const DIR_SERVER_JS = path.join(DIR_SERVER, '/js/');
  const PATH_TS = path.join(__dirname, '/client/src/', '/**/*.ts');
  const PATH_TS_SERVER = path.join(DIR_SERVER, '/src/**/*.ts');
  const PATH_AMD_LOADER = path.join(__dirname,'client/vendor/almond.js');

  function compile(project) {
    let src = project.src();
    if (!config.PROD) {
      src = src.pipe(sourcemaps.init());
    }

    return src.pipe(project()).js;
  }

  function listen() {
    require('gulp-nodemon')({
      script: 'server/js/server.js',
      // Use [c] here to workaround nodemon bug #951
      watch: ['server/js', '[c]onfig.json'],
      delay: 2.5,
    });
  }

  function watch() {
    gulp.watch('package.json', ['npm-install']);
    gulp.watch(PATH_TS, ['ts']);
    gulp.watch(PATH_TS_SERVER, ['ts-server']);
  }

  gulp.task('ts', 'Compile typescript files into bundle.js', () => {
    let project = ts.createProject(__dirname + '/client/tsconfig.json');
    let src = compile(project)
      .pipe(require('gulp-insert')
            .prepend(fs.readFileSync(PATH_AMD_LOADER)))
      .pipe(sourcemaps.init())
      .pipe(uglify({ mangle: false, compress: false, output: {
        semicolons: false
      }}));

    if (!config.PROD) {
      src = src.pipe(sourcemaps.write());
    }

    return src.pipe(gulp.dest(DIR_JS));
  });

  gulp.task('ts-server', 'Compile typescript server files.', () => {
    let project = ts.createProject(__dirname + '/server/tsconfig.json');
    return compile(project)
      .pipe(gulp.dest(DIR_SERVER_JS));
  });

  gulp.task('build', 'Build both server and client js', ['ts', 'ts-server']);

  gulp.task('npm-install', 'Install npm dependencies.',
            shell.task(['npm install']));

  gulp.task('clean', 'Remove uploaded clips.',
            shell.task([`git clean -idx ${DIR_UPLOAD}`]));

  gulp.task('listen', 'Run development server.', listen);

  gulp.task('watch', 'Rebuild, rebundle, re-install on file changes.', watch);

  gulp.task('default', 'Running just `gulp`.', ['build'], () => {
    watch();
    listen();
  });
})();
