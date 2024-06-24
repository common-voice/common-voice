## Dashboard

your-languages = Tus Idiomas
toward-next-goal = Hacia el próximo objetivo
goal-reached = Objetivo alcanzado
clips-you-recorded = Clips que has Grabado
clips-you-validated = Clips que has Validado
todays-recorded-progress = Progreso de Common Voice de hoy en clips grabados
todays-validated-progress = Progreso de Common Voice de hoy en clips validados
stats = Estadísticas
awards = Premios
you = Tú
everyone = Todos
contribution-activity = Actividad de contribución
top-contributors = Mayores contribuyentes
recorded-clips = Clips Grabados
validated-clips = Clips Validados
total-approved = Total de aprobados
overall-accuracy = Precisión general
set-visibility = Establecer mi visibilidad
visibility-explainer = Esta configuración controla la visibilidad de su tabla de clasificación. Cuando esté oculto, su progreso será privado. Esto significa que su imagen, nombre de usuario y progreso no aparecerán en la tabla de clasificación. Tenga en cuenta que la actualización de la tabla de clasificación tarda ~{ $minutes }min en propagar los cambios.
visibility-overlay-note = Nota: cuando se establece en 'Visible', esta configuración se puede cambiar desde la <profileLink>Página de perfil</profileLink>
show-ranking = Mostrar mi ranking

## Custom Goals

get-started-goals = Empezar con objetivos
create-custom-goal = Crear un objetivo personal
goal-type = ¿Qué tipo de objetivo quieres construir?
both-speak-and-listen = Ambos
both-speak-and-listen-long = Ambos (Hablar y Escuchar)
daily-goal = Objetivo diario
weekly-goal = Objetivo Semanal
easy-difficulty = Fácil
average-difficulty = Promedio
difficult-difficulty = Dificultad
pro-difficulty = Pro
lose-goal-progress-warning = Al editar su objetivo, puede perder su progreso actual.
want-to-continue = ¿Quieres continuar?
finish-editing = ¿Terminar de editar primero?
lose-changes-warning = Salir ahora significa que perderá sus cambios
build-custom-goal = Crea un objetivo personalizado
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Ayude a alcanzar { $hours } hora en { $language } con un objetivo personal
       *[other] Ayude a alcanzar { $hours } horas en { $language } con un objetivo personal
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Ayudar a Common Voice alcanzar { $hours } hora en un idioma con un objetivo personal
       *[other] Ayudar a Common Voice alcanzar { $hours } horas en un idioma con un objetivo personal
    }
set-a-goal = Establecer una meta
cant-decide = ¿No puedes decidir?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } hora es alcanzable en sólo
       *[other] { $totalHours } horas son alcanzables en sólo
    }{ NUMBER($periodMonths) ->
        [one] { $periodMonths } mes si
       *[other] { $periodMonths } meses si
    }{ NUMBER($people) ->
        [one] { $people } registro de persona
       *[other] { $people } registro de personas
    }{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } clip al día.
       *[other] { $clipsPerDay } clips al día.
    }
how-many-per-day = ¡Estupendo! ¿Cuántos clips por día?
how-many-a-week = ¡Estupendo! ¿Cuántos clips a la semana?
which-goal-type = ¿Quieres hablar, escuchar o ambos?
receiving-emails-info =
    Actualmente está configurado para recibir correos electrónicos como recordatorios de objetivos, mi
    actualizaciones de progreso y boletines sobre Common Voice
not-receiving-emails-info =
    Actualmente está configurado para <bold>NO</bold> recibir correos electrónicos como recordatorios de objetivos, mis
    actualizaciones de progreso y boletines sobre Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } clip
       *[other] { $count } clips
    }
help-share-goal = Ayúdanos a encontrar más voces, comparte tu objetivo
confirm-goal = Confirmar meta
goal-interval-weekly = Semanal
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Comparta su meta diaria de clips de { $count } para { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Comparta su meta semanal de clips de { $count } para { $type }
share-goal-type-speak = Hablando
share-goal-type-listen = Escuchando
share-goal-type-both = Hablando y Escuchando
# LINK will be replaced with the current URL
goal-share-text = Acabo de crear un objetivo personal para la donación de voz a #CommonVoice: únase a mí y ayude a enseñar a las máquinas cómo hablan las personas reales { $link }
weekly-goal-created = Tú meta seanal ha sido creada
daily-goal-created = Tu meta diaria ha sido creada
track-progress = Siga el progreso aquí y en su página de estadísticas.
return-to-edit-goal = Regrese aquí para editar su objetivo en cualquier momento.
share-goal = Compartir mi objetivo

## Goals

streaks = Rayas
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

