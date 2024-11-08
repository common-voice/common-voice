## WRITE PAGE

write = Escriba
write-instruction = Engada <icon></icon> unha frase de dominio público
write-page-subtitle = As frases aportadas aquí engadiranse a un conxunto de datos con licenza cc-0 dispoñible publicamente.
sentence =
    .label = Frase
sentence-input-placeholder = Introduza aquí a súa frase de dominio público
small-batch-sentence-input-placeholder = Introduza aquí as súas frases de dominio público
citation-input-placeholder = Mencione a fonte da súa frase (obrigatorio)
citation =
    .label = Cita
sc-write-submit-confirm = Confirmo que esta frase é de <wikipediaLink>dominio público</wikipediaLink> e teño permiso para cargala.
sc-review-write-title = Que frases podo engadir?
sc-review-small-batch-title = Como engadir varias frases á vez
new-sentence-rule-1 = <noCopyright>Sen restricións de copyright</noCopyright> (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Menos de 15 palabras
new-sentence-rule-3 = Usar a gramática correcta
new-sentence-rule-4 = Usar a ortografía e a puntuación correctas
new-sentence-rule-5 = Sen números nin caracteres especiais
new-sentence-rule-6 = Sen letras estranxeiras
new-sentence-rule-7 = Incluír a cita axeitada
new-sentence-rule-8 = Idealmente natural e conversacional (debería ser fácil de ler a frase)
login-instruction-multiple-sentences = <loginLink>Iniciar sesión</loginLink> ou <loginLink>rexistrarse</loginLink> para engadir varias frases á vez
how-to-cite = Como citar?
how-to-cite-explanation-bold = Citar coa URL da ligazón ou co nome completo da obra.
how-to-cite-explanation = Se son as súas propias palabras, simplemente poña <italicizedText>«Cita propia»</italicizedText>. Necesitamos saber onde atopou este contido para poder comprobar que é de dominio público e non se aplican restricións de copyright. Para obter máis información sobre as citas, consulte a nosa <guidelinesLink>páxina de directrices</guidelinesLink>.
guidelines = Directrices
contact-us = Contacta connosco
add-sentence-success = 1 frase recollida
add-sentence-error = Produciuse un erro ao engadir a frase
required-field = Por favor, cubra este campo.
single-sentence-submission = Envío dunha única frase
small-batch-sentence-submission = Envío de frases por lotes pequenos
bulk-sentence-submission = Envío masivo de frases
single-sentence = Frase única
small-batch-sentence = Lote pequeno
bulk-sentence = Lote masivo
sentence-domain-combobox-label = Dominio ao que pertence a frase
sentence-domain-select-placeholder = Seleccione ata tres campos
# Sentence Domain dropdown option
agriculture_food = Agricultura e alimentación
# Sentence Domain dropdown option
automotive_transport = Automoción e transporte
# Sentence Domain dropdown option
finance = Finanzas
# Sentence Domain dropdown option
service_retail = Servizos e comercio
# Sentence Domain dropdown option
general = Xeral
# Sentence Domain dropdown option
healthcare = Asistencia sanitaria
# Sentence Domain dropdown option
history_law_government = Historia, dereito e goberno
# Sentence Domain dropdown option
language_fundamentals = Categorías básicas da lingua (por exemplo, díxitos, letras, diñeiro)
# Sentence Domain dropdown option
media_entertainment = Medios e entretemento
# Sentence Domain dropdown option
nature_environment = Natureza e medio ambiente
# Sentence Domain dropdown option
news_current_affairs = Noticias e actualidade
# Sentence Domain dropdown option
technology_robotics = Tecnoloxía e robótica
sentence-variant-select-label = Variedade á que pertence a frase
sentence-variant-select-placeholder = Seleccione unha variedade (opcional)
sentence-variant-select-multiple-variants = Linguaxe xeral / múltiples variedades

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Envíe <icon></icon> frases de dominio público
sc-bulk-upload-instruction = Arrastre o seu ficheiro aquí ou <uploadButton>prema para envialo</uploadButton>
sc-bulk-upload-instruction-drop = Solte o ficheiro aquí para cargalo
bulk-upload-additional-information = Se quere achegar máis información sobre este ficheiro, póñase en contacto con <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Se quere achegar información sobre este ficheiro que non está incluída no modelo, póñase en contacto con <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Inténteo de novo arrastrando o ficheiro aquí
try-upload-again-md = Intente cargar de novo
select-file = Seleccionar un ficheiro
select-file-mobile = Seleccione un ficheiro para cargar
accepted-files = Tipos de ficheiros aceptados: unicamente .tsv
minimum-sentences = Número mínimo de frases no arquivo: 1000
maximum-file-size = Tamaño máximo do ficheiro: 25 MB
what-needs-to-be-in-file = Que ten que estar no meu ficheiro?
what-needs-to-be-in-file-explanation = Comprobe o noso <templateFileLink>ficheiro modelo</templateFileLink>. As súas frases deben estar libres de dereitos de autor (CC0 ou traballo orixinal autorizado polo remitente) e deben ser claras, gramaticalmente correctas e fáciles de ler. Deberíase tardar uns 10-15 segundos en ler cada frase. Evite incluír nas frases enviadas caracteres numéricos, nomes propios e caracteres especiais.
upload-progress-text = Subida en curso...
sc-bulk-submit-confirm = Confirmo que estas frases son de <wikipediaLink>dominio público</wikipediaLink> e teño permiso para cargalas.
bulk-upload-success-toast = Cargouse o grupo de frases
bulk-upload-failed-toast = Produciuse un erro na carga. Ténteo de novo.
bulk-submission-success-header = Grazas por contribuír co seu envío masivo.
bulk-submission-success-subheader = Acaba de axudar a que Common Voice alcance os obxectivos diarios de subida de frases!
upload-more-btn-text = Desexa cargar máis frases?
file-invalid-type = O ficheiro non é válido.
file-too-large = O ficheiro é demasiado grande
file-too-small = O ficheiro é demasiado pequeno
too-many-files = Demasiados ficheiros

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = Engada <icon></icon> varias frases de dominio público
multiple-sentences-error = Non se poden engadir varias frases nun único envío
exceeds-small-batch-limit-error = Non se poden enviar máis de 1000 frases
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Superouse o límite de envíos. Tente de novo dentro dun minuto
       *[other] Superouse o límite de envíos. Tente de novo dentro de { $retryLimit } minutos
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Superouse o límite de envíos. Tente de novo dentro dun segundo
       *[other] Superouse o límite de envíos. Tente de novo dentro de { $retryLimit } segundos
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Alcanzouse o límite de envíos desta páxina. Agarde un minuto antes de enviar unha nova frase. Grazas pola paciencia!
       *[other] Alcanzouse o límite de envíos desta páxina. Agarde { $retryLimit } minutos antes de enviar unha nova frase. Grazas pola paciencia!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Alcanzouse o límite de envíos desta páxina. Agarde un segundo antes de enviar unha nova frase. Grazas pola paciencia!
       *[other] Alcanzouse o límite de envíos desta páxina. Agarde { $retryLimit } segundos antes de enviar unha nova frase. Grazas pola paciencia!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] Cargouse { $uploadedSentences } frase
       *[other] Cargáronse { $uploadedSentences } frases de { $totalSentences }
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] Cargouse { $uploadedSentences } frase. Prema <downloadLink>aquí</downloadLink> para descargar as frases rexeitadas.
       *[other] Cargáronse { $uploadedSentences } frases de { $totalSentences }. Prema <downloadLink>aquí</downloadLink> para descargar as frases rexeitadas.
    }
small-batch-sentences-rule-1 = Siga as directrices de "Que frases podo engadir?"
small-batch-sentences-rule-2 = Engada unha frase por liña
small-batch-sentences-rule-3 = Separe as frases en liñas premendo unha vez a tecla Intro ou Retorno
small-batch-sentences-rule-4 = Engada ata 1.000 frases
small-batch-sentences-rule-5 = Todas as frases deben pertencer ao mesmo dominio
small-batch-sentences-rule-6 = Todas as frases deben ter a mesma cita
