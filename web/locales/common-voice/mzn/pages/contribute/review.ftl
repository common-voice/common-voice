## REVIEW

sc-review-lang-not-selected = هنتا شما هیچ زوونی ره إنتٮخاب نکردی. لطفاً شه زوونِ میّن هاکردن وسه، <profileLink>پرؤفایل</profileLink> دله بورین.
sc-review-title = جملاتِ مرور
sc-review-loading = جملات ره در یارنه...
sc-review-select-language = اتا زوون ره جملاتِ مرور وسّه إنتٮخاب هاکنین.
sc-review-no-sentences = جمله‌ای مرور وسّه دنی‌یه. <addLink>إسا چنتا جمله دیگه دینگنین!</addLink>
sc-review-form-prompt =
    .message = مرور نئی جملات هنتا راهی نئینه. مطمئن هستی؟
sc-review-form-usage = تأیید وسّه، جمله ره راست وَری بکشین. ونه رد هاکردن وسّه هم وه ره چپ وَری بکشین. اگه خانّی ونه سر جه یور بپّرین هم بالا بکشین. <strong>یاد نکنین که شه مرور ره ذخیره هاکنین!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = منبع: { $sentenceSource }
sc-review-form-button-reject = رد
sc-review-form-button-skip = یور بپّرستن
sc-review-form-button-approve = تأیید
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = شما تونّی شؤرت‌کات (بامشی‌راه) هم بزنین. یعنن { sc-review-form-button-approve-shortcut } دکمه ره تأیید، { sc-review-form-button-reject-shortcut } ره رد و { sc-review-form-button-skip-shortcut } ره یور بپرستن وسّه پلغ هادین.
sc-review-form-button-submit =
    .submitText = مرور سر بیّه
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] هنتا هیچ جمله‌ای مرور نیّه.
       *[other] { $sentences } جمله مرور بیّه. خنابدون!
    }
sc-review-form-review-failure = مرور ذخیره نیّه. أی تلاش هاکنین.
sc-review-link = مرور

## REVIEW CRITERIA

sc-criteria-modal = معیارونِ مرور
sc-criteria-title = معیارونِ مرور
sc-criteria-make-sure = مطمئن بوین که جمله این معیارون ره دارنه:
sc-criteria-item-1 = جمله دله غلط إملایی ندارنه.
sc-criteria-item-2 = جمله گرامری صحیح بوئه.
sc-criteria-item-3 = جمله ره بووشه بخوندستن.
sc-criteria-item-4 = اگه جمله معیارون دسوری هسته، &quot;تأیید&quot; دؤکمه ره پلغ هادین.
sc-criteria-item-5-2 = اگه جمله این معیارون ره ندارنه، وه ره &quot;رد&quot; بزنین یا چپ وَری بکشین. اگه مطمئن نینی، تونّی بپرین بعدی جمله سر.
sc-criteria-item-6 = اگه دیگه هچّی جمله مرور وسّه نَکِته، کؤمک هاکنین که تازه جملات بی‌یلیم!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = هارشین <icon></icon> که این جمله گرامری صحیح هسته؟
sc-review-rules-title = این جمله أمه دستورالعمل په هسته؟
sc-review-empty-state = إسا هیچ جمله‌ای این زوونِ مرور وسّه باقی نموندسته.
report-sc-different-language = متفاوتِ زوون
report-sc-different-language-detail = اتا زوون جه بنویشت هسته که من دکّل ونجه مرور نکمبه.
sentences-fetch-error = جملات بیاردن گدر اتا خطا ور بخرده
review-error = این جمله‌یِ مرور گدر اتا خطا ور بخرده
review-error-rate-limit-exceeded = خله تند-تند در شونی. ات‌که لسی هاده و جمله ره قشنگ مرور هاکن تا مطمئن بوی درست هسته.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = إما درمی چنتا گت-گت تغییر دمبی
sc-redirect-page-subtitle-1 = جمله جمع هاکردن بخش ره در وَرمی «همبازی چمر» پلتفؤرم درون. شما إسا توندی اتا جمله <writeURL>بنویسی</writeURL> یا چنتا جمله ره <reviewURL>مرور</reviewURL> هاکنی.
sc-redirect-page-subtitle-2 = أمجه <matrixLink>ماتریکس</matrixLink>، <discourseLink>دیسکؤرس</discourseLink> یا <emailLink>ایمیل</emailLink> جه خَوِر هایرین.
# menu item
review-sentences = جملاتِ مرور
