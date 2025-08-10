## REVIEW

sc-review-lang-not-selected = Bo no a skohe niun idioma. Bai na bo <profileLink>Perfil</profileLink> i skohe unu òf mas idioma.
sc-review-title = Revisá Frase
sc-review-loading = Kargando frase …
sc-review-select-language = Skohe un idioma pa kuminsá revisá frase.
sc-review-no-sentences = No tin frase pa revisá. <addLink>Agregá mas frase awor!</addLink>
sc-review-form-prompt =
    .message = Bo no a manda e frasenan revisá. Bo ta sigur?
sc-review-form-usage = Swipe bai banda drechi pa aprobá e frase. Swipe bai banda robes pa rechas'é. Swipe bai ariba pa salt'é (sigui sin aprob'é ni rechas'é). <strong>No lubidá di entregá bo revishon!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Fuente: { $sentenceSource }
sc-review-form-button-reject = Rechasá
sc-review-form-button-skip = Salta (no aprobá ni rechasá ainda)
sc-review-form-button-approve = Aprobá
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Bo por usa shortcut tambe: { sc-review-form-button-approve-shortcut } pa Aprobá, { sc-review-form-button-reject-shortcut } pa Rechasá, { sc-review-form-button-skip-shortcut } pa Salta
sc-review-form-button-submit =
    .submitText = Kompletá Revishon
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Sero frase revisá.
        [one] 1 frase revisá. Masha danki!
       *[other] { $sentences } frase revisá. Masha danki!
    }
sc-review-form-review-failure = No por a warda e revishon. Purba di nobo akiratu.
sc-review-link = Revisá

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kriterio di revishon
sc-criteria-title = Kriterio di revishon
sc-criteria-make-sure = Kontrolá si e frase ta kumpli ku e siguiente kriterionan:
sc-criteria-item-1 = Ortografia di e frase mester ta korekto.
sc-criteria-item-2 = Gramátika di e frase mester ta korekto.
sc-criteria-item-3 = Mester por pronunsiá e frase.
sc-criteria-item-4 = Si e frase ta kumpli ku e kriterionan, klek riba e boton &quot;Approve&quot; na man drechi.
sc-criteria-item-5-2 = Si e frase no ta kumpli ku e kriterionan menshoná, klek riba e boton &quot;Reject&quot; na man robes. Si bo ta duda tokante e frase, bo por salt'é tambe i sigui ku un otro.
sc-criteria-item-6 = Si bo no a sobra mas frase pa revisá, (sea asina bon di) yuda nos haña mas frase!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Revisá <icon></icon> si e frase akí ta lingwístikamente korekto?
sc-review-rules-title = E frase ta kumpli ku e reglanan?
sc-review-empty-state = Aktualmente, no tin niun frase na e idioma akí pa revisá.
report-sc-different-language = Otro idioma
report-sc-different-language-detail = E idioma ku e ta skirbí aden no ta esun ku mi ta revisando.
sentences-fetch-error = Un eror a presentá na momento di rekuperá e frasenan
review-error = Un eror a presentá na momento di revisá e frase akí
review-error-rate-limit-exceeded = Bo ta bai muchu lihé. Sea asina bon di tuma bo tempu pa revisá e frase i wak sigur si e ta korekto.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Nos ta hasiendo algun kambio importante
sc-redirect-page-subtitle-1 = Sentence Collector lo muda bai riba e plataforma sentral di Common Voice. Awor, bo por <writeURL>skirbi</writeURL> un frase òf <reviewURL>revisá</reviewURL> frase individual mandá, riba Common Voice.
sc-redirect-page-subtitle-2 = Bo por hasi nos bo preguntanan riba <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> òf via <emailLink>e-mail</emailLink>.
# menu item
review-sentences = Revisá Frase
