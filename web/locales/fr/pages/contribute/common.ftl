## Contribution

action-click = Cliquez sur
action-tap = Appuyez sur
## Languages

contribute = Contribuer
review = Vérifier
skip = Passer
shortcuts = Raccourcis
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> extrait
       *[other] <bold>{ $count }</bold> extraits
    }
goal-help-recording = Grâce à vous, Common Voice a atteint <goalPercentage></goalPercentage> de son objectif quotidien de { $goalValue } enregistrements !
goal-help-validation = Grâce à vous, Common Voice a atteint <goalPercentage></goalPercentage> de son objectif quotidien de { $goalValue } validations !
contribute-more = Prêt·e à en faire { $count } de plus ?
speak-empty-state = Nous n’avons plus de phrases à enregistrer dans cette langue…
no-sentences-for-variants = Votre variante linguistique est peut-être à court de phrases ! Si vous êtes à l’aise, vous pouvez modifier vos paramètres pour afficher d’autres phrases dans votre langue.
speak-empty-state-cta = Proposer des phrases
speak-loading-error =
    Nous n’avons pas pu obtenir de phrases à prononcer.
    Veuillez réessayer plus tard.
record-button-label = Enregistrer votre voix
share-title-new = <bold>Aidez-nous</bold> à trouver de nouvelles voix
keep-track-profile = Mesurez votre progression en créant un profil
login-to-get-started = Connectez-vous ou inscrivez-vous pour commencer
target-segment-first-card = Vous contribuez à notre premier segment cible
target-segment-generic-card = Vous contribuez à un segment cible
target-segment-first-banner = Aidez à créer le premier segment cible de Common Voice en { $locale }
target-segment-add-voice = Donner de votre voix
target-segment-learn-more = En savoir plus
change-preferences = Modifier les préférences

## Contribution Nav Items

contribute-voice-collection-nav-header = Collecte de voix
contribute-sentence-collection-nav-header = Collecte de phrases

## Reporting

report = Signaler
report-title = Envoyer un rapport
report-ask = Quels problèmes rencontrez-vous avec cette phrase ?
report-offensive-language = Langage grossier
report-offensive-language-detail = La phrase comporte des propos irrespectueux ou insultants.
report-grammar-or-spelling = Erreur grammaticale / faute d’orthographe
report-grammar-or-spelling-detail = La phrase comporte une faute de grammaire ou d’orthographe.
report-different-language = Autre langue
report-different-language-detail = La phrase est écrite dans une langue différente de celle que je parle.
report-difficult-pronounce = Difficile à prononcer
report-difficult-pronounce-detail = Certains mots ou certaines phrases sont difficiles à lire ou à prononcer.
report-offensive-speech = Propos offensants
report-offensive-speech-detail = L’échantillon audio comporte des propos irrespectueux ou insultants.
report-other-comment =
    .placeholder = Commentaire
success = Opération réussie
continue = Continuer
report-success = Le rapport a été correctement envoyé

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = a

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = e
shortcut-record-toggle-label = Enregistrer/Arrêter
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = Refaire l’enregistrement
shortcut-discard-ongoing-recording = Échap
shortcut-discard-ongoing-recording-label = Ignorer l’enregistrement en cours
shortcut-submit = Entrée
shortcut-submit-label = Envoyer les enregistrements
request-language-text = Votre langue n’est pas encore disponible ?
request-language-button = Proposer une langue

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = Lire/Arrêter
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = o
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = Critères
contribution-criteria-link = Comprendre les critères de contribution
contribution-criteria-page-title = Critères de contribution
contribution-criteria-page-description = Comprenez ce à quoi il faut prêter attention lors de l’écoute d’échantillons vocaux et enrichissez même vos propres enregistrements !
contribution-for-example = par exemple
contribution-misreadings-title = Erreurs de lecture
contribution-misreadings-description = Lors de l’écoute, vérifiez très attentivement que ce qui a été enregistré correspond exactement à ce qui est écrit ; rejetez même s’il y a des erreurs mineures. <br />Voici les erreurs les plus courantes :
contribution-misreadings-description-extended-list-1 = Il manque <strong>« Un/Une »</strong> ou <strong>« Le/La »</strong> au début de l’enregistrement.
contribution-misreadings-description-extended-list-2 = Il manque un <strong>« s »</strong> à la fin d’un mot.
contribution-misreadings-description-extended-list-3 = Des contractions inexistantes sont lues, telles que « surment » au lieu de « surement ».
contribution-misreadings-description-extended-list-4 = La fin du dernier mot est coupée, car l’enregistrement a été arrêté trop vite.
contribution-misreadings-description-extended-list-5 = Faire plusieurs tentatives pour lire un mot.
contribution-misreadings-example-1-title = Les dinosaures géants du Trias.
contribution-misreadings-example-2-title = Le dinosaure géant du Trias.
contribution-misreadings-example-2-explanation = [Devrait être « Les » dinosaures]
contribution-misreadings-example-3-title = Les dinosaures géants du Tria-.
contribution-misreadings-example-3-explanation = [Enregistrement coupé avant la fin du dernier mot]
contribution-misreadings-example-4-title = Les dinosaures géants du Trias. Oui.
contribution-misreadings-example-4-explanation = [Plus que le texte requis a été enregistré]
contribution-misreadings-example-5-title = Surement, il fera beau.
contribution-misreadings-example-6-title = Surment, il fera beau.
contribution-misreadings-example-6-explanation = [Devrait être « surement »]
contribution-misreadings-example-7-title = Surement, il y fera beau.
contribution-misreadings-example-7-explanation = [Pas de « y » dans le texte original]
contribution-misreadings-example-8-title = Le bourdon a filé.
contribution-misreadings-example-8-explanation = [Contenu sans rapport]
contribution-varying-pronunciations-title = Prononciations différentes
contribution-varying-pronunciations-description = Faites attention avant de rejeter un échantillon au motif que le lecteur ou la lectrice semble avoir mal prononcé un mot ou certaines paires de voyelles, ou semble avoir ignoré un point d’interrogation. Il existe une grande variété de prononciations utilisées dans le monde, dont certaines que vous n’avez peut-être pas entendues dans votre région. Veuillez prévoir une marge d’appréciation pour les personnes qui peuvent parler différemment de vous.
contribution-varying-pronunciations-description-extended = En revanche, si vous pensez que le lecteur ou la lectrice n’a jamais rencontré le mot auparavant et qu’il ou elle tente simplement de deviner la bonne prononciation, veuillez rejeter l’enregistrement. Dans le doute, utilisez le bouton Passer.
contribution-varying-pronunciations-example-1-title = La locomotive tirait plusieurs wagons.
contribution-varying-pronunciations-example-1-explanation = [La prononciation de « Wagon » est correcte que vous entendiez « Vagon » (FR) ou « Ouagon » (BE)]
contribution-varying-pronunciations-example-2-title = Le sandwich jambon beurre
contribution-varying-pronunciations-example-2-explanation = [« sandwich » en français se prononce comme un mot, pas deux]
contribution-background-noise-title = Bruits de fond
contribution-background-noise-description = Il est souhaitable que les algorithmes d’apprentissage automatique soient capables de gérer une variété de bruits de fond. Même des bruits relativement forts peuvent être acceptés à condition qu’ils ne vous empêchent pas d’entendre l’intégralité du texte. Une musique de fond calme est aussi acceptable, mais une musique assez forte pour vous empêcher d’entendre chaque mot ne l’est pas.
contribution-background-noise-description-extended = Si l’enregistrement est haché ou contient des craquements, rejetez-le à moins que l’intégralité du texte ne soit intelligible.
contribution-background-noise-example-1-fixed-title = <strong>[ Reniflement ]</strong> Les dinosaures géants du <strong>[ toux ]</strong> Trias.
contribution-background-noise-example-2-fixed-title = Le dinosaure géant <strong>[ toux ]</strong> le Trias.
contribution-background-noise-example-2-explanation = [Une partie du texte ne peut pas être entendue]
contribution-background-noise-example-3-fixed-title = <strong>[ Craquement ]</strong> dinosaures géants du <strong>[ Craquement ]</strong> -rias.
contribution-background-voices-title = Voix en arrière-plan
contribution-background-voices-description = Un faible brouhaha de fond est acceptable, mais il ne doit pas y avoir de voix supplémentaires qui pourraient amener un algorithme machine à identifier des mots qui ne figurent pas dans le texte écrit. Si vous pouvez entendre des mots distincts de ceux du texte, l’enregistrement doit être rejeté. Cela se produit généralement lorsqu’un téléviseur a été laissé allumé ou lorsqu’une conversation a lieu à proximité.
contribution-background-voices-description-extended = Si l’enregistrement est haché ou contient des craquements, rejetez-le à moins que l’intégralité du texte ne soit intelligible.
contribution-background-voices-example-1-title = Les dinosaures géants du Trias. <strong>[lu par une première voix]</strong>
contribution-background-voices-example-1-explanation = Tu viens ? <strong>[prononcé par une autre voix]</strong>
contribution-volume-title = Volume
contribution-volume-description = Il y a des variations naturelles de volume entre les lecteurs et lectrices. Ne rejetez que si le volume est si élevé que l’enregistrement est haché, ou (plus communément) s’il est si bas que vous ne pouvez pas entendre ce qui est dit sans référence au texte écrit.
contribution-reader-effects-title = Intonations et effets sonores
contribution-reader-effects-description = Dans la plupart des enregistrements les personnes parlent avec leur voix naturelle. Vous pouvez accepter occasionnellement un enregistrement non standard crié, chuchoté ou clairement prononcé avec une voix « théâtrale ». Veuillez rejeter les enregistrements chantés et ceux utilisant une voix synthétisée par ordinateur.
contribution-just-unsure-title = Vous hésitez ?
contribution-just-unsure-description = Si vous rencontrez une situation que ces consignes ne couvrent pas, veuillez voter en faisant appel à votre bon sens. Si vous n’arrivez vraiment pas à vous décider, utilisez le bouton « Passer » et passez à l’enregistrement suivant.
see-more = <chevron></chevron>Afficher plus d’exemples
see-less = <chevron></chevron>Afficher moins d’exemples

