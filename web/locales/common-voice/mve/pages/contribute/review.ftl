## REVIEW

sc-review-lang-not-selected = ڪِي ٿون ڪو ٻولي چُونڊِي هَي۔ مهربونِي ڪري جائو<profileLink>پُروفائيل</profileLink> چُونڊو آپرِي ٻولِي
sc-review-title = جملا وَڙيَ جونچو
sc-review-loading = جملا آڻ آݪا هَي
sc-review-select-language = مهربونِي ڪريَ ٻولِي چونڊو جملا جونجڻ هارون
sc-review-no-sentences = ڪو ڀِي جملو ڪونِي جونچڻ هارون۔<addLink> ٻيجا ڀِي جملا شامل ڪرو هڻي </addLink>
sc-review-form-prompt =
    .message = جونچوڙا جملا انجيَ تائين جما ه”ڪونِي هويا هَي؟ ٿوني يقين هَي
sc-review-form-usage = جملي نَي سهي ڪرڻ هارون سَڌي پاهيَ دٻائو
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = وسِيلو{ $sentenceSource }
sc-review-form-button-reject = رد ڪرڻ يان منها ڪرڻ
sc-review-form-button-skip = ڇوُڙڻ
sc-review-form-button-approve = سهي ڪرڻ يان اجازت ڏيڻ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ي
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ن
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = س
sc-review-form-keyboard-usage-custom = ٿَي استمعال ڪريَ هگھون هون ڪِبورڊ را شورٽ ڪٽ { sc-review-form-button-approve-shortcut } سهي ڪرڻ هارون { sc-review-form-button-reject-shortcut }رد ڪرڻ هارون { sc-review-form-button-skip-shortcut } ڇوُڙڻ هارون
sc-review-form-button-submit =
    .submitText = جونچڻ ختم ڪرو
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ڪو ڀِي جملو ڪونِي جوئيو يا جونچيو
        [one] هيڪ جملو جوئيو جونچيو۔ مهربونِي
       *[other] { $sentences } جملا جوئيا يان جونچيا۔ مهربونِي
    }
sc-review-form-review-failure = جونچوڙا جملا سَيو ڪوني هويا هَي۔ مهربونِي ڪريَ وَڙيَ ڪوشِيش ڪرو
sc-review-link = جونچو

## REVIEW CRITERIA

sc-criteria-modal = ميهار جونچو
sc-criteria-title = ميهار جونچو
sc-criteria-make-sure = اَي ڌيان راکو ڪيَ جملا ڏِينوڙيَ ميهار ريَ مطابق هوئي هَي
sc-criteria-item-1 = جملا سهي نموُني هون لِکو
sc-criteria-item-2 = جملا گرامر ري مطابق هون سهي هوڻ کپيَ
sc-criteria-item-3 = جملو ٻولڻ ري قابِل هوئي کپيَ
sc-criteria-item-4 = اگر جملو ميهار هون مليَ هَي تو دٻائو&quot; سهي ڪرڻ &quot; بٽڻ هَي سڌَي پاهيَ
sc-criteria-item-5-2 = اگر جملو ڏِينوڙي ميهار ريَ مطابق ڪونِِي تو اُوئي ني رد ڪرو&quot; بٽڻ اُڀتي پاهَي۔ اگر ٿوني جملي ري باريَ ۾ ڪونِي خبر تو ٿَي ڇوڙي ڀِي هگھون هون هانَ ٻِيجي تي جائي هگھون هون
sc-criteria-item-6 = اگر ٿون ڪني جونچڻ هارون جملا ختم هويا را تو مهربونِي ڪريَ مهورِي مدد ڪرو جملا جما ڪرڻ ۾
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = جونچو <icon> ڪِي گرامر ريَ مطابق سهي هَي جملو
sc-review-rules-title = ڪِي جملي ڏِينوڙِي هدايت هون ملي هَي۔
sc-review-empty-state = اِيئي ٻولِي ۾ هڻي ڪو ڀِي جملو جونچڻ هارون ڪونِي هَي
report-sc-different-language = الگ الگ ٻوليَ يان مختلِيف ٻوليَ
report-sc-different-language-detail = ڪِي لکوڙِي ٻولِي الگ هوئي هَي جڪو هُون جونچي ريو هون۔
sentences-fetch-error = جملا جونچڻ ۾ هيڪ خرابِي ملِي هَي
review-error = جملا جونچڻ ۾ هيڪ خرابِي ملِي هَي
review-error-rate-limit-exceeded = ٿَي ڇيڪا جاو پڙيا۔ ٿوڙو ڌيان هون جملا جونچتا جاو هانَ سهي ڀِي ڪرتا جاو۔
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ميه ڪجه موٽا بدلاو ڪرون پڙيا
sc-redirect-page-subtitle-1 = جملا جما ڪرڻ آݪوبُنيادِي ڪومن وئِيس ريَ  پليٽ فارم جائي پڙيو۔ ٿَي جائي هگھون هون<writeURL>لکو </writeURL>هيڪ جملو يان<reviewURL>جونچي </reviewURL>هيڪ ئِي جملو جما ڪرڻ ڪومن وئِيس تي
sc-redirect-page-subtitle-2 = سوال پُوڇو <matrixLink>مٽريڪس</matrixLink><discourseLink>ڊيس ڪورس </discourseLink>يان <emailLink>اِي ميل </emailLink>
# menu item
review-sentences = جملا جونچو
