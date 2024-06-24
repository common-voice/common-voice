## Dashboard

your-languages = Tus idiomas
toward-next-goal = Hacia el siguiente objetivo
goal-reached = Objetivo alcanzado
clips-you-recorded = Fragmentos que has grabado
clips-you-validated = Fragmentos que has validado
todays-recorded-progress = Progreso de hoy de los fragmentos grabados para Common Voice
todays-validated-progress = Progreso de hoy de los fragmentos validados para Common Voice
stats = Estadísticas
awards = Premios
you = Tú
everyone = Todo el mundo
contribution-activity = Actividad de colaboración
top-contributors = Principales colaboradores
recorded-clips = Fragmentos grabados
validated-clips = Fragmentos validados
total-approved = Total aprobado
overall-accuracy = Precisión general
set-visibility = Establecer visibilidad
visibility-explainer = Esta configuración controla la visibilidad de tu tabla de clasificación. Cuando está oculto, tu progreso será privado. Esto significa que tanto tu imagen, nombre de usuario y progreso no aparecerán en la tabla de clasificación. Ten en cuenta que la actualización de la tabla de clasificación tarda ~{ $minutes } minutos para completar los cambios.
visibility-overlay-note = Nota: Cuando se establece como 'Visible', la configuración se puede cambiar desde la <profileLink>página de perfil </profileLink>
show-ranking = Mostrar mi avance

## Custom Goals

get-started-goals = Comenzar mis objetivos
create-custom-goal = Crear un objetivo personalizado
goal-type = ¿Qué tipo de objetivo quieres crear?
both-speak-and-listen = Ambos
both-speak-and-listen-long = Ambos (hablar y escuchar)
daily-goal = Objetivo diario
weekly-goal = Objetivo semanal
easy-difficulty = Fácil
average-difficulty = Medio
difficult-difficulty = Difícil
pro-difficulty = Profesional
lose-goal-progress-warning = Si editas tu objetivo puede que pierdas el progreso existente.
want-to-continue = ¿Quieres continuar?
finish-editing = ¿Quieres terminar de editar antes?
lose-changes-warning = Si lo dejas ahora, perderás los cambios
build-custom-goal = Crear un objetivo personalizado
help-reach-hours-pluralized =
    Ayuda a alcanzar{ NUMBER($hours) ->
        [one] { $hours } hora
       *[other] { $hours } horas
    }en { $language } con un objetivo personal
help-reach-hours-general-pluralized =
    Ayuda a que Common Voice alcance{ NUMBER($hours) ->
        [one] { $hours } hora
       *[other] { $hours } horas
    }en un idioma con un objetivo personal
set-a-goal = Establecer objetivo
cant-decide = ¿No te decides?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } hora
       *[other] { $totalHours } horas
    }es alcanzable en solo{ NUMBER($periodMonths) ->
        [one] { $periodMonths } mes
       *[other] { $periodMonths } meses
    }si{ NUMBER($people) ->
        [one] { $people } persona
       *[other] { $people } personas
    }graban{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } fragmento
       *[other] { $clipsPerDay } fragmentos
    }al día.
how-many-per-day = ¡Excelente! ¿Cuántas grabaciones al día?
how-many-a-week = ¡Excelente! ¿Cuántas grabaciones a la semana?
which-goal-type = ¿Quieres hablar, escuchar o los dos?
receiving-emails-info = Ahora mismo lo tienes configurado para recibir correos electrónicos como recordatorios de objetivos, actualizaciones de progreso y boletines de información sobre Common Voice
not-receiving-emails-info = Tu configuración actual indica que <bold>NO</bold> recibes correos con recordatorios de objetivos, actualizaciones de progreso ni boletines de noticias de Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } fragmento
       *[other] { $count } fragmentos
    }
help-share-goal = Ayúdanos a encontrar más voces, comparte tu objetivo
confirm-goal = Confirmar objetivo
goal-interval-weekly = Semanal
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Comparte tu objetivo diario de { $count } grabaciones para { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Comparte tu objetivo semanal de { $count } grabaciones para { $type }
share-goal-type-speak = Hablando
share-goal-type-listen = Escuchando
share-goal-type-both = Hablando y escuchando
# LINK will be replaced with the current URL
goal-share-text = He creado un objetivo personal para dar voz a #CommonVoice -- Únete y ayúdanos a enseñar a las máquinas cómo hablamos las personas { $link }
weekly-goal-created = Se ha creado tu objetivo semanal
daily-goal-created = Se ha creado tu objetivo diario
track-progress = Sigue aquí el progreso y en la página de estadísticas.
return-to-edit-goal = Siempre puedes volver a editar el objetivo.
share-goal = Compartir mi objetivo

## Goals

streaks = Metas
days =
    { $count ->
        [one] Día
       *[other] Días
    }
recordings =
    { $count ->
        [one] Grabación
       *[other] Grabaciones
    }
validations =
    { $count ->
        [one] Validación
       *[other] Validaciones
    }

