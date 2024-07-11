action-click = Fai clic su
action-tap = Tocca
contribute = Contribuisci
review = Convalida
skip = Salta
shortcuts = Scorciatoie
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> registrazione
       *[other] <bold>{ $count }</bold> registrazioni
    }
goal-help-recording = Hai aiutato Common Voice a raggiungere <goalPercentage></goalPercentage> del traguardo giornaliero { $goalValue } per le registrazioni.
goal-help-validation = Hai aiutato Common Voice a raggiungere <goalPercentage></goalPercentage> del traguardo giornaliero { $goalValue } per le convalide.
contribute-more = Sei pronto a farne ancora { $count }?
speak-empty-state = Abbiamo esaurito le frasi da registrare in questa lingua…
no-sentences-for-variants = Può darsi che non ci siano più frasi disponibili per la tua lingua. Se vuoi, puoi modificare le impostazioni per visualizzare altre frasi nella tua lingua.
speak-empty-state-cta = Contribuisci con altre frasi
speak-loading-error =
    Non è stato possibile caricare alcuna frase da registrare.
    Riprova più tardi.
record-button-label = Registra la tua voce
share-title-new = <bold>Aiutaci</bold> a trovare altre voci
keep-track-profile = Tieni traccia dei progressi con un profilo
login-to-get-started = Accedi o registrati per iniziare
target-segment-first-card = Stai contribuendo al primo segmento obiettivo
target-segment-generic-card = Stai contribuendo a un segmento obiettivo
target-segment-first-banner = Aiuta a creare il primo segmento obiettivo di Common Voice in { $locale }
target-segment-add-voice = Aggiungi la tua voce
target-segment-learn-more = Scopri di più
change-preferences = Modifica le preferenze

## Contribution Nav Items

contribute-voice-collection-nav-header = Raccolta di voci
contribute-sentence-collection-nav-header = Raccolta di frasi

## Reporting

report = Segnala
report-title = Invia una segnalazione
report-ask = Quali problemi stai riscontrando con questa frase?
report-offensive-language = Linguaggio offensivo
report-offensive-language-detail = La frase utilizza un linguaggio irrispettoso o offensivo.
report-grammar-or-spelling = Errore grammaticale o di ortografia
report-grammar-or-spelling-detail = La frase ha un errore grammaticale o di ortografia.
report-different-language = Lingua diversa
report-different-language-detail = È scritta in una lingua diversa da quella che sto parlando.
report-difficult-pronounce = Difficile da pronunciare
report-difficult-pronounce-detail = Contiene parole o frasi difficili da leggere o pronunciare.
report-offensive-speech = Discorso offensivo
report-offensive-speech-detail = La registrazione utilizza un linguaggio irrispettoso o offensivo.
report-other-comment =
    .placeholder = Commento
success = Completato
continue = Continua
report-success = La segnalazione è stata inviata correttamente.

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Registra/Interrompi
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Ripeti la registrazione
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Scarta la registrazione corrente
shortcut-submit = Invio
shortcut-submit-label = Invia registrazioni
request-language-text = Non trovi la tua lingua su Common Voice?
request-language-button = Richiedi una lingua

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Riproduci/Interrompi
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Linee guida
contribution-criteria-link = Leggi le linee guida di contribuzione
contribution-criteria-page-title = Linee guida di contribuzione
contribution-criteria-page-description = Scopri a che cosa devi prestare attenzione mentre ascolti le registrazioni e anche come poter rendere migliori le tue!
contribution-for-example = per esempio
contribution-misreadings-title = Errori di lettura
contribution-misreadings-description = Durante l’ascolto, controlla attentamente che quanto registrato corrisponda esattamente a quanto scritto e rifiuta la registrazione se sono presenti anche solo errori minimi. <br />Errori molto comuni includono:
contribution-misreadings-description-extended-list-1 = Mancanza di <strong>articoli indeterminativi</strong> (“Uno”, “Una”, ecc.) o <strong>determinativi</strong> (“Gli”, “Le”, ecc.) all’inizio della registrazione.
contribution-misreadings-description-extended-list-2 = Mancanza della <strong>vocale finale</strong> in una parola.
contribution-misreadings-description-extended-list-3 = Lettura di elisioni che non sono presenti nel testo originale, come “Non t’ho detto” al posto di “Non ti ho detto” o viceversa.
contribution-misreadings-description-extended-list-4 = Mancanza della fine dell’ultima parola a causa dell’interruzione anticipata della registrazione.
contribution-misreadings-description-extended-list-5 = Numerosi tentativi di lettura di una parola.
contribution-misreadings-example-1-title = I dinosauri giganti del Triassico.
contribution-misreadings-example-2-title = I dinosauro giganti del Triassico.
contribution-misreadings-example-2-explanation = [Dovrebbe essere “dinosauri”]
contribution-misreadings-example-3-title = I dinosauri giganti del Triassi-.
contribution-misreadings-example-3-explanation = [La registrazione si interrompe prima della fine dell’ultima parola]
contribution-misreadings-example-4-title = I dinosauri giganti del Triassico. Sì.
contribution-misreadings-example-4-explanation = [È stato registrato più testo del necessario]
contribution-misreadings-example-5-title = Questa è una bella giornata.
contribution-misreadings-example-6-title = Quest’estate fa caldo.
contribution-misreadings-example-6-explanation = [Dovrebbe essere “Questa estate”]
contribution-misreadings-example-7-title = Questa estate fa un caldo.
contribution-misreadings-example-7-explanation = [“un” non è presente nella frase originale]
contribution-misreadings-example-8-title = Questa è una bella giornata.
contribution-misreadings-example-8-explanation = [Il contenuto non corrisponde]
contribution-varying-pronunciations-title = Variazioni della pronuncia
contribution-varying-pronunciations-description = Procedi con cautela prima di rifiutare una registrazione in cui, a tuo avviso, il lettore ha sbagliato la pronuncia di una parola, ha posto male l’accento o ha apparentemente ignorato un punto interrogativo. Nel mondo, infatti, è in uso un’ampia varietà di pronunce e potresti non aver mai avuto l’occasione di ascoltarne alcune nella tua zona. Prevedi un certo margine di elasticità come segno di apprezzamento per le persone che parlano in modo diverso dal tuo.
contribution-varying-pronunciations-description-extended = Se però credi che il lettore non conoscesse quella parola e semplicemente la sua ipotesi sulla pronuncia non sia corretta, rifiuta la registrazione. Se non sei sicuro, utilizza il pulsante Salta.
contribution-varying-pronunciations-example-1-title = Stava gettando l’ancora in mare.
contribution-varying-pronunciations-example-1-explanation = [A seconda dello spostamento dell’accento da una sillaba all’altra, “ancora” può essere letto sia “àncora” (sostantivo) sia “ancóra” (avverbio)]
contribution-varying-pronunciations-example-2-title = Abiamo tanto tempo.
contribution-varying-pronunciations-example-2-explanation = [Le doppie vanno sempre pronunciate in italiano, quindi dovrebbe essere “Abbiamo”]
contribution-background-noise-title = Rumore di sottofondo
contribution-background-noise-description = Vogliamo che l’algoritmo di machine learning sia in grado di gestire una vasta gamma di rumori di sottofondo. I rumori relativamente forti possono essere accettati a patto che non impediscano di ascoltare l’interezza del testo. Una musica di sottofondo tranquilla è accettabile mentre non lo è una musica con un volume così forte da impedire di sentire ogni singola parola.
contribution-background-noise-description-extended = Se la registrazione si interrompe o presenta dei fruscìi, rifiutala a meno che il testo non possa essere ascoltato in tutta la sua interezza.
contribution-background-noise-example-1-fixed-title = <strong>[Starnuto]</strong> I dinosauri giganti del <strong>[tosse]</strong> Triassico.
contribution-background-noise-example-2-fixed-title = I dino <strong>[tosse]</strong> del Triassico.
contribution-background-noise-example-2-explanation = [Una parte del testo non si sente nella registrazione]
contribution-background-noise-example-3-fixed-title = <strong>[Fruscìo]</strong> dinosauri giganti del <strong>[fruscìo]</strong> -riassico.
contribution-background-voices-title = Voci di sottofondo
contribution-background-voices-description = Un normale rumore di sottofondo è accettabile, ma non vogliamo che la presenza di voci extra possa portare l’algoritmo a identificare parole che non sono scritte nel testo; solitamente questo capita quando una televisione è rimasta accesa o quando è in corso una conversazione nelle vicinanze. Se riesci a sentire nitidamente parole che non sono presenti nel testo, devi rifiutare la registrazione.
contribution-background-voices-description-extended = Se la registrazione si interrompe o presenta dei fruscìi, rifiutala a meno che il testo non possa essere ascoltato in tutta la sua interezza.
contribution-background-voices-example-1-title = I dinosauri giganti del Triassico. <strong>[letto da una prima voce]</strong>
contribution-background-voices-example-1-explanation = Vieni? <strong>[chiamata fatta da una seconda voce]</strong>
contribution-volume-title = Volume
contribution-volume-description = Le voci dei differenti lettori presentano delle variazioni naturali di volume. Rifiuta la registrazione solo se il volume è talmente alto da interromperla o, caso più frequente, quando è talmente basso da non poter sentire quello che viene detto senza prendere il testo scritto come riferimento.
contribution-reader-effects-title = Emozioni nella voce del lettore
contribution-reader-effects-description = La maggior parte delle registrazioni contiene voci di persone che parlano con un tono naturale. Puoi accettare registrazioni, sporadiche e non consuete, che siano gridate, dette sottovoce o dal tono chiaramente “drammatico”. Rifiuta le registrazioni cantate e quelle in cui è stato utilizzato un sintetizzatore vocale.
contribution-just-unsure-title = Hai ancora dei dubbi?
contribution-just-unsure-description = Se ti imbatti in una situazione che non è prevista in queste linee guida, convalida seguendo il tuo giudizio. Se davvero non riesci a decidere, utilizza il pulsante Salta e passa alla registrazione seguente.
see-more = <chevron></chevron>Mostra di più
see-less = <chevron></chevron>Mostra di meno
