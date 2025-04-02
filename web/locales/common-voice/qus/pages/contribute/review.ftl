## REVIEW

sc-review-lang-not-selected = Manam ima simitapas akllarqankichu. Ama hina kaspa, <profileLink>Profile</profileLink>niykiman puriy simikunata akllanaykipaq.
sc-review-title = Rimaykunata Qhawapayay
sc-review-loading = Rimaykunata q'ipimuspa...
sc-review-select-language = Ama hina kaspa, huk simita akllay rimaykunata qhawapanaykipaq.
sc-review-no-sentences = Mana rimaykuna kanchu qhawarinapaq. <addLink>Aswan rimaykunata yapaykuy!</addLink>
sc-review-form-prompt =
    .message = Qhawapayasqa rimaykuna mana apachisqachu, hinallachu kanqa?
sc-review-form-usage = Pañaman lluchk'ay chay rimayta waqaychanapaq. Lluq’iman lluchk'ay mana waqaychanapaq. Chayta saqirparinaykipaq wichayman lluchk'ay. <strong>Ama qunqaychu qhawapayasqaykikunata apachiyta!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Qillqa: { $sentenceSource }
sc-review-form-button-reject = Mana niy
sc-review-form-button-skip = Pinkiy
sc-review-form-button-approve = Arí
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = A
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = M
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Chiqanchanakunatapis ñit'iyta atiwaq: { sc-review-form-button-approve-shortcut } Ari niypaq, { sc-review-form-button-reject-shortcut }  Mana niypaq, { sc-review-form-button-skip-shortcut } Saqirpariypaq
sc-review-form-button-submit =
    .submitText = Qhawapayayta Tukuy
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Mana ima rimaykuna qhawapasqa.
        [one] 1 rimay qhawapasqa. Añay!
       *[other] { $sentences } rimaykuna qhawapasqa. Añay!
    }
sc-review-form-review-failure = Qhawapasqayki manam waqaychayta atikurqanchu. Ama hina kaspa, chaymanta wakmanta yanariy.
sc-review-link = Qhawapay

## REVIEW CRITERIA

sc-criteria-modal = Qhawapay Kamachikuna
sc-criteria-title = Qhawapay Kamachikuna
sc-criteria-make-sure = Qhawariypuni sichus kay rimayqa kamachikunata kasun:
sc-criteria-item-1 = Kay rimayqa allin qillqasqapunin kanan.
sc-criteria-item-2 = Kay rimayqa simi kamaymanpuni tupanan.
sc-criteria-item-3 = Kay rimayqa rimanapaq hinapunin kanan.
sc-criteria-item-4 = Sichus kay rimayqa kamachikunawan tupan, pañapi &quot;Ari niy&quot;ta ñit’iy.
sc-criteria-item-5-2 = Sichus kay rimayqa kamachikunawan mana tupanchu, lluq'ipi &quot;Mana niy&quot;ta ñit’iy. Sichus mana yachawaq hinachu kashanman, qan kay rimayta kasqallanta saqirpariwaq, hinaqa huk rimaykunawan tupanki.
sc-criteria-item-6 = Sichus qhawapanaykipaq rimaykuna tukurukun, yanapawayku aswan rimaykunata huñunaykupaq!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Qhawapayay <icon></icon> kay rimayqa simipi rimanapaq allinchu?
sc-review-rules-title = Kay rimayqa kamachikunawan tupanchu?
sc-review-empty-state = Kunititan kay simipi manan rimaykuna kanchu qhawapanapaq.
report-sc-different-language = Wak simi
report-sc-different-language-detail = Kayqa wak simipi qillqasqa kashan, ñuqaq qhawapayasqaysimimanta.
sentences-fetch-error = Huk pantaymi ukhurirqan rimaykunata apamuspa
review-error = Huk pantaymi ukhurirqan kay rimayta qhawapayaspa
review-error-rate-limit-exceeded = Utqayllam rishanki. Ama hina kaspa, susihullawan rimaykunata qhawapayay allin kananta yachanaykipaq.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Hatun imaymanakunata ruwashanchis
sc-redirect-page-subtitle-1 = Rimaykuna Huñuq Common Voice ukhunman astakushan. Kunanqa huk rimayta <writeURL>qillqayta</writeURL> utaq huk apachimusqa qillqayta <reviewURL>qhawapayta</reviewURL> Common Voicepi atiwaq.
sc-redirect-page-subtitle-2 = Tapuykunata <matrixLink>Matrix</matrixLink>pi, <discourseLink>Discourse</discourseLink>pi utaq <emailLink>email</emailLink>pi tapuykuwayku.
# menu item
review-sentences = Rimaykunata Qhawapay
