# Changelog

## Current release

### [v1.151.0 (2025-08-26)](https://github.com/common-voice/common-voice/releases/tag/release-v1.151.0)

- Feat: Remove sentences with taxonomy from circulation, by [@moz-dfeller](https://github.com/moz-dfeller) in [#5048](https://github.com/common-voice/common-voice/pull/5048)
- Feat: Added accent-variant migration code (as part of Irish (`ga-IE`) migrations below), by [@moz-bozden](https://github.com/moz-bozden) in [#5015](https://github.com/common-voice/common-voice/pull/5015), many thanks to [@moz-kathyreid](https://github.com/moz-kathyreid) for extensive testing.
- Workaround: In profile add new language, language code was displayed for some languages, and we implemented the same workaround in [#5042](https://github.com/common-voice/common-voice/pull/5042), by [@moz-bozden](https://github.com/moz-bozden) in [#5051](https://github.com/common-voice/common-voice/pull/5051)
- Fix: In speak (and possibly listen) page, incorrect check of sentences loaded state causing errors, by [@moz-bozden](https://github.com/moz-bozden) in [#5054](https://github.com/common-voice/common-voice/pull/5054)
- Fix: In dashboard, an early conditional return was causing rule-of-hooks violation for many users, by [@moz-bozden](https://github.com/moz-bozden) in [#5054](https://github.com/common-voice/common-voice/pull/5054)
- Fix: In profile page empty value in age field was causing errors, by [@moz-bozden](https://github.com/moz-bozden) in [#5053](https://github.com/common-voice/common-voice/pull/5053)
- Fix: Nested translation in profile page API tab, by [@moz-bozden](https://github.com/moz-bozden) in [#5050](https://github.com/common-voice/common-voice/pull/5050)

#### Data Changes in v1.151.0

- Migrate Catalan (`ca`) accents to new variants, by [@moz-bozden](https://github.com/moz-bozden) in [#5033](https://github.com/common-voice/common-voice/pull/5033)
- Add new Irish (`ga-IE`) accents, by [@moz-bozden](https://github.com/moz-bozden) in [#5022](https://github.com/common-voice/common-voice/pull/5022)
- Migrate Irish (`ga-IE`) accents to new variants (with migration-helper code above), by [@moz-bozden](https://github.com/moz-bozden) in [#5015](https://github.com/common-voice/common-voice/pull/5015)
- Add Dloluo (`luo`) variants by [@ftyers](https://github.com/ftyers) in [#4569](https://github.com/common-voice/common-voice/pull/4969).

#### Spontaneous Speech v1.151.0

- Feat: Mark valid/invalid users in users table to process further in CV-SS merge, by [@moz-bozden](https://github.com/moz-bozden) in [#478](https://github.com/common-voice/spontaneous-speech/pull/478)
- Fix: Missing await in removeSSQuestions in migration-helpers (for migrate:down), by [@moz-bozden](https://github.com/moz-bozden) in [#482](https://github.com/common-voice/spontaneous-speech/pull/482)

##### SS Data Changes in v1.151.0

- Fix: Update language names in locales table to match CV and Pontoon, by [@moz-bozden](https://github.com/moz-bozden) in [#484](https://github.com/common-voice/spontaneous-speech/pull/484)
- Add Western Sierra Puebla Nahuatl (`nhi`) questions by [@bandrandr](https://github.com/bandrandr) in [#483](https://github.com/common-voice/spontaneous-speech/pull/483)
- Add Shona (`sn`) prompts by [@bandrandr](https://github.com/bandrandr) in [#481](https://github.com/common-voice/spontaneous-speech/pull/481)

---

### Changes merged after current release

#### Data Changes after current release

#### Spontaneous Speech after current release

##### SS Data Changes after current release

---

## Past releases

### [v1.150.0 (2025-08-21)](https://github.com/common-voice/common-voice/releases/tag/release-v1.150.0)

- Feat: Make use of local-storage to pass UI language to Spontaneous Speech, and make the menu links relative to installation, by [@moz-bozden](https://github.com/moz-bozden) in [#5043](https://github.com/common-voice/common-voice/pull/5043)
- Workaround: Fix picker not showing native language names but language codes, now they will be shown in the selected locale's translation if exists - else English name will be shown (along with language code), by [@moz-bozden](https://github.com/moz-bozden) in [#5042](https://github.com/common-voice/common-voice/pull/5042)
- Fix: Guidelines page were missing unique react keys and make CS feature flags sticky, by [@moz-bozden](https://github.com/moz-bozden) in [#5046](https://github.com/common-voice/common-voice/pull/5046)
- Fix: Fix render timing issues in LanguageRoutes with useEffect and setTimeout, by [@moz-bozden](https://github.com/moz-bozden) in [#5041](https://github.com/common-voice/common-voice/pull/5041)
- Fix: In the language picker apply bold only to selected user language, by [@moz-bozden](https://github.com/moz-bozden) in [#5040](https://github.com/common-voice/common-voice/pull/5040)
- Fix: HTML nesting problem in About page, by [@moz-bozden](https://github.com/moz-bozden) in [#5039](https://github.com/common-voice/common-voice/pull/5039)
- Fix: Some fixes to localizations and handling of empty value in select, by [@moz-bozden](https://github.com/moz-bozden) in [#5038](https://github.com/common-voice/common-voice/pull/5038)
- Fix: For multiple issues on Dashboard page and attached tabs, by [@moz-bozden](https://github.com/moz-bozden) in [#5037](https://github.com/common-voice/common-voice/pull/5037)

#### Data Changes in v1.150.0

- Fix: Add migration to remove defunct and empty `hi-IN` locale with remnants as it should be a variant under Hindi `hi`, by [@moz-bozden](https://github.com/moz-bozden) in [#5014](https://github.com/common-voice/common-voice/pull/5014)
- Fix: Add migration to remove defunct and empty Western Armenian `hyw` locale with remnants as it should be a variant under Armenian, by [@moz-bozden](https://github.com/moz-bozden) in [#5013](https://github.com/common-voice/common-voice/pull/5013)

#### Spontaneous Speech v1.150.0

- Feat: Make use of local-storage to pass UI language to Common Voice, and make the menu links relative to installation, by [@moz-bozden](https://github.com/moz-bozden) in [#477](https://github.com/common-voice/spontaneous-speech/pull/477)
- Fix: Nested/double localization for "other" in Report modal preventing localization, by [@moz-bozden](https://github.com/moz-bozden) in [#476](https://github.com/common-voice/spontaneous-speech/pull/476)
- Fix: The guidelines links to point to new guidelines, replace link/text with Guidelines button, and fix layout issues, by [@moz-bozden](https://github.com/moz-bozden) in [#475](https://github.com/common-voice/spontaneous-speech/pull/475)

##### SS Data Changes in v1.150.0

- Add Spanish (`es`), Russian (`ru`), and Sena (`seh`) questions by [@bandrandr](https://github.com/bandrandr) in [#479](https://github.com/common-voice/spontaneous-speech/pull/479)

---

### [v1.149.0 (2025-08-12)](https://github.com/common-voice/common-voice/releases/tag/release-v1.149.0)

- Feat: Redesign of guidelines and addition of Pontoon keys, by [@moz-rotimib](https://github.com/moz-rotimib) in [#4952](https://github.com/common-voice/common-voice/pull/4952)
- Feat (in v1.148.3): Add two legal consent checkboxes to API Credentials and re-enable the tab, by [@moz-rotimib](https://github.com/moz-rotimib) in [#5001](https://github.com/common-voice/common-voice/pull/5001)
- Feat (in v1.148.1): Update profile page to add API Credentials (temporarily disabled) by [@moz-rotimib](https://github.com/moz-rotimib) in [#4961](https://github.com/common-voice/common-voice/pull/4961)
- Fix: Several issues in new guidelines, by [@moz-bozden](https://github.com/moz-bozden) in [#5034](https://github.com/common-voice/common-voice/pull/5034)
- Fix: Multiple issues in Downloads/Other Voice Datasets section (dataset size missing, male/female keys for old datasets missing, temporarily disable voxforge download link), by [@moz-bozden](https://github.com/moz-bozden) in [#5035](https://github.com/common-voice/common-voice/pull/5035)
- Fix: Overflow in long accent lists and adapt style to variant selector [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4849](https://github.com/common-voice/common-voice/pull/4849) fixes [#4378](https://github.com/common-voice/common-voice/issues/4378)
- Minor fix: Add left-aligned class to contact us button which was causing visual problems in some languages by [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4868](https://github.com/common-voice/common-voice/pull/4868) fixes [#4867](https://github.com/common-voice/common-voice/issues/4867)
- Minor fix: Add missing Bengali `bn` sub-Discourse list by [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4852](https://github.com/common-voice/common-voice/pull/4852)
- Minor fix (in v1.148.2): Adjust cache duration of variant-only clips, which was causing lock-release issues in RedLock by [@moz-bozden](https://github.com/moz-bozden) in [#4995](https://github.com/common-voice/common-voice/pull/4995)
- Minor fix (in v1.148.2): Adjust cache and lock duration of LeaderBoard statistics, which was causing lock-release issues in RedLock by [@moz-bozden](https://github.com/moz-bozden) in [#4994](https://github.com/common-voice/common-voice/pull/4994)
- Chore (in v1.148.2): Delete unused/remnant files from the repository by [@moz-bozden](https://github.com/moz-bozden) in [#4996](https://github.com/common-voice/common-voice/pull/4996)

#### Data Changes in v1.149.0

- (in v 1.148.4) Add Irish `ga-IE` variants by [@moz-bozden](https://github.com/moz-bozden) in [#5003](https://github.com/common-voice/common-voice/pull/5003)

#### Spontaneous Speech v1.149.0

- Feat (in v1.148.3): Remove age-gender form from code base because after the public release we are collecting that data in MCV profiles, which might also interfare with merging the two systems if they don't match, by [@moz-bozden](https://github.com/moz-bozden) in [#470](https://github.com/common-voice/spontaneous-speech/pull/470)
- Feat (in v1.148.3): Remove beta-batches visually and extend the component to show any string on a page if needed, by [@moz-bozden](https://github.com/moz-bozden) in [#469](https://github.com/common-voice/spontaneous-speech/pull/469)
- Feat (in v1.148.2): Implement a replica of user avatar and username on the menu line to replace current behavior which shows the user email, as a first step to merge both webapps visually. By [@moz-bozden](https://github.com/moz-bozden) in [#460](https://github.com/common-voice/spontaneous-speech/pull/460) and CSS fix in [#468](https://github.com/common-voice/spontaneous-speech/pull/468)
- Fix: Programmatically remove `<small>` tags in buttons which appear for languages who do not fix Pontoon strings, by [@moz-bozden](https://github.com/moz-bozden) in [#474](https://github.com/common-voice/spontaneous-speech/pull/474), reported in [#5012](https://github.com/common-voice/common-voice/issues/5012)
- Fix: Add migration to fix Manx language code (`glv` => `gv`) which was preventing connection to Pontoon and CV, by [@moz-bozden](https://github.com/moz-bozden) in [#471](https://github.com/common-voice/spontaneous-speech/pull/471)

##### SS Data Changes in v1.149.0

- (in v1.148.4) Add 104 Irish (`ga-IE`) questions by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#473](https://github.com/common-voice/spontaneous-speech/pull/473)
- (in v1.148.4) Add 71 Frisian (`fy-NL`) questions by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#472](https://github.com/common-voice/spontaneous-speech/pull/472)
- (in v1.148.2) Add Bashkir (`bak`) questions by [@moz-kathyreid](https://github.com/moz-kathyreid) in [#464](https://github.com/common-voice/spontaneous-speech/pull/464)
- (in v1.148.2) Add German (`de`) questions by [@bandrandr](https://github.com/bandrandr) in [#462](https://github.com/common-voice/spontaneous-speech/pull/462)
- (in v1.148.2) Add Basaa (`bas`) questions by [@bandrandr](https://github.com/bandrandr) in [#461](https://github.com/common-voice/spontaneous-speech/pull/461)

---

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

- (in v1.147.1) Lowered sentence requirement bands of 43 locales (mostly new ones defaulting to 5000) by [@moz-bozden](https://github.com/moz-bozden) in [#4569](https://github.com/common-voice/common-voice/pull/4969) thank you [@ftyers](https://github.com/ftyers) for his review, and community members flagging the issue.

#### Spontaneous Speech v1.148.0

- Fix: Version parameter missing in Dockerfile by [@moz-dfeller](https://github.com/moz-dfeller) in commits [1](https://github.com/common-voice/spontaneous-speech/commit/6acc11073c578d89bfef438f2c2d358491ea5b38) and [2](https://github.com/common-voice/spontaneous-speech/commit/e234da9e8f9ed553b698b084247bc69245d15e50)
- Fix: Relax validation pipeline rules, where non-ASCII characters entered through Questions page were rejected. This also increases default max length of questions to 200. By [@moz-bozden](https://github.com/moz-bozden) in [#459](https://github.com/common-voice/spontaneous-speech/pull/459), fixes [#4984](https://github.com/common-voice/common-voice/issues/4984) and [#4927](https://github.com/common-voice/common-voice/issues/4927)
- Minor Fix: Guidelines links in 3 places were broken by [@moz-bozden](https://github.com/moz-bozden) in [#458](https://github.com/common-voice/spontaneous-speech/pull/458), fixes first issue in [#4940](https://github.com/common-voice/common-voice/issues/4940)
- Minor Fix: Make guidelines link on expandable component recognizable by [@moz-bozden](https://github.com/moz-bozden) in [#457](https://github.com/common-voice/spontaneous-speech/pull/457)
- Minor Fix: Pontoon key of submit button in question page was wrong by [@moz-bozden](https://github.com/moz-bozden) in [#456](https://github.com/common-voice/spontaneous-speech/pull/456)

##### SS Data Changes in v1.148.0

- Add Bodo (`brx`) prompts by [@bandrandr](https://github.com/bandrandr) in [#455](https://github.com/common-voice/spontaneous-speech/pull/455)

---

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

---

### [v1.141.3 (2025-04-29)](https://github.com/common-voice/common-voice/releases/tag/release-v1.141.3)

Changelog starts here. For past releases please visit [Releases Page](https://github.com/common-voice/common-voice/releases).
