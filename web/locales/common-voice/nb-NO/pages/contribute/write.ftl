## WRITE PAGE

write = Skriv
write-instruction = Legg til <icon></icon> en offentlig domenesetning
write-page-subtitle = Setninger som er bidratt her vil bli lagt til et offentlig tilgjengelig cc-0-lisensiert datasett.
sentence =
    .label = Setning
sentence-input-placeholder = Skriv inn setningen din (godkjent for offentlige domene) her
small-batch-sentence-input-placeholder = Skriv inn setningene dine her (tillatt for offentlig bruk)
citation-input-placeholder = Referer til kilden til setningen din (obligatorisk)
citation =
    .label = Kildehenvisning
sc-write-submit-confirm = Jeg bekrefter at denne setningen er <wikipediaLink>offentlig domene</wikipediaLink> og jeg har tillatelse til å laste den opp.
sc-review-write-title = Hvilke setninger kan jeg legge til?
sc-review-small-batch-title = Hvordan legge til flere setninger
new-sentence-rule-1 = <noCopyright>Ingen opphavsretts</noCopyright>-begrensninger (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Færre enn 15 ord per setning
new-sentence-rule-3 = Bruk riktig grammatikk
new-sentence-rule-4 = Bruk riktig stavemåte og tegnsetting
new-sentence-rule-5 = Ingen tall og spesialtegn
new-sentence-rule-6 = Ingen utenlandske bokstaver
new-sentence-rule-7 = Inkluder passende sitering
new-sentence-rule-8 = Ideelt sett naturlig og samtalepreg (det skal være lett å lese setningen)
login-instruction-multiple-sentences = <loginLink>Logg på</loginLink> eller <loginLink>registrer deg</loginLink> for å legge til flere setninger
how-to-cite = Hvordan siterer jeg?
how-to-cite-explanation-bold = Sitér med en URL-kobling eller hele navnet på verket.
how-to-cite-explanation = Hvis det er dine egne ord, bare si <italicizedText>“Selvsitering”</italicizedText>. Vi trenger å vite hvor du fant dette innholdet, slik at vi kan sjekke at det er i det offentlige domene og ingen opphavsrettsbegrensninger gjelder. For mer informasjon om sitering, se våre <guidelinesLink>Retningslinjer</guidelinesLink>.
guidelines = Retningslinjer
contact-us = Kontakt oss
add-sentence-success = 1 setning innsamlet
add-sentence-error = Feil ved å legge til setning
required-field = Fyll ut dette feltet.
single-sentence-submission = Enkeltsetningsinnsending
small-batch-sentence-submission = innsending av flere setninger
bulk-sentence-submission = Masseinnsending av setninger
single-sentence = Enkelt setning
small-batch-sentence = Lite parti
bulk-sentence = Masseinnsending
sentence-domain-combobox-label = Setningsdomene
sentence-domain-select-placeholder = Velg opptil tre domener
# Sentence Domain dropdown option
agriculture_food = Landbruk og matprodukter
# Sentence Domain dropdown option
automotive_transport = Kjøretøy og transport
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
language_fundamentals = Grunnleggende språk (f.eks. sifre, bokstaver, penger)
# Sentence Domain dropdown option
media_entertainment = Media og underholdning
# Sentence Domain dropdown option
nature_environment = Natur og miljø
# Sentence Domain dropdown option
news_current_affairs = Nyheter og Aktuelle saker
# Sentence Domain dropdown option
technology_robotics = Teknologi og robotikk
sentence-variant-select-label = Setningstype
sentence-variant-select-placeholder = Velg et alternativ (valgfritt)
sentence-variant-select-multiple-variants = Generelt språk / flere varianter

## BULK SUBMISSION

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Last opp <icon></icon> setninger godkjent for offentlig domene
sc-bulk-upload-instruction = Dra filen din hit eller <uploadButton>klikk for å laste opp</uploadButton>
sc-bulk-upload-instruction-drop = Slipp filen her for å laste opp
bulk-upload-additional-information = Hvis det er tilleggsinformasjon du vil oppgi om denne filen, kontakt <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Hvis det er tilleggsinformasjon du vil oppgi om denne filen som ikke er inkludert i malen, kontakt <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Prøv igjen ved å dra filen hit
try-upload-again-md = Prøv å laste opp igjen
select-file = Velg fil
select-file-mobile = Velg en fil å laste opp
accepted-files = Godkjente filtyper: kun .tsv
minimum-sentences = Minimum antall setninger i filen: 1000
maximum-file-size = Maksimal filstørrelse: 25 MB
what-needs-to-be-in-file = Hva må være i filen min?
what-needs-to-be-in-file-explanation = Sjekk vår <templateFileLink>malfil</templateFileLink>. Setningene dine bør være opphavsrettsfrie (CC0 eller tillatt originalverk av innsenderen) og være klare, grammatisk korrekte og lette å lese. Innsendte setninger bør ta omtrent 10–15 sekunder å lese og bør unngå å inkludere tall, egennavn og spesialtegn.
upload-progress-text = Opplasting pågår...
sc-bulk-submit-confirm = Jeg bekrefter at disse setningene er <wikipediaLink>offentlig domene</wikipediaLink> og jeg har tillatelse til å laste dem opp.
bulk-upload-success-toast = Massesetninger lastet opp
bulk-upload-failed-toast = Opplasting mislyktes. Prøv på nytt.
bulk-submission-success-header = Takk for at du bidro med masseinnsendingen!
bulk-submission-success-subheader = Du hjelper Common Voice med å nå våre daglige setningsmål!
upload-more-btn-text = Laste opp flere setninger?
file-invalid-type = Ugyldig fil
file-too-large = Filen er for stor
file-too-small = Filen er for liten
too-many-files = For mange filer

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Legg til offentlige domenesetninger
multiple-sentences-error = Du kan ikke legge til flere setninger for en enkelt innsending
exceeds-small-batch-limit-error = Kan ikke sende inn mer enn 1000 setninger
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Grense for forespørsler overskredet. Prøv igjen om 1 minutt
       *[other] Grense for forespørsler overskredet. Prøv igjen om { $retryLimit } minutter
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Grense for forespørsler overskredet. Prøv igjen om 1 sekund
       *[other] Grense for forespørsler overskredet. Prøv igjen om { $retryLimit } sekunder
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Du har nådd innsendingsgrensen for denne siden. Vent i 1 minutt før du sender inn en ny setning. Takk for tålmodigheten!
       *[other] Du har nådd innsendingsgrensen for denne siden. Vent i { $retryLimit } minutter før du sender inn en ny setning. Takk for tålmodigheten!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Du har nådd innsendingsgrensen for denne siden. Vent i 1 sekund før du sender inn en ny setning. Takk for tålmodigheten!
       *[other] Du har nådd innsendingsgrensen for denne siden. Vent i { $retryLimit } sekunder før du sender inn en ny setning. Takk for tålmodigheten!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } av 1 setning samlet inn
       *[other] { $uploadedSentences } av { $totalSentences } setninger samlet inn
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } av 1 setning samlet. Klikk <downloadLink>her</downloadLink> for å laste ned avviste setninger.
       *[other] { $uploadedSentences } av { $totalSentences } setninger samlet. Klikk <downloadLink>her</downloadLink> for å laste ned avviste setninger.
    }
small-batch-sentences-rule-1 = Følg retningslinjene fra «Hvilke setninger kan jeg legge til?»
small-batch-sentences-rule-2 = Legg til én setning per linje
small-batch-sentences-rule-3 = skill setninger til en linje ved å trykke "enter" eller "return" en gang
small-batch-sentences-rule-4 = Legg til opptil 1000 setninger
small-batch-sentences-rule-5 = Alle setninger må ha samme domene
small-batch-sentences-rule-6 = Alle setninger må ha samme sitat
# menu item
add-sentences = Legg til setninger

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Legg til og se gjennom setninger, legg til spørsmål, transkriber lyd
add-sentences-menu-item-tooltip = Legg til setninger på språket ditt
review-sentences-menu-item-tooltip = Gjennomgå setninger på språket ditt
add-questions-menu-item-tooltip = Legg til spørsmål på ditt språk
review-questions-menu-item-tooltip = Gjennomgangsspørsmål
transcribe-audio-menu-item-tooltip = Transkriber lydopptak på ditt språk

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = Skrivealternativer
add-sentences-menu-item-aria-label = Legg til nye setninger som fellesskapet kan lese
review-sentences-menu-item-aria-label = Vurder eksisterende setninger sendt inn av fellesskapet
add-questions-menu-item-aria-label = Send inn nye spørsmål som fellesskapet kan lese og svare på
review-questions-menu-item-aria-label = Se gjennom og stem på nye spørsmål sendt inn av fellesskapet
transcribe-audio-menu-item-aria-label = Transkribere lydopptak til tekst
