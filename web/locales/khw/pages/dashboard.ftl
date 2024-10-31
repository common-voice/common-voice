## Dashboard

your-languages = تہ زبان
toward-next-goal = نوغ مقصدو ویلٹی
goal-reached = مقصد پورا ہوئی
clips-you-recorded = ہوازان رکارڈ ارو
clips-you-validated = ہوازان توثیق ارو
todays-recorded-progress = ہنونو کمان وائسو ہواز رکارڈکوریکوسورا کوروم
todays-validated-progress = ہنونو کمان وائسو اوازان توثیق کوریکوسورا کوروم
stats = حالات
awards = تمغہ
you = تو
everyone = ہر کا
contribution-activity = مدد کوریکو کوروم
top-contributors = سافو سار زیاد مدد کوراک
recorded-clips = رکارڈ بیرو ہواز
validated-clips = تصدیق بیرا ہواز
total-approved = تمام منظور بیرو
overall-accuracy = تمام سہی
set-visibility = مہ پشیکو تین سیٹ کو
visibility-explainer = ہیا سیٹنگ تہ لوڈر بورڈو پشیکو کنٹرول کویان۔ کیاوحت کی کوشتیتاو تہ کروم رازا بہچور۔ ہمو مطلب ہیا کی تہ فوٹو، استعمال بک نام وا کوروم لوڈر بورڈا غیچی نو گوئے۔ ہیا لوو نوٹ کوکی لوڈر بورڈو نوغ بیکو وا تبدیلی ہیرا گیگو پیچین { $minutes } منٹ گنیر
visibility-overlay-note = نوٹ: کیا وحت پشیکو پچین کی سیٹنگ کوسان۔ ہیا سیٹنگ <profileLink>بی کوریلیک بوئے۔پروفائل پیج</profileLink>
show-ranking = مہ درجو پشاوے

## Custom Goals

get-started-goals = مقصدان گنی شروع کو
create-custom-goal = ای تان مرضیا مقصد لکھے
goal-type = تو کیا قسمہ مقصد لکھیک مݰکیسان؟
both-speak-and-listen = جو کھاڑ
both-speak-and-listen-long = کھاڑ (لودیت وا کار کورے)
daily-goal = انوسو مقصد
weekly-goal = ہفتو مقصد
easy-difficulty = مضمون
average-difficulty = اوسظ
difficult-difficulty = مشکل
pro-difficulty = حمایتی
lose-goal-progress-warning = تان حدفو ایڈیک کی ارو، تہ کوروم تونج دی بوئے۔
want-to-continue = تو جاری سوتیک مݰکیسانا؟
finish-editing = پوشٹی ایڈیٹنگو  ختم کو
lose-changes-warning = ہنیسے ہموغار بیکو مطلب ہیا کی تو بدل دیروان نو لکھیک مشکیسان
build-custom-goal = تان تین ای حدف لکھے
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] { $hours } گھنٹہ { $language } زبانا تان ذاتی حدف پورا کوریکا مدد کو
       *[other] { $hours } گھنٹہ{ $language } زبانا تان ذاتی مقصدو پورا کوریکو مدد کو
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] کمان وائسو { $hours }گھنٹہ ای زبانا تان ذاتی حدفو پورا کوریکا مدد کو
       *[other] کمان وائسو { $hours }گھنٹہ ای زبانا تان ذاتی مقصدو پورا کوریکا مدد کو
    }
set-a-goal = ای حدف لکھے
cant-decide = فیصلہ کوریکو نو بوسانا؟
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
how-many-per-day = بوجام! ای انوس کندوری ہواز؟
how-many-a-week = بوجام! ای ہفتہ کندوری ہواز ؟
which-goal-type = تو لوو دیک مݰکیسانا، کارکوریک ِیا جوکھاڑان؟
receiving-emails-info = موجودہ وختا تہ سیٹنگ ہݰ شیر کہ تہ تین تہ مقصدو یاد کوریکو پچین ای میل گونی۔
not-receiving-emails-info = موجودہ وختا تہ سیٹنگ ہݰ شیر<bold>نو </bold> کہ تہ تین تہ مقصدو یاد کوریکو، تہ کورمو اپڈیٹ، وا کمان وائسو بارا نیوز لیٹر گونی۔
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } اسکوردی ہواز
       *[other] { $count } اسکوردی ہواز
    }
help-share-goal = اسپہ سون خور ہواز مݰکیکا مدد کو۔ تان حدفو لو دیت
confirm-goal = حدفو تصدیق کو
goal-interval-weekly = ہفتہ وار
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = اسپہ تین تان { $count } ہوازان انوسو حدف{ $type } بارا لوو دیت۔
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = اسپہ تین تان { $count } ہوازان ہفتے حدف{ $type } بارا لوو دیت۔
share-goal-type-speak = لو دیک
share-goal-type-listen = کار کوریک
share-goal-type-both = لو دیک وا کارکوریک
# LINK will be replaced with the current URL
goal-share-text = اوا #CommonVoice تین وقف کوریکو پچین تان انوسو حدفو لکھیتام۔ مہ سون اصل روئے کیچہ کوری لو دونیان رے  مشنیو  ݯھیھیکو پیچین شامل بوس وا مدد کو
weekly-goal-created = تہ ہفتہ وار حدف ساوز ہوئے
daily-goal-created = تہ انوسو حدف ساوز ہوئے
track-progress = تان کروم کندوری ہوئی رے ہیا پتہ کو وا تان سٹیٹس پیجا
return-to-edit-goal = ہیا گیتی کیا وحت دی  تو تان مقصد تبدیل کوریکو بوس۔
share-goal = مہ مقصدو خوران تین انځاوے

## Goals

streaks = لکیر
days =
    { $count ->
        [one] بس
       *[other] بس
    }
recordings =
    { $count ->
        [one] رکارڈنگ
       *[other] رکارڈنگ
    }
validations =
    { $count ->
        [one] توثیق
       *[other] تو ثیق
    }
