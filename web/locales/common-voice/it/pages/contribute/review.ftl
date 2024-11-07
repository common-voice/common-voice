## REVIEW

sc-review-lang-not-selected = Non hai selezionato alcuna lingua. Vai nel tuo <profileLink>Profilo</profileLink> per selezionare le lingue.
sc-review-title = Convalida frasi
sc-review-loading = Caricamento frasi…
sc-review-select-language = Seleziona una lingua per convalidare le frasi.
sc-review-no-sentences = Nessuna frase da convalidare. <addLink>Aggiungi altre frasi ora!</addLink>
sc-review-form-prompt =
    .message = Le frasi convalidate non sono state inviate, vuoi lasciare la pagina?
sc-review-form-usage = Scorri verso destra per convalidare la frase. Scorri verso sinistra per rifiutarla. Scorri verso l’alto per saltarla. <strong>Non dimenticare di inviare le tue convalide!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Fonte: { $sentenceSource }
sc-review-form-button-reject = Rifiuta
sc-review-form-button-skip = Salta
sc-review-form-button-approve = Approva
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Puoi anche utilizzare le scorciatoie da tastiera: { sc-review-form-button-approve-shortcut } per approvare, { sc-review-form-button-reject-shortcut } per rifiutare, { sc-review-form-button-skip-shortcut } per saltare
sc-review-form-button-submit =
    .submitText = Termina la convalida
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nessuna frase convalidata.
        [one] 1 frase convalidata. Grazie.
       *[other] { $sentences } frasi convalidate. Grazie.
    }
sc-review-form-review-failure = Impossibile salvare le convalide. Riprova più tardi.
sc-review-link = Convalida

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Regole di convalida
sc-criteria-title = Regole di convalida
sc-criteria-make-sure = Assicurati che la frase soddisfi le seguenti regole:
sc-criteria-item-1 = La frase deve essere corretta dal punto di vista dell’ortografia.
sc-criteria-item-2 = La frase deve essere grammaticalmente corretta.
sc-criteria-item-3 = La frase deve essere pronunciabile.
sc-criteria-item-4 = Se la frase soddisfa le regole di convalida, fai clic sul pulsante &quot;Approva&quot; sulla destra
sc-criteria-item-5-2 = Se la frase non rispetta le regole precedenti, fai clic sul pulsante &quot;Rifiuta&quot; sulla sinistra. Se non sei sicuro della frase, puoi saltarla e passare alla successiva.
sc-criteria-item-6 = Se hai terminato le frasi da convalidare, aiutaci a raccogliere altre frasi!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = <icon></icon> Verifica che si tratti di una frase corretta dal punto di vista linguistico?
sc-review-rules-title = La frase rispetta le linee guida?
sc-review-empty-state = Al momento non ci sono frasi da convalidare in questa lingua.
report-sc-different-language = Lingua diversa
report-sc-different-language-detail = È scritta in una lingua diversa da quella che sto convalidando.
sentences-fetch-error = Si è verificato un errore durante il recupero delle frasi
review-error = Si è verificato un errore durante la convalida della frase
review-error-rate-limit-exceeded = Stai andando troppo veloce. Prenditi tempo per rivedere la frase e assicurarti che sia corretta.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Stiamo apportando alcuni cambiamenti significativi
sc-redirect-page-subtitle-1 = Il Sentence Collector si sta spostando sulla piattaforma principale di Common Voice. Ora puoi <writeURL>scrivere</writeURL> una frase o <reviewURL>esaminare</reviewURL> gli invii di frasi singole su Common Voice.
sc-redirect-page-subtitle-2 = Ponici domande su <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> o tramite <emailLink>email</emailLink>.
