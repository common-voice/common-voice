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
    .concat(['en', 'English'])
    .sort(([code1], [code2]) => code1.localeCompare(code2));
}

async function savePontoonLanguagesToMessages() {
  const languages = await fetchPontoonLanguages();
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

savePontoonLanguagesToMessages().catch(e => console.error(e));
