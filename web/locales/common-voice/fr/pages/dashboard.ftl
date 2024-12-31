## Dashboard

your-languages = Vos langues 
toward-next-goal = Vers le prochain objectif
goal-reached = Objectif atteint
clips-you-recorded = Les échantillons que vous avez enregistrés
clips-you-validated = Les échantillons que vous avez validés
todays-recorded-progress = La progression de Common Voice sur les échantillons enregistrés aujourd’hui
todays-validated-progress = La progression de Common Voice sur les échantillons validés aujourd’hui
stats = Statistiques
awards = Trophées
you = Vous
everyone = Tout le monde
contribution-activity = Activité de contribution
top-contributors = Contributeurs et contributrices remarquables
recorded-clips = Échantillons enregistrés
validated-clips = Échantillons validés
total-approved = Total approuvé
overall-accuracy = Précision globale
set-visibility = Définir ma visibilité
visibility-explainer = Ce paramètre contrôle la visibilité de votre progression dans le classement. Lorsqu’elle est cachée, votre progression sera privée. Cela signifie que votre image, votre nom d’utilisateur et votre progression n’apparaîtront pas dans le classement. Notez que l’actualisation du classement prend environ { $minutes } minutes pour remplir les modifications.
visibility-overlay-note = Remarque : lorsqu’il est défini sur « Visible », ce paramètre peut être modifié depuis <profileLink>votre profil</profileLink>.
show-ranking = Afficher mon classement

## Custom Goals

get-started-goals = Créez vos objectifs
create-custom-goal = Créer un objectif personnalisé
goal-type = Quel type d’objectif souhaitez-vous définir ?
both-speak-and-listen = Faire les deux
both-speak-and-listen-long = Les deux (parler et écouter)
daily-goal = Objectif quotidien
weekly-goal = Objectif hebdomadaire
easy-difficulty = Facile
average-difficulty = Normal
difficult-difficulty = Difficile
pro-difficulty = Professionnel
lose-goal-progress-warning = En modifiant votre objectif, vous risquez de perdre vos progrès existants.
want-to-continue = Voulez-vous continuer ?
finish-editing = Terminer d’abord les modifications ?
lose-changes-warning = Si vous quittez maintenant, vous perdrez vos modifications
build-custom-goal = Définissez un objectif personnalisé
help-reach-hours-pluralized =
    Aidez à atteindre { NUMBER($hours) ->
        [one] { $hours } heure
       *[other] { $hours } heures
    } en { $language } avec un objectif personnel
help-reach-hours-general-pluralized =
    Aidez Common Voice à atteindre { NUMBER($hours) ->
        [one] { $hours } heure
       *[other] { $hours } heures
    } dans une langue avec un objectif personnel
set-a-goal = Fixer un objectif
cant-decide = Vous ne pouvez pas décider ?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] Un objectif d’une heure
       *[other] Un objectif  de { $totalHours } heures
    }peut être atteint en un peu plus{ NUMBER($periodMonths) ->
        [one] d’un mois
       *[other] de { $periodMonths } mois
    }si{ NUMBER($people) ->
        [one] une personne enregistre
       *[other] { $people } personnes enregistrent
    }{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } échantillon
       *[other] { $clipsPerDay } échantillons
    }par jour.
how-many-per-day = Génial ! Combien d’échantillons par jour ?
how-many-a-week = Génial ! Combien d’échantillons par semaine ?
which-goal-type = Voulez-vous parler, écouter ou faire les deux ?
receiving-emails-info = Vous allez recevoir des e-mails tels que des rappels d’objectifs, des rapports sur vos progrès et les lettres d’information de Common Voice.
not-receiving-emails-info = Vous n’allez <bold>PAS</bold> recevoir d’e-mails tels que des rappels d’objectifs, des rapports sur vos progrès et les lettres d’information de Common Voice.
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } échantillon
       *[other] { $count } échantillons
    }
help-share-goal = Aidez-nous à trouver plus de voix, partagez votre objectif
confirm-goal = Confirmer l’objectif
goal-interval-weekly = Hebdomadaire
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Partagez votre objectif quotidien de { $count } échantillons { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Partagez votre objectif hebdomadaire de { $count } échantillons { $type }
share-goal-type-speak = parlés
share-goal-type-listen = écoutés
share-goal-type-both = parlés et écoutés
# LINK will be replaced with the current URL
goal-share-text = Je viens de créer un objectif personnel pour le don de voix à #CommonVoice – rejoignez-moi et aidez-moi à apprendre aux machines à parler comment les vraies personnes parlent { $link }
weekly-goal-created = Votre objectif hebdomadaire a été créé
daily-goal-created = Votre objectif quotidien a été créé
track-progress = Suivez les progrès ici et sur votre page de statistiques.
return-to-edit-goal = Revenez ici pour modifier votre objectif à tout moment.
share-goal = Partager mon objectif

## Goals

streaks = Périodes record
days =
    { $count ->
        [one] Jour
       *[other] Jours
    }
recordings =
    { $count ->
        [one] Enregistrement
       *[other] Enregistrements
    }
validations =
    { $count ->
        [one] Validation
       *[other] Validations
    }
