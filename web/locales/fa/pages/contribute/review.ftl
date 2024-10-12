## REVIEW

sc-review-form-usage = برای تایید جمله به سمت راست بکشید. برای رد کردن آن به سمت چپ بکشید. برای رد شدن از آن به سمت بالا بکشید. <strong>فراموش نکنید که بازبینی خود را ارسال کنید!</strong>
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

## REVIEW CRITERIA

