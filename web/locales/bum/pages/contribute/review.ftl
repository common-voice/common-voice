## REVIEW

sc-review-lang-not-selected = Ô njeki tob ngumba nkobô eziñ. Nyi'in e <profileLink>éve'ela jôél</profileLink>asuya na ô tob minkobô.
sc-review-title = Fombô'ô medjô
sc-review-loading = Nnotan medjô…
sc-review-select-language = Tobô'ô nkobô asuya na ô fombô'ô medjô
sc-review-no-sentences = Teke'e adjô éziñ yaa fombô. Ô ne ngul ya <addLink>ba'a medjô mefe</addLink>.
sc-review-form-prompt =
    .message = Medjô wo ke fombô me mane ya lômban, ye wo yi na wo ke ôsu?
sc-review-form-usage = Sendé'e mfa'a ya mbongal asuya na ô kañese adjô.Sendé'e mfa'a ya mbonnôm asuya na ô ben de. Sendé'e mfa'a ya yôb asuya na ô dimin de.<strong> Te wo vuan lôm biyalan ya mba'alan wôe!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Vôm:{ $sentenceSource }
sc-review-form-button-reject = E ben
sc-review-form-button-skip = Elot
sc-review-form-button-approve = E kañese
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Ô ne fe belan bityun bizen ya abam bikan ya nsini: { sc-review-form-button-approve-shortcut } asu nkañesan, { sc-review-form-button-reject-shortcut } asu mbenan, { sc-review-form-button-skip-shortcut } asu nlôtan
sc-review-form-button-submit =
    .submitText = E mane e mfomban
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Teke adjô éziñ é ne mfomban.
        [one] Adjô da é ne mfomban. Akiba !
       *[other] Mimfoban medjô. Akiba !
    }
sc-review-form-review-failure = Mfoban ô se kui na wo naneban. Beta ve'ele e den.
sc-review-link = Mwômesan

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Memvéndé asu mwômesan
sc-criteria-title = Memvéndé asu mwômesan
sc-criteria-make-sure = Yemela'an nge adjô d'a semen memvende ma:
sc-criteria-item-1 = Adjô d'a yian tiliban aval memvende m'otil m'a liti.
sc-criteria-item-2 = Adjo d'a yian tiliban aval metiñ ya nkobô m'a liti.
sc-criteria-item-3 = Adjô d'a yian bô aval môt a ne tot.
sc-criteria-item-4 = Nge adjô d'a semen memvende, miate'e e « Akañesan » e mbonnôm.
sc-criteria-item-5-2 = Nge adjô d'a semen ki memvende ya yôp ma,miate'e e « Mbenan » e mbongal. Nge ô too ki ndji, ô ne fe dé dañ aa ke e dji d'a tôé.
sc-criteria-item-6 = Nge wo bili ki fe medjô ô ne fombô, volô'ô bia ve medjô mefe!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Fombô'ô <icon></icon> nge adjô é ne aval d'a yian mfa'a ya mfasan minkobô
sc-review-rules-title = Ye adjô é ne aval d'a yian?
sc-review-empty-state = Teke'e adjô éziñ yaa fombô éyoñeji nkobô ôte.
report-sc-different-language = Nkobô ofe
report-sc-different-language-detail = Adjô é ne ntilian nkobô ôfe ô sela'an ewu m'a lañ.
sentences-fetch-error = Evus dja ke yene eyoñ nyoñan medjô wo ke booban
review-error = Evus dja ke yene eyoñ mfomba adjô dji wo ke booban
review-error-rate-limit-exceeded = Wo dañ ke avôl. Nyoñe éyoñ na ô beta lañ adjô aa tyu'a yemelan nge é ne mvo'o.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Bia fas asuya na man me tyende abui
sc-redirect-page-subtitle-1 = Nnyoñe medjô a keya afôla ya Common Voice. Ô too ngula ya <writeURL>tili</writeURL> adjô ngeki<reviewURL>e fas</reviewURL> medjô e Common Voice.
sc-redirect-page-subtitle-2 = Sili bi minsili miôe e <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ngeki <emailLink>aa zen e-mail</emailLink>.
