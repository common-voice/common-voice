action-click = Klik
action-tap = Tik
contribute = Dra By
skip = Slaan Oor
shortcuts = Kortpaaie
clips-with-count-pluralized =
    { $count ->
        [one] snit
       *[other] snitte
    }
goal-help-recording = Jy het Common Voice gehelp om <goalPercentage></goalPercentage> van ons daaglikse { $goalValue } doelwit vir opnames te bereik!
goal-help-validation = Jy het Common Voice gehelp om <goalPercentage></goalPercentage> van ons daaglikse { $goalValue } bevestigingsdoelwit te bereik!
contribute-more =
    { $count ->
       *[other] Gereed om { $count } meer te doen?
    }
speak-empty-state = Ons het nie meer sinne om in hierdie taal op te neem nie...
speak-empty-state-cta = Dra sinne by
speak-loading-error = Ons kon geen sinne kry vir jou om te lees nie. Probeer asseblief later weer.
record-button-label = Neem jou stem op
share-title-new = <bold>Help ons</bold> om meer stemme te vind
keep-track-profile = Bly op hoogte van jou vordering met 'n profiel
login-to-get-started = Meld aan of teken in om te begin
target-segment-first-card = Jy dra by tot ons eerste teikensegment
target-segment-generic-card = Jy dra by tot 'n teikensegment
target-segment-first-banner = Help om Common Voice se eerste teikensegment in { $locale } te skep
target-segment-add-voice = Voeg jou stem by
target-segment-learn-more = Vind meer uit

## Contribution Nav Items

contribute-voice-collection-nav-header = Stemversameling

## Reporting

report = Rapporteer
report-title = Dien 'n verslag in
report-ask = Watter probleme ervaar jy met hierdie sin?
report-offensive-language = Aanstootlike taalgebruik
report-offensive-language-detail = Die sin bevat minagtende of aanstootlike taalgebruik.
report-grammar-or-spelling = Taal- / spelfout
report-grammar-or-spelling-detail = Die sin het 'n grammatik- of spelfout.
report-different-language = Ander taal
report-different-language-detail = Dit is in 'n ander taal geskryf as wat ek praat.
report-difficult-pronounce = Moeilik om uit te spreek
report-difficult-pronounce-detail = Dit bevat woorde of frases wat moeilik is om te lees of uit te spreek.
report-offensive-speech = Aanstootlike taal
report-offensive-speech-detail = Die sin bevat minagtende of aanstootlike taalgebruik.
report-other-comment =
    .placeholder = Lewer kommentaar
success = Sukses
continue = Gaan voort
report-success = Verslag suksesvol ingedien

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Neem Op/Stop
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Neem snit weer op
shortcut-discard-ongoing-recording = Terug
shortcut-discard-ongoing-recording-label = Skrap hiérdie opname
shortcut-submit = Keer Terug
shortcut-submit-label = Dien snitte in
request-language-text = Is jou taal nog nie op Common Voice nie?
request-language-button = Versoek 'n Taal

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Speel/Stop
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriteria
contribution-criteria-link = Verstaan bydraekriteria
contribution-criteria-page-title = Bydraekriteria
contribution-criteria-page-description = Verstaan waarna om te kyk wanneer jy na stemsnitte luister en help om jou stemopnames ook ryker te maak!
contribution-for-example = byvoorbeeld
contribution-misreadings-title = Lees foute
contribution-misreadings-description = Wanneer jy luister, maak baie seker dat wat opgeneem is presies dieselfde is as wat geskryf word; verwerp die opname as daar selfs die geringste fout is. <br />Baie algemene foute sluit in:
contribution-misreadings-description-extended-list-1 = <strong>''n'</strong> of <strong>'Die'</strong> ontbreek aan die begin van die opname.
contribution-misreadings-description-extended-list-2 = 'n <strong>'s'</strong> ontbreek aan die einde van 'n woord.
contribution-misreadings-description-extended-list-3 = Lees sametrekkings wat nie eintlik daar is nie, soos "Ons's" in plaas van "Ons is", of andersom.
contribution-misreadings-description-extended-list-4 = Mis die einde van die laaste woord deur die opname te vinnig af te sny.
contribution-misreadings-description-extended-list-5 = Maak verskeie pogings om 'n woord te lees.
contribution-misreadings-example-1-title = Die reuse dinosourusse van die Trias.
contribution-misreadings-example-2-title = Die reuse dinosourus van die Trias.
contribution-misreadings-example-2-explanation = [Moet 'dinosourusse' wees]
contribution-misreadings-example-3-title = Die reuse dinosourusse van die Tria-.
contribution-misreadings-example-3-explanation = [Opname is afgesny voor die einde van die laaste woord]
contribution-misreadings-example-4-title = Die reuse dinosourusse van die Trias. Ja.
contribution-misreadings-example-4-explanation = [Meer as die vereiste teks is opgeneem]
contribution-misreadings-example-5-title = Ons gaan uit om koffie te kry.
contribution-misreadings-example-6-title = Ons gaan't om koffie te kry.
contribution-misreadings-example-6-explanation = [Moet wees "Gaan uit"]
contribution-misreadings-example-7-title = Ons gaan uit om 'n koffie te kry.
contribution-misreadings-example-7-explanation = [Geen ''n' in die oorspronklike teks nie]
contribution-misreadings-example-8-title = Die hommelby het verbygeswiep.
contribution-misreadings-example-8-explanation = [Onooreenstemmende inhoud]
contribution-varying-pronunciations-title = Verskillende uitsprake
contribution-varying-pronunciations-description = Wees versigtig voor jy 'n snit verwerp op grond daarvan dat die leser 'n woord verkeerd uitgespreek het, die klem op die verkeerde plek geplaas het, of blykbaar 'n vraagteken geïgnoreer het. Daar is 'n wye verskeidenheid uitsprake wat regoor die wêreld gebruik word, waarvan jy dalk nog nie in jou plaaslike gemeenskap gehoor het nie. Toon asseblief die nodige waardering vir diegene wat dalk anders as jy praat.
contribution-varying-pronunciations-description-extended = Aan die ander kant, as jy dink dat die leser waarskynlik nog nooit die woord teëgekom het nie, en bloot 'n verkeerde raaiskoot oor die uitspraak maak, verwerp die opname asseblief. As jy onseker is, gaan eerder na die volgende opname.
contribution-varying-pronunciations-example-1-title = Op sy kop het hy 'n beret gedra.
contribution-varying-pronunciations-example-1-explanation = ['Beret' is OK, hetsy met die klem op die eerste lettergreep (VK) of die tweede (VS)]
contribution-varying-pronunciations-example-2-title = Hy vat sy kussing te-rug.
contribution-varying-pronunciations-example-2-explanation = ['Terug' in Afrikaans word altyd uitgespreek as twee lettergrepe, nie drie nie]
contribution-background-noise-title = Agtergrondgeraas
contribution-background-noise-description = Ons wil hê dat die masjienleeralgoritmes 'n verskeidenheid agtergrondgeraas moet kan hanteer, en selfs relatief harde geluide moet kan aanvaar, mits dit jou nie verhoed om die hele teks te hoor nie. Stil agtergrondmusiek is OK; musiek wat hard genoeg is om te verhoed dat jy elke woord van die opname hoor, is nie.
contribution-background-noise-description-extended = As die opname breek of kraak, verwerp dit tensy die hele teks nog gehoor kan word.
contribution-background-noise-example-1-fixed-title = <strong>[Nies]</strong> Die reuse dinosourusse van die <strong>[hoes]</strong> Trias.
contribution-background-noise-example-2-fixed-title = Die reuse dino <strong>[hoes]</strong> die Trias.
contribution-background-noise-example-2-explanation = [Deel van die teks kan nie gehoor word nie]
contribution-background-noise-example-3-fixed-title = <strong>[Kraak]</strong> reuse dinosourusse van <strong>[kraak]</strong> -ias.
contribution-background-voices-title = Stemme in die agtergrond
contribution-background-voices-description = ’n Rustige onderlangse gemompel in die agtergrond is OK, maar ons wil nie bykomende stemme hê wat kan veroorsaak dat ’n masjienalgoritme woorde identifiseer wat nie in die geskrewe teks is nie. As jy verskillende woorde buiten dié van die teks kan hoor, moet die snit verwerp word. Tipies gebeur dit waar die TV aan is in die agtergrond, of waar daar 'n gesprek naby aan die gang is.
contribution-background-voices-description-extended = As die opname breek of kraak, verwerp dit tensy die hele teks nog gehoor kan word.
contribution-background-voices-example-1-title = Die reuse dinosourusse van die Trias. <strong>[deur een stem gelees]</strong>
contribution-background-voices-example-1-explanation = Kom jy? <strong>[deur 'n ander geskree]</strong>
contribution-volume-title = Volume
contribution-volume-description = Daar sal natuurlike variasies in volume tussen lesers wees. Verwerp slegs die opname as die volume so hoog is dat die opname breek, of (meer algemeen) as dit so laag is dat jy nie kan hoor wat gesê word sonder verwysing na die geskrewe teks nie.
contribution-reader-effects-title = Leser-effekte
contribution-reader-effects-description = Die meeste opnames is van mense wat in hul natuurlike stem praat. Jy kan die nie-standaard opnames wat af en toe voorkom waarin geskree, gefluister of in 'n 'dramatiese' stem gelees word, aanvaar. Verwerp asseblief gesingde opnames en diegene wat 'n kunsmatige tegnologiesgewysigde of -geskepte stem gebruik.
contribution-just-unsure-title = Net onseker?
contribution-just-unsure-description = As jy iets teëkom wat hierdie riglyne nie dek nie, evalueer die opname asseblief volgens jou beste oordeel. As jy regtig nie kan besluit nie, sien dié opname oor en gaan aan na die volgende opname.
see-more = <chevron></chevron>Sien meer
see-less = <chevron></chevron>Sien minder
