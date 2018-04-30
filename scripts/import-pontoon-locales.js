const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');

async function fetchPontoonLanguages() {
  const { data } = await request({
    uri: 'https://pontoon.mozilla.org/graphql',
    method: 'POST',
    json: true,
    body: {
      query: `{
            project(slug: "common-voice") {
              localizations {
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
    .map(({ locale }) => [locale.code, locale.name])
    .concat([['en', 'English']])
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

async function saveToJSON(languages) {
  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'locales.json'),
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

async function importPontoonLocales() {
  const languages = await fetchPontoonLanguages();
  await saveToMessages(languages);
  await saveToJSON(languages);
}

importPontoonLocales().catch(e => console.error(e));
