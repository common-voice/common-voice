## REVIEW

sc-review-lang-not-selected = شما هیچ زبانی را انتخاب نکرده‌اید. لطفاً برای انتخاب زبان به <profileLink>نمایهٔ</profileLink> خود بروید.
sc-review-title = بازبینی جملات
sc-review-loading = دریافت جملات…
sc-review-select-language = لطفاً زبانی را برای بازبینی جملات انتخاب کنید.
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
