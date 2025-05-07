## REVIEW

sc-review-lang-not-selected = تمي ڪوئي پڻ ٻولي نٿِي سُونڍي۔ ميرڀونئِي ڪرينَ تمارا <profileLink>پروفائل</profileLink> مانه زائو ان ٻولي سُونڍو۔
sc-review-title = جُملون رو جائزو ليو
sc-review-loading = جُملا ڀرائه ريا۔۔۔
sc-review-select-language = ميرڀونئي ڪرينَ جُملون رو جائزو لِيڌا ۿارُو هيڪ ٻولِي رئي سُونڍ ڪرو۔
sc-review-no-sentences = جائزو لِيڌا ۿارُو ڪوئي جُملا نٿِي<addLink> هوَئہ نوا جُملا ڌاخل ڪرو!</addLink>
sc-review-form-prompt =
    .message = جائزو لِيڌل جُملا ڌاخل نہ ٿيا، ڪِي مونونه؟
sc-review-form-usage = جُملا رِي من﻿ظُورِي ۿارُو ۿاوَئہ پاهئہ سُوئِيپ  ڪرو۔ رد ڪريا ۿارُو ڏاوَئہ پاهئہ سُوئِيپ ڪرو۔ ساڏيا ۿارُو اُونسو سُوئِيپ ڪرو۔ <strong> آپرو جائزو ۮيوو مت ڀُولو!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ذرِيعو:{ $sentenceSource }
sc-review-form-button-reject = رد
sc-review-form-button-skip = ساڏوو
sc-review-form-button-approve = منظُور
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ي
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ن
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = س
sc-review-form-keyboard-usage-custom = تمي ڪِي بورڊ شارٽ ڪٽ پڻ اِستمعال ڪري هيڪو:{ sc-review-form-button-approve-shortcut } منظُور ڪريا ۿارُو، { sc-review-form-button-reject-shortcut } رد ڪريا ۿارُو، { sc-review-form-button-skip-shortcut } ساڏيا ۿارُو
sc-review-form-button-submit =
    .submitText = کتم دوهرائِي
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ڪوئي جُملا ۮيکيا ڪا ۮيکيا نٿِي ڳيا۔
        [one] جُملا زويا ڳيا۔ ميرڀونئي!
       *[other] { $sentences } جُملا زويا ڳيا۔ ميرڀونئي!
    }
sc-review-form-review-failure = جونچ پڙتال نٿِي ٿي هيڪئي، ميرڀونئي ڪرينَ ٻِيزي وار ڪوشِش ڪرو۔
sc-review-link = دوهرائِي

## REVIEW CRITERIA

sc-criteria-modal = دوهرائي رئي معيار
sc-criteria-title = دوهرائي رئي معيار
sc-criteria-make-sure = اي ڀروسو ڪرو جي جُملا اِيئا معيار مانه پُورا اُوترئہ:
sc-criteria-item-1 = جُملو سهِي ﻿اِمل﻿﻿ا ٿِي لِکل هوئہ۔
sc-criteria-item-2 = جُملو گرامر لا لحاظ ٿِي پڻ ٺِيڪ هوئہ۔
sc-criteria-item-3 = جُملو ايوو هوئہ جو ۿورئہ نمُونئہ ﻿ٻولي هيڪئہ۔
sc-criteria-item-4 = جيڪيۮِي جُملو اِيئا معيار مانه پُورو اُوترئہ، تون ڪِلِڪ ڪرو ڪوٽ انَ ; منظُورڪوٽ انَ; ۿاوَئہ پاهئہ بٽڻ مانه ڪِلِڪ ڪرو۔
sc-criteria-item-5-2 = جيڪيۮِي جُملو اِيئا معيار مانه پُورو اُوترئہ، تون ڪِلِڪ ڪرو، ڪوٽ انَ; رد ڪوٽ انَ; ڏاوَئہ پاهئہ ۮِيڌل بٽڻ مانه ڪِلِڪ ڪرو۔ جيڪيۮِي تمي جُملا را ڀارام ۾ مطمئن نٿِي، تون هايا جُملا نئہ ساڏينَ آڳۯ وڌي هيڪوه۔
sc-criteria-item-6 = جيڪيۮِي جونچ پڙتال ۿارُو جُملا کتم ٿي ﻿زائه۔ ميرڀونئي ڪرينَ وڌِيڪ جُملا ڀيۯا ڪريا ۾ مڌت ڪرئي زائہ!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Check<icon></icon>جيڪيۮِي تمون ڪنئہ زويا ۿارُو جُملا کتم ٿي ﻿زائہ تون ميرڀونئي ڪرينَ وڌِيڪ جُملا ڀيۯا ڪريا ۾ مڌت ڪرئي زائہ؟
sc-review-rules-title = ڪِي جُملا معيار مانه پُورو اُوترئہ؟
sc-review-empty-state = همڻئہ اِيئا ٻولِي ۾ زويا ۿارُو ڪوئي جُملا موجود نٿِي۔
report-sc-different-language = ڌار ٻولئي
report-sc-different-language-detail = اي اُوئا ٻولِي ۾ لکل سئہ جيا نئہ هُون نٿِي زوتو۔
sentences-fetch-error = جُملا حاصِل ڪريا ۾ ڪينڪ ڳلتئي ٿئي
review-error = اِيئا جُملا رِي جونچ پڙتال ڪرتون ڳلتئي ٿئي
review-error-rate-limit-exceeded = تمي جوم تِکا زائوه ريا۔ ميرڀونئي ڪرينَ ٿوڙِيڪ وار جُملا نئہ ۿاوۯ نمُونا ٿِي زوئو انَ اُوئا نئہ سهِي ڪرو۔
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = امي ڪنيڪ موٽي تبديلي ڪرونه ريا
sc-redirect-page-subtitle-1 = Sentence Collector هوَئہ مرڪزِي Common Voice platform مانه منتقِل ٿئه ريو۔ هوَئہ تمي <writeURL> لکو</writeURL> جُملو ڪا <reviewURL> دوهرائِي</reviewURL> Common Voice مانه هيڪ هيڪ جمع ڪري هيڪو۔
sc-redirect-page-subtitle-2 = <discourseLink>وات چِيت </discourseLink> ڪا <emailLink> اِيميل </emailLink>
# menu item
review-sentences = جُملون رو جائزو ليو
