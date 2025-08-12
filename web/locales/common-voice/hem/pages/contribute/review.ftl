## REVIEW

sc-review-lang-not-selected = Nda mule usobola lulimi lolumo. Mu bambe <profileLink>uchwela</profileLink> mu uwiyuisha dju ya usobola ndimi
sc-review-title = Ulola yi mulongo
sc-review-loading = Gajibu lamilongo…
sc-review-select-language = Sobola lulimi lumo lwa uye nya milongo
sc-review-no-sentences = Nda uli mulongo uwa ulola mulole <addLink> mulongo yingi</addLink>.
sc-review-form-prompt =
    .message = Mulongo jiyenje nda yi tume, goswa ugilila ?
sc-review-form-usage = Gisha uboo ulume waulangisha mulongo. Gisha uboo wazii wa ubenga. Gisha egulu wa uviliginya. <strong>Nanguviliginya utuma majibu ga usomonona !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Mbambo : { $sentenceSource }
sc-review-form-button-reject = Usumbula
sc-review-form-button-skip = Kuwila
sc-review-form-button-approve = Witabija
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Gumuwez' onga utumikisha ngwalijijo ya clavier : { sc-review-form-button-approve-shortcut } wa ulangija, { sc-review-form-button-reject-shortcut }usunbula, { sc-review-form-button-skip-shortcut }wa witabija
sc-review-form-button-submit =
    .submitText = Uvuya ulola
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ndauli mulongo ata gumo
        [1] Mulongo gumo guzingule. Wafako !
        [one] Mulongo gumo guzingule. Wafako !
       *[other] Mulongo guzingulule. Wafako !
    }
sc-review-form-review-failure = Ulola ndaugandie. Geleja munonga gungi.
sc-review-link = Usomonona

## REVIEW CRITERIA

sc-criteria-modal = Mutindi gwa usomonana
sc-criteria-title = Mutindi gwa usomonana
sc-criteria-make-sure = Mulangije kowine nage mulongo golunga wa mitindo yino :
sc-criteria-item-1 = Mulongo gupashishe uyuandibwa bilegele.
sc-criteria-item-2 = Mulongo gupashishe usomwa bilegele.
sc-criteria-item-3 = Mulongo gupashishe wisambibwa bilegele.
sc-criteria-item-4 = Utu mulongo goyitibijya mu mitindi, yatinya a ifungo « Uyitibijya » uboo ulume
sc-criteria-item-5-2 = Utu mulingo nda ulungile mu mitindi yili ulwegulu, yatinya a ifungo « SUMBULA » uboo wazi. Utu mu na biningoningo, gu muweza bebebyo usomboa na ukwila u bingi.
sc-criteria-item-6 = Utu nda muki na milongo ya uzingulula, tukwashe ubunga milongo yingi !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Mulole <icon></icon> mulongo utu guli bilegele owamo mu ndimi
sc-review-rules-title = Mulingo guli owamo na mitindi ?
sc-review-empty-state = Nda uli mulongo na gwi gumo wa ulongolola mu lulimi.
report-sc-different-language = Lulimi lungi
report-sc-different-language-detail = Mulongo gu gandie mu lulimi lungi wa lulu lwa nika musomanga
sentences-fetch-error = Bubi bo fumina munonga gwa ubugula milongo
review-error = Bubi bolongea munonga gwa ulongolola mulongo
review-error-rate-limit-exceeded = Muka mwena lubilo kowi kuu. To milangijya mubugule munonga gutole gwa usomnona mulongo na mulangijye nage ngulegele.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Tuketumulonga ugajibula wa kowine
sc-redirect-page-subtitle-1 = Gwa ubunga milongo na yi gisha kwibungo ya Common Voice. Mu muweza <writeURL>ugandia</writeURL> ao ulola milongo <reviewURL>ubambila</reviewURL> ibungo ya maywi.
sc-redirect-page-subtitle-2 = Mutuyujye mayujyo genu juu <matrixLink>Matrix</matrixLink>, <discourseLink>ubanga </discourseLink> ama <emailLink>e-mail</emailLink>.
# menu item
review-sentences = Ulola yi mulongo
