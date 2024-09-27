## REVIEW

sc-review-lang-not-selected = No has triau garra luenga. Ves ta lo tuyo <profileLink>Perfil</profileLink> pa triar luengas.
sc-review-title = Revisas frases
sc-review-loading = Se son cargando las frases…
sc-review-select-language = Tría una luenga pa revisar-ne las frases.
sc-review-no-sentences = No i hai frases a revisar. <addLink>Anyadir mas frases agora!</addLink>
sc-review-form-prompt =
    .message = Las frases revisadas no s'han cargau, en yes seguro?
sc-review-form-usage = Esliza enta la dreita pa aprebar la frase. Esliza enta la zurda pa refusar-la. Esliza enta alto pa omitir-la. <strong>No olbides ninviar la tuya revisión!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Fuent: { $sentenceSource }
sc-review-form-button-reject = Refusar
sc-review-form-button-skip = Omitir
sc-review-form-button-approve = Aprebar
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = O
sc-review-form-keyboard-usage-custom = Tamién puez usar los alcorces de teclau: { sc-review-form-button-approve-shortcut } pa aprebar, { sc-review-form-button-reject-shortcut } pa refusar, { sc-review-form-button-skip-shortcut } pa omitir
sc-review-form-button-submit =
    .submitText = Rematar la revisión
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] No has revisau garra frase
        [one] Has revisau 1 frase. Gracias!
       *[other] Has revisau { $sentences } frases. Gracias!
    }
sc-review-form-review-failure = La revisión no s'ha puesto alzar. Torna-lo a prebar mas enta debant.
sc-review-link = Revisión

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Criterios de revisión
sc-criteria-title = Criterios de revisión
sc-criteria-make-sure = Asegura-te de que las frases cumplen con os siguients criterios:
sc-criteria-item-1 = La frase ha d'estar bien escrita, sin faltas d'ortografía.
sc-criteria-item-2 = La frase ha d'estar correcta gramaticalment.
sc-criteria-item-3 = La frase ha de poder pronunciar-se bien.
sc-criteria-item-4 = Si la frase cumple estes criterios, fe clic en o botón &quot;Aprebar&quot;.
sc-criteria-item-5-2 = Si la frase no cumple con os criterios anteriors, fe clic en o botón &quot;Refusar&quot;. Si no'n yes seguro, tamién puez omitir-la y pasar a la siguient.
sc-criteria-item-6 = Si te quedas sin frases que revisar, aduya-nos a replegar mas frases!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Compreba <icon></icon> Ye esta una oración lingüisticament correcta?
sc-review-rules-title = La frase cumple con as directrices?
sc-review-empty-state = Actualment no queda frases pa revisar en este idioma.
report-sc-different-language = Unatra luenga
report-sc-different-language-detail = Ye escrito en un idioma diferent d'a que soi revisando.
sentences-fetch-error = S'ha produciu una error en obtener las oracions.
review-error = S'ha produciu una error en revisar esta frase.
review-error-rate-limit-exceeded = Vas masiau rapido. Prene-te un momento pa revisar la oración y asegurar-te de que sía correcta.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Somos fendo bels cambios grans
sc-redirect-page-subtitle-1 = Sentence Collector se ye tresladando a la plataforma prencipal de Common Voice. Agora puez <writeURL>escrebir</writeURL> una frase u <reviewURL>revisar</reviewURL> ninvios d'oracions individuals en Common Voice.
sc-redirect-page-subtitle-2 = Fe-nos preguntas en <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> u <emailLink>correu-e</emailLink>.
