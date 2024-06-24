## Dashboard

your-languages = Тонь кяльхне
toward-next-goal = Сяда товолдонь сатфкссь
goal-reached = Сатфксне пяшкотьфт
clips-you-recorded = Сёрматфат
clips-you-validated = Кемокстайть
todays-recorded-progress = Тячи тиф «Common Voice»-са сёрматфкста
todays-validated-progress = Тячи видеста ванф «Common Voice»-са сёрматфкста
stats = Лувксонь няфтемась
awards = Казнет
you = Тон
everyone = Сембе
contribution-activity = Лездыень путфкс
top-contributors = Лездыхне васенцетнень ёткста
recorded-clips = Сёрматф
validated-clips = Видеста ванф и кемокстаф клипне
total-approved = Сембоц видеста ванфта и кемокстафта
overall-accuracy = Сембоц, кона тиф цебярьста
set-visibility = Путомс няевиксшить
visibility-explainer = Мяльс сявомга: Кда арафтови "Няеви", эста тя арафтомась полафтови <profileLink>профилень лопаса</profileLink>
visibility-overlay-note = Няфтемс ломань ёткса монь вастозень
show-ranking = Тиемс целень коряс сатфксс

## Custom Goals

get-started-goals = Тиемс эсь целень коряс сатфкс
create-custom-goal = Кодама целень сатфкс эстейть путоть?
goal-type = Кодама целень сатфкс эстейть путоть?
both-speak-and-listen = И тя, и тона
both-speak-and-listen-long = И тя, и тона (Сёрмадомась и сёрматфксонь видеста ваномась)
daily-goal = Эрь шинь сатфкст
weekly-goal = Эрь недлянь сатфкст
easy-difficulty = Тёждя
average-difficulty = Аф пяк стака
difficult-difficulty = Стака
pro-difficulty = Профессионалонь
lose-goal-progress-warning = Полафтомок эсь целень сатфксцень, юмафтсак касомань коряс вастцень
want-to-continue = Поладсак тевть?
finish-editing = Васеда мяльце шумордамс петнемать?
lose-changes-warning = Лисендярят тя пингть, сембе полафтоматне юмайхть
build-custom-goal = Тиемс эсь целень сатфкс
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Лезтт пачкодемс { $hours } частста { $language }са эсь сатфкснень вельде
       *[other] Лезтт пачкодемс { $hours } частста { $language }са эсь сатфкснень вельде
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Лезтт Common Voice-ти пачкодемс{ $hours } частста эсь сатфкснень вельде
       *[other] Лезтт Common Voice-ти пачкодемс{ $hours } частста эсь сатфкснень вельде
    }
set-a-goal = Путомс целень коряс сатфкс
cant-decide = Кафтолдат? Аф кемат?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } част кочкави ковоньберьф, кда { $periodMonths } ломанць кармай тиема { $people } сёрматфкст шити { $clipsPerDay }
       *[other] { $totalHours } част кочкави ковоньберьф, кда { $periodMonths } ломанць кармай тиема { $people } сёрматфкст шити { $clipsPerDay }
    }{ NUMBER($periodMonths) ->
        [one] { $totalHours } част кочкави ковоньберьф, кда { $periodMonths } ломанць кармай тиема { $people } сёрматфкст шити { $clipsPerDay }
       *[other] { $totalHours } част кочкави ковоньберьф, кда { $periodMonths } ломанць кармай тиема { $people } сёрматфкст шити { $clipsPerDay }
    }{ NUMBER($people) ->
        [one] { $totalHours } част кочкави ковоньберьф, кда { $periodMonths } ломанць кармай тиема { $people } сёрматфкст шити { $clipsPerDay }
       *[other] { $totalHours } част кочкави ковоньберьф, кда { $periodMonths } ломанць кармай тиема { $people } сёрматфкст шити { $clipsPerDay }
    }{ NUMBER($clipsPerDay) ->
        [one] { $totalHours } част кочкави ковоньберьф, кда { $periodMonths } ломанць кармай тиема { $people } сёрматфкст шити { $clipsPerDay }
       *[other] { $totalHours } част кочкави ковоньберьф, кда { $periodMonths } ломанць кармай тиема { $people } сёрматфкст шити { $clipsPerDay }
    }
how-many-per-day = Пяк пара! Мзяра тиеть сёрматфкста шити?
how-many-a-week = Пяк пара! Мзяра сёрматфкста тиеть недляти?
which-goal-type = Тон арьсят сёрмадомс вайгяльть, видеста ваномс-петнемс али кафцьке тефнень кармат тиема?
receiving-emails-info = Кармат получсема тяфтама кулянь сёрмат, коса азови «Common Voice»-нь проектть сатфксонзон колга.
not-receiving-emails-info = Кармат получсема тяфтама сёрмат <bold>А УЧАТ</bold>, конатнень эса азови «Common Voice»-нь проектть сатфксонзон и од кулянзон колга
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } сёрматфта
       *[other] { $count } сёрматфта
    }
help-share-goal = Лезтт тейнек мумс сяда лама вайгяль, нолдайть и няфтить ломань инголи эсь сатфкснень
confirm-goal = Кемекстамс сатфкснень
goal-interval-weekly = Эрь недляня
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Няфтьк эрь шинь { $count } сёрматфксонь сатфксцень { $type } тевть коряс
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Няфтьк эрь недлянь { $count } сёрматфксонь сатфксцень { $type } тевть коряс
share-goal-type-speak = Сёрмадома
share-goal-type-listen = Сёрматфть видеста ваномац-петнемац
share-goal-type-both = Сёрмадомась и видеста ваномась-петнемась
# LINK will be replaced with the current URL
goal-share-text = Аньцек тяни тиень целень сатфкс вайгялень сёрмадомать коряс # CommonVoice -- полатт тейне и лезтт машинатненди шарьхкодемс афкуксонь ломанень корхтамать { $link }
weekly-goal-created = Недлянь сатфкссь ульсь тиф
daily-goal-created = Шинь сатфкссь ульсь тиф
track-progress = Ванк эсь сяськомань вастцень сатфкснень лувксонь лопаса
return-to-edit-goal = Мрдамс сей, штоба полафтомс сатфкснень эрь кодама пингть
share-goal = Лихтить сатфкснень ломанень инголи

## Goals

streaks = Лама ши
days =
    { $count ->
        [one] ши
       *[other] шит
    }
recordings =
    { $count ->
        [one] Вайгялень сёрмадома
       *[other] Вайгялень сёрмадомат
    }
validations =
    { $count ->
        [one] Кемекстамат
       *[other] Кемекстамат
    }

