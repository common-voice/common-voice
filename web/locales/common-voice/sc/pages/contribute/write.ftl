## WRITE PAGE

write = Iscrie
write-instruction = Agiunghe <icon></icon> una fràsia de domìniu pùblicu
write-page-subtitle = Is fràsias frunidas inoghe ant a èssere agiuntas a unu pachete de datos a disponimentu in manera pùblica cun lissèntzia cc-0.
sentence =
    .label = Fràsia
sentence-input-placeholder = Inserta·nche inoghe sa fràsia de domìniu pùblicu
small-batch-sentence-input-placeholder = Inserta·nche inoghe fràsias in domìniu pùblicu
citation-input-placeholder = Fruni unu riferimentu pro s’orìgine de sa fràsia tua (obligatòriu)
citation =
    .label = Tzitatzione
sc-write-submit-confirm = Cunfirmo chi custa fràsia est in <wikipediaLink>domìniu pùblicu</wikipediaLink> e chi tèngio permissu pro dda carrigare.
sc-review-write-title = Cale fràsias potzo agiùnghere?
sc-review-small-batch-title = Comente si podent agiùnghere prus fràsias
new-sentence-rule-1 = <noCopyright>Chena deretos de autore</noCopyright> (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Prus pagu de 15 faeddos
new-sentence-rule-3 = Sa grammàtica est curreta
new-sentence-rule-4 = S'ortografia e sa puntegiadura sunt curretas
new-sentence-rule-5 = Chena nùmeros nen caràteres ispetziales
new-sentence-rule-6 = Chena lìteras istràngias
new-sentence-rule-7 = Cun sa tzitatzione oportuna
new-sentence-rule-8 = Sa fràsia diat dèpere èssere naturale e discursiva (fàtzile de lèghere)
login-instruction-multiple-sentences = <loginLink>Identìfica·ti</loginLink> o <loginLink>registra·ti</loginLink> pro agiùnghere prus fràsias
how-to-cite = Comente potzo fàghere una tzitatzione?
how-to-cite-explanation-bold = Tzita frunende unu ligòngiu o su nòmine cumpletu de s'òpera.
guidelines = Ghias
contact-us = Cuntata·nos
add-sentence-success = 1 fràsia regorta
add-sentence-error = Faddina in s'agiunta de sa fràsia
required-field = Cumpila custu campu.
single-sentence-submission = Imbiu de una fràsia isceti
single-sentence = Fràsia ùnica
sentence-domain-combobox-label = Domìniu de sa fràsia
sentence-domain-select-placeholder = Sèbera finas a tres domìnios (optzionale)
# Sentence Domain dropdown option
general = Generale
# Sentence Domain dropdown option
healthcare = Salude
# Sentence Domain dropdown option
history_law_government = Istòria, deretu e guvernu
sentence-variant-select-label = Variedade de sa fràsia
sentence-variant-select-placeholder = Sèbera una variedade (optzionale)

## BULK SUBMISSION

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Càrriga <icon></icon> fràsias de domìniu pùblicu
try-upload-again = Torra·nche a proare trisinende s’archìviu inoghe
try-upload-again-md = Torra a proare sa càrriga
select-file = Seletziona un’archìviu
select-file-mobile = Seletziona s’archìviu de carrigare
accepted-files = Tipos de archìvios atzetados: isceti .tsv
minimum-sentences = Mìnimu de fràsias de s’archìviu: 1000
maximum-file-size = Mannària màssima de s’archìviu: 25 MB
what-needs-to-be-in-file = Ite nche depet èssere, in s’archìviu?
upload-progress-text = Càrriga in cursu...
sc-bulk-submit-confirm = Cunfirmo chi custas fràsias sunt in <wikipediaLink>domìniu pùblicu</wikipediaLink> e chi tèngio permissu pro ddas carrigare.
bulk-upload-failed-toast = Càrriga faddida. Torra·nche a proare.
upload-more-btn-text = Boles carrigare àteras fràsias?
file-invalid-type = Archìviu non vàlidu
file-too-large = S’archìviu est tropu mannu
file-too-small = S’archìviu est tropu piticu
too-many-files = Tropu archìvios

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Agiunghe prus fràsias de domìniu pùblicu
multiple-sentences-error = Non podes agiùnghere prus fràsias pro un’ùnicu imbiu
exceeds-small-batch-limit-error = Impossìbile imbiare prus de 1000 fràsias
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Lìmite de frecuèntzia barigadu. Torra·nche a proare de immoe a unu minutu
       *[other] Lìmite de frecuèntzia barigadu. Torra·nche a proare de immoe a { $retryLimit } minutos
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Lìmite de frecuèntzia barigadu. Torra·nche a proare de immoe a unu segundu
       *[other] Lìmite de frecuèntzia barigadu. Torra·nche a proare de immoe a { $retryLimit } segundos
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] As barigadu su lìmite de imbios pro custa pàgina. Abeta unu minutu in antis de imbiare un’àtera fràsia. Gràtzias de sa passèntzia tua!
       *[other] As barigadu su lìmite de imbios pro custa pàgina. Abeta { $retryLimit } minutos in antis de imbiare un’àtera fràsia. Gràtzias de sa passèntzia tua!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] As barigadu su lìmite de imbios pro custa pàgina. Abeta unu segundu in antis de imbiare un’àtera fràsia. Gràtzias de sa passèntzia tua!
       *[other] As barigadu su lìmite de imbios pro custa pàgina. Abeta { $retryLimit } minutos in antis de imbiare un’àtera fràsia. Gràtzias de sa passèntzia tua!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] Fràsias regortas: { $uploadedSentences } de 1
       *[other] Fràsias regortas: { $uploadedSentences } de { $totalSentences }
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] Fràsias carrigadas: 1 de { $uploadedSentences }. Incarca <downloadLink>inoghe</downloadLink> pro iscarrigare is fràsias refudadas.
       *[other] Fràsias carrigadas: { $uploadedSentences } de { $totalSentences }. Incarca <downloadLink>inoghe</downloadLink> pro iscarrigare is fràsias refudadas.
    }
small-batch-sentences-rule-1 = Sighi is lìnias ghias dae “Cale fràsias potzo agiùnghere?”
small-batch-sentences-rule-2 = Agiunghe una fràsia pro lìnia
small-batch-sentences-rule-4 = Agiunghe fintzas a 1000 fràsias
small-batch-sentences-rule-5 = Totu is fràsias depent apartènnere a su pròpiu domìniu
small-batch-sentences-rule-6 = Totu is fràsias depent tènnere sa pròpiu tzitatzione
# menu item
add-sentences = Agiunghe fràsias

## MENU ITEM TOOLTIPS

write-contribute-menu-tooltip = Agiunghe e revisiona fràsias, agiunghe preguntas, trascritzione de àudio
add-sentences-menu-item-tooltip = Agiunghe fràsias in sa limba tua
review-sentences-menu-item-tooltip = Revisiona fràsias in sa limba tua
add-questions-menu-item-tooltip = Agiunghe preguntas in sa limba tua
transcribe-audio-menu-item-tooltip = Trascrie registratziones de àudio in sa limba tua

## MENU ITEM ARIA LABELS

write-contribute-menu-aria-label = Menù de optziones de iscritura
add-sentences-menu-item-aria-label = Agiunghe fràsias noas pro chi las lègiat sa comunidade
review-sentences-menu-item-aria-label = Revisiona fràsias giai sarvadas imbiadas dae sa comunidade
add-questions-menu-item-aria-label = Imbia preguntas noas pro permìtere a sa comunidade de ddas lèghere e rispòndere
transcribe-audio-menu-item-aria-label = Trascrie registratziones de àudio a formatu de testu
