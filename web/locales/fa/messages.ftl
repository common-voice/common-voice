## General

yes-receive-emails = بله، برام ایمیل بفرست. علاقه‌مندم از پروژه صدای مشترک اطلاع کسب کنم.
return-to-cv = بازگشت به صدای مشترک
email-input =
    .label = ایمیل
submit-form-action = ارسال
loading = در حال بارگیری...
indicates-required = * فیلد الزامی را مشخص می‌کند

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

an = آراگونی
ar = عربی
as = آسامی
ast = آستوری
az = آذربایجانی
bg = بلغاری
bn = بنگالی
br = برتانیایی
bxr = بوریاتی
ca = کاتالونیایی
cak = کاقچیکل
cs = چکی
cy = ویلزی
da = دانمارکی
de = آلمانی
el = یونانی
en = انگلیسی
eo = اسپرانتو
es = اسپانیولی
et = استونیایی
eu = باسکی
fa = فارسی
fi = فنلاندی
fr = فرانسوی
ga-IE = ایرلندی
he = عبری
hu = مجاری
id = اندونزیایی
is = ایسلندی
it = ایتالیایی
ja = ژاپنی
ka = گرجی
kab = Kabyle
kk = قزاقی
ko = کره‌ای
ky = قرقیزی
mk = مقدونی
mn = مغولی
ne-NP = نپالی
nl = هلندی
pl = لهستانی
pt-BR = پرتغالی (برزیل)
ro = رومانیایی
ru = روسی
sk = اسلوواکی
sl = اسلوونيايی
sq = آلبانیایی
sr = صربی
sv-SE = سوئدی
th = تایلندی
tr = ترکی
tt = تاتاری
uk = اوکراینی
ur = اردو
uz = ازبکی
vi = ویتنامی
zh-CN = چینی (چین)
zh-HK = چینی (هنک کنگ)
zh-TW = چینی (تایوان)

# [/]


## Layout

speak-now = اکنون صحبت کنید
datasets = مجموعه‌ی داده‌ها
languages = زبان‌ها
profile = نمایه
help = راهنما
contact = تماس با ما
privacy = حریم خصوصی
terms = شرایط
cookies = کوکی‌ها
faq = پرسش‌های متداول
content-license-text = محتوا تحت یک<licenseLink>مجوز Creative Commons</ licenseLink> در دسترس است
back-top = بازگشت به بالا
logout = خروج از سیستم

## Home Page

show-wall-of-text = بیشتر بخوانید
vote-yes = بله
vote-no = خیر
speak-subtitle = صدای خود را اهدا کنید
listen-goal-text = کلیپ‌های اعتبارسنجی شده
voices-online = صداهای آنلاین حال حاضر
todays-progress = پیشرفت امروز
help-reach-goal = به ما کمک کنید تا به { $goal } برسیم
read-terms-q = آیا شرایط ما را خوانده‌اید؟
ready-to-record = آیا آماده اهدای صدای خود هستید؟
all-languages = همه‌ی زبان‌ها
today = امروز
x-weeks-short =
    { $count ->
        [one] هفته
       *[other] { $count }هفته
    }
x-months-short =
    { $count ->
        [one] ماه
       *[other] { $count }ماه
    }
x-years-short =
    { $count ->
        [one] سال
       *[other] { $count }سال
    }

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = پخش/توقف
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = ضبط/توقف
request-language-text = زبان خود را در «صدای مشترک» مشاهده نمی‌کنید؟
request-language-button = درخواست یک زبان

## ProjectStatus

status-title = وضعیت کلی پروژه: ببینید پیشرفت ما تا چه حدی بوده است!
status-contribute = صدای خود را اهدا کنید
status-hours =
    { $hours ->
        [one] تاکنون یک ساعت اعتبارسنجی شده
       *[other] تاکنون { $hours } ساعت اعتبارسنجی شده
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = هدف‌های بعدی: { $goal }
english = انگلیسی

## ProfileForm

profile-form-username =
    .label = نام کاربری
profile-form-language =
    .label = زبان
profile-form-accent =
    .label = لهجه
profile-form-age =
    .label = سن
profile-form-gender =
    .label = جنسیت
hidden = پنهان
visible = قابل مشاهده
native-language =
    .label = زبان مادری
profile-form-submit-save = ذخیره
profile-form-submit-saved = ذخیره شد
male = مرد
female = زن
# Gender
other = ‏‏سایر
why-profile-title = چرا یک نمایه؟
dashboard = داشبورد
build-profile = ساختن نمایه
avatar = تصویر نمایه
goals = هدف‌ها
settings = تنظیمات
edit-profile = ویرایش نمایه
profile-create-success = نمایه با موفقیت ایجاد شد!
profile-close = بستن
profile-explanation = پیشرفت‌های خود را با استفاده از یک نمایه پیگیری کنید و به دقت بیشتر داده‌های صوتی ما کمک کنید.
thanks-for-account = با تشکر از تایید حساب خود، اکنون اجازه دهید نمایه شما را بسازیم.
why-demographic = چرا این موضوع اهمیت دارد؟
login-identity = شناسه ورود
login-signup = ورود / ثبت‌نام
edit = ویرایش
email-subscriptions = اشتراک ایمیلی
download-profile = دریافت داده‌های من
contribution-experience = تجربه مشارکت
off = خاموش
on = روشن
add-avatar-title = تصویری به نمایه خود اضافه کنید
browse-file-title = یک تصویر بارگذاری کنید
browse-file = کشیدن و رها کردن یا <browseWrap>مرور</browseWrap>
connect-gravatar = اتصال به Gravatar
gravatar_not_found = هیچ گراواتاری برای ایمیل شما یافت نشد
file_too_large = پرونده انتخاب شده خیلی بزرگ است
manage-subscriptions = مدیریت اشتراک‌ها
email-already-used = ایمیل پیش از این برای حساب دیگری استفاده شده است
add-language = افزودن زبان

## FAQ

faq-title = سوالات متداول
faq-what-q = صدای مشترک چیست؟
faq-important-q = چرا مهم است؟
faq-source-q = این متن‌ها از کجا می‌آیند؟

## NotFound

notfound-title = پیدا نشد
notfound-content = من نگرانم و نمی دانم شما به دنبال چه هستید.

## Data

data-download-button = دریافت داده‌های صدای مشترک
data-download-yes = بله
data-download-deny = خیر
data-download-license = مجوز: <licenseLink>CC-0</licenseLink>
data-other-title = دیگر مجموعه داده‌های صوتی…
data-other-goto = برو به { $name }
data-other-download = دریافت داده‌ها
data-other-ted-name = مجموعه نوشته‌های TED-LIUM
data-other-ted-description = مجموعه نوشته‌های TED-LIUM از گفتگو‌های صوتی و رونوشت‌های آن‌ها که در وب سایت TED در دسترس هستند، ساخته شده است.
data-other-voxforge-description = VoxForge برای جمع آوری سخنرانی‌های رونوشت شده برای استفاده در موتورهای شناسایی گفتار آزاد و متن باز طراحی شده است.
license-mixed = درهم
terms-agree = موافقم
terms-disagree = موافق نیستم
review-submit-title = مرور و ارسال
review-recording = مرور
review-rerecord = ضبط دوباره
review-cancel = لغو ارسال
review-keep-recordings = ضبط را نگه دارید
review-delete-recordings = ضبط‌های من را حذف کن

## Download Modal

download-title = دریافت شما آغاز شد
download-form-email =
    .label = ایمیل خود را وارد کنید
    .value = ممنون، با شما در تماس خواهیم بود
download-back = بازگشت به مجموعه داده‌های صدای مشترک
download-no = نه ممنون

## Contact Modal

contact-title = فرم تماس
contact-form-name =
    .label = نام
contact-form-message =
    .label = پیام
contact-required = *ضروری

## Request Language Modal

request-language-title = درخواست زبان
request-language-form-language =
    .label = زبان
request-language-success-title = درخواست زبان با موفقیت ارسال شد، متشکرم
request-language-success-content = خیلی زود با اطلاعات بیشتری در مورد چگونگی افزودن زبان شما به صدای مشترک در تماس خواهیم بود.

## Languages Overview

language-section-in-progress = در حال پیشرفت
language-section-launched = منتشر شده
languages-show-more = مشاهده بیشتر…
language-speakers = گویندگان
language-meter-in-progress = پیشرفت
language-total-progress = مجموع
language-search-input =
    .placeholder = جست‌وجو
language-speakers = گویندگان
localized = محلی شده
sentences = جمله‌ها
total-hours = ساعت اعتبارسنجی شده

## New Contribution

action-click = کلیک
action-tap = ضربه زدن
contribute = مشارکت
listen = گوش کردن
skip = رد کردن
shortcuts = میانبرها
clips-with-count = <bold>{ $count }</bold> کلیپ‌ها
contribute-more =
    { $count ->
        [one] برای انجام { $count } عدد بیشتر آماده‌اید؟
       *[other] برای انجام { $count } عدد بیشتر آماده‌اید؟
    }
record-cta = شروع ضبط
record-platform-not-supported = متاسفیم، اما پلتفرم شما در حال حاضر پشتیبانی نمی شود.
record-platform-not-supported-desktop = در کامپیوترهای رومیزی، می‌توانید آخرین‌ها را دریافت کنید:
record-platform-not-supported-ios = کاربران <bold>iOS</bold> می‌توانند برنامه آزاد ما را دریافت کنند:
record-must-allow-microphone = شما باید مجوز دسترسی به میکروفون را صادر کنید.
record-no-mic-found = هیچ میکروفونی یافت نشد
record-error-too-short = ضبط خیلی کوتاه بود.
record-error-too-long = ضبط خیلی طولانی بود.
record-error-too-quiet = ضبط خیلی کم صدا بود.
record-cancel = لغو ضبط دوباره
record-instruction = { $actionType }<recordIcon></recordIcon> سپس جمله را بلند بخوانید
record-stop-instruction = { $actionType }<stopIcon></stopIcon> وقتی انجام شد
record-three-more-instruction = سه تا باقی مانده!
unable-speak = اکنون نمی‌توانید صحبت کنید؟
review-instruction = در صورت لزوم، کلیپ‌ها را بازبینی و دوباره ضبط کنید
clips-uploaded = کلیپ‌های بارگذاری شده
record-abort-title = ابتدا ضبط کردن را تمام کنیم؟
record-abort-text = اکنون خارج شدن از اینجا بدان معنی است که پیشرفت خود را از دست خواهید داد
record-abort-continue = پایان ضبط
record-abort-delete = خروج و حذف کلیپ‌ها
listen-instruction = { $actionType }<playIcon></playIcon> آیا دقیقا این جمله را می‌گویند؟
record-button-label = صدای خود را ضبط کنید
share-title-new = برای یافتن صداهای بیشتر <bold>به ما کمک کنید</bold>

## Goals

days =
    { $count ->
        [one] روز
       *[other] روزها
    }
recordings =
    { $count ->
        [one] در حال ضبط
       *[other] ضبط شده‌ها
    }

## Dashboard

toward-next-goal = به سوی هدف بعدی
you = شما
top-contributors = مشارکت کنندگان برتر
total-approved = مجموع تایید شده
overall-accuracy = دقت کلی

## Profile Delete

keep = نگاه داشتن
remove = حذف
profile-form-delete = حذف نمایه
