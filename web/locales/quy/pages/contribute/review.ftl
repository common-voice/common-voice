## REVIEW

sc-review-lang-not-selected = No ha seleccionado ningún idioma. Vaya a su <profileLink>Perfil</profileLink> para seleccionar idiomas.
sc-review-title = Oraciones revisadas
sc-review-loading = Cargando oraciones...
sc-review-select-language = Por favor selecciona un idioma para revisar oraciones
sc-review-no-sentences = No hay oraciones para revisar. <addLink>¡Agregue más oraciones ahora!</addLink>
sc-review-form-prompt =
    .message = Oraciones revisadas no enviadas, estás seguro?
sc-review-form-usage = Desliza hacia la derecha para aprobar la oración. Desliza hacia la izquierda para rechazarlo. Desliza hacia arriba para omitirlo. <strong>¡No olvides enviar tu reseña!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Fuente: { $sentenceSource }
sc-review-form-button-reject = Rechazar
sc-review-form-button-skip = Saltar
sc-review-form-button-approve = Aprobar
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = K
sc-review-form-keyboard-usage-custom = También puede usar atajos de teclado: { sc-review-form-button-approve-shortcut } para aprobar, { sc-review-form-button-reject-shortcut } para rechazar, { sc-review-form-button-skip-shortcut } para Saltar
sc-review-form-button-submit =
    .submitText = Finalizar la revisión
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] No hay oraciones revisadas.
        [one] 1 oración revisada. Gracias!
       *[other] { $sentences } oraciones revisadas. Gracias!
    }
sc-review-form-review-failure = Revisión no se puede grabar. Por favor intentar de nuevo.
sc-review-link = Revisar

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Criterios de revisión
sc-criteria-title = Criterios de revisión
sc-criteria-make-sure = Asegúrese de que la oración cumpla con los siguientes criterios:
sc-criteria-item-1 = La oración debe estar escrita correctamente.
sc-criteria-item-2 = La oración debe ser gramaticamente correcta.
sc-criteria-item-3 = La oración debe ser pronunciable.
sc-criteria-item-4 = Si la oración cumple con los criterios, haga clic en el botón &quot;Aprobar&quot; de la derecha.
sc-criteria-item-5-2 = Si la oración no cumple con los criterios anteriores, haga clic en &quot;Rechazar&quot; el botón de la izquierda. Si no está seguro acerca de la oración, también puede omitirla y pasar a la siguiente.
sc-criteria-item-6 = Si se queda sin oraciones para revisar, ¡por favor ayúdenos a recopilar más oraciones!

