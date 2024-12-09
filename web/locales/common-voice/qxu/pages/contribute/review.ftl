## REVIEW

sc-review-lang-not-selected = Manam ima simitapas akllarqankichu. Ama hina kaspa, <profileLink>Perfil</profileLink> nisqaman riy simikunata akllanaykipaq.
sc-review-title = Rimaykunata qawariy
sc-review-loading = Simikunata apamuspa...
sc-review-select-language = Ama hina kaspa, huk simita akllay rimaykunata qhawarinaykipaq.
sc-review-no-sentences = Mana rimaykuna kanchu qhawarinapaq. <addLink>Kunanqa aswan rimaykunata yapay!</addLink>
sc-review-form-prompt =
    .message = Kutin rikusqa rimaykuna mana apachisqachu, chiqachu kanki?
sc-review-form-usage = Pañaman llalliy chay rimayta chiqakanaykipaq. Lluq’iman llalliy mana chaskinaykipaq. Chayta saqinaykipaqqa wichayman llalliy. <strong>Ama qunqaychu yuyayniyki apachiyta!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Pukyu: { $sentenceSource }
sc-review-form-button-reject = Karunchay
sc-review-form-button-skip = Saqiy
sc-review-form-button-approve = Ariniy
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = A
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = M
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Llaqta ñankunatapas llamk'achiy atikunki: { sc-review-form-button-approve-shortcut } Arinipaq, { sc-review-form-button-reject-shortcut }  Karunchapaq, { sc-review-form-button-skip-shortcut } Saqipaq
sc-review-form-button-submit =
    .submitText = Qhawaspaq tukuna
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] mana rimaykuna qhawarisqa.
        [one] 1 rimayta qhawarisqa. Riqsikuyki!
       *[other] { $sentences } rimaytakuna qhawarisqa. Riqsikuyki!
    }
sc-review-form-review-failure = Qhawarisqa nisqataqa manam waqaychayta atirqakuchu. Ama hina kaspa, qhipaman hukmanta kallpachakuy.
sc-review-link = Kutipay

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kamachiykunata qhaway
sc-criteria-title = Kamachiykunata qhaway
sc-criteria-make-sure = Chay rimayqa kay kamachiykuna hunt’asqanmanta qhawariy:
sc-criteria-item-1 = Chay rimayqa allintam qillqasqa kanan.
sc-criteria-item-2 = Chay rimayqa kamachisqa simi allin kanan.
sc-criteria-item-3 = Chay rimayqa rimanapaq hinam kanan.
sc-criteria-item-4 = Sichus rimay kamachiykunawan tupan chayqa, &quot;Uyakuy&quot; pañapi ñit’inata.
sc-criteria-item-5-2 = Sichus rimay kamachiykunawan tupan mana chayqa, &quot;Sichus rimay kamachiykunawan tupan chayqa, &quot;Karunchay&quot; lluqipi ñit’inata. Sichus mana chiqachu kanki chay rimaymanta chayqa, saqispataq qatiqninman riwaq.
sc-criteria-item-6 = Sichus qhawarinaykipaq rimaykuna tukukun chayqa, yanapawayku aswan rimaykunata huñunaykipaq!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = <icon></icon> nisqapi qhaway kay rimayqa simipi allinchu?
sc-review-rules-title = Chay rimayqa kamachikuykunaman hinachu tupan?
sc-review-empty-state = Kunan pachaqa manan kay simipi rimanapaq rimaykuna kanchu.
report-sc-different-language = Huk simi
report-sc-different-language-detail = Chayqa qillqasqa kachkan hukniray simipi, qhawarisqaymanta.
sentences-fetch-error = Huk pantaymi karqan rimaykunata apamuspa
review-error = Kay rimayta qhawarispa pantaymi karqan
review-error-rate-limit-exceeded = Llumpay utqayllam richkanki. Ama hina kaspa, huk asniqlla rimayta qhaway, allin kasqanmanta yachanaykipaq.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Wakin hatun tukuchipakunata ruwachkayku
sc-redirect-page-subtitle-1 = Sentence Collector runaqa Common Voice kuyuchkan. Kunanqa <writeURL>qillqayta</writeURL> huk rimayta icha <reviewURL>qhaway</reviewURL> huklla rimay kachasqakunata Common Voice atikunki.
sc-redirect-page-subtitle-2 = Chaykunamanta tapuwayku <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> utaq <emailLink>email</emailLink>.
# menu item
review-sentences = Rimaykunata qawariy
