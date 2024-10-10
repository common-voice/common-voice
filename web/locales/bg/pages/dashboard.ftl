## Dashboard

your-languages = Вашите езици
toward-next-goal = Към следващата цел
goal-reached = Целта е постигната
clips-you-recorded = Записани от вас
clips-you-validated = Проверени от вас
todays-recorded-progress = Днешния прогрес на направени записи в Common Voice
todays-validated-progress = Днешния прогрес на проверени записи в Common Voice
stats = Статистика
awards = Награди
you = Вие
everyone = Всички
contribution-activity = Активност на приноса
top-contributors = Топ доброволци
recorded-clips = Записи
validated-clips = Проверени записи
total-approved = Общо одобрени
overall-accuracy = Обща точност
set-visibility = Задаване на видимост в статистиката
visibility-explainer = Настройката управлява видимостта ви в класацията. Ако е скрит, напредъкът ви ще е видим само за вас. Това означава, че вашите снимка, потребителско име и напредък няма да бъдат показвани в класацията. За да бъдат показани промените в класацията отнема около { $minutes } минути.
visibility-overlay-note = Забележка: Когато е избрано „Видим“, тази настройка може да бъде променена от <profileLink>профила</profileLink>
show-ranking = Моето класиране

## Custom Goals

get-started-goals = Цели
create-custom-goal = Създаване на лична цел
goal-type = Какъв вид цел искате да създадете?
both-speak-and-listen = И двете
both-speak-and-listen-long = И двете (говорене и слушане)
daily-goal = Дневна цел
weekly-goal = Седмична цел
easy-difficulty = Лесно
average-difficulty = Средно
difficult-difficulty = Трудно
pro-difficulty = Професионално
lose-goal-progress-warning = Редактирайки целта си, може да загубите настоящия си напредък.
want-to-continue = Искате ли да продължите?
finish-editing = Желаете ли да приключите първо с промените?
lose-changes-warning = Ако напуснете сега, ще загубите промените си
build-custom-goal = Поставяне на лична цел
help-reach-hours-pluralized =
    Помогнете да достигнем { NUMBER($hours) ->
        [one] { $hours } час
       *[other] { $hours } часа
    } на { $language } чрез лична цел
help-reach-hours-general-pluralized =
    Помогнете Common Voice да достигне { NUMBER($hours) ->
        [one] { $hours } час
       *[other] { $hours } часа
    } на език чрез лична цел
set-a-goal = Задаване на цел
cant-decide = Не можете да решите?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } час е постижим
       *[other] { $totalHours } часа са постижими
    } за { NUMBER($periodMonths) ->
        [one] { $periodMonths } месец
       *[other] { $periodMonths } месеца
    } ако { NUMBER($people) ->
        [one] { $people } човек прави
       *[other] { $people } души правят
    }по { NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } запис
       *[other] { $clipsPerDay } записа
    } на ден.
how-many-per-day = Страхотно! Колко записа на ден?
how-many-a-week = Страхотно! Колко записа на седмица?
which-goal-type = Искате ли да говорите, да слушате или и двете?
receiving-emails-info = Според настройките получавате имейли, като напомняния за целите, напредъка и бюлетини за Common Voice
not-receiving-emails-info = Според настройките ви <bold>НЕ</bold> получавате имейли за напомняния за целите, напредъка и бюлетини за Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } запис
       *[other] { $count } записа
    }
help-share-goal = Помогнете ни да намерим повече гласове, споделете целта си
confirm-goal = Потвърждаване на цел
goal-interval-weekly = Седмично
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Споделете вашата дневна цел от { $count } записа за { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Споделете вашата седмична цел от { $count } записа за { $type }
share-goal-type-speak = Говорене
share-goal-type-listen = Слушане
share-goal-type-both = Говорене и слушане
# LINK will be replaced with the current URL
goal-share-text = Току-що създадох лична цел за даряване на глас към #CommonVoice - присъединете се и нека да помогнем на машините да научат как говорят истинските хора { $link }
weekly-goal-created = Седмичната ви цел е създадена
daily-goal-created = Дневната ви цел е създадена
track-progress = Следете напредъка си тук и на страницата с вашата статистика.
return-to-edit-goal = Върнете се тук, за да променяте целите си по всяко време.
share-goal = Споделяне на моята цел

## Goals

streaks = Черти
days =
    { $count ->
        [one] Ден
       *[other] Дена
    }
recordings =
    { $count ->
        [one] Запис
       *[other] Записи
    }
validations =
    { $count ->
        [one] Проверка
       *[other] Проверки
    }
