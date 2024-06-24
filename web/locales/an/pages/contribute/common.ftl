## Contribution

action-click = Clic
action-tap = Triar
## Languages

contribute = Colaborar
skip = Blincar
shortcuts = Accesos directos
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> fragmento
       *[other] <bold>{ $count }</bold> fragmentos
    }
goal-help-recording = Gracias a la tuya aduya Common Voice ha aconseguiu lo d'o <goalPercentage></goalPercentage> nuestro obchectivo diario de gravación d'o { $goalValue }!
goal-help-validation = Gracias a la tuya aduya Common Voice ha aconseguiu lo d'o <goalPercentage></goalPercentage> nuestro obchectivo diario de validación d'o { $goalValue }!
contribute-more = Presto/a pa fer { $count } mas?
speak-empty-state = Nos hemos quedau sin frases pa gravar en este idioma ...
speak-empty-state-cta = Colabora con mas frases
record-button-label = Grava la tuya voz
share-title-new = <bold>Aduya-nos</bold> a trobar mas voces.
keep-track-profile = Fe un seguimiento d'o tuyo progreso con un perfil
login-to-get-started = Encieta sesión u rechistra-te pa prencipiar
target-segment-first-card = Yes colaborando con o nuestro primer obchectivo segmentau
target-segment-generic-card = Yes contribuyindo a un segmento obchectivo
target-segment-first-banner = Aduya a crear lo primer obchectivo segmentau de Common Voice en { $locale }
target-segment-add-voice = Anyade la tuya voz
target-segment-learn-more = Mas información

## Reporting

report = Informar
report-title = Ninviar un informe
report-ask = Quál ye lo problema d'esta frase?
report-offensive-language = Luengache ofensivo
report-offensive-language-detail = La frase incluye luengache irrespetuoso u ofensivo.
report-grammar-or-spelling = Error gramatical u d'ortografía
report-grammar-or-spelling-detail = La frase tiene una error gramatical u d'ortografía.
report-different-language = Unatro idioma
report-different-language-detail = Ye escrita en un idioma distinto a lo qual yo charro.
report-difficult-pronounce = Ye dificil de pronunciar
report-difficult-pronounce-detail = Incluye parolas u frases dificils de leyer u pronunciar.
report-offensive-speech = Conteniu ofensivo
report-offensive-speech-detail = La gravación incluye un luengache ofensivo u irrespetuoso.
report-other-comment =
    .placeholder = Comentar
success = Correcto
continue = Continar
report-success = L'informe se ninvió correctament

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = p

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = g
shortcut-record-toggle-label = Gravar/Aturar
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Tornar a gravar lo fragmento
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Descartar la gravación en curso
shortcut-submit = Tornar
shortcut-submit-label = Ninviar gravacions
request-language-text = Encara no trobas lo tuyo idioma en Common Voice?
request-language-button = Solicitar un idioma

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = r
shortcut-play-toggle-label = Reproducir/Aturar
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = s
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Criterios
contribution-criteria-link = Comprende los criterios de colaboración
contribution-criteria-page-title = Criterios de colaboración
contribution-criteria-page-description = Comprende que cal mirar quan escuites fragmentos de voz y aduya a fer tamién mas rica la tuya voz.
contribution-for-example = per eixemplo
contribution-misreadings-title = Lecturas erronias
contribution-misreadings-description = Quan escuites, compreba cudiadosament que lo que s'ha gravau ye exactament lo que s'ha escrito; refusa-lo encara que nomás i haiga errors menors. Una error muito común.
contribution-misreadings-description-extended-list-1 = Cambiar una parola per una altra pareixida. Per exemple, <strong>«a»</strong>, <strong>«en»</strong> u <strong>«con»</strong>.
contribution-misreadings-description-extended-list-2 = Falta una <strong>« s »</strong> a la fin d'a parola.
contribution-misreadings-description-extended-list-3 = Leyer fendo contraccions u elisions que no se troben en o texto. Per eixemplo, fer «de augua» si en o texto sale «d'augua», u viceversa.
contribution-misreadings-description-extended-list-4 = Falta d'a fin d'a zaguera parola per tallar masiau rapidament la gravación.
contribution-misreadings-description-extended-list-5 = Fer intentos multiples pa leyer una parola.
contribution-misreadings-example-1-title = Los dinosauros chigants d'o Triasico.
contribution-misreadings-example-2-title = Los dinosauro chigant d'o Triasico.
contribution-misreadings-example-2-explanation = [Habría d'estar ‘dinosauros’]
contribution-misreadings-example-3-title = Los dinosauros chigants d'o Triasi-.
contribution-misreadings-example-3-explanation = [Gravación tallada antes d'a zaguera parola]
contribution-misreadings-example-4-title = Los dinosauros chigantos d'o Triasico. Sí.
contribution-misreadings-example-4-explanation = [S'han gravau mas parolas que lo texto requiesto]
contribution-misreadings-example-5-title = Salimos a fer un café.
contribution-misreadings-example-6-title = Salimos a fer un café.
contribution-misreadings-example-6-explanation = [Habría d'estar "son"]
contribution-misreadings-example-7-title = Salimos a fer un café.
contribution-misreadings-example-7-explanation = [No i hai garra 'a' en o texto orichinal]
contribution-misreadings-example-8-title = Un elefant mató una tiradanya.
contribution-misreadings-example-8-explanation = [Lo conteniu no coincide]
contribution-varying-pronunciations-title = Pronunciacions variables
contribution-varying-pronunciations-description = Para cuenta antes de refusar un fragmento perque lo lector ha pronunciau malament una parola. L'aragonés tien una ampla variedat de pronuncias, y puet estar que no l'haigas sentiu en a foyeta. No se pronuncia igual en aragonés occidental, oriental, central u meridional. D'esta manera puetz apreciar a aquellos que parlan d'una manera diferent a la tuya.
contribution-varying-pronunciations-description-extended = D'atra man, si piensas que lo lector s'ha trobau con una parola nueva pa ell/a, y simplement la ha pronunciada mal, alavez refusa-la. Si no yes seguro, preta lo botón "omitir".
contribution-varying-pronunciations-example-1-title = Ells minchan mengranas.
contribution-varying-pronunciations-example-1-explanation = [«Ells» se puede pronunciar de diferents trazas, seguntes la variant dialectal]
contribution-varying-pronunciations-example-2-title = Fue a buscar la ferramienta.
contribution-varying-pronunciations-example-2-explanation = [En aragonés, «ferramienta» siempre se pronuncia como una parola, no pas dos]
contribution-background-noise-title = Rudio de fondo
contribution-background-noise-description = Queremos que los algoritmos d'aprendizache automatico sigan capables de maniar diferents ruidos de fondo. Se pueden acceptar rudios relativament fuertes, siempre que no impidan escuitar la totalidat d'o texto. La musica de fondo tranquila ye bien; la mosica masiau fuerte, que evite que haigatz se sentir totas las parolas, no lo ye.
contribution-background-noise-description-extended = Si la gravación se talla, refusa-lo. Fueras de si se puede sentir la totalidat d'o texto.
contribution-background-noise-example-1-fixed-title = <strong>[Estarnudo]</strong> Los dinosaurios chigants d'o <strong>[tos]</strong> Triasico.
contribution-background-noise-example-2-fixed-title = Lo dinosauro chi <strong>[tos]</strong> d'o Triasico.
contribution-background-noise-example-2-explanation = [No se siente parte d'o texto]
contribution-background-noise-example-3-fixed-title = <strong>[Cruixiu]</strong> Los dinosauros chigants d'o <strong>[cruixiu]</strong> -asico.
contribution-background-voices-title = Voces de fondo?
contribution-background-voices-description = Un rudio de fondo tranquilo ye bien, pero no queremos que i haiga voces adicionals que puedan fer que un algoritmo informatico indentifique parolas que no amanexein en o texto escrito. Si puetz sentir parolas diferents a part d'as d'o text, s'hauria de refusar lo clip. Per un regular, ixo pasa si s'ha deixau lo televisor encendiu u si i hai una conversa cercana.
contribution-background-voices-description-extended = Si la gravación se talla u fa cluixius, refusa-la, fueras de si se siente la totalidat d'o texto.
contribution-background-voices-example-1-title = Los dinosauros chigants d'o Triasico. <strong>[leito per una voz]</strong>
contribution-background-voices-example-1-explanation = Te'n viens? <strong>[clamau per yo]</strong>
contribution-volume-title = Volumen
contribution-volume-description = Ye normal que i haiga variacions de volumen entre lectors. Refusa-las nomás quan lo volumen sía tant alto que lo rechistro satura, u (mas comunment) si ye tant baixo que no puetz sentir lo que s'ha dito sin la referencia d'o texto escrito.
contribution-reader-effects-title = Efectos d'o lector
contribution-reader-effects-description = La mayoría d'as gravacions son de chent que parla con a suya voz natural. Puetz acceptar ocasionalment una gravación ocasional no standard an que se chile, grite, susurre y, obviament, tamién se dramatice lo texto. Refusa las gravacions cantadas y las que fagan servir una voz sintetizada per ordinador.
contribution-just-unsure-title = Tiens dubdas?
contribution-just-unsure-description = Si te trobas con bella cosa no cubierta con estas directrices, vota seguntes lo tuyos millor cirterio. Si realment no lo puetz decidir, preta lo botón Omitir y pasa a la siguient voz quan quieras.
see-more = </chevron></chevron>Veyer-ne mas
see-less = <chevron></chevron>Veyer-ne menos
