## WRITE PAGE

write = Escriu
write-instruction = <icon></icon> Afegiu una frase de domini públic
write-page-subtitle = Les frases aportades aquí s'afegiran a un conjunt de dades disponible públicament amb llicència cc-0.
sentence =
    .label = Frase
sentence-input-placeholder = Escriviu aquí la vostra frase de domini públic
small-batch-sentence-input-placeholder = Escriviu aquí les vostres frases de domini públic
citation-input-placeholder = Indiqueu la font de la vostra frase (obligatori)
citation =
    .label = Citació
sc-write-submit-confirm = Confirmo que aquesta frase és de <wikipediaLink>domini públic</wikipediaLink> i tinc permís per a pujar-la.
sc-review-write-title = Quines frases puc afegir-hi?
sc-review-small-batch-title = Com afegir diverses frases
new-sentence-rule-1 = <noCopyright>Sense drets d'autor</noCopyright> (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Menys de 15 paraules
new-sentence-rule-3 = La gramàtica és correcta
new-sentence-rule-4 = L'ortografia i la puntuació són correctes
new-sentence-rule-5 = Sense xifres ni caràcters especials
new-sentence-rule-6 = Sense lletres estrangeres
new-sentence-rule-7 = Amb la citació corresponent
new-sentence-rule-8 = Idealment, natural i conversacional (la frase ha de ser fàcil de llegir)
login-instruction-multiple-sentences = <loginLink>Inicieu la sessió</loginLink> o <loginLink>registreu-vos</loginLink> per afegir diverses frases
how-to-cite = Com cal citar?
how-to-cite-explanation-bold = Citeu amb un enllaç URL o el nom complet de l'obra.
how-to-cite-explanation = Si són paraules vostres, només cal que hi indiqueu <italicizedText>«Autocitació»</italicizedText>. Hem de saber on heu trobat aquest contingut perquè puguem comprovar que és de domini públic i que no s'apliquen restriccions de drets d'autor. Per a obtenir més informació sobre la citació, consulteu la <guidelinesLink>Pàgina de Directrius</guidelinesLink>.
guidelines = Directrius
contact-us = Contacteu-nos
add-sentence-success = 1 frase recollida
add-sentence-error = S'ha produït un error en afegir la frase
required-field = Empleneu aquest camp.
single-sentence-submission = Enviament d'una única frase
small-batch-sentence-submission = Enviament d'un conjunt petit de frases
bulk-sentence-submission = Enviament massiu de frases
single-sentence = Frase única
small-batch-sentence = Conjunt petit
bulk-sentence = Conjunt massiu
sentence-domain-combobox-label = Domini de les frases
sentence-domain-select-placeholder = Seleccioneu fins a tres dominis (opcional)
# Sentence Domain dropdown option
agriculture_food = Agricultura i alimentació
# Sentence Domain dropdown option
automotive_transport = Transport i automoció
# Sentence Domain dropdown option
finance = Finances
# Sentence Domain dropdown option
service_retail = Serveis i venda al detall
# Sentence Domain dropdown option
general = General
# Sentence Domain dropdown option
healthcare = Atenció sanitària
# Sentence Domain dropdown option
history_law_government = Història, dret i govern
# Sentence Domain dropdown option
language_fundamentals = Fonaments de la llengua (p. ex., dígits, lletres i diners)
# Sentence Domain dropdown option
media_entertainment = Mitjans de comunicació i entreteniment
# Sentence Domain dropdown option
nature_environment = Natura i medi ambient
# Sentence Domain dropdown option
news_current_affairs = Notícies i actualitat
# Sentence Domain dropdown option
technology_robotics = Tecnologia i robòtica
sentence-variant-select-label = Variant de la frase
sentence-variant-select-placeholder = Trieu una variant (opcional)
sentence-variant-select-multiple-variants = Llenguatge general / diverses variants

## BULK SUBMISSION

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Pugeu <icon></icon> frases de domini públic
sc-bulk-upload-instruction = Arrossegueu el fitxer aquí o <uploadButton>feu clic per a pujar-lo</uploadButton>
sc-bulk-upload-instruction-drop = Deixeu anar el fitxer aquí per a pujar-lo
bulk-upload-additional-information = Si hi ha informació addicional que voleu proporcionar sobre aquest fitxer, poseu-vos en contacte amb <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Si hi ha informació addicional que voleu proporcionar sobre aquest fitxer que no s'inclou en la plantilla, poseu-vos en contacte amb <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Torneu-ho a provar arrossegant el fitxer aquí
try-upload-again-md = Proveu de pujar-lo de nou
select-file = Seleccioneu el fitxer
select-file-mobile = Seleccioneu el fitxer que es pujarà
accepted-files = Tipus de fitxers acceptats: només .tsv
minimum-sentences = Mínim de frases del fitxer: 1000
maximum-file-size = Mida màxima del fitxer: 25 MB
what-needs-to-be-in-file = Què hi ha d'haver en el fitxer?
what-needs-to-be-in-file-explanation = Comproveu el nostre <templateFileLink>fitxer de plantilla</templateFileLink>. Les vostres frases han de ser lliures de drets d'autor (CC0 o treball original autoritzat pel remitent) i ser clares, gramaticalment correctes i fàcils de llegir. Les frases enviades haurien de trigar uns 10-15 segons a llegir-se i s'han d'evitar incloure xifres, noms propis i caràcters especials.
upload-progress-text = Pujada en curs...
sc-bulk-submit-confirm = Confirmo que aquestes frases són de <wikipediaLink>domini públic</wikipediaLink> i tinc permís per pujar-les.
bulk-upload-success-toast = S'han pujat les frases massives
bulk-upload-failed-toast = S'ha produït un error en la pujada; torneu-ho a provar.
bulk-submission-success-header = Gràcies per contribuir amb l'enviament massiu de frases!
bulk-submission-success-subheader = Esteu ajudant a Common Voice a assolir els nostres objectius diaris de frases!
upload-more-btn-text = Voleu pujar més frases?
file-invalid-type = El fitxer no és vàlid
file-too-large = El fitxer és massa gran
file-too-small = El fitxer és massa petit
too-many-files = Hi ha massa fitxers

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Afegiu diverses frases de domini públic
multiple-sentences-error = No podeu afegir diverses frases en enviaments de frase única
exceeds-small-batch-limit-error = No es poden enviar més de 1000 frases
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] S'ha superat el límit. Torneu-ho a provar d'aquí a 1 minut
       *[other] S'ha superat el límit. Torneu-ho a provar d'aquí a { $retryLimit } minuts
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] S'ha superat el límit. Torneu-ho a provar d'aquí a 1 segon
       *[other] S'ha superat el límit. Torneu-ho a provar d'aquí a { $retryLimit } segons
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Heu assolit el límit d'enviaments per aquesta pàgina. Espereu 1 minut abans d'enviar una altra frase. Gràcies per la vostra paciència!
       *[other] Heu assolit el límit d'enviaments per aquesta pàgina. Espereu { $retryLimit } minuts abans d'enviar una altra frase. Gràcies per la vostra paciència!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Heu assolit el límit d'enviaments per aquesta pàgina. Espereu 1 segon abans d'enviar una altra frase. Gràcies per la vostra paciència!
       *[other] Heu assolit el límit d'enviaments per aquesta pàgina. Espereu { $retryLimit } segons abans d'enviar una altra frase. Gràcies per la vostra paciència!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] S'ha recollit { $uploadedSentences } d'1 frase
       *[other] S'han recollit { $uploadedSentences } de { $totalSentences } frases
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] S'ha recollit { $uploadedSentences } d'1 frase. Feu clic <downloadLink>aquí</downloadLink> per baixar les frases rebutjades.
       *[other] S'han recollit { $uploadedSentences } de { $totalSentences } frases.  Feu clic <downloadLink>aquí</downloadLink> per baixar les frases rebutjades.
    }
small-batch-sentences-rule-1 = Seguiu les directrius de «Quines frases puc afegir-hi?»
small-batch-sentences-rule-2 = Afegiu una frase per línia
small-batch-sentences-rule-3 = Separeu les frases en una línia prement «Intro» o «Retorn» una vegada
small-batch-sentences-rule-4 = Afegiu fins a 1.000 frases
small-batch-sentences-rule-5 = Totes les frases han de tenir el mateix domini
small-batch-sentences-rule-6 = Totes les frases han de tenir la mateixa citació
# menu item
add-sentences = Afegeix frases

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Afegiu i reviseu frases, afegiu preguntes, transcriviu àudio
add-sentences-menu-item-tooltip = Afegiu frases en la vostra llengua
review-sentences-menu-item-tooltip = Reviseu frases en la vostra llengua
add-questions-menu-item-tooltip = Afegiu preguntes en la vostra llengua
review-questions-menu-item-tooltip = Revisa les preguntes
transcribe-audio-menu-item-tooltip = Transcriviu enregistraments d'àudio en la vostra llengua

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = Menú d'opcions d'Escriu
add-sentences-menu-item-aria-label = Afegiu frases noves perquè la comunitat les llegeixi
review-sentences-menu-item-aria-label = Reviseu frases existents enviades per la comunitat
add-questions-menu-item-aria-label = Envieu preguntes noves perquè la comunitat les llegeixi i respongui
review-questions-menu-item-aria-label = Reviseu i voteu les noves preguntes enviades per la comunitat
transcribe-audio-menu-item-aria-label = Transcriviu enregistraments d'àudio a text
