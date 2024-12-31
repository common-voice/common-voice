## REVIEW

sc-review-lang-not-selected = maa baaṣṅ damśi ayetaa. khole profile ar namaa baaṣṅ damśi etin
sc-review-title = jumlan hik dame daa barenin
sc-review-loading = jumlan load mey bican
sc-review-select-language = baaṣ damśi netanin jumlan hik ḍame daa barenin
sc-review-no-sentences = hik ḍame daa bareyar han ke jumlan api
sc-review-form-prompt =
    .message = dubara barenum jumlan jama api, chane seybaa?
sc-review-form-usage = jumla approve ecar doẏpa swipe etin or reject ecar gaẏpa swipe etin.  skip ećar yatne swipe etin. maimo review jama etas til amaalin
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = birkiṣ
sc-review-form-button-reject = reject etas
sc-review-form-button-skip = phat etin
sc-review-form-button-approve = maan etas
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = keyboard e shortcuts istimaal etas maamay baan. maan etasar, reject etasar daa skip etasar
sc-review-form-button-submit =
    .submitText = hik ḍame daa  barenas phaṣ manimi
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] han ke jumlaan hik ke barenum api
        [one] han jumlaan hik ke barena. juu goor
       *[other] jumlan hik be barenan. juu maar
    }
sc-review-form-review-failure = daa barenum ike save oomanican, hik ke kośiś etin.
sc-review-link = hik ḍame daa barenas

## REVIEW CRITERIA

sc-criteria-modal = hik ke barenase criteria
sc-criteria-title = hik ḍame daa barenase criteria
sc-criteria-make-sure = barenin ke jumlane yaare mićim ite criteria juwan maniṣ
sc-criteria-item-1 = jumlane spelling sahi maniṣ
sc-criteria-item-2 = jumlan grammatically sahi maniṣ
sc-criteria-item-3 = jumlan senaso maniṣ
sc-criteria-item-4 = jumla criteria juwan manimi ke doẏpamo button approve eti
sc-criteria-item-5-2 = agar jumlaane yatum ite criteria ate api ke ġaẏpamo ise button click netan reject etin. yaqeen api ke skip netan iciyatum iteeṭar niin
sc-criteria-item-6 = jumlan hik ke bareyar phaṣ manimi ke, daa jumlan gaṭi etas gane miriin ce duunin
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = barenin gute baaṣate duro etaśue hisaab cum  sahi jumla bila?
sc-review-rules-title = guta jumla mesum ttariqan ce yom bila?
sc-review-empty-state = gute baaṣulo hik ke bareyar han ke jumlaan api
report-sc-different-language = tʰum baaṣan
report-sc-different-language-detail = jaa hik ke barenas ite cum khot tʰum baaṣanulo girminum bila
sentences-fetch-error = jumlan suwasulo besan ṭʰisan manimi
review-error = jumlan hik ke barenasulo besan ṭʰisan manimi
review-error-rate-limit-exceeded = un but himat ećaa. hik cat numa jumlaar hik ke baren daa jumlaa sahi bicum maniṣ
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = mi uyoṅko tabdiiliminik ećabaan
sc-redirect-page-subtitle-1 = jumlan gaṭi etas ine core common voice e platform atar nićay. maa muu jumlaan girminin yaa jumlaar hik ke barenin. common voice ar han jumlaan jama etin
sc-redirect-page-subtitle-2 = matrix, discourse yaa email ate mima cum duġarusin
# menu item
review-sentences = jumlan hik dame daa barenin
