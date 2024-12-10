## Dashboard

your-languages = Фи бзэ
toward-next-goal = Пэщыт Iуэху
goal-reached = Goal reached
clips-you-recorded = Евгъэтхащ
clips-you-validated = Фыхэплъащ
todays-recorded-progress = Common Voice-м нобэ тхыгъэу ит
todays-validated-progress = Common Voice-м нобэ тхыгъэу хэплъэжа
stats = ЩытыкӀэ
awards = Къэхь
you = Фэ
everyone = Елэжь псори
contribution-activity = Iэпыкъу и тхыгъэ
top-contributors = Iэпыкъу щхьэпэ
recorded-clips = Макъыу тха
validated-clips = Хэплъау щыт
total-approved = Зыхэплъэжа псор
overall-accuracy = Зыу гъэпса
set-visibility = Сызылъагъ теухуэ
show-ranking = Си рейтингыр гъэлъагъуэ

## Custom Goals

get-started-goals = Гъэпс
create-custom-goal = Си гъэпс щIэдзэ
both-speak-and-listen = ТIури
both-speak-and-listen-long = ТIури (тхыи хэплъэж)
daily-goal = Махуэ гъэпс
weekly-goal = Тхьэмахуэ гъэпс
easy-difficulty = Тыншщ
average-difficulty = Курыт
difficult-difficulty = Гугъу
pro-difficulty = Iэзэ
build-custom-goal = Езым уи мурадыр зыхуэгъэув
cant-decide = Унафэ фыхъуркъэ?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                               *[other] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                               *[other] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                               *[other] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                               *[other] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                               *[other] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                               *[other] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                               *[other] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                               *[other] сыхьэтнэсыфмазэецIыхутхыкIэщIзы махуэм.
                            }
                    }
            }
    }
how-many-per-day = Лъэщ! Махуэм тхыгъэ дапщэ?
how-many-a-week = Лъэщ! Тхьэмахуэм тхыгъэ дапщэ?
goal-interval-weekly = Тхьэмахуэ къэс
share-goal-type-speak = Къэпсалъэ
share-goal-type-listen = Едэӏу

## Goals

streaks = Махуэ зэпыту
days =
    { $count ->
        [one] Махуэ
       *[other] Махуэу
    }
validations =
    { $count ->
        [one] Хэплъэж
       *[other] Хэплъэжу
    }
