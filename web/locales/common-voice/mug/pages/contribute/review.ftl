## REVIEW

sc-review-lang-not-selected = Ki viri miŋ seŋ kay ko. Nɵa niyi amlay war <profileLink>Hlay zi dawan n'arbani smer</profileLink> kapay ki viri miŋ seŋ.
sc-review-title = Fifiki miɗi ɗa
sc-review-loading = piyini miɗi
sc-review-select-language = Viri miŋ seŋ ktay kapay ki fifiki miɗi gaini
sc-review-no-sentences = Miɗi ktay zi fifiki aŋ kay. Ki kiɗi <addLink>ki milisi miɗi amlay via</addLink>.
sc-review-form-prompt =
    .message = Miɗi zi fifiki ɗa a Ɵinasi kay, ki firyi ki hili wusaki ɗi?
sc-review-form-usage = Hugui miɗi ɗa midiɗi tii na wus sek na ɓa ki diriŋ ya ɗa. Huguiŋ midiɗi tii na danaŋ sek na ɓa ki diriŋ kay. Huguiŋ amay sek na ɓa aza sda kay. <strong>Midiki a wula kay aŋ Ɵinasi deer na wii bindiŋ seŋ ɗa  !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Balamni : { $sentenceSource }
sc-review-form-button-reject = Blaŋ edi pra
sc-review-form-button-skip = Vouga
sc-review-form-button-approve = Yimiŋ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = N
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = Z
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = V
sc-review-form-keyboard-usage-custom = Ki kiɗi ki zi sda gay zarara na hoya seŋ gob : { sc-review-form-button-approve-shortcut } aŋ yimiŋ, { sc-review-form-button-reject-shortcut } aŋ bliŋ edi, { sc-review-form-button-skip-shortcut } aŋ vigui avut
sc-review-form-button-submit =
    .submitText = Vidi gay fifikini
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Miɗi ktay a fifika kay.
        [one] Miɗi a fifika ya. Tese !
       *[other] { $sentences } Miɗi a fifika ya. Tese !
    }
sc-review-form-review-failure = Fifikini seŋ ɗa a yima amlay kay. Say ki huyi pini asakal par.
sc-review-link = Huyi na midini wala

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Nafar gaday na wii huyi na midini wala
sc-criteria-title = Nafar gaday na wii huyi na midini wala
sc-criteria-make-sure = Yimi ɓa seŋ zi miɗi hanɗa a na kata piŋ nafar gaday na maini:
sc-criteria-item-1 = Seŋ zi miɗi ɗa azva ɓa a ɗoo war futini
sc-criteria-item-2 = Seŋ zi miɗi ɗa azva ɓa ava gaday ɗa amy kafa paŋ war futini
sc-criteria-item-3 = Seŋ zi miɗi ɗa azva ɓa a yika
sc-criteria-item-4 = Na ɓa seŋ zi miɗi ɗa a va gaday ɗa amay lii ɗa, ki kiɗi ki bizi midini zarara na war tuku na wus na sinka ɓa «  ku dara ya »
sc-criteria-item-5-2 = Na ɓa seŋ zi miɗi hanɗa a diŋga gay seŋ na katasi amay par kay ɗa, baza midini zarara " zi wiyi anye" war tuku na muni. Na ɓa ki yimi kay ki kiɗi ki pri avut.
sc-criteria-item-6 = Na ɓa seŋ zi miɗi zamay aŋ kay ɗa, zini piyi gay miɗi zamay.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Fifiki <icon></icon> seŋ zi miɗi ɗa na ɓa a na muda kalkal xar balamni ɗa
sc-review-rules-title = Miɗi ɗa a na kata gayni gaday ɗa tiɓ ɗi?
sc-review-empty-state = Teena miŋ seŋ zamay n'aga mu fifikummu war miɗi hanɗa aŋ kay
report-sc-different-language = Min seŋ zamay
report-sc-different-language-detail = Miɗi hanɗa a ɗoo war miŋ seŋ zamay kiini gay na mu na ŋaŋ gaini ɗa
sentences-fetch-error = Hlay na mi ɗa yimisi seŋ hanɗa edi, seŋ a wula pii skeŋ
review-error = Hlay na mi ɗa huyi midi hanɗa edi, seŋ a wula pii skeŋ
review-error-rate-limit-exceeded = Ki hili ɗa a kokolay. Huyi hangalki azumay agui kapay ki ŋi seŋ miɗi ɗa edi na ɓa pɗem lay ɗa
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Mi ɗa fiɗi was kapay seŋ a bunda
sc-redirect-page-subtitle-1 = Wala a zogo war halay zamay zok. Kalaŋ. Ki kiɗi aŋ <writeURL>dû</writeURL> miɗi kay <reviewURL>fifiki</reviewURL> miɗi kalaŋ.
sc-redirect-page-subtitle-2 = Zilbi midini <matrixLink>Matrix</matrixLink>, <discourseLink>Duskur</discourseLink> zaw <emailLink>war lokuta</emailLink>.
# menu item
review-sentences = Fifiki seŋ zi miɗi
