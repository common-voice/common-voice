const replace = require('replace-in-file');
const { src, dest, watch, series } = require('gulp');
const inject = require('gulp-inject')
const fs = require('fs');

function setup(cb) {
	try {
		fs.copyFileSync("../web/src/components/vars.css", "css/vars.css", (err) => {
	    if (err) throw err;
		});

		fs.copyFileSync("../web/index_template.html", "index.html", (err) => {
	    if (err) throw err;
		});

		replace({
			files: 'index.html',
			from: '<div id="root"></div>',
			to: '<!-- inject:html --><!-- endinject -->'
		}).then(res => {
			console.log("index_template.html and vars.css copied to maintenance folder");
			cb();
		}).catch(err => {
			throw err;
		});
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