const fs = require('fs');
const path = require('path');

const CORPUS_FOLDER = path.join(__dirname, '..', 'server/data');
const DEACTIVE_FOLDER = path.join(CORPUS_FOLDER, 'not-used');

/**
 * Create a function that is the promise version of standard callback apis.
 */
function promisify(ctx, func) {
  return function(...args) {
    return new Promise((res, rej) => {
      args.push((err, result) => {
        if (err) {
          rej('failed');
          return;
        }
        res(result);
      });
      func.apply(ctx, args);
    });
  };
}

/**
 * Promise versions of fs node standard lib.
 */
const readdirPromise = promisify(fs, fs.readdir);
const readFilePromise = promisify(fs, fs.readFile);

/**
 * Remove non '.txt' files from the list.
 */
function getTextFiles(files) {
  return files.filter(file => {
    return file.substr(-4) === '.txt';
  });
}

/**
 * Count all the lines from all the text files in names list.
 */
async function countSentences(names, folder) {
  let count = 0;
  for (let i = 0; i < names.length; i++) {
    let fileName = path.join(folder, names[i]);
    let text = await readFilePromise(fileName, 'utf8');
    let lines = text.split('\n');
    count += lines.length;
  }
  return count;
}


/**
 * Print count of both active and deactive sentences.
 */
async function displayCount() {
  console.log('Counting current sentences...');

  let active = await readdirPromise(CORPUS_FOLDER);
  active = getTextFiles(active);

  let deactive = await readdirPromise(DEACTIVE_FOLDER);
  deactive = getTextFiles(deactive);

  let activeCount = await countSentences(active, CORPUS_FOLDER);
  let deactiveCount = await countSentences(deactive, DEACTIVE_FOLDER);

  console.log(`\nActive: ${activeCount} lines from ${active.length} sources`);
  console.log(`Deactive: ${deactiveCount} lines from ${deactive.length} sources\n`);
}

// Allow running as a script and module.
if (require.main === module) {
  displayCount().catch(err => {
    console.error('top level error', err);
  });;
} else {
  module.exports = displayCount;
}
