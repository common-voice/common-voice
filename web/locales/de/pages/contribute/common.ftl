action-click = klicken
action-tap = antippen
contribute = Mitarbeiten
review = Prüfen
skip = Überspringen
shortcuts = Tastenkürzel
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Aufzeichnung
       *[other] <bold>{ $count }</bold> Aufzeichnungen
    }
goal-help-recording = Sie haben Common Voice geholfen, <goalPercentage></goalPercentage> des heutigen Aufzeichnungsziels von { $goalValue } zu erreichen!
goal-help-validation = Sie haben Common Voice geholfen, <goalPercentage></goalPercentage> des heutigen Bestätigungsziels von { $goalValue } zu erreichen!
contribute-more = Bereit { $count } weitere zu machen?
speak-empty-state = Für diese Sprache gibt es keine Sätze mehr, die aufgenommen werden könnten…
no-sentences-for-variants = Ihre Sprachvariante hat möglicherweise keine Sätze mehr! Wenn Sie sich wohl fühlen, können Sie Ihre Einstellungen ändern, um andere Sätze in Ihrer Sprache zu sehen.
speak-empty-state-cta = Sätze beitragen
speak-loading-error =
    Wir konnten für Sie keine Sätze zum Sprechen abrufen.
    Bitte versuchen Sie es später erneut.
record-button-label = Nehmen Sie Ihre Stimme auf
share-title-new = <bold>Helfen Sie uns dabei,</bold> mehr Stimmen zu finden
keep-track-profile = Verfolgen Sie Ihren Fortschritt mit einem Profil
login-to-get-started = Melden Sie sich an oder registrieren Sie sich, um loszulegen
target-segment-first-card = Sie tragen zu unserem ersten Zielsegment bei
target-segment-generic-card = Sie tragen zu einem Zielsegment bei
target-segment-first-banner = Helfen Sie dabei, das erste Zielsegment von Common Voice in { $locale } zu erstellen
target-segment-add-voice = Fügen Sie Ihre Stimme hinzu
target-segment-learn-more = Weitere Informationen
change-preferences = Einstellungen ändern

## Contribution Nav Items

contribute-voice-collection-nav-header = Stimmensammlung
contribute-sentence-collection-nav-header = Sätze sammeln

## Reporting

report = Melden
report-title = Eine Meldung einreichen
report-ask = Welche Probleme haben Sie mit diesem Satz?
report-offensive-language = Beleidigende Sprache
report-offensive-language-detail = Der Satz beinhaltet respektlose oder beleidigende Sprache.
report-grammar-or-spelling = Grammatik- / Rechtschreibfehler
report-grammar-or-spelling-detail = Der Satz beinhaltet einen grammatikalischen oder Rechtschreibfehler.
report-different-language = Andere Sprache
report-different-language-detail = Der Satz ist in einer Sprache geschrieben, die ich nicht spreche.
report-difficult-pronounce = Schwer auszusprechen
report-difficult-pronounce-detail = Es enthält Wörter oder Ausdrücke, die schwer zu lesen oder auszusprechen sind.
report-offensive-speech = Anstößige Rede
report-offensive-speech-detail = Der Satz beinhaltet eine respektlose oder anstößige Sprache.
report-other-comment =
    .placeholder = Kommentar
success = Geschafft
continue = Weiter
report-success = Die Meldung wurde erfolgreich abgesendet

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = ü

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = a
shortcut-record-toggle-label = Aufnahme/Abbruch
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Aufzeichnung wiederholen
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Laufende Aufzeichnung verwerfen
shortcut-submit = Eingabe
shortcut-submit-label = Aufzeichnungen übertragen
request-language-text = Ihre Sprache wird bei Common Voice noch nicht aufgeführt? Da lässt sich was machen!
request-language-button = Anfrage schicken

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Play/Stop
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = j
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Kriterien
contribution-criteria-link = Kriterien zum Mitwirken verstehen
contribution-criteria-page-title = Kriterien zum Mitwirken
contribution-criteria-page-description = Informieren Sie sich darüber, worauf Sie beim Anhören von Sprachclips achten sollten und wie Sie auch Ihre Stimmaufzeichnungen verbessern können!
contribution-for-example = Beispiel
contribution-misreadings-title = Lesefehler
contribution-misreadings-description = Überprüfen Sie beim Hören sehr genau, ob das Aufgenommene auch das Geschriebene ist; lehnen Sie die Aufzeichnung ab, auch wenn es nur geringfügige Fehler gibt. <br />Sehr häufige Fehler sind:
contribution-misreadings-description-extended-list-1 = Fehlendes <strong>„Ein(e)“</strong> oder <strong>„Der“/„Die“/„Das“</strong> zum Beginn einer Aufzeichnung
contribution-misreadings-description-extended-list-2 = Fehlendes <strong>„“s</strong> am Ende eines Wortes.
contribution-misreadings-description-extended-list-3 = Zusammenziehungen (Kontraktionen) beim Lesen, die eigentlich nicht da sind, wie „fürs“ statt „für das“ oder umgekehrt.
contribution-misreadings-description-extended-list-4 = Fehlendes Ende des letzten Worts eines Satzes, weil die Aufnahme zu schnell beendet wird.
contribution-misreadings-description-extended-list-5 = Mehrere Versuche, ein Wort zu lesen.
contribution-misreadings-example-1-title = Die großen Einsatzfahrzeuge der Feuerwehr.
contribution-misreadings-example-2-title = Die großen Einsatzfahrzeug der Feuerwehr.
contribution-misreadings-example-2-explanation = [Sollte „Einsatzfahrzeuge“ heißen]
contribution-misreadings-example-3-title = Die großen Einsatzfahrzeuge der Feuerw-.
contribution-misreadings-example-3-explanation = [Aufnahme vor Ende des letzten Wortes abgeschnitten]
contribution-misreadings-example-4-title = Die großen Einsatzfahrzeuge der Feuerwehr. Ja.
contribution-misreadings-example-4-explanation = [Es wurde mehr als der erforderliche Text aufgenommen]
contribution-misreadings-example-5-title = Wir gehen Kaffee holen.
contribution-misreadings-example-6-title = Wir gehn Kaffee holen.
contribution-misreadings-example-6-explanation = [Sollte „Wir gehen“ heißen]
contribution-misreadings-example-7-title = Wir gehen einen Kaffee holen.
contribution-misreadings-example-7-explanation = [Im Originaltext ist kein „einen“]
contribution-misreadings-example-8-title = Die Hummel flog vorbei.
contribution-misreadings-example-8-explanation = [Nicht übereinstimmender Inhalt]
contribution-varying-pronunciations-title = Unterschiedliche Aussprachen
contribution-varying-pronunciations-description = Seien Sie vorsichtig, bevor Sie einen Clip mit der Begründung ablehnen, dass der Leser ein Wort falsch ausgesprochen hat, die Betonung an der falschen Stelle gesetzt oder anscheinend ein Fragezeichen ignoriert hat. Es gibt eine Vielzahl von Aussprachen auf der ganzen Welt, von denen Sie einige in Ihrer Umgebung möglicherweise noch nicht gehört haben. Bitte berücksichtigen Sie, dass es Menschen gibt, die anders sprechen als Sie.
contribution-varying-pronunciations-description-extended = Wenn Sie hingegen der Meinung sind, dass der Leser das Wort wahrscheinlich noch nie gesehen hat und einfach die Aussprache falsch geraten hat, lehnen Sie es bitte ab. Wenn Sie unsicher sind, klicken Sie auf die Schaltfläche „Überspringen“.
contribution-varying-pronunciations-example-1-title = Er trank einen Kaffee.
contribution-varying-pronunciations-example-1-explanation = [„Kaffee“ wird im Deutschen auf der ersten, im Österreichischen auf der zweiten Silbe betont.]
contribution-varying-pronunciations-example-2-title = Es herrschte totales Cha-os.
contribution-varying-pronunciations-example-2-explanation = [„Chaos“ wird im Deutschen mit einer, nicht mit zwei Silben gesprochen.]
contribution-background-noise-title = Hintergrundgeräusche
contribution-background-noise-description = Wir möchten, dass die Algorithmen des maschinellen Lernens mit einer Vielzahl von Hintergrundgeräuschen umgehen können. Es sind sogar relativ laute Geräusche akzeptabel, solange sie noch den ganzen Text hören können. Ruhige Hintergrundmusik ist in Ordnung; Musik, die so laut ist, dass Sie nicht mehr jedes Wort verstehen, ist es nicht.
contribution-background-noise-description-extended = Wenn die Aufnahme abbricht oder knistert, verwerfen Sie sie, es sei denn, der gesamte Text ist noch zu hören.
contribution-background-noise-example-1-fixed-title = <strong>[Schneuzen]</strong> Die großen Dinosaurier der <strong>[Husten]</strong> Trias.
contribution-background-noise-example-2-fixed-title = Die großen Dino <strong>[Husten]</strong> der Trias.
contribution-background-noise-example-2-explanation = [Ein Teil des Textes ist nicht zu hören]
contribution-background-noise-example-3-fixed-title = <strong>[Rauschen]</strong> großen Dinosaurier der <strong>[Rauschen]</strong> -rias.
contribution-background-voices-title = Hintergrundstimmen
contribution-background-voices-description = Ein leises Hintergrundrauschen ist in Ordnung, aber wir möchten keine zusätzlichen Stimmen, die dazu führen können, dass ein maschineller Algorithmus Wörter erkennt, die nicht im geschriebenen Text enthalten sind. Wenn Sie andere Wörter als den Text hören, sollte der Clip abgelehnt werden. Dies geschieht normalerweise dort, wo der Fernseher angelassen wurde oder in der Nähe ein Gespräch stattfindet.
contribution-background-voices-description-extended = Wenn die Aufnahme abbricht oder knistert, verwerfen Sie sie, es sei denn, der gesamte Text ist noch zu hören.
contribution-background-voices-example-1-title = Die großen Dinosaurier der Trias. <strong>[von einer Stimme gelesen]</strong>
contribution-background-voices-example-1-explanation = Kommst Du? <strong>[Zwischenruf einer anderen Stimme]</strong>
contribution-volume-title = Lautstärke
contribution-volume-description = Es wird natürliche Schwankungen in der Lautstärke zwischen den Lesern geben. Lehnen Sie nur ab, wenn die Lautstärke so hoch ist, dass die Aufnahme gestört wird, oder (häufiger) wenn sie so niedrig ist, dass Sie das Gesagte ohne Nachlesen im geschriebenen Text nicht hören können.
contribution-reader-effects-title = Lesereffekte
contribution-reader-effects-description = Die meisten Aufnahmen stammen von Menschen, die mit ihrer natürlichen Stimme sprechen. Sie können gelegentliche, nicht standardmäßige Aufnahmen akzeptieren, die gerufen, geflüstert oder offensichtlich mit einer „dramatischen“ Stimme geliefert werden. Bitte lehnen Sie gesungene Aufnahmen und solche mit einer computergenerierten Stimme ab.
contribution-just-unsure-title = Nur unsicher?
contribution-just-unsure-description = Wenn Sie auf etwas stoßen, das diese Richtlinien nicht abdecken, stimmen Sie bitte nach bestem Wissen und Gewissen ab. Wenn Sie sich wirklich nicht entscheiden können, verwenden Sie die Überspringen-Schaltfläche und fahren Sie mit der nächsten Aufnahme fort.
see-more = <chevron></chevron>Mehr anzeigen
see-less = <chevron></chevron>Weniger anzeigen

