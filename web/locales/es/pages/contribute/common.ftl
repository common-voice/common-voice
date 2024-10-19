action-click = Clic
action-tap = Seleccionar
contribute = Colaborar
review = Revisar
skip = Saltar
shortcuts = Accesos directos
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> fragmento
       *[other] <bold>{ $count }</bold> fragmentos
    }
goal-help-recording = ¡Gracias a tu ayuda Common Voice ha alcanzado el <goalPercentage></goalPercentage> de nuestro objetivo diario de grabación del { $goalValue }!
goal-help-validation = ¡Gracias a tu ayuda Common Voice ha alcanzado el <goalPercentage></goalPercentage> de nuestro objetivo diario de validación del { $goalValue }!
contribute-more = ¿Listo para hacer { $count } más?
speak-empty-state = Nos hemos quedado sin frases para grabar en este idioma ...
speak-empty-state-cta = Colabora con más frases
speak-loading-error = No se pudo cargar oraciones. Vuelve a intentar más tarde.
record-button-label = Grabar tu voz
share-title-new = <bold>Ayúdanos</bold> a encontrar más voces.
keep-track-profile = Haz un seguimiento de tu progreso con un perfil
login-to-get-started = Inicia sesión o regístrate para comenzar
target-segment-first-card = Estás colaborando con nuestro primer objetivo segmentado
target-segment-generic-card = Estás contribuyendo a un segmento objetivo
target-segment-first-banner = Ayuda a crear el primer objetivo segmentado de Common Voice en { $locale }
target-segment-add-voice = Agrega tu voz
target-segment-learn-more = Más información
change-preferences = Cambiar preferencias

## Contribution Nav Items

contribute-voice-collection-nav-header = Colección de voz
contribute-sentence-collection-nav-header = Recopilación de frases
login-signup = Iniciar sesión / Registrarse
vote-yes = Sí
vote-no = No
datasets = Conjuntos de datos
languages = Idiomas
about = Acerca de
partner = Sé nuestro socio
submit-form-action = Enviar

## Reporting

report = Informar
report-title = Enviar un informe
report-ask = ¿Cuál es el problema de esta frase?
report-offensive-language = Lenguaje ofensivo
report-offensive-language-detail = La frase incluye lenguaje irrespetuoso u ofensivo.
report-grammar-or-spelling = Error gramatical o de ortografía
report-grammar-or-spelling-detail = La frase tiene un error gramatical o de ortografía.
report-different-language = Otro idioma
report-different-language-detail = Está escrita en un idioma distinto al que yo hablo.
report-difficult-pronounce = Es difícil de pronunciar
report-difficult-pronounce-detail = Incluye palabras o frases difíciles de leer o pronunciar.
report-offensive-speech = Contenido ofensivo
report-offensive-speech-detail = La grabación incluye un lenguaje ofensivo o irrespetuoso.
report-other-comment =
    .placeholder = Comentar
success = Correcto
continue = Continuar
report-success = El informe se envió correctamente

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = h

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = g
shortcut-record-toggle-label = Grabar/Detener
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Grabar de nuevo el clip
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Descartar la grabación en curso
shortcut-submit = Volver
shortcut-submit-label = Enviar grabaciones
request-language-text = ¿Aún no encuentras tu idioma en Common Voice?
request-language-button = Solicitar un idioma

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

## Validation criteria

contribution-criteria-nav = Criterios
contribution-criteria-link = Aprender más sobre criterios de contribución
contribution-criteria-page-title = Criterios de contribución
contribution-criteria-page-description = ¡Aprende más sobre qué buscar cuando escuchas las grabaciones y también discubre cómo mejorar tus proprias grabaciones!
contribution-for-example = por ejemplo
contribution-misreadings-title = Malas interpretaciones
contribution-misreadings-description = Al escuchar, revisa cuidadosamente que lo que se ha grabado es exactamente lo que está escrito; rechaza la grabación si no concuerda la grabación con el texto. <br/> Entre los errores más comunes, se encuentran:
contribution-misreadings-example-1-title = Los dinosaurios gigantes del Triásico.
contribution-misreadings-example-2-title = El dinosaurio gigante del Triásico.
contribution-misreadings-example-2-explanation = [Debería ser ‘dinosaurios’]
contribution-misreadings-example-3-title = Los dinosaurios gigantes del Triási-.
contribution-misreadings-example-3-explanation = [La grabación se interrumpe antes del final de la última palabra]
contribution-misreadings-example-4-title = Los dinosaurios gigantes del Triásico. Sí.
contribution-misreadings-example-4-explanation = [Se ha grabado más del texto escrito]
contribution-misreadings-example-5-title = Me voy para el pueblo.
contribution-misreadings-example-6-title = Me voy pal pueblo.
contribution-misreadings-example-6-explanation = [Debe ser “para el”]
contribution-misreadings-example-7-title = Me voy para mi pueblo
contribution-misreadings-example-7-explanation = [No hay 'mi' en el texto original]
contribution-misreadings-example-8-title = El perro pasó rápidamente.
contribution-misreadings-example-8-explanation = [El contenido no coincide]
contribution-varying-pronunciations-title = Pronunciaciones que pueden variar
contribution-varying-pronunciations-description = Ten cuidado antes de rechazar una grabación donde se escucha que hay una mispronunciación. Hay una gran variedad de maneras de pronunciar las palabras en el mundo, algunas que a lo mejor no habrás escuchado en su comunidad. Si se puede entender la grabación aunque esté pronunciada con un acento diferente, acéptala.
contribution-varying-pronunciations-description-extended = Por otro lado, si crees que el lector nunca antes se ha topado con la palabra y está adivinando incorrectamente la pronunciación, recházala. Si no estás seguro, utiliza el botón de saltar.
contribution-background-noise-title = Ruido de fondo
contribution-background-noise-description = Queremos que los algoritmos de aprendizaje automático puedan manejar una variedad de ruidos de fondo, e incluso se pueden aceptar ruidos relativamente fuertes siempre que no impidan escuchar la totalidad del texto. La música de fondo tranquila está bien; la música lo suficientemente fuerte como para hacer que no puedas escuchar todas las palabras no está bien.
contribution-background-noise-description-extended = Si la grabación se interrumpe o se escuchan ruidos, recházala a menos que aún se pueda escuchar todo el texto.
contribution-background-noise-example-1-fixed-title = <strong>[Estornudo]</strong> Los dinosaurios gigantes del <strong>[tos]</strong> Triásico.
contribution-background-noise-example-2-fixed-title = El dinosaurio gigan <strong>[tos]</strong> del Triásico.
contribution-background-noise-example-2-explanation = [Una parte del texto no se puede oír]
contribution-background-voices-title = Voces de fondo
contribution-background-voices-description-extended = Si la grabación se interrumpe o se escuchan ruidos, recházala a menos que aún se pueda escuchar todo el texto.
contribution-volume-title = Volumen
contribution-volume-description = Habrá variaciones naturales de volumen entre lectores. Rechaza la grabación sólo si el volumen es tan alto que se interrumpe o (más comúnmente) si es tan bajo que no se puede entender lo que está dicho sin consultar el texto escrito.
contribution-reader-effects-title = Efectos del lector
contribution-reader-effects-description = La mayoría de las grabaciones son de personas que hablan con su voz natural. Puede aceptar grabaciones en las que se grite, susurre o se lea claramente con una voz "dramática". Rechaza las grabaciones cantadas y las que utilicen una voz sintetizada o robótica.
contribution-just-unsure-title = ¿Y si no estás seguro?
contribution-just-unsure-description = Si encuentras algo que estas pautas no cubren, vota según tu mejor criterio. Si realmente no puedes decidirte, usa el botón de saltar y pasa a la siguiente grabación.
see-more = </chevron></chevron>Ver más
see-less = <chevron></chevron>Ver menos
