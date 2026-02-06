# Changelog

## Current release

### [v1.157.0 (2025-02-06)](https://github.com/common-voice/common-voice/releases/tag/release-v1.157.0)

- Chore: Rework audio corruption error handling, codes, attempt to issues with Apple devices, disable KB shortcuts in contribution pages while typing, adjust cache durations, optimize queries for major languages, by [@moz-bozden](https://github.com/moz-bozden) in [#5279](https://github.com/common-voice/common-voice/pull/5279)
- Feat: Add migration helpers and unit tests for user-accents to predefined-accents and variants, by [@moz-bozden](https://github.com/moz-bozden) in [#5257](https://github.com/common-voice/common-voice/pull/5257) (in v.1.156.2)
- Feat: Complete review of the Audio pipeline to handle multiple issues (iOS devices, corrupted audio handling caused by communication errors and related UX issues causing false positives, a line of FE issues caused by race conditions, ...) , by [@moz-bozden](https://github.com/moz-bozden) in [#5223](https://github.com/common-voice/common-voice/pull/5223) (in v.1.156.2)
- Feat: Make use of Redis for prefetch registry to coordinate multiple instances, by [@moz-bozden](https://github.com/moz-bozden) in [#5235](https://github.com/common-voice/common-voice/pull/5235) (in v.1.156.1)
- Refactor: Clip upload pipeline to add rate-limiting, prevent saving of corrupt audio to storage, better dedeup through LazySetCache, fix edge cases, by [@moz-bozden](https://github.com/moz-bozden) in [#5275](https://github.com/common-voice/common-voice/pull/5275) (in v.1.156.4)
- Fix: Apple device buffer handling related bugs/codec specs we introduced in v1.156.2, by [@moz-bozden](https://github.com/moz-bozden) in [#5270](https://github.com/common-voice/common-voice/pull/5270) (in v.1.156.4)
- Fix: Many Listen page related issues (state management, missing data due to network errors, silence not-needed duplicate report/vote errors), by [@moz-bozden](https://github.com/moz-bozden) in [#5273](https://github.com/common-voice/common-voice/pull/5273) (in v.1.156.4)
- Fix: Add guards against changing user data in accent-variant migration helpers (caused ro AAC migration to fail), add more mappings for generic Romanian accents, by [@moz-bozden](https://github.com/moz-bozden) in [#5271](https://github.com/common-voice/common-voice/pull/5271) (in v.1.156.3), [#5272](https://github.com/common-voice/common-voice/pull/5272) (in v.1.156.4)
- Fix: Multiple fixes (BE: duplicated message in error, unicode missing in regex, extend caching to minimize duplicate clip errors, add guards to Speak page when audio is missing), by [@moz-bozden](https://github.com/moz-bozden) in [#5269](https://github.com/common-voice/common-voice/pull/5269) (in v.1.156.3)
- Fix: Update dockerfile to use modern corepack because GPG keys for yarn expired, by [@moz-bozden](https://github.com/moz-bozden) in [#5268](https://github.com/common-voice/common-voice/pull/5268) (in v.1.156.3)
- Fix: Language name parsing in Pontoon API data, where the language name includes Unicode apostrophes, by [@moz-bozden](https://github.com/moz-bozden) in [#5259](https://github.com/common-voice/common-voice/pull/5259) (in v.1.156.2)
- Fix: Invalid warning shown after all voted (fixes [#4290](https://github.com/common-voice/common-voice/issues/4290)), by [@moz-bozden](https://github.com/moz-bozden) in [#5238](https://github.com/common-voice/common-voice/pull/5238) (in v.1.156.2)
- Fix: KB shortcurt issues, also for international keyboards (fixes [#3746](https://github.com/common-voice/common-voice/issues/3746)), by [@moz-bozden](https://github.com/moz-bozden) in [#5238](https://github.com/common-voice/common-voice/pull/5238) (in v.1.156.2)
- Fix: Respect reduced motion request for wave animation (fixes [#3050](https://github.com/common-voice/common-voice/issues/3050)), by [@moz-bozden](https://github.com/moz-bozden) in [#5238](https://github.com/common-voice/common-voice/pull/5238) (in v.1.156.2)
- Fix: Multiple issues in Speak page (state management, Enter key and event handling), by [@moz-bozden](https://github.com/moz-bozden) in [#5236](https://github.com/common-voice/common-voice/pull/5236) (in v.1.156.2)
- Fix: New user login loop from SS - when a new user creates an account while being redirected to do so it was causing a loop, by [@moz-bozden](https://github.com/moz-bozden) in [#5234](https://github.com/common-voice/common-voice/pull/5234) (in v.1.156.2)
- Fix: Minor fix for header not hiding username in small screens, by [@moz-bozden](https://github.com/moz-bozden) in [#5233](https://github.com/common-voice/common-voice/pull/5233) (in v.1.156.1)
- Fix: Add migration to fix two missing predefined Romanian accents because they were defined by users, by [@moz-bozden](https://github.com/moz-bozden) in [#5232](https://github.com/common-voice/common-voice/pull/5232) (in v.1.156.1)
- Chore: Minor Redis cache timing changes by [@moz-bozden](https://github.com/moz-bozden) (in v.1.156.2)

#### Data Changes in v1.157.0

- Welcome to new languages: Khakas (`kjh`), Ngambay (`sba`), and Tedaga (`tuq`)
- Add Qashqai (`qxq`) variants by [@bandrandr](https://github.com/bandrandr) in [#5274](https://github.com/common-voice/common-voice/pull/5274) (in v.1.156.4)
- Add Javanese (`jv`) variants by [@bandrandr](https://github.com/bandrandr) in [#5264](https://github.com/common-voice/common-voice/pull/5264) (in v.1.156.2)
- Add Malay (`ms`) variants by [@moz-bozden](https://github.com/moz-bozden) in [#5258](https://github.com/common-voice/common-voice/pull/5258) (in v.1.156.2)
- Add Lari/Achomi (`lrl`) variants by [@bandrandr](https://github.com/bandrandr) in [#5219](https://github.com/common-voice/common-voice/pull/5219) (in v.1.156.2)
- Add migration to map Romanian (`ro`) user-defined accents to predefined accents and variants, by [@moz-bozden](https://github.com/moz-bozden) in [#5257](https://github.com/common-voice/common-voice/pull/5257) (in v.1.156.2)
- Welcome new starting language Chechen (`ce`) (in v.1.156.2)
- Chore: Update sentence bands for 4 languages and drop default sentence requirement to 2000 by [@moz-bozden](https://github.com/moz-bozden) (in v.1.156.2)

#### Spontaneous Speech v1.157.0

- Feat: Add min/max duration to recordings (3s-10min) to prevent too short or too long recordings, add bg color to Listen button when playing, change server audio processing order to first check the audio before saving to storage, enhance error checking and logging, by [@moz-bozden](https://github.com/moz-bozden) in [#509](https://github.com/common-voice/spontaneous-speech/pull/509)
- Fix: Some Apple devices' browsers in Desktop mode were not properly detected, resulting in wrong codec selection which causes "too silent" issue in Answer page or user cannot hear own recordings, by [@moz-bozden](https://github.com/moz-bozden) in [#502](https://github.com/common-voice/spontaneous-speech/pull/502) (in v1.156.2)

##### SS Data Changes in v1.157.0

- Add Sundanese (`su`) questions by [@bandrandr](https://github.com/bandrandr) in [#510](https://github.com/common-voice/spontaneous-speech/pull/510)
- Add Sinhala (`si`) questions by [@bandrandr](https://github.com/bandrandr) in [#508](https://github.com/common-voice/spontaneous-speech/pull/508) (in v1.156.4)
- Add Tedaga (`tuq`) questions by [@bandrandr](https://github.com/bandrandr) in [#507](https://github.com/common-voice/spontaneous-speech/pull/507) (in v1.156.4)
- Add Rakhine (`rki`) questions by [@bandrandr](https://github.com/bandrandr) in [#506](https://github.com/common-voice/spontaneous-speech/pull/506) (in v1.156.4)
- Add Hungarian (`hu`) questions by [@bandrandr](https://github.com/bandrandr) in [#505](https://github.com/common-voice/spontaneous-speech/pull/505) (in v1.156.2)
- Add Esperanto (`eo`) questions by [@bandrandr](https://github.com/bandrandr) in [#504](https://github.com/common-voice/spontaneous-speech/pull/504) (in v1.156.2)
- Add Dutch (`nl`) questions by [@bandrandr](https://github.com/bandrandr) in [#503](https://github.com/common-voice/spontaneous-speech/pull/503) (in v1.156.2)

---

### Changes merged after current release

#### Data Changes after current release

#### Spontaneous Speech after current release

##### SS Data Changes after current release

---

## Past releases

### [v1.156.0 (2025-12-30)](https://github.com/common-voice/common-voice/releases/tag/release-v1.156.0)

We thank [@MariaMitrofan](https://github.com/MariaMitrofan) for contributing to this release.

- Feat: Rework and optimize caching & pre-fetch to handle Redis connection problems, by [@moz-bozden](https://github.com/moz-bozden) in [#5221](https://github.com/common-voice/common-voice/pull/5221)
- Feat: Upgrade languagedata endpoint with optional single locale data, by [@moz-bozden](https://github.com/moz-bozden) in [#5197](https://github.com/common-voice/common-voice/pull/5197) (in v1.155.5)
- Feat: Gate bulk sentence uploads by putting it behind feature flag, by [@moz-bozden](https://github.com/moz-bozden) in [#5196](https://github.com/common-voice/common-voice/pull/5196) (in v1.155.5)
- Feat: Refactor API and add require-user-middleware, by [@moz-bozden](https://github.com/moz-bozden) in [#5180](https://github.com/common-voice/common-voice/pull/5180) (in v1.155.1)
- Feat: Introduce fuzzy search and apply in CV language selector, by [@moz-bozden](https://github.com/moz-bozden) in [#5176](https://github.com/common-voice/common-voice/pull/5176) (in v1.155.1)
- Feat: Implement pre-fetch in lazy cache and apply to leader-board queries and statistics, by [@moz-bozden](https://github.com/moz-bozden) in [#5175](https://github.com/common-voice/common-voice/pull/5175), [#5185](https://github.com/common-voice/common-voice/pull/5185) (v1.155.1), [#5187](https://github.com/common-voice/common-voice/pull/5187) (v1.155.3), [#5194](https://github.com/common-voice/common-voice/pull/5194), [#5190](https://github.com/common-voice/common-voice/pull/5190) (v1.155.5)
- Fix: Remove single recording/sentence limitations from `en`, `es`, and `kab` locales, by [@moz-bozden](https://github.com/moz-bozden) in [#5188](https://github.com/common-voice/common-voice/pull/5188) (in v1.155.3)
- Fix: Move two endpoints to unprotected, by [@moz-bozden](https://github.com/moz-bozden) in [#5186](https://github.com/common-voice/common-voice/pull/5186) (in v1.155.2)
- Fix: Multiple fixes and optimizations, by [@moz-bozden](https://github.com/moz-bozden) in [#5184](https://github.com/common-voice/common-voice/pull/5184) (in v1.155.1)
- Fix: Multiple fixes in dashboard page stats and goals sections, by [@moz-bozden](https://github.com/moz-bozden) in [#5178](https://github.com/common-voice/common-voice/pull/5178) (in v1.155.1)
- Chore: Add query parameter to MDC link to directly access CV datasets, by [@moz-bozden](https://github.com/moz-bozden) in [#5192](https://github.com/common-voice/common-voice/pull/5192) (in v1.155.5)
- Chore: Change header layouts to make CV & SS look similar, by [@moz-bozden](https://github.com/moz-bozden) in [#5202](https://github.com/common-voice/common-voice/pull/5202), [#5191](https://github.com/common-voice/common-voice/pull/5191) (in v1.155.5)
- Chore: Change zh-TW into zh-CN in legal doc links, by [@moz-bozden](https://github.com/moz-bozden) in [#5177](https://github.com/common-voice/common-voice/pull/5177) (in v1.155.1)

#### Data Changes in v1.156.0

- Added new Efik (`efk`) language as a starting language
- Add variants and accents to Romanian (ro) by [@MariaMitrofan](https://github.com/MariaMitrofan) in [#5220](https://github.com/common-voice/common-voice/pull/5220)
- Chore: Updated names of two variants in Alsatian (gsw) by [@moz-bozden](https://github.com/moz-bozden) in [#5214](https://github.com/common-voice/common-voice/pull/5214) (in v1.155.7)
- Chore: Add migration to retire some Catalan sentences, by [@moz-bozden](https://github.com/moz-bozden) in [#5195](https://github.com/common-voice/common-voice/pull/5195) (in v1.155.5)
- Chore: Change name of (`shi`) from Tachelhit to Tashlhiyt (in v1.155.1)

#### Spontaneous Speech v1.156.0

- Feat/Fix: Add iPad desktop detection to serve correct codec which otherwise causes issues, by [@moz-bozden](https://github.com/moz-bozden) in [#501](https://github.com/common-voice/spontaneous-speech/pull/501)
- Chore: Add query parameter to MDC link to directly access CV datasets, by [@moz-bozden](https://github.com/moz-bozden) in [#499](https://github.com/common-voice/spontaneous-speech/pull/499) (in v1.155.5)
- Refactor: Move the UI language selector to the menu area, by [@moz-bozden](https://github.com/moz-bozden) in [#496](https://github.com/common-voice/spontaneous-speech/pull/496), [#497](https://github.com/common-voice/spontaneous-speech/pull/497) (in v1.155.1), and [#498](https://github.com/common-voice/spontaneous-speech/pull/498) (in v1.155.5)

##### SS Data Changes in v1.156.0

- Add Pashto (ps) and 128 questions by [@moz-bozden](https://github.com/moz-bozden) in [#500](https://github.com/common-voice/spontaneous-speech/pull/500) (in v1.155.7)

---

### [v1.155.0 (2025-11-16)](https://github.com/common-voice/common-voice/releases/tag/release-v1.155.0)

- Feat: Implement feature flag to test alpha/beta level features and use in API credentials, by [@moz-bozden](https://github.com/moz-bozden) in [#5171](https://github.com/common-voice/common-voice/pull/5171) (in v1.154.7)
- Minor Fix: React key was not unique in API credential list, by [@moz-bozden](https://github.com/moz-bozden) in [#5172](https://github.com/common-voice/common-voice/pull/5172) (in v1.154.7)
- Fix/Refactor: Handle not found errors, by [@moz-bozden](https://github.com/moz-bozden) in [#5174](https://github.com/common-voice/common-voice/pull/5174)
- Fix/Refactor: Adjustments for race condition, durations, and logging, by [@moz-bozden](https://github.com/moz-bozden) in [#5173](https://github.com/common-voice/common-voice/pull/5173)
- Fix/Refactor: Rework variant only clip selection and caching, by [@moz-bozden](https://github.com/moz-bozden) in [#5165](https://github.com/common-voice/common-voice/pull/5165) (in v1.154.7)
- Fix/Refactor: Switch to new newsletter sign-up, by [@moz-bozden](https://github.com/moz-bozden) in [#5136](https://github.com/common-voice/common-voice/pull/5136) (in v1.154.7)
- Fix/Refactor: Optimize long running queries and their caching, by [@moz-bozden](https://github.com/moz-bozden) in [#5163](https://github.com/common-voice/common-voice/pull/5163) (in v1.154.6)
- Fix/Refactor: Refactor redis and lazy-cache to drop sensitivity to redis -> mem-cache strategy changes and make more resilient, by [@moz-bozden](https://github.com/moz-bozden) in [#5162](https://github.com/common-voice/common-voice/pull/5162) (in v1.154.5)
- Fix: Add migration to fix "predefined French South accent cannot be added" problem, which was caused by a user defined accent, by [@moz-bozden](https://github.com/moz-bozden) in [#5158](https://github.com/common-voice/common-voice/pull/5158) (in v1.154.5)
- Fix/Refactor: Refactor redis set cache to save provided sentences - not the recorded ones to prevent some duplicates, by [@moz-bozden](https://github.com/moz-bozden) in [#5157](https://github.com/common-voice/common-voice/pull/5157) (in v1.154.5)
- Fix: Refactor sentence selection for Speak page for better randomization, performance and fixing the duplicate-clip problem, by [@moz-bozden](https://github.com/moz-bozden) in [#5153](https://github.com/common-voice/common-voice/pull/5153) (in v1.154.3) and [#5157](https://github.com/common-voice/common-voice/pull/5157) (in v1.154.4)
- Chore: Generalize ffmpeg error fingerprint for better observalibity, by [@moz-bozden](https://github.com/moz-bozden) in commit [a47722d](https://github.com/common-voice/common-voice/commit/a47722d4fe83a26764990e521ae236a6299561af) (in v1.154.5)
- Chore: Remove content-length validation which was causing problems with data coming from proxied networks and some mobile devices, by [@moz-bozden](https://github.com/moz-bozden) in commit [209def2](https://github.com/common-voice/common-voice/commit/209def26a5ccf83a155f9f2deb5dcbe29fc8debd) (in v1.154.5)
- Chore: add Igbo WhatsApp group to [COMMUNITIES.md](https://github.com/common-voice/common-voice/blob/main/docs/COMMUNITIES.md) (in v1.154.5)
- Chore: Add flag and disable recordings for taxonomy sentences (they were already taken out of circulation), by [@moz-bozden](https://github.com/moz-bozden) in [#5161](https://github.com/common-voice/common-voice/pull/5161) (in v1.154.5)
- Chore: Change legal docs repo uri, by [@moz-bozden](https://github.com/moz-bozden) in [#5159](https://github.com/common-voice/common-voice/pull/5159) (in v1.154.5)
- Chore: Change the downloads menu to point to MDC downloads area, by [@moz-dfeller](https://github.com/moz-dfeller) In [#5151](https://github.com/common-voice/common-voice/pull/5151) (in v1.154.1 and v1.154.2)
- CI: Add accents/variants issue templates and make changes to sripted and spontaneous speech templates, by [@bandrandr](https://github.com/bandrandr) in [#5140](https://github.com/common-voice/common-voice/pull/5140) (in v1.153.4)

#### Data Changes in v1.155.0

- Added new Lango (laj) language as a starting language (in v1.154.5)
- Added new Tumbuke (tum) language as a starting language (in v1.154.3)
- Update English name of `shi` from Shilha to Tachelhit (in v1.154.1)
- Update sentence bands of 21 locales, by [@moz-bozden](https://github.com/moz-bozden) in [#5148](https://github.com/common-voice/common-voice/pull/5148) (in v1.154.1)

#### Spontaneous Speech v1.155.0

- Feat: Add code-switching extension to spontaneous speech for alpha tests (gated), by [@moz-bozden](https://github.com/moz-bozden) and [@moz-rotimib](https://github.com/moz-rotimib) in [#493](https://github.com/common-voice/spontaneous-speech/pull/493) (follow up to [#480](https://github.com/common-voice/spontaneous-speech/pull/480) [#451](https://github.com/common-voice/spontaneous-speech/pull/451), [#414](https://github.com/common-voice/spontaneous-speech/pull/414), [#404](https://github.com/common-voice/spontaneous-speech/pull/404), and others)
- Chore: Point to MDC datasets from the main menu, by [@moz-bozden](https://github.com/moz-bozden) in [#495](https://github.com/common-voice/spontaneous-speech/pull/495) (in v1.152.7)

##### SS Data Changes in v1.155.0

- Add Lango (`laj`) questions by [@bandrandr](https://github.com/bandrandr) in [#494](https://github.com/common-voice/spontaneous-speech/pull/494) (in v1.154.7)

### [v1.154.0 (2025-10-30)](https://github.com/common-voice/common-voice/releases/tag/release-v1.154.0)

- Feat: Refactor audio transcoding pipeline and move it to subprocess to handle prevent crashes caused by bad audio data to crash the main process, by [@moz-dfeller](https://github.com/moz-dfeller) in [#5145](https://github.com/common-voice/common-voice/pull/5145) and [#5147](https://github.com/common-voice/common-voice/pull/5147) (in v1.153.4 and v1.153.6)
- Feat: Refactor front-end error handling logic with customized error class, add more descriptive errors, especially handling 5xx error, by [@moz-bozden](https://github.com/moz-bozden) in [#5131](https://github.com/common-voice/common-voice/pull/5131) and [#5133](https://github.com/common-voice/common-voice/pull/5133) (in v1.153.2)
- Feat: Add WebView detection and warning to give more descriptive feedback to users who cannot record from social media apps, by [@moz-bozden](https://github.com/moz-bozden) in [#5115](https://github.com/common-voice/common-voice/pull/5115) (in v1.153.2)
- Feat/Fix: Refactor variant sentence selection workflow to perform much better and prevent timeouts, by [@moz-bozden](https://github.com/moz-bozden) in [#5146](https://github.com/common-voice/common-voice/pull/5146)
- Feat/Fix: Update clip selection logic and cache durations to perform much better and prevent timeouts, by [@moz-bozden](https://github.com/moz-bozden) in [#5142](https://github.com/common-voice/common-voice/pull/5142)
- Feat/Fix: Create extra indexes and optimize query for top contributors (leaderboard) to perform much better and prevent timeouts, by [@moz-bozden](https://github.com/moz-bozden) in [#5137](https://github.com/common-voice/common-voice/pull/5137)
- Feat/Fix: Fine-tune cache and lock durations in two endpoints (get clips to validate, leader boards in Dashboard), by [@moz-bozden](https://github.com/moz-bozden) in [#5135](https://github.com/common-voice/common-voice/pull/5135) (in v1.153.3)
- Feat/Fix: Extend reporting Redis/LazyCache, by [@moz-bozden](https://github.com/moz-bozden) in [#5130](https://github.com/common-voice/common-voice/pull/5130) (in v1.153.2)
- Feat/Fix: Refactor API endpoints and add some validation - Step-1, by [@moz-bozden](https://github.com/moz-bozden) in [#5129](https://github.com/common-voice/common-voice/pull/5129) (in v1.153.2)
- Feat/Fix: Redis connection loss problems in LazyCache and make it resilient to connection losses by health monitoring and switching to memory-cache, by [@moz-bozden](https://github.com/moz-bozden) in [#5107](https://github.com/common-voice/common-voice/pull/5107) (in v1.153.1)
- Feat/Fix: Redis connection loss problems in LazyCache and make it resilient to connection losses by health monitoring and switching to memory-cache, by [@moz-bozden](https://github.com/moz-bozden) in [#5107](https://github.com/common-voice/common-voice/pull/5107) (in v1.153.1)
- Fix: Re-adjust clip selection durations to prevent cache lock release issues, by [@moz-bozden](https://github.com/moz-bozden) in [#5142](https://github.com/common-voice/common-voice/pull/5142) (in v1.153.4)
- Fix: Add typing for parsing fluent elements, by [@moz-bozden](https://github.com/moz-bozden) in [#5126](https://github.com/common-voice/common-voice/pull/5126) (in v1.153.4)
- Fix: Parsing of some language codes failing, which were populating the new english_name field in the new endpoint, by [@moz-bozden](https://github.com/moz-bozden) in [#5123](https://github.com/common-voice/common-voice/pull/5123) (in v1.153.1)
- Chore: Updates to [COMMUNITIES.md](https://github.com/common-voice/common-voice/blob/main/docs/COMMUNITIES.md)

#### Data Changes in v1.154.0

- Add Abaza (`abq`) variants (Tapanta, Ashkhara) by [@bandrandr](https://github.com/bandrandr), thank you [@Gedumurat](https://github.com/Gedumurat) for the contributions. In [#5138](https://github.com/common-voice/common-voice/pull/5138) (in v1.153.5)

#### Spontaneous Speech v1.154.0

##### SS Data Changes in v1.154.0

- Add 145 Tatar (`tt`) questions by [@bandrandr](https://github.com/bandrandr) in [#492](https://github.com/common-voice/spontaneous-speech/pull/492) (in v1.153.4)
- Add 60 Tachelhit (`shi`) questions by [@bandrandr](https://github.com/bandrandr) in [#491](https://github.com/common-voice/spontaneous-speech/pull/491) (in v1.153.4)

---

### [v1.153.0 (2025-10-13)](https://github.com/common-voice/common-voice/releases/tag/release-v1.153.0)

- Feat: Update language flow to fill in `english_name` in the locale table, and provide them in API endpoints, by [@moz-bozden](https://github.com/moz-bozden) in [#5114](https://github.com/common-voice/common-voice/pull/5114)
- Feat: Add migration to to add `english_name` to locale table, which will also be available in API endpoints, to provide a fallback language where `native_name` field is not yet populated and showing the language code, by [@moz-bozden](https://github.com/moz-bozden) in [#5113](https://github.com/common-voice/common-voice/pull/5113) (in v1.152.4)
- Feat: Update the accent-variant migration helper to add optional (do not-)delete parameter to also handle specific grouping case in French, by [@moz-bozden](https://github.com/moz-bozden) in [#5110](https://github.com/common-voice/common-voice/pull/5110), to handle part of [#5087](https://github.com/common-voice/common-voice/issues/5087) (in v1.152.4)
- Feat: Added `/languagedata` endpoint to back-end, which provides detailed language data with related variants and pre-defined accents, which will be used in CV-SS integration and Public API, also simplifying use in other clients using the API, by [@moz-bozden](https://github.com/moz-bozden) in [#5103](https://github.com/common-voice/common-voice/pull/5103) (in v1.152.3)
- Feat: Migrate to Pontoon API v2 to get language/locale information, by [@moz-bozden](https://github.com/moz-bozden) in [#5099](https://github.com/common-voice/common-voice/pull/5099) to handle [#5010](https://github.com/common-voice/common-voice/issues/5010) (in v1.152.3)
- Workaround: Increase the cache duration to get less duplicate clip errors happening in low-text-corpus languages, by [@moz-bozden](https://github.com/moz-bozden) in [#5119](https://github.com/common-voice/common-voice/pull/5119) (in v1.152.4)
- Fix: For errors in Listen page play functionality, mostly happening in Android Chrome Mobile, when people double-tap the play icon. We added some delay and proper error handling, by [@moz-bozden](https://github.com/moz-bozden) in [#5101](https://github.com/common-voice/common-voice/pull/5101) (in v1.152.3)
- Fix: For DEV environment, when IMPORT_LANGUAGES is not set, it does not work as intended, by [@polyfloyd](https://github.com/polyfloyd) in [#5100](https://github.com/common-voice/common-voice/pull/5100) (in v1.152.3)
- Fix: For update query for user-variant is_preferred_option sometimes failing due to undefined/null values, by [@moz-bozden](https://github.com/moz-bozden) in [#5083](https://github.com/common-voice/common-voice/pull/5083) (in v1.152.1)
- Chore: Remove defunct "Updating Languages" section, by [@polyfloyd](https://github.com/polyfloyd) in [#5102](https://github.com/common-voice/common-voice/pull/5102) (in v1.152.3)
- Chore: Update Discourse invite link in [COMMUNITIES.md](https://github.com/common-voice/common-voice/blob/main/docs/COMMUNITIES.md) (in v1.152.2)

#### Data Changes in v1.153.0

- Migrate French (`fr`) accents to new variants, by [@moz-bozden](https://github.com/moz-bozden) in [#5112](https://github.com/common-voice/common-voice/pull/5112) with guidence of [@ESBigeard](https://github.com/ESBigeard) and [@ftyers](https://github.com/ftyers), to handle final part of [#5087](https://github.com/common-voice/common-voice/issues/5087)
- Add new French (`fr`) accents and variants, by [@moz-bozden](https://github.com/moz-bozden) in [#5111](https://github.com/common-voice/common-voice/pull/5111) with guidence of [@ESBigeard](https://github.com/ESBigeard), to handle part of [#5087](https://github.com/common-voice/common-voice/issues/5087), (in v1.152.4)
- Added Gilaki (`glk`) and Palauan (`pau`) as starting locales (in v1.152.4)
- Added Hakka (`hak`) and Sundanese (`su`) as starting locales (in v1.152.2)
- Changes to locale names for some languages in Pontoon propogated (`mve` -> Marwari, `sbn` -> Sindhi Bhil, `xhe` -> Khetrani) (in v1.152.1)

#### Spontaneous Speech v1.153.0

- Feat: Add add English back to the dataset release, by [@moz-dfeller](https://github.com/moz-dfeller) (in v1.152.4)
- CI: Add workflow to deploy bundler independently, by [@moz-dfeller](https://github.com/moz-dfeller) (in v1.152.4)
- Fix: Comma could not be entered into Russian dataset because of a bad regex, by [@moz-bozden](https://github.com/moz-bozden) in [#489](https://github.com/common-voice/spontaneous-speech/pull/489) (in v1.152.2)
- Fix: For player issues on recent iPhones in Answer page, by [@moz-bozden](https://github.com/moz-bozden) in [#488](https://github.com/common-voice/spontaneous-speech/pull/488), [#490](https://github.com/common-voice/spontaneous-speech/pull/490) (in v1.152.2)

##### SS Data Changes in v1.153.0

- Add Thai (`th`) questions by [@bandrandr](https://github.com/bandrandr) in [#487](https://github.com/common-voice/spontaneous-speech/pull/487) (in v1.152.1)

---

### [v1.152.0 (2025-09-13)](https://github.com/common-voice/common-voice/releases/tag/release-v1.152.0)

- Feat: Provide support for multiple Matrix clients by adding a second button on the homepage, by [@moz-bozden](https://github.com/moz-bozden) in [#5068](https://github.com/common-voice/common-voice/pull/5068)
- Feat: Add announcement component, by [@moz-bozden](https://github.com/moz-bozden) in [#5067](https://github.com/common-voice/common-voice/pull/5067)
- Feat: Add less-more to datasets pages for better UX, by [@HarikalarKutusu](https://github.com/HarikalarKutusu) in [#4843](https://github.com/common-voice/common-voice/pull/4843)
- Feat: Add migration-helpers to remove already migrated accents, by making sure data is intact (this is part of Irish accent removal above), by [@moz-bozden](https://github.com/moz-bozden) in [#5060](https://github.com/common-voice/common-voice/pull/5060) - (in v.1.151.1)
- Workaround: Some of the database queries related to stats were taking longer than anticipated on active hours, causing Redis lock release issues, so with this workaround we increased the default lock duration from 3 minutes to 5 minutes to cover these, by [@moz-bozden](https://github.com/moz-bozden) in [#5058](https://github.com/common-voice/common-voice/pull/5058) - (in v.1.151.1)
- Fix: Update text on download page header, by [@moz-bozden](https://github.com/moz-bozden) in [#5078](https://github.com/common-voice/common-voice/pull/5078)
- Fix: Add validation to anonymous_user endpoint with language related schemata, by [@moz-bozden](https://github.com/moz-bozden) in [#5071](https://github.com/common-voice/common-voice/pull/5071)
- Fix: Minor issues in CTA forms for non-logged-in users, by [@moz-bozden](https://github.com/moz-bozden) in [#5070](https://github.com/common-voice/common-voice/pull/5070)
- Fix: Add migration to remove links to old/leftover amazonaws profile images, by [@moz-bozden](https://github.com/moz-bozden) in [#5069](https://github.com/common-voice/common-voice/pull/5069)
- Fix: A third fix for the layered rule-of-hooks problem on the Dashboard Stats Page, by [@moz-bozden](https://github.com/moz-bozden) in [#5066](https://github.com/common-voice/common-voice/pull/5066) - (in v.1.151.1)
- Fix: Server code for dataset downloads was missing proper validation for the "release-type" query parameter causing further errors, by [@moz-bozden](https://github.com/moz-bozden) in [#5064](https://github.com/common-voice/common-voice/pull/5064) - (in v.1.151.1)
- Fix: Server code was missing userId checks in multiple places causing further errors, by [@moz-bozden](https://github.com/moz-bozden) in [#5063](https://github.com/common-voice/common-voice/pull/5063) - (in v.1.151.1)
- Fix: Server API code related to Dashboard page goals/awards had two issues, one a return statement was missing after userId check fails causing following code to be executed and cause further errors, and custom goal creation missing proper user checks, by [@moz-bozden](https://github.com/moz-bozden) in [#5062](https://github.com/common-voice/common-voice/pull/5062) - (in v.1.151.1)
- Fix: Leader-board related SQL queries in Dashboard page were not using correct parameter count in ALL locale case, causing lock release issues, by [@moz-bozden](https://github.com/moz-bozden) in [#5061](https://github.com/common-voice/common-voice/pull/5061) - (in v.1.151.1)
- Fix: Remove duplicate language code definitions in Spontaneous Speech `.ftl` file, because they are in Pontoon already, by [@moz-bozden](https://github.com/moz-bozden) in [#5059](https://github.com/common-voice/common-voice/pull/5059) - (in v.1.151.1)
- Chore: Updates to [COMMUNITIES.md](https://github.com/common-voice/common-voice/blob/main/docs/COMMUNITIES.md)

#### Data Changes in v1.152.0

- Feat: For Irish (`ga-IE`), re-apply accent-variant migrations and totally remove all migrated accents, by [@moz-bozden](https://github.com/moz-bozden) in [#5060](https://github.com/common-voice/common-voice/pull/5060) - (in v.1.152.1)

#### Spontaneous Speech v1.152.0

- Feat: Add announcement component, by [@moz-bozden](https://github.com/moz-bozden) in [#485](https://github.com/common-voice/spontaneous-speech/pull/485)

##### SS Data Changes in v1.152.0

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
