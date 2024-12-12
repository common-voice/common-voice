## REVIEW

sc-review-lang-not-selected = Ima shimitapis manaraqmi akrarqunkichu. Kay, <profileLink>Perfil</profileLink> nishqanman huk shimita icha huk shimikunatapis akranaykipaq aywaykuy.
sc-review-title = Rimaykunata rikapay
sc-review-loading = Rimaykunata apamushpa...
sc-review-select-language = Rimaykunata rikapanaykipaq huk shimita akray.
sc-review-no-sentences = Rikapanaykipaq rimaykuna manami kannachu. <addLink>Kananqa ashwan rimaykunata yapay!</addLink>
sc-review-form-prompt =
    .message = Rikapashqayki rimaykuna manami apachikashqachu, ¿allitaku yarpaykanki?
sc-review-form-usage = Alliqman chay rimayta awninaykipaq apay. Ichuqman mana awninaykipaq apay. Chayta haqinaykipaqqa wichayman pintiy. <strong>¡Rikapayniyniykikuna apachiyta ama qunqaychu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Qillqa: { $sentenceSource }
sc-review-form-button-reject = Mana niy
sc-review-form-button-skip = Pintiy
sc-review-form-button-approve = Awniy
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = A
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = M
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Tanunakunatapis iñishinkimanmi : { sc-review-form-button-approve-shortcut } awniypaq, { sc-review-form-button-reject-shortcut }  mana niypaq, { sc-review-form-button-skip-shortcut } pintiypapis
sc-review-form-button-submit =
    .submitText = Rikapayta ushay
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] No sentences reviewed.
        [one] 1 sentence reviewed. Thank you!
       *[other] { $sentences } sentences reviewed. Thank you!
    }
sc-review-form-review-failure = Rikapashqa rimaykuna manami churakashqachu. Qipaman kutiykur kallpachakuy.
sc-review-link = Kutipay

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Rikapaypaq kamachiykuna
sc-criteria-title = Rikapaypaq kamachiykuna
sc-criteria-make-sure = Llapan rimaykuna kay shamuq kamachiykunamannaw kanan:
sc-criteria-item-1 = Chay rimayqa alli qillqashqami kanan.
sc-criteria-item-2 = Chay rimayqa shimikamaymannawmi kanan.
sc-criteria-item-3 = Chay rimayqa pashtachinapaqnawmi kanan.
sc-criteria-item-4 = If the sentence meets the criteria, click the &quot;Approve&quot; button on the right.
sc-criteria-item-5-2 = If the sentence does not meet the above criteria, click the &quot;Reject&quot; button on the left. If you are unsure about the sentence, you may also skip it and move on to the next one.
sc-criteria-item-6 = Rikapaanaykipaq rimaykuna mana kaptinnaqa, ¡ashwan rimaykuna shuntayta yanapayaamay!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Ashpiy <icon></icon> Shimiykichaw, ¿alliku kay rimay kaykan?
sc-review-rules-title = ¿Chay rimayqa kamachikuykunamannawku kaykan?
sc-review-empty-state = Kananqa manami kay shimichaw rimaykuna rikapaanapaq kannachu.
report-sc-different-language = Huk shimi
report-sc-different-language-detail = Manami shimi rikapaykashqaachawchu kaykan.
sentences-fetch-error = Rimaykuna ashiychaw pantaymi karqun.
review-error = Kay rimayta rikapaychaw pantaymi karqun
review-error-rate-limit-exceeded = Allaapa rasmi aywaykanki. Rimayta achka kuti rikapaykuy, alli kashqanta musyanaykipaq.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Shumaq aruykunatami ruraykaayaa
sc-redirect-page-subtitle-1 = Sentence Collector nishqanqa Common Voice nishqanmanmi aywakuykan. Kananqa <writeURL>qillqayta</writeURL> huk rimayta icha <reviewURL>qhaway</reviewURL> hukllaylla rimay apachiytapis Common Voice atinkimanmi.
sc-redirect-page-subtitle-2 = Chaykunapita tapuyaamay <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> utaq <emailLink>email</emailLink>.
# menu item
review-sentences = Rimaykunata rikapay
