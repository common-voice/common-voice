action-click = Prema
action-tap = Toque
contribute = Colabore
review = Revise
skip = Salte
shortcuts = Atallos
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> Fragmento
       *[other] <bold>{ $count }</bold> Fragmentos
    }
goal-help-recording = Axudou a que Common Voice acadase o <goalPercentage></goalPercentage> respecto do noso obxectivo do { $goalValue } de gravación diaria!
goal-help-validation = Axudou a que Common Voice acadase o <goalPercentage></goalPercentage> respecto do noso obxectivo do { $goalValue } de aprobación diaria!
contribute-more =
    { $count ->
        [one] Quere facer { $count } máis?
       *[other] Quere facer { $count } máis?
    }
speak-empty-state = Esgotamos as frases para gravar neste idioma
no-sentences-for-variants = É posible que a súa variedade de idioma non teña frases dispoñibles. Se quere, pode cambiar a súa configuración para ver outras frases no seu idioma.
speak-empty-state-cta = Propor novas frases
speak-loading-error =
    Non foi posible atopar ningunha frase para que lea.
    Por favor inténteo de novo máis tarde.
record-button-label = Grave a súa voz
share-title-new = <bold>Axúdenos</bold> a atopar máis voces
keep-track-profile = Faga o seguimento do seu avance cun perfil
login-to-get-started = Inicie sesión ou rexístrese para comezar
target-segment-first-card = Está a colaborar no noso primeiro segmento obxectivo
target-segment-generic-card = Está a contribuír a un segmento obxectivo
target-segment-first-banner = Axude a crear o primeiro segmento obxectivo de Common Voice en { $locale }
target-segment-add-voice = Engada a súa voz
target-segment-learn-more = Saber máis
change-preferences = Cambiar as preferencias

## Contribution Nav Items

contribute-voice-collection-nav-header = Recollida de voz
contribute-sentence-collection-nav-header = Recollida de frases

## Reporting

report = Informar
report-title = Enviar un informe
report-ask = Que problemas está experimentando con esta frase?
report-offensive-language = Linguaxe ofensiva
report-offensive-language-detail = A frase contén linguaxe irrespectuosa ou ofensiva
report-grammar-or-spelling = Erro gramatical/ortográfico
report-grammar-or-spelling-detail = A frase ten un erro gramatical ou ortográfico.
report-different-language = Idioma diferente
report-different-language-detail = Está escrito nun idioma diferente do que estou falando.
report-difficult-pronounce = Difícil de pronunciar
report-difficult-pronounce-detail = Contén palabras ou frases que son difíciles de ler ou pronunciar.
report-offensive-speech = Discurso ofensivo
report-offensive-speech-detail = O fragmento contén linguaxe irrespectuosa ou ofensiva.
report-other-comment =
    .placeholder = Comentar
success = Correcto
continue = Continuar
report-success = O informe foi aceptado

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = p

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = g
shortcut-record-toggle-label = Gravar/Parar
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Regravar fragmento
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Descartar a gravación en curso
shortcut-submit = Volver
shortcut-submit-label = Enviar fragmentos
request-language-text = Non atopa o seu idioma en Common Voice?
request-language-button = Solicitar un idioma

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = r
shortcut-play-toggle-label = Reproducir/Parar
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = s
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Criterios
contribution-criteria-link = Comprender os criterios de contribución
contribution-criteria-page-title = Criterios de contribución
contribution-criteria-page-description = Saiba o que debe buscar cando escoita fragmentos de voz e axude a que as súas gravacións de voz sexan tamén máis ricas.
contribution-for-example = por exemplo
contribution-misreadings-title = Erros de lectura
contribution-misreadings-description = Cando escoite, verifique con moito coidado se o que se gravou é exactamente o que aparece escrito e rexeite calquera incongruencia. <br />Algúns erros moi comúns son:
contribution-misreadings-description-extended-list-1 = Falta <strong>'Un'</strong> ou <strong>'O'</strong> no inico da gravación.
contribution-misreadings-description-extended-list-2 = Falta un <strong>s</strong> no final dunha palabra.
contribution-misreadings-description-extended-list-3 = Lectura de contraccións ou elisión que, en realidade, non están no texto, ou viceversa. Por exemplo, ler "de algún" no canto de "dalgún" ou "tar"  en lugar de "estar".
contribution-misreadings-description-extended-list-4 = Falta o final da última palabra por deter a gravación antes de acabar de falar.
contribution-misreadings-description-extended-list-5 = Titubeos ou varios intentos de ler unha palabra.
contribution-misreadings-example-1-title = Os dinosauros xigantes do Triásico.
contribution-misreadings-example-2-title = Os dinosauro xigantes do Triásico.
contribution-misreadings-example-2-explanation = [Debería ser 'dinosauros']
contribution-misreadings-example-3-title = Os dinosauros xigantes do Triási-.
contribution-misreadings-example-3-explanation = Detívose a gravación antes do final da última palabra.
contribution-misreadings-example-4-title = Os dinosauros xigantes do Triásico. Si.
contribution-misreadings-example-4-explanation = [Gravouse máis que o texto requirido]
contribution-misreadings-example-5-title = O caderno dalgún compañeiro.
contribution-misreadings-example-6-title = O caderno de algún compañeiro.
contribution-misreadings-example-6-explanation = [Debería ser "dalgún"]
contribution-misreadings-example-7-title = O caderno será dalgún compañeiro.
contribution-misreadings-example-7-explanation = [Non aparece 'será' no texto orixinal]
contribution-misreadings-example-8-title = A abella pasou rápido.
contribution-misreadings-example-8-explanation = [Contido non coincidente]
contribution-varying-pronunciations-title = Pronuncias diferentes
contribution-varying-pronunciations-description = Teña coidado antes de rexeitar un fragmento de voz debido a como está pronunciado. Queremos que as máquinas sexan quen de recoñecer a ampla variedade de pronuncias do galego. Deixe un lugar para as persoas que falan diferente a ti.
contribution-varying-pronunciations-description-extended = Por outra banda, se pensa que quen le probablemente descoñece a palabra e simplemente está facendo unha suposición sobre a súa pronuncia, rexeite o fragmento. Se ten dúbidas, use o botón de omitir.
contribution-varying-pronunciations-example-1-title = Había un gato enriba da cadeira.
contribution-varying-pronunciations-example-1-explanation = [É correcto pronunciar 'gato' e tamén 'ghato']
contribution-varying-pronunciations-example-2-title = Nós imos á festa mañá.
contribution-varying-pronunciations-example-2-explanation = [Cando 'nós' é pronome tónico, o 'o' sempre se pronuncia como aberto, non como pechado]
contribution-background-noise-title = Ruído de fondo
contribution-background-noise-description = Queremos que os algoritmos de aprendizaxe automática consigan manexar unha variedade de ruídos de fondo. Podemos aceptar ruídos relativamente altos, sempre que non impidan escoitar o texto completo. Por exemplo, a música de fondo tranquila está ben, pero unha música o suficientemente alta como para impedir escoitar todas e cada unha das palabras, non.
contribution-background-noise-description-extended = Se a gravación falla ou presenta estalos, rexéitea a non ser que aínda así se poida escoitar a totalidade do texto.
contribution-background-noise-example-1-fixed-title = <strong>[Esbirro]</strong> Os dinosauros xigantes do <strong>[tose]</strong> Triásico.
contribution-background-noise-example-2-fixed-title = Os dinosauros xig- <strong>[tose]</strong> do Triásico.
contribution-background-noise-example-2-explanation = [Non se escoita parte do texto]
contribution-background-noise-example-3-fixed-title = <strong>[Estalo]</strong> dinosauros xigantes do <strong>[estalo]</strong> -riásico.
contribution-background-voices-title = Voces de fondo
contribution-background-voices-description = Un leve barullo de fondo está ben, pero non queremos voces adicionais que poidan provocar que os algoritmos identifiquen palabras que non están no texto. Se pode escoitar palabras distintas ás do texto, debe rexeitar o fragmento. Normalmente, isto ocorre cando se deixa a televisión acesa ou cando varias persoas manteñen unha conversa preto.
contribution-background-voices-description-extended = Se a gravación falla ou presenta estalos, rexéitea a non ser que aínda así se poida escoitar a totalidade do texto.
contribution-background-voices-example-1-title = Os dinosauros xigantes do Triásico. <strong>[lido por unha soa voz]</strong>
contribution-background-voices-example-1-explanation = Vés de camiño? <strong>[dito por outra voz]</strong>
contribution-volume-title = Volume
contribution-volume-description = Existen variacións naturais de volume entre unhas persoas e outras. Rexeite soamente aqueles fragmentos nos que o volume é tan alto que fai fallar a gravación ou, máis comunmente, aqueloutros nos que é tan baixo que non permite percibir o que se di sen a referencia do texto escrito.
contribution-reader-effects-title = Efectos de lectura
contribution-reader-effects-description = Na maioría das gravacións, as persoas falan coa súa voz natural. Ocasionalmete, pódese aceptar unha gravación que está fóra da norma (berrada, murmuradada ou cunha voz "dramática"). Non obstante, débense rexeitar as gravacións cantadas e aquelas nas que se fai uso dunha voz sintetizada por ordenador.
contribution-just-unsure-title = Ten dúbidas?
contribution-just-unsure-description = Se atopa algo que non se trata nesta pequena guía, vote segundo o seu criterio. Se realmente non pode decidirse, use o botón de saltar e pase á seguinte gravación.
see-more = <chevron></chevron>Ver máis
see-less = <chevron></chevron>Ver menos
