action-click = Clicca sur
action-tap = Tocca
contribute = Contribuer
review = Revider
skip = Saltar
shortcuts = Accessos directe
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> registration
       *[other] <bold>{ $count }</bold> registrationes
    }
goal-help-recording = Tu ha adjutate Common Voice a attinger <goalPercentage></goalPercentage> de su objectivo quotidian de { $goalValue } registrationes!
goal-help-validation = Tu ha adjutate Common Voice a attinger <goalPercentage></goalPercentage> de su objectivo quotidian de { $goalValue } validationes!
contribute-more =
    { $count ->
        [one] Preste a facer { $count } plus?
       *[other] Preste a facer { $count } plus?
    }
speak-empty-state = Nos non ha plus phrases a registrar pro iste lingua...
no-sentences-for-variants = Tu variante de lingua poterea carer de phrases! Si tu vole, tu pote cambiar tu parametros pro vider altere phrases intra tu lingua.
speak-empty-state-cta = Contribue con altere phrases
speak-loading-error = Impossibile trovar alcun phrases a facer te pronunciar. Retenta plus tarde.
record-button-label = Registra tu voce
share-title-new = <bold>Adjuta nos</bold> a trovar plus voces
keep-track-profile = Tracia tu progresso con un profilo
login-to-get-started = Aperi session o inscribe te pro comenciar
target-segment-first-card = Tu ha contribuite a nostre prime segmento objectivo
target-segment-generic-card = Tu contribue a un segmento objectivo
target-segment-first-banner = Adjuta crear le prime segmento objectivo de Common Voice in { $locale }
target-segment-add-voice = Adde tu voce
target-segment-learn-more = Saper plus
change-preferences = Cambiar preferentias…

## Contribution Nav Items

contribute-voice-collection-nav-header = Collection de voces
contribute-sentence-collection-nav-header = Collection de phrases

## Reporting

report = Signalar
report-title = Invia un reporto
report-ask = Qual problemas ha tu con iste phrase?
report-offensive-language = Linguage offensive
report-offensive-language-detail = Le phrase usa un linguage irrespectuose o offensive.
report-grammar-or-spelling = Error grammatical o de orthographia
report-grammar-or-spelling-detail = Le phrase ha un error grammatical o de orthographia.
report-different-language = Altere lingua
report-different-language-detail = Es scribite in un lingua differente de illo que io parla.
report-difficult-pronounce = Difficile a pronunciar
report-difficult-pronounce-detail = Contine parolas o phrases difficile a leger o pronunciar.
report-offensive-speech = Discurso offensive
report-offensive-speech-detail = Le retalio contine linguage irrespectuose o offensive.
report-other-comment =
    .placeholder = Commento
success = Successo
continue = Continuar
report-success = Le reporto ha essite inviate, gratias!

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = Registrar/stoppar
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Re-registrar retalio
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Refusar le registration in curso
shortcut-submit = Inserer
shortcut-submit-label = Inviar registrationes
request-language-text = Non se trova tu lingua sur Common Voice?
request-language-button = Propone un lingua

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Reproducer/stoppar
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = R
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Criterios
contribution-criteria-link = Comprender le criterios de contribution
contribution-criteria-page-title = Criterios de contribution
contribution-criteria-page-description = Comprender a que prestar attention al ascolta de registrationes vocal e adjutar render tu registrationes vocal ancora plus ric!
contribution-for-example = per exemplo
contribution-misreadings-title = Errores de lectura
contribution-misreadings-description = Quando tu ascolta, controla multo accuratemente que lo que ha essite registrate es exactemente illo que ha essite scribite; rejecta lo si il ha mesmo errores minor. <br />Multo commun errores include:
contribution-misreadings-description-extended-list-1 = Carentia de <strong>'Un'</strong> o <strong>'Le'</strong> al initio del registration.
contribution-misreadings-description-extended-list-2 = Carente de un <strong>'s/es'</strong> al fin de un parola.
contribution-misreadings-description-extended-list-3 = Lectura de contractiones que non es realmente illac.
contribution-misreadings-description-extended-list-4 = Carentia del fin del ultime parola per secar le registration troppo rapidemente.
contribution-misreadings-description-extended-list-5 = Facer plure tentativas de leger un parola.
contribution-misreadings-example-1-title = Le gigantesc dinosauros del triassico.
contribution-misreadings-example-2-title = Le gigantesc dinosauro del triassico.
contribution-misreadings-example-2-explanation = [Debe esser ‘dinosauros’]
contribution-misreadings-example-3-title = Le gigantesc dinosauros del triassi-.
contribution-misreadings-example-3-explanation = [Truncamento de registration ante le fin del ultime parola]
contribution-misreadings-example-4-title = Le gigantesc dinosauros del triassico. Si.
contribution-misreadings-example-4-explanation = [Altero ha essite registrate que le texto necessari]
contribution-misreadings-example-5-title = Nos exi pro obtener caffe.
contribution-misreadings-example-6-title = [Debe esser “We are”]
contribution-misreadings-example-6-explanation = [Debe esser “We are”]
contribution-misreadings-example-7-title = Nos exi pro obtener un caffe.
contribution-misreadings-example-7-explanation = [Nulle ‘un’ in le texto original]
contribution-misreadings-example-8-title = Le bombo passava veloce.
contribution-misreadings-example-8-explanation = [Contento discorde]
contribution-varying-pronunciations-title = Pronunciationes variate
contribution-varying-pronunciations-description = Sia prudente ante rejectar un registration sur le base que le lector ha mal-pronunciate un parola, ha ponite le accento in le position errate o apparentemente ha ignorate un puncto de interrogation. Un large varietate de pronunciationes es usate in tote le mundo, parte del qual tu pote non haber audite in tu communitate local. Forni un margine de appreciation pro ille qui pote parlar differentemente de te.
contribution-varying-pronunciations-description-extended = Del altere latere, si tu pensa que le lector probabilemente non ha jammais incontrate le parola antea e que ille simplemente face un estimation incorrecte del pronunciation, per favor rejecta lo. Si tu non es secur, usa le button saltar.
contribution-varying-pronunciations-example-1-title = Le puero usava un cappello.
contribution-varying-pronunciations-example-1-explanation = [In interlingua le duple litteras de "cappello" pote esser pronunciate como singule]
contribution-varying-pronunciations-example-2-title = Nos a multe tempore.
contribution-varying-pronunciations-example-2-explanation = ["Nos ha" le 'ha' debe esser aspirate]
contribution-background-noise-title = Rumor de fundo
contribution-background-noise-description = Nos vole que le algorithmos de apprendimento automatic pote tractar un varietate de rumor de fundo, e mesmo relativemente alte rumores pote esser acceptate a condition que illos non te impedi de audir le totalitate del texto. Quiete musica de fundo es OK; musica alte bastante a te impedir de audir cata parola, non es.
contribution-background-noise-description-extended = Si le registration se interrumpe o ha crepitationes, rejecta lo a minus que le totalitate del texto pote ancora esser audite.
contribution-background-noise-example-1-fixed-title = <strong>[Sternuta]</strong> Le gigantesc dinosauros del <strong>[tusse]</strong> Trias.
contribution-background-noise-example-2-fixed-title = Le gigantesc dino <strong>[tusse]</strong> le trias.
contribution-background-noise-example-2-explanation = [Parte del texto non pote esser audite]
contribution-background-noise-example-3-fixed-title = <strong>[Crepitation]</strong> gigantesc dinosauros de <strong>[crepitation]</strong> -rias.
contribution-background-voices-title = Voces de fundo
contribution-background-voices-description = Un quiete murmuration de fundo es OK, ma nos non vole altere voces que pote causar al algorithmo de machina de identificar parolas que non es in le texto scribite. Si tu pote audir parolas distincte a parte de illos del texto, le registration debe esser rejectate. Typicamente isto eveni ubi le TV ha essite lassate active o ubi il ha un conversation vicin.
contribution-background-voices-description-extended = Si le registration se interrumpe o ha crepitationes, rejecta lo a minus que le totalitate del texto pote ancora esser audite.
contribution-background-voices-example-1-title = Le gigantesc dinosauros del triassico. <strong>[legite per un voce]</strong>
contribution-background-voices-example-1-explanation = Esque tu veni?
contribution-volume-title = Volumine
contribution-volume-description = Il sera natural variationes in volumine inter lectores. Rejecta solo si le volumine es assi alte que le registration se interrumpe, o (plus communmente) si illo es assi basse que tu non pote audir lo que es dicite sin referentia al texto scribite.
contribution-reader-effects-title = Effectos del lector
contribution-reader-effects-description = Le major parte del registrationes es de personas qui parla in lor natural voce. Tu pote acceptar le occasional registration non-standard que es critate, susurrate, o obviemente fornite in un voce ‘dramatic’. Per favor rejecta registrationes cantate e illos que usa un voce synthetisate per computator.
contribution-just-unsure-title = Ha tu dubitas?
contribution-just-unsure-description = Si tu ha incontrate qualcosa que iste lineas guida non coperi, per favor vota in accordo a tu melior judicio. Si tu realmente non pote decider, usa le button saltar e va al sequente registration.
see-more = <chevron></chevron>Vider plus
see-less = <chevron></chevron>Vider minus
