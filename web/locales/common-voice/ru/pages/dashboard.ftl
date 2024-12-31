## Dashboard

your-languages = Ваши языки
toward-next-goal = Следующая цель
goal-reached = Цель достигнута
clips-you-recorded = Вы записали
clips-you-validated = Вы проверили
todays-recorded-progress = Сегодня сделано записей на Common Voice
todays-validated-progress = Сегодня проверено записей на Common Voice
stats = Статистика
awards = Награды
you = Вы
everyone = Все пользователи
contribution-activity = Вклад помощника
top-contributors = Топ помощников
recorded-clips = Озвучено
validated-clips = Проверено
total-approved = Всего проверено
overall-accuracy = Общая точность
set-visibility = Настроить мою видимость
visibility-explainer = Этот параметр контролирует вашу видимость в топе. Когда вы скрыты, ваш прогресс будет приватным. Это означает, что ваше изображение, имя пользователя и прогресс не будут отображаться в списке лидеров. Обратите внимание, что обновление списка лидеров занимает примерно { $minutes } минут.
visibility-overlay-note = Примечание: Если установлено «Видимый», то этот параметр можно изменить на <profileLink>странице профиля</profileLink>
show-ranking = Показать мой рейтинг

## Custom Goals

get-started-goals = Создать цель
create-custom-goal = Создать собственную цель
goal-type = Какой цели вы хотите достичь?
both-speak-and-listen = И то, и другое
both-speak-and-listen-long = И то, и другое (Запись и проверка)
daily-goal = Дневная цель
weekly-goal = Недельная цель
easy-difficulty = Легко
average-difficulty = Средне
difficult-difficulty = Сложно
pro-difficulty = Про
lose-goal-progress-warning = Изменив свою цель, вы можете потерять существующий прогресс.
want-to-continue = Вы хотите продолжить?
finish-editing = Хотите сначала закончить редактирование?
lose-changes-warning = Уход сейчас означает, что вы потеряете сделанные изменения
build-custom-goal = Создать собственную цель
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Помогите достичь { $hours } часа на { $language } с помощью личной цели
        [few] Помогите достичь { $hours } часов на { $language } с помощью личной цели
       *[many] Помогите достичь { $hours } часов на { $language } с помощью личной цели
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Помогите Common Voice достичь { $hours } часа на этом языке с помощью личной цели
        [few] Помогите Common Voice достичь { $hours } часов на этом языке с помощью личной цели
       *[many] Помогите Common Voice достичь { $hours } часов на этом языке с помощью личной цели
    }
set-a-goal = Поставить цель
cant-decide = Не можете решиться?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } час достижимо за
        [few] { $totalHours } часа достижимо за
       *[many] { $totalHours } часов достижимо за
    }{ NUMBER($periodMonths) ->
        [one] { $periodMonths } месяц если
        [few] { $periodMonths } месяца если
       *[many] { $periodMonths } месяцев если
    }{ NUMBER($people) ->
        [one] { $people } человек будут делать
        [few] { $people } человека будут делать
       *[many] { $people } человек будут делать
    }{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } запись в день.
        [few] { $clipsPerDay } записи в день.
       *[many] { $clipsPerDay } записей в день.
    }
how-many-per-day = Отлично! Сколько записей в день?
how-many-a-week = Отлично! Сколько записей в неделю?
which-goal-type = Вы хотите записывать, проверять или и то, и другое?
receiving-emails-info =
    Вы будете получать такие письма, как напоминания о целях, уведомления
    о своих достижениях и новости о Common Voice.
not-receiving-emails-info = Вы <bold>НЕ</bold> будете получать такие письма, как напоминания о целях, уведомления о достижениях и новости о Common Voice.
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } запись
        [few] { $count } записи
       *[many] { $count } записей
    }
help-share-goal = Помогите нам найти больше голосов, поделитесь своей целью
confirm-goal = Подтвердить цель
goal-interval-weekly = Каждую неделю
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Поделитесь свой целью { $count } записей в день для { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Поделитесь своей целью { $count } записей в неделю для { $type }
share-goal-type-speak = Запись
share-goal-type-listen = Проверка
share-goal-type-both = Запись и проверка
# LINK will be replaced with the current URL
goal-share-text = Я только что создал(а) личную цель для голосового пожертвования #CommonVoice -- присоединяйтесь ко мне и помогите машинам научиться понимать реальных людей { $link }
weekly-goal-created = Ваша недельная цель была создана
daily-goal-created = Ваша дневная цель была создана
track-progress = Отслеживайте свой прогресс здесь и на странице статистики.
return-to-edit-goal = Возвращайтесь сюда, чтобы изменить свою цель в любое время.
share-goal = Поделиться моей целью

## Goals

streaks = Дней подряд
days =
    { $count ->
        [one] день
        [few] дня
       *[many] дней
    }
recordings =
    { $count ->
        [one] запись
        [few] записи
       *[many] записей
    }
validations =
    { $count ->
        [one] проверка
        [few] проверки
       *[many] проверок
    }
