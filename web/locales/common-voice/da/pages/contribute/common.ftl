action-click = Klik på
action-tap = Tryk på
contribute = Bidrag
review = Godkend
skip = Spring over
shortcuts = Genveje
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> optagelse
       *[other] <bold>{ $count }</bold> optagelser
    }
goal-help-recording = Du har hjulpet Common Voice med at nå <goalPercentage></goalPercentage> af vores daglige { $goalValue } mål for indspilninger!
goal-help-validation = Du har hjulpet Common Voice med at nå <goalPercentage></goalPercentage> af vores daglige { $goalValue } mål for validering!
contribute-more = Klar til at lave { $count } mere?
speak-empty-state = Der er ikke flere sætninger at optage på dette sprog...
speak-empty-state-cta = Bidrag med sætninger
speak-loading-error =
    Vi kunne ikke finde nogen sætninger, du kan indtale.
    Prøv igen senere.
record-button-label = Optag din stemme
share-title-new = <bold>Hjælp os</bold> med at finde flere stemmer
keep-track-profile = Hold styr på dine fremskridt med en profil
login-to-get-started = Log ind eller tilmeld dig for at komme i gang
target-segment-first-card = Du bidrager til vores første målsegment
target-segment-generic-card = Du bidrager til et målsegment
target-segment-first-banner = Vær med til at lave det første målsegment til Common Voice på { $locale }
target-segment-add-voice = Tilføj din stemme
target-segment-learn-more = Læs mere

## Contribution Nav Items

contribute-voice-collection-nav-header = Indsamling af stemmer
contribute-sentence-collection-nav-header = Indsamling af sætninger

## Reporting

report = Rapportér
report-title = Indsend en rapport
report-ask = Hvilke problemer oplever du med denne sætning?
report-offensive-language = Stødende sprogbrug
report-offensive-language-detail = Sætningen har respektløst eller stødende sprog.
report-grammar-or-spelling = Grammatisk fejl/stavefejl
report-grammar-or-spelling-detail = Sætningen har en grammatisk fejl eller en stavefejl.
report-different-language = Andet sprog
report-different-language-detail = Det er skrevet på et andet sprog end det, jeg taler.
report-difficult-pronounce = Svær at udtale
report-difficult-pronounce-detail = Det indeholder ord eller sætninger, der er svære at læse eller udtale.
report-offensive-speech = Stødende sprog
report-offensive-speech-detail = Stemmeoptagelsen har respektløst eller stødende sprog.
report-other-comment =
    .placeholder = Kommentar
success = Succes
continue = Fortsæt
report-success = Rapport indsendt korrekt!

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = p

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = O
shortcut-record-toggle-label = Optag/Stop
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Optag igen
shortcut-discard-ongoing-recording = Esc
shortcut-discard-ongoing-recording-label = Kassér igangværende optagelse
shortcut-submit = Retur
shortcut-submit-label = Indsend stemmeoptagelser
request-language-text = Kan du ikke finde dit sprog på Common Voice?
request-language-button = Anmod om at få tilføjet et nyt sprog

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = s
shortcut-play-toggle-label = Afspil/Stop
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = j
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriterier
contribution-criteria-link = Forstå bidragskriterierne
contribution-criteria-page-title = Bidragskriterier
contribution-criteria-page-description = Forstå, hvad du skal være opmærksom på, når du lytter til andres stemmeklip - og vær med til at gøre dine stemmeoptagelser bedre!
contribution-for-example = for eksempel
contribution-misreadings-title = Fejllæsninger
contribution-misreadings-description = Når du lytter, så tjek meget omhyggeligt, at det, der er blevet optaget, er præcis det, der er blevet skrevet; afvis, hvis der er selv mindre fejl. <br />Meget almindelige fejl omfatter:
contribution-misreadings-description-extended-list-1 = Manglende <strong>'En'/'Et'</strong> eller <strong>'Den'/Det'</strong> i begyndelsen af optagelsen.
contribution-misreadings-description-extended-list-2 = Manglende <strong>'s'</strong> i slutningen af et ord.
contribution-misreadings-description-extended-list-3 = Oplæsning af sammentrækninger, der faktisk ikke er der, såsom engelske "we're" i stedet for "we are", eller omvendt.
contribution-misreadings-description-extended-list-4 = Manglende slutningen af det sidste ord, fordi optagelsen blev afbrudt for hurtigt.
contribution-misreadings-description-extended-list-5 = Flere forsøg på at læse et ord.
contribution-misreadings-example-1-title = De gigantiske dinosaurer i trias.
contribution-misreadings-example-2-title = Den gigantiske dinosaur i trias.
contribution-misreadings-example-2-explanation = [Skulle være ‘dinosaurer’]
contribution-misreadings-example-3-title = De gigantiske dinosaurer i tri-.
contribution-misreadings-example-3-explanation = [Optagelse afbrudt før slutningen af det sidste ord]
contribution-misreadings-example-4-title = De gigantiske dinosaurer i trias. Ja.
contribution-misreadings-example-4-explanation = [Der er blevet optaget mere end den påkrævede tekst]
contribution-misreadings-example-5-title = Vi går ud for at hente kaffe.
contribution-misreadings-example-7-title = Vi går ud for at hente noget kaffe.
contribution-misreadings-example-7-explanation = [Intet ‘noget' i den originale tekst]
contribution-misreadings-example-8-title = Humlebien susede forbi.
contribution-misreadings-example-8-explanation = [Ikke matchende indhold]
contribution-varying-pronunciations-title = Forskellige udtaler
contribution-varying-pronunciations-description = Vær forsigtig, når du overvejer at afvise et klip, fordi du synes at oplæseren har udtalt et ord forkert, lægger trykket forkert eller tilsyneladende har overset et spørgsmålstegn. Der er mange måder at bruge sproget på - og det er ikke sikkert, at du har hørt dem alle. Husk at tænke på, at der findes mennesker, der taler anderledes end du gør.
contribution-varying-pronunciations-description-extended = Hvis du på den anden side får indtrykket af, at oplæseren aldrig er stødt på ordet før og simpelthen gætter på, hvordan det skal udtales - så afvis optagelsen. Hvis du er usikker, så klik på knappen "Spring over".
contribution-background-noise-title = Baggrundsstøj
contribution-background-noise-description = Vi ønsker, at maskinlæringsalgoritmerne skal kunne håndtere forskellig baggrundsstøj, og selv relativt høje lyde kan accepteres, forudsat at de ikke forhindrer dig i at høre hele teksten. Stille baggrundsmusik er OK; musik der er så høj at det forhindrer dig i at høre hvert eneste ord, er ikke.
contribution-background-noise-description-extended = Hvis der er udfald eller knitren i optagelsen, så afvis optagelsen - medmindre hele teksten stadig kan høres.
contribution-background-noise-example-1-fixed-title = <strong>[Nys]</strong> De gigantiske dinosaurer i <strong>[hoste]</strong> trias.
contribution-background-noise-example-2-fixed-title = Den gigantiske dino <strong>[hoste]</strong> trias.
contribution-background-noise-example-2-explanation = [En del af teksten kan ikke høres]
contribution-background-noise-example-3-fixed-title = <strong>[Knitre]</strong> kæmpe dinosaurer af <strong>[knitre]</strong> -riassic.
contribution-background-voices-title = Stemmer i baggrunden
contribution-background-voices-description = Stille baggrundslyd er OK, men vi ønsker ikke yderligere stemmer, der kan få en maskinalgoritme til at identificere ord, der ikke er i den skrevne tekst. Hvis du kan høre forskellige ord bortset fra dem i teksten, bør klippet afvises. Typisk sker dette, hvor tv'et har været tændt, eller hvor der er en samtale i gang i nærheden.
contribution-background-voices-description-extended = Hvis der er udfald eller knitren i optagelsen, så afvis optagelsen - medmindre hele teksten stadig kan høres.
contribution-background-voices-example-1-title = De gigantiske dinosaurer i trias. <strong>[læst af én stemme]</strong>
contribution-background-voices-example-1-explanation = Kommer du? <strong>[sagt af en anden]</strong>
contribution-volume-title = Lydstyrke
contribution-volume-description = Der vil være naturlige variationer i lydstyrken mellem oplæsere. Afvis kun, hvis lydstyrken er så høj, at den ødelægger optagelsen, eller (mere almindeligt), hvis den er så lav, at du ikke kan høre, hvad der bliver sagt uden henvisning til den skrevne tekst.
contribution-reader-effects-title = Oplæsereffekter
contribution-reader-effects-description = De fleste optagelser er af mennesker, der taler med deres naturlige stemme. Du kan acceptere den lejlighedsvise ikke-standardoptagelse, hvor der bliver råbt, hvisket eller åbenlyst leveret med en 'dramatisk' stemme. Afvis venligst sungne optagelser og dem, der bruger en computersyntetiseret stemme.
contribution-just-unsure-title = Bare usikker?
contribution-just-unsure-description = Hvis du støder på noget, som disse retningslinjer ikke dækker, bedes du stemme efter din bedste vurdering. Hvis du virkelig ikke kan beslutte dig, så brug knappen 'Spring over' og gå videre til næste optagelse.
see-more = <chevron></chevron>Se mere
see-less = <chevron></chevron>Se mindre
