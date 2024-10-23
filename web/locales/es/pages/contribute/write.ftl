## WRITE PAGE

write = Escribir
write-instruction = Agregue <icon></icon> una oración de dominio público
write-page-subtitle = Las oraciones aportadas aquí se agregarán a un conjunto de datos con licencia cc-0 disponible públicamente.
sentence =
    .label = Oración
sentence-input-placeholder = Introduce aquí tu oración de dominio público
small-batch-sentence-input-placeholder = Introduce aquí tus oraciones de dominio público
citation-input-placeholder = Añadir la fuente de la oración (obligatorio)
citation =
    .label = Citación
sc-write-submit-confirm = Confirmo que esta oración es <wikipediaLink>dominio público</wikipediaLink> y tengo permiso para subirla.
sc-review-write-title = ¿Qué frases puedo añadir?
sc-review-small-batch-title = ¿Cómo agregar varias oraciones?
new-sentence-rule-1 = <noCopyright>Sin restricciones de derechos de autor</noCopyright> (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Menos de 15 palabras por oración.
new-sentence-rule-3 = Usa la gramática correcta
new-sentence-rule-4 = Utilice ortografía y puntuación correctas.
new-sentence-rule-5 = Sin números ni caracteres especiales
new-sentence-rule-6 = Sin letras extranjeras
new-sentence-rule-7 = Incluir cita apropiada
new-sentence-rule-8 = Idealmente natural y conversacional (debe ser fácil leer la oración)
login-instruction-multiple-sentences = <loginLink>Iniciar sesión</loginLink> o <loginLink>Registrarse</loginLink> para agregar varias oraciones
how-to-cite = ¿Cómo cito?
how-to-cite-explanation-bold = Cita con un enlace URL o el nombre completo de la obra.
how-to-cite-explanation = Si son tus propias palabras, simplemente di <italicizedText>“Autocita”</italicizedText>. Necesitamos saber dónde encontró este contenido para poder comprobar que es de dominio público y que no se aplican restricciones de derechos de autor. Para obtener más información sobre las citas, consulte nuestra <guidelinesLink>página de pautas</guidelinesLink>.
guidelines = Pautas
contact-us = Contacta con nosotros
add-sentence-success = 1 frase recogida
add-sentence-error = Error al agregar la oración
required-field = Por favor rellene este campo.
single-sentence-submission = Envío de una sola frase
small-batch-sentence-submission = Envío de oraciones en conjuntos pequeños
bulk-sentence-submission = Envío de oraciones masivas
single-sentence = Oración única
small-batch-sentence = Conjunto pequeño
bulk-sentence = Conjunto grande
sentence-domain-combobox-label = Dominio de la oración
sentence-domain-select-placeholder = Seleccione hasta tres dominios (opcional)
# Sentence Domain dropdown option
agriculture_food = Agricultura y alimentación
# Sentence Domain dropdown option
automotive_transport = Automotriz y transporte
# Sentence Domain dropdown option
finance = Finanzas
# Sentence Domain dropdown option
service_retail = Servicios y venta minorista
# Sentence Domain dropdown option
general = General
# Sentence Domain dropdown option
healthcare = Salud
# Sentence Domain dropdown option
history_law_government = Historia, Derecho y Gobierno
# Sentence Domain dropdown option
language_fundamentals = Fundamentos del lenguaje (p.ej. cifras, letras, dinero)
# Sentence Domain dropdown option
media_entertainment = Medios y entretenimiento
# Sentence Domain dropdown option
nature_environment = La naturaleza y el medio ambiente
# Sentence Domain dropdown option
news_current_affairs = Las noticias y asuntos actuales
# Sentence Domain dropdown option
technology_robotics = Tecnología y robótica
sentence-variant-select-label = Variante de la oración
sentence-variant-select-placeholder = Seleccione una variante (opcional)
sentence-variant-select-multiple-variants = Lenguaje general / múltiples variantes

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Sube frases de dominio público <icon></icon>
sc-bulk-upload-instruction = Arrastre su archivo aquí o <uploadButton>haga clic para cargar</uploadButton>
sc-bulk-upload-instruction-drop = Suelta el archivo aquí para subirlo
bulk-upload-additional-information = Si hay información adicional que quieres proporcionar sobre este archivo, ponte en contacto con <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Si hay información adicional que quieres proporcionar sobre este archivo que no está incluida en la plantilla, ponte en contacto con <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Inténtalo de nuevo arrastrando tu archivo aquí
try-upload-again-md = Intenta subir de nuevo
select-file = Seleccione Archivo
select-file-mobile = Seleccione el archivo para cargar
accepted-files = Tipos de archivos aceptados: solo .tsv
minimum-sentences = Cantidad mínima de oraciones en archivo: 1000
maximum-file-size = Tamaño máximo de archivo: 25 MB
what-needs-to-be-in-file = ¿Qué debe estar en mi expediente?
what-needs-to-be-in-file-explanation = Consulte nuestro <templateFileLink>archivo de plantilla</templateFileLink>. Tus oraciones deben estar libres de derechos de autor (CC0 o trabajo original autorizado por el remitente) y ser claras, gramaticalmente correctas y fáciles de leer. Las oraciones enviadas deben tardar entre 10 y 15 segundos en leerse y deben evitar incluir números, nombres propios y caracteres especiales.
upload-progress-text = Subida en curso...
sc-bulk-submit-confirm = Confirmo que estas oraciones son <wikipediaLink>dominio público</wikipediaLink> y tengo permiso para subirlas.
bulk-upload-success-toast = Frases masivas cargadas
bulk-upload-failed-toast = La carga falló, vuelva a intentarlo.
bulk-submission-success-header = ¡Gracias por contribuir con tu envío masivo!
bulk-submission-success-subheader = ¡Estás ayudando a Common Voice a alcanzar nuestros objetivos de oraciones diarias!
upload-more-btn-text = ¿Subir más frases?
file-invalid-type = Archivo inválido
file-too-large = El archivo es demasiado grande
file-too-small = El archivo es demasiado pequeño
too-many-files = Demasiados archivos

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = Agrega <icon></icon> varias oraciones en dominio público
multiple-sentences-error = No se puede añadir varias oraciones en un envío sencillo.
exceeds-small-batch-limit-error = No se puede enviar más de 1000 oraciones
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Se ha excedido el límite de velocidad. Inténtalo de nuevo en un minuto
       *[other] Se ha excedido el límite de velocidad. Inténtalo de nuevo en { $retryLimit } minutos
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Se ha excedido el límite de velocidad. Inténtalo de nuevo en un segundo
       *[other] Se ha excedido el límite de velocidad. Inténtalo de nuevo en { $retryLimit } segundos
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Has excedido el límite de envió para esta página. Espera un minuto antes de enviar otra oración. ¡Gracias por tu paciencia!
       *[other] Has excedido el límite de envió para esta página. Espera { $retryLimit } minutos antes de enviar otra oración. ¡Gracias por tu paciencia!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Has excedido el límite de envió para esta página. Espera un segundo antes de enviar otra oración. ¡Gracias por tu paciencia!
       *[other] Has excedido el límite de envió para esta página. Espera { $retryLimit } segundos antes de enviar otra oración. ¡Gracias por tu paciencia!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } de 1 oración recopilada
       *[other] { $uploadedSentences } de { $totalSentences } oraciones recopiladas
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } de una oración recopilada. Haz clic <downloadLink>aquí</downloadLink> para descargar las oraciones que fueron rechazadas.
       *[other] { $uploadedSentences } de { $totalSentences } recopiladas. Haz clic <downloadLink>aquí</downloadLink> para descargar las oraciones que fueron rechazadas.
    }
small-batch-sentences-rule-1 = Sigue las pautas de “¿Qué oraciones puedo agregar?”
small-batch-sentences-rule-2 = Añade una oración por línea
small-batch-sentences-rule-3 = Separa las oraciones en una por línea, por medio de un salto de línea entre cada una.
small-batch-sentences-rule-4 = Añade hasta 1.000 oraciones
small-batch-sentences-rule-5 = Todas las oraciones deben de encajarse en el mismo dominio
small-batch-sentences-rule-6 = Todas las oraciones deben de tener la misma fuente y citación
