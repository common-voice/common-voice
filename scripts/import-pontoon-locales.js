const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');

const PROGRESS_THRESHOLD = 0.95;

const dataPath = path.join(__dirname, '..', 'data');

async function fetchPontoonLanguages() {
  const { data } = await request({
    uri: 'https://pontoon.mozilla.org/graphql',
    method: 'POST',
    json: true,
    body: {
      query: `{
            project(slug: "common-voice") {
              localizations {
                totalStrings
                approvedStrings
                locale {
                  code
                  name
                }
              }
            }
          }`,
      variables: null,
    },
  });
  return data.project.localizations
    .map(({ totalStrings, approvedStrings, locale }) => [
      locale.code,
      locale.name,
      approvedStrings / totalStrings,
    ])
    .concat([['en', 'English', 1]])
    .sort(([code1], [code2]) => code1.localeCompare(code2));
}

async function saveToMessages(languages) {
  const messagesPath = path.join(
    __dirname,
    '..',
    'web',
    'locales',
    'en',
    'messages.ftl'
  );
  const messages = fs.readFileSync(messagesPath, 'utf-8');
  const newMessages = messages.replace(
    /#\[Languages]([\s\S]*?)#\[\/]/gm,
    [
      '#[Languages]',
      '## Languages',
      languages.map(([code, name]) => `${code} = ${name}`).join('\n'),
      '#[/]',
    ].join('\n')
  );
  fs.writeFileSync(messagesPath, newMessages);
}

async function saveLocalesJSON(languages) {
  fs.writeFileSync(
    path.join(dataPath, 'locales.json'),
    JSON.stringify(
      languages.reduce((obj, [k, v]) => {
        obj[k] = v;
        return obj;
      }, {}),
      null,
      2
    )
  );
}

/**
 * Saves completed locales (always merges with previously added locales)
 */
async function saveCompletedLocalesJSON(languages) {
  const completedLocalesPath = path.join(dataPath, 'completed_locales.json');
  const existingLocales = JSON.parse(
    fs.readFileSync(completedLocalesPath, 'utf-8')
  );
  fs.writeFileSync(
    completedLocalesPath,
    JSON.stringify(
      [
        ...new Set([
          ...existingLocales,
          ...languages
            .filter(([code, name, progress]) => progress >= PROGRESS_THRESHOLD)
            .map(l => l[0]),
        ]),
      ].sort(),
      null,
      2
    )
  );
}

async function importPontoonLocales() {
  const languages = await fetchPontoonLanguages();
  await saveToMessages(languages);
  await saveLocalesJSON(languages);
  await saveCompletedLocalesJSON(languages);
}

importPontoonLocales().catch(e => console.error(e));
