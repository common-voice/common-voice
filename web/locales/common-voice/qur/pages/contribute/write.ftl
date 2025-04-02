## WRITE PAGE

write = Qillqay
write-instruction = Add <icon></icon> a public domain sentence
write-page-subtitle = Kaychu rurashqa rimaykunakaq ricenciayuqmi achaka shutikuna churaqman yapashqa  cc-0 llapanpaq rikaykunan.
sentence =
    .label = Rimaykaq
sentence-input-placeholder = Enter your public domain sentence here
small-batch-sentence-input-placeholder = Enter your public domain sentence here
citation-input-placeholder = Rimaykaq maypiqta hamuhqanta yapaykuy (rurana)
citation =
    .label = Qayachiy
sc-write-submit-confirm = Aw niimi kay rimaykaq kashqanta <wikipediaLink>llapanpaq rimashqan</wikipediaLink> awnishqam churaykamunaapaq.
sc-review-write-title = ¿Ima rimaykunata yapaykuuman?
sc-review-small-batch-title = How to add multiple sentences
new-sentence-rule-1 = <noCopyright>No copyright</noCopyright> restrictions (<cc0>cc-0</cc0>)
new-sentence-rule-2 = 15 qillqaykunakamalla.
new-sentence-rule-3 = Allin shimi kamachiqwanmi qillqan
new-sentence-rule-4 = Allin qillqay aypuqkunawan qillqay.
new-sentence-rule-5 = Ama yupaykuna ama hukniraq qillqaykunawan
new-sentence-rule-6 = Ama hukraw malkakunapa qillqayninkunawan
new-sentence-rule-7 = Allinlla riqsiqwan
new-sentence-rule-8 = Allinlla rimanakushqallawan (Yalpupashlla ñawinchana)
login-instruction-multiple-sentences = <loginLink>Login</loginLink> or <loginLink>sign up</loginLink> to add multiple sentences
how-to-cite = ¿Imanuupam riqsichiy?
how-to-cite-explanation-bold = Huk URLwan riqsichiy uutak qillqa maytupa hutinwan.
how-to-cite-explanation = Kikiykipa rimayniyki kaptinqa, niykuy <italicizedText>“Kikii”</italicizedText>. Kay willakuyta maychu tarihqayta yachanam llapa nunakuna rimahqanta yachanapaq duyñun mana amatananpaq. riqsichikuqpiqta ashwan yachanapaq, tapukamuy <guidelinesLink>kamachikuy rapita</guidelinesLink>.
guidelines = Rikuchinakuna
contact-us = Qayakamuy
add-sentence-success = 1 pallahqa rimay
add-sentence-error = Rimayta yapahqanchu pantapakuq
required-field = Kay haakuqta huntachiy.
single-sentence-submission = Huk rimayllata apachiy
small-batch-sentence-submission = Small batch sentence submission
bulk-sentence-submission = Large bulk sentence submission
single-sentence = Hukllay
small-batch-sentence = Small batch
bulk-sentence = Bulk batch
sentence-domain-combobox-label = Sentence Domain
sentence-domain-select-placeholder = Select up to three domains (optional)
# Sentence Domain dropdown option
agriculture_food = Chakratalpuy mikuykuna
# Sentence Domain dropdown option
automotive_transport = Automotive and Transport
# Sentence Domain dropdown option
finance = Qillay
# Sentence Domain dropdown option
service_retail = Service and Retail
# Sentence Domain dropdown option
general = Llapan
# Sentence Domain dropdown option
healthcare = Allinkay
# Sentence Domain dropdown option
history_law_government = History, Law and Government
# Sentence Domain dropdown option
language_fundamentals = Rimaypa sapin (p.ej. yupaykuna, qillqay, qillay)
# Sentence Domain dropdown option
media_entertainment = Willaqkuna hamachiqkuna
# Sentence Domain dropdown option
nature_environment = Pachamama muyuriqninwan
# Sentence Domain dropdown option
news_current_affairs = Willakuqkuna kanan kaqkuna
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
minimum-sentences = Kaychikam rimaykuna maytuchu kanan: 1000
maximum-file-size = Kay chayaymi maytukaq kanan: 25 MB
what-needs-to-be-in-file = ¿Imam kikiykipa maytuuchu kanan?
what-needs-to-be-in-file-explanation = Tapukamuy <templateFileLink>kamaqpa maytun</templateFileLink>. Mana derecho de autor nishayuqmi rimayniykikuna kapaakunan (CC0 uutak apachimuqkaqpa kikin rurashqan) chuyalla, allin aypushqan yalpupashlla ñawinchana. Apachimushqa rimaykunakaq 10piqta 15kama segundulla ñawinchanan kapaakunan mana yupayniyuqkama, mana shutichashqa mana hukniraq qillqayniyuq.
upload-progress-text = Qishpichkan ...
sc-bulk-submit-confirm = Aw niyaami kay rimaykuna kashqanta <wikipediaLink>llapanpaq rimashqan</wikipediaLink> aw nishqam qishpichinapaq.
bulk-upload-success-toast = Bulk Sentences Uploaded
bulk-upload-failed-toast = Upload failed, please retry.
bulk-submission-success-header = Thank you for contributing your bulk submission!
bulk-submission-success-subheader = You're helping Common Voice reach our daily sentence goals!
upload-more-btn-text = Upload more sentences?
file-invalid-type = Manantiyashqa maytu
file-too-large = Llumpay hatunmi maytukaq
file-too-small = Llumpay uchukmi maytukaq
too-many-files = Llumpay achka maytukunam

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = Yapay <icon></icon> achka llapanpaq rimashqan rimaykuna
multiple-sentences-error = Manam uchuklla atichikuqchu achka rimaykunata apachiyta atipanchikchu.
exceeds-small-batch-limit-error = Manam 1000 rimaykunapiqta masta apachiyta atipanchikchu
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
small-batch-sentences-rule-1 = Kamachiykunata ruray “¿Ima rimaykunatam yapaykuuman?”
small-batch-sentences-rule-2 = Huk wachiman huk rimayta yapay
small-batch-sentences-rule-3 = Rimaykunata huk wachimankam rakiy, hukhuklla wachi pachkaykuykama.
small-batch-sentences-rule-4 = 1000 rimaykuykama yapay
small-batch-sentences-rule-5 = Hukllay shuntuyllachuumi llapa rimaykuna kamaykunan
small-batch-sentences-rule-6 = Llapa rimaykuna huk chayayniyuqlla riqsiyniyuqlla kapaakunan
# menu item
add-sentences = Rimaykunata yapay

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Rimaykunata yapaykuy rikapaykuy, tapuykunata yapaykuy, uyarinakunata qillqaykuy
add-sentences-menu-item-tooltip = Shimiykichu rimaykunata yapay
review-sentences-menu-item-tooltip = Shimiykichu rimaykunata rikapaykuy
add-questions-menu-item-tooltip = Shimiykichu rimaykunata yapaykuy
transcribe-audio-menu-item-tooltip = Shimiykichu uyarinapaq kaqkunata qillqaykuy

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = Qillqaykunapaq kaqkuna
add-sentences-menu-item-aria-label = Llapa huntunaku rimaykunata ñawinchapaakunanpaq yapay
review-sentences-menu-item-aria-label = Shuntunakuq rimaykunata mañakushqanta rikapaykuy
add-questions-menu-item-aria-label = Muhuq tapuykunata apachiy huntunaku ñawinchananpaq kutichinanpaq
transcribe-audio-menu-item-aria-label = Uyarinapaq kaqkunata qillqay
