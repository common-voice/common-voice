## WRITE PAGE

write = Schrijven
write-instruction = Een <icon></icon> zin uit het publieke domein toevoegen
write-page-subtitle = Zinnen die hier zijn bijgedragen worden toegevoegd aan een openbaar beschikbare cc-0 gelicenseerde dataset.
sentence =
    .label = Zin
sentence-input-placeholder = Voer hier uw publieke domeinzin in
small-batch-sentence-input-placeholder = Voer hier uw publieke domeinzinnen in
citation-input-placeholder = Verwijzing naar de bron van uw zin (vereist)
citation =
    .label = Citaat
sc-write-submit-confirm =
    Ik bevestig dat deze zin <wikipediaLink>publiek domein</wikipediaLink> is en
    ik toestemming heb om deze te uploaden.
sc-review-write-title = Welke zinnen kan ik toevoegen?
sc-review-small-batch-title = Meerdere zinnen toevoegen
new-sentence-rule-1 = <noCopyright>Geen copyright</noCopyright>-beperkingen (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Minder dan 15 woorden
new-sentence-rule-3 = Gebruik de juiste grammatica
new-sentence-rule-4 = Gebruik correcte spelling en interpunctie
new-sentence-rule-5 = Geen cijfers en speciale tekens
new-sentence-rule-6 = Geen vreemde tekens
new-sentence-rule-7 = Voeg de juiste bronvermelding toe
new-sentence-rule-8 = In het beste geval natuurlijk en gemoedelijk (het zou gemakkelijk moeten zijn om de zin te lezen)
login-instruction-multiple-sentences = <loginLink>Meld u aan</loginLink> of <loginLink>schrijf u in</loginLink> om meerdere zinnen toe te voegen
how-to-cite = Hoe citeer ik?
how-to-cite-explanation-bold = Citeer met een URL-koppeling of de volledige naam van het werk.
how-to-cite-explanation = Als het uw eigen woorden zijn, zeg dan gewoon <italicizedText>‘Zelfcitaat’</italicizedText>. We moeten weten waar u deze inhoud hebt gevonden, zodat we kunnen controleren of deze zich in het publieke domein bevindt en of er geen auteursrechtelijke beperkingen van toepassing zijn. Zie voor meer informatie over citeren onze <guidelinesLink>Richtlijnenpagina</guidelinesLink>.
guidelines = Richtlijnen
contact-us = Contact opnemen
add-sentence-success = 1 zin verzameld
add-sentence-error = Fout bij toevoegen van zin
required-field = Vul dit veld in.
single-sentence-submission = Indienen van één zin
small-batch-sentence-submission = Indienen van zinnen in een kleine batch
bulk-sentence-submission = Bulkindiening van zinnen
single-sentence = Losse zin
small-batch-sentence = Kleine batch
bulk-sentence = Bulkbatch
sentence-domain-combobox-label = Zinsdomein
sentence-domain-select-placeholder = Selecteer maximaal drie domeinen
# Sentence Domain dropdown option
agriculture_food = Landbouw en voeding
# Sentence Domain dropdown option
automotive_transport = Automotive en transport
# Sentence Domain dropdown option
finance = Financieel
# Sentence Domain dropdown option
service_retail = Service en detailhandel
# Sentence Domain dropdown option
general = Algemeen
# Sentence Domain dropdown option
healthcare = Gezondheidszorg
# Sentence Domain dropdown option
history_law_government = Geschiedenis, recht en overheid
# Sentence Domain dropdown option
language_fundamentals = Taalbasis (bijv. cijfers, letters, geld)
# Sentence Domain dropdown option
media_entertainment = Media en amusement
# Sentence Domain dropdown option
nature_environment = Natuur en milieu
# Sentence Domain dropdown option
news_current_affairs = Nieuws en actualiteiten
# Sentence Domain dropdown option
technology_robotics = Technologie en robotica
sentence-variant-select-label = Zinsvariant
sentence-variant-select-placeholder = Selecteer een variant (optioneel)
sentence-variant-select-multiple-variants = Algemeen taalgebruik / meerdere varianten

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Zinnen <icon></icon> uit het publieke domein uploaden
sc-bulk-upload-instruction = Sleep uw bestand hierheen of <uploadButton>klik om te uploaden</uploadButton>
sc-bulk-upload-instruction-drop = Sleep bestand hierheen om te uploaden
bulk-upload-additional-information = Als u aanvullende informatie over dit bestand wilt verstrekken, neem dan contact op met <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Als u aanvullende informatie over dit bestand wilt verstrekken die niet in de sjabloon is opgenomen, neem dan contact op met <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Probeer het opnieuw door uw bestand hierheen te slepen
try-upload-again-md = Probeer opnieuw te uploaden
select-file = Bestand selecteren
select-file-mobile = Selecteer te uploaden bestand
accepted-files = Geaccepteerde bestandstypen: alleen .tsv
minimum-sentences = Minimum aantal zinnen in bestand: 1000
maximum-file-size = Maximale bestandsgrootte: 25 MB
what-needs-to-be-in-file = Wat moet er in mijn bestand zitten?
what-needs-to-be-in-file-explanation = Bekijk ons <templateFileLink>sjabloonbestand</templateFileLink>. Uw zinnen moeten vrij van auteursrechten zijn (CC0 of origineel werk met toestemming van de indiener) en duidelijk, grammaticaal correct en gemakkelijk te lezen zijn. Ingediende zinnen zouden een leeslengte van ongeveer 10 tot 15 seconden moeten hebben en mogen geen cijfers, eigennamen en speciale tekens bevatten.
upload-progress-text = Upload bezig…
sc-bulk-submit-confirm =
    Ik bevestig dat deze zinnen <wikipediaLink>publiek domein</wikipediaLink> zijn en
    ik toestemming heb om ze te uploaden.
bulk-upload-success-toast = Bulkupload zinnen voltooid
bulk-upload-failed-toast = Upload mislukt, probeer het opnieuw.
bulk-submission-success-header = Bedankt voor het indienen van uw bulkinzending!
bulk-submission-success-subheader = U helpt Common Voice onze dagelijkse zinsdoelen te bereiken!
upload-more-btn-text = Meer zinnen uploaden?
file-invalid-type = Ongeldig bestand
file-too-large = Bestand is te groot
file-too-small = Bestand is te klein
too-many-files = Te veel bestanden

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Meerdere zinnen uit het publieke domein toevoegen
multiple-sentences-error = U kunt niet meerdere zinnen toevoegen voor een enkele inzending
exceeds-small-batch-limit-error = Kan niet meer dan 1000 zinnen indienen
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Toegangslimiet overschreden. Probeer het opnieuw over 1 minuut
       *[other] Toegangslimiet overschreden. Probeer het opnieuw over { $retryLimit } minuten
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Toegangslimiet overschreden. Probeer het opnieuw over 1 seconde
       *[other] Toegangslimiet overschreden. Probeer het opnieuw over { $retryLimit } seconden
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] U hebt de indieningslimiet voor deze pagina bereikt. Wacht 1 minuut voordat u nog een zin invoert. Bedankt voor uw geduld!
       *[other] U hebt de indieningslimiet voor deze pagina bereikt. Wacht { $retryLimit } minuten voordat u nog een zin invoert. Bedankt voor uw geduld!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] U hebt de indieningslimiet voor deze pagina bereikt. Wacht 1 seconde voordat u nog een zin invoert. Bedankt voor uw geduld!
       *[other] U hebt de indieningslimiet voor deze pagina bereikt. Wacht { $retryLimit } seconden voordat u nog een zin invoert. Bedankt voor uw geduld!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } van 1 zin verzameld
       *[other] { $uploadedSentences } van { $totalSentences } zinnen verzameld
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } van 1 zin verzameld. Klik <downloadLink>hier</downloadLink> om afgewezen zinnen te downloaden.
       *[other] { $uploadedSentences } van { $totalSentences } zinnen verzameld. Klik <downloadLink>hier</downloadLink> om afgewezen zinnen te downloaden.
    }
small-batch-sentences-rule-1 = Volg de richtlijnen uit ‘Welke zinnen kan ik toevoegen?’
small-batch-sentences-rule-2 = Eén zin per regel toevoegen
small-batch-sentences-rule-3 = Scheid zinnen in losse regels door eenmaal op ‘Enter’ of ‘Return’ te drukken
small-batch-sentences-rule-4 = Voeg tot duizend zinnen toe
small-batch-sentences-rule-5 = Alle zinnen moeten hetzelfde domein hebben
small-batch-sentences-rule-6 = Alle zinnen moeten dezelfde bronvermelding hebben
# menu item
add-sentences = Zinnen toevoegen

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Zinnen toevoegen en beoordelen, Vragen toevoegen, Audio transcriberen
add-sentences-menu-item-tooltip = Zinnen in uw taal toevoegen
review-sentences-menu-item-tooltip = Zinnen in uw taal beoordelen
add-questions-menu-item-tooltip = Vragen in uw taal toevoegen
transcribe-audio-menu-item-tooltip = Audio-opnamen in uw taal transcriberen

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = Optiesmenu Schrijven
add-sentences-menu-item-aria-label = Nieuwe zinnen voor de gemeenschap toevoegen om te lezen
review-sentences-menu-item-aria-label = Bestaande zinnen die door de gemeenschap zijn ingediend beoordelen
add-questions-menu-item-aria-label = Nieuwe vragen indienen voor de gemeenschap om te lezen en te beantwoorden
transcribe-audio-menu-item-aria-label = Audio-opnamen omzetten naar tekst
