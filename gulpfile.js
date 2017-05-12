(function() {
  'use strict';

  // Add gulp help functionality.
  let gulp = require('gulp-help')(require('gulp'));
  let shell = require('gulp-shell');
  let path = require('path');
  let ts = require('gulp-typescript');
  let tsProject = ts.createProject(__dirname + '/client/tsconfig.json');
  let tsServerProject = ts.createProject(__dirname + '/server/tsconfig.json');

  const DIR_SERVER = path.join(__dirname, 'server');
  const DIR_UPLOAD = path.join(DIR_SERVER, 'upload');
  const DIR_JS = path.join(__dirname, '/client/js/');
  const DIR_SERVER_JS = path.join(DIR_SERVER, '/js/');
  const PATH_TS = path.join(__dirname, '/client/src/', '/**/*.ts');
  const PATH_TS_SERVER = path.join(DIR_SERVER, '/src/**/*.ts');

  function compile(project, output) {
    return project.src()
           .pipe(project())
           .js.pipe(gulp.dest(output));
  }

  gulp.task('ts', 'Compile typescript files into bundle.js', () => {
    return compile(tsProject, DIR_JS);
  });

  gulp.task('ts-server', 'Compile typescript server files into bundle.js',
  () => {
    return compile(tsServerProject, DIR_SERVER_JS);
  });

  gulp.task('npm-install', 'Install npm dependencies.',
            shell.task(['npm install']));

  gulp.task('clean', 'Remove uploaded clips.',
            shell.task([`git clean -idx ${DIR_UPLOAD}`]));

  gulp.task('listen', 'Run development server.', () => {
    require('gulp-nodemon')({
      script: 'server/js/server.js',
      // Use [c] here to workaround nodemon bug #951
      watch: ['server/js', '[c]onfig.json'],
      delay: 2.5,
    });
  });

  gulp.task('watch', 'Rebuild, rebundle, re-install on file changes.', () => {
    gulp.watch('package.json', ['npm-install']);
    gulp.watch(PATH_TS, ['ts']);
    gulp.watch(PATH_TS_SERVER, ['ts-server']);
  });

  gulp.task('default', 'Running just `gulp`.',
            ['ts', 'ts-server', 'watch', 'listen']);
})();
