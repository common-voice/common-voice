action-click = Klikni
action-tap = Dodirni
contribute = Doprinesi
review = Pregledaj
skip = Preskoči
shortcuts = Prečaci
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> isječak
        [few] <bold>{ $count }</bold> isječka
       *[other] <bold>{ $count }</bold> isječaka
    }
goal-help-recording = Uz tvoju pomoć je Common Voice postigao <goalPercentage></goalPercentage> našeg dnevnog cilja za snimanje od { $goalValue }!
goal-help-validation = Uz tvoju pomoć je Common Voice postigao <goalPercentage></goalPercentage> našeg dnevnog cilja za provjeravanje od { $goalValue }!
contribute-more =
    { $count ->
        [one] Želiš li obaviti još { $count }?
        [few] Želiš li obaviti još { $count }?
       *[other] Želiš li obaviti još { $count }?
    }
speak-empty-state = Ponestalo nam je rečenica za snimanje na ovom jeziku...
no-sentences-for-variants = Čini se da tvoja jezična varijanta nema više rečenica! Ako ti odgovara, možeš promijeniti postavke za prikaz drugih rečenica na tvom jeziku.
speak-empty-state-cta = Doprinesi rečenice
speak-loading-error =
    Nismo dobili nijednu rečenicu za govor.
    Pokušaj kasnije ponovo.
record-button-label = Snimi svoj glas
share-title-new = <bold>Pomogni nam</bold> pronaći još glasova
keep-track-profile = Prati svoj napredak pomoću profila
login-to-get-started = Za početak se prijavi ili registriraj
target-segment-first-card = Doprinosiš našem prvom segmentu cilja
target-segment-generic-card = Doprinosiš segmentu cilja
target-segment-first-banner = Pomogni stvoriti prvi segment cilja Common Voicea za { $locale }
target-segment-add-voice = Dodaj svoj glas
target-segment-learn-more = Saznaj više
change-preferences = Promijeni postavke

## Contribution Nav Items

contribute-voice-collection-nav-header = Zbirka glasova
contribute-sentence-collection-nav-header = Zbirka rečenica

## Reporting

report = Prijavi
report-title = Pošalji izvještaj
report-ask = Koje probleme imaš s ovom rečenicom?
report-offensive-language = Uvredljivi jezik
report-offensive-language-detail = Rečenica sadrži uvredljive ili prostačke riječi.
report-grammar-or-spelling = Gramatička / pravopisna greška
report-grammar-or-spelling-detail = Rečenica ima gramatičku ili pravopisnu grešku.
report-different-language = Drugačiji jezik
report-different-language-detail = Napisana je jezikom kojim ne govorim.
report-difficult-pronounce = Teško se izgovara
report-difficult-pronounce-detail = Sadrži riječi ili izraze koje je teško pročitati ili izgovoriti.
report-offensive-speech = Uvredljivi govor
report-offensive-speech-detail = Isječak sadrži uvredljive ili prostačke riječi.
report-other-comment =
    .placeholder = Komentar
success = Uspjeh
continue = Nastavi
report-success = Izvještaj je uspješno poslan

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = s
shortcut-record-toggle-label = Snimaj/Prekini
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Ponovo snimi isječak
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Odbaci snimanje u tijeku
shortcut-submit = Potvrdi
shortcut-submit-label = Pošalji isječke
request-language-text = Tvoj jezik nedostaje u Common Voiceu?
request-language-button = Zatraži jezik

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Reproduciraj/Prekini
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = d
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriteriji
contribution-criteria-link = Razumij kriterije za doprinošenje
contribution-criteria-page-title = Kriteriji za doprinošenje
contribution-criteria-page-description = Saznaj na što moraš paziti kada slušaš govorne isječke i kako možeš poboljšati tvoje govorne snimke!
contribution-for-example = na primjer
contribution-misreadings-title = Pogrešna čitanja
contribution-misreadings-description = Kada slušaš, provjeri je li se snimka i tekst poklapaju; odbij čak i pri manjim greškama. <br />Česte greške uključuju:
contribution-misreadings-description-extended-list-2 = Nedostajući nastavak <strong>za genitiv</strong> na kraju riječi.
contribution-misreadings-description-extended-list-4 = Nedostajanje kraja zadnje riječi zbog prebrzog prekidanja snimanja.
contribution-misreadings-description-extended-list-5 = Nekoliko pokušaja čitanja riječi.
contribution-misreadings-example-1-title = Ogromni dinosaurus iz trijasa.
contribution-misreadings-example-2-title = Ogromni dinosaur iz trijasa.
contribution-misreadings-example-2-explanation = [Trebalo bi biti „dinosaurus”]
contribution-misreadings-example-3-title = Ogromni dinosaurus iz trijas-.
contribution-misreadings-example-3-explanation = [Snimka je prekinuta prije kraja zadnje riječi]
contribution-misreadings-example-4-title = Ogromni dinosaurus iz trijasa. Da.
contribution-misreadings-example-4-explanation = [Snimljeno je više nego što je potrebno]
contribution-misreadings-example-8-title = Proletio je bumbar.
contribution-misreadings-example-8-explanation = [Nepoklapajući sadržaj]
contribution-varying-pronunciations-title = Različiti izgovori
contribution-varying-pronunciations-description-extended = S druge strane, ako misliš da čitatelj vjerojatno nikad prije nije naišao na tu riječ i da jednostavno netočno nagađa izgovor, odbij. Ako nisi siguran/na, koristi gumb za preskakanje.
contribution-background-noise-title = Buka u pozadini
contribution-background-noise-description-extended = Ako je snimka isprekidana ili ako sadrži pucketanje, odbaci je osim ako se još uvijek čuje cijeli tekst.
contribution-background-noise-example-2-explanation = [Dio teksta se ne čuje]
contribution-background-voices-title = Glasovi u pozadini
contribution-volume-title = Glasnoća
see-more = <chevron></chevron>Prikaži više
see-less = <chevron></chevron>Prikaži manje
