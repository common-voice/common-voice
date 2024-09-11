action-click = Klicka
action-tap = Tryck
contribute = Bidra
review = Granska
skip = Hoppa över
shortcuts = Genvägar
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count } klipp
       *[other] <bold>{ $count } klipp
    }
goal-help-recording = Du har hjälpt Common Voice att nå <goalPercentage></goalPercentage> av vårt dagliga { $goalValue } inspelningsmål!
goal-help-validation = Du har hjälp Common Voice att nå <goalPercentage></goalPercentage> av vårt dagliga { $goalValue } valideringsmål!
contribute-more =
    { $count ->
        [one] Redo att göra { $count } till?
       *[other] Redo att göra { $count } till?
    }
speak-empty-state = Vi har slut på meningar att spela in på det här språket...
no-sentences-for-variants = Din språkvariant kan ha slut på meningar! Om du känner dig bekväm kan du ändra dina inställningar för att se andra meningar i ditt språk.
speak-empty-state-cta = Bidra med meningar
speak-loading-error =
    Vi kunde inte hitta några meningar till dig att tala.
    Vänligen försök igen senare.
record-button-label = Spela in din röst
share-title-new = <bold>Hjälp oss</bold> hitta mer röster
keep-track-profile = Håll koll på dina framsteg med en profil
login-to-get-started = Logga in eller registrera dig för att komma igång
target-segment-first-card = Du bidrar till vårt första målsegment
target-segment-generic-card = Du bidrar till ett målsegment
target-segment-first-banner = Hjälp till med att skapa Common Voice första målsegment i { $locale }
target-segment-add-voice = Lägg till din röst
target-segment-learn-more = Läs mer
change-preferences = Ändra inställningar

## Contribution Nav Items

contribute-voice-collection-nav-header = Insamling av röster
contribute-sentence-collection-nav-header = Insamling av meningar
login-signup = Logga in / Registrera dig
vote-yes = Ja
vote-no = Nej
datasets = Datamängder
languages = Språk
about = Om
partner = Partner
submit-form-action = Skicka in

## Reporting

report = Rapportera
report-title = Skicka in en rapport
report-ask = Vilka problem upplever du med den här meningen?
report-offensive-language = Stötande språk
report-offensive-language-detail = Den här meningen har respektlöst eller kränkande språk.
report-grammar-or-spelling = Grammatiskt / stavfel
report-grammar-or-spelling-detail = Den här meningen har ett grammatiskt eller stavfel
report-different-language = Annat språk
report-different-language-detail = Det är skrivet på ett annat språk än det jag pratar.
report-difficult-pronounce = Svårt att uttala
report-difficult-pronounce-detail = Den innehåller ord eller fraser som är svåra att läsa eller uttala.
report-offensive-speech = Offensivt tal
report-offensive-speech-detail = Klippet har respektlöst eller kränkande språk.
report-other-comment =
    .placeholder = Kommentar
success = Lyckades
continue = Fortsätt
report-success = Rapporten godkändes framgångsrikt

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Spela in/Stoppa
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Spela in klipp igen
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Ignorera pågående inspelning
shortcut-submit = Återgå
shortcut-submit-label = Skicka in klipp
request-language-text = Kan du inte se ditt språk på Common Voice än?
request-language-button = Skicka en förfrågan

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Spela upp/Stoppa
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriterier
contribution-criteria-link = Förstå bidragskriterier
contribution-criteria-page-title = Bidragskriterier
contribution-criteria-page-description = Förstå vad du ska leta efter när du lyssnar på röstklipp och hjälp till att göra dina röstinspelningar bättre!
contribution-for-example = till exempel
contribution-misreadings-title = Felläsningar
contribution-misreadings-description = När du lyssnar, kontrollera mycket noga att det som har spelats in är exakt det som har skrivits; avvisa om det är mindre fel.<br />Mycket vanliga fel inkluderar:
contribution-misreadings-description-extended-list-1 = Saknar <strong>'En'</strong> eller <strong>'Den'</strong> i början av inspelningen.
contribution-misreadings-description-extended-list-2 = Saknar ett <strong>s</strong> i slutet av ett ord.
contribution-misreadings-description-extended-list-3 = Att läsa upp sammandragningar som faktiskt inte finns där, som i engelskans "we're" istället för "we are", eller vice versa.
contribution-misreadings-description-extended-list-4 = Slutet på det sista ordet saknades eftersom inspelningen avbröts för snabbt.
contribution-misreadings-description-extended-list-5 = Gör flera försök med att läsa ett ord.
contribution-misreadings-example-1-title = De gigantiska dinosaurierna i Trias.
contribution-misreadings-example-2-title = De gigantiska dinosaurien i Trias.
contribution-misreadings-example-2-explanation = [Borde vara 'dinosaurierna']
contribution-misreadings-example-3-title = De gigantiska dinosaurierna i Triassi-.
contribution-misreadings-example-3-explanation = [Inspelning avbruten före slutet av det sista ordet]
contribution-misreadings-example-4-title = De gigantiska dinosaurierna i Trias. Ja.
contribution-misreadings-example-4-explanation = [Mer har spelats in än den obligatoriska texten]
contribution-misreadings-example-5-title = Vi ska ut och hämta kaffe.
contribution-misreadings-example-6-title = Vi är ut och hämta kaffe.
contribution-misreadings-example-6-explanation = [Borde vara "Vi går"]
contribution-misreadings-example-7-title = Vi ska ut och hämta en kaffe.
contribution-misreadings-example-7-explanation = [Inget "en" i originaltexten]
contribution-misreadings-example-8-title = Humlan flög förbi.
contribution-misreadings-example-8-explanation = [Felaktigt innehåll]
contribution-varying-pronunciations-title = Varierande uttal
contribution-varying-pronunciations-description = Var försiktig innan du avvisar ett klipp med motiveringen att läsaren har uttalat ett ord fel, har lagt betoningen på fel ställe eller uppenbarligen har ignorerat ett frågetecken. Det finns en mängd olika uttal som används runt om i världen, av vilka du kanske inte har hört några i ditt område. Vänligen ge en marginal för uppskattning för dem som kanske talar annorlunda än du.
contribution-varying-pronunciations-description-extended = Å andra sidan, om du tror att läsaren förmodligen aldrig har stött på ordet tidigare, och bara gör en felaktig gissning på uttalet, vänligen avvisa. Om du är osäker, använd knappen hoppa över.
contribution-varying-pronunciations-example-1-title = On his head he wore a beret.
contribution-varying-pronunciations-example-1-explanation = [‘Beret’ is OK whether with stress on the first syllable (UK) or the second (US)]
contribution-varying-pronunciations-example-2-title = His hand was rais-ed.
contribution-varying-pronunciations-example-2-explanation = [‘Raised’ in English is always pronounced as one syllable, not two]
contribution-background-noise-title = Bakgrundsbrus
contribution-background-noise-description = Vi vill att maskininlärningsalgoritmerna ska kunna hantera en mängd olika bakgrundsljud, och även relativt höga ljud kan accepteras förutsatt att de inte hindrar dig från att höra hela texten. Tyst bakgrundsmusik är OK; musik tillräckligt hög för att hindra dig från att höra vartenda ord är det inte.
contribution-background-noise-description-extended = Om inspelningen stoppar eller sprakar, avvisa den om du inte fortfarande kan höra all text.
contribution-background-noise-example-1-fixed-title = <strong>[Nysning]</strong> De gigantiska dinosaurierna i <strong>[hostning]</strong> Trias.
contribution-background-noise-example-2-fixed-title = Den gigantiska dino <strong>[hostning]</strong> i Trias.
contribution-background-noise-example-2-explanation = [Delar av texten kan inte höras]
contribution-background-noise-example-3-fixed-title = <strong>[Knaster]</strong> gigantiska dinosaurierna i <strong>[knaster]</strong> -as.
contribution-background-voices-title = Bakgrundsröster
contribution-background-voices-description = Ett tyst tumult i bakgrunden är OK, men vi vill inte ha ytterligare röster som kan få en maskinalgoritm att identifiera ord som inte finns i den skrivna texten. Om du kan höra distinkta ord förutom de i texten, bör klippet avvisas. Vanligtvis händer detta där TV:n har lämnats på eller där det pågår en konversation i närheten.
contribution-background-voices-description-extended = Om inspelningen går sönder eller har sprickor, avvisa om inte hela texten fortfarande kan höras.
contribution-background-voices-example-1-title = De gigantiska dinosaurierna i trias. <strong>[läst av en röst]</strong>
contribution-background-voices-example-1-explanation = Kommer du? <strong>[ropas av någon annan]</strong>
contribution-volume-title = Volym
contribution-volume-description = Det kommer att finnas naturliga variationer i volym mellan läsarna. Avvisa bara om volymen är så hög att inspelningen går sönder, eller (mer vanligt) om den är så låg att du inte kan höra vad som sägs utan hänvisning till den skrivna texten.
contribution-reader-effects-title = Läsareffekter
contribution-reader-effects-description = De flesta inspelningarna är av människor som pratar med sin naturliga röst. Du kan acceptera en och annan icke-standardinspelning som ropas, viskas eller uppenbarligen levereras med en "dramatisk" röst. Avvisa sjungna inspelningar och de som använder en datorsyntiserad röst.
contribution-just-unsure-title = Osäker?
contribution-just-unsure-description = Om du stöter på något som dessa riktlinjer inte täcker, vänligen rösta enligt ditt bästa omdöme. Om du verkligen inte kan bestämma dig, använd knappen hoppa över och gå vidare till nästa inspelning.
see-more = <chevron></chevron>Se mer
see-less = <chevron></chevron>Se mindre
