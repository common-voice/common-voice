## WRITE PAGE

write = Skriv
sentence =
    .label = Sætning
citation =
    .label = Kildehenvisning
sc-write-submit-confirm = Jeg bekræfter, at denne sætning er i <wikipediaLink>offentligt domæne</wikipediaLink>, og at jeg har tilladelse til at uploade den.
sc-review-write-title = Hvilke sætninger kan jeg tilføje?
sc-review-small-batch-title = Sådan tilføjer du flere sætninger
new-sentence-rule-1 = <noCopyright>Ingen copyright</noCopyright>-begrænsninger (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Færre end 15 ord per sætning
new-sentence-rule-3 = Brug korrekt grammatik
new-sentence-rule-4 = Brug korrekt stavning og tegnsætning
new-sentence-rule-5 = Ingen tal og specialtegn
new-sentence-rule-6 = Ingen udenlandske bogstaver
new-sentence-rule-7 = Inkluder kildehenvisning
login-instruction-multiple-sentences = <loginLink>Log ind</loginLink> eller <loginLink>tilmeld dig</loginLink> for at tilføje flere sætninger
guidelines = Retningslinjer
contact-us = Kontakt os
add-sentence-success = 1 sætning indsamlet
add-sentence-error = Fejl ved tilføjelse af sætning
required-field = Udfyld venligst dette felt.
single-sentence-submission = Indsendelse af en enkelt sætning
single-sentence = Enkelt sætning
sentence-domain-select-placeholder = Vælg op til tre domæner (valgfrit)
# Sentence Domain dropdown option
agriculture_food = Landbrug og fødevarer
# Sentence Domain dropdown option
automotive_transport = Transport og køretøjer
# Sentence Domain dropdown option
finance = Finans
# Sentence Domain dropdown option
service_retail = Service og detailhandel
# Sentence Domain dropdown option
general = Generelt
# Sentence Domain dropdown option
healthcare = Sundhed
# Sentence Domain dropdown option
history_law_government = Historie, lov og ledelse
# Sentence Domain dropdown option
media_entertainment = Medier og underholdning
# Sentence Domain dropdown option
nature_environment = Natur og miljø
# Sentence Domain dropdown option
news_current_affairs = Nyheder og aktuelt
sentence-variant-select-label = Sætningsvariant
sentence-variant-select-placeholder = Vælg en variant (valgfrit)
sentence-variant-select-multiple-variants = Generelt sprog / flere varianter

## BULK SUBMISSION

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Upload <icon></icon> sætninger i det offentlige domæne
sc-bulk-upload-instruction = Træk din fil hertil eller <uploadButton>klik for at uploade</uploadButton>
sc-bulk-upload-instruction-drop = Slip filen her for at uploade
bulk-upload-additional-information = Hvis der er yderligere oplysninger, du vil give om denne fil, så kontakt <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Prøv igen ved at trække din fil hertil
try-upload-again-md = Prøv at uploade igen
select-file = Vælg fil
select-file-mobile = Vælg fil, der skal uploades
accepted-files = Accepterede filtyper: Kun .tsv
minimum-sentences = Mindste antal sætninger i filen: 1000
maximum-file-size = Maksimal filstørrelse: 25 MB
what-needs-to-be-in-file = Hvad skal der være i min fil?
upload-progress-text = Upload i gang...
sc-bulk-submit-confirm = Jeg bekræfter, at disse sætninger er i <wikipediaLink>offentligt domæne</wikipediaLink>, og at jeg har tilladelse til at uploade dem.
bulk-upload-failed-toast = Upload mislykkedes. Prøv igen.
upload-more-btn-text = Vil du uploade flere sætninger?
file-invalid-type = Ugyldig fil
file-too-large = Filen er for stor
file-too-small = Filen er for lille
too-many-files = For mange filer

## SMALL BATCH SUBMISSION

exceeds-small-batch-limit-error = Kan ikke indsende mere end 1000 sætninger
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } af 1 sætning indsamlet
       *[other] { $uploadedSentences } af { $totalSentences } sætninger indsamlet
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } af 1 sætning indsamlet. Klik <downloadLink>her</downloadLink> for at downloade afviste sætninger.
       *[other] { $uploadedSentences } af { $totalSentences } sætninger indsamlet. Klik <downloadLink>her</downloadLink> for at downloade afviste sætninger.
    }
small-batch-sentences-rule-1 = Følg retningslinjerne fra "Hvilke sætninger kan jeg tilføje?"
small-batch-sentences-rule-2 = Tilføj en sætning pr. linje
small-batch-sentences-rule-4 = Tilføj op til 1.000 sætninger
# menu item
add-sentences = Tilføj sætninger

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Tilføj og gennemgå sætninger, Tilføj spørgsmål, Transskriber lyd
add-sentences-menu-item-tooltip = Tilføj sætninger på dit sprog
review-sentences-menu-item-tooltip = Gennemgå sætninger på dit sprog
add-questions-menu-item-tooltip = Tilføj spørgsmål på dit sprog
review-questions-menu-item-tooltip = Gennemgå spørgsmål
transcribe-audio-menu-item-tooltip = Transskriber lydoptagelser på dit sprog

## MENU ITEM ARIA LABELS

add-sentences-menu-item-aria-label = Tilføj nye sætninger, som fællesskabet kan læse
review-sentences-menu-item-aria-label = Gennemgå eksisterende sætninger indsendt af fællesskabet
add-questions-menu-item-aria-label = Indsend nye spørgsmål, som fællesskabet kan læse og svare på
review-questions-menu-item-aria-label = Gennem og stem for nye spørgsmål indsendt af fællesskabet
transcribe-audio-menu-item-aria-label = Transskriber lydoptagelser til tekst
