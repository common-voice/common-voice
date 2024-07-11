## REVIEW

sc-review-lang-not-selected =
    Sie haben keine Sprachen ausgewählt. Bitte öffnen Sie Ihr
    <profileLink>Profil</profileLink>, um Sprachen auszuwählen.
sc-review-title = Sätze überprüfen
sc-review-loading = Sätze werden geladen...
sc-review-select-language = Bitte wählen Sie eine Sprache aus, um Sätze zu überprüfen.
sc-review-no-sentences =
    Keine Sätze zu überprüfen.
    <addLink>Fügen Sie jetzt weitere Sätze hinzu!</addLink>
sc-review-form-prompt =
    .message = Überprüfte Sätze nicht eingereicht, sind Sie sicher?
sc-review-form-usage =
    Wischen Sie nach rechts, um den Satz zu genehmigen. Wischen Sie nach links, um ihn abzulehnen.
    Wischen Sie nach oben, um ihn zu überspringen. <strong>Vergessen Sie nicht, Ihre Bewertung zu übermitteln!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Quelle: { $sentenceSource }
sc-review-form-button-reject = Ablehnen
sc-review-form-button-skip = Überspringen
sc-review-form-button-approve = Genehmigen
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = G
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = A
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = U
sc-review-form-keyboard-usage-custom = Sie können auch Tastenkombinationen verwenden: { sc-review-form-button-approve-shortcut } zum Genehmigen, { sc-review-form-button-reject-shortcut } zum Ablehnen, { sc-review-form-button-skip-shortcut } zum Überspringen
sc-review-form-button-submit =
    .submitText = Bewertung abschließen
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Keine Sätze überprüft.
        [one] Ein Satz überprüft. Vielen Dank!
       *[other] { $sentences } Sätze überprüft. Vielen Dank!
    }
sc-review-form-review-failure = Bewertung konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.
sc-review-link = Bewertungen

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Überprüfungskriterien
sc-criteria-title = Überprüfungskriterien
sc-criteria-make-sure = Stellen Sie sicher, dass der Satz die folgenden Kriterien erfüllt:
sc-criteria-item-1 = Der Satz muss richtig geschrieben sein.
sc-criteria-item-2 = Der Satz muss grammatikalisch korrekt sein.
sc-criteria-item-3 = Der Satz muss aussprechbar sein.
sc-criteria-item-4 = Wenn der Satz die Kriterien erfüllt, klicken Sie auf die Schaltfläche „Genehmigen“ auf der rechten Seite.
sc-criteria-item-5-2 =
    Wenn der Satz die oben genannten Kriterien nicht erfüllt, klicken Sie auf die Schaltfläche „Ablehnen“ auf der linken Seite.
    Wenn Sie sich bei dem Satz nicht sicher sind, können Sie ihn auch überspringen und zum nächsten übergehen.
sc-criteria-item-6 = Wenn Ihnen die Sätze zur Überprüfung ausgehen, helfen Sie uns bitte, weitere Sätze zu sammeln!

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Überprüfen Sie, <icon></icon> ob dies ein linguistisch korrekter Satz ist.
sc-review-rules-title = Entspricht der Satz dem Leitfaden?
sc-review-empty-state = Es gibt derzeit keine Sätze in dieser Sprache, die überprüft werden müssen.
report-sc-different-language = Andere Sprache
report-sc-different-language-detail = Er ist in einer anderen Sprache geschrieben als der, die ich überprüfe.
sentences-fetch-error = Beim Abrufen der Sätze ist ein Fehler aufgetreten
review-error = Beim Überprüfen dieses Satzes ist ein Fehler aufgetreten
review-error-rate-limit-exceeded = Sie sind zu schnell. Bitte nehmen Sie sich einen Moment Zeit, um den Satz auf Richtigkeit zu überprüfen.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Wir nehmen einige wichtige Änderungen vor
sc-redirect-page-subtitle-1 = Der Satzsammler zieht auf die Kern-Common-Voice-Plattform um. Sie können jetzt auf einen Satz Common Voice <writeURL>schreiben</writeURL> oder einzelne Sätze <reviewURL>überprüfen</reviewURL>.
sc-redirect-page-subtitle-2 = Stellen Sie uns Fragen auf <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> oder per <emailLink>E-Mail</emailLink>.

