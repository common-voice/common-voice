## Dashboard

your-languages = השפות שלך
toward-next-goal = לקראת היעד הבא
goal-reached = היעד הושג
clips-you-recorded = מקטעים שהקלטת
clips-you-validated = מקטעים שאימתת
todays-recorded-progress = ההתקדמות היומית של קטעים מוקלטים ב־Common Voice
todays-validated-progress = ההתקדמות היומית של קטעים מאומתים ב־Common Voice
stats = סטטיסטיקה
awards = פרסים
you = אני
everyone = כולם
contribution-activity = פעילות תרומה
top-contributors = תורמים מובילים
recorded-clips = מקטעים שהוקלטו
validated-clips = מקטעים שאומתו
total-approved = סה״כ אושרו
overall-accuracy = דיוק כללי
set-visibility = הגדרת הנראות שלי
visibility-explainer = הגדרה זו שולטת בהופעה שלך בטבלת המובילים. בעת הסתרה, ההתקדמות שלך תהיה פרטית. פירוש הדבר שהתמונה שלך, שם המשתמש וההתקדמות שלך לא יופיעו בטבלת המובילים. לידיעתך, רענון טבלת המובילים ועדכון השינויים לוקחים כ-{ $minutes } דקות.
visibility-overlay-note = שימו לב: כאשר מכוון ל-'גלוי', ניתן לשנות הגדרה זו מ<profileLink>דף הפרופיל</profileLink>
show-ranking = הצגת הדירוג שלי

## Custom Goals

get-started-goals = התחילו עם יעדים
create-custom-goal = יצירת יעד בהתאמה אישית
goal-type = איזה סוג של יעד ברצונך לבנות?
both-speak-and-listen = שניהם
both-speak-and-listen-long = שניהם (דיבור והאזנה)
daily-goal = יעד יומי
weekly-goal = יעד שבועי
easy-difficulty = קל
average-difficulty = בינוני
difficult-difficulty = קשה
pro-difficulty = מקצוען
lose-goal-progress-warning = ההתקדמות שלך עד כה עשויה להימחק בעת עריכת היעד שלך.
want-to-continue = להמשיך?
finish-editing = לסיים את העריכה קודם לכן?
lose-changes-warning = יציאה כעת תגרום לביטול השינויים שביצעת
build-custom-goal = הרכבת יעד מותאם אישית
help-reach-hours-pluralized =
    { NUMBER($hours) ->
        [one] עזרו להגיע לשעה אחת של ב{ $language } באמצעות יעד אישי
       *[other] עזרו להגיע ל-{ $hours } שעות ב{ $language } באמצעות יעד אישי
    }
help-reach-hours-general-pluralized =
    { NUMBER($hours) ->
        [one] עזרו ל-Common Voice להגיע לשעה בשפה כלשהי באמצעות קביעת יעד אישי
        [two] עזרו ל-Common Voice להגיע לשעתיים בשפה כלשהי באמצעות קביעת יעד אישי
       *[other] עזרו ל-Common Voice להגיע ל-{ $hours } שעות בשפה כלשהי באמצעות קביעת יעד אישי
    }
set-a-goal = הגדרת יעד
cant-decide = לא הצלחת להחליט?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
        [one] ניתן להגיע לשעה
        [two] ניתן להגיע לשעתיים
       *[other] ניתן להגיע ל־{ $totalHours } שעות
    } תוך { NUMBER($periodMonths) ->
        [one] חודש
        [two] חודשיים
       *[other] { $periodMonths } חודשים
    } אם { NUMBER($people) ->
        [one] אדם אחד יקליט
       *[other] { $people } אנשים יקליטו
    } { NUMBER($clipsPerDay) ->
        [one] מקטע אחד
       *[other] { $clipsPerDay } מקטעים
    } ביום.
how-many-per-day = מצוין! כמה מקטעים ביום?
how-many-a-week = נהדר! כמה מקטעים בשבוע?
which-goal-type = מעניין אותך לדבר, להאזין או גם וגם?
receiving-emails-info =
    כרגע מוגדר כי תקבלו הודעות דוא"ל כגון תזכורות ליעדים,
    עדכוני ההתקדמות שלי ועלוני מידע אודות Common Voice
not-receiving-emails-info =
    כרגע מוגדר כי <bold>לא</ bold> תקבלו הודעות דוא"ל כגון תזכורות ליעדים,
    עדכוני ההתקדמות שלי ועלוני מידע אודות Common Voice
n-clips-pluralized =
    { NUMBER($count) ->
        [one] מקטע אחד
       *[other] { $count } מקטעים
    }
help-share-goal = שיתוף היעד שלך יסייע לנו לאתר קולות נוספות
confirm-goal = אישור היעד
goal-interval-weekly = שבועי
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = שתפו את היעד היומי של { $count } מקטעים עבור { $type }
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = שתפו את היעד השבועי של { $count } מקטעים עבור { $type }
share-goal-type-speak = דיבור
share-goal-type-listen = האזנה
share-goal-type-both = דיבור והאזנה
# LINK will be replaced with the current URL
goal-share-text = יצרתי עכשיו יעד אישי לתרומת קול עבור #CommonVoice -- הצטרפו אליי כדי לעזור ללמד מכונות איך אנשים אמיתיים מדברים { $link }
weekly-goal-created = היעד השבועי שלך נוצר
daily-goal-created = היעד היומי שלך נוצר
track-progress = עקבו אחר ההתקדמות כאן ובדף הסטטיסטיקות שלכם.
return-to-edit-goal = ניתן לחזור לכאן כדי לערוך את היעד שלך בכל עת.
share-goal = שיתוף היעד שלי

## Goals

streaks = רצף
days =
    { $count ->
        [one] יום
       *[other] ימים
    }
recordings =
    { $count ->
        [one] הקלטה
       *[other] הקלטות
    }
validations =
    { $count ->
        [one] אימות
       *[other] אימותים
    }

