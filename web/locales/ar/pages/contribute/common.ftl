## Contribution

action-click = انقر
action-tap = انقر
## Languages

contribute = ساهِم
skip = تخطَّ
shortcuts = الاختصارات
clips-with-count-pluralized =
    { $count ->
        [zero] <bold>لا</bold> مقاطع
        [one] <bold>مقطع واحد</bold>
        [two] <bold>مقطعان اثنان</bold>
        [few] <bold>{ $count }</bold> مقاطع
        [many] <bold>{ $count }</bold> مقطعًا
       *[other] <bold>{ $count }</bold> مقطع
    }
goal-help-recording = لقد ساعدت «الصوت للعموم» في الوصول إلى <goalPercentage></goalPercentage> من هدفنا لتسجيل { $goalValue } يوميًا!
goal-help-validation = لقد ساعدت «الصوت للعموم» في الوصول إلى <goalPercentage></goalPercentage> من هدفنا للتحقق من { $goalValue } يوميًا!
contribute-more =
    { $count ->
        [zero] أمستعد للمساهمة بِ‍ { $count } غيرها؟
        [one] أمستعد للمساهمة بواحدة أخرى؟
        [two] أمستعد للمساهمة باثنتين أخريتان؟
        [few] أمستعد للمساهمة بِ‍ { $count } أخرى؟
        [many] أمستعد للمساهمة بِ‍ { $count } أخرى؟
       *[other] أمستعد للمساهمة بِ‍ { $count } أخرى؟
    }
speak-empty-state = انتهت المقاطع التي تحتاج تسجيل لهذه اللغة...
speak-empty-state-cta = ساهِم بالجُمل
record-button-label = سجّل صوتك
share-title-new = <bold>ساعِدنا</bold> لنجد مساهمين آخرين
keep-track-profile = اعرف مسيرك بإنشاء حساب
login-to-get-started = لتبدأ، لِج أو سجلا حسابا
target-segment-first-card = أنت تساهم بأول مقطع مستهدف
target-segment-first-banner = ساهِم بإنشاء أول مقطع على «الصوت للعموم» خصيصًا باللغة { $locale }
target-segment-add-voice = أضِف صوتك
target-segment-learn-more = اطّلع على المزيد

## Reporting

report = أبلِغ
report-title = أرسِل تقريرًا
report-ask = ما المشاكل التي تراها في هذه الجملة؟
report-offensive-language = كلام هجومي
report-offensive-language-detail = تحتوي الجملة على لغة مهينة أو مسيئة.
report-grammar-or-spelling = خطأ نحوي/إملائي
report-grammar-or-spelling-detail = تحتوي الجملة على خطأ نحوي أو إملائي.
report-different-language = لغه مختلفة
report-different-language-detail = الجملة مكتوبة بلغة مختلفة عن اللغة التي أتحدث بها.
report-difficult-pronounce = نطقها صعب
report-difficult-pronounce-detail = تحتوي الجملة على كلمات أو عبارات يصعب قراءتها أو نطقها.
report-offensive-speech = كلام هجومي
report-offensive-speech-detail = يحتوي المقطع على لغة مهينة أو مسيئة.
report-other-comment =
    .placeholder = التعليق
success = تمّ
continue = واصِل
report-success = أُرسل البلاغ بنجاح

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = ت

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = س
shortcut-record-toggle-label = سجِّل/أوقِف
shortcut-rerecord-toggle = [5-1]
shortcut-rerecord-toggle-label = أعِد تسجيل المقطع
request-language-text = ألم ترى لغتك في «الصوت للعموم» بعد؟
request-language-button = اطلب لغةً

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = ش
shortcut-play-toggle-label = شغّل/أوقِف
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = ن
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = ل

