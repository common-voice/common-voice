(function() {
  'use strict';

  let gulp = require('gulp');
  let shell = require('gulp-shell');
  let path = require('path');
  let ts = require('gulp-typescript');

  const DIR_JS = path.join(__dirname, '/client/js/');
  const PATH_JS = path.join(DIR_JS, '/**/*.js');
  const PATH_TS = path.join(__dirname, '/client/src/', '/**/*.ts');
  const PATH_SERVER = __dirname + '/server/';
  const PATH_UPLOAD = __dirname + '/server/upload/';
  const CONFIG_FILE = __dirname + '/config.json';

  gulp.task('ts', function () {
    return gulp.src(PATH_TS)
      .pipe(ts({
        noImplicitAny: false,
        out: 'bundle.js',
        target: 'es5',
        lib: ['es2015', 'dom']
      }))
      .pipe(gulp.dest(DIR_JS));
  });

  gulp.task('npm-install', shell.task(['npm install']));

  gulp.task('clean', shell.task([`git clean -idx ${PATH_UPLOAD}`]));

  gulp.task('listen', () => {
    require('gulp-nodemon')({
      script: 'server/server.js',
      // Use [c] here to workaround nodemon bug #951
      watch: ['server', '[c]onfig.json'],
    });
  });

  gulp.task('lint', () => {
    let jshint = require('gulp-jshint');
    let lintPaths = [
      PATH_JS,
      path.join(PATH_SERVER, '**/*.js'),
      'gulpfile.js'
    ];
    let task = gulp.src(lintPaths);
    return task.pipe(jshint()).pipe(jshint.reporter('default'));
  });

  gulp.task('watch', () => {
    let watchPaths = [
      CONFIG_FILE,
      PATH_JS,
      PATH_SERVER + '/**/*.js',
      'gulpfile.js'
    ];
    gulp.watch(watchPaths, ['lint']);
    gulp.watch('package.json', ['npm-install']);
    gulp.watch(PATH_TS, ['ts']);
  });

  gulp.task('default', ['ts', 'lint', 'watch', 'listen']);
})();
