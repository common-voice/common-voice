## Dashboard

your-languages = Вашы мовы
toward-next-goal = Наступная мэта
goal-reached = Мэта дасягнута
clips-you-recorded = Кліпаў запісана вамі
clips-you-validated = Кліпаў праверана вамі
todays-recorded-progress = Сённяшні прагрэс Common Voice па запісу кліпаў
todays-validated-progress = Сённяшні прагрэс Common Voice па праверцы кліпаў
stats = Статыстыка
awards = Узнагароды
you = Вы
everyone = Усе ўдзельнікі
contribution-activity = Актыўнасць удзелу
top-contributors = Топ удзельнікаў
recorded-clips = Запісана кліпаў
validated-clips = Праверана кліпаў
total-approved = Усяго зацверджана
overall-accuracy = Агульная дакладнасць
set-visibility = Змяніць маю бачнасць
visibility-explainer = Гэтая налада кантралюе вашу бачнасць у рэйтынгу ўдзельнікаў. Калі выбраць "Схаваны", ваш прагрэс будзе прыватным. Гэта значыць, ваша выява, імя карыстальніка і прагрэс не будуць адлюстроўвацца ў рэйтынгу. Звярніце ўвагу, што абнаўленне рэйтынгу займае ~{ $minutes } хвілін.
visibility-overlay-note = Заўвага: Калі выбраць "Бачны", то пазней гэтую наладу можна будзе змяніць на <profileLink>старонцы профіля</profileLink>
show-ranking = Паказаць маю пазіцыю

## Custom Goals

get-started-goals = Пазнаёмцеся з мэтамі
create-custom-goal = Стварыць асабістую мэту
goal-type = Якую мэту Вы хочаце паставіць?
both-speak-and-listen = І тое, і другое
both-speak-and-listen-long = І тое, і другое (агучваць і правяраць)
daily-goal = Дзённая мэта
weekly-goal = Тыднёвая мэта
easy-difficulty = Лёгка
average-difficulty = Нармальна
difficult-difficulty = Цяжка
pro-difficulty = Профі
lose-goal-progress-warning = Рэдагуючы сваю мэту, вы можаце страціць свой прагрэс.
want-to-continue = Хочаце працягнуць?
finish-editing = Спачатку скончыць рэдагаванне?
lose-changes-warning = Калі вы выйдзеце зараз, зробленыя вамі змены не захаваюцца
build-custom-goal = Стварыце ўласную мэту
help-reach-hours-pluralized =
    Дапамажыце дасягнуць{ NUMBER($hours) ->
        [one] { $hours } гадзіну
        [few] { $hours } гадзін(ы)
       *[many] { $hours } гадзін(ы)
    } на { $language } мове з асабістай мэтай
help-reach-hours-general-pluralized =
    Дапамажыце Common Voice дасягнуць{ NUMBER($hours) ->
        [one] { $hours } гадзіну
        [few] { $hours } гадзін(ы)
       *[many] { $hours } гадзін(ы)
    } на гэтай мове з асабістай мэтай.
set-a-goal = Паставіць мэту
cant-decide = Не можаце вырашыць?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } гадзіна
        [few] { $totalHours } гадзін(ы)
       *[many] { $totalHours } гадзін(ы)
    } можна дасягнуць усяго за{ NUMBER($periodMonths) ->
        [one] { $periodMonths } месяц
        [few] { $periodMonths } месяцы(-аў)
       *[many] { $periodMonths } месяцы(-аў)
    }, калі{ NUMBER($people) ->
        [one] { $people } чалавек
        [few] { $people } чалавек(і)
       *[many] { $people } чалавек(і)
    } будуць рабіць{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } запіс
        [few] { $clipsPerDay } запісы(-аў)
       *[many] { $clipsPerDay } запісы(-аў)
    } штодзень.
how-many-per-day = Выдатна! Колькі кліпаў у дзень?
how-many-a-week = Выдатна! Колькі кліпаў у тыдзень?
which-goal-type = Вы хочаце агучваць, правяраць альбо і тое, і другое?
receiving-emails-info = Вы будзеце атрымліваць лісты, такія як напаміны аб мэтах, паведамленні пра свае дасягненні і навіны пра Common Voice.
not-receiving-emails-info = Вы <bold>НЕ</bold> будзеце атрымліваць лісты, такія як напаміны аб мэтах, паведамленні пра свае дасягненні і навіны пра Common Voice.
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } запіс
        [few] { $count } запісы
       *[many] { $count } запісаў
    }
help-share-goal = Дапамажыце нам знайсці больш галасоў, падзяліцеся сваёй мэтай
confirm-goal = Пацвердзіць мэту
goal-interval-weekly = На тыдзень
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Падзяліцеся вашай дзённай мэтай – { $type } { $count } кліпаў
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Падзяліцеся вашай тыднёвай мэтай – { $type } { $count } кліпаў
share-goal-type-speak = Агучванне
share-goal-type-listen = Праверка
share-goal-type-both = Агучванне і праверка
# LINK will be replaced with the current URL
goal-share-text = Цяпер у мяне ёсць асабістая мэта ахвяравання голасу для #CommonVoice -- далучайцеся, давайце дапаможам машынам навучыцца разумець чалавечы голас { $link }
weekly-goal-created = Ваша тыднёвая мэта створана
daily-goal-created = Ваша дзённая мэта створана
track-progress = Сачыце за прагрэсам тут ці на старонцы з вашай статыстыкай.
return-to-edit-goal = Каб рэдагаваць вашу мэту, можна вярнуцца сюды ў любы час.
share-goal = Падзяліцца маёй мэтай

## Goals

streaks = Дзён запар
days =
    { $count ->
        [one] Дзень
        [few] Дні
       *[many] Дзён
    }
recordings =
    { $count ->
        [one] Запіс
        [few] Запісы
       *[many] Запісаў
    }
validations =
    { $count ->
        [one] Праверка
        [few] Праверкі
       *[many] Праверак
    }
