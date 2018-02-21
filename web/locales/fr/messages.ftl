## Layout

speak = Parler
datasets = Jeux de données
profile = Profil
help = Aide
contact = Nous contacter
privacy = Vie privée
terms = Conditions
cookies = Cookies
faq = Questions fréquentes
content-license-text = Contenu disponible sous licence <licenseLink>Creative Commons</licenseLink>

## Home Page

home-title = Le projet Common Voice est une initiative de Mozilla pour aider à apprendre à parler aux machines comme tout un chacun.
wall-of-text-start = La voix est naturelle, la voix est humaine. C’est pour cela que nous aimerions construire des technologies vocales de qualité pour nos machines. Mais construire de tels systèmes requiert un gigantesque volume de données vocales.
show-wall-of-text = En savoir plus
help-us-title = Aidez-nous à valider des phrases !
help-us-explain = Appuyez sur lecture, écoutez et dites-nous : la phrase ci-dessous est-elle prononcée correctement ?

## ProjectStatus

status-title = État global du projet : jusqu’où nous sommes arrivés !
status-contribute = Partagez votre voix
status-loading = Chargement…
status-hours = { $hours ->
        [one] Déjà une heure validée !
       *[other] Déjà { $hours } validées !
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Prochain objectif : { $goal }
status-more-soon = Bientôt de nouvelles langues !

## ProfileForm

profile-form-email =
    .label = Adresse électronique
profile-form-username =
    .label = Nom d’utilisateur
profile-form-emails = Oui, envoyez-moi des courriers électroniques. Je souhaite recevoir l’actualité du projet Common Voice.
profile-form-language =
    .label = Langue
profile-form-more-languages = Bientôt de nouvelles langues !
profile-form-accent =
    .label = Accent
profile-form-age =
    .label = Âge
profile-form-gender =
    .label = Sexe

## FAQ

faq-title = Questions fréquentes
faq-what-q = Qu’est-ce que Common Voice ?
faq-what-a = Les technologies de reconnaissance vocale pourraient révolutionner nos interactions avec les machines, mais les systèmes disponibles à l’heure actuelle sont coûteux et propriétaires. Common Voice est un projet visant à rendre accessible à quiconque ce type de technologie. Les contributeurs partagent leurs voix dans une énorme base de données qui permettra à n’importe qui de rapidement et facilement réaliser des applications utilisant la voix. Toutes les données vocales seront mises à disposition des développeurs.
faq-important-q = Pourquoi est-ce important ?
faq-native-q = Je parle { $lang }, mais ce n’est pas ma langue maternelle et j’ai un accent, ma voix est-elle utile ?
faq-native-a = Absolument, nous avons besoin de votre voix ! Une partie des objectifs de Common Voice est de collecter autant d’accents que possible pour que les machines puissent mieux interpréter la voix de <bold>tout le monde</bold>.
faq-firefox-q = La synthèse vocale fera-t-elle un jour partie de Firefox grâce à Common Voice ?
faq-firefox-a = Common Voice a un potentiel illimité et nous étudions l’utilisation d’interfaces vocales au sein de nombreux logiciels Mozilla, dont Firefox.
faq-quality-q = Quel est le niveau de qualité audio requis ?
faq-quality-a = Nous voulons une qualité audio qui corresponde à ce qu’un moteur de reconnaissance vocale devra affronter dans la vie courante. Nous avons donc besoin de variété. Cela entraîne le moteur à prendre correctement en compte différentes situations : des discussions en arrière-plan, des bruits de moteurs ou des bruits de ventilateurs.
faq-hours-q = Pourquoi l’objectif de collecte de son est-il fixé à 10 000 heures ?
faq-hours-a = C’est, environ, la quantité de données nécessaire pour être en mesure de produire un système de reconnaissance vocale de qualité.
faq-source-q = Quelle est la provenance du texte ?
faq-source-a1 = Les phrases actuelles proviennent de contributions individuelles ainsi que des dialogues de certains films dans le domaine public comme <italic>La vie est belle</italic>.
faq-source-a2 = Les phrases sources sont accessibles <dataLink>dans ce dossier</dataLink> sur GitHub.

## Profile

profile-why-title = Pourquoi créer un profil ?
profile-why-content = En nous communiquant quelques informations à votre sujet, les données audio que vous partagez avec Common Voice seront plus utiles pour les moteurs de reconnaissance vocale, qui les utilisent afin d’améliorer leur précision.

## NotFound

notfound-title = Introuvable
notfound-content = J’ai bien peur de ne pas savoir ce que vous recherchez.

## Privacy

privacy-more = <more>En savoir plus</more>

## Terms

terms-privacy-content = Notre <privacyLink>politique de confidentialité</privacyLink> explique comment nous collectons et gérons vos données.
terms-communications-title = Communications
terms-communications-content = Si vous vous inscrivez à nos lettres d’information ou que vous créez un compte en lien avec Common Voice, vous pourriez recevoir des courriers électroniques de notre part relatifs à votre compte (par exemple, pour des raisons juridiques, de sécurité ou de confidentialité).
terms-general-title = Général

## Data

data-download-button = Télécharger les données Common Voice
data-download-license = Licence : <licenseLink>CC-0</licenseLink>
data-download-modal = Vous vous apprêtez à télécharger <size>{ $size } Go</size>, voulez-vous continuer ?
data-get-started = <speechBlogLink>S’initier à la reconnaissance vocale</speechBlogLink>
data-other-title = Autres jeux de données…
data-other-download = Télécharger les données
data-other-librispeech-description = LibriSpeech est un corpus d’environ 1000 heures d’anglais lu (16 kHz) de livres audio du projet LibriVox.
data-other-ted-name = Corpus TED-LIUM
data-other-ted-description = Le corpus TED-LIUM est construit à partir des données audio et de leurs transcriptions disponibles sur le site TED.
data-other-voxforge-description = VoxForge a été construit pour collecter des transcriptions vocales pour les utiliser dans des moteurs de reconnaissance vocale libres.
data-other-tatoeba-description = Tatoeba est une immense base de données de phrases, de traductions et d’extraits audio destinés à l’apprentissage des langues. Ce téléchargement contient toutes les données en anglais enregistrées par leur communauté.
data-bundle-button = Télécharger un lot de jeux de données
data-bundle-description = Données Common Voice ainsi que tous les autres jeux de données ci-dessus.
license = Licence : <licenseLink>{ $license }</licenseLink>

## Record Page

record-platform-not-supported = Nous sommes désolés, mais votre plateforme n’est pas encore prise en charge.
record-platform-not-supported-ios = Les utilisateurs <bold>iOS</bold> peuvent télécharger notre application gratuite :
record-must-allow-microphone = Vous devez autoriser l’accès au microphone.
record-error-too-short = L’enregistrement est trop court.
record-error-too-long = L’enregistrement est trop long.
record-error-too-quiet = Le volume de l’enregistrement est trop faible.
record-submit-success = Envoi réussi ! Voulez-vous effectuer un nouvel enregistrement ?
record-help = Appuyez pour enregistrer, puis lisez la phrase ci-dessus à haute voix.
record-cancel = Annuler le réenregistrement
review-terms = En utilisant Common Voice, vous acceptez nos <termsLink>conditions d’utilisation</termsLink> et notre <privacyLink>politique de confidentialité</privacyLink>
review-aborted = Échec de l’envoi. Voulez-vous supprimer vos enregistrements ?
review-submit-title = Vérifier et envoyer
review-submit-msg = Merci pour votre enregistrement !<lineBreak></lineBreak>Vous pouvez maintenant valider et envoyer vos extraits ci-dessous.
review-recording = Vérification
review-rerecord = Réenregistrer
review-cancel = Annuler l’envoi

## Download Modal

download-title = Votre téléchargement a démarré.
download-form-email =
    .label = Saisissez votre adresse électronique
    .value = Merci, nous prendrons contact avec vous.
download-form-submit = Envoyer
download-back = Retourner aux jeux de données Common Voice
download-no = Non merci

## Contact

contact-title = Formulaire de contact
contact-cancel = Annuler
contact-form-email =
    .label = Adresse électronique
contact-form-name =
    .label = Nom
contact-form-message =
    .label = Message
contact-required = *requis
contact-submit = Envoyer
