## REVIEW

sc-review-lang-not-selected = تم ڪوئي ٻولي ڪوني ليڌي ڇو مهرباني ڪرين آپيري پيروفآئلي پر جآئو
sc-review-title = جملين ڌوبآرا ۮيکو
sc-review-loading = جمآ ڪيڌوڙآ جملآ
sc-review-select-language = مهربآني ڪرين جملي رو فآئڌو لي سآرو ٻولي دوندو
sc-review-no-sentences = فآئدو لي سآرو ڪوئي ڀي جملو ڪوني . <addLink>وديڪ جملآ ڀيڙي ڪرو</addLink>
sc-review-form-prompt =
    .message = ڌيکوڙآ جملآ جمه ڪوني ڪرآئي ڇو پڪ ڇي
sc-review-form-usage = جملي ني مآني سآرون ساڃي پآسي سوائپ ڪرو<strong>رد ڪري سآرون اُڌي پآسي سوآئپ ڪرو او ني چهوڙي سآرون مآٿي ڪرو آپير جآڻ جمه ڪرڻو نآ ڀوليس</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = رستو{ $sentenceSource }
sc-review-form-button-reject = کتم ڪرڻو
sc-review-form-button-skip = چهوڙ ڌي
sc-review-form-button-approve = مآنڻو
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = وآئي
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = اين
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = ايس
sc-review-form-keyboard-usage-custom = تم ڪي بورڊ  شآرٽ ڪٽ ڀي استمآل ڪر سکو ڇو{ sc-review-form-button-approve-shortcut } رد ڪري سآرو { sc-review-form-button-reject-shortcut }  ڇوڙي سآرون { sc-review-form-button-skip-shortcut }
sc-review-form-button-submit =
    .submitText = ۮيکڻو کتم ڪرو
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ڪي ڀي جملي ني نهي ۮيکيو گيو                                                                                    0
        [one] جملي ني ۮيکيو گيو ڇي    مهربآني                                                                               ايڪ
       *[other] جملي ني وڙي ۮيکيو گيو ڇي مهرباني                                                                            ڌوجي
    }
sc-review-form-review-failure = ۮيکڻو محفوز ڪوني هويو مهربآني ڪرين وڙي ڪوشش ڪرو
sc-review-link = ڌوبآرا ڌيکڻو

## REVIEW CRITERIA

sc-criteria-modal = ۮيکي رو فائدو
sc-criteria-title = ۮيکي رو فائدو ڇي
sc-criteria-make-sure = پڪ ڪرو تم جملو هيٺي اميدي سون وڍيڪ اُتري ڇي
sc-criteria-item-1 = جملآ سئي لکڻ کپي
sc-criteria-item-2 = جملو گرمري لييازي سون سئي هوئڻ کپي
sc-criteria-item-3 = جملو ٻولي جسو هوئڻ کپي
sc-criteria-item-4 = جۮي جملو اميڌي سون وڏيڪ اتري ڇي سآڃي پاسي ڪبول ڪرو ٻٽڻي پر ڪلڪ ڪرو
sc-criteria-item-5-2 = جھڌي جملو اميڌي سون مآٿي ڪوني اُتر رو تو اوني اُوڌي پاسي رد ڪر ڪآڙو ٻٽڻي پر ڪليڪ ڪرو ۔جملي سآرو پڪ ڪوني تو &quot;اوني ڇوڙ ڀي سکو ڇي ائين آئي وآڙي پر وڍ سکو ڇي۔&quot;
sc-criteria-item-6 = جيڪڏهن تمآ ڪني جملآ ڌيکي سآرو کتم هو جآوي ۔مهرباني ڪرين وڌيڪ جملآ لي سارو همآري مدد ڪرو
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = چيڪ ڪرو <icon> </icon> ڪآئي اي جملو لساني توري پر سئي ڇي
sc-review-rules-title = ڪآئي اي جملو سمجهي پر سئي آرو ڇي
sc-review-empty-state = اي ٽيم اي ٻولي مين ڌيکي لآ ڪوئي ڀي جملو ڪوني
report-sc-different-language = مختليف ڀولي
report-sc-different-language-detail = اي  ائم ٻولي مين ليکوڙا ڇي جيني هم ۮيک رهي ڇآن او سون مختليف ڇي
sentences-fetch-error = جملي مين لرئي سآرو ايڪ گلتي هوگئي
review-error = اي جملين ڌيکي مين ايڪ گلتي هو گئي
review-error-rate-limit-exceeded = تو جآم تيز ٻولرو ڇي۔ مهرباني ڪرين جملي مين ڌيکي سارو ايڪ منٽ ڪآڏ تو پڪ ڪرآن ڪي او سئي ڇي
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = هم وڌيڪ تبديلي لآ رهي ڇآن
sc-redirect-page-subtitle-1 = جملو ڪليڪٽر ڪور ڪآمن وآئس پليٽ فارمي سامون جآرو ڇي <writeURL> آٻي تم ڪآمن وآئس پر جملو ليک سڪو ڇو</writeURL> يا تم ايڪ جملو جمح ڪران ڌيک سڪ ڇو <reviewURL>
sc-redirect-page-subtitle-2 = همآ سون <matrixLink></matrixLink>,يا<discourseLink> <discourseLink> پر سوال ٻوجو<emailLink>l</emailLink>
# menu item
review-sentences = جملين ڌوبآرا ۮيکو
