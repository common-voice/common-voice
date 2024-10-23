## REVIEW

sc-review-lang-not-selected = تؤ کا ٻی ٻولیاں نہ چُݨیاں۔ مہربانی کر تے ٻولیاں چُݨن واسطے آپݨی <profileLink>پروفائل</profileLink> ݙے ون٘ڄ۔
sc-review-title = ڳالھ وارینک وتا لال
sc-review-loading = ڳالھ وار چین٘دے پئین۔۔۔
sc-review-select-language = مہربانی کر سݨ تے ڳالھ وارینک وتا لالݨ واسطے ہِک ٻولی چُݨ۔
sc-review-no-sentences = لالݨ واسطے کا ڳالھ وارینک نہ تھئین۔ <addLink>انھیاں مزید ڳالھ وارینک وِڄ!</addLink>
sc-review-form-prompt =
    .message = لالے ڳے ڳالھ وارینک جمع نان تھئے، صحیح ہے؟
sc-review-form-usage = ڳالھ وارینک تصدیق کرݨ واسطے سڄے پاسے ڄُلکا۔ ہیانک رد کرݨ واسطے کھٻے پاسے ڄُلکا۔ ہیانک چھوڑݨ واسطے اُچّا ڄُلکا۔ <strong>آپݨی رائے ݙیݨ نہ بُھلے ڄے!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ذریعہ: { $sentenceSource }
sc-review-form-button-reject = رد
sc-review-form-button-skip = چھوڑ
sc-review-form-button-approve = منظور
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ہا
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = نہ
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = چھوڑ
sc-review-form-keyboard-usage-custom = تو کی بورڈ تے شارٹ کٹ استعمال کر سڳدا ہیں: { sc-review-form-button-approve-shortcut }منظوری واسطے، { sc-review-form-button-reject-shortcut } رد کرݨ واسطے،{ sc-review-form-button-skip-shortcut } چھوڑݨ واسطے
sc-review-form-button-submit =
    .submitText = لالݨ ختم کر
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] کا ٻی ڳالھ وار نان لالے ڳئے۔
        [one] 1 ڳالھ وار لالہ ڳیا ہے۔ تا جی مہربانی!
       *[other] { $sentences } ڳالھ وار لالے ڳئین۔ تا جی مہربانی!
    }
sc-review-form-review-failure = لالݨ محفوظ نئے تھیا ڳیا۔ مہربانی کر وتا بعد آ کوشش کر۔
sc-review-link = وتا لالݨ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ وتا لالݨ تا معیار
sc-criteria-title = وتا لالݨ تا معیار
sc-criteria-make-sure = تسلی کر تے ڳالھ وار ہے معیار ساں مِلدا ہے:
sc-criteria-item-1 = ڳالھ وار صحیح آکھا ڳیا وئے۔
sc-criteria-item-2 = ڳالھ وار گرامر تے لحاظ ساں درست وئے۔
sc-criteria-item-3 = ڳالھ وار ڳالھݨ تے جوڳا وئے۔
sc-criteria-item-4 = اگر ڳالھ وار معیار ساں مِلدا ہے، تاں سڄے پلّے والے بٹݨ &quot;منظوری&quot; تے کلک کر۔
sc-criteria-item-5-2 = اگر ڳالھ وار اُتّوں والے معیار ساں نئیں مِلدا، تاں کھٻّے پلّے والے &quot;رد&quot;دے بٹݨ تے کلک کر۔ اگر تو جُملے تی شکی ہیں، تُو ٻیال ہوک چھوڑ کر اڳّوں والے تی ون٘ڄ سڳدا ہیں۔
sc-criteria-item-6 = اگر وتا لالݨ واسطے تاں جے ڳالھ وارینک ختم تھی ڳئین، تاں مہربانی کر ٻے ڳالھ وارینک وِڄݨ دی ساں جی مدد کر!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = لال <icon></icon> چھا ہے لسانی اعتبار ساں صحیح ڳالھ وار ہے؟
sc-review-rules-title = چھا ڳالھ وار رہنمائی اصولیں سا مِلدا ہے؟
sc-review-empty-state = حال فی الحال ہے ٻولی تے وِڄ وَتا لالݨ واسطے کا ڳالھ وار ٻی نہ تھئین۔
report-sc-different-language = مختلف ٻولی
report-sc-different-language-detail = ہے ہے ٻولی آ علیحدہ ہے جئینک آں پیا لالین٘دا ہیں۔
sentences-fetch-error = ڳالھ وارینک گُھلّݨ تے وِڄ ہِک غلطی اَچ ڳئی ہِے
review-error = ڳالھ وارینک وتا لالݨ تے وِڄ ہِک غلطی اَچ ڳئی ہے
review-error-rate-limit-exceeded = تو گھݨاں تیز پیا وین٘دا ہیں۔ مہربانی کر ڳالھ وارینک ٹھیک کرݨ واسطے ہِک جھٹ وتا لال۔
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = اسے کُجھ وݙیاں تبدیلیاں کندے پیؤں
sc-redirect-page-subtitle-1 = ڳالھ وارینک جمع کرݨ والا کور کامن وائس پلیٹ فارم طرف وین٘دا پیا ہے۔ انھیاں تو کامن وائس تی ہِک ڳالھ وار <writeURL>لکھ</writeURL> سڳدا ہیں یا ہِکلا <reviewURL>وتا لال</reviewURL> جمع کر سڳدا ہیں۔
sc-redirect-page-subtitle-2 = اساں واں <matrixLink>میٹرکس</matrixLink>، <discourseLink>ڈس کورس</discourseLink> یا <emailLink>ای میل</emailLink> تی سوال پُچھ۔
