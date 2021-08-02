# Sentences on Common Voice

As Common Voice is a read dataset, sentences are our currency. You can help by adding new sentences to our dataset for other contributors to read, helping with bulk sentence extractions, or reporting problematic sentences.

## Sentence Collector

The [Sentence Collector](https://commonvoice.mozilla.org/sentence-collector/) is a tool for crowdsourcing sentences for Common Voice. You can either:

- Add sentences for your language
- Validate sentences that other contributors have added

Each sentence requires at least two upvotes to be considered valid.

At regular intervals, validated sentences from the Sentence Collector will be exported and added to the Common Voice database. These will be available on the site next time there's a release.

## Automatic extraction

The Sentence Extractor is a tool that can scrape public domain data sources for sentences. Right now, the only source we have configured is Wikipedia. Please [see this post](https://discourse.mozilla.org/t/sentence-extractor-current-status-and-workflow-summary/62332) for detailed guidance on how to use the sentence extractor.

## Bulk submission

If you know of a public domain corpus of sentences with more than 100k sentences, you can manually submit a pull request to add this as a bulk dataset. However, you will need to manually perform QA (quality assurance) to make sure the sentences are valid and high-quality.

[This Discourse post](https://discourse.mozilla.org/t/using-the-europarl-dataset-with-sentences-from-speeches-from-the-european-parliament/50184) has a more detailed guide for how to do manual QA, but in brief:

- You need 2-3 native speakers to review a random sample of sentences to verify their correctness
- The sentences should be spelled correctly.
- The sentences should be grammatically correct.
- The sentences should be speakable (also avoiding non-native uncommon words)

We're looking for less than 5% of error rate on the random sample. You can use [this tool](https://www.surveymonkey.com/mp/sample-size-calculator/) with a confidence level of 99% and a margin of error of 2% to determine the sample size you need to review.

Feel free to set up this QA however makes most sense for you, but here's a [sample Google Spreadsheets template](https://docs.google.com/spreadsheets/d/1dJpysfcwmUwR4oJuw5ttGcUFYLeTbmn50Fpufz9qx-8/edit#gid=0).

Once the review is complete, submit a pull request with the # of sentences submitted, a link to the manual QA results, and the % error rate. Here's [an example PR](https://github.com/mozilla/common-voice/pull/2873).

## Flagging problematic sentences

If you notice sentences that need to be deleted, first check what the source of the sentence is. If the file that the sentence is located in is called `sentence-collector.txt`, that means it was automatically exported from Sentence Collector. In that case, please file an issue on the [Sentence Collector repo](https://github.com/Common-Voice/sentence-collector/) with a plaintext file of all of the problem sentences, with one sentence per line.

If the sentence is from a different source, you can file a pull request that modifies the text file directly. If possible, also attach a separate plaintext file that has all of the problem sentences, with one sentence per line.
