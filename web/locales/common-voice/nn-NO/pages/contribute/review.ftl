## REVIEW

sc-review-lang-not-selected = Du har ikkje valt språk. Gå til <profileLink>profilen</profileLink> din for å velje språk.
sc-review-title = Vurder setningar
sc-review-loading = Lastar setningar…
sc-review-select-language = Vel eit språk for å sjå gjennom setningar.
sc-review-no-sentences = Ingen setningar å vurdere. <addLink>Legg til fleire setningar no!</addLink>
sc-review-form-prompt =
    .message = Vurderte setningar ikkje sendt inn, er du sikker?
sc-review-form-usage = Sveip til høgre for å godkjenne setninga. Sveip til venstre for å avvise ho. Sveip opp for å hoppe over. <strong>Ikkje gløym å sende inn vurderinga di!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Kjelde: { $sentenceSource }
sc-review-form-button-reject = Avvis
sc-review-form-button-skip = Hopp over
sc-review-form-button-approve = Godkjenn
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = J
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = H
sc-review-form-keyboard-usage-custom = Du kan òg bruke tastatursnarvegar: { sc-review-form-button-approve-shortcut } for å godkjenne, { sc-review-form-button-reject-shortcut } for å avvise, { sc-review-form-button-skip-shortcut } for å hoppe over
sc-review-form-button-submit =
    .submitText = Fullfør vurdering
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ingen setningar vurderte.
        [one] 1 setning vurdert. Takk skal du ha!
       *[other] { $sentences } setningar vurderte. Takk skal du ha!
    }
sc-review-form-review-failure = Klarte ikkje å lagre vurderinga. Prøv på nytt seinare.
sc-review-link = Vurdering

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Vurderingskriterium
sc-criteria-title = Vurderingskriterium
sc-criteria-make-sure = Sørg for at setninga oppfyller følgjande kriterium:
sc-criteria-item-1 = Setninga må vere rett stava.
sc-criteria-item-2 = Setninga må vere grammatisk rett.
sc-criteria-item-3 = Setninga må kunne seiast.
sc-criteria-item-4 = Viss setninga oppfyller kriteria, klikkar du på «Godkjenn»-knappen til høgre.
sc-criteria-item-5-2 = Viss setninga ikkje oppfyller kriteria ovanfor, klikkar du på «Avvis»-knappen til venstre. Viss du er usikker på setninga, kan du også hoppe over ho og gå vidare til neste.
sc-criteria-item-6 = Viss du går tom for setningar å vurdere, kan du hjelpe oss med å samle inn fleire setningar!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kontroller <icon></icon> er dette ei språkleg korrekt setning?
sc-review-rules-title = Oppfyller setninga retningslinjene?
sc-review-empty-state = Det er, akkurat no, ingen setningar å vurdere på dette språket.
report-sc-different-language = Anna språk
report-sc-different-language-detail = Ho er skriven på eit anna språk enn det eg vurderer.
sentences-fetch-error = Det oppsto en feil under henting av setningar
review-error = Det oppstod en feil under vurderinga av denne setninga
review-error-rate-limit-exceeded = Du er for rask. Ta deg tid til å sjå gjennom setninga for å sikre at ho er rett.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Vi gjer nokre store endringar
sc-redirect-page-subtitle-1 = Setningsinnsamlaren flyttar til kjerneplattforma Common Voice. Du kan no <writeURL>skrive</writeURL> ei setning eller <reviewURL>sjå gjennom</reviewURL> enkeltsetningsinnsendingar på Common Voice.
sc-redirect-page-subtitle-2 = Still spørsmål på <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> eller <emailLink>e-post</emailLink>.
# menu item
review-sentences = Vurder setningar
