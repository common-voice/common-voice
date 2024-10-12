## Dashboard

your-languages = زبان‌های شما
toward-next-goal = به سوی هدف بعدی
goal-reached = به هدف رسیدید
clips-you-recorded = کلیپ‌هایی که ضبط کرده‌اید
clips-you-validated = کلیپ‌هایی که اعتبارسنجی کرده‌اید
todays-recorded-progress = پیشرفت امروز آواهای مشترک در صداهای ضبط شده
todays-validated-progress = پیشرفت امروز آواهای مشترک در صداهای اعتبارسنجی شده
stats = آمار
awards = جوایز
you = شما
everyone = دیگران
contribution-activity = فعالیت مشارکت
top-contributors = مشارکت‌کنندگان برتر
recorded-clips = صداهای ضبط شده
validated-clips = صداهای تایید شده
total-approved = مجموع تایید شده
overall-accuracy = دقت کلی
set-visibility = وضعیت دیداری من را تنظیم کن
visibility-explainer = این تنظیم وضعیت شما را در جدول امتیازات کنترل می‌کند. زمانی که پنهان است، پیشرفت شما محرمانه باقی می‌ماند. به این معنی که تصویر، نام کاربری و پیشرفت شما در جدول امتیازات پدیدار نمی‌شود. توجه کنید که تازه‌کردن جدول امتیازات { $minutes } دقیقه زمان می‌برد تا تغییرات اعمال شود.
visibility-overlay-note = توجه: زمانی که روی «آشکار» تنظیم شده باشد، می‌توان آن را از <profileLink>صفحه نمایه</profileLink> تغییر داد
show-ranking = نمایش رده بندی من

## Custom Goals

get-started-goals = با اهداف شروع کنید
create-custom-goal = یک هدف سفارشی بسازید
goal-type = چه نوع هدفی را می‌خواهید بسازید؟
both-speak-and-listen = هردو
both-speak-and-listen-long = هردو (صحبت و شنیدن)
daily-goal = هدف روزانه
weekly-goal = هدف هفتگی
easy-difficulty = ساده
average-difficulty = متوسط
difficult-difficulty = دشوار
pro-difficulty = حرفه‌ای
lose-goal-progress-warning = با ویرایش هدف‌تان، ممکن است پیشرفت فعلی‌تان را ازدست بدهید.
want-to-continue = می‌خواهید ادامه دهید؟
finish-editing = ویرایش را نخست تمام کنیم؟
lose-changes-warning = اگر اکنون خارج شوید باعث از بین رفتن تغییرات شما می شود
build-custom-goal = یک هدف سفارشی بسازید
help-reach-hours-pluralized =
    با یک هدف شخصی در رسیدن به{ NUMBER($hours) ->
        [one] { $hours } ساعت
       *[other] { $hours } ساعت
    } در { $language } کمک کنید
help-reach-hours-general-pluralized =
    با یک هدف شخصی آواهای مشترک را در رسیدن به{ NUMBER($hours) ->
        [one] { $hours } ساعت
       *[other] { $hours } ساعت
    } در یک زبان کمک کنید
set-a-goal = یک هدف تنظیم کنید
cant-decide = نمی‌توانید تصمیم بگیرید؟
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                               *[other] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                               *[other] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                               *[other] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                               *[other] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                            }
                    }
            }
       *[other]
            { NUMBER($periodMonths) ->
                [one]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                               *[other] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                               *[other] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                            }
                    }
               *[other]
                    { NUMBER($people) ->
                        [one]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                               *[other] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                            }
                       *[other]
                            { NUMBER($clipsPerDay) ->
                                [one] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                               *[other] { $totalHours } ساعت در مدت کمی بیش از { $periodMonths } ماه قابل دستیابی است اگر { $people } نفر روزانه { $clipsPerDay } صدا ضبط کنند.
                            }
                    }
            }
    }
how-many-per-day = عالی است! چه تعداد برش صوتی در روز؟
how-many-a-week = عالی است! چه تعداد برش صوتی در هفته؟
which-goal-type = می‌خواهید صحبت کنید، بشنوید یا هردو؟
receiving-emails-info = شما در حال حاضر پست های الکترونیکی دریافت خواهید کرد شامل  یادآورهای هدف، به‌روزرسانی‌های پیشرفت و خبرنامه‌هایی درباره آواهای مشترک.
not-receiving-emails-info = شما هم اکنون بر روی وضعیت <bold>دریافت نکردن</bold> نامه‌های الکترونیکی،‌ یادآوری هدف و وضعیت پیشرفت خود و همچنین خبرنامه ها از آواهای مشترک قرار دارید.
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } صدا
       *[other] { $count } صدا
    }
help-share-goal = به ما کمک کنید صداهای بیشتری بیابیم، هدف‌تان را به اشتراک بگذارید
confirm-goal = تایید هدف
goal-interval-weekly = هفتگی
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = هدف روزانه { $count } برش‌های صوتی خود را برای { $type } به اشتراک بگذارید
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = هدف هفتگی { $count } برش‌های صوتی خود را برای { $type } به اشتراک بگذارید
share-goal-type-speak = صحبت
share-goal-type-listen = شنیدن
share-goal-type-both = صحبت و شنیدن
# LINK will be replaced with the current URL
goal-share-text = من به تازگی هدف شخصی برای اهدای صدا به #CommonVoice ساختم -- به من ملحق شوید و به آموزش ماشین‌ها برای درک چگونگی صحبت‌کردن افراد حقیقی کمک کنید { $link }
weekly-goal-created = هدف هفتگی شما ساخته شد
daily-goal-created = هدف روزانه شما ساخته شد
track-progress = پیشرفت را اینجا و در صفحه آمار خودتان پیگیری کنید.
return-to-edit-goal = برای ویرایش هدف‌تان هر زمان اینجا برگردید.
share-goal = هدفم را به اشتراک بگذار

## Goals

streaks = خطوط
days =
    { $count ->
        [one] روز
       *[other] روز
    }
recordings =
    { $count ->
        [one] ضبط‌شده
       *[other] ضبط‌شده
    }
validations =
    { $count ->
        [one] اعتبارسنجی
       *[other] اعتبار سنجی‌ها
    }
