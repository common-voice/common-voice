## Error pages

banner-error-slow-1 = Sorry, Common Voice werkt langzaam. Bedankt voor uw interesse.
banner-error-slow-2 = We ontvangen veel verkeer en zijn momenteel de problemen aan het onderzoeken.
banner-error-slow-link = Statuspagina
error-something-went-wrong = Sorry, er is iets misgegaan
error-clip-upload = Het uploaden van dit fragment mislukt steeds, blijven proberen?
error-clip-upload-server = Het uploaden van dit fragment mislukt steeds op de server. Herlaad de pagina of probeer het later nog eens.
error-clip-upload-too-large = Uw opnamebestand is te groot om te uploaden. Probeer een korter fragment op te nemen.
error-clip-upload-server-error = Serverfout bij het verwerken van uw fragment. Laad de pagina opnieuw of probeer het later nog eens.
error-title-404 = We kunnen deze pagina niet voor u vinden
error-content-404 = Misschien helpt onze <homepageLink>startpagina</homepageLink>? Als u een vraag wilt stellen, kunt u lid worden van de <matrixLink>Matrix-gemeenschap-chat</matrixLink>, siteproblemen volgen via <githubLink>GitHub</githubLink> of bezoek <discourseLink>onze Discourse-forums</discourseLink>.
error-title-500 = Sorry, er is iets misgegaan
error-content-500 = Er is een onverwachte fout opgetreden. Probeer het later nogmaals. Voor hulp kunt u lid worden van de <matrixLink>Matrix-gemeenschap-chat</matrixLink>, websiteproblemen volgen via <githubLink>GitHub</githubLink> of <discourseLink>onze Discourse-forums</discourseLink> bezoeken.
error-title-502 = Verbinding onderbroken
error-content-502 = U kunt op dit moment geen stabiele verbinding met onze servers tot stand brengen. Probeer het later opnieuw. Voor hulp kunt u lid worden van de <matrixLink>Matrix-gemeenschap-chat</matrixLink>, websiteproblemen volgen via <githubLink>GitHub</githubLink> of <discourseLink>onze Discourse-forums</discourseLink> bezoeken.
error-title-503 = We ondervinden momenteel een onverwachte onderbreking
error-content-503 = De site zal zo snel mogelijk worden hersteld. Neem voor de meest recente informatie deel aan de <matrixLink>Matrix-gemeenschap-chat</matrixLink> of bezoek <githubLink>GitHub</githubLink> of <discourseLink>onze Discourse-forums</discourseLink> om problemen met de website te melden en te volgen.
error-title-504 = Aanvraagtime-out
error-content-504 = Het voltooien van de aanvraag duurde te lang. Dit is meestal tijdelijk. Probeer het opnieuw. Voor hulp kunt u lid worden van de <matrixLink>Matrix-gemeenschap-chat</matrixLink>, websiteproblemen volgen via <githubLink>GitHub</githubLink> of <discourseLink>onze Discourse-forums</discourseLink> bezoeken.
error-code = Fout { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] We konden uw fragment niet uploaden. Dit is al eerder geüpload. Laten we doorgaan met de volgende serie!
       *[other] We konden { $total } fragmenten niet uploaden. Deze zijn al eerder geüpload. Laten we doorgaan met de volgende serie!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = We hebben { $uploaded } van uw fragmenten geüpload – de rest is al geüpload. Laten we doorgaan met de volgende serie!
