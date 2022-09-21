# Sentences on Common Voice

As Common Voice is a read dataset, sentences are our currency. You can help by adding new sentences to our dataset for other contributors to read, helping with bulk sentence extractions, or reporting problematic sentences.

## In a few words...
📝 [Sentence collector](https://github.com/common-voice/sentence-collector) is a tool for contributors to upload public domain sentences through a website (the [Sentence Collector website](https://commonvoice.mozilla.org/sentence-collector/)) which then can get reviewed and are exported to the [Common Voice database](https://github.com/common-voice/common-voice/tree/main/server/data). Once imported into the Common Voice website, they will show up for contributors to read out aloud. This is a good place to start for newcomers to this project.

📘 Contributors who want to [bulk upload](https://en.wikipedia.org/wiki/Bulk_insert) thousands of sentences, like for books, should check out the [Bulk Submission](https://github.com/common-voice/common-voice/blob/main/docs/SENTENCES.md#bulk-submission) guidelines below. There is no dedicated repository for this.

🖥️ For automatic extraction of data sources, the [Sentence Extractor](https://github.com/Common-Voice/cv-sentence-extractor) is dedicated for extracting from sources such as Wikipedia, Wikisource or raw files.

## Sentence Collector

The [Sentence Collector](https://commonvoice.mozilla.org/sentence-collector/) is a website for crowdsourcing sentences for Common Voice. You can either:

- Add sentences for your language 
- Validate sentences that other contributors have added

Each sentence requires at least two upvotes from human validation to be considered valid.

Every week, validated sentences from the Sentence Collector will be exported and added to the Common Voice repository, and will be available at the next release of the Common Voice website. 

For more detailled explanations, see the [ReadMe file](https://github.com/common-voice/sentence-collector/blob/main/README.md) of the Sentence Collector.
## Automatic extraction

The Sentence Extractor is a tool that can scrape public domain data sources for sentences. There are multiple sources integrated into the Sentence Extractor, such as Wikipedia and Wikisource. Please [see this post](https://discourse.mozilla.org/t/sentence-extractor-current-status-and-workflow-summary/62332) for detailed guidance on how to use the Sentence Extractor.

## Bulk submission

If you know of a public domain corpus of sentences with more than 10k sentences, you can manually submit a pull request to add this as a bulk dataset. However, you will need to manually perform QA (quality assurance) to make sure the sentences are valid and high-quality.

[This Discourse post](https://discourse.mozilla.org/t/using-the-europarl-dataset-with-sentences-from-speeches-from-the-european-parliament/50184) has a more detailed guide for how to do manual QA, but in brief:

- You need 2-3 native speakers to review a random sample of sentences to verify their correctness
- The sentences should be spelled correctly.
- The sentences should be grammatically correct.
- The sentences should be speakable (also avoiding non-native uncommon words)

We're looking for less than 5% of error rate on the random sample. You can use [this tool](https://www.surveymonkey.com/mp/sample-size-calculator/) with a confidence level of 99% and a margin of error of 2% to determine the sample size you need to review.

Feel free to set up this QA however makes most sense for you, but here's a [sample Google Spreadsheets template](https://docs.google.com/spreadsheets/d/1dJpysfcwmUwR4oJuw5ttGcUFYLeTbmn50Fpufz9qx-8/edit#gid=0).

Once the review is complete, submit a pull request with the # of sentences submitted, a link to the manual QA results, and the % error rate. Here's [an example PR](https://github.com/mozilla/common-voice/pull/2873). Please make sure the sentences are in a plain `.txt` file with one sentence per line.

## QA that applies (or not) to the different imputs and outputs
As a reminder, here is listed the different automated QA applied, depending of the process.
* [cleanup](https://github.com/common-voice/sentence-collector/tree/main/server/lib/cleanup) and [validation](https://github.com/common-voice/sentence-collector/tree/main/server/lib/validation) rules for Sentence Collector, 
* [language](https://github.com/common-voice/cv-sentence-extractor#using-language-rules) rules for Sentence Extractor, 
* [preprocessor](https://github.com/common-voice/CorporaCreator/tree/master/src/corporacreator/preprocessors) for CorporaCreator ([CorporaCreator](https://github.com/common-voice/CorporaCreator) is the Common Voice extractor that, linking text and recorded voice samples, make them available for [SST](https://en.wikipedia.org/wiki/Speech_recognition) engines' training).

To help you, for exemple with the 'not supervised, do your own QA' bulk submission, you may find interesting to have a look at it. 

 
# Correcting existing data

Some methods don't go through automated cleanup/validation/rules, and they are not unified ([...not yet](https://discourse.mozilla.org/t/sentence-collector-cleanup-before-export-vs-cleanup-on-upload/105411/15)). Thus, there is a process to remove old data that might need to be discarded.

## Flagging (and removing) problematic sentences already in the Common Voice database

If you notice sentences that need to be deleted, first check what the source of the sentence is. 

Search for the source of the sentence within the [data](https://github.com/common-voice/common-voice/blob/main/server/data) folder. Folders are split up by language. If the sentence is found in `sentence-collector.txt`, that means it was automatically exported from Sentence Collector. In that case, please file an [issue](https://github.com/common-voice/sentence-collector/issues) with a plaintext file of all problematic sentences, listed one sentence per line. Note that in this case removing it from the file through a Pull Request will not help, because it will automatically be added again with the next export.

If the sentence is from a different source, you can file a pull request that modifies the text file directly. If possible, also attach a separate plaintext file that has all of the problem sentences, with one sentence per line.
