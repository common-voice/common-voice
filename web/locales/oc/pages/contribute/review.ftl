## REVIEW

sc-review-lang-not-selected = Non auetz seleccionat cap de lengua. Anatz tath vòste <profileLink>Perfil</profileLink> entà escuélher bèra lengua.
sc-review-title = Revisa es frases
sc-review-loading = Se carguen es frases…
sc-review-select-language = Escuelhetz ua lengua entà revisar-ne es frases.
sc-review-no-sentences = Non i a cap de frasa entà revisar. <addLink>Ahigetz mès frases ara!</addLink>
sc-review-form-prompt =
    .message = Non s’an enviat es frases revisades, n’ètz segur/a?
sc-review-form-usage = Lisatz tara dreta entà aprovar era frasa. Lisatz tara quèrra entà refusar-la. Lisatz ensús entà ometer-la. <strong>Non desbrembetz d’enviar era revision!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Hònt: ·{ $sentenceSource }
sc-review-form-button-reject = Refusa
sc-review-form-button-skip = Omet
sc-review-form-button-approve = Apròva
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = O
sc-review-form-keyboard-usage-custom = Tanben podetz emplegar es dreceres de teclat: { sc-review-form-button-approve-shortcut } entà aprovar, { sc-review-form-button-reject-shortcut } entà refusar, { sc-review-form-button-skip-shortcut } entà ométer
sc-review-form-button-submit =
    .submitText = Acaba era revision
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Non auetz revisat cap de frasa.
        [one] Auetz revisat ua frasa. Mercés!
       *[other] Auetz revisat { $sentences } frases. Mercés!
    }
sc-review-form-review-failure = Non s'a pogut sauvar era revision. Tornatz-ac a provar mès tard.
sc-review-link = Revisa

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Critèris de revision
sc-criteria-title = Critèris de revision
sc-criteria-make-sure = Asseguratz-vos de qu'era frasa complís es critèris següents:
sc-criteria-item-2 = Era frasa ei gramaticaument corrècta.
sc-criteria-item-3 = Era frasa ei pronunciabla.
sc-criteria-item-4 = S'era frasa complís es critèris, hetz clic en boton «Apròva».
sc-criteria-item-5-2 = S'era frasa non complís es critèris anteriors, hetz clic en boton «Refusa». Se non n'ètz segur/a, tanben la podetz sautar e passar ara següenta.
