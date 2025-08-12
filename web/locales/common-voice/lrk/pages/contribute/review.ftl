## REVIEW

sc-review-lang-not-selected = تمي ڪوئي ڀي ٻولي ڪوئي چونڊي هي. ٻوليون چونڊيا ھارو مهربوي ڪرين آپري <profileLink>پروفائل</profileLink> تي جاوُ.
sc-review-title = جملا رو جائزو ليو
sc-review-loading = ݾروع ھوئي ريا جملا
sc-review-select-language = مھربوني ڪرين جملو رو جائزا ھارو  ٻولي چونڌو
sc-review-no-sentences = ھمي وڌيڪ جملا<addLink>جائزوليدا ھارو ڪوئي بي جملو ناهو.پسي  وڌيڪ جملا ڀيرا ڪرو!<</addLink>
sc-review-form-prompt =
    .message = ديکيڙا جملا جمع ڪوئي ڪرايا ھي، پڪ هي؟
sc-review-form-usage = جملا ني منظور ڪريا ھارو اوندھا پاھي سوائپ ڪرو. رد ڪريا ھارو کاٻي ري پاھي سوائپ ڪرو. او ني سوڙيا ھارو ماٿي سوائپ ڪرو. <strong>آپرو جائزو جمع ڪراوُ نه ويرو!
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ذريعو{ $sentenceSource }
sc-review-form-button-reject = رد ڪرو
sc-review-form-button-skip = سوڙي ديو
sc-review-form-button-approve = منظور ڪرو
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = وايي
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = اين
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = ايس
sc-review-form-keyboard-usage-custom = تمو ني بورڊ شارٽ ڪٽ پڻ استعمال ڪري سگهو{ sc-review-form-button-approve-shortcut }منظور ڪريا ھارو { sc-review-form-button-reject-shortcut }سوڙيا ھارو{ sc-review-form-button-skip-shortcut }رد ڪريا ھارو { sc-review-form-button-reject-shortcut }
sc-review-form-button-submit =
    .submitText = جائزو ختم ڪرو
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ڪوبي جملو رو جائزو ڪوئي ليدو گيو.
        [one] 1جملا رو جائزو ليدو گيو ھي. مهربوني!
       *[other] { $sentences }جملا رو جائزو ليدو گيو ھي. مهربوني!
    }
sc-review-form-review-failure = جائزو محفوظ ڪوئي ھوئي سگهيو. مهربوني ڪرين پسي وري ڪوشش ڪرجو.
sc-review-link = نظرثاني ڪرو

## REVIEW CRITERIA

sc-criteria-modal = جائزو رو معيار
sc-criteria-title = جائزو رو معيار
sc-criteria-make-sure = پڪ ڪروڪي جملو هيٺي معيارن تي پورو اوتريو ھي:
sc-criteria-item-1 = جملي ني صحيح لاگوُا کپي.
sc-criteria-item-2 = جملو گرامر ري لحاظ مون صحيح سھي ھووُ ڪپي.
sc-criteria-item-3 = جملو ٻئليا ري لائق هووُ کپي.
sc-criteria-item-4 = جيڪڏي جملو معيار تي پورو اوتري ، تو ڪلڪ ڪرو منظور ڪرو;تي ڪلڪ ڪرو ھوما پاھي ھوڻووُ
sc-criteria-item-5-2 = جيڪدي جملو ماٿلي معيارو تي پورو نه اوتري تو، ڪلڪ ڪرو&quot; منا &quot;اوندھا پاھي بٽڻ. جيڪدي تمي جملا پڪ ڪوئيني ، تو تمي او ني سوڙي ھگهوھين ايتي جاوُ.
sc-criteria-item-6 = جيڪدي تموني ڪني جائزو ليدا ھارو جملا ختم ھوئي گيا ھي، مهربوني ڪرين وڌيڪ جملا ڀيرا ڪريا ۾ اموري  مدد ڪرو!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = چيڪ ڪريو<icon></icon>ڪاوآ لساني لحاظ مون صحيح جملو هي؟
sc-review-rules-title = ڪاوُ جملو هدايتن تي پورو اوتريو ھي؟
sc-review-empty-state = اي وقت تي اي ٻولي ۾ جائزو ليڌا ھارو ڪوئي بي جملا ڪوئني.
report-sc-different-language = الگ ٻولي
report-sc-different-language-detail = ايڪ ايوي ٻولي ۾ لکيوڙوهي جي ھون جائزو ليو ھون اي مون مختلف هي.
sentences-fetch-error = جملو ني لايا ھارو ايڪ غلطي ھوئي گئي.
review-error = اي جملو رو جائزو ليدا ۾ ايڪ غلطي ھوئي گيو.
review-error-rate-limit-exceeded = تمي تموم  تيزيءَ مون ٻولون ھو. مهربوني ڪرين جملا رو جائزو ليدا ھارو هڪ لمحو ڪاڍو تاڪي پڪ ڪرو ڪي او صحيح هي.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = امي ڪوئي  موٽي تبديليون لاوُ ھون
sc-redirect-page-subtitle-1 = سزا ڪليڪٽر ڪور ڪامن وائس پليٽ فارم ري طرف جائي  رهيو هي. تمي  ڪوئي ڪري سگهو.<writeURL>ليکو</writeURL> ايڪ جملو<reviewURL>واپسي</reviewURL>ڪليڪٽر ڪور ڪامن وائيس فارم طرف جائي  رهيو هي. تموني جو.
sc-redirect-page-subtitle-2 = ا مون مون سوال پوس<matrixLink>وميٽرڪس</matrixLink> <discourseLink>ٻولچال</discourseLink>ھين<emailLink>email</emailLink>
# menu item
review-sentences = جملا رو جائزو ليو
