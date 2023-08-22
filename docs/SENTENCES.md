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

Some methods don't go through automated cleanup/validation/rules, and they are not unified. Thus, there is a process to remove old data that might need to be discarded.

If you notice sentences that need to be deleted, you can create a [migration](https://github.com/common-voice/common-voice/tree/main/server/src/lib/model/db/migrations) as a Pull Request. Alternatively you can also create an issue in this repository and we will take care of it.
