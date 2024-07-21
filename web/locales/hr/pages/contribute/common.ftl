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
        [one] Jeste li spremni obaviti još { $count }?
        [few] Jeste li spremni obaviti još { $count }?
       *[other] Jeste li spremni obaviti još { $count }?
    }
speak-empty-state = Ponestalo nam je rečenica za snimanje na ovom jeziku...
speak-empty-state-cta = Predložite rečenice
record-button-label = Snimite svoj glas
share-title-new = <bold>Pomogni nam</bold> pronaći još glasova
keep-track-profile = Prati svoj napredak pomoću profila
login-to-get-started = Za početak se prijavi ili registriraj
target-segment-first-card = Doprinosiš našem prvom segmentu cilja
target-segment-generic-card = Pridonosiš ciljanom segmentu
target-segment-first-banner = Pomogni stvoriti prvi segment cilja Common Voicea za { $locale }
target-segment-add-voice = Dodaj svoj glas
target-segment-learn-more = Saznaj više

## Contribution Nav Items


## Reporting

report = Prijavi
report-title = Pošalji izvještaj
report-ask = Koji problem imate s ovom rečenicom?
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
shortcut-record-toggle-label = Snimaj/Stop
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Ponovo snimi isječak
shortcut-submit = Potvrdi
shortcut-submit-label = Pošalji isječke
request-language-text = Tvoj jezik nedostaje u Common Voiceu?
request-language-button = Zatražite jezik

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Play/Stop
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = d
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

