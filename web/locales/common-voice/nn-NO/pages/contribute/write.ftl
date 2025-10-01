## WRITE PAGE

write = Skriv
write-instruction = Legg til <icon></icon> ei offentleg domenesetning
write-page-subtitle = Setningar bidrege her vil bli lagt til eit offentleg tilgjengeleg cc-0-lisensiert datasett.
sentence =
    .label = Setning
sentence-input-placeholder = Skriv inn setninga di (godkjent for offentlege domene) her
small-batch-sentence-input-placeholder = Skriv inn setningane dine her (godkjende for offentlig bruk)
citation-input-placeholder = Referer til kjelda til setninga di (obligatorisk)
citation =
    .label = Tilvising
sc-write-submit-confirm = Eg stadfestar at denne setninga er <wikipediaLink>offentleg domene</wikipediaLink> og eg har løyve til å laste ho opp.
sc-review-write-title = Kva slags setningar kan eg leggja til?
sc-review-small-batch-title = Korleis leggje til fleire setningar
new-sentence-rule-1 = <noCopyright>Ingen opphavsretts</noCopyright>-avgrensingar (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Færre enn 15 ord per setning
new-sentence-rule-3 = Bruk rett grammatikk
new-sentence-rule-4 = Bruk rett stavemåte og teiknsetting
new-sentence-rule-5 = Ingen tal og spesialteikn
new-sentence-rule-6 = Ingen utanlandske bokstavar
new-sentence-rule-7 = Inkluder passande sitering
new-sentence-rule-8 = Ideelt naturleg og samtalevennleg (det bør vere lett å lese setninga).
login-instruction-multiple-sentences = <loginLink>Logg in</loginLink> eller <loginLink>registrer dig</loginLink> for å leggje til fleire setningar
how-to-cite = Korleis siterer eg?
how-to-cite-explanation-bold = Sitér med ei URL-kopling eller heile namnet på verket.
how-to-cite-explanation = Dersom det er dine eigne ord, berre sei <italicizedText>“Sjølvsitering”</italicizedText>. Vi treng å vite kvar du fann dette innhaldet, slik at vi kan sjekke at det er i det offentlege domenet og ingen opphavsrettsavgrensingar gjeld. For meir informasjon om sitering, sjå <guidelinesLink>Retningslinjene</guidelinesLink> våre.
guidelines = Retningslinjer
contact-us = Kontakt oss
add-sentence-success = 1 setning innsamla
add-sentence-error = Feil ved tillegging av setning
required-field = Fyll ut dette feltet.
single-sentence-submission = Innlevering av einskildsetning
small-batch-sentence-submission = innsending av fleire setningar
bulk-sentence-submission = Masseinnsending av setningar
single-sentence = Enkelt setning
small-batch-sentence = Lite parti
bulk-sentence = Masseinnsending
sentence-domain-combobox-label = Setningsdomene
sentence-domain-select-placeholder = Vel opptil tre domene
# Sentence Domain dropdown option
agriculture_food = Landbruk og matprodukt
# Sentence Domain dropdown option
automotive_transport = Køyretøy og transport
# Sentence Domain dropdown option
finance = Finans
# Sentence Domain dropdown option
service_retail = Service og detaljhandel
# Sentence Domain dropdown option
general = Generelt
# Sentence Domain dropdown option
healthcare = Helsevesen
# Sentence Domain dropdown option
history_law_government = Historie, lov og stat
# Sentence Domain dropdown option
language_fundamentals = Grunnleggande språk (t.d. siffer, bokstavar, pengar)
# Sentence Domain dropdown option
media_entertainment = Media og underhaldning
# Sentence Domain dropdown option
nature_environment = Natur og miljø
# Sentence Domain dropdown option
news_current_affairs = Nyheiter og aktuelle saker
# Sentence Domain dropdown option
technology_robotics = Teknologi og robotikk
sentence-variant-select-label = Setningsvariant
sentence-variant-select-placeholder = Vel ein variant (valfritt)
sentence-variant-select-multiple-variants = Generelt språk / fleire variantar

## BULK SUBMISSION

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Last opp <icon></icon> setningar godkjende for offentleg domene
sc-bulk-upload-instruction = Dra fila di hit eller <uploadButton>klikk for å laste opp</uploadButton>
sc-bulk-upload-instruction-drop = Slipp fila her for å laste opp
bulk-upload-additional-information = Viss det er tilleggsinformasjon du vil gi om denne fila, kontakt <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Viss det er tilleggsinformasjon du vil gi om denne fila som ikkje er inkludert i malen, kontakt <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Prøv på nytt ved å dra fila hit
try-upload-again-md = Prøv å laste opp igjen
select-file = Vel fil
select-file-mobile = Vel ei fil å laste opp
accepted-files = Godkjende filtypar: berre .tsv
minimum-sentences = Minimum antal setningar i fila: 1000
maximum-file-size = Maksimal filstorleik: 25 MB
what-needs-to-be-in-file = Kva må vere i fila mi?
what-needs-to-be-in-file-explanation = Ver vennleg og sjekk <templateFileLink>malfila<templateFileLink>vår</templateFileLink>. Setningane dine bør vere opphavsrettsfrie (CC0 eller tillate originalverk av innsendaren) og vere klare, grammatisk korrekte og lette å lese. Innsende setningar bør ta omlag 10–15 sekund å lese og bør unngå å inkludere tal, særnamn og spesialteikn.
upload-progress-text = Opplasting i framdrift...
sc-bulk-submit-confirm = Eg stadfestar at desse setningane er <wikipediaLink>offentleg domene</wikipediaLink> og at eg har løyve til å laste dei opp.
bulk-upload-success-toast = Fleire setningar lasta opp
bulk-upload-failed-toast = Mislykka opplasting. Prøv på nytt.
bulk-submission-success-header = Takk for at du bidrog med masseinnsendinga!
bulk-submission-success-subheader = Du hjelper Common Voice med å nå dei daglege setningsmåla våre!
upload-more-btn-text = Laste opp fleire setningar?
file-invalid-type = Ugyldig fil
file-too-large = Fila er for stor
file-too-small = Fila er for lita
too-many-files = For mange filer

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Legg til offentlege domenesetninar
multiple-sentences-error = Du kan ikkje leggje til fleire setningar for ei enkel innsending
exceeds-small-batch-limit-error = Kan ikkje sende inn meir enn 1000 setningar
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Grensa overskriden. Prøv på nytt om 1 minutt
       *[other] Grensa overskriden. Prøv på nytt om { $retryLimit } minutt
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Grense for førespurnadar overskriden. Prøv igjen om 1 sekund
       *[other] Grense for førespurnadar overskriden. Prøv igjen om { $retryLimit } sekund
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Du har nådd innsendingsgrensa for denne sida. Vent i 1 minutt før du sender inn ei ny setning. Takk for tolmodet!
       *[other] Du har nådd innsendingsgrensa for denne sida. Vent i { $retryLimit } minutt før du sender inn ei ny setning. Takk for tolmodet!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Du har nådd innsendingsgrensa for denne sida. Vent i 1 sekund før du sender inn ei ny setning. Takk for tolmodet!
       *[other] Du har nådd innsendingsgrensa for denne sida. Vent i { $retryLimit } sekund før du sender inn ei ny setning. Takk for tolmodet!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } av 1 setning innsamla
       *[other] { $uploadedSentences } av { $totalSentences } setningar innsamla
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } av 1 setning samla. Klikk <downloadLink>her</downloadLink> for å laste ned avviste setningar.
       *[other] { $uploadedSentences } av 1 setning samla. Klikk <downloadLink>her</downloadLink> for å laste ned avviste setningar.
    }
small-batch-sentences-rule-1 = Følg retningslinjene i «Kva for setningar kan eg leggje til?»
small-batch-sentences-rule-2 = Legg til éi setning per linje
small-batch-sentences-rule-3 = Skil setningar til éi linje ved å trykkje éin gong på «Enter» eller «Return»
small-batch-sentences-rule-4 = Legg til opptil 1000 setningar
small-batch-sentences-rule-5 = Alle setningar må ha same domene
small-batch-sentences-rule-6 = Alle setningar må ha same sitat
# menu item
add-sentences = Legg til setningar

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Legg til og sjå gjennom setningar, legg til spørsmål, transkriber lyd
add-sentences-menu-item-tooltip = Legg til setningar på ditt språk
review-sentences-menu-item-tooltip = Vurder setningar på språket ditt
add-questions-menu-item-tooltip = Legg til spørsmål på språket ditt
review-questions-menu-item-tooltip = Vurderingsspørsmål
transcribe-audio-menu-item-tooltip = Transkriber lydopptak på språket ditt

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = Skrivealternativ
add-sentences-menu-item-aria-label = Legg til nye setningar som fellesskapet kan lese
review-sentences-menu-item-aria-label = Vurder eksisterande setningar sendt inn av fellesskapet
add-questions-menu-item-aria-label = Send inn nye spørsmål som fellesskapet kan lese og svare på
review-questions-menu-item-aria-label = Sjå gjennom og stem på nye spørsmål sendt inn av fellesskapen
transcribe-audio-menu-item-aria-label = Transkribere lydopptak til tekst
