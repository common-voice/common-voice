All the sentences read by our contributors are sourced from copyright free sources or permissioned sources, either through [automated sourcing](https://github.com/common-voice/cv-sentence-extractor) by agreement from sources like Wikipedia or contributed by our language communities.

If you want to add a single sentence, or a series of single sentences, you can do so via the [Sentence Collection](https://commonvoice.mozilla.org/write) page on the [Common Voice website](https://commonvoice.mozilla.org). To contribute a larger number of sentences at once, you can use the Bulk Sentence upload option.

Remember that for both single sentence and bulk sentence submissions, sentences must:
- Be in the public domain, with a CC0 license
- Be short, readable and take about 10-15 seconds to read
- Avoid including numbers or special characters
## Formatting Your Bulk Sentences
To upload bulk sentences, you'll need to have created a TSV file with your sentences.

Please format your bulk sentences into a [.TSV](https://en.wikipedia.org/wiki/Tab-separated_values) file with five columns, containing the following columns from left to right:
- Your sentence
- The source for your sentence
- Additional infomation about why this source is eligible for inclusion in a CC0 dataset
- A blank column for our team to use in the quality control process
- An optional column showing the domain for sentences, as described in [this blog post](https://foundation.mozilla.org/en/blog/domain-datasets-common-voice/)

The more information you are able to provide in the Source column, the easier it will be to get your bulk sentence submission validated.

Here is an example of a formatted bulk sentence submission of English and Portuguese sentences, combined to show how variants are specified in bulk sentence uploads:
Please do not combine sentences from multiple languages in a single bulk sentence upload.

|   Sentence (mandatory)                                                            |   Source (mandatory)                                                                          |   Additional rationale for open license (mandatory)  |   Sentence Quality Assurance Feedback: leave blank, for internal use  |   Domain (optional)  |   Variant (optional, where applicable)  |
|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------------|-----------------------------------------------------------------------|----------------------|-----------------------------------------|
|   Six years have passed since I resolved on my present undertaking.               |   Frankenstien, Mary Shelly, 1818, https://www.gutenberg.org/files/42324/42324-h/42324-h.htm  |   More than 100 years since publication              |                                                                       |   General            |                                         |
|   She died calmly; and her countenance expressed affection even in death.         |   Frankenstien, Mary Shelly, 1818, https://www.gutenberg.org/files/42324/42324-h/42324-h.htm  |   More than 100 years since publication              |                                                                       |   General            |                                         |
|   My cat is a strange little dude.                                                |   Jessica Rose (self)                                                                         |   MCV CC0 waiver process - see legal form            |                                                                       |                      |                                         |
|   Essa empresa parece a casada mãe Joana, mas o salário dá para quebrar o galho.  |   Jessica Rose (self)                                                                         |   My own submission, copyright waived                |                                                                       |   General            |   pt-BR                                 |
|   Have you read the Doraemon comics yet?                                          |   Jessica Rose (self)                                                                         |   My own submission, copyright waived                |                                                                       |   General            |                                         |
|   Her don't like pizza.                                                           |   Jane Doe (self)                                                                             |   My own submission, copyright waived                |                                                                       |                      |                                         |
|   The cat was sitin on the windowsill.                                            |   Jane Doe (self)                                                                             |   My own submission, copyright waived                |                                                                       |                      |                                         |
|   The 3 elephants were playing in the mud                                         |   John Doe (self)                                                                             |   My own submission, copyright waived                |                                                                       |                      |                                         |
|                                                                                   |                                                                                               |                                                      |                                                                       |                      |                                         |
## Uploading Your Bulk Sentences
After logging on, select the Bulk Sentence Submission option from the left hand side of the [Sentence Collection](https://commonvoice.mozilla.org/write) page.

![BULK_SENTENCES_ON_PLATFORM](https://github.com/common-voice/common-voice/assets/4729371/d2542dc2-8692-4fba-be3f-ac065cab4839)

**Please note that you can only see and select the Bulk Sentences Uploads when you are logged into Common Voice.**

Now you can either drag and drop your TSV of bulk sentences into the shaded upload area, or select the link marked 'click to upload' and select the file from where the TSV file has been saved to your computer.

![BULK_SENTENCE_UPLOAD](https://github.com/common-voice/common-voice/assets/4729371/c2e6814e-f16f-4a2d-9305-db6339c29f2f)

After dragging to upload your file, you'll be asked to check a box to confirm that these sentences are in the public domain. Check this box and press 'Submit' to send your bulk sentence upload to the Common Voice team for processing.

## After Submitting Your Bulk Sentences

Once your file has been sent, our team will quality control the bulk sentence submission by asking a community member from the same language community to evaluate a randomly selected sample of sentences from your file. After quality control checks have been passed, our engineers with merge your approved bulk setences file into the text corpus for the appropriate language. If we have questions or concerns with your bulk sentence sumission, our team will contact you to discuss them.

There is currently a backlog for bulk sentence review, so there may be a short wait for your sentence to be processed.

## Questions or Problems with Bulk Sentence Uploads
Email the team at commonvoice@mozilla.org for support or with your questions.
