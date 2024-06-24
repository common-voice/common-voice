## REVIEW

sc-review-lang-not-selected = توهان ڪا به ٻولي نه چونڊي آهي. ٻوليون چونڊڻ لاءِ مھرباني ڪري پنھنجي <profileLink>Profile</profileLink> ڏانھن وڃو.
sc-review-title = جملن جو جائزو وٺو
sc-review-loading = جملا لوڊ ٿي رهيا آهن…
sc-review-select-language = مھرباني ڪري جملن جو جائزو وٺڻ لاءِ ٻولي چونڊيو.
sc-review-no-sentences = جائزو وٺڻ لاءِ ڪوبه جملو نه آهي. <addLink>هاڻي وڌيڪ جملا شامل ڪريو!</addLink>
sc-review-form-prompt =
    .message = نظرثاني ٿيل جملا پيش نه ڪيا ويا آهن، پڪ آهي؟
sc-review-form-usage = جملي کي منظور ڪرڻ لاءِ ساڄي طرف سوائپ ڪريو. ان کي رد ڪرڻ لاءِ کاٻي پاسي سوائپ ڪريو. ان کي ڇڏڻ لاءِ مٿي سوائپ ڪريو. <strong>پنهنجو جائزو جمع ڪرائڻ نه وساريو!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ذريعو: { $sentenceSource }
sc-review-form-button-reject = رد ڪريو
sc-review-form-button-skip = ڇڏي ڏيو
sc-review-form-button-approve = منظور ڪريو
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = توھان ڪي بورڊ شارٽ ڪٽ پڻ استعمال ڪري سگھو ٿا: { sc-review-form-button-approve-shortcut } منظور ڪرڻ لاءِ، { sc-review-form-button-reject-shortcut } رد ڪرڻ لاءِ، { sc-review-form-button-skip-shortcut } ڇڏڻ لاءِ
sc-review-form-button-submit =
    .submitText = جائزو ختم ڪريو
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ڪوبه جملو نظرثاني ٿيل نه آهي.
        [one] 1 جملي جو جائزو ورتو ويو. توهان جي مهرباني!
       *[other] { $sentences } جملن جو جائزو ورتو ويو. توهان جي مهرباني!
    }
sc-review-form-review-failure = جائزو محفوظ نه ٿي سگهيو. مهرباني ڪري ڪجھہ دير رکي ٻيهر ڪوشش ڪندا.
sc-review-link = نظرثاني ڪريو

## REVIEW CRITERIA

sc-criteria-modal = ⓘ نظرثاني جو معيار
sc-criteria-title = نظرثاني جي معيار
sc-criteria-make-sure = پڪ ڪريو ته جملو هيٺين معيارن تي پورو لهي ٿو.
sc-criteria-item-1 = جملي کي صحيح طور تي لکڻ گهرجي.
sc-criteria-item-2 = جملو گرامر جي لحاظ کان درست هجڻ گهرجي.
sc-criteria-item-3 = جملو ڳالهائڻ جوڳو هئڻ گهرجي.
sc-criteria-item-4 = جيڪڏهن جملو معيار تي پورو لهي ٿو، "منظور ڪريو" تي ڪلڪ ڪريو. ساڄي پاسي وارو بٽڻ.
sc-criteria-item-5-2 = جيڪڏهن جملو مٿي ڏنل معيار کي پورو نٿو ڪري، ڪلڪ ڪريو &quot;رد ڪريو&quot; کاٻي پاسي بٽڻ. جيڪڏهن توهان کي جملي جي باري ۾ تصديق نه آهي، ته توهان ان کي ڇڏي به سگهو ٿا ۽ اڳتي وڌو.
sc-criteria-item-6 = جيڪڏھن توھان جي نظرثاني ڪرڻ لاءِ جملا ختم ٿي ويا آھن، مھرباني ڪري وڌيڪ جملا گڏ ڪرڻ ۾ اسان جي مدد ڪريو!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = چيڪ ڪريو <icon></icon> ڇا هي لساني لحاظ کان درست جملو آهي؟
sc-review-rules-title = ڇا جملو هدايتن کي پورو ڪري ٿو؟
sc-review-empty-state = في الحال ھن ٻوليءَ ۾ نظرثاني ڪرڻ لاءِ ڪي به جملا نه آھن.
report-sc-different-language = مختلف ٻولي
report-sc-different-language-detail = اهو هڪ ٻولي ۾ لکيو ويو آهي ان کان مختلف جنهن جو آئون جائزو وٺي رهيو آهيان.
sentences-fetch-error = جملن کي آڻڻ ۾ هڪ غلطي ٿي وئي
review-error = هن جملي جو جائزو وٺڻ ۾ غلطي ٿي وئي
review-error-rate-limit-exceeded = توهان تمام تيز وڃي رهيا آهيو. مهرباني ڪري هڪ لمحو وٺو جملي جو جائزو وٺڻ لاءِ پڪ ڪرڻ لاءِ ته اهو صحيح آهي.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = اسان ڪجهه وڏيون تبديليون ڪري رهيا آهيون
sc-redirect-page-subtitle-1 = جملا ڪليڪٽر بنيادي عام آواز پليٽ فارم ڏانهن منتقل ٿي رهيو آهي. توھان ھاڻي ڪري سگھو ٿا <writeURL>لکيو</writeURL> ھڪڙو جملو يا <reviewURL>review</reviewURL> ھڪڙو جملو جمع ڪرايا وڃن عام آواز تي.
sc-redirect-page-subtitle-2 = اسان کان سوال پڇو <matrixLink>Matrix</matrixLink>، <discourseLink>Discourse</discourseLink> or <emailLink>email</emailLink>.

