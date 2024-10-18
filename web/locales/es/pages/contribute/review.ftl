## REVIEW

sc-review-lang-not-selected = Aún no has seleccionado un idioma. Por favor, ve a <profileLink>Perfil</profileLink> para seleccionar uno o más idiomas.
sc-review-title = Revisar oraciones
sc-review-loading = Cargando oraciones...
sc-review-select-language = Selecciona un idioma para revisarle las oraciones.
sc-review-no-sentences = Ya no hay oraciones para revisar. ¡<addLink>Agrega más oraciones</addLink>!
sc-review-form-prompt =
    .message = No se han enviado las revisiones, ¿estás seguro/a?
sc-review-form-usage = Desliza a la derecha para aprobar la oración. Desliza a la izquierda para rechazarla. Desliza hacia arriba para saltarla. <strong>¡No olvides de enviar tu revisión!</strong>
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
sc-review-form-button-skip-shortcut = T
sc-review-form-button-submit =
    .submitText = Acabar de revisar
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ninguna oración revisada.
        [one] Una oración revisada. ¡Gracias!
       *[other] { $sentences } oraciones revisadas. ¡Gracias!
    }
sc-review-form-review-failure = No se pudo guardar la revisión. Vuelve a intentar más tarde.
sc-review-link = Revisar

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Criterios de revisión
sc-criteria-title = Criterios de revisión
sc-criteria-make-sure = Todas las oraciones deben cumplir con los siguientes criterios:
sc-criteria-item-1 = La frase debe estar escrita correctamente.
sc-criteria-item-2 = La oración debe ser gramaticalmente correcta.
sc-criteria-item-3 = La frase debe ser pronunciable.
sc-criteria-item-4 = Si la oración cumple con los criterios, haz clic en &quot;Aprobar&quot; a la derecha.
sc-criteria-item-5-2 = Si la oración no cumple con los criterios, haz clic en &quot;Rechazar&quot; a la izquiera. Si no estás seguro/a, puedes saltarla y pasar a la siguiente.
sc-criteria-item-6 = Si ya no hay más oraciones para revisar, ¡ayúdanos a recopilar más oraciones!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Marque <icon></icon> ¿Es esta una oración lingüísticamente correcta?
sc-review-rules-title = ¿La sentencia cumple con las pautas?
sc-review-empty-state = Actualmente no hay frases para revisar en este idioma.
report-sc-different-language = Otro idioma
report-sc-different-language-detail = Está escrito en un idioma diferente al que estoy revisando.
sentences-fetch-error = Se produjo un error al buscar oraciones.
review-error = Se produjo un error al revisar esta oración.
review-error-rate-limit-exceeded = Vas demasiado rápido. Tómese un momento para revisar la oración y asegurarse de que sea correcta.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Estamos haciendo grandes cambios
sc-redirect-page-subtitle-1 = Sentence Collector se está trasladando a la plataforma principal de Common Voice. Ahora puede <writeURL>escribir</writeURL> una oración o <reviewURL>revisar</reviewURL> envíos de oraciones individuales en Common Voice.
sc-redirect-page-subtitle-2 = Háganos preguntas en <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> o <emailLink>email</emailLink>.
