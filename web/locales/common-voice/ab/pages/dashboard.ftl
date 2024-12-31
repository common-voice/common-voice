## Dashboard

your-languages = Убызшәақәа
toward-next-goal = Анаҩстәи ахықәкы.
goal-reached = Ахықәкы нагӡоуп
clips-you-recorded = Абжьы Зхауҵаз Анҵамҭақәа
clips-you-validated = Игәауҭаз Анҵамҭақәа
todays-recorded-progress = Common Voice аҟны иахьа анҵамҭақәа ҟаҵоуп.
todays-validated-progress = Common Voice аҟны иахьа анҵамҭақәа гәаҭоуп.
stats = Аста.
awards = Аҳам.
you = Уара
everyone = Ахархәаҩцәа зегьы
contribution-activity = Аусура аҽалархәра
top-contributors = Ахархәаҩцәа ртоп
recorded-clips = Анҵамҭақәа абжьы ахарҵеит
validated-clips = Анҵамҭақәа гәаҭан
total-approved = Зынӡа игәаҭоуп.
overall-accuracy = Азеиԥш иашара.
set-visibility = Сара сҷыдахәра арбара
visibility-explainer = Ари апараметр уара утоп аҟны уыҟазаара иацхраауеимт. Уара уанӡыргамха упрогрессгьы зӡыргахом. Уи иаанаго аԥхьагылаҩцәа рсиаҟны уара ухаҿсахьеи, ухархәагатә хьӡи упрогресси арбахаӡом ҳәа ауп. Хырҩа азуы аԥхьагылаҩцәа рсиа арҿыцра инықәырԥшны ~ { $minutes } шаҭаху.
visibility-overlay-note = Азгәаҭа: 'Иубарҭоу' апрограмма шьақәыргылазар, ари аҳәаа ԥсаххар ҟалоит <profileLink>аҷыдахәра адаҟьа</profileLink> аҟны.
show-ranking = Сҭыԥ исырба

## Custom Goals

get-started-goals = Ахықәкқәа уалага
create-custom-goal = Еиқәшәо ахықәкы аԥҵара
goal-type = Иарбан хықәку анагӡара иуҭаху?
both-speak-and-listen = Аҩбагьы
both-speak-and-listen-long = Аҩбагьы (Аҭаҩреи Азыӡырҩреи)
daily-goal = Есымшатәи Ахықәкы
weekly-goal = Есымчыб­жьатәи Ахықәкы
easy-difficulty = Имариоуп
average-difficulty = Ибжьаратәуп
difficult-difficulty = Ицәгьоуп
pro-difficulty = Про
lose-goal-progress-warning = Ухықәкы аԥсахраан иумоу апрогресс уцәыӡыр ҟалоит.
want-to-continue = Уҿызаароума?
finish-editing = Уи аԥхьа аԥсахра уалгар уҭахума?
lose-changes-warning = Уажәы уцар, иҟоуҵахьоу аԥсахрақәа уцәыӡыр ҟалоит.
build-custom-goal = Еиқәшәо ахықәкы аҟаҵара
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] Ацхыраара анаӡара { $hours } сааҭ { $language } ахатә хықәкыла
       *[other] Ацхыраара анаӡара { $hours } сааҭқәа { $language } ахатә хықәкыла
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] Ацхыраара Азеиԥш бжьы анаӡара { $hours } сааҭк абри абызшәала хаҭалатәи хықәкык аманы
       *[other] Ацхыраара Азеиԥш Бжьы анаӡара { $hours } сааҭқәа ари абызшәала хаҭалатәи хықәкык аманы
    }
set-a-goal = Ухықәкы цәырга
cant-decide = Иузымгәаӷьӡои?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } асааҭ анагӡара алшоит{ $periodMonths } амза акәзар{ $people } уаҩы иҟаиҵоит{ $clipsPerDay } fҭаҩра ҽнак ала.
                               *[other] { $totalHours } асааҭ анагӡара алшоит{ $periodMonths } амза акәзар{ $people } уаҩы иҟаиҵоит{ $clipsPerDay } аҭаҩрақәа ҽнак ала.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } асааҭ анагӡара алшоит{ $periodMonths } амза акәзар{ $people } ауаа иҟарҵоит{ $clipsPerDay } fҭаҩра ҽнак ала.
                               *[other] { $totalHours } асааҭ анагӡара алшоит{ $periodMonths } амза акәзар{ $people } ауаа иҟарҵоит{ $clipsPerDay } аҭаҩрақәа ҽнак ала.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } асааҭ анагӡара алшоит{ $periodMonths } мызқәак акәзар{ $people } уаҩы иҟаиҵоит{ $clipsPerDay } fҭаҩра ҽнак ала.
                               *[other] { $totalHours } асааҭ анагӡара алшоит{ $periodMonths } мызқәак акәзар{ $people } уаҩы иҟаиҵоит{ $clipsPerDay } аҭаҩрақәа ҽнак ала.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } асааҭ анагӡара алшоит{ $periodMonths } мызқәак акәзар{ $people } ауаа иҟарҵоит{ $clipsPerDay } fҭаҩра ҽнак ала.
                               *[other] { $totalHours } асааҭ анагӡара алшоит{ $periodMonths } мызқәак акәзар{ $people } ауаа иҟарҵоит{ $clipsPerDay } аҭаҩрақәа ҽнак ала.
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } асааҭқәа рзы анагӡара алшоит{ $periodMonths } амза акәзар{ $people } уаҩы иҟаиҵоит{ $clipsPerDay } fҭаҩра ҽнак ала.
                               *[other] { $totalHours } асааҭқәа рзы анагӡара алшоит{ $periodMonths } амза акәзар{ $people } уаҩы иҟаиҵоит{ $clipsPerDay } аҭаҩрақәа ҽнак ала.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } асааҭқәа рзы анагӡара алшоит{ $periodMonths } амза акәзар{ $people } ауаа иҟарҵоит{ $clipsPerDay } fҭаҩра ҽнак ала.
                               *[other] { $totalHours } асааҭқәа рзы анагӡара алшоит{ $periodMonths } амза акәзар{ $people } ауаа иҟарҵоит{ $clipsPerDay } аҭаҩрақәа ҽнак ала.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } асааҭқәа рзы анагӡара алшоит{ $periodMonths } мызқәак акәзар{ $people } уаҩы иҟаиҵоит{ $clipsPerDay } fҭаҩра ҽнак ала.
                               *[other] { $totalHours } асааҭқәа рзы анагӡара алшоит{ $periodMonths } мызқәак акәзар{ $people } уаҩы иҟаиҵоит{ $clipsPerDay } аҭаҩрақәа ҽнак ала.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } асааҭқәа рзы анагӡара алшоит{ $periodMonths } мызқәак акәзар{ $people } ауаа иҟарҵоит{ $clipsPerDay } fҭаҩра ҽнак ала.
                               *[other] { $totalHours } асааҭқәа рзы анагӡара алшоит{ $periodMonths } мызқәак акәзар{ $people } ауаа иҟарҵоит{ $clipsPerDay } аҭаҩрақәа ҽнак ала.
                            }
                    }
            }
    }
how-many-per-day = Ибзиоуп! Ҽнак заҟа нҵамҭа?
how-many-a-week = Абзаиӡа! Шаҟа анҵамҭақәа мчыбжьык ала?
which-goal-type = Уара иҭауҩҩыр уҭаху, игәоуҭарц акәу, мамзаргьы аҩускгьы ҟауҵарц угәы иҭоу?
receiving-emails-info = Уара иуоулоит ухықәкы угәалазыршәа, аус ахьынӡа пеихьоуи, Common Voice иадҳәалоу ажәабыжьқәа ртәы зҳәо асалам шәыҟәқәа.
not-receiving-emails-info =
    Уара <bold>МАП</bold> аҟны иуоулоит ухықәкы угәалазыршәои, уусқәа ахьынӡанеихьоуи Common Voice 
    иадҳәалоу ажәабжьқәа ртәы зҳәо асалам шәыҟәқәа
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } аҭаҩра
       *[other] { $count } аҭаҩрақәа
    }
help-share-goal = Ухықәкы ҳаҳәа, абжьы рацәа рыԥшаараҟны уҳацхраа.
confirm-goal = Ухықәкы шьақәырӷәӷәа
goal-interval-weekly = Есымчыб­жьатәи
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = Ухықәкы - { $count } нҵамҭак есыҽны { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = Ухықәкы - { $count } нҵамҭа есымчыбжьа { $type }
share-goal-type-speak = Абжьы ҭаҩра
share-goal-type-listen = Азыӡырҩра
share-goal-type-both = Абжьы ҭаҩреи Азыӡырҩреи
# LINK will be replaced with the current URL
goal-share-text = Сара абыржәы #CommonVoice сыбжьы аҭаразы ахықәкы сымоуп. Шәсыцхраа амашьынақәа хаҭала ауаа еилыркаауа рыҟаҵара аус аҟны { $link }
weekly-goal-created = Мчыбжьыктәи ухықәкы нагӡоуп
daily-goal-created = Ҽнактәи ухықәкы нагӡоуп
track-progress = Абреи астатистикатә даҟьаҟны уеизҳашьа уашьклаԥшла.
return-to-edit-goal = Ианакәзаалак ухықәкы аԥсахразы абрахь ухынҳәы.
share-goal = Схықәкы еиҩша

## Goals

streaks = Еишьҭыргыланы
days =
    { $count ->
        [one] мышкы
       *[other] мыш
    }
recordings =
    { $count ->
        [one] нҵамҭак
       *[other] нҵамҭак
    }
validations =
    { $count ->
        [one] Гәаҭарак
       *[other] Гәаҭарак
    }
