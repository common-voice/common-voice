## Dashboard

your-languages = Ваши језици
toward-next-goal = Према следећем циљу
goal-reached = Циљ постигнут
clips-you-recorded = Снимци које сте снимили
clips-you-validated = Снимци које сте потврдили
todays-recorded-progress = Данашњи напредак Common Voice-а на снимању снимака
todays-validated-progress = Данашњи напредак Common Voice-а на валидацији снимака
stats = Статистика
awards = Награде
you = Ви
everyone = Сви
contribution-activity = Активност доприноса
top-contributors = Најбољи доприносиоци
recorded-clips = Снимљени снимци
validated-clips = Потврђени снимци
total-approved = Укупно одобрено
overall-accuracy = Општа тачност
set-visibility = Подеси моју видљивост
visibility-explainer = Ово подешавање контролише видљивост вашег напретка у рангирању. Ако је сакривен, ваш напредак ће бити приватни. То значи да се ваша слика, корисничко име и напредак неће појавити у рангирању. Имајте на уму да се освежавање података рангирања чека приближно { $minutes } минута да би промене ступиле на снагу.
visibility-overlay-note = Напомена: ако је постављено на Видљиво, ово подешавање можете променити на <profileLink>страници профила</profileLink>
show-ranking = Покажи мој ранг

## Custom Goals

get-started-goals = Почните са одређеним циљевима
create-custom-goal = Направите сопствени циљ
goal-type = Који циљ желите да постигнете?
both-speak-and-listen = Оба
both-speak-and-listen-long = Оба (говори и слушај)
daily-goal = Дневни циљ
weekly-goal = Недељни циљ
easy-difficulty = Лако
average-difficulty = Просечно
difficult-difficulty = Тешко
pro-difficulty = Професионално
lose-goal-progress-warning = Изменом циља можете изгубити постојећи напредак.
want-to-continue = Да ли желите да наставите?
finish-editing = Завршити уређивање прво?
lose-changes-warning = Ако напустите сада изгубићете своје промене
build-custom-goal = Направите прилагођени циљ
help-reach-hours-pluralized =
    Помозите да достигнемо{ NUMBER($hours) ->
        [one] { $hours } сат
        [few] { $hours } сата
       *[other] { $hours } сати
    }у { $language } радећи на сопственом циљу
help-reach-hours-general-pluralized =
    Помозите Common Voice-у да достигне{ NUMBER($hours) ->
        [one] { $hours } сат
        [few] { $hours } сата
       *[other] { $hours } сати
    }за језик с личним циљем
set-a-goal = Поставите циљ
cant-decide = Не можете се одлучити?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } сат
        [few] { $totalHours } сата
       *[other] { $totalHours } сати
    }се може достигнути за нешто више од{ NUMBER($periodMonths) ->
        [one] { $periodMonths } месеца
        [few] { $periodMonths } месеца
       *[other] { $periodMonths } месеци
    }ако{ NUMBER($people) ->
        [one] { $people } човек
        [few] { $people } човека
       *[other] { $people } људи
    }сними{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } исечак
        [few] { $clipsPerDay } исечка
       *[other] { $clipsPerDay } исечака
    }сваког дана.
how-many-per-day = Одлично! Колико снимака дневно?
how-many-a-week = Одлично! Колико снимака недељно?
which-goal-type = Да ли желите да говорите, слушајте или и једно и друго?
receiving-emails-info =
    Тренутно сте подесили примање е-порука као што су то подсетници о циљевима, 
    новости о сопственом напретку и билтени о Common Voice пројекту
not-receiving-emails-info = Тренутно сте подесили да <bold>не примате</bold> е-поруке попут подсетника о циљевима, новости о напретку и билтене о Common Voice пројекту
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } исечак
        [few] { $count } исечка
       *[other] { $count } исечака
    }
help-share-goal = Помозите нам да нађемо више гласова, поделите свој циљ
confirm-goal = Потврдите циљ
goal-interval-weekly = Недељно
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Делите свој { $count } циљ дневног броја снимака за { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Поделите свој { $count } циљ недељних снимака за { $type }
share-goal-type-speak = Говор
share-goal-type-listen = Слушање
share-goal-type-both = Говор и слушање
# LINK will be replaced with the current URL
goal-share-text = Управо сам направио лични циљ за донацију гласу у #CommonVoice пројекту, придружи ми се и помози да научимо машине како људи говоре { $link }
weekly-goal-created = Ваш недељни циљ је направљен
daily-goal-created = Ваш дневни циљ је направљен
track-progress = Пратите напредак овде и на вашој статистичкој страници.
return-to-edit-goal = Вратите се овде било када да бисте променили свој циљ.
share-goal = Подели мој циљ

## Goals

streaks = Понављања
days =
    { $count ->
        [one] дан
        [few] дана
       *[other] дана
    }
recordings =
    { $count ->
        [one] снимак
        [few] снимка
       *[other] снимака
    }
validations =
    { $count ->
        [one] потврда
        [few] потврде
       *[other] потврда
    }
