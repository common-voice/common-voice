## REVIEW

sc-review-lang-not-selected = Mì mu cã gbè ɖékpé o. Mí  ɖè kúkú yì <profileLink> àpo ŋutínyà mè</profileLink> nè a cã gbèwó.
sc-review-title = Tó nyàgbɔ̃gblɔ̃wó mè/ dà ŋùku ɖo nyàgbèwo mè.
sc-review-loading = Nyàgbè awo  lá zɛ̃̃ zãɖè yà...
sc-review-select-language = Mí ɖè kúkú, cã gbè  ɖèkà sɔ tó nyàgblɔgblɔàwó mè.
sc-review-no-sentences = Mi mu kpɔ́ nyàgbè ɖékpé kè mi la dà ŋùku ɖo mè. Wò la téŋu <addLink> sɔ nyàgbè buwo kpé è o </addLink>
sc-review-form-prompt =
    .message = Wó mu ɖo nyàgbè kèwo dà ŋùku ɖo woa mè o ɖa,  wò ji la gbà yì eji a?
sc-review-form-usage = Kplɔὲ yí núɖùsímè nè wòá  lõ ɖé nyàgblɔgblɔà jí. Kplɔὲ yí mìɔmè  nè wòá  gbé. Kplɔὲ yí jí nè wòá jó lè èjí.<strong> ɖó ŋkú nè wòá gblè nyàgblɔgblɔmè tótóà ɖé fíyè!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Sóƒè:{ $sentenceSource }
sc-review-form-button-reject = ágbé
sc-review-form-button-skip = j
sc-review-form-button-approve = jó lè jí
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = n
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = s
sc-review-form-keyboard-usage-custom = Wòà tèŋ zã aɖàŋùɖèmɔ bè núŋlɔkpé vícúkũĩàwó:{ sc-review-form-button-approve-shortcut } àsɔ lõ,{ sc-review-form-button-reject-shortcut } àsɔ gbè,{ sc-review-form-button-skip-shortcut } à và yì.
sc-review-form-button-submit =
    .submitText = àkpá émètótó
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Wó mù tó nyà gblɔgblɔ ɖèkpé mè o.
        [one] Wó tó nyà gblɔgblɔ ɖèká  mè. Akpè!
       *[other] Wó tó nyà gblɔgblɔwó  mè. Akpè!
    }
sc-review-form-review-failure = Nyàmè tótówòà mú cí èmè o. Trɔ và èji gabúmè,kàflã
sc-review-link = kù nu mè kpɔ́ / glò nu mè kpɔ́ / ji nu mè kpɔ́.

## REVIEW CRITERIA

sc-criteria-modal = Nyàmè tótóŋtínyàwó
sc-criteria-title = Nyàmè tótóŋtínyàwó
sc-criteria-make-sure = Kpɔὲ gbɔ bè nyàgblɔgblɔà nèsɔ ɖó ŋtínyà yàwó jí:
sc-criteria-item-1 = Wò ɖó là ŋlɔ̀ nyàgblɔgblɔà pèpèpè.
sc-criteria-item-2 = Wò ɖó là ŋlɔ̀ nyàgblɔgblɔà zɔ̃ ɖó gbèŋtísèàjí pèpèpè.
sc-criteria-item-3 = nyàgblɔgblɔà ɖó là nyɑ́ sèsè
sc-criteria-item-4 = Nè nyàgblɔ̀gblɔ̀à sɔ̀ɖó ŋtínyàwó jíɑ́, zĩ &quot;lɔ̃&quot;miɔ̀mè bè abitɔ̀ŋùɑ̃
sc-criteria-item-5-2 = Nè nyàgblɔ̀gblɔ̀à mù sɔ̀ɖó ŋtínyà kèwó lè jíɑ́ jíówùà, zĩ &quot;gbè&quot;miɔ̀mè bè abitɔ̀ŋùɑ̃. Nè wò mù kãɖó jíówùà, wòà tèŋjólèjí èyé wòà yí bú jí
sc-criteria-item-6 = Nè nyà gblɔ̀gblɔ̀ vɔ̀ ɖó wóà, kpèɖó míàŋtí kúɖó búbúwó.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = kpɔɛ̀ɖá<icon></icon> nyàgblɔ̀gbɔ̀ yà mɛ̀sì cúcúcú,?
sc-review-rules-title = Nyà gblɔ̀gblɔ̀à sɔ̀ɖò mɔ̀fíɔ̀nyàwó j́íà?
sc-review-empty-state = Nyà gblɔ̀gblɔ̀mè tótó ɖékpé mú lè gbèyàmè fífìò
report-sc-different-language = gbè bú.
report-sc-different-language-detail = wó ŋlɔ̀ nyàgbè a lè gbèɖé kè tó vò ná  ékè mù dónàà mè.
sentences-fetch-error = Vòdàdàɖè jɔ̀ gàkèmè wò lèjí nyà gblɔ̀gblɔ̀àwó
review-error = Vòdàdàɖè jɔ̀ gàkèmè wò lèjí nyà gblɔ̀gblɔ̀ yàà.
review-error-rate-limit-exceeded = Wò lèkèɖì ŋtɔ́. Gbɔ̃jìɖé, tó nyà gblɔ̀gblɔ̀àmè né wóà kãɖèjí bè  ésɔ̀ gbè.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Mí lètrɔ́ àsí sùgbɔ̀ lè núwó ŋtí.
sc-redirect-page-subtitle-1 = Nyà gblɔ̀gblɔ̀ bɔ̀tɔà tùtá Common Voice bè bɔ̀bɔ̀gã́mè. Fífìà wóà téŋ<writeURL>ŋlɔ̀</writeURL>Nyà gblɔ̀gblɔ̀ ɖèká àló<reviewURL> tóémè</reviewURL>Nyà gblɔ̀gblɔ̀ ɖèká tíŋgó bè dàdà ɖó Common Voice jí.
sc-redirect-page-subtitle-2 = Bíɔ̀ mí nyà lè<matrixLink>Matrix</matrixLink>,<discourseLink>Nyàgblɔ̀gblɔ̀ lɔ̀bɔ̀</discourseLink>àló <emailLink>kájí núŋlɔ̀ŋlɔ̀</emailLink>
# menu item
review-sentences = Tó nyàgblɔgblɔwó mè
