## REVIEW

sc-review-lang-not-selected =
    U hebt geen talen geselecteerd. Ga naar uw
    <profileLink>Profiel</profileLink> om talen te selecteren.
sc-review-title = Zinnen beoordelen
sc-review-loading = Zinnen laden…
sc-review-select-language = Selecteer een taal om zinnen te beoordelen.
sc-review-no-sentences =
    Geen zinnen om te beoordelen.
    <addLink>Voeg nu meer zinnen toe!</addLink>
sc-review-form-prompt =
    .message = Beoordeelde zinnen niet ingediend, weet u het zeker?
sc-review-form-usage =
    Veeg naar rechts om de zin goed te keuren. Veeg naar links om deze af te wijzen.
    Veeg omhoog om deze over te slaan. <strong>Vergeet niet uw beoordeling in te dienen!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Bron: { $sentenceSource }
sc-review-form-button-reject = Afwijzen
sc-review-form-button-skip = Overslaan
sc-review-form-button-approve = Goedkeuren
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = J
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = O
sc-review-form-keyboard-usage-custom = U kunt ook sneltoetsen gebruiken: { sc-review-form-button-approve-shortcut } om goed te keuren, { sc-review-form-button-reject-shortcut } om af te keuren, { sc-review-form-button-skip-shortcut } om over te slaan
sc-review-form-button-submit =
    .submitText = Beoordeling voltooien
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Geen zinnen beoordeeld.
        [one] Eén zin beoordeeld. Bedankt!
       *[other] { $sentences } zinnen beoordeeld. Bedankt!
    }
sc-review-form-review-failure = Beoordeling kan niet worden opgeslagen. Probeer het later nog eens.
sc-review-link = Beoordelen

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Beoordelingscriteria
sc-criteria-title = Beoordelingscriteria
sc-criteria-make-sure = Zorg ervoor dat de zin aan de volgende criteria voldoet:
sc-criteria-item-1 = De zin moet correct gespeld zijn.
sc-criteria-item-2 = De zin moet grammaticaal correct zijn.
sc-criteria-item-3 = De zin moet uitspreekbaar zijn.
sc-criteria-item-4 = Als de zin aan de criteria voldoet, klik dan op de knop &quot;Goedkeuren&quot; aan de rechterkant.
sc-criteria-item-5-2 =
    Als de zin niet aan de bovenstaande criteria voldoet, klik dan op de knop ‘Afwijzen’ aan de linkerkant.
    Als u niet zeker bent van de zin, kunt u deze ook overslaan en doorgaan naar de volgende.
sc-criteria-item-6 = Als u geen zinnen meer hebt om te beoordelen, help ons dan om meer zinnen te verzamelen!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Controleren <icon></icon> of dit een taalkundig correcte zin is?
sc-review-rules-title = Voldoet de zin aan de richtlijnen?
sc-review-empty-state = Er zijn momenteel geen zinnen om te beoordelen in deze taal.
report-sc-different-language = Andere taal
report-sc-different-language-detail = Het is geschreven in een andere taal dan die ik aan het beoordelen ben.
sentences-fetch-error = Er is een fout opgetreden bij het ophalen van zinnen
review-error = Er is een fout opgetreden bij het beoordelen van deze zin
review-error-rate-limit-exceeded = U gaat te snel. Neem even de tijd om de zin te bekijken om er zeker van te zijn dat deze correct is.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = We voeren enkele grote veranderingen door
sc-redirect-page-subtitle-1 = De Sentence Collector verhuist naar de kern van het Common Voice-platform. U kunt nu een zin <writeURL>schrijven</writeURL> of inzendingen van losse zinnen <reviewURL>beoordelen</reviewURL> op Common Voice.
sc-redirect-page-subtitle-2 = Stel ons vragen op <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> of <emailLink>e-mail</emailLink>.
