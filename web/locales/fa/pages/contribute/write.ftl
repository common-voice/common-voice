## WRITE PAGE

sentence-input-placeholder = جمله‌ی مالکیت عمومی خود را اینجا وارد کنید
small-batch-sentence-input-placeholder = جملات مالکیت عمومی خود را اینجا وارد کنید.
sc-review-small-batch-title = چگونه چندین جمله اضافه کنیم
login-instruction-multiple-sentences = برای افزودن چندین جمله، <loginLink>وارد شوید</loginLink> یا <loginLink>نام‌نویسی</loginLink> کنید
small-batch-sentence-submission = ارسال جملات در دسته‌های کوچک
small-batch-sentence = دسته‌ی کوچک
bulk-sentence = دسته‌ی انبوه

## BULK SUBMISSION 

template-file-additional-information = اگر اطلاعات اضافی‌ای درباره‌ی این پرونده دارید که در قالب گنجانده نشده است، لطفا با <emailFragment>commonvoice@mozilla.com</emailFragment> تماس بگیرید.
what-needs-to-be-in-file-explanation = لطفا <templateFileLink>پرونده الگوی</templateFileLink> ما را بررسی کنید. جملات شما باید بدون حق تکثیر (CC0 یا اثر اصلی با اجازه از ارسال‌کننده) باشند و واضح، از نظر گرامری صحیح و خوانا باشند. جملات ارسال شده باید حدود ۱۰-۱۵ ثانیه برای خواندن زمان ببرند و از اعداد، نام‌های خاص و نویسه‌های ویژه خودداری کنند.
bulk-submission-success-subheader = شما در حال کمک به آوای مشترک برای رسیدن به اهداف روزانه‌ی جمله‌های ما هستید!
upload-more-btn-text = آیا جمله‌های بیشتری بارگذاری می‌کنید؟
file-invalid-type = پرونده نامعتبر است
file-too-large = پرونده خیلی بزرگ است
file-too-small = پرونده خیلی کوچک است
too-many-files = پرونده‌های زیادی وجود دارد

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> افزودن چندین جمله مالکیت عمومی
multiple-sentences-error = افزودن چندین جمله در یک ارسال امکان پذیر نیست
exceeds-small-batch-limit-error = نمی‌توانید بیش از ۱۰۰۰ جمله ارسال کنید
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] از محدودیت نرخ تجاوز شده است. لطفا دوباره در ۱ دقیقه دیگر تلاش کنید.
       *[other] از محدودیت نرخ تجاوز شده است. لطفا دوباره در { $retryLimit } دقیقه دیگر تلاش کنید.
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] از محدودیت نرخ تجاوز شده است. لطفا دوباره در ۱ ثانیه دیگر تلاش کنید.
       *[other] از محدودیت نرخ تجاوز شده است. لطفا دوباره در { $retryLimit } ثانیه دیگر تلاش کنید.
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] شما به حد مجاز ارسال برای این صفحه رسیده‌اید. لطفا ۱ دقیقه صبر کنید و سپس جمله دیگری ارسال کنید. از صبر و شکیبایی شما متشکریم!
       *[other] شما به حد مجاز ارسال برای این صفحه رسیده‌اید. لطفا { $retryLimit } دقیقه صبر کنید و سپس جمله دیگری ارسال کنید. از صبر و شکیبایی شما متشکریم!
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] شما به حد مجاز ارسال برای این صفحه رسیده‌اید. لطفا ۱ ثانیه صبر کنید و سپس جمله دیگری ارسال کنید. از صبر و شکیبایی شما متشکریم!
       *[other] شما به حد مجاز ارسال برای این صفحه رسیده‌اید. لطفا { $retryLimit } ثانیه صبر کنید و سپس جمله دیگری ارسال کنید. از صبر و شکیبایی شما متشکریم!
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $totalSentences ->
        [one] { $uploadedSentences } از ۱ جمله گردآوری شده
       *[other] { $uploadedSentences } از { $totalSentences } جمله گردآوری شده
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $totalSentences ->
        [one] { $uploadedSentences } از ۱ جمله گردآوری شده. برای دریافت جملات رد شده، <downloadLink>اینجا</downloadLink> کلیک کنید.
       *[other] { $uploadedSentences } از { $totalSentences } جمله گردآوری شده. برای دریافت جملات رد شده، <downloadLink>اینجا</downloadLink> کلیک کنید.
    }
small-batch-sentences-rule-1 = دستورالعمل‌های «چه جملاتی را می‌توانم اضافه کنم؟» را دنبال کنید
small-batch-sentences-rule-2 = هر جمله را در یک خط اضافه کنید
small-batch-sentences-rule-4 = تا ۱٫۰۰۰ جمله اضافه کنید
small-batch-sentences-rule-5 = همه جملات باید مالکیت عمومی باشند
small-batch-sentences-rule-6 = همه جملات باید ارجاع یکسانی داشته باشند
