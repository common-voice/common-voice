## Dashboard

your-languages = تھاریاں ٻولیاں
toward-next-goal = اگلے لکشے کی ترپ
goal-reached = لکشے تائی پُگی گا
clips-you-recorded = ٹُکڑے جکو تھمون ریکارڈ کرے ہیں
clips-you-validated = ٹُکڑا تھمون پک کرا ہے
todays-recorded-progress = ریکارڈ کروڑے ٹُکڑیپ  آج کی سادھارٹؔ آواجا کی پرگتی
todays-validated-progress = ٹُکڑیپ آج کی عام آواجا کی پرگتی پکی ہے
stats = آکڑے
awards = پُرسکار
you = توں
everyone = سارے
contribution-activity = یوگدان کا گتی ویدھی
top-contributors = ساریں سے ودھیک یوگدان کروڑا
recorded-clips = ریکارڈ کروڑے ٹُکڑے
validated-clips = پکے ٹُکڑے
total-approved = سارے سیوکار
overall-accuracy = سارے سئہی
set-visibility = میرا نجریا سئہی کرو
visibility-explainer = یو کتار آپ کے لیڈر بورڈا کے نجریے کُو کابُو کرتی ہے۔ جِدؔ چھپی جاوئے تو، آپ کی پرگتی اپٹؔی ہؤگی. اس کا متلب ہے کہ آپ کا پھوٹُو ، چلانواڑے کا ناو اور پرگتی لیڈر بورڈاپ  چاوی نائی ہؤے۔ دھیانام راکھو کہ لیڈر بورڈ ریفریش بدلاو کُو آباد کرنے نتر ~{ $minutes }منٹ لگاوتا ہے۔
visibility-overlay-note = ھینام: جِدؔ 'پرگھٹ' سیٹ کرتے ہے تو  ، اس کتارا کُو <profileLink>پروپھائل پنیں</profileLink> سے بدلی کری سِکتے ہے۔
show-ranking = میری رینکنگ دؔیکھاو

## Custom Goals

get-started-goals = لکشے کے ساتھ سَرو کرو
create-custom-goal = اپٹؔی مرجیا کے لکَشے ٻٹؔاو
goal-type = آپ کس جُو لکشے ٻٹؔاوٹؔا چاوہتے ہیں؟
both-speak-and-listen = دُؔونھیں
both-speak-and-listen-long = دُؔونھیں (ٻولو اور سُٹؔو)
daily-goal = روجینا کا لکشے
weekly-goal = ٻیسپت وار لکشے
easy-difficulty = سولا
average-difficulty = لگھ بھگ
difficult-difficulty = کٹھن
pro-difficulty = پرو
lose-goal-progress-warning = اپٹؔے لکشیم  ایڈیٹنگ کری کن ، آپ اپٹؔی موجودہ پرگتی کھولی سِکتے ہیں۔
want-to-continue = کیا آپ ودھاوٹؔا  چاوہتے ہیں؟
finish-editing = پہلے ایڈٹنگ پُوری کرو؟
lose-changes-warning = اِٻکے چھوڈؔٹؔے کا متلب ہے کہ آپ اپٹؔے بدلاو گوائی دؔیوں گے
build-custom-goal = اپٹؔی مرجیا کے لکَشے ٻٹؔاو
help-reach-hours-pluralized =
    { $hours ->
        [one] ایک جاتی لکشے کے ساتھ { $language } میں { $hours } گھنٹہ تائی پُگٹؔیم  ساہیتا کرو
       *[other] ایک جاتی لکشے کے ساتھ { $language } میں { $hours } گھنٹہ تائی پُگٹؔیم  ساہیتا کرو
    }
help-reach-hours-general-pluralized =
    { $hours ->
        [one] ایک جاتی لکشے کے ساتھ ٻولیام عام آواجا کُو { $hours } گھنٹے تائی پُگٹؔیم  ساہیتا کرو
       *[other] ایک جاتی لکشے کے ساتھ ٻولیام عام آواجا کُو { $hours } گھنٹے تائی پُگٹؔیم  ساہیتا کرو
    }
set-a-goal = ایک لکشے پک کرو
cant-decide = نیرٹؔے نائی کری سِکیرے؟
activity-needed-calculation-plural =
    { $totalHours ->
        [one]
            { $periodMonths ->
                [one]
                    { $people ->
                        [one]
                            { $clipsPerDay ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { $clipsPerDay ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
               *[other]
                    { $people ->
                        [one]
                            { $clipsPerDay ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { $clipsPerDay ->
                                [one] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hour is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
            }
       *[other]
            { $periodMonths ->
                [one]
                    { $people ->
                        [one]
                            { $clipsPerDay ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { $clipsPerDay ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } month if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
               *[other]
                    { $people ->
                        [one]
                            { $clipsPerDay ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } person record { $clipsPerDay } clips a day.
                            }
                       *[other]
                            { $clipsPerDay ->
                                [one] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clip a day.
                               *[other] { $totalHours } hours is achievable in just over { $periodMonths } months if { $people } people record { $clipsPerDay } clips a day.
                            }
                    }
            }
    }
how-many-per-day = مہان! ایکی دؔنام  کترے کلپس ہے؟
how-many-a-week = مہان! ایکی سپتیم  کترے کلپس ہے؟
which-goal-type = کیا آپ ٻولٹؔا، سُٹؔنا یا دُؔونھیں کرنا چاوہتے ہے؟
receiving-emails-info =
    آپ ہلی لکشے کی یاد دؔوانواڑے جِدؔا ای میلز وسول کرنے نتر تیار ہے، میرا
    سادھارٹؔ آواجا کے باریم پرگتیا کی اپ ڈیٹس اور نیوز لیٹر
not-receiving-emails-info =
    آپ ہلی لکشے کی یاد دؔوانواڑے جِدؔا ای میلز وسول <bold>نائی</bold> کرنے نتر تیار کرا گیا ہے، ، میرا
    سادھارٹؔ آواجا کے باریم پرگتیا کی اپ ڈیٹس اور نیوز لیٹر
n-clips-pluralized =
    { $count ->
        [one] کلپ
       *[other] کلپس
    }
help-share-goal = ودھیک آواجاں لھوڑنیم  ہماری ساہیتا کرو، اپٹؔے لکشے کُو ٻاٹو
confirm-goal = لکشے کُو پک کرو
goal-interval-weekly = سپتا وار
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = { $type } نتر اپٹؔا { $count } کلپ روجینا کا لکشے کُو ٻاٹو
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = { $type } نتر اپٹؔا { $count } کلپ سپتا وارا کے لکشے کُو ٻاٹو
share-goal-type-speak = ٻولنواڑا
share-goal-type-listen = سُٹؔنواڑا
share-goal-type-both = ٻولنواڑا اور سُٹؔنواڑا
# LINK will be replaced with the current URL
goal-share-text = میں  #CommonVoice کُو آواج کا دؔان دیٹؔے کا ایک جاتی لکشے ٻنایا ہے - میرے ساتھ سئمل ہوں اور مشینیں کُو یو سُکھاٹؔیم ساہیتا کرو کہ اسلی منکھ کِدؔا ٻولتے ہے { $link }
weekly-goal-created = آپ کا سپتا وار لکشے ٻٹؔایا ہے
daily-goal-created = آپ کا روجینا لکشے ٻٹؔایا ہے
track-progress = ایٹھے اور اپٹؔے اعداد و شمار کے پنیںٚپ پرگتیا کُو ٹریک کرو۔
return-to-edit-goal = کسی بی سمے اپٹؔے لکشیم  ترمیم کرنے نتر ایٹھے پُٹھے آو۔
share-goal = میرے لکشے کُو ٻاٹو

## Goals

streaks = لکیراں
days =
    { $count ->
        [one] دؔن
       *[other] دؔن
    }
recordings =
    { $count ->
        [one] ریکارڈنگ
       *[other] ریکارڈنگ
    }
validations =
    { $count ->
        [one] مانیتا
       *[other] مانیتائیں
    }
