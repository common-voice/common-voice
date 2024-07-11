action-click = Klik op
action-tap = Tik op
contribute = Bijdragen
review = Beoordelen
skip = Overslaan
shortcuts = Sneltoetsen
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> fragment
       *[other] <bold>{ $count }</bold> fragmenten
    }
goal-help-recording = U hebt Common Voice geholpen <goalPercentage></goalPercentage> van het dagelijkse doel van { $goalValue } opnamen te bereiken!
goal-help-validation = U hebt Common Voice geholpen <goalPercentage></goalPercentage> van het dagelijkse doel van { $goalValue } validaties te bereiken!
contribute-more = Klaar om er nog { $count } te doen?
speak-empty-state = We hebben in deze taal geen op te nemen zinnen meer…
no-sentences-for-variants = Uw taalvariant bevat mogelijk geen verdere zinnen! Als u tevreden bent, kunt u uw instellingen wijzigen om andere zinnen in uw taal te zien.
speak-empty-state-cta = Zinnen bijdragen
speak-loading-error =
    We kunnen geen zinnen voor u ophalen om uit te spreken.
    Probeer het later nog eens.
record-button-label = Uw stem opnemen
share-title-new = <bold>Help ons</bold> meer stemmen te vinden
keep-track-profile = Houd uw voortgang bij met een profiel
login-to-get-started = Meld u aan of registreer om te beginnen
target-segment-first-card = U draagt bij aan ons eerste doelsegment
target-segment-generic-card = U draagt bij aan een doelsegment
target-segment-first-banner = Help bij het maken van het eerste doelsegment in het { $locale } van Common Voice
target-segment-add-voice = Uw stem toevoegen
target-segment-learn-more = Meer info
change-preferences = Voorkeuren wijzigen

## Contribution Nav Items

contribute-voice-collection-nav-header = Spraakcollectie
contribute-sentence-collection-nav-header = Zinnenverzameling

## Reporting

report = Rapporteren
report-title = Een rapport verzenden
report-ask = Welke problemen ondervindt u met deze zin?
report-offensive-language = Beledigende taal
report-offensive-language-detail = De zin bevat respectloze of beledigende taal.
report-grammar-or-spelling = Grammaticale / spellingfout
report-grammar-or-spelling-detail = De zin heeft een grammaticale of spellingfout.
report-different-language = Andere taal
report-different-language-detail = Het is geschreven in een andere taal dan welke ik spreek.
report-difficult-pronounce = Moeilijk uit te spreken
report-difficult-pronounce-detail = Hij bevat woorden of zinnen die moeilijk te lezen of uit te spreken zijn.
report-offensive-speech = Beledigende tekst
report-offensive-speech-detail = Het fragment bevat respectloze of beledigende taal.
report-other-comment =
    .placeholder = Opmerking
success = Geslaagd
continue = Doorgaan
report-success = Rapport met succes doorgegeven

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = o
shortcut-record-toggle-label = Opnemen/Stoppen
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Fragment opnieuw opnemen
shortcut-discard-ongoing-recording = Esc
shortcut-discard-ongoing-recording-label = Lopende opname verwerpen
shortcut-submit = Terug
shortcut-submit-label = Fragmenten indienen
request-language-text = Ziet u uw taal nog niet op Common Voice?
request-language-button = Een taal aanvragen

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Afspelen/Stoppen
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = j
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Criteria
contribution-criteria-link = Bijdragecriteria begrijpen
contribution-criteria-page-title = Bijdragecriteria
contribution-criteria-page-description = Begrijp waar u op moet letten als u spraakfragmenten beluistert en help uw spraakopnamen ook rijker te maken!
contribution-for-example = bijvoorbeeld
contribution-misreadings-title = Verkeerd gelezen
contribution-misreadings-description = Controleer terwijl u luistert zorgvuldig dat wat is opgenomen ook precies is wat er geschreven staat; keur het af als er zelfs kleine fouten zijn. <br />Veel voorkomende fouten zijn:
contribution-misreadings-description-extended-list-1 = <strong>‘Een’</strong> of <strong>‘De’</strong> ontbreekt aan het begin van de opname.
contribution-misreadings-description-extended-list-2 = Er ontbreekt <strong>‘s’</strong> of <strong>‘en’</strong> aan het einde van een woord.
contribution-misreadings-description-extended-list-3 = Samenvoegingen die er eigenlijk niet zijn, zoals ‘Zo’n’ in plaats van ‘Zo een’, of andersom.
contribution-misreadings-description-extended-list-4 = Het einde van het laatste woord ontbreekt door het te snel afbreken van de opname.
contribution-misreadings-description-extended-list-5 = Meerdere pogingen om een woord te lezen.
contribution-misreadings-example-1-title = De enorme dinosaurussen van het Trias.
contribution-misreadings-example-2-title = De enorme dinosaurus van het Trias.
contribution-misreadings-example-2-explanation = [Moet ‘dinosaurussen’ zijn]
contribution-misreadings-example-3-title = De enorme dinosaurussen van het Tria-.
contribution-misreadings-example-3-explanation = [Opname afgekapt voor het einde van het laatste woord]
contribution-misreadings-example-4-title = De enorme dinosaurussen van het Trias. Ja.
contribution-misreadings-example-4-explanation = [Er is meer dan de benodigde tekst opgenomen]
contribution-misreadings-example-5-title = Ik heb koffie met haar gedronken.
contribution-misreadings-example-6-title = Ik heb koffie met ’r gedronken.
contribution-misreadings-example-6-explanation = [Zou ‘haar’ moeten zijn]
contribution-misreadings-example-7-title = Ik heb een koffie met haar gedronken.
contribution-misreadings-example-7-explanation = [Er zit geen ‘een’ in de oorspronkelijke tekst]
contribution-misreadings-example-8-title = De hommel vloog voorbij.
contribution-misreadings-example-8-explanation = [Niet-overeenkomende inhoud]
contribution-varying-pronunciations-title = Uiteenlopende uitspraken
contribution-varying-pronunciations-description = Wees voorzichtig voordat u een fragment afwijst als een lezer een woord verkeerd uitspreekt, de nadruk op de verkeerde plaats legt of openlijk een vraagteken negeert. Er wordt een grote variëteit aan uitspraken in de wereld gebruikt, en sommige hebt u mogelijk in uw omgeving niet gehoord. Bied enige ruimte aan personen die anders dan u spreken.
contribution-varying-pronunciations-description-extended = Als u daarentegen denkt dat de lezer het woord nog nooit heeft gebruikt en simpelweg een onjuiste inschatting van de uitspraak doet, wijs het fragment dan af. Als u het niet zeker weet, gebruik dan de knop Overslaan.
contribution-varying-pronunciations-example-1-title = Hij bestelde een portie saté.
contribution-varying-pronunciations-example-1-explanation = [‘Saté’ is OK met zowel de klemtoon op de eerste als de tweede lettergreep]
contribution-varying-pronunciations-example-2-title = Hij trok zich te-rug.
contribution-varying-pronunciations-example-2-explanation = [‘Terug’ wordt vaak als één lettergreep uitgesproken, niet als twee]
contribution-background-noise-title = Achtergrondgeluid
contribution-background-noise-description = We willen dat de machinelerende algoritmen een breed scala aan achtergrondgeluiden kunnen verwerken, en zelfs relatief luide geluiden kunnen worden geaccepteerd, onder voorwaarde dat ze niet verhinderen dat u de gehele tekst hoort. Rustige achtergrondmuziek is OK; muziek die luid genoeg is om ervoor te zorgen dat u niet elk woord kunt verstaan niet.
contribution-background-noise-description-extended = Als de opname wordt verstoord of kraakt, wijs deze dan af, tenzij de gehele tekst nog steeds verstaanbaar is.
contribution-background-noise-example-1-fixed-title = <strong>[Niezen]</strong> De enorme dinosaurussen van het <strong>[hoesten]</strong> Trias.
contribution-background-noise-example-2-fixed-title = De enorme dino <strong>[hoesten]</strong> het Trias.
contribution-background-noise-example-2-explanation = [De tekst is deels onverstaanbaar]
contribution-background-noise-example-3-fixed-title = <strong>[Gekraak]</strong> enorme dinosaurussen van <strong>[gekraak]</strong> -ias.
contribution-background-voices-title = Achtergrondgeluiden
contribution-background-voices-description = Een rustig geroezemoes op de achtergrond is OK, maar we willen geen extra stemmen die ervoor kunnen zorgen dat een machine-algoritme woorden identificeert die niet in de geschreven tekst staan. Als u andere woorden dan die van de tekst kunt horen, moet het fragment worden afgewezen. Meestal gebeurt dit als de tv aanstaat of als er een gesprek in de buurt wordt gevoerd.
contribution-background-voices-description-extended = Als de opname wegvalt of gekraak bevat, wijs het fragment dan af, tenzij de gehele tekst nog verstaanbaar is.
contribution-background-voices-example-1-title = De enorme dinosaurussen van het Trias. <strong>[gelezen door één stem]</strong>
contribution-background-voices-example-1-explanation = Kom je? <strong>[geroepen door iemand anders]</strong>
contribution-volume-title = Volume
contribution-volume-description = Er zullen natuurlijke variaties in volume tussen lezers zijn. Wijs het fragment alleen af als het volume zo hoog is dat de opname onderbroken wordt, of (vaker) als het zo laag is dat onverstaanbaar is wat er wordt gezegd zonder naar de geschreven tekst te moeten kijken.
contribution-reader-effects-title = Lezereffecten
contribution-reader-effects-description = De meeste opnames zijn van mensen die met hun natuurlijke stem praten. U kunt af en toe een afwijkende opname accepteren die wordt geschreeuwd, gefluisterd of duidelijk wordt afgeleverd met een ‘dramatische’ stem. Wijs gezongen opnames en opnames met een computergegenereerde stem af.
contribution-just-unsure-title = Gewoon onzeker?
contribution-just-unsure-description = Als u iets tegenkomt dat niet in deze richtlijnen wordt behandeld, stem dan naar uw beste oordeel. Als u echt niet kunt beslissen, gebruik dan de knop Overslaan en ga door naar de volgende opname.
see-more = <chevron></chevron>Meer tonen
see-less = <chevron></chevron>Minder tonen
