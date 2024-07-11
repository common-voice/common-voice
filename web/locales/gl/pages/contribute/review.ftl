## REVIEW

sc-review-lang-not-selected = Non seleccionou ningún idioma. Vaia ao seu <profileLink>Perfil</profileLink> para seleccionar un idioma.
sc-review-title = Revisar frases
sc-review-loading = Cargando frases...
sc-review-select-language = Seleccione un idioma para revisar frases.
sc-review-no-sentences = Non hai frases para revisar. <addLink>Engada máis frases agora!</addLink>
sc-review-form-prompt =
    .message = Non se enviaron as frases revisadas, está seguro?
sc-review-form-usage = Deslice cara á dereita para aprobar a frase. Deslice cara á esquerda para rexeitala. Deslice cara arriba para omitila. <strong>Non esqueza enviar a súa opinión.</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Fonte: { $sentenceSource }
sc-review-form-button-reject = Rexeitar
sc-review-form-button-skip = Omitir
sc-review-form-button-approve = Aprobar
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = O
sc-review-form-keyboard-usage-custom = Tamén pode empregar os atallos de teclado: { sc-review-form-button-approve-shortcut } para aprobar, { sc-review-form-button-reject-shortcut } para rexeitar, { sc-review-form-button-skip-shortcut } para omitir
sc-review-form-button-submit =
    .submitText = Finalizar revisión
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Non revisou ningunha frase.
        [one] Revisou 1 frase. Grazas!
       *[other] Revisou { $sentences } frases. Grazas!
    }
sc-review-form-review-failure = Non foi posible gardar a revisión. Por favor, inténteo de novo máis tarde.
sc-review-link = Revisar

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Criterios de revisión
sc-criteria-title = Criterios de revisión
sc-criteria-make-sure = Asegúrese de que a frase cumpra os seguintes criterios:
sc-criteria-item-1 = A frase debe estar escrita correctamente.
sc-criteria-item-2 = A frase debe ser gramaticalmente correcta.
sc-criteria-item-3 = A frase debe ser fácil de pronunciar.
sc-criteria-item-4 = Se a frase cumpre os criterios, prema no botón &quot;Aprobar&quot; á dereita.
sc-criteria-item-5-2 = Se a frase non cumpre os criterios anteriores, prema no botón &quot;Rexeitar&quot; á esquerda. Se non está seguro, tamén pode omitir a frase e pasar á seguinte.
sc-criteria-item-6 = Se xa non quedan frases para revisar, axúdenos a recoller máis.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Revise a frase: <icon></icon> é esta unha frase lingüísticamente correcta?
sc-review-rules-title = A frase cumpre as directrices?
sc-review-empty-state = Actualmente non hai frases para revisar neste idioma.
report-sc-different-language = Idioma diferente
report-sc-different-language-detail = Está escrita nun idioma diferente ao que estou revisando.
sentences-fetch-error = Produciuse un erro ao recuperar as frases
review-error = Produciuse un erro ao revisar esta frase
review-error-rate-limit-exceeded = Vai moi á présa. Tómese un momento para revisar a frase e comprobar que é correcta.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Estamos a facer grandes cambios
sc-redirect-page-subtitle-1 = O colector de frases está migrando para a plataforma principal do Common Voice. Agora vostede pode <writeURL>escribir</writeURL> unha frase ou <reviewURL>revisar</reviewURL> envíos de frases soltas no Common Voice.
sc-redirect-page-subtitle-2 = Fáganos preguntas en <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ou por <emailLink>correo electrónico</emailLink>.
