## Contribution

action-click = Hacer clic
action-tap = Tocar
## Languages

contribute = quy
skip = Paway
shortcuts = Atajos
clips-with-count-pluralized =
    { $count ->
        [one] clip
       *[other] clips
    }
goal-help-recording = Has ayudado a Common Voice a alcanzar <goalPercentage></goalPercentage> de nuestra meta diaria de { $goalValue } de grabaciones!
goal-help-validation = Has ayudado a Common Voice a alcanzar <goalPercentage></goalPercentage> de nuestra meta diaria de { $goalValue } de validaciones!
contribute-more =
    { $count ->
        [one] ¿Listo para hacer { $count } más?
       *[other] ¿Listo para hacer { $count } más?
    }
speak-empty-state = Nos hemos quedado sin oraciones para grabar en este idioma...
speak-empty-state-cta = Contribuir oraciones
speak-loading-error =
    No pudimos obtener ninguna oración para que usted hable.
    Por favor, inténtelo de nuevo más tarde.
record-button-label = Graba tu voz
share-title-new = <bold>Ayúdanos</bold> a encontrar más voces
keep-track-profile = Lleva un registro de tu progreso con un perfil
login-to-get-started = Inicia sesión o regístrate para empezar
target-segment-first-card = Está contribuyendo a nuestro primer segmento objetivo
target-segment-generic-card = Estás contribuyendo a un segmento objetivo
target-segment-first-banner = Ayude a crear el primer segmento objetivo de Common Voice en { $locale }
target-segment-add-voice = Agrega tu Voz
target-segment-learn-more = Aprender más

## Reporting

report = Reportar
report-title = Enviar un reporte
report-ask = ¿Qué problema estás experimentando con esta oración?
report-offensive-language = Lenguaje ofensivo
report-offensive-language-detail = La oración tiene un lenguaje irrespetuoso u ofensivo.
report-grammar-or-spelling = Error gramatical/ortográfico
report-grammar-or-spelling-detail = La oración tiene un error gramatical u ortográfico.
report-different-language = Lenguaje diferente
report-different-language-detail = Está escrito en un idioma diferente al que estoy hablando.
report-difficult-pronounce = Dificultad para pronunciar
report-difficult-pronounce-detail = Contiene palabras o frases que son muy difíciles de leer o pronunciar.
report-offensive-speech = Discurso ofensivo
report-offensive-speech-detail = El clip tiene un lenguaje irrespetuoso u ofensivo.
report-other-comment =
    .placeholder = Comentar
success = Éxito
continue = Continuar
report-success = Reporte fue enviado exitósamente

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Grabar/Detener
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Regrabar clip
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Grabacion purichkaqta wischuy
shortcut-submit = Volver
shortcut-submit-label = Enviar clips
request-language-text = ¿Manaraqchu Common Voice nisqapi kunkaykita rikunki?
request-language-button = musuq simita mañakuy

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Reproducir/Detener
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Criterio
contribution-criteria-link = Criterios de contribución nisqamanta hamut’ay
contribution-criteria-page-title = Criterio de contribución
contribution-criteria-page-description = ¡Comprenda qué buscar al escuchar clips de voz y ayude a enriquecer sus grabaciones de voz también!
contribution-for-example = por ejemplo
contribution-misreadings-title = Pantasqa ñawinchasqakuna
contribution-misreadings-description = Al escuchar, verifique con mucho cuidado que lo que se ha grabado es exactamente lo que se ha escrito; rechazar si hay incluso errores menores. <br />Errores muy comunes incluyen:
contribution-misreadings-description-extended-list-1 = Falta <strong>'A'</strong> o <strong>'The'</strong> al principio de la grabación.
contribution-misreadings-description-extended-list-2 = Falta un <strong>'s'</strong> al final de una palabra.
contribution-misreadings-description-extended-list-3 = Leer contracciones que en realidad no existen, como "We're" en lugar de "We are", o viceversa.
contribution-misreadings-description-extended-list-4 = Falta el final de la última palabra al cortar la grabación demasiado rápido.
contribution-misreadings-description-extended-list-5 = Tomar varios intentos para leer una palabra.
contribution-misreadings-example-1-title = Los dinosaurios gigantes del Triásico.
contribution-misreadings-example-2-title = El dinosaurio gigante del Triásico.
contribution-misreadings-example-2-explanation = [Deberían ser 'dinosaurios']
contribution-misreadings-example-3-title = Los dinosaurios gigantes del Triassi-.
contribution-misreadings-example-3-explanation = [Grabación cortada antes del final de la última palabra]
contribution-misreadings-example-4-title = Los dinosaurios gigantes del Triásico. Sí.
contribution-misreadings-example-4-explanation = [Se ha grabado más que el texto requerido]
contribution-misreadings-example-5-title = Saldremos a tomar café.
contribution-misreadings-example-6-title = Nosotros vamos a tomar cafe
contribution-misreadings-example-6-explanation = [Debería ser "Somos"]
contribution-misreadings-example-7-title = Nosotros vamos a tomar un cafe
contribution-misreadings-example-7-explanation = [Sin 'a' en el texto original]
contribution-misreadings-example-8-title = El abejorro pasó a toda velocidad.
contribution-misreadings-example-8-explanation = [Contenido no coincidente]
contribution-varying-pronunciations-title = Pronunciaciones variadas
contribution-varying-pronunciations-description = Tenga cuidado antes de rechazar una grabación porque el lector pronunció mal una palabra, puso el énfasis en el lugar equivocado o aparentemente ignoró un signo de interrogación. Hay una gran variedad de pronunciaciones en uso en todo el mundo, algunas de las cuales quizás no haya escuchado en su comunidad local. Proporcione un margen de apreciación para aquellos que puedan hablar de manera diferente a usted.
contribution-varying-pronunciations-description-extended = Por otro lado, si cree que el lector probablemente nunca antes se ha topado con la palabra y simplemente está adivinando incorrectamente la pronunciación, rechace. Si no está seguro, utilice el botón Saltar.
contribution-varying-pronunciations-example-1-title = En la cabeza llevaba una boina.
contribution-varying-pronunciations-example-1-explanation = [‘Beret’ está bien ya sea con acento en la primera sílaba (Reino Unido) o en la segunda (EE. UU.)]
contribution-varying-pronunciations-example-2-title = Su mano estaba levantada.
contribution-varying-pronunciations-example-2-explanation = ['Raised' en inglés siempre se pronuncia como una sílaba, no dos]
contribution-background-noise-title = Ruido de fondo
contribution-background-noise-description = Queremos que los algoritmos de aprendizaje automático puedan manejar una variedad de ruidos de fondo, e incluso se pueden aceptar ruidos relativamente altos, siempre que no impidan escuchar la totalidad del texto. La música de fondo tranquila está bien; la música lo suficientemente alta como para evitar que escuches todas y cada una de las palabras no lo es.
contribution-background-noise-description-extended = Si la grabación se rompe o tiene crujidos, rechace a menos que aún se pueda escuchar la totalidad del texto.
contribution-background-noise-example-1-fixed-title = <strong>[Estornudo]</strong> Los dinosaurios gigantes del <strong>[tos]</strong> Triásico.
contribution-background-noise-example-2-fixed-title = El dinosaurio gigante <strong>[tos]</strong> el Triásico.
contribution-background-noise-example-2-explanation = [Parte del texto no se puede escuchar]
contribution-background-noise-example-3-fixed-title = <strong>[Crackle]</strong> dinosaurios gigantes de <strong>[Crackle]</strong> -riassic.
contribution-background-voices-title = Voces de fondo
contribution-background-voices-description = Una bulla silenciosa de fondo está bien, pero no queremos voces adicionales que puedan causar que un algoritmo de máquina identifique palabras que no están en el texto escrito. Si puede escuchar palabras distintas a las del texto, debe rechazar el clip. Por lo general, esto sucede donde se ha dejado el televisor encendido o donde hay una conversación cerca.
contribution-background-voices-description-extended = Si la grabación se rompe o tiene crujidos, rechace a menos que aún se pueda escuchar la totalidad del texto.
contribution-background-voices-example-1-title = Los dinosaurios gigantes del Triásico. <strong>[leído por una sola voz]</strong>
contribution-background-voices-example-1-explanation = ¿Vienes? <strong>[llamado por otro]</strong>
contribution-volume-title = Volumen
contribution-volume-description = Habrá variaciones naturales de volumen entre los lectores. Rechace sólo si el volumen es tan alto que la grabación se interrumpe o (más comúnmente) si es tan bajo que no puede escuchar lo que se dice sin referencia al texto escrito.
contribution-reader-effects-title = Efectos de lectura
contribution-reader-effects-description = La mayoría de las grabaciones son de personas hablando con su voz natural. Puede aceptar la grabación no estándar ocasional con grito, susurra o, obviamente, brindada con una voz "dramática". Rechace las grabaciones cantadas y las que utilicen una voz sintetizada por computadora.
contribution-just-unsure-title = ¿Manachu segurochu kankilla?
contribution-just-unsure-description = Si encuentra algo que estas pautas no cubren, vote de acuerdo con su mejor criterio. Si realmente no puede decidir, use el botón de salto y continúe con la siguiente grabación.
see-more = <chevron></chevron>Ver más
see-less = <chevron></chevron>Ver menos

