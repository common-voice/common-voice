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

## REVIEW CRITERIA

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Marque <icon></icon> Ye esta una oración lingüisticament correcta?
sc-review-rules-title = La sentencia cumple con as pautas?
sc-review-empty-state = Actualment no i hai frases pa revisar en este idioma.
report-sc-different-language = Unatro idioma
report-sc-different-language-detail = Ye escrito en un idioma diferent a lo cual soi revisando.
sentences-fetch-error = Se produció una error en buscar oracions.
review-error = Se produció una error en revisar esta oración.
review-error-rate-limit-exceeded = Vas masiau rapido. se Prenga un momento pa revisar la oración y asegurar-se que sía correcta.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Somos fendo grans cambios
sc-redirect-page-subtitle-1 = Sentence Collector se ye tresladando a la plataforma prencipal de Common Voice. Agora puede <writeURL>escribir</writeURL> una oración u <reviewURL>revisar</reviewURL> envíos d'oracions individuals en Common Voice.
sc-redirect-page-subtitle-2 = nos Faiga preguntas en <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> u <emailLink>email</emailLink>.
