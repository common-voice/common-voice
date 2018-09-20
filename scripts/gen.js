if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}
var fs = require('fs'), filename = process.argv[2];
fs.readFile(filename, 'utf8', function (err, data) {
  if (err) throw err;
  let lines = data.split("\r\n");
  // console.log(lines);

  let paragraph = [];
  let paragraphs = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]) {
      paragraph.push(lines[i]);
    } else {
      if (paragraph.length) {
        let str = paragraph.join(" ");
        let sentences = str.match(/[^\.!\?]+[\.!\?]+/g);
        if (sentences) {
          sentences = sentences.map(s => s.trim());

          // Filter
          sentences = sentences.filter(s => {
            if (hasAnyChar("()[]-_:\"", s)) {
              return false;
            }
            if (s.length < 30) { // Short sentence filter.
              return false;
            }
            return true;
          });

          if (sentences.length) {
            // Only keep plain English. Easily understood
            // by 13- to 15-year-old students.
            if (flesch(sentences) >= 60) {
              // console.log(flesch(sentences));
              paragraphs.push(sentences);
            }
          }
        }
        paragraph = [];
      }
    }
  }
  // console.log(paragraphs);

  paragraphs.forEach(paragraph => {
    paragraph.forEach(s => {
      console.log(s);
    })
    console.log("");
  });
});

// 100.00-90.00	5th grade	Very easy to read. Easily understood by an average 11-year-old student.
// 90.0–80.0	6th grade	Easy to read. Conversational English for consumers.
// 80.0–70.0	7th grade	Fairly easy to read.
// 70.0–60.0	8th & 9th grade	Plain English. Easily understood by 13- to 15-year-old students.
// 60.0–50.0	10th to 12th grade	Fairly difficult to read.
// 50.0–30.0	College	Difficult to read.
// 30.0–0.0	College Graduate	Very difficult to read. Best understood by university graduates.
function flesch(sentences) {
  let words = 0;
  let syllables = 0;
  sentences.forEach(s => {
    let w = s.split(" ");
    words += w.length;
    for (let i = 0; i < w.length; i++) {
      syllables += countSyllables(w[i]);
    }
  });
  return 206.835 - 1.015 * (words / sentences.length) - 84.6 * (syllables / words);
}

function countSyllables(word) {
  var syl    = 0;
  var vowel  = false;
  var length = word.length;

  // Check each word for vowels (don't count more than one vowel in a row)
  for (var i = 0; i < length; i++) {
    if (isVowel(word.charAt(i)) && (vowel == false)) {
      vowel = true;
      syl++;
    } else if (isVowel(word.charAt(i)) && (vowel == true)) {
      vowel = true;
    } else {
      vowel = false;
    }
  }

  var tempChar = word.charAt(word.length-1);
  // Check for 'e' at the end, as long as not a word w/ one syllable
  if (((tempChar == 'e') || (tempChar == 'E')) && (syl != 1)) {
    syl--;
  }
  return syl;
}
// Check if a char is a vowel (count y)
function isVowel(c) {
  if      ((c == 'a') || (c == 'A')) { return true;  }
  else if ((c == 'e') || (c == 'E')) { return true;  }
  else if ((c == 'i') || (c == 'I')) { return true;  }
  else if ((c == 'o') || (c == 'O')) { return true;  }
  else if ((c == 'u') || (c == 'U')) { return true;  }
  else if ((c == 'y') || (c == 'Y')) { return true;  }
  else                               { return false; }
}
function hasAnyChar(chars, str) {
  for (let i = 0; i < chars.length; i++) {
    if (str.indexOf(chars[i]) >= 0) {
      return true;
    }
  }
  return false;
}