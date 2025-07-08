# Changelog

## Current release

### v1.147.0 (2025-07-07)

- Feat: Text input cleaning (handles CR/LF/TAB characters in free input fields) by [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4850](https://github.com/common-voice/common-voice/pull/4850)
- Feat: Add cv-corpus-22-0 and cv-corpus-22-0-delta datasets and stats by [@moz-dfeller](https://github.com/moz-dfeller) in [#4953](https://github.com/common-voice/common-voice/pull/4953)
- Feat: Backend to retrieve sentences & clips without variant when variant ones run out by [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4931](https://github.com/common-voice/common-voice/pull/4931)
- Feat: Update menu - change Spontaneous Speech "coming-soon" by [@moz-rotimib](https://github.com/moz-rotimib) in [#4894](https://github.com/common-voice/common-voice/pull/4894)
- Fix: Handle cases where client_id is not defined due to session timeouts by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#4920](https://github.com/common-voice/common-voice/issues/4920)
- Fix: Revise wording in goals page which errors out on some languages due to Fluent complexity by [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4811](https://github.com/common-voice/common-voice/pull/4811) Fixes: [#3907](https://github.com/common-voice/common-voice/issues/3907)
- Fix: Change accents separator to "|" from default "," which prevents parsing of accents from metadata by [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4844](https://github.com/common-voice/common-voice/pull/4844)
- Fix: Use Redis to keep recorded "sentence_id"s per user which fixes many "clip could not be saved to server" errors by [@moz-bozden](https://github.com/moz-bozden) in [#4944](https://github.com/common-voice/common-voice/pull/4944)
- Fix: Fix setuptools version which prevents the bundler to start by [@moz-bozden](https://github.com/moz-bozden) in [#4935](https://github.com/common-voice/common-voice/pull/4935)
- Fix: Menu items still showing `<small>` tags by [@moz-rotimib](https://github.com/moz-rotimib) in [#4933](https://github.com/common-voice/common-voice/pull/4933)
- Fix: Revert to `en` for download if UI language does not have a dataset by [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4846](https://github.com/common-voice/common-voice/pull/4846) Fixes: [#4819](https://github.com/common-voice/common-voice/issues/4819)
- Fix: Fix ambuiquity in SQL which prevents proper variant selection by [@moz-bozden](https://github.com/moz-bozden) in [#4888](https://github.com/common-voice/common-voice/pull/4888)
- Chore: Update text and link in Action Items section in home page by [@moz-rotimib](https://github.com/moz-rotimib) in [#4898](https://github.com/common-voice/common-voice/pull/4898)
- Chore: Updates to [COMMUNITIES.md](https://github.com/common-voice/common-voice/blob/main/docs/COMMUNITIES.md)
- Chore: Updates to [DEVELOPMENT.md](https://github.com/common-voice/common-voice/blob/main/docs/DEVELOPMENT.md)

#### Data Changes

- Retire Catalan toponym corpus by [@moz-bozden](https://github.com/moz-bozden) in [#4559](https://github.com/common-voice/common-voice/pull/4959)
- Fix accent typo for `eu` locale by [@moz-bozden](https://github.com/moz-bozden) in [#4922](https://github.com/common-voice/common-voice/pull/4922)
- Add variants for Alsatian `gsw` by [@ftyers](https://github.com/ftyers) in [#4921](https://github.com/common-voice/common-voice/pull/4921)
- Add tvu variants by [@moz-bozden](https://github.com/moz-bozden) in [#4901](https://github.com/common-voice/common-voice/pull/4901)
- Move existing tvu data to tvu-ndikini variant by [@moz-bozden](https://github.com/moz-bozden) in [#4902](https://github.com/common-voice/common-voice/pull/4902)
- Add ug-Cyrl and ug-Arab variants by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#4889](https://github.com/common-voice/common-voice/pull/4889)
- Move existing ug data to ug-Arab variant by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#4891](https://github.com/common-voice/common-voice/pull/4891)

## Next release

### v1.x.x (TBA)

## Past releases

### [v1.141.3 (2025-04-29)](https://github.com/common-voice/common-voice/releases/tag/release-v1.141.3)

Changelog starts here. For past releases please visit [Releases Page](https://github.com/common-voice/common-voice/releases).
