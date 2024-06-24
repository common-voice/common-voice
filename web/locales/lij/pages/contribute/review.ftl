## REVIEW

sc-review-lang-not-selected = No t’æ çernuo nisciuña lengua. Vanni in sciô teu <profileLink>Profî</profileLink> per çerne e lengue.
sc-review-title = Verifica de frase
sc-review-loading = Carregamento de frase…
sc-review-select-language = Çerni unna lengua pe verificâ e frase.
sc-review-no-sentences = Nisciuña frase da verificâ. <addLink>Azzonzi de atre frase oua!</addLink>
sc-review-form-prompt =
    .message = E frase verificæ no en stæte mandæ, t’ê seguo?
sc-review-form-usage = Scuggia in sciâ drita pe approvâ a frase. Scuggia in sciâ manciña pe refuâla. Scuggia de d‘ato pe passâ. <strong>No ascordâte de mandâ a teu revixon!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Vivagna: { $sentenceSource }
sc-review-form-button-reject = Refua
sc-review-form-button-skip = Passa
sc-review-form-button-approve = Appreuva
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Ti peu addeuviâ ascì i scorsaieu da tastea: { sc-review-form-button-approve-shortcut } pe approvâ, { sc-review-form-button-reject-shortcut } pe refuâ, { sc-review-form-button-skip-shortcut } pe passâ
sc-review-form-button-submit =
    .submitText = Termina a verifica
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nisciuña frase verificâ.
        [one] 1 frase verificâ. Graçie!
       *[other] { $sentences } frase verificæ. Graçie!
    }
sc-review-form-review-failure = No emmo posciuo sarvâ e verifiche. Preuva torna ciù tardi.
sc-review-link = Verifica

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Critëi de verifica
sc-criteria-title = Critëi de verifica
sc-criteria-make-sure = Asseguite che e frase satisfan i critëi chì dabasso:
sc-criteria-item-1 = E frase an da ëse scrite sensa erroî de ortografia.
sc-criteria-item-2 = E frase an da ëse grammaticalmente corrette.
sc-criteria-item-3 = E fräse an da ëse prononçiabile.
sc-criteria-item-4 = Se a frase a satisfa i critëi, sciacca o pommello «Appreuva» in sciâ drita.
sc-criteria-item-5-2 = Se a frase a no satisfa i critëi chì de d’ato, sciacca in sciô pommello «Refua» in sciâ manciña. Se no t’ê seguo, ti peu ascì passâ à quella apreuvo.
sc-criteria-item-6 = Se no gh’é ciù de frase da approvâ, aggiuttine à arrecheuggine de atre!

sc-review-rules-title = A frase a respeta e linie guidda?
sc-review-empty-state = Pe-o momento no gh’é de frase da verificâ pe sta lengua.
report-sc-different-language = Atra lengua
report-sc-different-language-detail = A l’é scrita inte unna lengua despægia da quella che son apreuvo à verificâ.
sentences-fetch-error = Gh’é stæto un errô into recoverâ e frase
review-error = Gh’é stæto un errô inta verifica de sta frase
review-error-rate-limit-exceeded = T’ê tròppo lesto. Piggite un pittin ciù de tempo pe vedde torna a frase e asseguâte ch’a segge boña.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Semmo apreuvo à fâ di cangiamenti importanti
sc-redirect-page-subtitle-1 = O Sentence Collector o l’é apreuvo à mesciâse in sciâ ciattaforma prinçipale de Common Voice. Oua ti peu <writeURL>scrive</writeURL> unna frase ò <reviewURL>verificâ</reviewURL> e frase mandæ in sce Common Voice.
sc-redirect-page-subtitle-2 = Poñine de domande in sce <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ò pe <emailLink>email</emailLink>.
