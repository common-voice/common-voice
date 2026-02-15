## Error pages

banner-error-slow-1 = Entschuldigung, Common Voice läuft langsam. Danke für Ihr Interesse.
banner-error-slow-2 = Wir empfangen aktuell viel Datenverkehr und untersuchen derzeit die Probleme.
banner-error-slow-link = Statusseite
error-something-went-wrong = Entschuldigung, etwas ist schiefgegangen!
error-clip-upload = Das Hochladen dieses Clips schlägt immer wieder fehl. Weitere Versuche unternehmen?
error-clip-upload-server = Das Hochladen dieses Clips schlägt aufseiten des Servers immer wieder fehl. Laden Sie die Seite neu oder versuchen Sie es später erneut.
error-clip-upload-too-large = Ihre Aufnahme ist zu groß zum Hochladen. Bitte versuchen Sie, einen kürzeren Clip aufzunehmen.
error-clip-upload-server-error = Serverfehler beim Verarbeiten Ihres Clips. Bitte laden Sie die Seite neu oder versuchen Sie es später erneut.
error-title-404 = Wir konnten diese Seite nicht finden
error-content-404 = Vielleicht hilft unsere <homepageLink>Startseite</ homepageLink> weiter. Um eine Frage zu stellen, nehmen Sie bitte am <matrixLink>Matrix-Community-Chat</matrixLink> teil, melden Sie Probleme mit der Website über <githubLink>GitHub</githubLink> oder besuchen Sie <discourseLink>unsere Discourse-Foren</discourseLink>.
error-title-500 = Entschuldigung, etwas ist schiefgegangen!
error-content-500 = Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie Hilfe benötigen, besuchen Sie bitte den <matrixLink>Matrix-Community-Chat</matrixLink>, melden Sie Probleme mit der Website über <githubLink>GitHub</githubLink> oder besuchen Sie <discourseLink>unsere Discourse-Foren</discourseLink>.
error-title-502 = Verbindung unterbrochen
error-content-502 = Sie können derzeit keine stabile Verbindung zu unseren Servern aufbauen. Bitte versuchen Sie es später erneut. Wenn Sie Hilfe benötigen, besuchen Sie bitte den <matrixLink>Matrix-Community-Chat</matrixLink>, melden Sie Probleme mit der Website über <githubLink>GitHub</githubLink> oder besuchen Sie <discourseLink>unsere Discourse-Foren</discourseLink>.
error-title-503 = Unsere Website ist unerwarteterweise nicht erreichbar.
error-content-503 = Die Seite wird so schnell wie möglich wieder verfügbar sein. Die neuesten Informationen erhalten Sie im <matrixLink>Matrix-Community-Chat</matrixLink>. Nutzen Sie <githubLink>GitHub</githubLink> oder <discourseLink>unsere Discourse-Foren</discourseLink>, um Probleme mit der Website zu melden und Fehlerberichte zu lesen.
error-title-504 = Zeitüberschreitung der Anfrage
error-content-504 = Die Anfrage dauerte zu lange. Dies tritt normalerweise nur vorübergehend auf. Bitte versuchen Sie es erneut. Wenn Sie Hilfe benötigen, besuchen Sie bitte den <matrixLink>Matrix-Community-Chat</matrixLink>, melden Sie Probleme mit der Website über <githubLink>GitHub</githubLink> oder besuchen Sie <discourseLink>unsere Discourse-Foren</discourseLink>.
error-code = Fehler { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Wir konnten Ihren Clip nicht hochladen. Er wurde bereits zuvor hochgeladen. Weiter geht’s mit dem nächsten Paket!
       *[other] Wir konnten { $total } Clips nicht hochladen. Sie wurden bereits zuvor hochgeladen. Weiter geht’s mit dem nächsten Paket!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Wir haben { $uploaded } Ihrer Clips hochgeladen – der Rest wurde bereits hochgeladen. Weiter geht’s mit dem nächsten Paket!
