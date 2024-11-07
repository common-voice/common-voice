## WRITE PAGE

write = Skriv
write-instruction = Lägg till <icon></icon> en mening som är allmän egendom
write-page-subtitle = Meningar som bidrags här kommer att läggas till i en allmänt tillgänglig cc-0-licensierad datamängd.
sentence =
    .label = Mening
sentence-input-placeholder = Ange din mening som är allmän egendom här
small-batch-sentence-input-placeholder = Ange din mening som är allmän egendom här
citation-input-placeholder = Hänvisa till källan till din mening (krävs)
citation =
    .label = Källhänvisning
sc-write-submit-confirm = Jag bekräftar att den här meningen är <wikipediaLink>allmän egendom</wikipediaLink> och jag har tillstånd att ladda upp den.
sc-review-write-title = Vilka meningar kan jag lägga till?
sc-review-small-batch-title = Hur man lägger till flera meningar
new-sentence-rule-1 = <noCopyright>Inga upphovsrättsbegränsningar</noCopyright> (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Färre än 15 ord per mening
new-sentence-rule-3 = Använd korrekt grammatik
new-sentence-rule-4 = Använd korrekt stavning och skiljetecken
new-sentence-rule-5 = Inga siffror och specialtecken
new-sentence-rule-6 = Inga utländska bokstäver
new-sentence-rule-7 = Inkludera lämpligt citat
new-sentence-rule-8 = Helst naturligt och konversationsrikt (det ska vara lätt att läsa meningen)
login-instruction-multiple-sentences = <loginLink>Logga in</loginLink> eller <loginLink>registrera dig</loginLink> för att lägga till flera meningar
how-to-cite = Hur citerar jag?
how-to-cite-explanation-bold = Citera med en URL-länk eller verkets fullständiga namn.
how-to-cite-explanation = Om det är dina egna ord, säg bara <italicizedText>"Självcitering"</italicizedText>. Vi behöver veta var du hittade detta innehåll så att vi kan kontrollera att det är allmän egendom och inga upphovsrättsliga begränsningar gäller. För mer information om citering, se vår <guidelinesLink>sida med riktlinjer</guidelinesLink>.
guidelines = Riktlinjer
contact-us = Kontakta oss
add-sentence-success = 1 mening insamlad
add-sentence-error = Det gick inte att lägga till mening
required-field = Var vänlig fyll i det här fältet.
single-sentence-submission = Inlämning av en enda mening
small-batch-sentence-submission = Inlämning av meningar i liten mängd
bulk-sentence-submission = Inlämning av flera meningar
single-sentence = Enstaka mening
small-batch-sentence = Liten mängd
bulk-sentence = Stor mängd
sentence-domain-combobox-label = Meningsdomän
sentence-domain-select-placeholder = Välj upp till tre domäner
# Sentence Domain dropdown option
agriculture_food = Jordbruk och livsmedel
# Sentence Domain dropdown option
automotive_transport = Fordon och transporter
# Sentence Domain dropdown option
finance = Finans
# Sentence Domain dropdown option
service_retail = Mat, service och detaljhandel
# Sentence Domain dropdown option
general = Allmänt
# Sentence Domain dropdown option
healthcare = Sjukvård
# Sentence Domain dropdown option
history_law_government = Historia, juridik och regering
# Sentence Domain dropdown option
language_fundamentals = Grundläggande språk (t.ex. siffror, bokstäver, pengar)
# Sentence Domain dropdown option
media_entertainment = Media och underhållning
# Sentence Domain dropdown option
nature_environment = Natur och miljö
# Sentence Domain dropdown option
news_current_affairs = Nyheter och aktuella frågor
# Sentence Domain dropdown option
technology_robotics = Teknik och robotik
sentence-variant-select-label = Meningsvariant
sentence-variant-select-placeholder = Välj en variant (valfritt)
sentence-variant-select-multiple-variants = Allmänt språk / flera varianter

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Ladda upp <icon></icon> meningar som är allmän egendom
sc-bulk-upload-instruction = Dra din fil hit eller <uploadButton>klicka för att ladda upp</uploadButton>
sc-bulk-upload-instruction-drop = Släpp filen här för att ladda upp
bulk-upload-additional-information = Om det finns ytterligare information som du vill ge om den här filen, vänligen kontakta <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Om det är ytterligare information som du vill ge om denna fil som inte ingår i mallen, vänligen kontakta <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Försök igen genom att dra filen hit
try-upload-again-md = Försök att ladda upp igen
select-file = Välj fil
select-file-mobile = Välj fil att ladda upp
accepted-files = Godkända filtyper: endast .tsv
minimum-sentences = Minsta antal meningar i filen: 1000
maximum-file-size = Maximal filstorlek: 25 MB
what-needs-to-be-in-file = Vad måste finnas i min fil?
what-needs-to-be-in-file-explanation = Kontrollera vår <templateFileLink>mallfil</templateFileLink>. Dina meningar bör vara upphovsrättsfria (CC0 eller tillåtet originalverk av insändaren) och vara tydliga, grammatiskt korrekta och lätta att läsa. Inskickade meningar bör ta ungefär 10-15 sekunder att läsa och bör undvika att inkludera siffror, egennamn och specialtecken.
upload-progress-text = Uppladdning pågår...
sc-bulk-submit-confirm = Jag bekräftar att dessa meningar är <wikipediaLink>allmän egendom</wikipediaLink> och jag har tillåtelse att ladda upp dem.
bulk-upload-success-toast = Flera meningar uppladdade
bulk-upload-failed-toast = Uppladdningen misslyckades, försök igen.
bulk-submission-success-header = Tack för att du bidrar med din massinlämning!
bulk-submission-success-subheader = Du hjälper Common Voice att nå våra dagliga meningsmål!
upload-more-btn-text = Ladda upp fler meningar?
file-invalid-type = Felaktig fil
file-too-large = Filen är för stor
file-too-small = Filen är för liten
too-many-files = För många filer

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Lägg till flera meningar som är allmän egendom
multiple-sentences-error = Du kan inte lägga till flera meningar för en enda inlämning
exceeds-small-batch-limit-error = Kan inte skicka in fler än 1000 meningar
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Gränsen överskriden. Försök igen om 1 minut
       *[other] Gränsen överskriden. Försök igen om { $retryLimit } minuter
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Gränsen överskriden. Försök igen om 1 sekund
       *[other] Gränsen överskriden. Försök igen om { $retryLimit } sekunder
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Du har nått gränsen för bidrag för den här sidan. Vänta i 1 minut innan du skickar in en ny mening. Tack för ditt tålamod!
       *[other] Du har nått gränsen för bidrag för den här sidan. Vänta i { $retryLimit } minuter innan du skickar in en ny mening. Tack för ditt tålamod!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Du har nått gränsen för bidrag för den här sidan. Vänta i 1 sekund innan du skickar in en annan mening. Tack för ditt tålamod!
       *[other] Du har nått gränsen för bidrag för den här sidan. Vänta i { $retryLimit } sekunder innan du skickar in en annan mening. Tack för ditt tålamod!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } av 1 mening insamlad
       *[other] { $uploadedSentences } av { $totalSentences } meningar insamlade
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } av 1 mening insamlad. Klicka <downloadLink>här</downloadLink> för att ladda ner avvisade meningar.
       *[other] { $uploadedSentences } av { $totalSentences } meningar insamlade. Klicka <downloadLink>här</downloadLink> för att ladda ner avvisade meningar.
    }
small-batch-sentences-rule-1 = Följ riktlinjerna från "Vilka meningar kan jag lägga till?"
small-batch-sentences-rule-2 = Lägg till en mening per rad
small-batch-sentences-rule-3 = Separera meningar på en rad genom att trycka på "Enter" eller "Retur" en gång
small-batch-sentences-rule-4 = Lägg till upp till 1 000 meningar
small-batch-sentences-rule-5 = Alla meningar måste ha samma domän
small-batch-sentences-rule-6 = Alla meningar måste ha samma källa
