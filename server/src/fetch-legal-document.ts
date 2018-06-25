import * as commonmark from 'commonmark';
import * as request from 'request-promise-native';

const CACHE_AGE = 1000 * 60 * 60 * 24;
const cache: {
  [name: string]: {
    [locale: string]: { fetchedAt: number; textHTML: string };
  };
} = {};

export default async function fetchLegalDocument(
  name: string,
  locale: string
): Promise<string> {
  if (!cache[name]) cache[name] = {};

  let { fetchedAt, textHTML } = cache[name][locale] || ({} as any);

  if (textHTML && fetchedAt > Date.now() - CACHE_AGE) {
    return textHTML;
  }

  const [status, text] = await request({
    uri: `https://raw.githubusercontent.com/mozilla/legal-docs/master/Common_Voice_${name}/${locale}.md`,
    resolveWithFullResponse: true,
  })
    .then((response: any) => [response.statusCode, response.body])
    .catch(response => [response.statusCode, null]);

  if (status >= 400 && status < 500) {
    return (await Promise.all(
      // Fallback Languages
      ['en', 'es-CL', 'fr', 'pt-BR', 'zh-TW'].map(locale =>
        fetchLegalDocument(name, locale)
      )
    )).join('<br>');
  } else if (status < 300) {
    textHTML = new commonmark.HtmlRenderer().render(
      new commonmark.Parser().parse(
        // There's a parseable datetime string in the legal documents, which we don't need to show
        (text as string).replace(/{:\sdatetime=".*" }/, '')
      )
    );
  }

  cache[name][locale] = { fetchedAt: Date.now(), textHTML };

  return textHTML;
}
