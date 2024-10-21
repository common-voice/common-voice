## WRITE PAGE

write = Write
write-instruction = Add <icon></icon> a public domain sentence
write-page-subtitle = Sentences contributed here will be added to a publicly available cc-0 licensed dataset.
sentence =
    .label = Sentence
sentence-input-placeholder = Enter your public domain sentence here
small-batch-sentence-input-placeholder = Enter your public domain sentences here
citation-input-placeholder = Reference the source of your sentence (required)
citation =
    .label = Citation
sc-write-submit-confirm = I confirm that this sentence is <wikipediaLink>public domain</wikipediaLink> and I have permission to upload it.
sc-review-write-title = What sentences can I add?
sc-review-small-batch-title = How to add multiple sentences
new-sentence-rule-1 = <noCopyright>No copyright</noCopyright> restrictions (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Fewer than 15 words per sentence
new-sentence-rule-3 = Use correct grammar
new-sentence-rule-4 = Use correct spelling and punctuation
new-sentence-rule-5 = No numbers and special characters
new-sentence-rule-6 = No foreign letters
new-sentence-rule-7 = Include appropriate citation
new-sentence-rule-8 = Ideally natural and conversational (it should be easy to read the sentence)
login-instruction-multiple-sentences = <loginLink>Login</loginLink> or <loginLink>sign up</loginLink> to add multiple sentences
how-to-cite = How do I cite?
how-to-cite-explanation-bold = Cite with a URL link or the full name of the work.
how-to-cite-explanation = If it’s your own words, just say <italicizedText>“Self Citation”</italicizedText>. We need to know where you found this content so that we can check it is in the public domain and no copyright restrictions apply. For more information about citation see our <guidelinesLink>Guidelines page</guidelinesLink>.
guidelines = Guidelines
contact-us = Contact Us
add-sentence-success = 1 sentence collected
add-sentence-error = Error adding sentence
required-field = Please fill out this field.
single-sentence-submission = Single sentence submission
small-batch-sentence-submission = Small batch sentence submission
bulk-sentence-submission = Large bulk sentence submission
single-sentence = Single
small-batch-sentence = Small batch
bulk-sentence = Bulk batch
sentence-domain-combobox-label = Sentence Domain
sentence-domain-select-placeholder = Select up to three domains (optional)
# Sentence Domain dropdown option
agriculture_food = Agriculture and Food
# Sentence Domain dropdown option
automotive_transport = Automotive and Transport
# Sentence Domain dropdown option
finance = Finance
# Sentence Domain dropdown option
service_retail = Service and Retail
# Sentence Domain dropdown option
general = General
# Sentence Domain dropdown option
healthcare = Healthcare
# Sentence Domain dropdown option
history_law_government = History, Law and Government
# Sentence Domain dropdown option
language_fundamentals = Language Fundamentals (e.g. Digits, Letters, Money)
# Sentence Domain dropdown option
media_entertainment = Media and Entertainment
# Sentence Domain dropdown option
nature_environment = Nature and Environment
# Sentence Domain dropdown option
news_current_affairs = News and Current Affairs
# Sentence Domain dropdown option
technology_robotics = Technology and Robotics
sentence-variant-select-label = Sentence Variant
sentence-variant-select-placeholder = Select a variant (optional)
sentence-variant-select-multiple-variants = General language / multiple variants

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Upload <icon></icon> public domain sentences
sc-bulk-upload-instruction = Drag your file here or <uploadButton>click to upload</uploadButton>
sc-bulk-upload-instruction-drop = Drop file here to upload
bulk-upload-additional-information = If there is additional information you want to provide about this file, please contact <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = If there is additional information you want to provide about this file that is not included in the template, please contact <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Try again by dragging your file here
try-upload-again-md = Try uploading again
select-file = Select File
select-file-mobile = Select File to Upload
accepted-files = Accepted file types: .tsv only
minimum-sentences = Minimum sentences in file: 1000
maximum-file-size = Maximum file size: 25 MB
what-needs-to-be-in-file = What needs to be in my file?
what-needs-to-be-in-file-explanation = Please check our <templateFileLink>template file</templateFileLink>. Your sentences should be copyright free (CC0 or permissioned original work by the submitter) and be clear, grammatically correct and easy to read. Submitted sentences should take roughly 10-15 seconds to read and should avoid including numbers, proper nouns and special characters.
upload-progress-text = Upload in progress...
sc-bulk-submit-confirm = I confirm that these sentence are <wikipediaLink>public domain</wikipediaLink> and I have permission to upload them.
bulk-upload-success-toast = Bulk Sentences Uploaded
bulk-upload-failed-toast = Upload failed, please retry.
bulk-submission-success-header = Thank you for contributing your bulk submission!
bulk-submission-success-subheader = You're helping Common Voice reach our daily sentence goals!
upload-more-btn-text = Upload more sentences?
file-invalid-type = Invalid file
file-too-large = File is too large
file-too-small = File is too small
too-many-files = Too many files

## SMALL BATCH SUBMISSION
# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Add multiple public domain sentences
multiple-sentences-error = You cannot add multiple sentences for a single submission
exceeds-small-batch-limit-error = Cannot submit more than 1000 sentences
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes = 
    Rate limit exceeded. Try again in {$retryLimit -> 
        [one] 1 minute
        *[other] {$retryLimit} minutes
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds = 
    Rate limit exceeded. Try again in {$retryLimit -> 
        [one] 1 second
        *[other] {$retryLimit} seconds
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes = 
    You have reached the submission limit for this page. Please wait for {$retryLimit -> 
        [one] 1 minute
        *[other] {$retryLimit} minutes
    } before submitting another sentence. Thank you for your patience!
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds = 
    You have reached the submission limit for this page. Please wait for {$retryLimit -> 
        [one] 1 second
        *[other] {$retryLimit} seconds
    } before submitting another sentence. Thank you for your patience!
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    {$uploadedSentences} {$totalSentences -> 
        [one] of 1 sentence collected
        *[other] of {$totalSentences} sentences collected
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message = 
    {$uploadedSentences} {$totalSentences -> 
        [one] of 1 sentence collected
        *[other] of {$totalSentences} sentences collected
    }. Click <downloadLink>here</downloadLink> to download rejected sentences.
small-batch-sentences-rule-1 = Follow guidelines from “What sentences can I add?”
small-batch-sentences-rule-2 = Add one sentence per line
small-batch-sentences-rule-3 = Separate sentences into one line by pressing “Enter” or “Return” once
small-batch-sentences-rule-4 = Add up to 1,000 sentences
small-batch-sentences-rule-5 = All sentence must have the same domain
small-batch-sentences-rule-6 = All sentences must have the same citation

# menu item
add-sentences = Add Sentences

## MENU ITEM TOOLTIPS
write-contribute-menu-tooltip = Add and Review Sentences, Add Questions, Transcribe Audio
add-sentences-menu-item-tooltip = Add sentences in your language
review-sentences-menu-item-tooltip = Review sentences in your language
add-questions-menu-item-tooltip = Add questions in your language
transcribe-audio-menu-item-tooltip = Transcribe audio recordings in your language

## MENU ITEM ARIA LABELS
write-contribute-menu-aria-label = Write options menu
add-sentences-menu-item-aria-label = Add new sentences for the community to read
review-sentences-menu-item-aria-label = Review existing sentences submitted by the community
add-questions-menu-item-aria-label = Submit new questions for the community to read and respond to
transcribe-audio-menu-item-aria-label = Transcribe audio recordings into text
