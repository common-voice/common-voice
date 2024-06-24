## Contribution

action-click = Klikk
action-tap = Trykk
## Languages

contribute = Bidra
review = Gjennomgå
skip = Hopp over
shortcuts = Snarveier
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> lydklipp
       *[other] <bold>{ $count }</bold> lydklipp
    }
goal-help-recording = Du har hjulpet Common Voice med å nå <goalPercentage></goalPercentage> av vårt daglige opptaksmål på { $goalValue }!
goal-help-validation = Du har hjulpet Common Voice med å nå <goalPercentage></goalPercentage> av vårt daglige bekreftelsesmål på { $goalValue }!
contribute-more =
    { $count ->
        [one] Klar til å gjøre en til?
       *[other] Klar til å gjøre { $count } til?
    }
speak-empty-state = Vi har gått tom for setninger å spille inn på dette språket…
speak-empty-state-cta = Bidra med setninger
speak-loading-error =
    Vi klarte ikke å laste noen setninger du kan lese.
    Prøv igjen senere.
record-button-label = Ta opp stemmen din
share-title-new = <bold>Hjelp oss</bold> med å finne flere stemmer
keep-track-profile = Hold oversikt over fremgangen din med en profil
login-to-get-started = Logg inn eller registrer deg før du starter
target-segment-first-card = Du bidrar til vårt første målsegment
target-segment-generic-card = Du bidrar til et målsegment
target-segment-first-banner = Hjelp med å lage Common Voice sitt første målsegment i { $locale }
target-segment-add-voice = Legg til stemmen din
target-segment-learn-more = Les mer

## Contribution Nav Items

contribute-voice-collection-nav-header = Tale-klipp innsamling
contribute-sentence-collection-nav-header = Setningsinnsamling

## Reporting

report = Rapporter
report-title = Send inn en rapport
report-ask = Hvilke problemer opplever du med denne setningen?
report-offensive-language = Støtende språk
report-offensive-language-detail = Setningen inneholder respektløst eller krenkende språk.
report-grammar-or-spelling = Grammatisk / stavefeil
report-grammar-or-spelling-detail = Setningen har en grammatisk eller stavefeil.
report-different-language = Annet språk
report-different-language-detail = Det er skrevet på et annet språk enn det jeg snakker.
report-difficult-pronounce = Vanskelig å uttale
report-difficult-pronounce-detail = Den inneholder ord eller uttrykk som er vanskelig å lese eller uttale.
report-offensive-speech = Støtende språk
report-offensive-speech-detail = Lydklippet har respektløst eller støtende språk.
report-other-comment =
    .placeholder = Kommentar
success = Suksess
continue = Fortsett
report-success = Rapporten er fullført

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = h

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = e
shortcut-record-toggle-label = Ta opp/Stopp
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Spill inn lydklipp om igjen
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Forkast pågående opptak
shortcut-submit = Enter
shortcut-submit-label = Send inn klipp
request-language-text = Ser du ikke språket ditt på Common Voice ennå?
request-language-button = Send en forespørsel om et nytt språk

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Spill av/Stopp
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = j
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriterier
contribution-criteria-link = Forstå bidragskriterier
contribution-criteria-page-title = Bidragskriterier
contribution-criteria-page-description = Forstå hva du skal se etter når du lytter til stemmeklipp, og bidra til å gjøre stemmeopptakene dine rikere også!
contribution-for-example = for eksempel
contribution-misreadings-title = Feillesninger
contribution-misreadings-description = Når du lytter, sjekk veldig nøye at det som er tatt opp er nøyaktig det som er skrevet; avvis hvis det er mindre feil. <br />Veldig vanlige feil inkluderer:
contribution-misreadings-description-extended-list-1 = Mangler <strong>«En»</strong> eller <strong>«Den»</strong> i starten av opptaket.
contribution-misreadings-description-extended-list-2 = Mangler en <strong>«s»</strong> på slutten av et ord.
contribution-misreadings-description-extended-list-3 = Lese sammentrekninger som ikke faktisk er der, for eksempel "Kan'ke" i stedet for "Kan ikke", eller omvendt.
contribution-misreadings-description-extended-list-4 = Miste slutten på siste ord ved å kutte av opptaket for raskt.
contribution-misreadings-description-extended-list-5 = Bruker flere forsøk på å lese et ord.
contribution-misreadings-example-1-title = De gigantiske dinosaurene i triastiden.
contribution-misreadings-example-2-title = De gigantiske dinosauren i triastiden.
contribution-misreadings-example-2-explanation = [Skal være "dinosaurene"]
contribution-misreadings-example-3-title = De gigantiske dinosaurene i tri-.
contribution-misreadings-example-3-explanation = [Opptaket avbrutt før slutten av siste ord]
contribution-misreadings-example-4-title = De gigantiske dinosaurene i triastiden. Ja.
contribution-misreadings-example-4-explanation = [Mer har blitt spilt inn enn den nødvendige teksten]
contribution-misreadings-example-5-title = Vi skal ut og hente kaffe.
contribution-misreadings-example-6-title = Vi går for å hente kaffe.
contribution-misreadings-example-6-explanation = [Skal være "Vi er"]
contribution-misreadings-example-7-title = Vi skal ut og hente kaffe.
contribution-misreadings-example-7-explanation = [Ingen 'én' i originalteksten]
contribution-misreadings-example-8-title = Humlen fløy forbi.
contribution-misreadings-example-8-explanation = [Ikke samsvarende innhold]
contribution-varying-pronunciations-title = Varierende uttaler
contribution-varying-pronunciations-description = Vær forsiktig før du avviser et klipp med begrunnelse at leseren har uttalt et ord feil, har lagt vekten på feil sted, eller tilsynelatende har ignorert et spørsmålstegn. Det er et stort utvalg uttale i bruk rundt om i verden, noen av dem har du kanskje ikke hørt i lokalsamfunnet ditt. Gi rom for variasjon overfor de som snakker annerledes enn deg.
contribution-varying-pronunciations-description-extended = På den annen side, hvis du tror at leseren sannsynligvis aldri har kommet over ordet før, og bare gjetter feil på uttalen, vennligst avvis. Hvis du er usikker, bruk hopp over-knappen.
contribution-varying-pronunciations-example-1-title = På hodet bar han en beret.
contribution-varying-pronunciations-example-1-explanation = ['Beret' er OK enten med vekt på den første stavelsen (UK) eller den andre (USA)]
contribution-varying-pronunciations-example-2-title = Hånden hans ble løftet opp.
contribution-varying-pronunciations-example-2-explanation = ['Raised' på engelsk uttales alltid som én stavelse, ikke to]
contribution-background-noise-title = Bakgrunnsstøy
contribution-background-noise-description = Vi vil at maskinlæringsalgoritmene skal kunne håndtere bakgrunnsstøy, og til og med relativt høye lyder kan aksepteres forutsatt at de ikke hindrer deg i å høre hele teksten. Stille bakgrunnsmusikk er OK; musikk høy nok til å hindre deg i å høre hvert eneste ord er det ikke.
contribution-background-noise-description-extended = Hvis opptaket hakker, eller har knitring, avvis med mindre hele teksten fortsatt kan høres.
contribution-background-noise-example-1-fixed-title = <strong>[Nys]</strong> De gigantiske dinosaurene i <strong>[hoste]</strong> triastiden.
contribution-background-noise-example-2-fixed-title = De gigantiske dino <strong>[hoste]</strong> triastiden.
contribution-background-noise-example-2-explanation = [Del av teksten kan ikke høres]
contribution-background-noise-example-3-fixed-title = <strong>[Sprake]</strong> gigantiske dinosaurene i <strong>[hoste]</strong> triastiden.
contribution-background-voices-title = Bakgrunnsstemmer
contribution-background-voices-description = Et stille støy i bakgrunnen er OK, men vi vil ikke ha flere stemmer som kan føre til at en maskinalgoritme identifiserer ord som ikke er i den skrevne teksten. Hvis du kan høre andre ord enn de i teksten, bør klippet avvises. Vanligvis skjer dette der TV-en har blitt stående på, eller der det foregår en samtale i nærheten.
contribution-background-voices-description-extended = Hvis opptaket hakker, eller har knitring, avvis med mindre hele teksten fortsatt kan høres.
contribution-background-voices-example-1-title = De gigantiske dinosaurene i triastiden. <strong>[lest av én stemme]</strong>
contribution-background-voices-example-1-explanation = Kommer du? <strong>[ropes av en annen]</strong>
contribution-volume-title = Volum
contribution-volume-description = Det vil være naturlige variasjoner i volum mellom leserne. Avvis bare hvis volumet er så høyt at opptaket brytes opp, eller (vanligere) hvis det er så lavt at du ikke kan høre hva som blir sagt uten referanse til den skrevne teksten.
contribution-reader-effects-title = Lesereffekter
contribution-reader-effects-description = De fleste opptak er av folk som snakker med sin naturlige stemme. Du kan godta en og annen ikke-standard innspilling som blir ropt, hvisket eller åpenbart levert med en "dramatisk" stemme. Vennligst avvis sangopptak og de som bruker en datamaskinsyntetisert stemme.
contribution-just-unsure-title = Bare usikker?
contribution-just-unsure-description = Hvis du kommer over noe som ikke er dekket av disse retningslinjene, forsøk og velg etter beste skjønn. Hvis du ikke føler det er mulig å bedømme klippet, bruk hopp over-knappen og gå videre til neste klipp.
see-more = <chevron></chevron>Se mer
see-less = <chevron></chevron>Se mindre

