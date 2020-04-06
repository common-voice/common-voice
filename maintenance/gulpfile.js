const replace = require('replace-in-file');
const { src, dest, watch, series } = require('gulp');
const inject = require('gulp-inject')
const fs = require('fs');

// @TODO: replace with Webpack
function setup(cb) {
  try {
    fs.copyFileSync("../web/src/components/vars.css", "css/vars.css", (err) => {
      if (err) throw err;
    });

    fs.copyFileSync("../web/index_template.html", "index.html", (err) => {
      if (err) throw err;
    });

    // Insert injection code for gulp-inject
    replace.sync({
      files: 'index.html',
      from: '<div id="root"></div>',
      to: '<!-- inject:html --><!-- endinject -->'
    });

    // Change title of maintenance page
    replace.sync({
      files: 'index.html',
      from: '<title>Common Voice</title>',
      to: '<title>Common Voice is undergoing maintenance</title>'
    });

    console.log("index_template.html and vars.css copied to maintenance folder");
    cb();
  } catch(e) {
    console.log("Error encountered when attempting to copy templates from /web: ", e.message);
    cb();
  }
}

function compileHtml(cb) {
  src('./index.html')
    .pipe(inject(src('maintenance.html'), {
      transform: (filepath, file) => file.contents.toString()
    }))
    .pipe(dest('.'));
  cb();
}

function dev(cb) {
  watch('maintenance.html', compileHtml);
  cb();
}

exports.dev = series(setup, compileHtml, dev);
exports.default = series(setup, compileHtml);