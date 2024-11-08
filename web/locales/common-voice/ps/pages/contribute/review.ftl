## REVIEW

sc-review-lang-not-selected = تاسو کومه ژبه نه ده غوره کړې. مهرباني وکړئ د ژبې غوره کولو لپاره خپل <profileLink>Profile</profileLink> ته لاړ شئ.
sc-review-title = جملو ته بیا کتنه وکړئ
sc-review-loading = جملې لوډیږي...
sc-review-select-language = مهرباني وکړئ د جملو بیاکتنې لپاره یوه ژبه غوره کړئ.
sc-review-no-sentences = د بیاکتنې لپاره هیڅ جملې نشته. <addLink>اوس نورې جملې اضافه کړئ!</addLink>
sc-review-form-prompt =
    .message = بیاکتل شوي جملې ندي سپارل شوي، ایا تاسو ډاډه یاست؟
sc-review-form-usage = د جملې تصویب کولو لپاره ښي خوا ته سوايپ کړئ. د ردولو لپاره یې کیڼ لور ته سوايپ کړئ. د پریښودو لپاره پورته سوايپ کړئ. <strong>خپل نظر وړاندې کول مه هیروئ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = سرچینه: { $source }
sc-review-form-button-reject = رد کړه
sc-review-form-button-skip = پرېږدئ
sc-review-form-button-approve = تصویب کړه
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = هو
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = نه
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = پریږده
sc-review-form-keyboard-usage-custom = تاسو کولی شئ د کیبورډ شارټ کټ هم وکاروئ: { sc-review-form-button-approve-shortcut } د تصویب لپاره، { sc-review-form-button-reject-shortcut } د رد کولو لپاره، { sc-review-form-button-skip-shortcut } د پریښودو لپاره
sc-review-form-button-submit =
    .submitText = بیاکتنه پای ته ورسوي
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] هیڅ جمله بیاکتنه نه ده شوې.
        [one] 1 جمله بیاکتنه شوې. له تاسو مننه!
       *[other] { $sentences } جملې بیاکتنه شوې. له تاسو مننه!
    }
sc-review-form-review-failure = بیاکتنه خوندي نه شوه. مهرباني وکړئ وروسته بیا هڅه وکړئ.
sc-review-link = بیاکتنه

## REVIEW CRITERIA

sc-criteria-modal = ⓘ د بیاکتنې معیار
sc-criteria-title = د بیاکتنې معیار
sc-criteria-make-sure = ډاډ ترلاسه کړئ چې جمله لاندې معیارونه پوره کوي:
sc-criteria-item-1 = جمله باید په سمه توګه ولیکل شي.
sc-criteria-item-2 = جمله باید په ګرامري لحاظ سمه وي.
sc-criteria-item-3 = جمله باید د ویلو وړ وي.
sc-criteria-item-4 = که جمله معیارونه پوره کړي، د "منظور" تڼۍ کلیک وکړئ.
sc-criteria-item-5-2 = که جمله پورتني معیارونه پوره نه کړي، په &quot;رد&quot; کلیک وکړئ. تڼۍ په چپ اړخ کې. که تاسو د جملې په اړه ډاډه نه یاست، تاسو کولی شئ هغه پریږدئ او بلې ته لاړ شئ.
sc-criteria-item-6 = که تاسو د بیاکتنې لپاره جملې ختمې کړئ، مهرباني وکړئ موږ سره د نورو جملو په راټولولو کې مرسته وکړئ!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = <icon></icon> وګورئ ایا دا په ژبني لحاظ سمه جمله ده؟
sc-review-rules-title = ایا جمله لارښوونې پوره کوي؟
sc-review-empty-state = اوس مهال په دې ژبه کې د بیاکتنې لپاره هیڅ جملې شتون نلري.
report-sc-different-language = بېل ژبه
report-sc-different-language-detail = دا په هغه ژبه لیکل شوی چې زه یې بیاکتنه کوم توپیر لري.
sentences-fetch-error = د جملو په راوړلو کې تېروتنه رامنځته شوه
review-error = د دې جملې په بیاکتنه کې یوه تېروتنه رامنځته شوه
review-error-rate-limit-exceeded = تاسو ډیر چټک روان یاست. مهرباني وکړئ د جملې بیاکتنې لپاره یو څه وخت ونیسئ ترڅو ډاډ ترلاسه کړئ چې دا سمه ده.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = موږ یو څه لوی بدلونونه کوو
sc-redirect-page-subtitle-1 = د جملې راټولونکی د اصلي عام غږ پلیټ فارم ته حرکت کوي. تاسو اوس کولی شئ یو جمله <writeURL>لیکئ</writeURL> یا <reviewURL>بیاکتنه</reviewURL> په عام غږ کې د یوې جملې سپارل.
sc-redirect-page-subtitle-2 = په <matrixLink>Matrix</matrixLink>، <discourseLink>Discourse</discourseLink> یا <emailLink>email</emailLink> باندې پوښتنې وکړئ.
