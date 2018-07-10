## General

yes-receive-emails = Sí, enviadme correos. Me gustaría mantenerme informado sobre el proyecto Common Voice.
stayintouch = En Mozilla estamos construyendo una comunidad en torno a la tecnología de voz. Nos gustaría mantenerte al tanto de las actualizaciones, nuevas fuentes de datos y saber más sobre cómo tu usas esos datos.
privacy-info = Prometemos manejar tu información con cuidado. Lee más en nuestra <privacyLink>política de privacidad</privacyLink> .
return-to-cv = Regresar a Common Voice
email-input =
    .label = Correo
submit-form-action = Enviar
loading = Cargando…

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

an = Aragonés
ar = Árabe
as = Asamés
ast = Asturiano
az = Azerí
bn = Bengalí
br = Bretón
bxr = Buriato
ca = Catalán
cs = Checo
cv = Chuvasio
cy = Galés
da = Danés
de = Alemán
dsb = Bajo sorabo
el = Griego
en = Inglés
es = Español
et = Estonio
fi = Finlandés
fo = Feroés
fr = Francés
fy-NL = Frisón
ga-IE = Irlandés
he = Hebreo
hsb = Alto sorabo
hu = Húngaro
ia = Interlingua
id = Indonesio
is = Islandés
it = Italiano
ja = Japonés
ka = Georgiano
kab = Cabilio
kk = Kazajo
ko = Coreano
kw = Córnico
ky = Kirguís
mk = Macedonio
myv = Erzya
nb-NO = Noruego (Bokmål)
ne-NP = Nepalí
nl = Neerlandés
nn-NO = Noruego Nynorsk
or = Odia
pl = Polaco
pt-BR = Portugués (Brasil)
ro = Rumano
ru = Ruso
sah = Yakuto
sk = Eslovaco
sl = Esloveno
sq = Albanés
sr = Serbio
sv-SE = Sueco
ta = Tamil
te = Telugú
th = Tailandés
tr = Turco
tt = Tártaro
uk = Ucraniano
uz = Uzbeko
zh-CN = Chino (China)
zh-HK = Chino (Hong Kong)
zh-TW = Chino (Taiwán)

# [/]


## Layout

speak = Hablar
speak-now = Habla ahora
datasets = Archivos de datos
languages = Idiomas
profile = Perfil
help = Ayuda
contact = Contacto
privacy = Privacidad
terms = Términos
cookies = Cookies
faq = Preguntas frecuentes
content-license-text = Contenido disponible a través de una <licenseLink>Licencia Creative Commons</licenseLink>
share-title = ¡Ayudanos a llegar a más personas que quieran donar su voz!
share-text = Ayuda a enseñarles a las máquinas cómo hablan las personas, dona tu voz en { $link }
link-copied = Enlace copiado
back-top = Volver al inicio
contribution-banner-text = Acabamos de lanzar una nueva experiencia de colaboración
contribution-banner-button = Echa un vistazo
report-bugs-link = Ayuda a informar de errores

## Home Page

home-title = El proyecto Common Voice es una iniciativa de Mozilla para ayudar a enseñarles a las máquinas cómo hablan las personas.
home-cta = Habla, ¡contribuye aquí!
wall-of-text-start = La voz es natural, la voz es humana. Es por eso que estamos fascinados con crear una tecnología de voz para nuestras maquinas. Pero para crear un sistema de voz, una cantidad extremadamente grande de muestras de voz es requerida.
wall-of-text-more-mobile = La mayor parte de los datos usados por las grandes compañías no esta disponible para las personas. Nosotros pensamos que eso sofoca la innovación. Así que lanzamos el proyecto Common Voice, un proyecto para hacer que el reconocimiento de voz esté disponible para todos.
wall-of-text-more-desktop = Ahora puedes donar tu voz para ayudarnos a construir una base de datos de voz de código abierto que cualquiera pueda usar para hacer aplicaciones innovadoras para dispositivos y la web.<lineBreak></lineBreak>Lee una oración para ayudar a enseñarles a las máquinas cómo hablan las personas. Revisa el trabajo de otros contribuidores para mejorar la calidad. ¡Así de simple!
show-wall-of-text = Leer más
help-us-title = ¡Ayúdanos a verificar oraciones!
help-us-explain = Presiona reproducir, escucha y cuéntanos: ¿dijeron con precisión la oración anterior?
no-clips-to-validate = Parece que no hay grabaciones para escuchar en este idioma. Ayúdanos a llenar la lista grabando alguna ahora.
vote-yes = Sí
vote-no = No
toggle-play-tooltip = Presiona { shortcut-play-toggle } para activar el modo de reproducción

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = h

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = r
shortcut-play-toggle-label = Reproducir/Detener
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = s
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = g
shortcut-record-toggle-label = Grabar/Detener
request-language-text = ¿Aún no encuentras tu idioma en Common Voice?
request-language-button = Solicitar un idioma

## ProjectStatus

status-title = Estado general del proyecto: ¡Ve que tan lejos hemos llegado!
status-contribute = Contribuye con tu voz
status-hours =
    { $hours ->
        [one] ¡Llevamos una hora validada!
       *[other] ¡Llevamos { $hours } horas validadas!
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Siguiente objetivo: { $goal }
english = Inglés

## ProfileForm

profile-form-cancel = Salir del formulario
profile-form-delete = Eliminar perfil
profile-form-username =
    .label = Nombre de usuario
profile-form-language =
    .label = Idioma
profile-form-accent =
    .label = Acento
profile-form-age =
    .label = Edad
profile-form-gender =
    .label = Género
profile-form-submit-save = Guardar
profile-form-submit-saved = Guardado
profile-keep-data = Conservar datos
profile-delete-data = Eliminar datos
male = Hombre
female = Mujer
# Gender
other = Otro
why-profile-title = ¿Por qué un perfil?
why-profile-text = Al entregarnos un poco de información sobre ti, los datos de audio que envíes a Common Voice serán más útiles para los motores de reconocimiento de voz que los usen mejorando su precisión.
edit-profile = Editar perfil
profile-create = Crear un perfil
profile-create-success = Hecho, ¡perfil creado!
profile-close = Cerrar
profile-clear-modal = Limpiar los datos del perfil implica que tu información demográfica ya no será enviada a Common Voice junto con tus grabaciones.
profile-explanation = Ve tu progreso con un perfil y ayuda a nuestros datos de voz a ser más precisos.

## FAQ

faq-title = Preguntas frecuentes
faq-what-q = ¿Qué es Common Voice?
faq-what-a = La tecnología de reconocimiento de voz puede revolucionar la forma en que interactuamos con máquinas, pero los sistemas actualmente disponibles son caros y privados. Common Voice es un proyecto para hacer que la tecnología de reconocimiento de voz sea fácilmente accesible para todos. Las personas donan sus voces a una base de datos masiva que le permite a todos rápida y fácilmente entrenar aplicaciones con capacidades de reconocimiento de voz. Todos los datos de voz estarán disponibles para los desarrolladores.
faq-important-q = ¿Por qué es importante?
faq-important-a = La voz es natural, la voz es humana. Es la forma más fácil y natural de comunicarse. Queremos que los desarrolladores puedan construir cosas sorprendentes desde traductores en tiempo real a asistentes administrativos con los que puedas conversar. Pero en este momento no hay suficientes datos disponibles públicamente para construir este tipo de aplicaciones. Esperamos que Common Voice le de a los desarrolladores lo que necesitan para innovar.
faq-get-q = ¿Cómo puedo obtener los datos de Common Voice?
faq-get-a = El archivo de datos está ahora disponible en nuestra <downloadLink>página de descarga</downloadLink> bajo la licencia <licenseLink>CC-0</licenseLink>.
faq-mission-q = ¿Por qué es Common Voice parte de la misión de Mozilla?
faq-mission-a = Mozilla está dedicado a mantener la web abierta y accesible para todos. Para hacerlo necesitamos empoderar a los creadores web a través de proyectos como Common Voice. A medida que las tecnologías de voz proliferan más allá de las aplicaciones de nicho, nosotros creemos que deben servir igual de bien a los usuarios. Vemos una necesidad de incluir más idiomas, acentos y datos demográficos al construir y probar tecnologías de voz. Mozilla quiere ver un internet saludable y vibrante. Esto significa darle a acceso a nuevos creadores a datos de voz, de forma tal que puedan construir nuevos y extraordinarios proyectos. Common Voice será un recurso público que ayudará a los equipos de Mozilla y a los desarrolladores de todo el mundo.
faq-native-q = No soy un hablante nativo de { $lang } y hablo con acento, ¿igual quieren mi voz?
faq-native-a = Sí, ¡definitivamente queremos tu voz! Parte de la meta de Common Voice es conseguir tantos acentos como sea posible, para que los computadores puedan entender mejor <bold>a todos</bold> cuando hablen.
faq-firefox-q = ¿Será algún día la tecnología de voz-a-texto, a través de Common Voice, parte de Firefox?
faq-firefox-a = Common Voice tiene un potencial ilimitado y de hecho estamos explorando interfaces de voz en varios productos de Mozilla, incluyendo Firefox.
faq-quality-q = ¿Cuál es nivel de calidad del audio requerido para que pueda ser utilizado?
faq-quality-a = Queremos que la calidad de audio refleje la calidad del audio a la que el motor de voz-a-texto se enfrentará en el mundo real. Por ello, queremos variedad. Esto le enseña al motor de voz-a-texto a manejar varias situaciones —charlas en segundo plano, ruido de vehículos, ventiladores— sin cometer errores.
faq-hours-q = ¿Por qué es capturar 10.000 horas de audio una meta? 
faq-hours-a = Este es aproximadamente el número de horas requerido para entrenar un sistema STT a nivel de producción.
faq-source-q = ¿De dónde viene el texto fuente?
faq-source-a1 = Las oraciones actuales provienen de donaciones de contribuidores, junto a diálogos de textos de películas de dominio público como <italic>¡Que bello es vivir!</italic>.
faq-source-a2 = Puedes ver nuestras oraciones fuente en <dataLink>esta carpeta de GitHub</dataLink>.

## Profile

profile-why-title = ¿Por qué un perfil?
profile-why-content = Al entregar un poco de información sobre ti, los datos de audio que envíes a Common Voice serán aún más útiles para los motores de reconocimiento de voz que usen estos datos para mejorar su precisión.

## NotFound

notfound-title = No encontrado
notfound-content = Perdóname, no sé qué estás buscando.

## Data

data-download-button = Descargar datos de Common Voice
data-download-yes = Sí
data-download-deny = No
data-download-license = Licencia: <licenseLink>CC-0</licenseLink>
data-download-modal = Estás a punto de iniciar una descarga de <size>{ $size }GB</size>, ¿proceder?
data-subtitle = Estamos construyendo un archivo de datos de voces abierto y disponible públicamente que todos puedan usar para entrenar aplicaciones con reconocimiento de voz.
data-explanatory-text = Creemos que los archivos de datos de voz grandes y disponibles públicamente promueven la innovación y la competencia comercial sana en las tecnologías de voz basadas en el aprendizaje de las máquinas. Este es un esfuerzo mundial e invitamos a todos a participar. Nuestra meta es ayudar a la tecnología de voz a ser más inclusiva, reflejando la diversidad en las voces de todo el mundo.
data-get-started = <speechBlogLink>Empezar con el reconocimiento de voz</speechBlogLink>
data-other-title = Otros archivos de datos de voz…
data-other-goto = Ir a { $name }
data-other-download = Descargar datos
data-other-librispeech-description = LibriSpeech es un corpus de aproximadamente 1000 horas de inglés hablado a 16Khz derivado de lecturas de audiolibros del proyecto LibriVox.
data-other-ted-name = Corpus de TED-LIUM
data-other-ted-description = El corpus de TED-LIUM fue hecho de audios de charlas y de sus transcripciones disponibles en el sitio web de TED
data-other-voxforge-description = VoxForge fue hecho para recolectar frases transcritas para ser usadas por motores de reconocimiento de voz de código abierto.
data-other-tatoeba-description = Tatoeba es una gran base de datos de oraciones, traducciones y audio para uso en aprendizaje de máquinas. Esta descarga contiene todo el inglés grabado por su comunidad.
data-bundle-button = Descargar paquete de archivo de datos
data-bundle-description = Datos de Common Voice junto con todos los archivos de datos de voz anteriores.
license = Licencia: <licenseLink>{ $license }</licenseLink>
license-mixed = Mixta

## Record Page

record-platform-not-supported = Lo sentimos, pero tu plataforma actualmente no está soportada.
record-platform-not-supported-desktop = En computadores de escritorio, puedes descargar la última versión:
record-platform-not-supported-ios = Los usuarios de <bold>iOS</bold> pueden descargar nuestra app gratuita:
record-must-allow-microphone = Debe permitir acceso al micrófono.
record-retry = Reintentar
record-no-mic-found = No se encontró ningún micrófono.
record-error-too-short = La grabación fue muy corta.
record-error-too-long = La grabación fue muy larga.
record-error-too-quiet = La grabación fue muy silenciosa.
record-submit-success = ¡Envío exitoso! ¿Quieres volver a grabar?
record-help = Por favor, toca el botón para grabar y luego lee la oración anterior en voz alta.
record-cancel = Cancelar regrabación
review-terms = Al usar Common Voice, aceptas nuestros <termsLink>Términos de uso</termsLink> y la <privacyLink>Política de privacidad</privacyLink>
terms-agree = Estoy de acuerdo
terms-disagree = Estoy en desacuerdo
review-aborted = Subida abortada. ¿Quieres eliminar tus grabaciones?
review-submit-title = Revisar y enviar
review-submit-msg = ¡Gracias por grabar!<lineBreak></lineBreak>Ahora revisa y envía tus grabaciones a continuación.
review-recording = Revisar
review-rerecord = Regrabar
review-cancel = Cancelar envío
review-keep-recordings = Mantener las grabaciones
review-delete-recordings = Eliminar mis grabaciones

## Download Modal

download-title = Tu descarga ha empezado.
download-helpus = Ayúdanos a construir una comunidad en torno a la tecnología de voz, mantente en contacto por correo.
download-form-email =
    .label = Ingresa tu correo.
    .value = Gracias, estaremos en contacto.
download-back = Regresar a los archivos de datos de Common Voice
download-no = No, gracias

## Contact Modal

contact-title = Formulario de contacto
contact-form-name =
    .label = Nombre
contact-form-message =
    .label = Mensaje
contact-required = *requerido

## Request Language Modal

request-language-title = Solicitud de idioma
request-language-form-language =
    .label = Idioma
request-language-success-title = Solicitud de idioma enviada correctamente, gracias.
request-language-success-content = Estaremos en contacto con más información sobre cómo añadir tu idioma a Common Voice muy pronto.

## Languages Overview

language-section-in-progress = En proceso
language-section-in-progress-description = Son nuestras comunidades las que crean los idiomas en progreso; es decir, en qué fase se encuentran del proceso de localización web y de la recopilación de frases.
language-section-launched = Lanzados
language-section-launched-description = Para estos idiomas, el sitio web se ha localizado con éxito y se han recopilado suficientes oraciones para permitir una contribución continua de <italic> { speak } </ italic> y <italic> { listen } </ italic>.
languages-show-more = Ver más
languages-show-less = Ver menos
language-speakers = Hablantes
language-meter-in-progress = Progreso
language-total-progress = Total
language-search-input =
    .placeholder = Buscar

## New Contribution

action-click = Clic
action-tap = Seleccionar
contribute = Colaborar
listen = Escuchar
skip = Saltar
shortcuts = Accesos directos
clips = Grabaciones
goal-help-recording = ¡Gracias a tu ayuda Common Voice ha alcanzado el <goalPercentage></goalPercentage> de nuestro objetivo diario de grabación del { $goalValue }!
goal-help-validation = ¡Gracias a tu ayuda Common Voice ha alcanzado el <goalPercentage></goalPercentage> de nuestro objetivo diario de validación del { $goalValue }!
contribute-more = ¿Listo para hacer { $count } más?
record-cta = Empezar a grabar
record-instruction = { $actionType } <recordIcon> </recordIcon> y después lee la frase en alto
record-stop-instruction = { $actionType } <stopIcon> </stopIcon> cuando acabes
record-three-more-instruction = ¡Quedan tres!
record-again-instruction = ¡Genial! <recordIcon></recordIcon> Continúa con tu siguiente grabación
record-again-instruction2 = Sigue así, graba de nuevo <recordIcon></recordIcon>
record-last-instruction = <recordIcon></recordIcon> ¡La última!
review-tooltip = Revisa y vuelve a grabar aquí sobre la marcha
unable-speak = No se puede hablar en este momento
review-instruction = Revisa y vuelve a grabar si es necesario
record-submit-tooltip = { $actionType } enviar cuando acabes
clips-uploaded = Grabaciones subidas
record-abort-title = ¿Quieres terminar de grabar primero?
record-abort-text = Si sales ahora, perderás todo lo que has hecho hasta ahora
record-abort-submit = Enviar grabaciones
record-abort-continue = Finalizar grabación
record-abort-delete = Salir y eliminar grabaciones
listen-instruction = { $actionType } <playIcon></playIcon> ¿han dicho la frase de forma precisa?
listen-again-instruction = ¡Buen trabajo! <playIcon></playIcon> Escucha de nuevo cuando estés preparado
listen-3rd-time-instruction = Dos menos <playIcon></playIcon>, ¡sigue así!
listen-last-time-instruction = <playIcon></playIcon> ¡La última!
nothing-to-validate = No contamos con ningún recurso para validar este idioma, ¡ayúdanos!
record-button-label = Grabar tu voz
share-title-new = <bold>Ayúdanos</bold> a encontrar más voces.
