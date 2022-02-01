const path = require('path');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');

function sortArrayAlphabetically(a, b) {
  const A = a.toUpperCase();
  const B = b.toUpperCase();

  if (A < B) {
    return -1; // A comes first
  }

  if (A > B) {
    return 1; // B comes first
  }

  return 0; // must be equal
}

const fsReaddir = util.promisify(fs.readdir);
const fsReadFile = util.promisify(fs.readFile);
const fsLstat = util.promisify(fs.lstat);

const WEB_DIRECTORY = path.join(__dirname, '/../web/');
const IGNORE_PATH = ['node_modules/', 'dist/', 'locales/'];
const IGNORE_LOCALISATION_STRINGS = [
  'ab',
  'ace',
  'ady',
  'af',
  'am',
  'an',
  'ar',
  'arn',
  'as',
  'ast',
  'az',
  'ba',
  'bas',
  'be',
  'bg',
  'bn',
  'br',
  'bs',
  'bxr',
  'ca',
  'cak',
  'ckb',
  'cnh',
  'co',
  'cs',
  'cv',
  'cy',
  'da',
  'de',
  'dsb',
  'dv',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fo',
  'fr',
  'fy-NL',
  'ga-IE',
  'gl',
  'gn',
  'gom',
  'ha',
  'he',
  'hi',
  'hr',
  'hsb',
  'ht',
  'hu',
  'hy-AM',
  'hyw',
  'ia',
  'id',
  'ie',
  'ig',
  'is',
  'it',
  'izh',
  'ja',
  'ka',
  'kaa',
  'kab',
  'kbd',
  'ki',
  'kk',
  'km',
  'kmr',
  'knn',
  'ko',
  'kpv',
  'kw',
  'ky',
  'lg',
  'lij',
  'lt',
  'lv',
  'mai',
  'mdf',
  'mg',
  'mhr',
  'mk',
  'ml',
  'mn',
  'mni',
  'mos',
  'mr',
  'mrj',
  'ms',
  'mt',
  'my',
  'myv',
  'nan-tw',
  'nb-NO',
  'ne-NP',
  'nia',
  'nl',
  'nn-NO',
  'nyn',
  'oc',
  'or',
  'pa-IN',
  'pap-AW',
  'pl',
  'ps',
  'pt',
  'quc',
  'quy',
  'rm-sursilv',
  'rm-vallader',
  'ro',
  'ru',
  'rw',
  'sah',
  'sat',
  'sc',
  'scn',
  'shi',
  'si',
  'sk',
  'sl',
  'so',
  'sq',
  'sr',
  'sv-SE',
  'sw',
  'syr',
  'ta',
  'te',
  'tg',
  'th',
  'ti',
  'tig',
  'tk',
  'tl',
  'tr',
  'tt',
  'tw',
  'ty',
  'uby',
  'udm',
  'ug',
  'uk',
  'ur',
  'uz',
  'vec',
  'vi',
  'vot',
  'yi',
  'yo',
  'yue',
  'zh-CN',
  'zh-HK',
  'zh-TW',
];
const EXTENSIONS = ['js', 'ts', 'tsx'];

async function checkForUnusedLocalization() {
  console.info('Processing files...');

  const unusedLocalizationStrings = [];
  const localizationStrings = await getStringsInFilesInDirectory();

  await Promise.all(
    localizationStrings.map(async localizationString => {
      const files = await searchFilesInDirectory(
        WEB_DIRECTORY,
        localizationString,
        EXTENSIONS
      );

      if (!files || files.length === 0) {
        const isIgnoredLocaleString =
          IGNORE_LOCALISATION_STRINGS.includes(localizationString);
        const isSentenceCollectorString = localizationString.startsWith('sc-');

        if (!isIgnoredLocaleString && !isSentenceCollectorString) {
          unusedLocalizationStrings.push(localizationString);
        }
      }
    })
  );

  if (unusedLocalizationStrings.length > 0) {
    throw new Error(
      chalk.red(
        `\n${unusedLocalizationStrings
          .sort(sortArrayAlphabetically)
          .join('\n')}\n\n${
          unusedLocalizationStrings.length
        } localization strings missing in code`
      )
    );
  }
}

checkForUnusedLocalization();

async function getStringsInFilesInDirectory() {
  const found = await getFilesInDirectory(
    path.join(WEB_DIRECTORY, 'locales/en'),
    ['ftl'],
    []
  );

  const strings = [];

  for (file of found) {
    const fileContent = await fsReadFile(file);
    const fileContentString = fileContent.toString();

    const regex = new RegExp(/^[\S]+\s\=/, 'mg');
    const results = fileContentString.match(regex);

    results.forEach(result => {
      const strippedResult = result.replace('=', '').trim();
      if (!strings.includes(strippedResult)) {
        strings.push(strippedResult);
      }
    });
  }

  return strings;
}

async function searchFilesInDirectory(dir, filter, extensions) {
  const found = await getFilesInDirectory(dir, extensions, IGNORE_PATH);

  const filesFoundIn = [];

  for (file of found) {
    const fileContent = await fsReadFile(file);

    // We want full words, so we use full word boundary in regex.
    const regex = new RegExp('\\b' + filter + '\\b');
    if (regex.test(fileContent)) {
      filesFoundIn.push(file);
    }
  }

  return filesFoundIn;
}

// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
async function getFilesInDirectory(dir, extensions, ignorePath) {
  let files = [];
  const filesFromDirectory = await fsReaddir(dir).catch(err => {
    throw new Error(err.message);
  });

  for (let file of filesFromDirectory) {
    const filePath = path.join(dir, file);
    const stat = await fsLstat(filePath);

    if (ignorePath.find(path => filePath.includes(path))) {
      return;
    }

    // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
    if (stat.isDirectory()) {
      const nestedFiles = await getFilesInDirectory(
        filePath,
        extensions,
        ignorePath
      );
      if (nestedFiles && nestedFiles.length > 0) {
        files = files.concat(nestedFiles);
      }
    } else {
      if (extensions.includes(path.extname(file).replace('.', ''))) {
        files.push(filePath);
      }
    }
  }

  return files;
}
