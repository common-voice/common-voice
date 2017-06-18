const readline = require('readline');
const fs = require('fs');
const wordnet = require('wordnet');

function isUpperCase(line) {
  return line === line.toUpperCase();
}

const input = readline.createInterface({
  input: fs.createReadStream(process.argv[2])
});


var currentLine = '';
var lines = [];

input.on('line', line => {
  lines.push(line.trim());
});

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


/*
function shuffle(array) {
  var rand, index = -1,
    length = array.length,
    result = Array(length);
  while (++index < length) {
    rand = Math.floor(Math.random() * (index + 1));
    result[index] = result[rand];
    result[rand] = array[index];
  }
  return result;
}
  */

var finalSentences = [];

input.on('close', () => {
  lines.forEach(line => {
    finalSentences = finalSentences.concat(getSentences(line));
  });
  finalSentences = finalSentences.filter(s => {
    if (s.includes(',') || s.includes('–') ||
      s.includes('..') || s.includes('-') ||
      s.includes(')') || s.includes('\' ') || s.includes('de ')) {
      return false;
    }

    var words = s.split(' ');
    // words.forEach(w => {
    //   try {
    //     w && wordnet.lookup(w, (err, def) => {
    //       if (err) {
    //         console.log('error', w, err);
    //       }
    //     });
    //   } catch (err) {
    //     console.log('bad word', w, err);
    //   }
    // });

    var spaces = words.length - 1;
    if (spaces < 3 || spaces > 10) {
      return false;
    }

    return true;
  });
  finalSentences.forEach(sentence => {
    process.stdout.write(sentence + '\n');
  });
});

