## Error pages

banner-error-slow-1 = متاسفم، پروژه آوای مشترک به کندی اجرا می‌شود. از علاقه شما سپاسگزارم.
banner-error-slow-2 = ما حجم زیادی ترافیک دریافت می‌کنیم و در حال بررسی مشکلات هستیم.
banner-error-slow-link = صفحه وضعیت
error-something-went-wrong = متاسفم، مشکلی پیش آمده است.
error-clip-upload = بارگذاری صداها با شکست مواجه شده است، دوباره برای ارسال تلاش شود؟
error-clip-upload-server = بارگذاری این صدا در کارساز با شکست مواجه می‌شود. صفحه را مجددا بارگذاری کنید یا بعدا دوباره تلاش کنید.
error-clip-upload-too-large = پروندهٔ ضبط‌شدهٔ شما برای بارگذاری بیش از حد بزرگ است. لطفاً صدای کوتاه‌تری ضبط کنید.
error-clip-upload-server-error = هنگام پردازش صدای شما خطای سرور رخ داد. لطفاً صفحه را دوباره بار کنید یا بعداً امتحان کنید.
error-title-404 = ما نتوانسیم آن صفحه را پیدا کنیم
error-content-404 = شاید <homepageLink>صفحه اصلی</homepageLink> ما به شما کمک کند؟ برای پرسیدن سوال، لطفا به <matrixLink>گفتگوی اجتماع ماتریکس</matrixLink> بپیوندید، مسائل وبگاه را از طریق <githubLink>گیت‌هاب</githubLink> پیگیری کنید یا به <discourseLink>انجمن‌های دیسکورس ما</discourseLink> مراجعه کنید.
error-title-429-no-time = خیلی سریع پیش می‌روید. لطفاً کمی آهسته‌تر و چند لحظهٔ دیگر دوباره امتحان کنید.
error-title-429-with-time =
    { $retryAfter ->
        [one] خیلی سریع پیش می‌روید. لطفاً { $retryAfter } ثانیهٔ دیگر دوباره امتحان کنید.
       *[other] خیلی سریع پیش می‌روید. لطفاً { $retryAfter } ثانیهٔ دیگر دوباره امتحان کنید.
    }
error-title-500 = متاسفم، مشکلی پیش آمده است.
error-content-500 = خطای غیرمنتظره‌ای رخ داد. لطفاً بعداً دوباره امتحان کنید. برای دریافت کمک، به <matrixLink>گفت‌وگوی اجتماع در ماتریکس</matrixLink> بپیوندید، مشکلات وبگاه را در <githubLink>گیت‌هاب</githubLink> دنبال کنید یا به <discourseLink>انجمن‌های دیسکورس ما</discourseLink> سر بزنید.
error-title-502 = اتصال قطع شد
error-content-502 = الآن نمی‌توانیم یک اتصال پایدار به کارساز‌ها(سرور‌ها) برقرار کنیم. برای راهنمایی می‌توانید به <matrixLink>چت‌روم ماتریکس</matrixLink> ملحق شوید، مشکل‌های سایت را در <githubLink>گیت‌هاب</githubLink> پایش کنید یا این‌که سری به <discourseLink>انجمن‌های ما در دیسکورس</discourseLink> بزنید.
error-title-503 = ما خرابی غیرمنتظره را تجربه می‌کنیم
error-content-503 = وبگاه به زودی دوباره در دسترس خواهد بود. برای دریافت آخرین اطلاعات، لطفا به <matrixLink>گفتگوی اجتماع ماتریکس</matrixLink> بپیوندید یا به <githubLink>گیت‌هاب</githubLink> یا <discourseLink>انجمن‌های دیسکورس ما</discourseLink> مراجعه کنید تا مشکلات مربوط به تجربه وب‌گاه را ارسال و پیگیری کنید.
error-title-504 = زمان درخواست بیش از حد
error-content-504 = مدت زمانی بیش از حد برای کامل شدن درخواست سپری شد. این معمولا موقت است. لطفا دوباره امتحان کنید. برای راهنمایی می‌توانید به <matrixLink>چت‌روم ماتریکس</matrixLink> ملحق شوید، مشکل‌های سایت را در <githubLink>گیت‌هاب</githubLink> پایش کنید یا این‌که سری به <discourseLink>انجمن‌های ما در دیسکورس</discourseLink> بزنید.
error-code = خطا { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] نتوانستیم صدای شما را بارگذاری کنیم. قبلا بارگذاری شده است. بیایید با دسته‌ی بعدی ادامه دهیم!
       *[other] نتوانستیم { $total } صدای شما را بارگذاری کنیم. اون‌ها قبلا بارگذاری شده‌اند. بیایید با دسته‌ی بعدی ادامه دهیم!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = { $uploaded } صدای شما بارگذاری شد — باقی‌مانده قبلا بارگذاری شده‌اند. بیایید با دسته‌ی بعدی ادامه دهیم!
