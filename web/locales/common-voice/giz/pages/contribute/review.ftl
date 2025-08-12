## REVIEW

sc-review-lang-not-selected = ki wini ko mi purla taˀ. Cam ar <profileLink>  vidum ɗikl</profileLink> ba ngi wini mihey
sc-review-title = cihilaka ɓi heye
sc-review-loading = mbiɗi bihey
sc-review-select-language = wini mi purla ɓa gi wunjila bihey
sc-review-no-sentences = bi ngi wunjil anta mataˀ. Anja <addLink> jum ɓi hey ma <addLink>
sc-review-form-prompt =
    .message = ɓi mi wunjilahey a slinam tan taˀ, ki slinam di makwa?
sc-review-form-usage = Ardi ti hazum ɓa hignaka ɓi vuna.Ardi ti gula ɓa hiziga. Ardi ti muƞ ɓa mɓuk <strong>. Ki piyik ti slin ngi zinga'a ngi mi hiri na ta! </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = slidi'is: { $sentenceSource }
sc-review-form-button-reject = Hiziga
sc-review-form-button-skip = Cu
sc-review-form-button-approve = Tibi
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = H
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ῖ
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = C
sc-review-form-keyboard-usage-custom = Da ki wuɗ le ki gi slra  ti "digule" ngi "beleler ngi tuh: { sc-review-form-button-approve-shortcut } ɓa ngi tiɓi, { sc-review-form-button-reject-shortcut } ɓa ngi hizik,{ sc-review-form-button-skip-shortcut } ɓa ngi tuwuɗ
sc-review-form-button-submit =
    .submitText = kiɗa mi ngi cihilabi
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] [0]mi mi cihila anta.
        [one] [1] I lumam ɓi micihila pal. Sise!
       *[other] { $sentences } bi mi cihila sise!
    }
sc-review-form-review-failure = Cihilnaƞ na a lum ji mata. Wa mi hiri naƞ ava
sc-review-link = mihiri naŋ

## REVIEW CRITERIA

sc-criteria-modal = wer ngi mihiri
sc-criteria-title = wer ngi mihiri
sc-criteria-make-sure = nan gisiŋ  ɓi vuna a ɓam vule a ti vulek haniney na kwa?
sc-criteria-item-1 = anja ɓi a ndir mi toho celele
sc-criteria-item-2 = cihildarmi ngi be anja atir celele
sc-criteria-item-3 = anja slif ɓi atir ma ɓaka gu
sc-criteria-item-4 = da ɓi vuna a jumle ati vuluk dik na, hirpa a li mi toho « i tiɓale » tir vay hazum
sc-criteria-item-5-2 = da ɓi vuna a jum a ti vuluk misi a muŋna tana, hirpa ar li mi toha
sc-criteria-item-6 = da ɓihey ngi cihile anta mata na, jinaka ndra ɓa ngi jum ɓi hey ma!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = cihila<icon></icon> da ɓi vuna naŋ celele ar kida slir
sc-review-rules-title = ɓi vuna a ɓam vu le ati ti cufuɗ kwa?
sc-review-empty-state = vurenna ɓi ngi cihile anta ar irne hana mata
report-sc-different-language = irne mekelem
report-sc-different-language-detail = ɓi hana mitoho ti irne mekelem anja i slufama
sentences-fetch-error = zluɓ a bawa rak ar ya ma bo ti bi hana
review-error = zluɓ a bugovunang ar ya ma bo ti bi hana
review-error-rate-limit-exceeded = ki ra vusvu. Musuk vu ne ba ki zla luf na ba ki bura da naŋ celele
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ira mbuɗa ka le miduɓa
sc-redirect-page-subtitle-1 = mbur ma cikila bihey a slikid le ngar plateforme common Voice. Ki tuhu gu
sc-redirect-page-subtitle-2 = Cufɗa ndra ar <matrixLink>.Matrix </matrixLink>, <discourseLink>.Ɓi mi puɗaw.<discourseLink> malla  <emailLink> slin ngi zlir<emailLink>.
# menu item
review-sentences = Wunjila ɓehey
