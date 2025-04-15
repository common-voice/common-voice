## REVIEW

sc-review-lang-not-selected = de can egbe ɖe kpokpwi o.  Tekpɔ<profileLink>aɖó tɔnúme ne na can egbebúwo
sc-review-title = glo enyɔgbelɔwo kpɔ, kunumekpɔ só enyɔgbelɔwo ŋú.
sc-review-loading = enyɔgbewo cucu, enyɔgbelɔwó gbesɔsɔ
sc-review-select-language = can egbe deká ne na wɔ enumekuku so enyɔgbelɔwo ŋú.
sc-review-no-sentences = enyɔgbeɖe ɖélɛ yí woa glokpɔ. Atéŋ<addLink>sɔ́ buwo kpí</addLink>.
sc-review-form-prompt =
    .message = Enyɔgbe cewo yí o wɔ enumekuku solɔ́, o de sɔ́ wo ɖáɖá o. A yi ji a ?
sc-review-form-usage = dɔɛn  va yi ɖushi kpájí ne na dashi ɖe nyɔgbe lɔ ji. Dɔɛn va yi emiɔ kpaji né na cucwui ɖaɖa. Dɔɛn yi ji ne na tashi.<strong> Na ɖoŋui asɔ́ ashitɔtrɔlɔ́ le tɔwo ɖɔ́ŋú ɖáɖá.
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Jɔsoxú : { $sentenceSource }
sc-review-form-button-reject = cucwui ɖaɖá.
sc-review-form-button-skip = va yi
sc-review-form-button-approve = dashiɖéjí
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = atéŋ xo jeshi ɖekáwo ɖo ju le mɔlɔ ji  : { sc-review-form-button-approve-shortcut }asɔ dashi ɖé jí,{ sc-review-form-button-reject-shortcut }, asɔ cucwui ɖaɖa,{ sc-review-form-button-skip-shortcut } ne na va yI
sc-review-form-button-submit =
    .submitText = ɖegbɔnɔ ŋkuvilélé ɖé enuwo ŋú
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] wo dé wɔ numekuku so enyɔgbeɖeŋú o.
        [1] enyɔgbe ce ŋú yí wolé ŋkuvi ɖó. Akpe !
        [one] { $sentences }enyɔgbe cewo ŋú yí wolé ŋkuvi ɖó. Akpe !
       *[other] { "" }
    }
sc-review-form-review-failure = ŋkuvilélé ɖé enuŋu dé le lelé ɖɛ o. Trɔ á tikpɔ gabují
sc-review-link = glo nu me kpɔ, ku nu me kpɔ, á trɔátó enuwo me.

## REVIEW CRITERIA

sc-criteria-modal = numekuku fɔɖeɖewo
sc-criteria-title = numekuku fɔɖeɖewo
sc-criteria-make-sure = tekpɔ né enyɔgbe lɔ ne sɔ ɖe afɔɖeɖe ceɖewo jí
sc-criteria-item-1 = enyɔgbelɔ ne sɔ kuɖo gbeŋɔŋlɔseɛ
sc-criteria-item-2 = enyɔgbelɔ ne sɔ kuɖo gbeŋutiseɛ
sc-criteria-item-3 = O ne téŋ yɔ́ enyɔgbe lɔ
sc-criteria-item-4 = Ne enyɔgbe lɔ sɔ ɖe afɔɖeɖewo jí lɔ́, naʒɛn«dashiɖoji» le ɖushi kpaxwe
sc-criteria-item-5-2 = né enyɔgbe lɔ de sɔ kuɖo afɔɖeɖe cewo yí le eji lɔ́, naʒɛn «cucwui ɖaɖa» le miɔ kpaxwe. Ne de kan ɖé nɖé jí lɔ, na totóŋú ayi ɖetɔlɔ jí
sc-criteria-item-6 = Ne numekukuɖe de gbe lɛ yí nawɔ so enyɔgbewo ŋú lɔ́, kpeɖemiŋú kuɖo ebuwo
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = kunume<icon></icon> kpɔ bé enyɔgbeɛ sɔ ɖe gbeŋucinunya  ɖóɖóɔ jia
sc-review-rules-title = enyɔgbeɛ sɔ ɖo ɖoɖowo jia
sc-review-empty-state = ɖɛ viɛ, numekukuɖe de lɛ yí woawɔ le egbe ceɖe me o
report-sc-different-language = egbebu
report-sc-different-language-detail = enyɔgbe ce yí n hlɛnkɔ  tó vo nɔ ce yí wo ŋlɔ.
sentences-fetch-error = Le enyɔgbe lé xoxuwomeɔ, mido jeshi vodada ɖeká
review-error = Le ŋkuvilélé ɖé enyɔgbe ceɖe ŋu lɔ́, mido jeshi vodada ɖeká
review-error-rate-limit-exceeded = e yi kɔ kabá ɖoɖu. Gbɔjiɖɛ átrɔhlɛn enyɔgbelɔ kpɔ nyuieɖe ne nanya bé éle tɔxu
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = mi trɔ́náshi le nu sugbɔ veviɖewó ŋú
sc-redirect-page-subtitle-1 = enyɔgbelé xoxuwonú va yi ci Common Voice ka ji
sc-redirect-page-subtitle-2 = biɔ nyɔwo sɔ kudo<matrixLink> Matrix</matrixLink>, <discourseLink> Nuxu</discourseLink> alo<emailLink> to e-mail ji</emailLink>.
# menu item
review-sentences = glo nyɔgbelɔwo kpɔ nyuieɖé
