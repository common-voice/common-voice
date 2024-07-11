## Dashboard

your-languages = Les vostres llengües
toward-next-goal = Cap al següent objectiu
goal-reached = S'ha assolit l'objectiu
clips-you-recorded = Talls que heu enregistrat
clips-you-validated = Talls que heu validat
todays-recorded-progress = Progrés d'avui del Common Voice quant a talls enregistrats
todays-validated-progress = Progrés d'avui del Common Voice quant a talls validats
stats = Estadístiques
awards = Distincions
you = Vós
everyone = Tothom
contribution-activity = Activitat de col·laboració
top-contributors = Col·laboradors més actius
recorded-clips = Talls enregistrats
validated-clips = Talls validats
total-approved = Total d'aprovats
overall-accuracy = Precisió global
set-visibility = Defineix la meva visibilitat
visibility-explainer = Aquesta opció controla la vostra visibilitat en la classificació. Si està oculta, el vostre progrés serà privat. Això significa que la vostra imatge, nom d'usuari i progrés no apareixeran a la classificació. Tingueu en compte que l'actualització de la classificació triga { $minutes } minuts a mostrar els canvis, aproximadament.
visibility-overlay-note = Nota: si està definit com a «Visible», això es pot canviar des de la <profileLink>pàgina del perfil</profileLink>
show-ranking = Mostra la meva classificació

## Custom Goals

get-started-goals = Introducció als objectius
create-custom-goal = Creeu un objectiu personalitzat
goal-type = Quin tipus d'objectiu voleu crear?
both-speak-and-listen = Ambdós
both-speak-and-listen-long = Ambdós (Parla i Escolta)
daily-goal = Objectiu diari
weekly-goal = Objectiu setmanal
easy-difficulty = Fàcil
average-difficulty = Normal
difficult-difficulty = Difícil
pro-difficulty = Professional
lose-goal-progress-warning = En editar l'objectiu, podeu perdre el progrés actual.
want-to-continue = Voleu continuar?
finish-editing = Voleu acabar d'editar?
lose-changes-warning = Si ho deixeu ara, es perdran tots els canvis
build-custom-goal = Creeu un objectiu personalitzat
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Ajudeu a arribar a { $hours } hora en { $language } amb un objectiu personal
       *[other] Ajudeu a arribar a { $hours } hores en { $language } amb un objectiu personal
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Ajudeu al Common Voice a arribar a{ $hours } hora en una llengua amb un objectiu personal
       *[other] Ajudeu al Common Voice a arribar a { $hours } hores en una llengua amb un objectiu personal
    }
set-a-goal = Defineix un objectiu
cant-decide = No sabeu què fer?
activity-needed-calculation-plural =
    { NUMBER($people) ->
        [one] Si { $people } persona enregistra
       *[other] Si { $people } persones enregistren
    } { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } tall per dia, es pot arribar a
       *[other] { $clipsPerDay } talls per dia, es pot arribar a
    } { NUMBER($totalHours) ->
        [one] { $totalHours } hora en poc més
       *[other] { $totalHours } hores en poc més
    } { NUMBER($periodMonths) ->
        [one] d'{ $periodMonths } mes.
        [11] d'{ $periodMonths } mesos.
       *[other] de { $periodMonths } mesos.
    }
how-many-per-day = Genial! Quants talls per dia?
how-many-a-week = Genial! Quants talls per setmana?
which-goal-type = Genial! Voleu parlar, escoltar o totes dues coses?
receiving-emails-info = Actualment, teniu configurat rebre correus electrònics, com ara recordatoris d’objectius, actualitzacions del vostre progrés i butlletins de notícies sobre el Common Voice
not-receiving-emails-info = Actualment, <bold>NO</bold> rebeu correus electrònics com ara recordatoris dels objectius, actualitzacions del progrés personal o notícies sobre el Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } tall
       *[other] { $count } talls
    }
help-share-goal = Ajudeu-nos a trobar més veus, compartiu el vostre objectiu
confirm-goal = Confirmo l'objectiu
goal-interval-weekly = Setmanal
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Compartiu el vostre objectiu diari de { $count } talls { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Compartiu el vostre objectiu setmanal de { $count } talls { $type }
share-goal-type-speak = parlant
share-goal-type-listen = escoltant
share-goal-type-both = parlant i escoltant
# LINK will be replaced with the current URL
goal-share-text = Acabo de crear un objectiu personal per donar la veu al #CommonVoice #CommonVoiceCAT. Uniu-vos-hi i ajudeu-nos a ensenyar les màquines com parlen les persones de debò { $link }
weekly-goal-created = S'ha creat el vostre objectiu setmanal
daily-goal-created = S'ha creat el vostre objectiu diari
track-progress = Seguiu el vostre el progrés aquí i en la pàgina d'estadístiques.
return-to-edit-goal = Torneu aquí en qualsevol moment per editar el vostre objectiu.
share-goal = Comparteix el meu objectiu

## Goals

streaks = Ratxes
days =
    { $count ->
        [one] Dia
       *[other] Dies
    }
recordings =
    { $count ->
        [one] Enregistrament
       *[other] Enregistraments
    }
validations =
    { $count ->
        [one] Validació
       *[other] Validacions
    }
