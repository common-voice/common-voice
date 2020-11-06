# Common Voice [![Travis Status](https://travis-ci.org/mozilla/common-voice.svg?branch=main)](https://travis-ci.org/mozilla/common-voice)

This is the web app for [Mozilla Common Voice](https://commonvoice.mozilla.org), a platform for collecting speech donations in order to create public domain datasets for training voice recognition-related tools.

**Please note**: Common Voice has been impacted by [Mozilla's 2020 restructuring efforts](https://discourse.mozilla.org/t/mozilla-org-wide-updates-impacts-on-common-voice/65612), and is currently in maintenance mode. This means that we are committed to ongoing bugfixes, localization and language updates, community support, and data releases, but will not be working on major features.

## Quick links

1. [Code of conduct](./docs/CODE_OF_CONDUCT.md)
1. [Development setup](./docs/DEVELOPMENT.md)
1. [Language workflow](./docs/LANGUAGE.md)
1. [Sentences workflow](./docs/SENTENCES.md)
1. [Discourse forum](https://discourse.mozilla-community.org/c/voice)
1. [Matrix chat](https://chat.mozilla.org/#/room/#common-voice:mozilla.org)
1. [License](./LICENSE)

## How to contribute

🎉 First off, thanks for taking the time to contribute! This project would not be possible without people like you. 🎉

There are many ways to get involved with Common Voice - you don't have to know how to code to contribute!

- To add or correct the translation of the web interface, please use the [Mozilla localization platform Pontoon](https://pontoon.mozilla.org/projects/common-voice/). Please note, we do **not** accept any direct pull requests for changing localization content.
- For information on how to add or edit sentences to Common Voice, see [SENTENCES.md](./docs/SENTENCES.md)
- For instructions on setting up a local development environment, see [DEVELOPMENT.md](<(./docs/DEVELOPMENT.md)>)
- For information on how to add a new language to Common Voice, see [LANGUAGE.md](./docs/LANGUAGE.md)

For more general guidance on building your own language community using Mozilla voice tools, please refer to the [Mozilla Voice Community Playbook](https://common-voice.github.io/community-playbook/).

## Discussion

For general discussion (feedback, ideas, random musings), head to our [Discourse Category](https://discourse.mozilla-community.org/c/voice).

For bug reports or specific feature, please use the [GitHub issue tracker](https://github.com/mozilla/voice-web/issues).

For live chat, [join us on Matrix](https://chat.mozilla.org/#/room/#common-voice:mozilla.org).

## Licensing and content source

This repository is released under [MPL (Mozilla Public License) 2.0](LICENSE).

The majority of our sentence text in `/server/data` comes directly from user submissions in our [Sentence Collector](https://github.com/Common-Voice/sentence-collector/) or they are scraped from Wikipedia using our [extractor tool](https://github.com/Common-Voice/cv-sentence-extractor), and are released under a [CC0 public domain Creative Commons license](https://creativecommons.org/share-your-work/public-domain/cc0/).

Any files that follow the pattern `europarl-VERSION-LANG.txt` (such as [europarl-v7-de.txt](https://github.com/mozilla/voice-web/blob/main/server/data/de/europarl-v7-de.txt)) were extracted with our thanks from the [Europarl Corpus](http://www.statmt.org/europarl/), which features transcripts from proceedings in the European parliament.
