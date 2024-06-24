## REVIEW

sc-review-lang-not-selected = Du har ikke valgt noen språk. Gå til <profileLink>profilen</profileLink> din for å velge språk.
sc-review-title = Gjennomgå setninger
sc-review-loading = Laster inn setninger …
sc-review-select-language = Velg et språk for å se gjennom setninger.
sc-review-no-sentences = Ingen setninger å vurdere. <addLink>Legg til flere setninger nå!</addLink>
sc-review-form-prompt =
    .message = Gjennomgåtte setninger ikke sendt inn, er du sikker?
sc-review-form-usage = Sveip til høyre for å godkjenne setningen. Sveip til venstre for å avvise den. Sveip opp for å hoppe over den. <strong>Ikke glem å sende inn vurderingen din!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Kilde: { $sentenceSource }
sc-review-form-button-reject = Avvis
sc-review-form-button-skip = Hopp over
sc-review-form-button-approve = Godkjenn
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = J
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = H
sc-review-form-keyboard-usage-custom = Du kan også bruke tastatursnarveier: { sc-review-form-button-approve-shortcut } for å godkjenne, { sc-review-form-button-reject-shortcut } for å avvise, { sc-review-form-button-skip-shortcut } for å hoppe over
sc-review-form-button-submit =
    .submitText = Fullfør gjennomgangen
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ingen setninger gjennomgått.
        [one] { $setninger } setning gjennomgått. Takk skal du ha!
       *[other] { $setninger } setninger gjennomgått. Takk skal du ha!
    }
sc-review-form-review-failure = Gjennomgangen kunne ikke lagres. Prøv igjen senere.
sc-review-link = Gjennomgang

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Vurderingskriterier
sc-criteria-title = Vurderingskriterier
sc-criteria-make-sure = Sørg for at setningen oppfyller følgende kriterier:
sc-criteria-item-1 = Setningen må staves riktig.
sc-criteria-item-2 = Setningen må være grammatisk korrekt.
sc-criteria-item-3 = Setningen må kunne tales.
sc-criteria-item-4 = Hvis setningen oppfyller kriteriene, klikker du på "Godkjenn"-knappen til høyre.
sc-criteria-item-5-2 = Hvis setningen ikke oppfyller kriteriene ovenfor, klikker du på "Avvis"-knappen til venstre. Hvis du er usikker på setningen, kan du også hoppe over den og gå videre til neste.
sc-criteria-item-6 = Hvis du går tom for setninger å vurdere, vennligst hjelp oss med å samle inn flere setninger!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Sjekk <icon></icon> er dette en språklig korrekt setning?
sc-review-rules-title = Oppfyller setningen retningslinjene?
sc-review-empty-state = Det er for øyeblikket ingen setninger å vurdere på dette språket.
report-sc-different-language = Annet språk
report-sc-different-language-detail = Den er skrevet på et annet språk enn det jeg gjennomgår.
sentences-fetch-error = Det oppsto en feil under henting av setninger
review-error = Det oppstod en feil ved gjennomgang av denne setningen
review-error-rate-limit-exceeded = Du er for rask. Ta deg tid til å se gjennom setningen for å sikre at den er riktig.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Vi gjør noen store endringer
sc-redirect-page-subtitle-1 = Sentence Collector flytter til kjerneplattformen Common Voice. Du kan nå <writeURL>skrive</writeURL> en setning eller <reviewURL>se gjennom</reviewURL> enkeltsetningsinnsendinger på Common Voice.
sc-redirect-page-subtitle-2 = Still oss spørsmål på <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> eller <emailLink>e-post</emailLink>.

