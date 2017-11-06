const readline = require('readline');
const fs = require('fs');
const crypto = require('crypto');

function hash(data) {
  return crypto.createHash("sha256").update(data).digest("base64");
}

function getSentences(paragraph) {
  var sentences = [];
  var currentSentence = '';
  var words = paragraph.split(' ');
  let word;
  while (word = words.shift()) {
    if (!word) {
      continue;
    }
    currentSentence += word + ' ';
    if ((word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) &&
      word !== 'Mr.' && word !== 'Mrs.') {
      sentences.push(currentSentence.trim());
      currentSentence = '';
    }
  }
  return sentences;
}

let infile = process.argv[2];
let outfile = process.argv[3];
if (!infile) {
  console.error('no input file specified');
  process.exit(1);
}
if (!outfile) {
  console.error('no output file specified');
  process.exit(1);
}

let lines = []
let currentParagraph = '';

let input = readline.createInterface({
  input: fs.createReadStream(infile)
});

input.on('line', line => {
  if (!line || line.length < 1) {
    lines = lines.concat(getSentences(currentParagraph));
    currentParagraph = '';
    return;
  }
  currentParagraph += line;
});

input.on('close', () => {
  lines = lines.filter(s => {
    var words = s.split(' ');
    /*
    words.forEach(w => {
      try {
        w && wordnet.lookup(w, (err, def) => {
          if (err) {
            console.log('error', w, err);
          }
        });
      } catch (err) {
        console.log('bad word', w, err);
      }
    });
    */

    var spaces = words.length - 1;
    if (spaces < 3 || spaces > 15) {
      return false;
    }

    return true;
  });
  fs.writeFileSync(outfile, lines.join("\n"));
  console.log('wrote lines', lines.length);
});

