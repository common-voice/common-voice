## General

yes-receive-emails = Oui, envoyez-moi des courriers électroniques. Je souhaite recevoir l’actualité du projet Common Voice.
stayintouch = Chez Mozilla, nous rassemblons une communauté autour des technologies vocales. Nous aimerions rester en contact avec vous pour vous tenir au courant des nouveautés, des nouvelles sources de données et aussi pour découvrir comment vous utilisez ces données.
privacy-info = Nous vous promettons de prendre soin de vos données. Apprenez-en davantage en consultant notre <privacyLink>Politique de confidentialité</privacyLink>.
return-to-cv = Retourner vers Common Voice
email-input =
    .label = Adresse électronique
submit-form-action = Envoyer
loading = Chargement…

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

an = Aragonais
ar = Arabe
as = Assamais
ast = Asturien
az = Azerbaïdjanais
bn = Bengali
br = Breton
bxr = Bouriate
ca = Catalan
cak = Cakchiquel
cnh = Hakha Chin
cs = Tchèque
cv = Tchouvache
cy = Gallois
da = Danois
de = Allemand
dsb = Bas-sorabe
el = Grec
en = Anglais
eo = Espéranto
es = Espagnol
et = Estonien
fi = Finnois
fo = Féroïen
fr = Français
fy-NL = Frison
ga-IE = Irlandais
he = Hébreu
hsb = Haut-sorabe
hu = Hongrois
ia = Interlingua
id = Indonésien
is = Islandais
it = Italien
ja = Japonais
ka = Géorgien
kab = Kabyle
kk = Kazakh
ko = Coréen
kpv = Komi-zyriène
kw = Cornique
ky = Kirghize
mk = Macédonien
myv = Erzya
nb-NO = Norvégien bokmål
ne-NP = Népalais
nl = Néerlandais
nn-NO = Norvégien nynorsk
or = Odia
pl = Polonais
pt-BR = Portugais (Brésil)
rm = Romanche
ro = Roumain
ru = Russe
sah = Iakoute
sk = Slovaque
sl = Slovène
sq = Albanais
sr = Serbe
sv-SE = Suédois
ta = Tamoul
te = Télougou
th = Thaï
tr = Turc
tt = Tatar
uk = Ukrainien
ur = Ourdou
uz = Ouzbek
zh-CN = Chinois (Chine)
zh-HK = Chinois (Hong-Kong)
zh-TW = Chinois (Taïwan)

# [/]


## Layout

speak = Parler
speak-now = Parler
datasets = Jeux de données
languages = Langues
profile = Profil
help = Aide
contact = Nous contacter
privacy = Vie privée
terms = Conditions
cookies = Cookies
faq = Questions fréquentes
content-license-text = Contenu disponible sous licence <licenseLink>Creative Commons</licenseLink>
share-title = Aidez-nous à collecter davantage de voix !
share-text = Aidez les machines à apprendre à parler comme de vraies personnes en donnant votre voix sur { $link }
link-copied = Lien copié
back-top = Haut de la page
contribution-banner-text = Nous avons ajouté une toute nouvelle façon de contribuer
contribution-banner-button = L’essayer
report-bugs-link = Signaler des problèmes

## Home Page

home-title = Le projet Common Voice est une initiative de Mozilla pour aider à apprendre aux machines à parler comme tout un chacun.
home-cta = Faites don de votre voix, contribuez ici !
wall-of-text-start = La voix est naturelle, la voix est humaine. C’est pour cela que nous souhaitons créer des technologies vocales de qualité pour nos machines. Mais réaliser de tels systèmes requiert un gigantesque volume de données vocales.
wall-of-text-more-mobile = La plupart des données utilisées par les grandes sociétés ne sont pas mises à la disposition de monsieur ou madame Tout-le-monde. Nous pensons que cela freine l’innovation. C’est pour cela que le projet Common Voice existe, c’est un projet qui facilite l’accès à la reconnaissance vocale, pour tout le monde.
wall-of-text-more-desktop =
    Vous pouvez donner un peu de votre voix pour nous aider à créer une base de données libre, utilisable par n’importe qui pour réaliser des applications innovantes, y compris sur le Web.<lineBreak></lineBreak>
    Lisez une phrase pour aider les machines à apprendre la façon de parler des êtres humains. Écoutez les enregistrements que d’autres ont réalisés pour les valider et ainsi améliorer la qualité des données. C’est aussi simple que ça !
show-wall-of-text = En savoir plus
help-us-title = Aidez-nous à valider des phrases !
help-us-explain = Appuyez sur lecture, écoutez et dites-nous : la phrase ci-dessous est-elle prononcée correctement ?
no-clips-to-validate = Il semblerait qu’il n’y ait aucun enregistrement à écouter dans cette langue. Aidez-nous à en créer quelques-uns !
vote-yes = Oui
vote-no = Non
toggle-play-tooltip = Appuyez sur { shortcut-play-toggle } pour lancer ou arrêter la lecture

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = a

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

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = e
shortcut-record-toggle-label = Enregistrer/Arrêter
request-language-text = Votre langue n’est pas encore disponible ?
request-language-button = Proposer une langue

## ProjectStatus

status-title = État global du projet : découvrez nos progrès !
status-contribute = Faites don de votre voix
status-hours =
    { $hours ->
        [one] Déjà une heure validée !
       *[other] Déjà { $hours } heures validées !
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Prochain objectif : { $goal }
english = Anglais

## ProfileForm

profile-form-cancel = Quitter le formulaire
profile-form-delete = Supprimer le profil
profile-form-username =
    .label = Nom d’utilisateur
profile-form-language =
    .label = Langue
profile-form-accent =
    .label = Accent
profile-form-age =
    .label = Âge
profile-form-gender =
    .label = Sexe
profile-form-submit-save = Enregistrer
profile-form-submit-saved = Enregistrer
profile-keep-data = Conserver les données
profile-delete-data = Supprimer les données
male = Masculin
female = Féminin
# Gender
other = Autre
why-profile-title = Pourquoi créer un profil ?
why-profile-text = Les informations que vous fournissez à votre sujet rendent plus utiles les données audio que vous envoyez à Common Voice. Les moteurs de reconnaissance vocale utilisent ces données pour améliorer leur précision.
edit-profile = Modifier le profil
profile-create = Créer un profil
profile-create-success = Bravo, votre profil est créé !
profile-close = Fermer
profile-clear-modal = Si vous effacez les données de votre profil, ces informations démographiques ne seront plus transmises à Common Voice avec vos enregistrements sonores.
profile-explanation = Gardez un œil sur votre progression en créant un profil et aidez-nous à rendre nos données vocales plus précises.

## FAQ

faq-title = Questions fréquentes
faq-what-q = Qu’est-ce que Common Voice ?
faq-what-a = Les technologies de reconnaissance vocale pourraient révolutionner nos interactions avec les machines, mais les systèmes disponibles à l’heure actuelle sont coûteux et propriétaires. Common Voice est un projet visant à rendre accessible à quiconque ce type de technologie. Les contributeurs partagent leurs voix dans une énorme base de données qui permettra à n’importe qui de rapidement et facilement réaliser des applications utilisant la voix. Toutes les données vocales seront mises à disposition des développeurs.
faq-important-q = Pourquoi est-ce important ?
faq-important-a = La voix est naturelle, elle est humaine. C’est notre manière la plus simple et naturelle de communiquer. Nous voulons que les développeurs soient en mesure de mener à bien de fabuleux projets, qu’il s’agisse de traducteurs en temps réel ou d’assistants administratifs. Mais à l’heure actuelle, il n’y a pas assez de données accessibles publiquement pour pouvoir réaliser ces types d’applications. Nous espérons que Common Voice donnera aux développeurs ce dont ils ont besoin pour innover.
faq-get-q = Comment puis-je obtenir les données de Common Voice ?
faq-get-a = Le jeu de données est disponible sur notre <downloadLink>page de téléchargements</downloadLink> sous licence <licenseLink>CC-0</licenseLink>.
faq-mission-q = En quoi le projet Common Voice fait-il partie de la mission de Mozilla ?
faq-mission-a = Mozilla a pour vocation de conserver le Web ouvert et accessible à tout le monde. Pour y parvenir, nous devons doter les créateurs d’outils comme Common Voice. Les technologies vocales prolifèrent maintenant au-delà de certaines niches, et nous pensons qu’elles doivent être équitablement utilisables. Nous voyons un besoin d’inclure plus de langues, d’accents et de tranches d’âge pour la création et le test des technologies vocales. Mozilla veut un Internet actif, en bonne santé. Cela implique de donner accès, aux créateurs sur le Web, à des données vocales qu’ils peuvent utiliser pour de nouveaux projets. Common Voice deviendra une ressource publique qui aidera les équipes de Mozilla et les développeurs du monde entier.
faq-native-q = Je parle { $lang }, mais ce n’est pas ma langue maternelle et j’ai un accent, ma voix est-elle utile ?
faq-native-a = Absolument, nous avons besoin de votre voix ! Une partie des objectifs de Common Voice est de collecter autant d’accents que possible pour que les machines puissent mieux interpréter la voix de <bold>tout le monde</bold>.
faq-firefox-q = La synthèse vocale fera-t-elle un jour partie de Firefox grâce à Common Voice ?
faq-firefox-a = Common Voice a un potentiel illimité et nous étudions l’utilisation d’interfaces vocales au sein de nombreux logiciels Mozilla, dont Firefox.
faq-quality-q = Quel est le niveau de qualité audio requis ?
faq-quality-a = Nous voulons une qualité audio qui corresponde à ce qu’un moteur de reconnaissance vocale devra affronter dans la vie courante. Nous avons donc besoin de variété. Cela entraîne le moteur à prendre correctement en compte différentes situations : des discussions en arrière-plan, des bruits de moteurs ou des bruits de ventilateurs.
faq-hours-q = Pourquoi l’objectif de collecte de son est-il fixé à 10 000 heures ?
faq-hours-a = C’est à peu près la quantité de données nécessaire pour être en mesure de produire un système de reconnaissance vocale de qualité.
faq-source-q = Quelle est la provenance des textes ?
faq-source-a1 = Les phrases actuelles proviennent de contributions individuelles ainsi que des dialogues de certains films dans le domaine public comme <italic>La vie est belle</italic>.
faq-source-a2 = Les phrases sources sont accessibles <dataLink>dans ce dossier</dataLink> sur GitHub.

## Profile

profile-why-title = Pourquoi créer un profil ?
profile-why-content = En nous communiquant quelques informations à votre sujet, les données audio que vous partagez avec Common Voice seront plus utiles pour les moteurs de reconnaissance vocale, qui les utilisent afin d’améliorer leur précision.

## NotFound

notfound-title = Introuvable
notfound-content = J’ai bien peur de ne pas savoir ce que vous recherchez.

## Data

data-download-button = Télécharger les données Common Voice
data-download-yes = Oui
data-download-deny = Non
data-download-license = Licence : <licenseLink>CC-0</licenseLink>
data-download-modal = Vous vous apprêtez à télécharger <size>{ $size } Go</size>, voulez-vous continuer ?
data-subtitle = Nous créons un jeu de données de voix ouvert et publiquement accessible, que tout le monde peut utiliser pour réaliser des applications utilisant la voix.
data-explanatory-text = Nous pensons que d’importants jeux de données publiquement accessibles favorisent l’innovation et participent à la mise en place d’une concurrence saine pour les technologies vocales utilisant l’apprentissage machine. C’est un effort mondial et nous invitons tout le monde à y prendre part. Notre objectif est que les technologies vocales soient plus inclusives et qu’elles puissent refléter la diversité des voix du monde entier.
data-get-started = <speechBlogLink>S’initier à la reconnaissance vocale</speechBlogLink>
data-other-title = Autres jeux de données…
data-other-goto = Voir { $name }
data-other-download = Télécharger les données
data-other-librispeech-description = LibriSpeech est un corpus d’environ 1000 heures de lecture en anglais (16 kHz) issu de livres audio du projet LibriVox.
data-other-ted-name = Corpus TED-LIUM
data-other-ted-description = Le corpus TED-LIUM est construit à partir des dialogues audio et de leurs transcriptions disponibles sur le site TED.
data-other-voxforge-description = VoxForge a été construit pour collecter des transcriptions vocales pour les utiliser dans des moteurs de reconnaissance vocale libres.
data-other-tatoeba-description = Tatoeba est une immense base de données de phrases, de traductions et d’extraits audio destinés à l’apprentissage des langues. Ce téléchargement contient toutes les données en anglais enregistrées par leur communauté.
data-bundle-button = Télécharger un lot de jeux de données
data-bundle-description = Données Common Voice ainsi que tous les autres jeux de données ci-dessus.
license = Licence : <licenseLink>{ $license }</licenseLink>
license-mixed = Mixte

## Record Page

record-platform-not-supported = Nous sommes désolés, mais votre plateforme n’est pas encore prise en charge.
record-platform-not-supported-desktop = Pour les ordinateurs de bureau, vous pouvez télécharger le plus récent :
record-platform-not-supported-ios = Les utilisateurs <bold>iOS</bold> peuvent télécharger notre application gratuite :
record-must-allow-microphone = Vous devez autoriser l’accès au microphone.
record-retry = Réessayer
record-no-mic-found = Aucun microphone trouvé.
record-error-too-short = L’enregistrement est trop court.
record-error-too-long = L’enregistrement est trop long.
record-error-too-quiet = Le volume de l’enregistrement est trop faible.
record-submit-success = Envoi réussi ! Voulez-vous effectuer un nouvel enregistrement ?
record-help = Appuyez pour enregistrer, puis lisez la phrase ci-dessus à haute voix.
record-cancel = Annuler le réenregistrement
review-terms = En utilisant Common Voice, vous acceptez nos <termsLink>Conditions d’utilisation</termsLink> et notre <privacyLink>Politique de confidentialité</privacyLink>
terms-agree = J’accepte
terms-disagree = Je refuse
review-aborted = Échec de l’envoi. Voulez-vous supprimer vos enregistrements ?
review-submit-title = Vérifier et envoyer
review-submit-msg = Merci pour vos enregistrements !<lineBreak></lineBreak>Vous pouvez maintenant valider et envoyer les extraits ci-dessous.
review-recording = Vérification
review-rerecord = Réenregistrer
review-cancel = Annuler l’envoi
review-keep-recordings = Conserver les enregistrements
review-delete-recordings = Supprimer les enregistrements

## Download Modal

download-title = Votre téléchargement a démarré.
download-helpus = Aidez-nous à rassembler une communauté autour des technologies vocales, restons en contact via courrier électronique.
download-form-email =
    .label = Saisissez votre adresse électronique
    .value = Merci, nous prendrons contact avec vous.
download-back = Retourner aux jeux de données Common Voice
download-no = Non merci

## Contact Modal

contact-title = Formulaire de contact
contact-form-name =
    .label = Nom
contact-form-message =
    .label = Message
contact-required = *requis

## Request Language Modal

request-language-title = Proposition de langue
request-language-form-language =
    .label = Langue
request-language-success-title = La langue a été proposée, merci.
request-language-success-content = Nous vous contacterons très bientôt avec de plus amples informations sur la façon d’ajouter votre langue à Common Voice.

## Languages Overview

language-section-in-progress = En cours
language-section-in-progress-description = Les langues « en cours » sont celles sur lesquelles nos communautés travaillent ; leur progrès correspond à l’avancement de la traduction du site web et à l’avancement de la collecte de phrases.
language-section-launched = Lancées
language-section-launched-description = Pour les langues en production, le site web a été complètement traduit et un nombre suffisant de phrases à lire a été collecté, pour permettre les contributions tant en <italic>parlant</italic> qu’en <italic>écoutant</italic>.
languages-show-more = Afficher davantage de langues
languages-show-less = Afficher moins de langues
language-speakers = Locuteurs
language-meter-in-progress = En cours
language-total-progress = Total
language-search-input =
    .placeholder = Rechercher
language-speakers = Locuteurs
localized = Traduction
sentences = Phrases
total-hours = Nombre total d’heures

## New Contribution

action-click = Cliquez sur
action-tap = Appuyez sur
contribute = Contribuer
listen = Écouter
skip = Passer
shortcuts = Raccourcis
clips = extraits
goal-help-recording = Grâce à vous, Common Voice a atteint <goalPercentage></goalPercentage> de son objectif quotidien de { $goalValue } enregistrements !
goal-help-validation = Grâce à vous, Common Voice a atteint <goalPercentage></goalPercentage> de son objectif quotidien de { $goalValue } validations !
contribute-more = Prêt à en faire { $count } de plus ?
record-cta = Commencer l’enregistrement
record-instruction = { $actionType } <recordIcon></recordIcon> puis lisez la phrase à haute voix.
record-stop-instruction = { $actionType } <stopIcon></stopIcon> une fois terminé.
record-three-more-instruction = Plus que trois !
record-again-instruction = Formidable ! <recordIcon></recordIcon> Enregistrez votre prochain extrait.
record-again-instruction2 = Continuez comme ça et enregistrez-en un de plus.
record-last-instruction = <recordIcon></recordIcon> C’est le dernier !
review-tooltip = Vérifier et réenregistrer au besoin
unable-speak = Impossible de parler en ce moment
review-instruction = Vérifiez et réenregistrez si nécessaire
record-submit-tooltip = { $actionType } envoyer lorsque vous êtes prêt
clips-uploaded = Clips mis en ligne
record-abort-title = D’abord finir d’enregistrer ?
record-abort-text = Quitter maintenant vous fera perdre votre progression
record-abort-submit = Envoyer les enregistrements
record-abort-continue = Finir d’enregistrer
record-abort-delete = Quitter et supprimer tous mes enregistrements
listen-instruction = { $actionType } <playIcon></playIcon>, la phrase a-t-elle été correctement prononcée ?
listen-again-instruction = Excellent travail ! <playIcon></playIcon> Écoutez à nouveau lorsque vous êtes prêt
listen-3rd-time-instruction = Plus que deux <playIcon></playIcon>, continuez !
listen-last-time-instruction = <playIcon></playIcon> C’est le dernier !
nothing-to-validate = Nous n’avons rien à valider dans cette langue, aidez-nous à ajouter quelques enregistrements dans la file d’attente.
record-button-label = Enregistrer votre voix
share-title-new = <bold>Aidez-nous</bold> à trouver de nouvelles voix
