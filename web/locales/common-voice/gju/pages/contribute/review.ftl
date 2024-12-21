## REVIEW

sc-review-lang-not-selected = تم نے کوئی زبان نیہہ چُنی ،برائے مہربانی جاؤں<profileLink>تعارف </profileLink>زباناں نا چُنن واسطے
sc-review-title = فقراں کو جائزو لیوں
sc-review-loading = فقراں کو  اُپر رکھنو
sc-review-select-language = برائے مہربانی فقراں کو جائزو لین واسطے زبان چُنو
sc-review-no-sentences = جائزہ واسطے کوئی فقرہ نیہہ ۔<addLink> ہون ہور فقراں گھلوں
sc-review-form-prompt =
    .message = جائزو کریا والا فقراں جمع نیہہ ہویا ، کیا اس گل کو یقین ہے ؟
sc-review-form-usage = تصدیق کرن واسطے سجے پاسے سویپ کروں ، تے قبول نہ کرن واسطے کھبے پاسے سویپ کروں ۔چھوڈن واسطے افراں سویپ کروں <strong>اپنا جائزہ نا جمع کرنو نہ بھُلیوں </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ذریعو
sc-review-form-button-reject = قبول نہ کرنو
sc-review-form-button-skip = چھوڈنو
sc-review-form-button-approve = منظور کرنو
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = وائے
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = این
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = ایس
sc-review-form-keyboard-usage-custom = تم کی بورڈ کی شارٹ کٹ بھی استعمال کر سکے { sc-review-form-button-approve-shortcut }،منظور کرن واسطے { sc-review-form-button-reject-shortcut }قبول نہ کرن واسطے { sc-review-form-button-skip-shortcut }چھوڈن واسطے
sc-review-form-button-submit =
    .submitText = جائزہ نا ختم کروں
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] کسی فقرہ کو جائزہ نیہہ ہویو
        [one] ایک فقرہ کو جائزو ہو گیو ، تھارو شکریو
       *[other] { $sentences }فقراں کو جائزو ہو گیو تھارو شکریو
    }
sc-review-form-review-failure = جائزو کریو وو کم محفوظ نہ ہو سکیو ۔برائے مہربانی بعد ما کوشش کریو
sc-review-link = جائزو

## REVIEW CRITERIA

sc-criteria-modal = جائزا کو طریقو
sc-criteria-title = جائزا کو طریقو
sc-criteria-make-sure = اس چیز نا یقینی بناؤ جے فقراں انہاں اصولاں بو پورا اُترے
sc-criteria-item-1 = فقراں ما سپیلنگ لازمی صحیح وھے
sc-criteria-item-2 = فقراں گرائمر کا لحاظ نال لازمی دُرست وھے
sc-criteria-item-3 = فقراں پرھن کے لازمی قابل وھے
sc-criteria-item-4 = کدے فقرا اصولاں پو پورا اُترے تے کلک کروں &quot;تصدیق کرو &quot;کو بٹن سجے پاسے
sc-criteria-item-5-2 = کدے فقرا دِتا وا اُصولاں پو پورا نہ اُترے تے بٹن دباؤ&quot;قبول نہ کرو &quot;بٹن کھبے پاسے۔ کدے تم نا فقرا کا بارا ما یقین نیہہ تے تم اس نا چھوڈ سکے تے اگلا پو جا سکے
sc-criteria-item-6 = کدے جائزو لین واسطے تھارا فقرا ختم ہو گیا ہے تے تم ہور فقراں جمع کرن ما مھاری مدد کرو
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = کلک کرو <icon> </icon>آیو یوہ زباناں کا اعتبار نال صحیح فقرو ہے ؟
sc-review-rules-title = آیو فقراں دتی وی راہنمائی پو پورا اُترے
sc-review-empty-state = اس زبان ما صحیح طور پو جائزا واسطے کوئی فقرا نیہہ
report-sc-different-language = مختلف زبان
report-sc-different-language-detail = یوہ اس زبان تے مختلف زبان ما لکھیو ہے جس ما ہوں جائزو کروں
sentences-fetch-error = فقرو بناتاں واں ایک غلطی آگئی
review-error = اس فقرا کو جائزو لیتا واں غلطی آ گئی
review-error-rate-limit-exceeded = تم مُچ تیز چلے لگا ۔برائے مہربانی فقرا  کو جائزو لین واسطے ایک لمحو ٹھہرو  تے اس گل کو یقین کرو جے یوہ ٹھیک ہے
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = تم ایک مُچ بڑی تبدیلی لاوے لگا
sc-redirect-page-subtitle-1 = فقراں نا جمع کرن ہالو عام زباناں کا پلیٹ فارم پو جائے لگو ۔تم ہون <writeURL>لکھ سکے </writeURL>ایک فقرو <reviewURL>جائزو لے سکے </reviewURL> ایکو ہی
sc-redirect-page-subtitle-2 = مھارے تے اس پو سوال پچھو <matrixLink>میٹرکس </matrixLink> <discourseLink>گل بات </discourseLink>یا <emailLink>ای میل </emailLink>
# menu item
review-sentences = فقراں کو جائزو لیو ں
