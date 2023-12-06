All the sentences read by our contributors are sourced from copyright free sources or permissioned sources, either through [automated sourcing](https://github.com/common-voice/cv-sentence-extractor) by agreement from sources like Wikipedia or contributed by our language communities.

If you want to add a single sentence, or a series of single sentences, you can do so via the [Sentence Collector](https://foundation.mozilla.org/en/blog/the-new-common-voice-sentence-collector/). But when you have a large volume of sentences to contribute, you can make a bulk sentence submission using GitHub.

Remember that for both single sentence and bulk sentence submissions, sentences must:
- Be in the public domain, with a CC0 license
- Be short, readable and take about 10-15 seconds to read
- Avoid including numbers or special characters

Please format your bulk sentences into a TSV file with two columns, one containing the sentences you would like to submit and the other containing the source of the sentences.

The more information you are able to provide in the Source column, the easier it will be to get your bulk sentence submission validated.

| Sentence  |  Source |
|---|---|
| Six years have passed since I resolved on my present undertaking. | Frankenstien, Mary Shelly, 1818, https://www.gutenberg.org/files/42324/42324-h/42324-h.htm |
| During her illness, many arguments had been urged to persuade my mother to refrain from attending upon her. | Frankenstien, Mary Shelly, 1818, https://www.gutenberg.org/files/42324/42324-h/42324-h.htm |
| She died calmly; and her countenance expressed affection even in death. | Frankenstien, Mary Shelly, 1818, https://www.gutenberg.org/files/42324/42324-h/42324-h.htm |
| My cat is a strange little dude. | Jessica Rose (self)  |
| I should have brought sunscreen. | Jessica Rose (self)  |
| Have you read the Doraemon comics yet? | Jessica Rose (self) |

You will need a Github account to submit bulk sentences to Common Voice. If you don’t currently have an account, you can [sign up for one here](https://github.com/signup).

Once you are logged in to GitHub, go to the [Common Voice repo](https://github.com/common-voice/common-voice) where the code for the Common Voice project is stored. Don’t worry, you can’t damage anything or make changes without approval. To submit the sentences, first navigate to the Fork button in the top right hand corner of your screen.

![fork](https://user-images.githubusercontent.com/4729371/236475213-1deea35a-484b-4eb6-b82a-9923a901e253.png)

Creating a fork will make a copy of the Common Voice codebase in your GitHub account. You’ll add your bulk sentences to this copy before sending it back to the Common Voice team for review via a Pull Request.

Choose a name for your fork of the Common Voice repo and then press the “Create Fork” button to make your working copy.

![createfork](https://user-images.githubusercontent.com/4729371/236476944-0fee6658-04c0-455a-ab17-1d4867e59a98.png)


Once your fork has been copied, first navigate to the folder named "Server". Then from this folder, open the folder labelled "Data". Now you should see a list of folders marked with language codes. Please pick the folder that corresponds to the language of your bulk submission.

Next, you’ll need to add a new file within the appropriate language folder using the “Add File” button

![AddFile](https://user-images.githubusercontent.com/4729371/236477060-2609309b-6d60-4dc3-b87a-c81436ebe726.png)

If your bulk sentences are a properly formatted TSV file, you can select “Upload Files” to add them into the system. If your bulk sentences are in another type of two column format (like a Google Docs spreadsheet, Excel, or LibreOffice Calc), select “create new file”. 

![CreatedNewFile](https://user-images.githubusercontent.com/4729371/236477204-d4683dbd-285d-4c97-b183-04222e5293a5.png)

First give your new file a name that ends with a .tsv filename. Like “new-french-sentences.tsv”.

Now, paste your formatted data into the edit new file view. Then press the green “commit new file” button to add the new file to your copy of the Common Voice codebase.

Now, come back to the original [Common Voice repo](https://github.com/common-voice/common-voice) and select the [Pull Requests tab](https://github.com/common-voice/common-voice/pulls) and select the button for a [new pull request](https://github.com/common-voice/common-voice/compare)

![compareLink](https://user-images.githubusercontent.com/4729371/236478542-ba7cfdb0-0adb-47ca-8610-87706483491e.png)

Select the “compare across forks” option at the top of this view and then select your named fork from the dropdown list.

![finyYourFork](https://user-images.githubusercontent.com/4729371/236478650-be25abc7-30bc-4075-9f87-c4477b6330b3.png)

Now you should be able to to see the changes between your copy and the main Common Voice repo, which should include only your new .TSV file.

![ChangedFiles](https://user-images.githubusercontent.com/4729371/236478764-ebe1d746-1793-4a7f-af5b-203b89377f66.png)

Press the “create pull request” button. You will now see a form asking for more information about your pull request. Put an X in the field marked “bulk sentence upload and select the “create pull request” button.

![BulkSentenceForm](https://user-images.githubusercontent.com/4729371/236478970-27f5dc47-a6c9-4c81-ab8f-d035360cd4d2.png)

After submitting your pull request, scroll down on the next screen shown and there will be an option to include a message with your pull request.

![PRComment](https://user-images.githubusercontent.com/4729371/236479085-838ccfa6-e812-4cf2-9eef-3ab755de61b9.png)

If you need to include any information about your bulk sentences, you can do this here. If the Common Voice team has any questions about your pull request of bulk sentences, you can also answer them from this interface.
