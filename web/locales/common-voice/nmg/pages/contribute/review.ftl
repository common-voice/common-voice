## REVIEW

sc-review-lang-not-selected = Biā pong'le peh kyel dzinih. Nia nga pe <profileLink>numa ye</profileLink> pe peh makyel.
sc-review-title = pyal lwanga-bibang
sc-review-loading = nkwala lwanga bikanga
sc-review-select-language = Bon nga peh kyel pe pyal lwanga- bibang.
sc-review-no-sentences = Ki le be na lwanga-bibang pyal. Bi kuga na <addLink>kwala bilwanga-bibang bifih</addLink>.
sc-review-form-prompt =
    .message = Bilwanga-bibang bi zi pyal biā pong'le lumb'loh
sc-review-form-usage = tsinda mbwo magyal pe miāle lwanga-bibang. Tsinda mbwo magywum pe bina. Tsinda pe bvuo pe sa mpbi sa yā nyina le. <strong>ki nga wusa lumb'le mam bi zi tsendi !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Pe nlong vu : { $sentenceSource }
sc-review-form-button-reject = Bina
sc-review-form-button-skip = Gye
sc-review-form-button-approve = Miāle
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = G
sc-review-form-keyboard-usage-custom = bi kuga na biala na bitsil manzi pe lwanga matwen : { sc-review-form-button-approve-shortcut } pe miāle, { sc-review-form-button-reject-shortcut } pe bina, { sc-review-form-button-skip-shortcut } pe gye
sc-review-form-button-submit =
    .submitText = Sil mpyala
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] [0] ki be na lwanga-bibang zi pialoh.
        [one] [1] Lwanga-bibang vur mpialoh. Awa !
       *[other] { $sentences } Lwanga-bibang mpialoh. Awa !
    }
sc-review-form-review-failure = mpyala nwa pong'le miāloh. Bong nga na kiē pil' nfih.
sc-review-link = Bāla

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Minwuma pe bāla na
sc-criteria-title = Minwuma pe bāla na
sc-criteria-make-sure = Numa nga pyal nah lwanga-bibang lundelele minwuma mina:
sc-criteria-item-1 = Lwanga-bibang ywia na tsiloh mpba
sc-criteria-item-2 = bibang bi lwanga-bibang bi ywia na be ntela mpbeh
sc-criteria-item-3 = Vi ywia na kuga pag lwanga-bibang
sc-criteria-item-4 = Ka lwanga bibang lundele minwuma, myama twen « Miāle » mbwo magyal.
sc-criteria-item-5-2 = Ka lwanga-bibang yā lundele le minwuma mi yi pe bvuo, myama twen « Mia » mbwo magywum. Ka bi yi na mashuna, bikuga yā na gye na lang lwanga-bibang yi shuoē.
sc-criteria-item-6 = Ka biā bele na na lwanga bibang pyal, kwela nga vi pe pale na pwā bilwanga-bibang !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = pyala nga <icon></icon> na lwanga-bibang tel mpba mpbi sikul ngiga makyel dzih
sc-review-rules-title = Lwanga-bibang na sal ywe ywia ne sa bi yi sa vur?
sc-review-empty-state = Lwanga bibang dzinih pyal yā bele kyel gina wula gina ri
report-sc-different-language = kyel' fih
report-sc-different-language-detail = Lwanga-bibang ye yi ntsila kyel' fih ri. Kāle kyel me zih lang
sentences-fetch-error = mbvinda mpan' wula fang lwanga-bibang
review-error = mbvinda mpan lin' me bāla na pyal lwanga-bibang
review-error-rate-limit-exceeded = Bi baleh nga ke npfunde. Bong nga nung pil' pe bāla lang lwanga-bibang na numa pyal ka bi yi ntsila mpbeh.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Vi mua tsendi puā mam.
sc-redirect-page-subtitle-1 = mpale bilwanga-bibang ñe nlumb'loh ma pe pinde-si ma Common Voice. Bi kuga djihri na <writeURL>tsile</writeURL> lwanga-bibang to nah <reviewURL>pyal</reviewURL> bilwanga-bibang bi yi bo Common Voice.
sc-redirect-page-subtitle-2 = djiaga botsia bin' bo <matrixLink>Matrix</matrixLink>, <discourseLink>Nunga-bang</discourseLink> to nah <emailLink>na ngobo bikalar bi nsyang</emailLink>.
# menu item
review-sentences = Pyal bilwanga-bibang.
