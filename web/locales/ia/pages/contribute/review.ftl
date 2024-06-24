## REVIEW

sc-review-lang-not-selected = Tu non ha seligite ulle linguas. Va a tu <profileLink>Profilo</profileLink> pro eliger linguas.
sc-review-title = Revider phrases
sc-review-loading = Cargante phrases…
sc-review-select-language = Elige un lingua pro revider le phrases.
sc-review-no-sentences = Nulle phrases a revider. <addLink>Adde altere phrases ora!</addLink>
sc-review-form-prompt =
    .message = Le phrases revidite non es inviate! Es tu secur?
sc-review-form-usage = Glissa a dextera pro approbar le phrase. Glissa a sinistra pro rejectar lo. <strong>Non oblida de inviar tu revision!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Fonte: { $sentenceSource }
sc-review-form-button-reject = Rejectar
sc-review-form-button-skip = Saltar
sc-review-form-button-approve = Approbar
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Tu pote alsi usar le vias breve de claviero: { sc-review-form-button-approve-shortcut } pro approvar, { sc-review-form-button-reject-shortcut } pro rejectar, { sc-review-form-button-skip-shortcut } pro saltar
sc-review-form-button-submit =
    .submitText = Finir revision
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nulle phrases revidite
        [one] 1 phrase revidite. Gratias!
       *[other] { $sentences } phrases revidite. Gratias!
    }
sc-review-form-review-failure = Impossibile salvar le revision. Retenta plus tarde.
sc-review-link = Revider

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Criterios de revision
sc-criteria-title = Criterios de revision
sc-criteria-make-sure = Verifica que le phrase satisface le sequente criterios:
sc-criteria-item-1 = Le orthographia del phrase debe esser correcte.
sc-criteria-item-2 = Le phrase debe esser grammaticalmente correcte.
sc-criteria-item-3 = Le phrase debe esser pronunciabile.
sc-criteria-item-4 = Si le phrase satisface le criterios, clicca le button &quot;Approbar&quot; a dextera.
sc-criteria-item-5-2 = Si le phrase non satisface le criterios de supra, clicca le button &quot;Rejectar&quot; a sinistra. Si tu non es secur del phrase, tu pote alsi saltar lo e mover sur illo sequente.
sc-criteria-item-6 = Si tu non es secur del phrase, tu pote alsi saltar lo e mover a illo sequente.

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Verifica <icon></icon>es iste un phrase linguisticamente correcte?
sc-review-rules-title = An le phrase satisface le lineas guida?
sc-review-empty-state = Il ha actualmente nulle phrases a revider in iste lingua.
report-sc-different-language = Lingua differente
report-sc-different-language-detail = Illo es scripte in un lingua differente que lo que io revide.
sentences-fetch-error = Un error occurreva durante le recuperation del phrases
review-error = Un error occurreva durante le revision de iste phrase
review-error-rate-limit-exceeded = Tu vade troppo rapide. Attende un momento pro revider que le phrase es correcte.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Nos va facer alcun grande cambios
sc-redirect-page-subtitle-1 = Le Collector de phrases se move al nucleo del platteforma Common Voice. Ora tu pote <writeURL>scriber</writeURL> un phrase o <reviewURL>revider</reviewURL> singule invios de phrases sur Common Voice.
sc-redirect-page-subtitle-2 = Demanda nos questiones sur <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> o <emailLink>email</emailLink>.

