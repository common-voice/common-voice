import * as commonmark from 'commonmark'
import * as request from 'request-promise-native'

const CACHE_AGE = 24 * 60 * 60 * 1000 // 24 hours (in ms)
const cache: {
  [name: string]: {
    [locale: string]: { fetchedAt: number; textHTML: string }
  }
} = {}

const localeMapping: { [key: string]: string } = {
  'fy-NL': 'fy',
  'ga-IE': 'ga',
  hsb: 'de',
  'pa-IN': 'pa',
  'rm-sursilv': 'rm',
  'rm-vallader': 'rm',
  'sv-SE': 'se',
}

export default async function fetchLegalDocument(
  name: string,
  locale: string
): Promise<string> {
  if (!cache[name]) cache[name] = {}

  let { fetchedAt, textHTML } = cache[name][locale] || ({} as any)

  if (textHTML && fetchedAt > Date.now() - CACHE_AGE) {
    return textHTML
  }
  const legalLocale = localeMapping[locale] ?? locale
  const uri = `https://raw.githubusercontent.com/mozilla/legal-docs/prod/${legalLocale}/common_voice_${name}.md`

  const [status, text] = await request({
    uri: uri,
    resolveWithFullResponse: true,
  })
    .then((response: any) => [response.statusCode, response.body])
    .catch(response => [response.statusCode, null])

  if (status >= 400 && status < 500) {
    return (
      await Promise.all(
        // Fallback Languages
        ['en', 'es', 'fr', 'zh-TW'].map(locale =>
          fetchLegalDocument(name, locale)
        )
      )
    ).join('<br>')
  } else if (status < 300) {
    textHTML = new commonmark.HtmlRenderer().render(
      new commonmark.Parser().parse(
        // There's a parseable datetime string in the legal documents, which we don't need to show
        (text as string).replace(/{:\sdatetime=".*" }/, '')
      )
    )
  }

  cache[name][locale] = { fetchedAt: Date.now(), textHTML }

  return textHTML
}
