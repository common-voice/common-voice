# Changelog

## Current release

### [v1.148.0 (2025-07-21)](https://github.com/common-voice/common-voice/releases/tag/release-v1.148.0)

- Feat: Change clip-upload process to handle remaining duplicate-clip errors. In the existing implementation, if there is a duplicate, each upload was giving a separate error, and the error message was generic. It also provided a "retry" option which resulted in the same problem. With this change, the problem will only be provided once at the end, providing only a "continue" option. By [@moz-bozden](https://github.com/moz-bozden) in [#4950](https://github.com/common-voice/common-voice/pull/4950)
- Feat: First implementation of LazySetCache class, currently not connected to application code. General purpose Redis caching of objects in current LazyCache module is too costly for simple caching of numbers and strings. By [@moz-bozden](https://github.com/moz-bozden) in [#4950](https://github.com/common-voice/common-voice/pull/4950)
- Feat: Add common-voice-network Docker network to enable communication between services (Scripted Speech, Spontaneous Speech, Public API, ...) by [@akrabat](https://github.com/akrabat) in [#4982](https://github.com/common-voice/common-voice/pull/4982)
- Feat (Public API): Create additional tests for Public API credentials by [@akrabat](https://github.com/akrabat) in [#4981](https://github.com/common-voice/common-voice/pull/4981)
- Feat (Public API): Create endpoint to create client credentials by [@moz-dfeller](https://github.com/moz-dfeller) and [@akrabat](https://github.com/akrabat) in [#4971](https://github.com/common-voice/common-voice/pull/4971)
- Workaround: Some users were having a caching related issue after the parameter passing change in [#4945](https://github.com/common-voice/common-voice/pull/4945). Implemented a workaround to handle both cases for a while by [@moz-bozden](https://github.com/moz-bozden) in [#4975](https://github.com/common-voice/common-voice/pull/4975)
- Fix: Long (3h) lock duration in LazyCache implementation was preventing more frequent updates in Redis caching. This fix adds lock-duration as a parameter, per query, with a default of 3 min if not specified. By [@moz-bozden](https://github.com/moz-bozden) in [#4949](https://github.com/common-voice/common-voice/pull/4949)
- Fix: Non existing locale in migration should not throw error but silently warn, it causes local dev env fail if that language does not exist - update to [#4559](https://github.com/common-voice/common-voice/pull/4959) by [@moz-bozden](https://github.com/moz-bozden) in [#4974](https://github.com/common-voice/common-voice/pull/4974) thank you [@akrabat](https://github.com/akrabat) for reporting and testing.
- Fix (in v1.147.1): Parameter passing with fields containing underscore through request.headers were causing problems in some external environments (e.g. nginx) by [@moz-bozden](https://github.com/moz-bozden) in [#4945](https://github.com/common-voice/common-voice/pull/4945)
- Docs: Update `.env-local-docker.example` and `DEVELOPMENT.md` to include more comments for developers, especially on the use of authentication - with error checking, by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#4980](https://github.com/common-voice/common-voice/pull/4980)
- Chore: Updates to Pontoon keys

#### Data Changes in v1.148.0

- (in v1.147.1) Lowered sentence requirement bands of 43 locales (mostly new ones defaulting to 5000) by [@moz-bozden](https://github.com/moz-bozden) in [#4569](https://github.com/common-voice/common-voice/pull/4969) thank you @ft [@ftyers](https://github.com/ftyers) for his review, and community members flagging the issue.

#### Spontaneous Speech v1.148.0

- Fix: Version parameter missing in Dockerfile by [@moz-dfeller](https://github.com/moz-dfeller) in commits [1](https://github.com/common-voice/spontaneous-speech/commit/6acc11073c578d89bfef438f2c2d358491ea5b38) and [2](https://github.com/common-voice/spontaneous-speech/commit/e234da9e8f9ed553b698b084247bc69245d15e50)
- Fix: Relax validation pipeline rules, where non-ASCII characters entered through Questions page were rejected. This also increases default max length of questions to 200. By [@moz-bozden](https://github.com/moz-bozden) in [#459](https://github.com/common-voice/spontaneous-speech/pull/459), fixes [#4984](https://github.com/common-voice/common-voice/issues/4984) and [#4927](https://github.com/common-voice/common-voice/issues/4927)
- Minor Fix: Guidelines links in 3 places were broken by [@moz-bozden](https://github.com/moz-bozden) in [#458](https://github.com/common-voice/spontaneous-speech/pull/458), fixes first issue in [#4940](https://github.com/common-voice/common-voice/issues/4940)
- Minor Fix: Make guidelines link on expandable component recognizable by [@moz-bozden](https://github.com/moz-bozden) in [#457](https://github.com/common-voice/spontaneous-speech/pull/457)
- Minor Fix: Pontoon key of submit button in question page was wrong by [@moz-bozden](https://github.com/moz-bozden) in [#456](https://github.com/common-voice/spontaneous-speech/pull/456)

##### SS Data Changes in v1.148.0

- Add Bodo (`brx`) prompts by [@bandrandr](https://github.com/bandrandr) in [#455](https://github.com/common-voice/spontaneous-speech/pull/455)

### Next release v1.149.0 (TBA)

- Feat (in v1.148.3): Add two legal consent checkboxes to API Credentials and re-enable the tab, by [@moz-rotimib](https://github.com/moz-rotimib) in [#5001](https://github.com/common-voice/common-voice/pull/5001)
- Feat (in v1.148.1): Update profile page to add API Credentials (temporarily disabled) by [@moz-rotimib](https://github.com/moz-rotimib) in [#4961](https://github.com/common-voice/common-voice/pull/4961)
- Minor fix (in v1.148.2): Adjust cache duration of variant-only clips, which was causing lock-release issues in RedLock by [@moz-bozden](https://github.com/moz-bozden) in [#4995](https://github.com/common-voice/common-voice/pull/4995)
- Minor fix (in v1.148.2): Adjust cache and lock duration of LeaderBoard statistics, which was causing lock-release issues in RedLock by [@moz-bozden](https://github.com/moz-bozden) in [#4994](https://github.com/common-voice/common-voice/pull/4994)
- Chore (in v1.148.2): Delete unused/remnant files from the repository by [@moz-bozden](https://github.com/moz-bozden) in [#4996](https://github.com/common-voice/common-voice/pull/4996)

#### Data Changes in v1.149.0 (TBA)

- (in v 1.148.4) Add Irish `ga-IE` variants by [@moz-bozden](https://github.com/moz-bozden) in [#5003](https://github.com/common-voice/common-voice/pull/5003)

#### Spontaneous Speech v1.149.0 (TBA)

- Feat (in v1.148.3): Remove age-gender form from code base because after the public release we are collecting that data in MCV profiles, which might also interfare with merging the two systems if they don't match, by [@moz-bozden](https://github.com/moz-bozden) in [#470](https://github.com/common-voice/spontaneous-speech/pull/470)
- Feat (in v1.148.3): Remove beta-batches visually and extend the component to show any string on a page if needed, by [@moz-bozden](https://github.com/moz-bozden) in [#469](https://github.com/common-voice/spontaneous-speech/pull/469)
- Feat (in v1.148.2): Implement a replica of user avatar and username on the menu line to replace current behavior which shows the user email, as a first step to merge both webapps visually. By [@moz-bozden](https://github.com/moz-bozden) in [#460](https://github.com/common-voice/spontaneous-speech/pull/460) and CSS fix in [#468](https://github.com/common-voice/spontaneous-speech/pull/468)

##### SS Data Changes in v1.149.0 (TBA)

- (in v1.148.4) Add 104 Irish (`ga-IE`) questions by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#473](https://github.com/common-voice/spontaneous-speech/pull/473)
- (in v1.148.4) Add 71 Frisian (`fy-NL`) questions by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#472](https://github.com/common-voice/spontaneous-speech/pull/472)
- (in v1.148.2) Add Bashkir (`bak`) questions by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#464](https://github.com/common-voice/spontaneous-speech/pull/464)
- (in v1.148.2) Add German (`de`) questions by [@bandrandr](https://github.com/bandrandr) in [#462](https://github.com/common-voice/spontaneous-speech/pull/462)
- (in v1.148.2) Add Basaa (`bas`) questions by [@bandrandr](https://github.com/bandrandr) in [#461](https://github.com/common-voice/spontaneous-speech/pull/461)

## Past releases

### [v1.147.0 (2025-07-08)](https://github.com/common-voice/common-voice/releases/tag/release-v1.147.0)

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

#### Data Changes in v1.147.0

- Retire Catalan (`ca`) toponym corpus by [@moz-bozden](https://github.com/moz-bozden) in [#4559](https://github.com/common-voice/common-voice/pull/4959)
- Fix accent typo for `eu` locale by [@moz-bozden](https://github.com/moz-bozden) in [#4922](https://github.com/common-voice/common-voice/pull/4922)
- Add variants for Alsatian `gsw` by [@ftyers](https://github.com/ftyers) in [#4921](https://github.com/common-voice/common-voice/pull/4921)
- Add `tvu` variants by [@moz-bozden](https://github.com/moz-bozden) in [#4901](https://github.com/common-voice/common-voice/pull/4901)
- Move existing `tvu` data to `tvu-ndikini` variant by [@moz-bozden](https://github.com/moz-bozden) in [#4902](https://github.com/common-voice/common-voice/pull/4902)
- Add `ug-Cyrl` and `ug-Arab` variants by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#4889](https://github.com/common-voice/common-voice/pull/4889)
- Move existing `ug` data to `ug-Arab` variant by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#4891](https://github.com/common-voice/common-voice/pull/4891)

#### Spontaneous Speech v1.147.0

- Feat: Add docs/CHANGELOG.md
- Feat: Add migration helper for adding SS questions by [@moz-bozden](https://github.com/moz-bozden) in [#453](https://github.com/common-voice/spontaneous-speech/pull/453)
- Fix: Remove duplicate or obsolete sentences by [@moz-dfeller](https://github.com/moz-dfeller) in [commit](https://github.com/common-voice/spontaneous-speech/commit/dda63db5a751c5e1c00fd40660d67d4627aeb1be)
- Fix: Fix redirection issue when an existing user logins [@moz-bozden](https://github.com/moz-bozden) in [#446](https://github.com/common-voice/spontaneous-speech/pull/446)
- Fix: Fix small tag in main menu [@moz-rotimib](https://github.com/moz-rotimib) in [#445](https://github.com/common-voice/spontaneous-speech/pull/445)

##### SS Data Changes in v1.147.0

- Fix: Two Georgian questions by [@moz-bozden](https://github.com/moz-bozden) in [#452](https://github.com/common-voice/spontaneous-speech/pull/452)
- Add Mara (`mrh`) questions by [@bandrandr](https://github.com/bandrandr) in [#450](https://github.com/common-voice/spontaneous-speech/pull/450)
- Add Galician (`gl`) questions by [@bandrandr](https://github.com/bandrandr) in [#449](https://github.com/common-voice/spontaneous-speech/pull/449)

### [v1.141.3 (2025-04-29)](https://github.com/common-voice/common-voice/releases/tag/release-v1.141.3)

Changelog starts here. For past releases please visit [Releases Page](https://github.com/common-voice/common-voice/releases).
