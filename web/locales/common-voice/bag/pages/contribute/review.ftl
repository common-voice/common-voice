## REVIEW

sc-review-lang-not-selected = Nu tū idjita andjara mô. Fuma nu nà <profileLink>mutūkú winú</profileLink> indi nú idjita andjara.
sc-review-title = Ukôchî wipêngüê
sc-review-loading = Wunāchia wipêngüê…
sc-review-select-language = Idjita nu andjara môchï nà wukôchi wipêngüê.
sc-review-no-sentences = Apêngüê ya wukôchi kā djï. Nu fitmú <addLink>wuchüiya wipêngüê mbunu</addLink>.
sc-review-form-prompt =
    .message = Wipêngüê kôchiari I tà mú tumari, yê nu dingamú nu enda nà wuchiô?
sc-review-form-usage = Tsôrâ na umbāmbana indi wôtō apêngüê. Tsôrâ na ibissô indi ubaranga apêngüê. Tsôrâ ná máná indi utatara. <strong>Kā barafia utuma igussa ya wukôchi wôō !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Igussénô : { $sentenceSource }
sc-review-form-button-reject = Ubaranga / Ayé
sc-review-form-button-skip = Utumba
sc-review-form-button-approve = Wôtō
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = W
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = A
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = U
sc-review-form-keyboard-usage-custom = Nu fitimú utimbāna tunu nà péhitina râ yingüiya : { sc-review-form-button-approve-shortcut } indî wôtō, { sc-review-form-button-reject-shortcut } indî ubaranga, { sc-review-form-button-skip-shortcut } indî utumba
sc-review-form-button-submit =
    .submitText = Umana wukôchi
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Kā apênguê kôchiri
        [one] 1 Apêngüê amôchï kôchiri. Ngangu !
       *[other] indjê { $sentences } wipêngüê kôchiri. Ngangu !
    }
sc-review-form-review-failure = Wukôchi I tū djï béténari. Zu nu mā nà gnïmá
sc-review-link = Wukôchï

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Têbêrê râ wukôchi
sc-criteria-title = Têbêrê râ wukôchi
sc-criteria-make-sure = Kôchi nu ngüî apêngüê I biônômú têbêrê ikú izi :
sc-criteria-item-1 = Apêngüê I mú tirari wussi.
sc-criteria-item-2 = Apêngüê I biônomú têbêrêwandjara wussi.
sc-criteria-item-3 = Apêngüê I apéssétinamú.
sc-criteria-item-4 = Ngüi apêngüê I biônomú têbêrê; winittéta ikômô " Wôtō" nà umbāmbana.
sc-criteria-item-5-2 = Ngüi apêngüê I tà biônomú têbêrê manéya ari; winittéta ikômô  "Ubaranga" nà ibîssô. Wa timba pêtô, u fitimú mù tsaka utumba na ayê na wuchiô.
sc-criteria-item-6 = Ngüi nu tà zu timba wipengüê ya wukôchi, sú akamú nu uwôndjena wipêngüê iwimô!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kôchi nu <icon></icon> apêngüê I mú atênê nà umbōh râ djarétinô
sc-review-rules-title = Yê apengüê I biônomú têbêrê ?
sc-review-empty-state = Kā apêngüê ya wukôchi na andjara azê.
report-sc-different-language = Andjara indjê
report-sc-different-language-detail = Apêngüê I mú tirari nà andjara ndêndêngüê na azê ngu kutu langha.
sentences-fetch-error = Ipôtia I mú atumbéwena nà wuwôrrô wa wipêngüê
review-error = Ipôtia I mú atumbéwena nà wukôchi apêngüê ayê
review-error-rate-limit-exceeded = Nu endamú ichimi. Wôrô nu ibanaki nu kundji ulangha apêngüê indi nu ena ngüi I mú atênê.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Tu engamú mbôndia râ mpî
sc-redirect-page-subtitle-1 = Awondjena wipêngüê a mú enda nà wakōkôngô wa Mí Ngüîmá (Common Voice). Ichimuzu nu fitimú <writeURL>utira</writeURL> apêngüê itô <reviewURL>ukôchi</reviewURL> wipêngüê nà Mí Ngüîmá (Common Voice).
sc-redirect-page-subtitle-2 = Tuma nu séssénô rinú nà <matrixLink>Matrix</matrixLink>, <discourseLink>Wudjara</discourseLink> itô <emailLink>nà i-tsumu</emailLink>
# menu item
review-sentences = Ukôchî wipêngüê
