## REVIEW

sc-review-lang-not-selected = ٿون ڪو ٻوليَ ڪونِي چونڊِي ھيَ۔ مھربونِي ڪريَ آپريَ <profileLink> پروفائل</profileLink>ٻوليَ چونڊڻ ھارو
sc-review-title = جُملون رو جائزو ليو
sc-review-loading = لوڊ ڪرتيَ جُملا…
sc-review-select-language = مهربونِي ڪريَ جُملو رو جائزو ليڻ ھارو ٻولِي چونڊو
sc-review-no-sentences = جائزو ليڻ ھارو ڪو بِي جُملو ڪونِي <addLink> ھيڻو ٻيجا جُملا شامل ڪرو</addLink>
sc-review-form-prompt =
    .message = جائزو ليوڙا جُملا ڪونِي جمع ڪِيا، ڪِي پَڪ ھيَ؟
sc-review-form-usage = جُمليَ نَي قبول ڪرڻ ھارو سُڀتيَ پاݾيَ ڇيڪو (سوائپ)۔ رد ڪرڻ ھارو اُڀتيَ پاݾيَ ڇيڪو (سوائپ)۔ ڇوڙڻ ھارو ماٿيَ ڇيڪو (سوائپ)۔<strong> آپرو جائزو جمع ڪرڻ نِي پونتريا!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = وسِيلو:{ $sentenceSource }
sc-review-form-button-reject = رد ڪرڻ
sc-review-form-button-skip = ڇوڙڻ
sc-review-form-button-approve = منظور ڪرڻ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ي
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ن
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = س
sc-review-form-keyboard-usage-custom = ٿيَ ڪِي بورڊ را شاٽ ڪٽ ڀِي استعمال ڪريَ ݾگھو ھو: { sc-review-form-button-approve-shortcut } منظور ڪرڻ ھارو،{ sc-review-form-button-reject-shortcut } رد ڪرڻ ھارو،{ sc-review-form-button-skip-shortcut } ڇوڙڻ ھارو
sc-review-form-button-submit =
    .submitText = جائزو ختم ڪرو
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ڪيَ ڀِي جُمليَ رو جائزو ڪونھي ھويوڙو۔
        [one] ھيڪيَ جُمليَ رو جائزو ھويوڙو ھيَ۔ ٿونرِي مھربونِي!
       *[other] { $sentences } جُملون رو جائزو ھويوڙو ھيَ۔ ٿونرِي مھربونِي!
    }
sc-review-form-review-failure = جائزو جمع يا محفوظ ڪونھي ھوئي ݾگھتو۔  مھربونِي ڪريَ وڙيَ ڪوشِش ڪرو۔
sc-review-link = جائزو

## REVIEW CRITERIA

sc-criteria-modal = ⓘ معيار رو جائزو
sc-criteria-title = معيار رو جائزو
sc-criteria-make-sure = پَڪ ڪرو ڪہ جُملو ھيٺيِن ڏِنوڙيَ معيارون تيَ پورو اُتريَ ھيَ۔
sc-criteria-item-1 = جُملو صحيح صحيح لکڻ کپيَ۔
sc-criteria-item-2 = جُملو گرامر ريَ مطابق  صحيح هوڻ کپيَ۔
sc-criteria-item-3 = جُملو ٻولڻ ري قابِل هوڻ کپيَ۔
sc-criteria-item-4 = جيَ جُملو معيار تيَ پورو اُتريَ، ڪلِڪ ڪرو&quot; منظور ڪرڻ ھارو &quot; سُڀتيَ پاݾيَ بٽڻ ھيَ۔
sc-criteria-item-5-2 = جيَ جُملو ماٺليَ معيار تيَ پورو نِي اُتريَ تو، ڪلِڪ ڪرو &quot; رد ڪرڻ ھارو&quot; اُڀتيَ پاݾيَ  بٽڻ ھيَ۔  جيَ ٿونيَ جُمليَ تيَ يقين ڪونھي، تو ٿيَ اِيئي نَي ڇوڙيَ ݾگھو ھو ھانَ  جائو ٻيجيَ جُملي تي۔
sc-criteria-item-6 = جيَ ٿون ڪنيَ جائزو ليڻ ھارون جُملا ختم ھوئيَ جائيَ تو، مھربونِي ڪرئَ وڌيڪ جُملا ڀيڙا ڪرڻ ۾ مھورِي مدد ڪرو۔
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = جونچو <icon> ڪِي اَي جُملو گرامر ريَ مطابق ٺيڪ ھيَ؟
sc-review-rules-title = ڪِي اَي جُملو رھنما اصولون ريَ  مطابق هَي۔
sc-review-empty-state = هڻي اِيئي ٻولِي ۾ ڪو ڀِي جُملو جائزو ليڻ هارون ڪونھي هَي۔
report-sc-different-language = الگ ٻولِي
report-sc-different-language-detail = جڪيَ ٻولِي ۾ ھُون جائزو ليو ھون اُوئي ھون اَي لِکوڙِي ٻولِي الگ ھيَ۔
sentences-fetch-error = جُملا ليَ آڻ ۾ ھيڪ غلطِي ھوئِي ھَي۔
review-error = اِيئي جُمليَ رو جائزو ليڻ ۾ ھيڪ مسئلو آئيَ پڙيو۔
review-error-rate-limit-exceeded = ٿيَ جوم تِکا ٻوليَ ريا ھو۔ مھربونِي ڪريَ جُمليَ رو جائزو ليڻ ھارون ٿوڙو صبر ڪرو ھانَ پَڪ ڪرو ڪہ اَي جُملو صحيح ھيَ۔
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = مھيَ ڪجھ موٽيَ تبدِليَ ڪريَ ريا ھون
sc-redirect-page-subtitle-1 = جُملا ڀيڙا ڪرڻ آݪو ڪامن وائس ريَ بُنيادِي پليٽ ڦارم تيَ جائيَ وئو۔ ٿيَ ھميَ ڪريَ ݾگو ھو <writeURL>لِکو</writeURL>ھيڪ جُملو يا<reviewURL>جائزو</reviewURL>ھيڪج جُملو ڪامن وائس تيَ جمع ڪرو۔
sc-redirect-page-subtitle-2 = مھون ھون سوال پُڇو <matrixLink>ميٽرڪس</matrixLink>،<discourseLink>ڊيسڪورس</discourseLink>يا<emailLink>اِي ميل</emailLink>۔
# menu item
review-sentences = جُملون رو جائزو ليو۔
