## REVIEW

sc-review-lang-not-selected = Káa pei kâŋ wéi cǒ tsâr. Pei kə́u cər <profileLink>ndəʉ ndə̂ wei</profileLink> Kǎŋ mətsâr.
sc-review-title = Pei náŋtə́ məkəm-tsâr
sc-review-loading = Ndyí'tə́ məkəm-tsâr
sc-review-select-language = Pei káŋ tâ' tsâr lə́ ndágh' ndyi'tə́ məkəm-tsâr
sc-review-no-sentences = Káa kəm-tsâr yi mbo' pei li'tə. Mbo' pei <addLink>Kʉ́'ʉ́ məkəm-tsâr</addLink>.
sc-review-form-prompt =
    .message = Məkəm-tsâr mi pə́ li'tə́ káa pə́ yé mi tə̌u, pei pə́ koŋ ndágh' ndər lə́ mbi ?
sc-review-form-usage = Pei cí ŋə́ lə ndyegh'ə́ pô təʉ lə ndágh' mbə́i. Pei cí ŋə́ lə ndyegh'ə́ pô kwap lə ndágh' ndə̌' .Pei cí ŋə́ lə tʉ̌ lə ndágh' muŋə́. <strong>Koo pei lyegh'ə lə ntə́u zə̂u yi pei pyegh'ə́ náŋ tə njwó !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Ləfǔ-zěi : { $sentenceSource }
sc-review-form-button-reject = Múŋə́
sc-review-form-button-skip = Ndéi
sc-review-form-button-approve = Mbə́i
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ə
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = N
sc-review-form-keyboard-usage-custom = Mbo' pei lâgh' məkəm-njí mi luŋə nŋwa'a məsʉ̂ŋ-nŋwa'a ndágh' fǎ' lə́wó : { sc-review-form-button-approve-shortcut } ndágh' mbə́i, { sc-review-form-button-reject-shortcut } ndágh' muŋə́, { sc-review-form-button-skip-shortcut } ndágh' nděi
sc-review-form-button-submit =
    .submitText = Myágh'tə́ lə́ ndyí'tə́
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Káa kəm-tsâr yi li'tə́.
        [one] 1 Tâ' kəm-tsâr yi lí'tə́. Nkhwo !
       *[other] { $sentences } Məkəm-tsâr mi lí'tə́. nkhwo !
    }
sc-review-form-review-failure = Pə́ li'tə́ káa ku'tə yé lə́ ghou. Pei kə́ mbyégh'ə́ pfu nde'e
sc-review-link = mbyégh'ə́ náŋtə́

## REVIEW CRITERIA

sc-criteria-modal = Məzə̂u mi pə́ghwó lə́ ngʉ́ ndǎgh' ndyí'tə́ mənyôgh' nŋwa'a
sc-criteria-title = Məzə̂u mi pə́ghwó lə́ ngʉ́ ndǎgh' ndyí'tə́ mənyôgh' nŋwa'a
sc-criteria-make-sure = Pei náŋtə́ kəm-tsâr kəʉ pəu lə́ məzə̂u mi pə́ghwó lə́ ngʉ́ ndǎgh' ndyí'tə́ mənyôgh' nŋwa'a mwo:
sc-criteria-item-1 = Pə́ ghwo lə́ ntsúŋə́ nkəm-tsâr nŋwa'á kwa' shʉ'ʉ
sc-criteria-item-2 = Pə́ ghwo lə́ ntʉ́ŋ'tə́ mənyôgh' nŋwa'a cər nkəm-tsâr kwa' shʉ'ʉ
sc-criteria-item-3 = Kəm-tsâr ghwo lə́ mbə́u yi mbo' pə́ fúŋ
sc-criteria-item-4 = ə́ kəm-tsâr lǒu ndyí pəu lə́ məzə̂u mi pə́ghwó lə́ ngʉ́ ndǎgh' ndyí'tə́ mənyôgh' nŋwa'a mwo po, pei nô lə́ « mbə́i » lə dyegh'ə́ pô yi təʉ.
sc-criteria-item-5-2 = ə́ kəm-tsâr lǒu ndyí pəu lə́ məzə̂u mi pə́ghwó lə́ ngʉ́ ndǎgh' ndyí'tə́ mənyôgh' nŋwa'a mwo po, pei nô lə́ « muŋə » lə dyegh'ə́ pô yi kwap. Kə́u mə́ nə́, pei zê' ngwó njwó kəm-trâr yi nde'e.
sc-criteria-item-6 = Pei lǒu ndí' kə́ ghwó məkəm-tsâr mi mbo' pei li'tə po, pei pfutə wógh' lə nkʉ́'ʉ́ ngǒu məkəm-tsâr ndǎgh' ndə́t lə́ mbi !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Pei lí'tə́ njwó <icon></icon> kəʉ kəm-tsâr zei pəu ghí' pə́ yǎa ngwǒ lə́ nŋwá'á
sc-review-rules-title = kəm-tsâr pəu lə́ məzə̂u mi pə́ nghwǒ lə́ ngʉ́ ?
sc-review-empty-state = Káa cǒ kəm-tsâr yi mbo' pə́ li'tə lə́ zei tsâr mpfu wo
report-sc-different-language = Cǒ tsâr lâ' yi nde'e
report-sc-different-language-detail = Pə́ nŋwa'a kəm-tsâr zei lə́ tsâr lâ' nde'e yi káa mə́ fúŋ ghâa zěi
sentences-fetch-error = Tâ' lǒ' kwat ghí ' pə́ pə́ mbyégh'ə́ ndóu məkəm-tsâr mwo lə́ ngwó
review-error = Tâ' lǒ' kwat ghí ' pə́ pə́ mbyégh'ə́ kəm-tsâr yo náŋtə́
review-error-rate-limit-exceeded = Pei pə̌ dət lə́ mətəʉ. Pei nyé' mbyé məyʉ' mpfu ńdágh' mbyégh'ə́ fúŋ kəm-tsâr ə́ njwó kəʉ pə́ tsuŋə nŋwa'á
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = pogh' pə́ kə́ptə məzə̂u lətəi-ndwuŋ
sc-redirect-page-subtitle-1 = Zə̂u yi ghou məkəm-tsâr shərə kə́u ndə̂ tsəpə-nji. Maa mpfu ntsəm mbo' pei <writeURL>nŋwa'a</writeURL> kəm-tsâr kəʉ <reviewURL>ndyí'tə́</reviewURL> məkəm-tsâr gháp tsəpə-nji.
sc-redirect-page-subtitle-2 = Pei túŋə́ məno méi mbô <matrixLink>Lʉŋə-nŋwa'a</matrixLink>, <discourseLink>Tsâr-ŋuu</discourseLink> kəʉ <emailLink>Ntə́u nŋwa'a lə́ ntəu-tsâr</emailLink>.
# menu item
review-sentences = Náŋtə́ məkəm-tsâr
