## REVIEW

sc-review-lang-not-selected = Nid ydych wedi dewis unrhyw ieithoedd. Ewch i'ch <profileLink>Proffil</profileLink> i ddewis ieithoedd.
sc-review-title = Adolygu Brawddegau
sc-review-loading = Yn llwytho brawddegau...
sc-review-select-language = Dewiswch iaith i adolygu brawddegau ynddi.
sc-review-no-sentences = Dim brawddegau i'w hadolygu. <addLink>Ychwanegwch ragor o frawddegau nawr!</addLink>
sc-review-form-prompt =
    .message = Brawddegau wedi'u hadolygu ond heb eu cyflwyno, ydych chi'n siŵr?
sc-review-form-usage = Llusgwch i'r dde i gymeradwyo'r frawddeg. Llusgwch i'r chwith i'w gwrthod. Llusgwch i fyny i'w hepgor. <strong>Peidiwch ag anghofio i gyflwyno'ch adolygiad!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Ffynhonnell: { $sentenceSource }
sc-review-form-button-reject = Gwrthod
sc-review-form-button-skip = Hepgor
sc-review-form-button-approve = Cymeradwyo
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = I
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = H
sc-review-form-keyboard-usage-custom = Gallwch hefyd ddefnyddio Llwybrau Byr Bysellfwrdd: { sc-review-form-button-approve-shortcut } Cymeradwyo, { sc-review-form-button-reject-shortcut } Gwrthod, { sc-review-form-button-skip-shortcut } a Hepgor
sc-review-form-button-submit =
    .submitText = Gorffen Adolygu
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Dim brawddegau wedi'u hadolygu.
        [zero] Dim brawddegau wedi'u hadolygu.
        [one] 1 frawddeg wedi'i adolygu. Diolch yn fawr!
        [two] { $sentences } frawddeg wedi'u hadolygu. Diolch yn fawr!
        [few] { $sentences } brawddeg wedi'u hadolygu. Diolch yn fawr!
        [many] { $sentences } brawddeg wedi'u hadolygu. Diolch yn fawr!
       *[other] { $sentences } brawddeg wedi'u hadolygu. Diolch yn fawr!
    }
sc-review-form-review-failure = Nid oedd modd cadw'r adolygiad. Ceisiwch eto'n hwyrach.
sc-review-link = Adolygu

## REVIEW CRITERIA

sc-criteria-modal = Ⓘ Meini Prawf Adolygu
sc-criteria-title = Meini Prawf Adolygu
sc-criteria-make-sure = Sicrhewch fod y frawddeg yn cwrdd â'r meini prawf canlynol:
sc-criteria-item-1 = Rhaid fod y frawddeg wedi ei sillafu'n gywir.
sc-criteria-item-2 = Rhaid i'r frawddeg fod yn ramadegol gywir.
sc-criteria-item-3 = Rhaid i'r frawddeg fod yn hawdd ei hynganu.
sc-criteria-item-4 = Os yw'r frawddeg yn cwrdd â'r meini prawf, cliciwch y botwm "Cymeradwyo" ar y dde.
sc-criteria-item-5-2 = Os nad yw'r frawddeg yn cwrdd â'r meini prawf uchod, cliciwch y botwm "Gwrthod" ar y dde. Os nad ydych chi'n siŵr am y frawddeg hon, gallwch hefyd ei hepgor a symud ymlaen i'r un nesaf.
sc-criteria-item-6 = Os ydych chi'n rhedeg allan o frawddegau i'w hadolygu, helpwch ni i gasglu rhagor o frawddegau!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Gwirio <icon></icon> os yw hon yn frawddeg ieithyddol gywir
sc-review-rules-title = A yw'r frawddeg yn cyd-fynd â'r canllawiau?
sc-review-empty-state = Nid oes brawddegau i'w hadolygu yn yr iaith hon ar hyn o bryd.
report-sc-different-language = Iaith wahanol
report-sc-different-language-detail = Mae wedi'i hysgrifennu mewn iaith sy'n wahanol i'r hyn rwy'n ei hadolygu.
sentences-fetch-error = Digwyddodd gwall wrth nôl brawddegau
review-error = Digwyddodd gwall wrth adolygu'r frawddeg hon
review-error-rate-limit-exceeded = Rydych chi'n mynd yn rhy gyflym. Cymerwch eiliad i adolygu'r frawddeg i wneud yn siŵr ei bod yn gywir.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Rydym yn gwneud rhai newidiadau mawr
sc-redirect-page-subtitle-1 = Mae'r Casglwr Brawddegau yn symud i lwyfan craidd Common Voice. Nawr gallwch <writeURL>ysgrifennu</writeURL> brawddeg neu <reviewURL>adolygu</reviewURL> brawddeg unigol wedi eu cyflwyno ar Common Voice.
sc-redirect-page-subtitle-2 = Gofynnwch gwestiynau i ni ar <matrixLink>Matrics</matrixLink>, <discourseLink>Discourse</discourseLink> neu <emailLink>email</emailLink>.

