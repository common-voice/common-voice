## REVIEW

sc-review-lang-not-selected = اوهان ڪا به ٻولي ڪوني چونڊي هي. ٻولي ٻلوڻ لاءِ مھرباني ڪري آڀري <profileLink>Profile</profileLink> نا ڃو.
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
