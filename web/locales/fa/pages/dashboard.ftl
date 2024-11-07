## Dashboard

your-languages = زبان‌های شما
toward-next-goal = به سوی هدف بعدی
goal-reached = به هدف رسیدید
clips-you-recorded = صداهایی که ضبط کرده‌اید
clips-you-validated = صداهایی که اعتبارسنجی کرده‌اید
todays-recorded-progress = پیشرفت امروز آوای مشترک در صداهای ضبط شده
todays-validated-progress = پیشرفت امروز آوای مشترک در صداهای اعتبارسنجی شده
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
visibility-explainer = این تنظیم، قابلیت مشاهده شما در فهرست رتبه‌بندی را کنترل می‌کند. در صورت پنهان بودن، پیشرفت شما خصوصی خواهد بود. به این معنا که تصویر، نام‌کاربری و پیشرفت شما در فهرست رتبه‌بندی نمایش داده نخواهد شد. توجه داشته باشید که به‌روزرسانی فهرست رتبه‌بندی حدود ~{ $minutes } دقیقه طول می‌کشد تا تغییرات اعمال شوند.
visibility-overlay-note = توجه: در صورت تنظیم به «قابل مشاهده»، این تنظیم را می‌توانید از <profileLink>صفحه نمایه</profileLink> تغییر دهید.
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
    { NUMBER($hours) ->
        [one] با یک هدف شخصی در رسیدن به { $hours } ساعت در { $language } کمک کنید
       *[other] با یک هدف شخصی در رسیدن به { $hours } ساعت در { $language } کمک کنید
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] با یک هدف شخصی آوای مشترک را در رسیدن به { $hours } ساعت در یک زبان کمک کنید
       *[other] با یک هدف شخصی آوای مشترک را در رسیدن به { $hours } ساعت در یک زبان کمک کنید
    }
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
