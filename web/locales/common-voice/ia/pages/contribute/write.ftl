## WRITE PAGE

write = Scriber
write-instruction = Adde <icon></icon> un phrase de dominio public
write-page-subtitle = Le phrases fornite ci sera addite a un insimul de datos publicamente disponibile con licentia cc-0.
sentence =
    .label = Phrase
sentence-input-placeholder = Insere ci tu phrase de dominio public
small-batch-sentence-input-placeholder = Insere ci tu phrases de dominio public
citation-input-placeholder = Refere le fonte de tu phrase (obligatori)
citation =
    .label = Citation
sc-write-submit-confirm = Io confirma que iste phrases es del <wikipediaLink>dominio public</wikipediaLink> e que io ha le permission de cargar los.
sc-review-write-title = Qual phrases pote io adder?
sc-review-small-batch-title = Como adder plure phrases
new-sentence-rule-1 = <noCopyright>Nulle</noCopyright> limitationes de derectos de autor (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Minus que 15 parolas
new-sentence-rule-3 = Usar grammatica correcte
new-sentence-rule-4 = Usar orthographia e punctuation correcte
new-sentence-rule-5 = Nulle numeros e characteres special
new-sentence-rule-6 = Nulle litteras estranier
new-sentence-rule-7 = Includer citation appropriate
new-sentence-rule-8 = Idealmente natural e conversational (le phrase debe esser facile a leger)
login-instruction-multiple-sentences = <loginLink>Accede</loginLink> o <loginLink>inscribe te</loginLink> pro adder plure phrases
how-to-cite = Como pote io citar
how-to-cite-explanation-bold = Citar con un ligamine URL o le nomine complete del labor.
how-to-cite-explanation = Si il es tu proprie parolas, justo dice <italicizedText>“Citation proprie”</italicizedText>. Nos besonia de saper ubi tu trovava iste contento, assi que nos pote verificar que illo es de dominio public e nulle limitationes de derectos de autor se applica. Pro altere informationes re le citation vider nostre <guidelinesLink>Pagina de lineas guida</guidelinesLink>.
guidelines = Lineas guida
contact-us = Contactar nos
add-sentence-success = 1 phrase colligite
add-sentence-error = Error dum le phrase era addite
required-field = Per favor compila iste campo.
single-sentence-submission = Invio de phrases singule
small-batch-sentence-submission = Invio de phrases per micre lotes
bulk-sentence-submission = Invio de gruppo de phrases
single-sentence = Phrase singule
small-batch-sentence = Micre lotes
bulk-sentence = Lotes massive
sentence-domain-combobox-label = Dominio del phrase
sentence-domain-select-placeholder = Selige usque tres dominios
# Sentence Domain dropdown option
agriculture_food = Agricultura e alimentos
# Sentence Domain dropdown option
automotive_transport = Autos e transportos
# Sentence Domain dropdown option
finance = Financia
# Sentence Domain dropdown option
service_retail = Servicios e vendita al detalio
# Sentence Domain dropdown option
general = General
# Sentence Domain dropdown option
healthcare = Cura del sanitate
# Sentence Domain dropdown option
history_law_government = Historia, Lege e Governamento
# Sentence Domain dropdown option
language_fundamentals = Fundamentos de lingua (p. ex. Digitos, Litteras, Moneta)
# Sentence Domain dropdown option
media_entertainment = Medios e intertenimento
# Sentence Domain dropdown option
nature_environment = Natura e ambiente
# Sentence Domain dropdown option
news_current_affairs = Novas e Affaires Currente
# Sentence Domain dropdown option
technology_robotics = Technologia e Robotica
sentence-variant-select-label = Variante del phrase
sentence-variant-select-placeholder = Elige un variante (optional)
sentence-variant-select-multiple-variants = Lingua general / plure variantes

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Inviar <icon></icon> phrases de dominio public
sc-bulk-upload-instruction = Trahe e depone tu file hic o <uploadButton>clicca pro cargar</uploadButton>
sc-bulk-upload-instruction-drop = Depone ci tu file pro cargar lo
bulk-upload-additional-information = Si il ha altere informationes que tu vole fornir re iste file, contacta <emailFragment></emailFragment>
template-file-additional-information = Si il ha altere informationes que tu vole fornir re iste file non includite in le formulario, contacta <emailFragment></emailFragment>
try-upload-again = Tenta ancora per traher ci tu file
try-upload-again-md = Retenta cargar
select-file = Eliger file
select-file-mobile = Selige le file a cargar
accepted-files = Typos de file acceptate: .tsv solo
minimum-sentences = Minime phrases in file: 1000
maximum-file-size = Maxime dimension del file: 25 MB
what-needs-to-be-in-file = Que debe esser mi file?
what-needs-to-be-in-file-explanation = Tu phrases debe esser libere de derectos de autor (CC0 o labor original autorisate per le mittente) e esser clar, grammaticalmente correcte e facile a leger. Le phrases debe prender grosso modo 10-15 secundas a leger e debe evitar de includer numeros, nomines proprie e characteres special.
upload-progress-text = Cargamento in curso...
sc-bulk-submit-confirm = Io confirma que iste phrases es del <wikipediaLink>dominio public</wikipediaLink> e que io ha le permission de cargar los.
bulk-upload-success-toast = Gruppo de phrases cargate
bulk-upload-failed-toast = Cargamento fallite, retenta.
bulk-submission-success-header = Gratias pro contribuer con tu invio de gruppo!!
bulk-submission-success-subheader = Tu adjuta Common Voice attinger nostre propositos de phrases quotidian!
upload-more-btn-text = Cargar altere phrases?
file-invalid-type = File non valide
file-too-large = File troppo grande
file-too-small = File troppo micre
too-many-files = Troppo de files

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Adder plure phrases de dominio public
multiple-sentences-error = Tu non pote adder plure phrases pro un sol invio
exceeds-small-batch-limit-error = Impossibile inviar plus que 1000 phrases
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Limite de frequentia superate. Retenta post 1 minuta
       *[other] Limite de frequentia superate. Retenta post  { $retryLimit } minutas
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Limite de frequentia superate. Retenta post 1 secunda
       *[other] Limite de frequentia superate. Retenta post { $retryLimit } secundas
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Tu ha attingite le limite de invio pro iste pagina. Attende 1 minuta ante inviar un altere phrase. Gratias pro tu  patientia!
       *[other] Tu ha attingite le limite de invio pro iste pagina. Attende { $retryLimit } minutas ante inviar un altere phrase. Gratias pro tu  patientia!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Tu ha attingite le limite de invio pro iste pagina. Attende 1 secunda ante inviar un altere phrase. Gratias pro tu patientia!
       *[other] Tu ha attingite le limite de invio pro iste pagina. Attende { $retryLimit } secundas ante inviar un altere phrase. Gratias pro tu patientia!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } de 1 phrase colligite
       *[other] { $uploadedSentences } de { $totalSentences } phrases colligite
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } de 1 phrase colligite. Clicca <downloadLink>ci</downloadLink> pro discargar le phrases rejectate.
       *[other] { $uploadedSentences } de { $totalSentences } phrases colligite. Clicca <downloadLink>ci</downloadLink> pro discargar le phrases rejectate.
    }
small-batch-sentences-rule-1 = Sequer le directivas de “Que phrases pote io adder?”
small-batch-sentences-rule-2 = Adde un sol phrase per linea
small-batch-sentences-rule-3 = Separa le phrases in un sol linea pulsante “Inviar” o “Retornar” un vice
small-batch-sentences-rule-4 = Adde usque 1000 phrases
small-batch-sentences-rule-5 = Tote le phrases debe haber le mesme dominio
small-batch-sentences-rule-6 = Tote le phrases debe haber le mesme citation
# menu item
add-sentences = Adder phrases

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Adder e Revider phrases, Adder questiones, Transcriber audio
add-sentences-menu-item-tooltip = Adder phrases in tu lingua
review-sentences-menu-item-tooltip = Revider phrases in tu lingua
add-questions-menu-item-tooltip = Adder questiones in tu lingua
transcribe-audio-menu-item-tooltip = Transcriber registrationes audio in tu lingua

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = Menu del optiones de scriptura
add-sentences-menu-item-aria-label = Adder nove phrases a leger pro le communitate
review-sentences-menu-item-aria-label = Revider phrases existente inviate per le communitate
add-questions-menu-item-aria-label = Inviar al communitate nove questiones a leger e responder
transcribe-audio-menu-item-aria-label = Transcriber registrationes audio in texto
