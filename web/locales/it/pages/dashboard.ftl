## Dashboard

your-languages = Le tue lingue
toward-next-goal = Verso il prossimo obiettivo
goal-reached = Obiettivo raggiunto
clips-you-recorded = Registrazioni che hai immesso
clips-you-validated = Registrazioni che hai convalidato
todays-recorded-progress = Progresso di Common Voice di oggi sulle registrazioni immesse
todays-validated-progress = Progresso di Common Voice di oggi sulle registrazioni convalidate
stats = Statistiche
awards = Riconoscimenti
you = Tu
everyone = Tutti
contribution-activity = Contributi
top-contributors = Collaboratori principali
recorded-clips = Registrazioni immesse
validated-clips = Registrazioni convalidate
total-approved = Totale approvato
overall-accuracy = Precisione complessiva
set-visibility = Imposta la mia visibilità
visibility-explainer = Questa impostazione controlla la tua visibilità nella classifica. Selezionando l’opzione Nascosto le tue attività rimarranno riservate, cioè la tua immagine, il nome utente e i progressi non appariranno sulla classifica. Tieni presente che la classifica impiega { $minutes } minuti per aggiornarsi.
visibility-overlay-note = Nota: l’opzione Visibile può essere modificata successivamente in <profileLink>Profilo</profileLink>
show-ranking = Mostra la mia posizione

## Custom Goals

get-started-goals = Comincia a utilizzare gli obiettivi
create-custom-goal = Crea un obiettivo personale
goal-type = Qual è il tuo obiettivo?
both-speak-and-listen = Entrambi
both-speak-and-listen-long = Entrambi (registrare e convalidare)
daily-goal = Obiettivo giornaliero
weekly-goal = Obiettivo settimanale
easy-difficulty = Facile
average-difficulty = Medio
difficult-difficulty = Difficile
pro-difficulty = Esperto
lose-goal-progress-warning = Se modifichi l’obiettivo potresti perdere gli attuali progressi.
want-to-continue = Vuoi continuare?
finish-editing = Vuoi finire prima le modifiche?
lose-changes-warning = Se esci ora, perderai le tue modifiche
build-custom-goal = Crea un obiettivo personale
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Aiuta a raggiungere { $hours } ora in { $language } con un obiettivo personale
       *[other] Aiuta a raggiungere { $hours } ore in { $language } con un obiettivo personale
    }
help-reach-hours-general-pluralized =
    Aiuta Common Voice a raggiungere { NUMBER($hours) ->
        [one] { $hours } ora
       *[other] { $hours } ore
    } in una lingua con gli obiettivi personali
set-a-goal = Imposta un obiettivo
cant-decide = Sei indeciso?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } ora
       *[other] { $totalHours } ore
    } è un obiettivo che può essere raggiunto in solo { NUMBER($periodMonths) ->
        [one] { $periodMonths } mese
       *[other] { $periodMonths } mesi
    } da { NUMBER($people) ->
        [one] { $people } persona
       *[other] { $people } persone
    } producendo { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } registrazione
       *[other] { $clipsPerDay } registrazioni
    } al giorno.
how-many-per-day = Ottimo! Quante registrazioni al giorno?
how-many-a-week = Ottimo! Quante registrazioni a settimana?
which-goal-type = Vuoi registrare, convalidare o entrambi?
receiving-emails-info = Hai richiesto di ricevere email come: promemoria degli obiettivi, aggiornamenti sui progressi e newsletter su Common Voice.
not-receiving-emails-info = Con la scelta attuale <bold>NON</bold> riceverai email come promemoria degli obiettivi, aggiornamenti sui progressi e newsletter riguardo Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } registrazione
       *[other] { $count } registrazioni
    }
help-share-goal = Aiutaci a trovare più voci, condividi il tuo obiettivo
confirm-goal = Conferma obiettivo
goal-interval-weekly = Settimanale
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Condividi il tuo obiettivo quotidiano di { $count } registrazioni per { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Condividi il tuo obiettivo settimanale di { $count } registrazioni per { $type }
share-goal-type-speak = Registrare
share-goal-type-listen = Convalidare
share-goal-type-both = Registrare e convalidare
# LINK will be replaced with the current URL
goal-share-text = Ho appena creato un obiettivo personale per donare la mia voce a #CommonVoice: unisciti a noi e aiutaci a insegnare alle macchine come parlano le persone reali { $link }
weekly-goal-created = Obiettivo settimanale creato
daily-goal-created = Obiettivo quotidiano creato
track-progress = Tieni traccia dei progressi qui e nella tua pagina delle statistiche.
return-to-edit-goal = Per modificare il tuo obiettivo ritorna qui quando vuoi.
share-goal = Condividi il mio obiettivo

## Goals

streaks = Tracce
days =
    { $count ->
        [one] Giorno
       *[other] Giorni
    }
recordings =
    { $count ->
        [one] Registrazione
       *[other] Registrazioni
    }
validations =
    { $count ->
        [one] Convalida
       *[other] Convalide
    }
