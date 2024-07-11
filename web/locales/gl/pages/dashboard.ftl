## Dashboard

your-languages = Os seus idiomas
toward-next-goal = Cara ao seguinte obxectivo
goal-reached = Obxectivo acadado
clips-you-recorded = Fragmentos que gravou
clips-you-validated = Fragmentos que aprobou
todays-recorded-progress = Avance de hoxe en fragmentos gravados para Common Voice
todays-validated-progress = Avance de hoxe en fragmentos aprobados para Common Voice
stats = Estatísticas
awards = Premios
you = Vostede
everyone = Todos
contribution-activity = Actividade colaboradora
top-contributors = Os máis colaboradores
recorded-clips = Fragmentos gravados
validated-clips = Fragmentos aprobados
total-approved = Total de aprobados
overall-accuracy = Precisión global
set-visibility = Definir a súa visibilidade
visibility-explainer = Esta configuración controla a súa visibilidade no panel de líderes. De estar oculta, o seu avance gardarase en privado. Isto significa que a súa imaxe, nome de usuario e avance non van aparecer no panel de líderes. Saiba que o panel demora ~{ $minutes }min en actualizarse.
visibility-overlay-note = Nota: Cando se define como 'Visible', esta configuración pode modificarse na <profileLink>pestana de perfil</profileLink>
show-ranking = Amosar a súa clasificación

## Custom Goals

get-started-goals = Primeiros pasos cos obxectivos
create-custom-goal = Crear un obxectivo personalizado
goal-type = Que tipo de obxectivos quere fixar?
both-speak-and-listen = Ambos
both-speak-and-listen-long = Ambos (falar e escoitar)
daily-goal = Obxectivo diario
weekly-goal = Obxectivo semanal
easy-difficulty = Doado
average-difficulty = Medio
difficult-difficulty = Difícil
pro-difficulty = Profesional
lose-goal-progress-warning = Ao editar o seu obxectivo, pode perder o seu avance actual.
want-to-continue = Quere continuar?
finish-editing = Rematar primeiro a edición?
lose-changes-warning = Saír agora significa que perderá os teus cambios
build-custom-goal = Fixar un obxectivo personalizado
help-reach-hours-pluralized =
    Axuda para chegar a{ NUMBER($hours) ->
        [one] { $hours } hora
       *[other] { $hours } horas
    }en { $language } cun obxectivo persoal
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Axuda a Common Voice para acadar{ $hours } hora nun idioma cun obxectivo persoal
       *[other] Axuda a Common Voice para acadar{ $hours } horas nun idioma cun obxectivo persoal
    }
set-a-goal = Estabelecer un obxectivo
cant-decide = Non se decide?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                               *[other] { $totalHours } horas é unha meta alcanzable en en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } mes se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                               *[other] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                               *[other] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                               *[other] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } mes se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                               *[other] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } mes se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                               *[other] { $totalHours } horas é unha meta alcanzable en { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                               *[other] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                               *[other] { $totalHours } horas é unha meta alcanzable en algo máis de { $periodMonths } meses se { $people } persoas gravan { $clipsPerDay } fragmentos ao día.
                            }
                    }
            }
    }
how-many-per-day = Xenial! Cantos fragmentos por día?
how-many-a-week = Xenial! Cantos fragmentos por semana?
which-goal-type = Quere falar, escoitar ou ambos?
receiving-emails-info =
    Actualmente está a recibir correos electrónicos de recordatorios de obxectivos, actualizacións
    do seu avance e boletíns de novas sobre Common Voice
not-receiving-emails-info =
    Actualmente, ten definido que <bold>NON</bold> recibirá correos electrónicos recordatorios de obxectivos, as  
    actualizacións de avance nin os boletíns sobre Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } fragmento
       *[other] { $count } fragmentos
    }
help-share-goal = Axúdenos a atopar máis voces, comparte o teu obxectivo
confirm-goal = Confirme o obxectivo
goal-interval-weekly = Semanalmente
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Comparta o seu obxectivo diario de { $count } fragmentos de { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Comparta o seu obxectivo semanal de { $count } fragmentos de { $type }
share-goal-type-speak = Falando
share-goal-type-listen = Escoitando
share-goal-type-both = Falando e escoitando
# LINK will be replaced with the current URL
goal-share-text = Acabo de crear un obxectivo persoal de doazón de voz a #CommonVoice -- únase e axúdeme a ensinarlles ás máquinas como falan as persoas reais { $link }
weekly-goal-created = Creouse o seu obxectivo semanal
daily-goal-created = Creouse o seu obxectivo diario
track-progress = Siga o seu avance aquí e na súa páxina de estatísticas.
return-to-edit-goal = Volva aquí para editar o seu obxectivo en calquera momento.
share-goal = Compartir o seu obxectivo

## Goals

streaks = Intres
days =
    { $count ->
        [one] Día
       *[other] Días
    }
recordings =
    { $count ->
        [one] Gravación
       *[other] Gravacións
    }
validations =
    { $count ->
        [one] Aprobación
       *[other] Aprobacións
    }
