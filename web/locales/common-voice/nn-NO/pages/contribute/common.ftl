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
no-sentences-for-variants = Språkvarianten din kan vere tom for setningar! Dersom du er ønskjer, kan du endre innstillingane dine for å sjå andre setningar på språket ditt.
speak-empty-state-cta = Bidra med setningar
speak-loading-error =
    Vi klarte ikkje å laste nokre setningar du kan lese.
    Prøv igjen seinare.
record-button-label = Spel inn stemma di
share-title-new = <bold>Hjelp oss</bold> med å finne fleire stemmer
keep-track-profile = Hald oversikt over framgangen din med ein profil
login-to-get-started = Logg inn eller registrer deg for å kome i gang
target-segment-first-card = Du bidrar til det første målsegmentet vårt
target-segment-generic-card = Du bidrar til eit målsegment
target-segment-first-banner = Hjelp til med å lage Common Voice sitt første målsegment i { $locale }
target-segment-add-voice = Legg til stemma din
target-segment-learn-more = Les meir
change-preferences = Endre innstillingar
login-signup = Logg inn/Registrer deg
vote-yes = Ja
vote-no = Nei
datasets = Datasett
languages = Språk
about = Om
partner = Partnar
submit-form-action = Send inn

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
contribution-varying-pronunciations-description = Ver forsiktig før du avviser eit klipp med grunngiving at lesaren har uttalt eit ord feil, har lagt vekta på feil stad, eller tilsynelatande har ignorert eit spørsmålsteikn. Det er eit stort utval uttale i bruk rundt om i verda, nokre av dei har du kanskje ikkje høyrt i lokalsamfunnet ditt. Gi rom for variasjon overfor dei som snakkar annleis enn deg.
contribution-varying-pronunciations-description-extended = På den andre sida, viss du trur at lesaren sannsynlegvis aldri har kome over ordet før, og berre gjettar feil på uttalen, ver vennleg og avvis. Viss du er usikker, bruk hopp over-knappen.
contribution-varying-pronunciations-example-1-title = På hovudet hadde han ein beret.
contribution-varying-pronunciations-example-1-explanation = [’Beret’ er OK anten med vekt på den første stavinga (UK) eller den andre (USA)]
contribution-varying-pronunciations-example-2-title = Handa hans vart løfta opp.
contribution-varying-pronunciations-example-2-explanation = [’Raised’ på engelsk blir alltid uttalt som éi staving, ikkje to]
contribution-background-noise-title = Bakgrunnsstøy
contribution-background-noise-description = Vi vil at maskinlæringsalgoritmane skal kunne handtere bakgrunnsstøy, og til og med relativt høge lydar kan aksepterast føresett at dei ikkje hindrar deg i å høyre heile teksten. Stille bakgrunnsmusikk er OK; musikk høg nok til å hindre deg i å høyre kvart einaste ord er det ikkje.
contribution-background-noise-description-extended = Viss opptaket hakkar, eller har knitring, avvis det med mindre heile teksten framleis kan høyrast.
contribution-background-noise-example-1-fixed-title = <strong>[Nys]</strong> Dei gigantiske dinosaurane i <strong>[hoste]</strong> triastida.
contribution-background-noise-example-2-fixed-title = Den gigantiske dino <strong>[hoste]</strong> triastida.
contribution-background-noise-example-2-explanation = [Del av teksten kan ikkje høyrast]
contribution-background-noise-example-3-fixed-title = <strong>[Sprake]</strong> gigant dinosaurane i <strong>[hoste]</strong> triastida.
contribution-background-voices-title = Bakgrunnsstemmer
contribution-background-voices-description = Stille støy i bakgrunnen er OK, men vi vil ikkje ha fleire stemmer som kan føre til at ein maskinalgoritme identifiserer ord som ikkje er i den skrivne teksten. Viss du kan høyre ulike ord bortsett frå teksten, bør klippet avvisast. Vanlegvis skjer dette der TV-en har vorte ståande på, eller der det går føre seg ein samtale i nærleiken.
contribution-background-voices-description-extended = Viss opptaket hakkar, eller har knitring, avvis det med mindre heile teksten framleis kan høyrast.
contribution-background-voices-example-1-title = Dei gigantiske dinosaurane i triastida. <strong>[lese av éi stemme]</strong>
contribution-background-voices-example-1-explanation = Kjem du? <strong>[vert ropt av ein annan]</strong>
contribution-volume-title = Lydstyrke
contribution-volume-description = Det vil vere naturlege variasjonar i volum på dei ulike lesarane. Avvis berre viss volumet er så høgt at opptaket blir brote opp, eller (vanlegare) viss det er så lågt at du ikkje kan høyre kva som blir sagt utan å referere til den skrivne teksten.
contribution-reader-effects-title = Lesareffektar
contribution-reader-effects-description = Dei fleste opptak er av folk som snakkar med den naturlege stemma si. Du kan godta ein og anna ikkje-standard innspeling som blir ropt, kviskra eller openbert leverte med ei «dramatisk» stemme. Ver vennleg og avvis songopptak og dei som bruker ei datamaskinsyntetisert stemme.
contribution-just-unsure-title = Berre usikker?
contribution-just-unsure-description = Viss du kjem over noko som desse retningslinjene ikkje dekkjer, ver vennleg og stem etter beste skjønn. Viss du verkeleg ikkje kan bestemme deg, bruk hopp over-knappen og gå vidare til neste innspeling.
see-more = <chevron></chevron>Vis meir
see-less = <chevron></chevron>Vis mindre
