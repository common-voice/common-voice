## Dashboard

your-languages = ستاسو ژبې
toward-next-goal = د راتلونکي موخې په لور
goal-reached = موخې ته ورسید
clips-you-recorded = کليپونه چې تاسو ثبت کړي
clips-you-validated = کليپونه چې تاسو تایید کړي
todays-recorded-progress = د ثبت کلیپونو د نن ورځې د عامه غږ پرمختګ
todays-validated-progress = د تایید کلیپونو د نن ورځې د عامه غږ پرمختګ
stats = ارقام
awards = جایزې
you = تاسو
everyone = هرڅوک
contribution-activity = د مرستې چارندتیا
top-contributors = مخکښ مرسته کوونکي
recorded-clips = ثبت شوي کليپونه
validated-clips = تایید شوي کلیپونه
total-approved = ټولټال منل شوي
overall-accuracy = په ټولیز ډول کره‌توب
set-visibility = زما لید تنظیم کړئ
visibility-explainer = دا امستنه ستاسو د مخکښ-بورډ لید کنټرولوي. کله چې پټ وي، ستاسو پرمختګ به خصوصي وي. دا پدې مانا ده چې ستاسو عکس، د کارن نوم او پرمختګ به په مخکښ-بورډ کې څرګند نشي. په یاد ولرئ چې د لیډربورډ بیا سمسورول د بدلونونو د اغیز لپاره ~ { $minutes } دقیقې وخت نیسي.
visibility-overlay-note = یادونه: کله چې 'څرګند' ته ټاکل شوې وي، نو دا امستنه د <profileLink>پېژنیال پاڼه</profileLink> څخه بدلیدلی شي
show-ranking = زما درجه بندي وښایاست

## Custom Goals

get-started-goals = په موخو باندې پیل وکړئ
create-custom-goal = دودیز موخه رامینځته کړئ
goal-type = تاسو کوم ډول موخې غواړئ جوړوي کړئ؟
both-speak-and-listen = دواړه
both-speak-and-listen-long = دواړه (خبرې وکړئ او واورئ)
daily-goal = ورځنۍ موخه
weekly-goal = د اونۍ موخه
easy-difficulty = اسانه
average-difficulty = اوسط
difficult-difficulty = ستونزمن
pro-difficulty = مسلکي
lose-goal-progress-warning = د خپل موخې په سمون سره، تاسو ممکن خپل شته پرمختګ له لاسه ورکړئ.
want-to-continue = ایا تاسو دوام ورکول غواړې؟
finish-editing = لومړی سمون بشپړ کړئ؟
lose-changes-warning = اوس پرېښودل پدې معنی چې تاسو به خپل بدلونونه له لاسه ورکوئ
build-custom-goal = دودیز موخه جوړه کړئ
help-reach-hours-pluralized =
    مرسته وکړئ چې ورسیږو{ NUMBER($hours) ->
        [one] { $hours } ساعت
       *[other] { $hours } ساعتونه
    }په { $language } کې د شخصي موخې سره
help-reach-hours-general-pluralized =
    رسیدو ته د عام ږغ سره مرسته وکړئ{ NUMBER($hours) ->
        [one] { $hours } ساعت
       *[other] { $hours } ساعتونه
    }په یوې ژبې کې شخصي موخه ولري
set-a-goal = یوه موخه وټاکئ
cant-decide = پریکړه نشئ کولئ؟
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] { $totalHours } ساعت
       *[other] { $totalHours } ساعتونه
    }د لاسته راوړلو وړ یوازي په { NUMBER($periodMonths) ->
        [one] { $periodMonths } میاشت
       *[other] { $periodMonths } میاشتې
    }که چیرې{ NUMBER($people) ->
        [one] { $people } کس
       *[other] { $people } خلک
    }ثبتونه{ NUMBER($clipsPerDay) ->
        [one] { $clipsPerDay } کلیپ
       *[other] { $clipsPerDay } کلیپونه
    } په یوه ورځ
how-many-per-day = غوره! په ورځ کې څو کلیپونه؟
how-many-a-week = غوره! په اونۍ کې څو کلیپونه؟
which-goal-type = ایا تاسو غواړئ چې وغږیږئ، واورئ یا دواړه؟
receiving-emails-info =
    تاسو دا مهال د برېښنالیکونو لکه د موخې یادونه، زما
    د پرمختګ په اړه تازه مالومات او د ګډ غږ په اړه خبرلیکونو ترلاسه کولو لپاره ټاکل شوي یاست
not-receiving-emails-info =
    تاسو دا مهال بریښنالیکونه  لکه د موخې یادونه، زما
    د پرمخ تګ په اړه تازه مالومات او د ګډ غږ په اړه خبرلیکونه <bold> نه </bold> ترلاسه کوئ
n-clips-pluralized =
    { NUMBER($count) ->
        [one] کلیپ
       *[other] کلیپونه
    }
help-share-goal = موږ سره د نورو غږونو موندلو کې مرسته وکړئ، خپل موخه شریک کړئ
confirm-goal = د موخې تصدیق وکړئ
goal-interval-weekly = اونيز
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = د خپل { $count } کليپ ورځنۍ موخه د { $type } لپاره شریک کړئ
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = د خپل { $count } کليپ اونېزې موخې د { $type } لپاره شریک کړئ
share-goal-type-speak = غږیدل
share-goal-type-listen = اوریدل
share-goal-type-both = خبرې کول او اوریدل
# LINK will be replaced with the current URL
goal-share-text = ما دا اوس CommonVoice# ته د غږ بسپنه کولو لپاره شخصي موخه رامینځته کړه - ما سره یوځای شئ او ماشینونو ته چې څنګه ریښتیني خلک خبرې کوي ښوولو کې مرسته وکړئ { $link }
weekly-goal-created = ستاسو اونېزه موخه رامینځته شوی
daily-goal-created = ستاسو ورځنۍ موخه رامینځته شوی
track-progress = دلته او ستاسو د شمیرو په پاڼه کې پرمختګ تعقیب کړئ.
return-to-edit-goal = هر وخت د خپلې موخې سمولو لپاره دلته بیرته راشئ.
share-goal = زما موخه شریک کړئ

## Goals

streaks = سټرېکونه
days =
    { $count ->
        [one] ورځ
       *[other] ورځې
    }
recordings =
    { $count ->
        [one] ثبت
       *[other] ثبتونه
    }
validations =
    { $count ->
        [one] تایید
       *[other] تاییدونه
    }
