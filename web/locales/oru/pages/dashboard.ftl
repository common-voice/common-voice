## Dashboard

your-languages = ترتُو ا زبان
toward-next-goal = پېری بېڅه ته مقصد په طرف
goal-reached = مقصد کی رسيېک
clips-you-recorded = ا کلِپی که تُو دی ریکارډ داکِن
clips-you-validated = ا کلِپی که تُو وې توثیق دوک هۀ
todays-recorded-progress = سن ته مشترک آواز ا مخکی څېک ته کلِپی ته ریکارډ کؤ
todays-validated-progress = سن ته مشترک آواز ا مخکی څېک ته کلِپی که څېن يې تُو توثیق دوک هۀ
stats = شمېر
awards = ڒُوک
you = تُو
everyone = هر سړئ
contribution-activity = ا پېش سۀک کری
top-contributors = ا چِګ شریچی
recorded-clips = ا ریکارډ سُک کلِپی
validated-clips = ا توثیق سُک کلِپی
total-approved = اره که ا څېن منظور سُکِن
overall-accuracy = ا مجموعي ټهیک کېڅن
set-visibility = ترمُن ا نظر سېټ کَۀ
visibility-explainer = او سېټنګ بُو ترتُو ا لیډر بورډ ٬ظر کنټرول کوی۔ کن که بُډ بَۀ ترتو مُخکی څېک يې سو ترتُو ذاتي بَۀ۔ ته پۀ مطلب يې او ݭیوک که ترتُو ا تصویر، ته استعمال ته واله ا نام، او ا مخکی څېک سُو لیډربورډ زر نک جَوَتېک سَۀ۔ آ ګۀ نوټ کېون که ا لیډربورډ دی بُو { $minutes } مینِټی وُری که ا تبدیلي جَوَتوی
visibility-overlay-note = نوټ: که کان ”Visible” زر سېټ بَۀ او سېټنګ بُو تبدیل اېنچی <profileLink> پروفائل صفخه کی
show-ranking = ترمُن ا رېنکِنګ جَوَت کَۀ

## Custom Goals

get-started-goals = مقصد ګیرډه شُوري کَۀ
create-custom-goal = کسټم ګول يې جوړ کَۀ
goal-type = ا څېن نمونۀ ګول يې جوړؤ زیئی؟
both-speak-and-listen = ا دیو ګډ
both-speak-and-listen-long = ا دوګډ (غوېک او امريېک)
daily-goal = ریوزانۀ ګول
weekly-goal = هفته وار ګول
easy-difficulty = اسان
average-difficulty = میانۀ
difficult-difficulty = مشکِل
pro-difficulty = پرو
lose-goal-progress-warning = ته ګول ته اېډټ کؤ په وختت بُو ا موجودۀ مخکی څېک ګۀ حبطه کېک سَۀ
want-to-continue = تُو وه بُو جاري سېنی؟
finish-editing = اول ا اېډیټنګ ختُم کَۀ؟
lose-changes-warning = ته پېری ا وتک وې مطلب او ݭیوک که ا تبدیلئې دی که ا څېن داکِن، افئ سُو ضائع سېن
build-custom-goal = کسټم ګول يې جوړ کَۀ
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] { $hours } ګهېنټۀ نر { $language } خوئ مقصد کی رس
       *[other] { $hours } ګهېنټي نر { $language } خوئ مقصد کی رس
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] { $hours } ګهېنټۀ  نر ته مشترک آواز ته سۀ زبان ای خوئ مقصد کی رس
       *[other] { $hours } ګهېنټي  نر ته مشترک آواز ته سۀ زبان ای خوئ مقصد کی رس
    }
set-a-goal = ا مقصد دل ټېپن
cant-decide = فیصلۀ يې بُو نک اېنچِم
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
            }
    }
how-many-per-day = څُون کلِپ ریوزانۀ؟
how-many-a-week = زبردست۔ څُون کلِپ ریوزانۀ؟
which-goal-type = تُو بُو غؤس که ژغ، امر، یا ا دُوګډ؟

## Goals

