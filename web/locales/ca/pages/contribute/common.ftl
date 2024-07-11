action-click = Feu clic a
action-tap = Toqueu
contribute = Col·laboreu‑hi
review = Revisa
skip = Omet
shortcuts = Dreceres
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> tall
       *[other] <bold>{ $count }</bold> talls
    }
goal-help-recording = Heu ajudat el Common Voice a assolir el <goalPercentage></goalPercentage> de l'objectiu diari de { $goalValue } enregistraments!
goal-help-validation = Heu ajudat el Common Voice a assolir el <goalPercentage></goalPercentage> de l'objectiu diari de { $goalValue } validacions!
contribute-more =
    { $count ->
        [one] A punt per a fer-ne { $count } més?
       *[other] A punt per a fer-ne { $count } més?
    }
speak-empty-state = No hi ha cap més frase per enregistrar en aquesta llengua...
speak-empty-state-cta = Aporteu frases
speak-loading-error =
    No hem pogut carregar les oracions.
    Si us plau, torneu a intentar-ho més tard.
record-button-label = Enregistreu la vostra veu
share-title-new = <bold>Ajudeu-nos</bold> a trobar més veus
keep-track-profile = Feu seguiment del vostre progrés amb un perfil
login-to-get-started = Inicieu sessió o creeu un compte per començar
target-segment-first-card = Esteu col·laborant en el nostre primer segment objectiu
target-segment-generic-card = Esteu col·laborant en un segment objectiu
target-segment-first-banner = Ajudeu a assolir el primer segment objectiu del Common Voice en { $locale }
target-segment-add-voice = Afegiu la vostra veu
target-segment-learn-more = Més informació

## Contribution Nav Items

contribute-voice-collection-nav-header = Recollida de veus
contribute-sentence-collection-nav-header = Recollida de frases

## Reporting

report = Informa
report-title = Envieu un informe
report-ask = Quin problema teniu amb aquesta frase?
report-offensive-language = Llenguatge ofensiu
report-offensive-language-detail = La frase té un llenguatge ofensiu o irrespectuós.
report-grammar-or-spelling = Error gramatical / ortogràfic
report-grammar-or-spelling-detail = La frase té un error gramatical o ortogràfic.
report-different-language = Una altra llengua
report-different-language-detail = Està escrita en una llengua diferent de la que parlo.
report-difficult-pronounce = Difícil de pronunciar
report-difficult-pronounce-detail = Conté paraules o frases difícils de llegir o de pronunciar.
report-offensive-speech = Àudio ofensiu
report-offensive-speech-detail = El tall té un llenguatge ofensiu o irrespectuós.
report-other-comment =
    .placeholder = Comentari
success = Correcte
continue = Continua
report-success = L'informe s'ha enviat correctament

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = o

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = e
shortcut-record-toggle-label = Enregistra/atura
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Torna a enregistrar el tall
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = Descarta l'enregistrament en curs
shortcut-submit = Retorn
shortcut-submit-label = Envia els talls
request-language-text = No trobeu la vostra llengua al Common Voice?
request-language-button = Sol·licita una llengua

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = r
shortcut-play-toggle-label = Reprodueix/atura
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = s
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Criteris
contribution-criteria-link = Compreneu els criteris de col·laboració
contribution-criteria-page-title = Criteris de col·laboració
contribution-criteria-page-description = Compreneu què cal cercar quan escolteu talls de veu, i ajudeu que els vostres enregistraments de veu també siguin més enriquits.
contribution-for-example = per exemple
contribution-misreadings-title = Lectures errònies
contribution-misreadings-description = En escoltar, comproveu amb molta cura que el que s’ha enregistrat és exactament el que hi ha escrit; rebutgeu el tall fins i tot si hi ha errors menors. <br />Els errors més habituals són:
contribution-misreadings-description-extended-list-1 = Canviar una paraula per una altra de semblant. Per exemple, <strong>«a»</strong>, <strong>«en»</strong> o <strong>«amb»</strong>.
contribution-misreadings-description-extended-list-2 = Canviar alguna forma verbal. Per exemple, fer «cantéssim» en comptes de «cantessin».
contribution-misreadings-description-extended-list-3 = Fer contraccions o elisions que no es troben en el text, o viceversa. Per exemple, fer «el oncle» en comptes de «l'oncle», o fer «'nant» en comptes d'«anant».
contribution-misreadings-description-extended-list-4 = Ometre el final de l'última paraula, en tallar l'enregistrament massa ràpid.
contribution-misreadings-description-extended-list-5 = Fer múltiples intents per a llegir una paraula.
contribution-misreadings-example-1-title = Els grans dinosaures del Triàsic.
contribution-misreadings-example-2-title = Els grans dinosaure del Triàsic.
contribution-misreadings-example-2-explanation = [Hauria de ser «dinosaures»]
contribution-misreadings-example-3-title = Els grans dinosaures del Triàsi-.
contribution-misreadings-example-3-explanation = [Tall d'enregistrament abans del final de l'última paraula]
contribution-misreadings-example-4-title = Els grans dinosaures del Triàsic. Sí.
contribution-misreadings-example-4-explanation = [S'han enregistrat més paraules de les indicades en el text]
contribution-misreadings-example-5-title = Anem en tren a Tarragona.
contribution-misreadings-example-6-title = 'Nem en tren a Tarragona.
contribution-misreadings-example-6-explanation = [Hauria de ser «Anem»]
contribution-misreadings-example-7-title = Anem amb tren a Tarragona.
contribution-misreadings-example-7-explanation = [El text original indica «en»]
contribution-misreadings-example-8-title = Un elefant va matar una aranya.
contribution-misreadings-example-8-explanation = [El contingut no coincideix]
contribution-varying-pronunciations-title = Pronunciacions variables
contribution-varying-pronunciations-description = Tingueu cura abans de rebutjar un tall perquè el lector ha pronunciat malament una paraula. El català té una àmplia varietat de pronúncies, i potser no les heu sentit mai. No es pronuncia igual en català central, balear, valencià o septentrional. Feu confiança a aquells que parlen d’una manera diferent de la vostra.
contribution-varying-pronunciations-description-extended = D'altra banda, si creieu que probablement el lector no s'ha trobat mai amb la paraula i simplement fa una suposició incorrecta de la pronúncia, rebutgeu el tall. Si no n'esteu segur, utilitzeu el botó Omet.
contribution-varying-pronunciations-example-1-title = Ells mengen peres.
contribution-varying-pronunciations-example-1-explanation = [«peres» es pot pronunciar de diferents maneres, segons la variant dialectal]
contribution-varying-pronunciations-example-2-title = Ha fixat la data.
contribution-varying-pronunciations-example-2-explanation = [En català, «fixat» sempre es pronuncia de la mateixa manera]
contribution-background-noise-title = Soroll de fons
contribution-background-noise-description = Volem que els algoritmes d’aprenentatge automàtic siguin capaços de manejar diversos sorolls de fons. Es poden acceptar sorolls relativament forts, sempre que no impedeixin escoltar la totalitat del text. La música de fons tranquil·la està bé; la música prou forta, que eviti que sentiu totes les paraules, no ho és.
contribution-background-noise-description-extended = Si l'enregistrament es talla, o fa espetecs, rebutgeu-lo. Llevat que es pugui sentir la totalitat del text.
contribution-background-noise-example-1-fixed-title = <strong>[esternut]</strong> Els grans dinosaures del <strong>< tos ></strong> Triàsic.
contribution-background-noise-example-2-fixed-title = Els grans dino <strong>[tos]</strong> del Triàsic.
contribution-background-noise-example-2-explanation = [No se sent part del text]
contribution-background-noise-example-3-fixed-title = <strong>[espetec]</strong> grans dinosaures de <strong>[espetec]</strong> -riàsic.
contribution-background-voices-title = Veus de fons
contribution-background-voices-description = Un soroll de fons tranquil està bé, però no volem que hi hagi veus addicionals que puguin fer que un algoritme informàtic identifiqui paraules que no apareixen en el text escrit. Si podeu sentir paraules diferents a part de les del text, s'hauria de rebutjar el tall. Normalment, això passa si s'ha deixat el televisor encès o si hi ha una conversa a prop.
contribution-background-voices-description-extended = Si l'enregistrament es talla, o fa espetecs, rebutgeu-lo. Llevat que se senti la totalitat del text.
contribution-background-voices-example-1-title = Els grans dinosaures del Triàsic. <strong>[llegit per una veu]</strong>
contribution-background-voices-example-1-explanation = Que vens? <strong>[cridat per algú altre]</strong>
contribution-volume-title = Volum
contribution-volume-description = Habitualment hi ha variacions en el volum entre lectors. Rebutgeu un tall només si el volum és tan alt que l'enregistrament s'entretalla, o (més habitual) si és tan baix que no podeu sentir que s'hi diu sense la referència del text escrit.
contribution-reader-effects-title = Efectes de lectura
contribution-reader-effects-description = La majoria dels enregistraments són de gent que parla amb naturalitat. Podeu acceptar la gravació ocasional no estàndard on es cridi, xiuxiuegi o, òbviament, es faci amb veu dramatitzada. Rebutgeu els enregistraments cantats, on s'usi una veu sintetitzada per ordinador o els que no tinguin una entonació correcta de la frase, especialment les interrogatives.
contribution-just-unsure-title = Teniu dubtes?
contribution-just-unsure-description = Si us trobeu amb alguna cosa que aquestes directrius no cobreixen, voteu segons el vostre criteri. Si realment no ho podeu decidir, feu servir el botó Omet i passeu a l'enregistrament següent.
see-more = <chevron></chevron>Més
see-less = <chevron></chevron>Menys
