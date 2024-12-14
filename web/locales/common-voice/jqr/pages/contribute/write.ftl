## WRITE PAGE

write = Qillqaña
write-instruction = Add <icon></icon> a public domain sentence
write-page-subtitle = Sentences contributed here will be added to a publicly available cc-0 licensed dataset.
sentence =
    .label = Arsuña
sentence-input-placeholder = Enter your public domain sentence here
small-batch-sentence-input-placeholder = Enter your public domain sentence here
citation-input-placeholder = Reference the source of your sentence (required)
citation =
    .label = Uñt’ayawi
sc-write-submit-confirm = I confirm that this sentence is <wikipediaLink>public domain</wikipediaLink> and I have permission to upload it.
sc-review-write-title = ¿Kuna aruchjanaksa yapxatasma?
sc-review-small-batch-title = ¿Kunjamatsa walja aruchjanak yapxatasma?
new-sentence-rule-1 = <noCopyright>No copyright</noCopyright> restrictions (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Sapa aruchjax 15 arut juk’ampikiw utji.
new-sentence-rule-3 = Use correct grammar
new-sentence-rule-4 = Use correct spelling and punctuation
new-sentence-rule-5 = Janiw jakhunakas jan ukax yaqha chimpunakas utjkiti
new-sentence-rule-6 = Janiw yaqha qillqanakax utjkiti
new-sentence-rule-7 = Include appropriate citation
new-sentence-rule-8 = Ideally natural and conversational (it should be easy to read the sentence)
login-instruction-multiple-sentences = <loginLink>Login</loginLink> or <loginLink>sign up</loginLink> to add multiple sentences
how-to-cite = Kunjamas nayax cita?
how-to-cite-explanation-bold = URL uñt’ayawimpi jan ukax lurawi phuqhat sutimpi uñt’ayawi.
how-to-cite-explanation = If it’s your own words, just say <italicizedText>“Self Citation”</italicizedText>. We need to know where you found this content so that we can check it is in the public domain and no copyright restrictions apply. For more information about citation see our <guidelinesLink>Guidelines page</guidelinesLink>.
guidelines = Irnaqawi
contact-us = Jiwasanakampi aruskipt’aña
add-sentence-success = 1 apthapit aruchja
add-sentence-error = Pantjasiw aruchja yapxatañataki
required-field = Aka chimpu phuqhachañamawa.
single-sentence-submission = Mä sapa aru uñt’ayaña
small-batch-sentence-submission = Jisk’a t’aqa aruchjanak uñt’ayaña
bulk-sentence-submission = Jach’a arunak uñt’ayaña
single-sentence = Single
small-batch-sentence = Jisk’a t’aqa
bulk-sentence = Jach’a tantachawi
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
sentence-variant-select-multiple-variants = Taqi aru / walja mayjt’awinaka

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Upload <icon></icon> public domain sentences
sc-bulk-upload-instruction = Aka chiqar qillqat apsuñamawa jan ukax <uploadButton>ch’iqt’am apkatañataki</uploadButton>
sc-bulk-upload-instruction-drop = Aka chiqanx mä qillqat jaqukipañaw apkatañataki
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

## SMALL BATCH SUBMISSION

# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Rate limit exceeded. Try again in 1 minute
       *[other] Rate limit exceeded. Try again in { $retryLimit } minutes
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Rate limit exceeded. Try again in 1 second
       *[other] Rate limit exceeded. Try again in { $retryLimit } seconds
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] You have reached the submission limit for this page. Please wait for 1 minute before submitting another sentence. Thank you for your patience!
       *[other] You have reached the submission limit for this page. Please wait for { $retryLimit } minutes before submitting another sentence. Thank you for your patience!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] You have reached the submission limit for this page. Please wait for 1 second before submitting another sentence. Thank you for your patience!
       *[other] You have reached the submission limit for this page. Please wait for { $retryLimit } seconds before submitting another sentence. Thank you for your patience!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } of 1 sentence collected
       *[other] { $uploadedSentences } of { $totalSentences } sentences collected
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } of 1 sentence collected. Click <downloadLink>here</downloadLink> to download rejected sentences.
       *[other] { $uploadedSentences } of { $totalSentences } sentences collected. Click <downloadLink>here</downloadLink> to download rejected sentences.
    }

## MENU ITEM TOOLTIPS

transcribe-audio-menu-item-tooltip = Transcribe audio recordings in your language

## MENU ITEM ARIA LABELS

transcribe-audio-menu-item-aria-label = Transcribe audio recordings into text
