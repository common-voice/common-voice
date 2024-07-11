action-click = Klikk
action-tap = Trykk
contribute = Bidra
review = Vurder
skip = Hopp over
shortcuts = Snarvegar
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> lydklipp
       *[other] <bold>{ $count }</bold> lydklipp
    }
goal-help-recording = Du har hjelpt Common Voice med å nå <goalPercentage></goalPercentage> av vårt daglege opptaksmål på { $goalValue }!
goal-help-validation = Du har hjelpt Common Voice med å nå <goalPercentage></goalPercentage> av vårt daglige valideringsmål på { $goalValue }!
contribute-more =
    { $count ->
        [one] Klar for { $count } til?
       *[other] Klar for { $count } til?
    }
speak-empty-state = Vi har gått tom for setningar å spele inn på dette språket…
speak-empty-state-cta = Bidra med setningar
record-button-label = Spel inn stemma di
share-title-new = <bold>Hjelp oss</bold> med å finne fleire stemmer
keep-track-profile = Hald oversikt over framgangen din med ein profil
login-to-get-started = Logg inn eller registrer deg for å kome i gang
target-segment-first-card = Du bidrar til det første målsegmentet vårt
target-segment-generic-card = Du bidrar til eit målsegment
target-segment-first-banner = Hjelp til med å lage Common Voice sitt første målsegment i { $locale }
target-segment-add-voice = Legg til stemma din
target-segment-learn-more = Les meir

## Contribution Nav Items

contribute-voice-collection-nav-header = Innsamling av stemmer
contribute-sentence-collection-nav-header = Setningsinnsamling

## Reporting

report = Rapporter
report-title = Send inn ein rapport
report-ask = Kva for problem opplever du med denne setninga?
report-offensive-language = Krenkande språk
report-offensive-language-detail = Setninga inneheld respektlaust eller krenkande språk.
report-grammar-or-spelling = Grammatisk/Stavefeil
report-grammar-or-spelling-detail = Setninga har ein grammatisk feil eller ein stavefeil.
report-different-language = Anna språk
report-different-language-detail = Det er skrive på eit anna språk enn det eg snakkar.
report-difficult-pronounce = Vanskeleg å uttale
report-difficult-pronounce-detail = Den inneheld ord eller uttrykk som er vanskelege å lese eller uttale.
report-offensive-speech = Krenkande tale
report-offensive-speech-detail = Lydklippet har respektlaust eller krenkande språk.
report-other-comment =
    .placeholder = Kommentar
success = Vellykka
continue = Fortset
report-success = Rapporten er fullført

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = h

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = e
shortcut-record-toggle-label = Spel inn/Stopp
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Spel inn klippet ein gong til
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Forkast denne innspelinga
shortcut-submit = Enter
shortcut-submit-label = Send inn klipp
request-language-text = Ser du ikkje språket ditt på Common Voice enno?
request-language-button = Send ein førespurnad om eit nytt språk

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Spel av/Stopp
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = j
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriterium
contribution-criteria-link = Forstå bidragskriterium
contribution-criteria-page-title = Bidragskriterium
contribution-criteria-page-description = Forstå kva du skal sjå etter når du lyttar til talesnuttar og bidra til å forbetre taleinnspelingane dine òg!
contribution-for-example = til dømes
contribution-misreadings-title = Feiltolkingar
contribution-misreadings-description = Når du lyttar må du sjekke nøye etter at det som er spelt inn betyr akkurat det som er skrive; forkast opptaket sjølv om det er berre små feil. <br/>Vanlege feil inkluderer:
contribution-misreadings-description-extended-list-1 = Manglande <strong>«Ei(n)»</strong> eller <strong>«Den»</strong> i starten av opptaket.
contribution-misreadings-description-extended-list-2 = Manglar ein <strong>«s»</strong> på slutten av eit ord.
contribution-misreadings-description-extended-list-3 = Å slå saman ord utan at dei er slått saman i teksten, som å lese «harkje» i staden for «har ikkje», eller omvendt.
contribution-misreadings-description-extended-list-4 = Manglar slutten av siste ord ved å kutte av innspelinga for tidleg.
contribution-misreadings-description-extended-list-5 = Fleire forsøk på å lese eit ord.
contribution-misreadings-example-1-title = Dei store dinosaurane i Trias.
contribution-misreadings-example-2-title = Dei store dinosaura i Trias.
contribution-misreadings-example-2-explanation = [Burde vore «dinosaurane»]
contribution-misreadings-example-3-title = Dei store dinosaurane i Tria-.
contribution-misreadings-example-3-explanation = [Innspelinga kutta av før slutten av siste ordet]
contribution-misreadings-example-4-title = Dei store dinosaurane i Trias. Ja.
contribution-misreadings-example-4-explanation = [Det er spelt inn meir enn den nødvendige teksten]
contribution-misreadings-example-5-title = Vi skal ut og skaffe kaffi.
contribution-misreadings-example-6-title = Vi går ut for å skaffe meir kaffi.
contribution-misreadings-example-6-explanation = [Skulle vore «Vi er»]
contribution-misreadings-example-7-title = Vi skal ut og hente ein kaffi.
contribution-misreadings-example-7-explanation = [Ordet «igjen» var ikkje i teksta]
contribution-misreadings-example-8-title = Humla flaug forbi.
contribution-misreadings-example-8-explanation = [Heilt feil innhald]
contribution-varying-pronunciations-title = Ulike uttalar
contribution-background-noise-title = Bakgrunnsstøy
contribution-background-noise-example-2-explanation = [Del av teksten kan ikkje høyrast]
contribution-background-voices-title = Bakgrunnsstemmer
contribution-volume-title = Lydstyrke
contribution-reader-effects-title = Lesareffektar
contribution-just-unsure-title = Berre usikker?
see-more = <chevron></chevron>Vis meir
see-less = <chevron></chevron>Vis mindre
