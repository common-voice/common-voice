# Sentences on Common Voice

As Common Voice is a read dataset, sentences are our currency. You can help by adding new sentences to our dataset for other contributors to read, helping with bulk sentence extractions, or reporting problematic sentences.

## In a few words

📝 [Sentence Collector](https://commonvoice.mozilla.org/write) is the sentence writing part of the Common Voice website. For others to be able to record their voices the Common Voice project needs sentences to be read. This is a good place to start for newcomers to this project.

📘 Contributors who want to [bulk upload](https://en.wikipedia.org/wiki/Bulk_insert) sentences, like for books, should check out the [Bulk Submission](https://github.com/common-voice/common-voice/blob/main/docs/submitting-bulk-sentences.md) guidelines.

🖥️ For automatic extraction of data sources, the [Sentence Extractor](https://github.com/Common-Voice/cv-sentence-extractor) is dedicated for extracting from sources such as Wikipedia, Wikisource or raw files.

## Sentence Collector

The [Sentence Collector](https://commonvoice.mozilla.org/write) is the "write" section of Common Voice. You can either:

- Add sentences for your language
- Validate sentences that other contributors have added

Each sentence requires at least two upvotes from human validation to be considered valid.

## Automatic extraction

The [Sentence Extractor](https://github.com/Common-Voice/cv-sentence-extractor) is a tool that can scrape public domain data sources for sentences. There are multiple sources integrated into the Sentence Extractor, such as Wikipedia and Wikisource. Please [see this post](https://discourse.mozilla.org/t/sentence-extractor-current-status-and-workflow-summary/62332) for detailed guidance on how to use the Sentence Extractor.

## Correcting existing data

Some sentence sources never went through the same automated cleanup, validation, or language rules as Sentence Collector. Older bulk imports can also contain empty strings, encoding corruption, copyright-restricted text, or other unsuitable material. When that happens, production data is corrected with a **database migration** (or by filing an issue for maintainers to write one).

### What qualifies for correction

Typical reasons to retire or remove sentences:

| Situation | Usual action |
| --------- | ------------ |
| Encoding / mojibake, empty text, broken characters | Disable (`is_used = FALSE`) or delete the rows |
| Copyrighted or non-public-domain source material | Delete or disable the affected sentences (and related clips when required) |
| Offensive, private, or clearly wrong-language text | Disable so they are not offered for new recordings |
| Bulk list of known-bad sentence IDs | Disable in batches via migration (preferred for large sets) |
| Language rules / validation criteria changed | Disable sentences that no longer meet the rules |

**Prefer disabling over hard-deleting** when clips may already exist: set `sentences.is_used = FALSE` so the text is no longer selected for new recordings, while historical data stays consistent. Hard `DELETE` is appropriate when the row must not remain at all (for example unsuitable source attribution) and you understand foreign-key / clip impact.

### When data cannot simply be removed

- **Released datasets** already downloaded by the public are immutable snapshots. A migration fixes *future* collection and *future* exports; it does not rewrite past dataset tarballs.
- **Clips already recorded** against a sentence may still exist. Disabling a sentence stops new recordings; removing clips or user data is a separate, carefully reviewed change.
- **Uncertain legal or community questions** should be an issue first, not a drive-by migration. Maintainers may need locale community input.
- Migrations run against production MySQL with real load: oversized unlocked updates can stall the site. Large ID lists must be batched (see below).

### How to flag material and request a fix

1. **Small / unclear cases** — open a GitHub issue in [common-voice/common-voice](https://github.com/common-voice/common-voice/issues) with locale, example sentence text or IDs, source if known, and why it should be retired.
2. **Clear, bulk, mechanical fixes** — open a Pull Request that adds a migration under [`server/src/lib/model/db/migrations`](https://github.com/common-voice/common-voice/tree/main/server/src/lib/model/db/migrations), or open an issue and ask maintainers to land the migration.
3. **Reporting while using the site** — use in-product report flows where available; persistent catalog problems still need a migration or maintainer action.

### Writing a sentence-correction migration

Migrations are TypeScript files in `server/src/lib/model/db/migrations`. The filename starts with a UTC timestamp so they apply in order, for example:

`YYYYMMDDHHMMSS-short-description.ts`

Each file exports `up` (and usually `down`) functions that receive the DB helper and run SQL.

**Disable by sentence ID (batch template)** — pattern used in production for large retirements:

```ts
// Template: retire sentences by id without deleting rows
const SENTENCE_ID_LIST = [
  'abc123...', // sentence id hashes
]

const BATCH_SIZE = 200

export const up = async function (db: any): Promise<any> {
  while (true) {
    const subset = SENTENCE_ID_LIST.splice(0, BATCH_SIZE)
    if (subset.length === 0) break
    await db.runSql(
      `
      UPDATE sentences
      SET is_used = FALSE
      WHERE is_used = TRUE
        AND id IN (?)
      `,
      [subset]
    )
  }
  return true
}

export const down = (): null => {
  // Usually null: we do not automatically re-enable bad sentences
  return null
}
```

See for example [`20251126220000-disable-problematic-catalan-sentences.ts`](https://github.com/common-voice/common-voice/blob/main/server/src/lib/model/db/migrations/20251126220000-disable-problematic-catalan-sentences.ts).

**Disable by filter (locale / source / pattern)**:

```ts
export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    UPDATE sentences SET is_used = FALSE
    WHERE locale_id = (SELECT id FROM locales WHERE name = 'lv')
      AND text = ''
  `)
}

export const down = async function (): Promise<any> {
  return null
}
```

See [`20230815103600-hide-problematic-sentences.ts`](https://github.com/common-voice/common-voice/blob/main/server/src/lib/model/db/migrations/20230815103600-hide-problematic-sentences.ts).

**Hard delete** (use only when appropriate):

```ts
export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    DELETE FROM sentences
    WHERE source = 'example-bad-source'
      AND locale_id = (SELECT id FROM locales WHERE name = 'he')
  `)
}

export const down = async function (): Promise<any> {
  return null
}
```

See [`20230718102700-delete-unsuitable-hebrew-sentences.ts`](https://github.com/common-voice/common-voice/blob/main/server/src/lib/model/db/migrations/20230718102700-delete-unsuitable-hebrew-sentences.ts).

### Migration checklist

- Use a new unique timestamp prefix; do not edit old migrations that may already have run in an environment.
- Prefer `UPDATE … SET is_used = FALSE` with tight `WHERE` clauses; batch large ID lists.
- Scope by `locale_id` / `source` / `id` so you cannot disable the entire table by mistake.
- Test the SQL against a local or staging database when possible (`docs/DEVELOPMENT.md`).
- Explain *why* in the PR description and link any related issue.
- Set `down` to `null` when re-enabling would restore harmful content; say so in the PR.

You do not need deep knowledge of every CV table to propose a fix: a precise list of sentence IDs or a narrow, reviewed `WHERE` clause plus a clear rationale is enough for maintainers to help land the change.
