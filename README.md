# Common Voice

This is the web app for [Mozilla Common Voice](https://commonvoice.mozilla.org), a platform for collecting speech donations in order to create public domain datasets for training voice recognition-related tools.

## Upcoming releases

| Type             | Expected date  | More info      |
| :--------------- |:---------------|:---------------|
| Platform code & sentences | Dec 15, 2021 | [Release notes](https://github.com/common-voice/common-voice/releases) |
| Dataset          | Jan 2022 | [Dataset metadata](https://github.com/common-voice/cv-dataset/) |

## Quick links

- [Code of conduct](./docs/CODE_OF_CONDUCT.md)
- [Development setup](./docs/DEVELOPMENT.md)
- [Language workflow](./docs/LANGUAGE.md)
- [Sentences workflow](./docs/SENTENCES.md)
- [Discourse forum](https://discourse.mozilla-community.org/c/voice)
- [Matrix chat](https://chat.mozilla.org/#/room/#common-voice:mozilla.org)
- [License](./LICENSE)

## First time here ? 

👍 As in all open source project, newcomers are always welcome ! 

⏩ In order to help you to understand where you are and where to go, please start by reviewing the [Community Onboarding page](https://common-voice.github.io/community-playbook/sub_pages/onboarding.html), at least the [Onboarding slides](https://docs.google.com/presentation/d/1FVTWmWYZCfmjkfASm3EVImMrY-Hu__C3z8XZ8f4VyNk/edit?usp=sharing) document. It will save you from many misunderstanding in the future, whether you just want to understand the project, contribute with your voice, or code algorithms. 

## How to contribute

🎉 First off, thanks for taking the time to contribute! This project would not be possible without people like you. 🎉

There are many ways to get involved with Common Voice - you don't have to know how to code to contribute!

- To add or correct the translation of the web interface, please use the [Mozilla localization platform Pontoon](https://pontoon.mozilla.org/projects/common-voice/). Please note, we do **not** accept any direct pull requests for changing localization content.
- For information on how to add or edit sentences to Common Voice, see [SENTENCES.md](./docs/SENTENCES.md)
- For instructions on setting up a local development environment, see [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
- For information on how to add a new language to Common Voice, see [LANGUAGE.md](./docs/LANGUAGE.md)
- For information on how to get in contact with existing language communities, see [COMMUNITIES.md](./docs/COMMUNITIES.md)

For more general guidance on building your own language community using Mozilla voice tools, please refer to the [Mozilla Voice Community Playbook](https://common-voice.github.io/community-playbook/).

## Discussion

For general discussion (feedback, ideas, random musings), head to our [Discourse Category](https://discourse.mozilla-community.org/c/voice).

For bug reports or specific feature, please use the [GitHub issue tracker](https://github.com/mozilla/common-voice/issues).

For live chat, [join us on Matrix](https://chat.mozilla.org/#/room/#common-voice:mozilla.org).

## Licensing and content source

This repository is released under [MPL (Mozilla Public License) 2.0](LICENSE).

The majority of our sentence text in `/server/data` comes directly from user submissions in our [Sentence Collector](https://github.com/Common-Voice/sentence-collector/) or they are scraped from Wikipedia using our [extractor tool](https://github.com/Common-Voice/cv-sentence-extractor), and are released under a [CC0 public domain Creative Commons license](https://creativecommons.org/share-your-work/public-domain/cc0/).

Any files that follow the pattern `europarl-VERSION-LANG.txt` (such as [europarl-v7-de.txt](https://github.com/mozilla/common-voice/blob/main/server/data/de/europarl-v7-de.txt)) were extracted with our thanks from the [Europarl Corpus](http://www.statmt.org/europarl/), which features transcripts from proceedings in the European parliament.

## Citation

If you use the data in a published academic work we would appreciate if you cite the following article:

- Ardila, R., Branson, M., Davis, K., Henretty, M., Kohler, M., Meyer, J., Morais, R., Saunders, L., Tyers, F. M. and Weber, G. (2020) "[Common Voice: A Massively-Multilingual Speech Corpus](https://arxiv.org/abs/1912.06670)". _Proceedings of the 12th Conference on Language Resources and Evaluation (LREC 2020)._ pp. 4211—4215

The BiBTex is:

```
@inproceedings{commonvoice:2020,
  author = {Ardila, R. and Branson, M. and Davis, K. and Henretty, M. and Kohler, M. and Meyer, J. and Morais, R. and Saunders, L. and Tyers, F. M. and Weber, G.},
  title = {Common Voice: A Massively-Multilingual Speech Corpus},
  booktitle = {Proceedings of the 12th Conference on Language Resources and Evaluation (LREC 2020)},
  pages = {4211--4215},
  year = 2020
}
```

```

```
