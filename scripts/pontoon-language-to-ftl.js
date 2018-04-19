const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function pontoonLanguagesToFTL() {
  const { data } = await fetch('https://pontoon.mozilla.org/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
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
    }),
  }).then(res => res.json());
  return data.project.localizations
    .map(({ locale }) => `${locale.code} = ${locale.name}`)
    .concat('en = English')
    .join('\n');
}

async function savePontoonLanguagesToMessages() {
  const languages = await pontoonLanguagesToFTL();
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
    ['#[Languages]', '## Languages', languages, '#[/]'].join('\n')
  );
  fs.writeFileSync(messagesPath, newMessages);
}

savePontoonLanguagesToMessages().catch(e => console.error(e));
