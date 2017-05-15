(function() {
  'use strict';

  // Add gulp help functionality.
  let gulp = require('gulp-help')(require('gulp'));
  let shell = require('gulp-shell');
  let path = require('path');
  let ts = require('gulp-typescript');
  let insert = require('gulp-insert');

  const APP_NAME = 'common-voice';
  const DIR_SERVER = path.join(__dirname, 'server');
  const DIR_UPLOAD = path.join(DIR_SERVER, 'upload');
  const DIR_JS = path.join(__dirname, '/client/js/');
  const DIR_SERVER_JS = path.join(DIR_SERVER, '/js/');
  const PATH_TS = path.join(__dirname, '/client/src/', '/**/*.ts');
  const PATH_TS_SERVER = path.join(DIR_SERVER, '/src/**/*.ts');
  const PATH_AMD_LOADER = path.join(__dirname,'client/vendor/almond.js');

  function compile(project) {
    return project.src().pipe(project()).js;
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
    let fs = require('fs');
    let uglify = require('gulp-uglify');
    let project = ts.createProject(__dirname + '/client/tsconfig.json');
    return compile(project)
      .pipe(require('gulp-insert')
            .prepend(fs.readFileSync(PATH_AMD_LOADER)))
      .pipe(uglify({ mangle: false, compress: false, output: {
        beautify: true,
        indent_level: 2,
        semicolons: false
      }}))
      .pipe(gulp.dest(DIR_JS));
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

  gulp.task('deploy', 'deploy production',
    ['npm-install', 'build'], (done) => {
    let pm2 = require('pm2');
    let ff = require('ff');
    let f = ff(() => {
      pm2.connect(f.wait());
    }, () => {
      pm2.stop(APP_NAME, f.waitPlain());
    }, (config) => {
      pm2.start({
        name: APP_NAME,
        script: "server/js/server.js",
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
    watch();
    listen();
  });
})();
