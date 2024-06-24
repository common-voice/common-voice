## REVIEW

sc-review-lang-not-selected = Du har ikke valgt sprog. Gå til din <profileLink>profil</profileLink> for at vælge sprog.
sc-review-title = Gennemgå sætninger
sc-review-loading = Indlæser sætninger...
sc-review-select-language = Vælg et sprog for at gennemgå sætninger.
sc-review-no-sentences = Ingen sætninger at gennemgå. <addLink>Tilføj flere sætninger nu!</addLink>
sc-review-form-prompt =
    .message = Gennemgåede sætninger er ikke indsendt, er du sikker?
sc-review-form-usage = Stryg til højre for at godkende sætningen. Stryg til venstre for at afvise den. Stryg op for at springe den over. <strong>Glem ikke at indsende din gennemgang!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Kilde: { $sentenceSource }
sc-review-form-button-reject = Afvis
sc-review-form-button-skip = Spring over
sc-review-form-button-approve = Godkend
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = G
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = A
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Du kan også bruge tastaturgenveje: { sc-review-form-button-approve-shortcut } for at Godkende, { sc-review-form-button-reject-shortcut } for at Afvise, { sc-review-form-button-skip-shortcut } for at Springe over
sc-review-form-button-submit =
    .submitText = Afslut gennemgang
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ingen sætninger gennemgået.
        [one] En sætning gennemgået. Tak skal du have!
       *[other] { $sentences } sætninger gennemgået. Tak skal du have!
    }
sc-review-form-review-failure = Gennemgangen kunne ikke gemmes. Prøv igen senere.
sc-review-link = Gennemgang

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kriterier for gennemgang
sc-criteria-title = Kriterier for gennemgang
sc-criteria-make-sure = Sørg for, at sætningen opfylder følgende kriterier:
sc-criteria-item-1 = Sætningen skal være stavet korrekt.
sc-criteria-item-2 = Sætningen skal være grammatisk korrekt.
sc-criteria-item-3 = Sætningen skal kunne siges.
sc-criteria-item-4 = Hvis sætningen opfylder kriterierne, skal du klikke på knappen &quot;Godkend&quot; til højre.
sc-criteria-item-5-2 = Hvis sætningen ikke opfylder ovenstående kriterier, skal du klikke på knappen &quot;Afvis&quot; til venstre. Hvis du er usikker på sætningen, kan du også springe den over og gå videre til den næste.
sc-criteria-item-6 = Hvis du løber tør for sætninger at gennemgå, må du meget gerne hjælpe os med at indsamle flere sætninger!

## LANGUAGE VARIANT CODES


## REVIEW PAGE

sc-review-rules-title = Opfylder sætningen retningslinjerne?
sc-review-empty-state = Der er i øjeblikket ingen sætninger at godkende på dette sprog.
report-sc-different-language = Andet sprog
report-sc-different-language-detail = Det er skrevet på et andet sprog end det, jeg gennemgår.
sentences-fetch-error = Der opstod en fejl under hentning af sætninger
review-error = Der opstod en fejl under gennemgang af denne sætning
review-error-rate-limit-exceeded = Det går for hurtigt. Brug et øjeblik på at gennemgå sætningen for at sikre, at den er korrekt.
sc-redirect-page-subtitle-2 = Stil os spørgsmål på <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> eller via <emailLink>e-mail</emailLink>.

