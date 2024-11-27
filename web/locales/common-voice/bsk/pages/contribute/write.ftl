## WRITE PAGE

write = girmin
write-instruction = awaami domain e jumlaan
write-page-subtitle = meer emasumin jumlan khole auyoonar uyayas licensed dataset ulo jama meeymi
sentence =
    .label = jumlaan
sentence-input-placeholder = maymo public domain e jumla khole biśa
small-batch-sentence-input-placeholder = maymo public domain e jumlan khole giin
citation-input-placeholder = maymo jumla diim diśe yaa sise iyik awaaji
citation =
    .label = citation
sc-write-submit-confirm = gute jumla upload etas jaa le izin bila daa gute jumla public domain cum bila nuse jaa confirm eća baa
sc-review-write-title = amik jumlan kaa etas aamaya baa
sc-review-small-batch-title = har raxte jumlan belate kaa ećan
new-sentence-rule-1 = izin api daa bandiśing
new-sentence-rule-2 = har jumlaanulo turma cʰundo cum kam lafzine
new-sentence-rule-3 = sahi grammar istimaal etin
new-sentence-rule-4 = sahi spelling ke punctuaion ismtiaal etin
new-sentence-rule-5 = icʰanasiṅ ke khaas charaters bee
new-sentence-rule-6 = hulom harupuc bee
new-sentence-rule-7 = dumaaẏas citation kaa etin
new-sentence-rule-8 = jumla ġatanas asaan maniṣ
login-instruction-multiple-sentences = login yaa sign up etin har raxte jumlan kaa ećar
how-to-cite = belate cite ećam?
how-to-cite-explanation-bold = URL link kaa cite etin yaa tok duruwe iyk kaa
how-to-cite-explanation = agar guymo lafzin bican ke bas sen [self citation]. mimar leel maniṣ ke gute content amulum guyabaa taaki mi bareyan ke gute public domain ulo bila daa gute ṭe besan ke paabandi api nuse. daa citation e maalumaate gane mii citation e guidelink patuwar barenin
guidelines = duro meertirasin
contact-us = micimo duġarusin
add-sentence-success = han jumlan jama manimi
add-sentence-error = jumlan kaa etasulo ġaltimin
required-field = ġute field fill out etin
single-sentence-submission = han jumlan jama manaas
small-batch-sentence-submission = jumlan e jotin batch
bulk-sentence-submission = butan jumlan e jama manaas
single-sentence = hanuman''
small-batch-sentence = jot batchan
bulk-sentence = uyum batchan
sentence-domain-combobox-label = jumla domain
sentence-domain-select-placeholder = usko domain in damśyi eti
# Sentence Domain dropdown option
agriculture_food = mal basiye duro daa ṣiyas minaas
# Sentence Domain dropdown option
automotive_transport = gaadenc daa transport
# Sentence Domain dropdown option
finance = biḍiro e duroin
# Sentence Domain dropdown option
service_retail = xidmat etas daa gaṣ giran
# Sentence Domain dropdown option
general = aam xaas
# Sentence Domain dropdown option
healthcare = midimar śan
# Sentence Domain dropdown option
history_law_government = nim kʰeen, qaanuun daa hukumat
# Sentence Domain dropdown option
language_fundamentals = baaṣ inaaẏ maslan digits, huruupuc, bidiro
# Sentence Domain dropdown option
media_entertainment = media daa śuġuliṅ
# Sentence Domain dropdown option
nature_environment = fitrat daa mahool
# Sentence Domain dropdown option
news_current_affairs = xabarin daa saati khultum taxpan
# Sentence Domain dropdown option
technology_robotics = technology daa robotics
sentence-variant-select-label = jumla variant
sentence-variant-select-placeholder = variant damśi etin
sentence-variant-select-multiple-variants = aam baaṣ/butan variants

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = awaami domain e jumlan upload etin
sc-bulk-upload-instruction = khole maymo file drag etin yaa upload ećar click etin
sc-bulk-upload-instruction-drop = khole uploadar file drop etin
bulk-upload-additional-information = agar gute file ate daa malumat mićiyas e ray bila ke, rabita ećar commonvoice@mozillac̣om
template-file-additional-information = agar gute file ate maziit malumat amit template ulo api ke ite mićiyas e ray bila ke, rabita ećar commonvoice@mozillac̣om
try-upload-again = khole hik ke file drag ne koośiś etin
try-upload-again-md = hik ke upload etase koośiś eti
select-file = file isalginin
select-file-mobile = upload ećar file isalgin
accepted-files = file mazoor etas type: sirf tvs
minimum-sentences = maximum jumlan file ulo: 1000
maximum-file-size = maximum file size: 25 MB
what-needs-to-be-in-file = besan jaa fileulo maniṣ?
what-needs-to-be-in-file-explanation = mii template file check etin. maa jumlan copyright free maniṣ yaa duro etum ine iimo duro e ijazat maniṣ.  maa jumlan clear, sahi grammar daa ġatayar asaan maniṣ. jama etum jumlan ġatanasulo tormi yaa turma cʰindi minute niṣ daa ulo lambarin, uyikićiṇ kee xaas characters omaniṣan
upload-progress-text = upload meeyme bila
sc-bulk-submit-confirm = guke jumlan upload etas jaa le izin bila daa guke jumlan public domain cum bila nuse jaa confirm eća baa
bulk-upload-success-toast = butan jumlan upload etin
bulk-upload-failed-toast = upload e duro ayetimi hik ke kośiś etin
bulk-submission-success-header = butan juu maar butan subission emasas gane
bulk-submission-success-subheader = butan juu maar common voice e gunculo jumlan maqsad ulo kamyaab etas gane
upload-more-btn-text = maziid jumlan upload etin
file-invalid-type = khot duruwe file api
file-too-large = file but uyum bila
file-too-small = file but jot bila
too-many-files = juda butan failin

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = butan public domain e jumlan kaa etin
multiple-sentences-error = han single submission ulo butan jumlan kaa etas amaamay baan
exceeds-small-batch-limit-error = hik hazzr jumlan cum but jama etas amaamay baan
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] rate limit butan manimi, han minute ulop hik ke kośi,
       *[other] rate limit butan manimi, han minutes in ulop hik ke kośiś etin
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] rate limit butan manimi, han second an ulop hik ke kośiś etin
       *[other] rate limit butan manimi seconds in ulop hik ke kośiś etin
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] gute page ate ma maymo  hat phaṣ manila. han ke jumlan kaa etase gane han minute an cat maneyin. maa cat manaase mamar butan juu
       *[other] gute page ate ma maymo  hat phaṣ manila. han ke jumlan kaa etase gane han minutes in cat maneyin. maa cat manaase mamar butan juu
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] gute page ate ma maymo  hat phaṣ manila. han ke jumlan kaa etase gane han minute an cat maneyin. maa cat manaase mamar butan juu
       *[other] gute page ate ma maymo  hat phaṣ manila. han ke jumlan kaa etase gane han minutes in cat maneyin. maa cat manaase mamar butan juu
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] han jumlan jama manimi
       *[other] jumlan jama manimi
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] ite han jumlaan gati manimi. kʰole reject manum jumla download etin
       *[other] ike jumlan gati manimi. khole reject manum jumlan downlad etin
    }
small-batch-sentences-rule-1 = guidelines e form ici tayin "amik jumlan kaa etas aamayaba?
small-batch-sentences-rule-2 = han jumlan har line ulo kaa etin
small-batch-sentences-rule-3 = "Enter" press netan jumlan han line ulo alak etin yaa "Return" hik
small-batch-sentences-rule-4 = 1000 jumlan kaa etin
small-batch-sentences-rule-5 = uyon jumlan e han domain maniṣ
small-batch-sentences-rule-6 = uyon jumlan e han citation maniṣ
# menu item
add-sentences = jumlan kaa etin

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = jumlan kaa daa review etin, sawaalin kaa etin, audio transcrbe etin
add-sentences-menu-item-tooltip = maymo baaṣulo jumlan kaa etin
review-sentences-menu-item-tooltip = maymo baaṣulo jumlan review etin
add-questions-menu-item-tooltip = maymo baaṣulo sawaalin kaa etin
transcribe-audio-menu-item-tooltip = maymo baaṣulo audio recordings transcribe etin

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = girmin options menu
add-sentences-menu-item-aria-label = miimo sise ġatanas e gane tʰuwaan jumlan kaa etin
review-sentences-menu-item-aria-label = mimo sise jama etum jumlanar hik ke barenin
add-questions-menu-item-aria-label = miymo sisar ġatayar daa juwaap ućʰićar naya sawaalin jama etin
transcribe-audio-menu-item-aria-label = maymo baaṣulo audio recordings transcribe etin
