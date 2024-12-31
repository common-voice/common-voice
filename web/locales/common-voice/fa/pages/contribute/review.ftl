## REVIEW

sc-review-lang-not-selected = شما هیچ زبانی را انتخاب نکرده‌اید. لطفاً برای انتخاب زبان به <profileLink>نمایهٔ</profileLink> خود بروید.
sc-review-title = بازبینی جملات
sc-review-loading = دریافت جملات…
sc-review-select-language = لطفاً زبانی را برای بازبینی جملات انتخاب کنید.
sc-review-no-sentences = هیچ جمله‌ای برای بررسی وجود ندارد. <addLink>اکنون جملات بیشتری اضافه کنید!</addLink>
sc-review-form-prompt =
    .message = جملات بازبینی‌شده هنوز فرستاده نشده‌اند. مطمئن هستید؟
sc-review-form-usage = برای تایید جمله به سمت راست بکشید. برای رد کردن آن به سمت چپ بکشید. برای رد شدن از آن به سمت بالا بکشید. <strong>فراموش نکنید که بازبینی خود را ارسال کنید!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = منبع: { $sentenceSource }
sc-review-form-button-reject = رد
sc-review-form-button-skip = عبور
sc-review-form-button-approve = تأیید
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = شما همچنین می‌توانید از میانبرهای صفحه‌کلید استفاده کنید: { sc-review-form-button-approve-shortcut } برای تایید، { sc-review-form-button-reject-shortcut } برای رد کردن، { sc-review-form-button-skip-shortcut } برای عبور کردن
sc-review-form-button-submit =
    .submitText = پایان بازبینی
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] هنوز هیچ جمله‌ای بازبینی نشده است.
        [one] 1 جمله بازبینی شد. متشکرم!
       *[other] { $sentences } جمله بازبینی شد. متشکرم!
    }
sc-review-form-review-failure = بازبینی ذخیره نشد. لطفا دوباره تلاش کنید.
sc-review-link = بازبینی کنید

## REVIEW CRITERIA

sc-criteria-modal = ⓘ معیارهای بازبینی
sc-criteria-title = معیارهای بازبینی
sc-criteria-make-sure = اطمینان حاصل کنید که جمله دارای معیارهای زیر است:
sc-criteria-item-1 = جمله باید بدون غلط املایی باشد.
sc-criteria-item-2 = جمله باید از نظر نحوی صحیح باشد.
sc-criteria-item-3 = جمله باید قابل گفتن باشد.
sc-criteria-item-4 = اگر جمله با معیارها مطابقت دارد، روی دکمهٔ &quot;تأیید&quot; در سمت راست کلیک کنید.
sc-criteria-item-5-2 = اگر جمله با معیارهای بالا مطابقت ندارد، روی دکمهٔ &quot;رد&quot; در سمت چپ کلیک کنید. اگر مطمئن نیستید، می‌توانید آن را نیز نادیده بگیرید و به جمله بعدی بروید.
sc-criteria-item-6 = اگر جمله‌ای برای بازبینی باقی نمانده است، لطفاً در گردآوری جملات بیشتر به ما کمک کنید!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = بررسی <icon></icon> کنید که آیا این جمله از نظر زبانی صحیح است؟
sc-review-rules-title = آیا این جمله با دستورالعمل‌ها مطابقت دارد؟
sc-review-empty-state = در حال حاضر هیچ جمله‌ای برای این زبان برای بازبینی وجود ندارد.
report-sc-different-language = زبان متفاوت
report-sc-different-language-detail = به زبانی متفاوت از آنچه که من بازبینی می‌کنم نوشته شده است.
sentences-fetch-error = هنگام واکشی جملات، خطایی روی داد
review-error = در بازبینی این جمله خطایی روی داد
review-error-rate-limit-exceeded = خیلی سریع به پیش می‌روید. لطفاً لحظه‌ای وقت بگذارید، جمله را مرور کنید و از صحت آن مطمئن شوید.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ما در حال ایجاد برخی تغییرات بزرگ هستیم
sc-redirect-page-subtitle-1 = بخش گردآوری جملات در حال انتقال به هستهٔ سکوی آوای مشترک است. اکنون می‌توانید داخل آوای مشترک، جمله‌ای را <writeURL>نوشته</writeURL> یا مورد <reviewURL>بازبینی</reviewURL> قرار دهید.
sc-redirect-page-subtitle-2 = روی <matrixLink>ماتریس</matrixLink>، <discourseLink>دیسکورس</discourseLink> یا از طریق <emailLink>رایانامه</emailLink> از ما سوال بپرسید.
