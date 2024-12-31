## REVIEW

sc-review-lang-not-selected = ټُويې څه زبان نک خوش دوک هۀ۔ مهرباني کېون خوپروفایل کی چیو<profileLink> که زبان يې خوش کی
sc-review-title = جملی زر يې نظرثاني کېون
sc-review-loading = ا جملي بو ډاؤن لوډ کَوَک سېن
sc-review-select-language = زباخوش کَۀ، که جملي زر يې دیم نظر نیکِز
sc-review-no-sentences = ته دیم نظر پاره دې هېڅ جمله نک هۀ
sc-review-form-prompt =
    .message = نظرثانی سُک جملي پېش نک سُکِن
sc-review-form-usage = په خورېنڅه وه کِشېون ته جمني ته منظوري پاره۔ په چيېله وه کِشېون ته ردؤ پاره۔ ته وتک پاره وه په پېچُمئ کِشېون۔<strong> ته نظرثانی ا پېشکؤ که ڒموت نک کی
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ذریعه/حواله
sc-review-form-button-reject = رد
sc-review-form-button-skip = سکپ
sc-review-form-button-approve = منظور
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = و
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ن
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = س
sc-review-form-keyboard-usage-custom = ته کیبورډ ا شارټ کټ بو ګه استعمال اېنچی{ sc-review-form-button-approve-shortcut } ته منظوري{ sc-review-form-button-reject-shortcut } ته رد{ sc-review-form-button-skip-shortcut } ته سکِپ کؤ
sc-review-form-button-submit =
    .submitText = ا نظرثاني ختم
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] هېڅ جمله يې نظرثاني نک سُک
        [one] 1 جمله يې نظرثاني سُک۔ تشکر
       *[other] { $sentences } جملي دی نظرثاني سُکِن
    }
sc-review-form-review-failure = ا نظرثاني سېو نک سُک، څُټکی وه کوشِش کَۀ زر
sc-review-link = نظرثانی

## REVIEW CRITERIA

sc-criteria-modal = ته نظرثاني ا پېمانه
sc-criteria-title = ته نظرثاني ا پېمانه
sc-criteria-make-sure = آ یقیني کَه ا جمله بُو ائ ځېم پېماني/ ݭړطی پوره کوی
sc-criteria-item-1 = ته جمله ا اِملا صحیح لیکک سُک هۀ
sc-criteria-item-2 = ته جمله ا ګرامر که صحیح بَۀ
sc-criteria-item-3 = ا جمله که ته غوېڅن/ هِشتک قابل بَۀ
sc-criteria-item-4 = که ا جمله ائ اره پېماني/ ݭړطی پُوره کوی، بيې &quot; منظور، &quot; خورېنڅه پلؤ ا بټن ځن
sc-criteria-item-5-2 = که ا جمله ائ بېژ بیان پېماني/ ݭړطی نک پُورۀ کوی بيې ته &quot; ا نامنظور/ رد بټن چيېله پلؤ ځن۔ که تو جمله باره نر ݭکمن بی، تُو بو ته سکِپ ا بټن ځوک اېنچی، او مُخکی ل بُو تر اېنچی
sc-criteria-item-6 = که تُو لاسته ته نظرثاني پناره ا جملي ختُم سېن، بيې دی بيے جملي جمع کَۀ۔
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = آ ګه چېک کَۀ <icon> که ترتُو ا جملي ته لسانیات په اصول صحیح یِن، که نا۔
sc-review-rules-title = آیا ا جملي ت ته هدایات په مطابق یِن؟
sc-review-empty-state = پېری دی مېن پۀ زبان نر ته نظرثاني پاره جملي نکِن
report-sc-different-language = بِڅخل زبان
report-sc-different-language-detail = او خه څه بی څه زبان نر لیکيېک ݭیوک هۀ، که ازه وې بُو نظرثاني نک کېم
sentences-fetch-error = که ا جملي م اِر بُ ورُوکِن، څه غلطي يې سُک
review-error = که آ جمله م بُو دُوباره م جیرَوَک/ نظرثاني مې بو داک، څه غلطي يې سُک
review-error-rate-limit-exceeded = تُو زُت تېز روان هې، دُشکی صابر سُن که آ یقیني کېوی که ا جملۀ ت صحیح هۀ۔
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ماڅ دی بو څه غټی تبدیليے کيېن
sc-redirect-page-subtitle-1 = ته جملي ا جمع کَوُونکئ ته مشترک آواز پلېټ فارم کی روان هۀ
sc-redirect-page-subtitle-2 = ماخ دی ته سوَلي پِشتِنئ ته پۀ لنک په تهرو<matrixLink> یا ته پۀ ای مېل په پته <emailLink> کوئ
# menu item
review-sentences = جملی زر يې نظرثاني کېون
