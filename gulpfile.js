(function() {
  'use strict';

  let gulp = require('gulp');
  let shell = require('gulp-shell');
  let path = require('path');
  let ts = require('gulp-typescript');

  const PATH_JS = __dirname + '/client/js/';
  const PATH_SERVER = __dirname + '/server/';
  const PATH_UPLOAD = __dirname + '/server/upload/';
  const CONFIG_FILE = __dirname + '/config.json';

  gulp.task('ts', function () {
    return gulp.src('client/src/**/*.ts')
      .pipe(ts({
        noImplicitAny: false,
        out: 'index.js',
        "target": "es5",
        "lib": ["es2015", "dom"]
      }))
      .pipe(gulp.dest('client/js'));
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
      path.join(PATH_JS, '/**/*.js'),
      path.join(PATH_SERVER, '**/*.js'),
      'gulpfile.js'
    ];
    let task = gulp.src(lintPaths);
    return task.pipe(jshint()).pipe(jshint.reporter('default'));
  });

  gulp.task('watch', () => {
    let watchPaths = [
      CONFIG_FILE,
      PATH_JS + '/**/*.ts',
      PATH_SERVER + '/**/*.js',
      'gulpfile.js'
    ];
    gulp.watch(watchPaths, ['lint']);
    gulp.watch('package.json', ['npm-install']);
  });

  gulp.task('default', ['ts', 'lint', 'watch', 'listen']);
})();
