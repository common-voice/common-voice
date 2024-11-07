## REVIEW

sc-review-lang-not-selected = Du har inte valt några språk. Gå till din <profileLink>Profil</profileLink> för att välja språk.
sc-review-title = Granska meningar
sc-review-loading = Laddar meningar…
sc-review-select-language = Välj ett språk för att granska meningar.
sc-review-no-sentences = Inga meningar att granska. <addLink>Lägg till fler meningar nu!</addLink>
sc-review-form-prompt =
    .message = Granskade meningar som inte har skickats in, är du säker?
sc-review-form-usage = Svep åt höger för att godkänna meningen. Svep åt vänster för att avvisa den. Svep uppåt för att hoppa över den. <strong>Glöm inte att skicka in din granskning!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Källa: { $sentenceSource }
sc-review-form-button-reject = Avvisa
sc-review-form-button-skip = Hoppa över
sc-review-form-button-approve = Godkänn
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = J
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = H
sc-review-form-keyboard-usage-custom = Du kan också använda kortkommandon: { sc-review-form-button-approve-shortcut } för att godkänna, { sc-review-form-button-reject-shortcut } för att avvisa, { sc-review-form-button-skip-shortcut } för att hoppa över
sc-review-form-button-submit =
    .submitText = Avsluta granskning
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Inga meningar granskade.
        [one] 1 mening granskad. Tack!
       *[other] { $sentences } meningar granskade. Tack!
    }
sc-review-form-review-failure = Granskningen kunde inte sparas. Vänligen försök igen senare.
sc-review-link = Granska

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Granskningskriterier
sc-criteria-title = Granskningskriterier
sc-criteria-make-sure = Se till att meningen uppfyller följande kriterier:
sc-criteria-item-1 = Meningen måste vara rättstavad.
sc-criteria-item-2 = Meningen måste vara grammatiskt korrekt.
sc-criteria-item-3 = Meningen måste vara talbar.
sc-criteria-item-4 = Om meningen uppfyller kriterierna klickar du på knappen &quot;Godkänn&quot; knappen till höger.
sc-criteria-item-5-2 = Om meningen inte uppfyller ovanstående kriterier klickar du på knappen &quot;Avvisa&quot; knappen till vänster. Om du är osäker på meningen kan du också hoppa över den och gå vidare till nästa.
sc-criteria-item-6 = Om du får slut på meningar att granska, vänligen hjälp oss att samla in fler meningar!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kontrollera <icon></icon> är detta en språkligt korrekt mening?
sc-review-rules-title = Uppfyller meningen riktlinjerna?
sc-review-empty-state = Det finns för närvarande inga meningar att granska på detta språk.
report-sc-different-language = Annat språk
report-sc-different-language-detail = Den är skriven på ett annat språk än det jag granskar.
sentences-fetch-error = Ett fel uppstod när meningar skulle hämtas
review-error = Ett fel uppstod när den här meningen granskades
review-error-rate-limit-exceeded = Du är för snabb. Ta en stund att granska meningen för att se till att den är korrekt.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Vi gör några viktiga förändringar
sc-redirect-page-subtitle-1 = Meningssamlaren flyttar till kärnplattformen Common Voice. Du kan nu <writeURL>skriva</writeURL> en mening eller <reviewURL>granska</reviewURL> enstaka meningsinlämningar på Common Voice.
sc-redirect-page-subtitle-2 = Ställ frågor till oss på <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> eller <emailLink>e-post</emailLink>.
