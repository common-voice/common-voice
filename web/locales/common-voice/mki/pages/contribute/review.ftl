## REVIEW

sc-review-lang-not-selected = اوهان ڪا به ٻولي ڪون چونڊي هي. ٻولي چونڊڻ لاءِ مھرباني ڪري آپري <profileLink>Profile</profileLink> ڏانھن جاو.
sc-review-title = جملن رو جائزو  ڎ ٺو
sc-review-loading = جملا لوڊ ٿي ڀيا…
sc-review-select-language = مھرباني ڪري جملنا رو جائزو ليڻ لاءِ ٻولي چونڊ و.
sc-review-no-sentences = جائزو ليڻ لاءِ ڪوبه جملو ڪوني هي. <addLink>همي وڌيڪ جملا شامل ڪرو!</addLink>
sc-review-form-prompt =
    .message = نظرثاني ٿيل جملا پيش ڪوني ڪريا هي، پڪ هي؟
sc-review-form-usage = جملي ري منظور ڪرڻ لاءِ ساڄي طرف سوائپ ڪرو. اي  نا  رد ڪرڻ لاءِ کاٻي پاسي سوائپ ڪرو. اي  نا  ڇڏڻ لاءِ مٿي سوائپ ڪرو. <strong>آڀرو جائزو جمع ڪرائڻ نه وسارو!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ذريعو: { $sentenceSource }
sc-review-form-button-reject = رد ڪرو
sc-review-form-button-skip = ڇڏي ڏيو
sc-review-form-button-approve = منظور ڪرو
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = s
sc-review-form-keyboard-usage-custom = اوھان ڪي بورڊ شارٽ ڪٽ پڻ استعمال ڪري سگھو ٿا: { sc-review-form-button-approve-shortcut } منظور ڪرڻ لاءِ، { sc-review-form-button-reject-shortcut } رد ڪرڻ لاءِ، { sc-review-form-button-skip-shortcut } ڇڏڻ لاءِ
sc-review-form-button-submit =
    .submitText = جائزو ختم ڪرو
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ڪوبه جملو نظرثاني ٿيل ڪوني هي
        [one] 1 جملي رو جائزو ليو. اوهان ري مهرباني!
       *[other] { $sentences } جملنا رو جائزو ليو. اوهان ري مهرباني!
    }
sc-review-form-review-failure = جائزو محفوظ نه ٿي سگهو. مهرباني ڪري ڪجھہ دير رکي وڙي ڪوشش ڪرو.
sc-review-link = نظر ثانينظرثاني ڪرو

## REVIEW CRITERIA

sc-criteria-modal = ⓘ نظرثاني رو معيار
sc-criteria-title = نظرثاني ري معيار
sc-criteria-make-sure = پڪ ڪرو ته جملو هيٺين معياران تي پورو اي ٿو.
sc-criteria-item-1 = جملي نا صحيح طور تي لکڻ کڀي.
sc-criteria-item-2 = جملو گرامر ري لحاظ کان درست هوڻ کڀي.
sc-criteria-item-3 = جملو ڳالهائڻ جوڳو هئوڻ کڀي.
sc-criteria-item-4 = جيڪڏهن جملو معيار تي پورو ڪوني هي، "منظور ڪرو" تي ڪلڪ ڪرو. ساڄي پاسي وارو بٽڻ.
sc-criteria-item-5-2 = جيڪڏهن جملو مٿي ڏنل معيار کي پورو ڪون ڪري، ڪلڪ ڪريو &quot;رد ڪرو&quot; کاٻي پاسي بٽڻ. جيڪڏهن اوهان نا جملي ري باري ۾ تصديق ڪوني هي، ته اوهان اي نا ڇڏي به سگهو ٿا ۽ اڳتي وڌو.
sc-criteria-item-6 = جيڪڏھن اوھان ري نظرثاني ڪرڻ لاءِ جملا ختم ٿي گيا ھي، مھرباني ڪري وڌيڪ جملا گڏ ڪرڻ ۾ اسان ري مدد ڪرو!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = چيڪ ڪرو <icon></icon> ڪئ هي لساني لحاظ کان درست جملو هي؟
sc-review-rules-title = ڪئ جملو هدايتن نا پورو ڪري ڀيو؟
sc-review-empty-state = في الحال اي ٻوليءَ ۾ نظرثاني ڪرڻ لاءِ ڪي به جملا ڪوني ھي.
report-sc-different-language = مختلف ٻولي
report-sc-different-language-detail = او هيڪ ٻولي ۾ لکيو هي اي نا مختلف جنهن رو هون جائزو  لي ھان رهيوهان.
sentences-fetch-error = جملي نا آڻڻ ۾ هيڪ غلطي ٿي گئ
review-error = اي جملي رو جائزو ليڻ ۾ غلطي ٿي گئ
review-error-rate-limit-exceeded = اوهان تمام تيز ڃاو  ڀيا. مهرباني ڪري هيڪ لمحو لو جملي رو جائزو ليڻ لاءِ پڪ ڪرڻ لاءِ ته او صحيح هي.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = اسان ڪجهه وڏيون تبديليون ڪران ڀيا
sc-redirect-page-subtitle-1 = جملا ڪليڪٽر بنيادي عام آواز پليٽ فارم ڏانهن منتقل ٿي رهيو هي. اوھان ھمي ڪري سگھو ٿا <writeURL>لکيو</writeURL> ھيڪ جملو يا <reviewURL>review</reviewURL> ھيڪ جملو جمع ڪرايا جاي عام آواز تي.
sc-redirect-page-subtitle-2 = اسان نا سوال پڇو <matrixLink>Matrix</matrixLink>، <discourseLink>Discourse</discourseLink> or <emailLink>email</emailLink>.
# menu item
review-sentences = جملن رو جائزو  ڎ ٺو
