## REVIEW

sc-review-lang-not-selected = Nu aleapsit nitsi unã limbã. Vã pãlãcãrsim s-vã dutsets pi <profileLink>Profilu</profileLink>  ta su alidzets limba  a voastã.
sc-review-title = Fãtsets controlã  pi frazili
sc-review-loading = Li-umpli frazili...
sc-review-select-language = Vã pãlãcãrsim alidzets limbã ta s-fãtsets controlã pi frazili
sc-review-no-sentences = Noari frazi ti controlã. <addLink>Bãgats tora ma multi frazi!</addLink>
sc-review-form-prompt =
    .message = Frazili a curi lã featsit controlã nu suntu dati, hits siyuri?
sc-review-form-usage = Tradzets nandreaptã s-arãmãnã fraza. Tradzets nastãnga ta su arcats. Tradzets tu ãnsus ta su-tritsets fraza. <strong>S-nu vã agãrshits su dats controla tsi u-featsit!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Izvorlu/fontu: { $sentenceSource }
sc-review-form-button-reject = Arucã
sc-review-form-button-skip = Ansari
sc-review-form-button-approve = S-armãnã
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Putets s-ufilisits Keyboard Shortcuts: { sc-review-form-button-approve-shortcut } s-armãnã, { sc-review-form-button-reject-shortcut } su arcats, { sc-review-form-button-skip-shortcut } s-ansarã
sc-review-form-button-submit =
    .submitText = Bitsisea cu controla
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nu easti faptã controlã pi frazili.
        [one] Easti faptã controlã mash pi 1 frazã. Haristo multu!
       *[other] { $sentences } frazi pi cari easti faptã controlã. Haristo multu!
    }
sc-review-form-review-failure = Controla pi frazili nu poati su tsãnem. Vã pãlãcãrsim fãtsets probã cama amãnat.
sc-review-link = Controlã

## REVIEW CRITERIA

sc-criteria-modal = ⓘControlã pi criteriili
sc-criteria-title = Controlã pi criteriili
sc-criteria-make-sure = Asiyurats vã ca fraza li-umpli aesti criterii:
sc-criteria-item-1 = Fraza lipseashti s-hibã corect ãngrãpsitã.
sc-criteria-item-2 = Fraza lipseashti s-hibã ãngrãpsitã cu gramaticã corectã.
sc-criteria-item-3 = Fraza lipseashti s-zburascã.
sc-criteria-item-4 = Fraza cara s-li agiungã criteriiliI, calcã &quot;S-armãnã&quot; nasturlu di nandreapta.
sc-criteria-item-5-2 = Maca fraza s-nu li-umpli criteriili di ma ãnsus, calcã&quot;Arucã&quot; nasturlu di na stãnga. Cara s-nu hits siyuri ti fraza, putets su-ansãrets, su-tritsets shi s-tritsets la alantã.
sc-criteria-item-6 = Cara s-nu avets frazi ti controlã, vã pãlãcãrsim agiutats  s-adunãm ma multi frazi!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Fã controlã<icon></icon> desi aestã frazã lingvistic easti corectã?
sc-review-rules-title = Desi fraza easti cu instructsiili?
sc-review-empty-state = Aoatsi noari frazi pi aestã limbã ta s-lã si facã controlã.
report-sc-different-language = Altã limbã
report-sc-different-language-detail = Aestã easti ãngrãpsitã pi altã limbã di atsea tsi lj-fac controlã.
sentences-fetch-error = S-featsi alatus cãndu eara loati frazili
review-error = S-featsi alatus tu controla alishtei frazã
review-error-rate-limit-exceeded = Ti ayunjiseshtsã multu. Vã pãlãcãrsim fãtsets njicã pauzã ta s-adrats controlã pi frazili ta hits siyur cã easti corect.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Fãtsem mãri alãxeri
sc-redirect-page-subtitle-1 = Sentence Collector  va s-intrã tu inima di Common Voice platforma. Voi putets tora <writeURL>s-ãngrãpsits</writeURL> frazã ica  <reviewURL>controlã</reviewURL> unã frazã
sc-redirect-page-subtitle-2 = Ãntribats nã ti<matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink>ica <emailLink>email</emailLink>
# menu item
review-sentences = Fã controlã pi frazili
