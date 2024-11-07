## REVIEW

sc-review-lang-not-selected = Nigua kuto'od ama nudu, kunód nochi jo'o <profileLink>Perfil</profileLink> tumin kadi kuto'od ama o maska nudu
sc-review-title = Nauné nichid nudu
sc-review-loading = Nimo kanó nudu...
sc-review-select-language = Kuto'od ama nudu tumi kadi namné nichid nudu chi kanejú
sc-review-no-sentences = Amtea nudu chi nichid. ¡<addLink>Diñud ta tea nudu</addLink>!
sc-review-form-prompt =
    .message = Nikua nincho'od nichi a noó nudu. ¿A nda nichid?
sc-review-form-usage = Did deslizar to'o kuakud nichi a noó nudu. Did deslizar to'o kued nichi gua noó. Did deslizar ku ninu tumin cho'o tama nudu. <strong>¡Gua kumjinud dicho'od revisión ne'ed!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Fuente: { $sentenceSource }
sc-review-form-button-reject = Gua noó
sc-review-form-button-skip = Kabyákud
sc-review-form-button-approve = A noó
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = T
sc-review-form-keyboard-usage-custom = Kadintu koto'od  kuu chi joto'y noo { sc-review-form-button-approve-shortcut } tochi a noo, { sc-review-form-button-reject-shortcut } tochi ne'e kanbin, { sc-review-form-button-skip-shortcut } tochi ne'en kabnunn tama nudu
sc-review-form-button-submit =
    .submitText = A chinu nichi a noó
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ni ama nudu nichid a noó
        [one] Ama nudu chi a nichid nichi a noó. ¡Ndios nadibad!
       *[other] { $sentences } nudu chi a noö. ¡Ndios nadibad!
    }
sc-review-form-review-failure = Gua chikadi naba chi nichid chi a noó. Tamnoo nichitud.
sc-review-link = Nichid a noo

## REVIEW CRITERIA

sc-criteria-modal = A dae ne'e ñe'e nichi noo
sc-criteria-title = A dae ne'e ñe'e nichi noo
sc-criteria-make-sure = Nukue nudu ne'e chi di cumplir nuku criterios së.
sc-criteria-item-1 = Noó ne'e chi kanejú nudu.
sc-criteria-item-2 = Noó ne'e chi kanejú nudu.
sc-criteria-item-3 = Nudu a kane chi kadi kamañ
sc-criteria-item-4 = nichi a nudu ku a no ninaa, konto'od &quot; kuaku &quot;  to'o kuakud
sc-criteria-item-5-2 = Nichi nudu gua noo tumin koto'od nochi jo'o chi &quot;gua noó&quot; Nichi gua deanud nichi noó o gua noó kadi kabyakud y cho'o tama nudu.
sc-criteria-item-6 = Nichi a kutea nudu chi kamad nichi noó o gua noó. ¡Kadi kuned insú chi nùn ta tae nudu!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kuned <icon></icon> ¿A noó kanejú nudu ku?
sc-review-rules-title = ¿Chi jo'o a noo, a dama jo'o?
sc-review-empty-state = Mniñun a kutea nudu chi nichid nichi a noó o gua noó ñe'e nudu ku.
report-sc-different-language = tama nudu
report-sc-different-language-detail = Gua ñe'e nudu chi kanejú
sentences-fetch-error = Gua chikadi ndakan tanobe nudu
review-error = Gua noó nichid nuku ku
review-error-rate-limit-exceeded = Yeabean kani kued. Nuk jinu nichid o kunebed nudu.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Yeabean eatea cambios jidin
sc-redirect-page-subtitle-1 = Sentence Collector jino'o no plataforma principal ñe'e Common Voice. Mniñu a kadi <writeURL>kunejud</writeURL> ama nudu o <reviewURL>nichid nichi a noó o gua noó</reviewURL> dicho'od am ama nudu no Common Voice.
sc-redirect-page-subtitle-2 = Tumgo'od insú no <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> o <emailLink>no Email</emailLink>.
