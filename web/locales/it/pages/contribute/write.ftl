## WRITE PAGE

write = Scrivi
write-instruction = <icon></icon> Aggiungi una frase di pubblico dominio
write-page-subtitle = Le frasi inserite verranno aggiunte a un dataset con licenza cc-0 disponibile pubblicamente.
sentence =
    .label = Frase
sentence-input-placeholder = Inserisci qui la frase di pubblico dominio
small-batch-sentence-input-placeholder = Inserisci qui le frasi di pubblico dominio
citation-input-placeholder = Specifica la fonte della frase (obbligatorio)
citation =
    .label = Citazione
sc-write-submit-confirm = Confermo che questa frase è di <wikipediaLink>pubblico dominio</wikipediaLink> e ho l’autorizzazione a caricarla.
sc-review-write-title = Quali frasi posso aggiungere?
sc-review-small-batch-title = Come aggiungere più frasi
new-sentence-rule-1 = <noCopyright>Nessuna restrizione di copyright</noCopyright> (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Meno di 15 parole
new-sentence-rule-3 = Utilizza una grammatica corretta
new-sentence-rule-4 = Utilizza ortografia e punteggiatura corrette
new-sentence-rule-5 = Niente numeri e caratteri speciali
new-sentence-rule-6 = Niente lettere straniere
new-sentence-rule-7 = Includi la citazione opportuna
new-sentence-rule-8 = Preferibilmente naturale e discorsiva (la frase dev’essere facile da leggere)
login-instruction-multiple-sentences = <loginLink>Accedi</loginLink> o <loginLink>registrati</loginLink> per aggiungere più frasi
how-to-cite = Come posso fare una citazione?
how-to-cite-explanation-bold = Cita fornendo un link o il nome completo dell’opera.
how-to-cite-explanation = Se sono parole tue, scrivi semplicemente <italicizedText>“Autocitazione”</italicizedText>. Abbiamo bisogno di sapere dove hai trovato questo contenuto in modo da poter verificare che sia di pubblico dominio e che non vi siano restrizioni di copyright. Per ulteriori informazioni sulle citazioni, consulta le nostre <guidelinesLink>Linee guida</guidelinesLink>.
guidelines = Linee guida
contact-us = Contattaci
add-sentence-success = 1 frase raccolta
add-sentence-error = Errore durante il caricamento della frase
required-field = Compilare questo campo.
single-sentence-submission = Invio di una singola frase
small-batch-sentence-submission = Invio di frasi in lotti di piccole dimensioni
bulk-sentence-submission = Invio di frasi in blocco
single-sentence = Singola frase
small-batch-sentence = Lotto di piccole dimensioni
bulk-sentence = Lotto in blocco
sentence-domain-combobox-label = Dominio della frase
sentence-domain-select-placeholder = Scegli fino a 3 domini
# Sentence Domain dropdown option
agriculture_food = Agricoltura e alimentazione
# Sentence Domain dropdown option
automotive_transport = Settore automobilistico e trasporti
# Sentence Domain dropdown option
finance = Finanza
# Sentence Domain dropdown option
service_retail = Servizi e vendita al dettaglio
# Sentence Domain dropdown option
general = Generale
# Sentence Domain dropdown option
healthcare = Sanità
# Sentence Domain dropdown option
history_law_government = Storia, diritto e governo
# Sentence Domain dropdown option
language_fundamentals = Fondamenti della lingua (ad es. cifre, lettere, valuta)
# Sentence Domain dropdown option
media_entertainment = Media e intrattenimento
# Sentence Domain dropdown option
nature_environment = Natura e ambiente
# Sentence Domain dropdown option
news_current_affairs = Notizie e attualità
# Sentence Domain dropdown option
technology_robotics = Tecnologia e robotica
sentence-variant-select-label = Variante della frase
sentence-variant-select-placeholder = Seleziona una variante (facoltativo)
sentence-variant-select-multiple-variants = Linguaggio generico / più varianti

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = <icon></icon> Carica frasi di pubblico dominio
sc-bulk-upload-instruction = Trascina il file qui o <uploadButton>fai clic per caricare</uploadButton>
sc-bulk-upload-instruction-drop = Trascina il file qui per caricarlo
bulk-upload-additional-information = Per fornire ulteriori informazioni su questo file, contattare <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Se fornire ulteriori informazioni su questo file che non sono incluse nel modello, contattare <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Riprova trascinando il file qui
try-upload-again-md = Prova a caricare di nuovo
select-file = Seleziona file
select-file-mobile = Seleziona il file da caricare
accepted-files = Tipi di file accettati: solo .tsv
minimum-sentences = Numero minimo di frasi nel file: 1000
maximum-file-size = Dimensione massima del file: 25 MB
what-needs-to-be-in-file = Che cosa deve esserci nel mio file?
what-needs-to-be-in-file-explanation = Controlla il nostro <templateFileLink>file modello</templateFileLink>. Le frasi non devono essere soggette a copyright (CC0 o un’opera originale per cui il mittente ha ricevuto adeguata autorizzazione) ed essere chiare, grammaticalmente corrette e di facile lettura. La lettura delle frasi inviate dovrebbe richiedere circa 10-15 secondi e non dovrebbero includere numeri, nomi propri e caratteri speciali.
upload-progress-text = Caricamento in corso…
sc-bulk-submit-confirm = Confermo che queste frasi sono di <wikipediaLink>pubblico dominio</wikipediaLink> e ho l’autorizzazione a caricarle.
bulk-upload-success-toast = Frasi caricate in blocco
bulk-upload-failed-toast = Caricamento non riuscito, riprova.
bulk-submission-success-header = Grazie per aver contribuito con le tue frasi.
bulk-submission-success-subheader = Stai aiutando Common Voice a raggiungere il traguardo giornaliero per le frasi.
upload-more-btn-text = Vuoi caricare più frasi?
file-invalid-type = File non valido
file-too-large = Il file è troppo grande
file-too-small = Il file è troppo piccolo
too-many-files = Troppi file

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Aggiungi più frasi di pubblico dominio
multiple-sentences-error = Non è possibile aggiungere più frasi in un singolo invio
exceeds-small-batch-limit-error = Non è possibile inviare più di 1000 frasi
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Limite di frequenza superato. Riprova tra 1 minuto
       *[other] Limite di frequenza superato. Riprova tra { $retryLimit } minuti
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Limite di frequenza superato. Riprova tra 1 secondo
       *[other] Limite di frequenza superato. Riprova tra { $retryLimit } secondi
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Hai raggiunto il limite di invii per questa pagina. Attendi 1 minuto prima di inviare un’altra frase. Grazie per la pazienza.
       *[other] Hai raggiunto il limite di invii per questa pagina. Attendi { $retryLimit } minuti prima di inviare un’altra frase. Grazie per la pazienza.
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Hai raggiunto il limite di invii per questa pagina. Attendi 1 secondo prima di inviare un’altra frase. Grazie per la pazienza.
       *[other] Hai raggiunto il limite di invii per questa pagina. Attendi { $retryLimit } secondi prima di inviare un’altra frase. Grazie per la pazienza.
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success = { $uploadedSentences } di { $totalSentences } frasi raccolte
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message = { $uploadedSentences } di { $totalSentences } frasi raccolte. Fai clic <downloadLink>qui</downloadLink> per scaricare le frasi rifiutate.
small-batch-sentences-rule-1 = Segui le linee guida della sezione “Quali frasi posso aggiungere?”
small-batch-sentences-rule-2 = Aggiungi una frase per riga
small-batch-sentences-rule-3 = Separa le frasi sulla stessa riga premendo una volta il pulsante “Invio”
small-batch-sentences-rule-4 = Aggiungi fino a 1000 frasi
small-batch-sentences-rule-5 = Tutte le frasi devono appartenere allo stesso dominio
small-batch-sentences-rule-6 = Tutte le frasi devono avere la stessa citazione
