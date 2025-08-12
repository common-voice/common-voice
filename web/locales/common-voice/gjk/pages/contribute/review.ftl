## REVIEW

sc-review-lang-not-selected = تمين هزِي ڪونئين ٻولِي سليڪٽ نٿِي ڪرِي ميرٻانِي ڪرينَ پوتا نِي ٻولِي سليڪٽ ڪريا ۿارو پروڦائيل مان زائو <profileLink>
sc-review-title = جُملان جو جائزو ليو
sc-review-loading = جُملا اُوپاڙيَ سي ريون۔۔۔
sc-review-select-language = ميرٻانِي ڪيرنَ جُملان نو جائزو ليڌا ۿارُو ٻولِي نين سليڪٽ ڪرو
sc-review-no-sentences = جائزو ليڌا ۿارُو ڪونئين جُملا نٿِي <addLink> هويَ وڌارين جُملا ايڍ ڪرو۔ </addLink>
sc-review-form-prompt =
    .message = جُملان نو جائزو لئِي ليڌو سي پڻ هزِي حواليَ نٿِي ڪريا، هاس سي؟
sc-review-form-usage = جملان نين هوريَ پاۿيَ ٿِي منظور ڪريا ۿارُو ۮٻاوينَ ڇِڪو۔ منظور نا ڪريا ۿارُو ڏاويَ پاۿيَ ٿِي ۮٻاوينَ ڇِڪو۔ ميڪِي ۮيڌا ۿارُو ماٿيَ ٿِي ۮٻاوينَ ڇِڪو۔ <strong> پوتا نو جائرو ۮيڌا نون نا ڀُولزُو </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = زريعو: چان ٿِي ليڌل سي: { $sentenceSource }
sc-review-form-button-reject = نا منظور
sc-review-form-button-skip = اِسڪِپ-ميڪِي ڄو
sc-review-form-button-approve = منظور ٿاوون
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ي
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ن
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = س
sc-review-form-keyboard-usage-custom = تمين منظور ڇا ۿارُو { sc-review-form-button-reject-shortcut } ڪِي ڀورڍ شارٽ ڪٽ پڻ اِستمال ڪرِي ۿڳو سو { sc-review-form-button-approve-shortcut } انين ميڪِي ۮيڌا ۿارُو پڻ{ sc-review-form-button-skip-shortcut }
sc-review-form-button-submit =
    .submitText = جائزو ليڌا نون کتم ڪرو
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] جُملان نو جائزو نٿِي ليواڻو
        [one] جُملا نو جائزو ليوائِي جھو سي، ميرٻانِي!
       *[other] جُملان نو جائزو ليوائِي جھو سي۔ ميرٻانِي
    }
sc-review-form-review-failure = جائزو سيوَ (جمع) نٿِي ٿئِي ۿڄو۔ ميرٻانِي ڪرينَ وريَ ڪوشش ڪرو
sc-review-link = جائزو، جانچ پڙتال

## REVIEW CRITERIA

sc-criteria-modal = جائزو-جانچ پڙتال نا معيار ڪان اصُول
sc-criteria-title = جائزو-جانچ پڙتال معيار ڪان اصُول
sc-criteria-make-sure = کاترِي ڪرو ڪي جُملا نيسين ۮيڌل معيار ڪا اصُول پرماڻيَ سي:
sc-criteria-item-1 = جُملو لازمِي سئِي هِجيَ ٿل هوئيَ۔
sc-criteria-item-2 = جُملو لازمِي گرامر پرماڻيَ سئِي هوئيَ۔
sc-criteria-item-3 = جُملو لازمِي ٻوليا لائق هوئيَ۔
sc-criteria-item-4 = زو جُملو معيار پرماڻيَ هوئي، تو ۿوريَ پاۿيَ ٿِي ٻٽڻ ماٿيَ&quot; منظور ڇا ۿارُو&quot; ڪِلڪ ڪرو
sc-criteria-item-5-2 = زو جُملو ماٿيَ ۮيڌل معيار پرماڻيَ نا هوئيَ، تو&quot; نامنظور &quot; وارا ٻٽڻ ماٿيَ ڪِلڪ ڪرو زين ڏاويَ پاۿيَ سي۔ زو تمان نين جُملا نِي پڪ نا هوئيَ تو پسي تمين جُملو ميڪِي پڻ ۿڳو سو انين ٻيزيَ پاۿيَ زئِي ۿڳو سو۔
sc-criteria-item-6 = زو تمارون جُملان نو جائزو ليڌا نون کتم ٿئِي جھون سي، تو پسيَ ميرٻانِي ڪرينَ امارِي وڌارين جُملا ڀيڳا ڪريا مان مۮت ڪرو!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = چيڪ ڪرو <icon></icon> ڪيَ اِي لِسانِيات پرماڻيَ سئِي جُملو سي؟
sc-review-rules-title = شون جُملو هِڌائيتان پرماڻيَ سي؟
sc-review-empty-state = اتيار ۿوُڌِي آ ٻولِي مان ڪونئين ايوا جُملا نٿِي زين نو جائزو ليوو زويئين۔
report-sc-different-language = ڦرق ٻولِي
report-sc-different-language-detail = هون شين نو جائزو ليون سون ريو اِي تو آ ٻولِي مان تو ڦرق لکل سي۔
sentences-fetch-error = جُملان نين ۿڦرا ٺاۿيا ٽاڻيَ ايڪ مسلو ٿئِي جھو تو۔
review-error = جُملا نو جائزو ليڌا ٽاڻيَ ايڪ مسلو ڇو تو
review-error-rate-limit-exceeded = تمين الائِي تيز زائو سو ريا۔ ميرٻانِي ڪرينَ جُملان نو سئِي جائزو ليو اِي کاترِي ڪريا ۿارُو ڪيَ اِي سئِي سي۔
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = امين ڪانڪ موٽو ڦرق ڪريئين سيئين ريا۔
sc-redirect-page-subtitle-1 = جُملا ڀيڳا ڪريا وارو عام آواز نا پليٽفارم  نا کونڻا ڪور زائيَ سي ريو۔ تمين ڪوئين <writeURL> جُملو لکِي </writeURL>ۿڳو سو يا <reviewURL> جائزو </reviewURL> لئِي ۿڳو سو ايڪلا ۮيڌل جُملان نو زين عام آواز ماٿيَ ۮيڌل سي۔
sc-redirect-page-subtitle-2 = امان ٿِي <matrixLink> ميٽرِڪس ماٿيَ سوال پونسا ڪرِي ۿڳو سو۔ </matrixLink><discourseLink> وات وڳچ ڪرِي ۿڳو سو۔ </discourseLink><emailLink> يا اِي ميل ڪرِي ۿڳو سو۔</emailLink>
# menu item
review-sentences = جُملان نو جائزو ليو
