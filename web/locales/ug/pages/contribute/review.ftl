## REVIEW

sc-review-lang-not-selected = سىز ھېچقانداق تىل تاللىمىدىڭىز. <profileLink> تەرجىمىھال</profileLink> ىڭىزغا كىرىپ تىل تاللاڭ.
sc-review-title = جۈملىلەرنى تەستىقلاش
sc-review-loading = جۈملىلەرنى يۈكلەۋاتىدۇ…
sc-review-select-language = جۈملىلەرنى تەكشۈرىدىغان تىلدىن بىرنى تاللاڭ.
sc-review-no-sentences = تەكشۈرىدىغان ھېچقانداق جۈملە يوق. <addLink>ھازىرلا تېخىمۇ كۆپ جۈملە قوشاي!</addLink>
sc-review-form-prompt =
    .message = تەكشۈرۈلگەن جۈملە يوللانمىدى، شۇنداقمۇ؟
sc-review-form-usage = ئوڭغا سۈرۈلسە جۈملە تەستىقلىنىدۇ. سولغا سۈرۈلسە جۈملە رەت قىلىنىدۇ. <strong>تەكشۈرۈش نەتىجىڭىزنى يوللاشنى ئۇنتۇپ قالماڭ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = مەنبە: { $sentenceSource }
sc-review-form-button-reject = رەت قىل
sc-review-form-button-skip = ئاتلا
sc-review-form-button-approve = تەستىقلا
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = سىز ھەرپتاختا قىسقا يولىنى ئىشلىتەلەيسىز: { sc-review-form-button-approve-shortcut } كۇنۇپكىسى تەستىقلاش، { sc-review-form-button-reject-shortcut } كۇنۇپكىسى رەت قىلىش، { sc-review-form-button-skip-shortcut } كۇنۇپكىسى ئاتلاش
sc-review-form-button-submit =
    .submitText = تەكشۈرۈش تامام
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] تەكشۈرۈلگەن جۈملە يوق.
        [one] 1جۈملە تەكشۈرۈلدى، رەھمەت سىزگە!
       *[other] { $sentences }جۈملە تەكشۈرۈلدى، رەھمەت سىزگە!
    }
sc-review-form-review-failure = تەكشۈرۈشنى ساقلىيالمىدى. سەل تۇرۇپ قايتا سىناڭ.
sc-review-link = تەكشۈرۈش

## REVIEW CRITERIA

sc-criteria-modal = ⓘ تەستىقلاش ئۆلچىمى
sc-criteria-title = تەستىقلاش ئۆلچىمى
sc-criteria-make-sure = جۈملىنىڭ تۆۋەندىكى ئۆلچەملەرگە ماس كېلىدىغانلىقىنى جەزملەشتۈرۈڭ:
sc-criteria-item-1 = جۈملىنىڭ ئىملاسى چوقۇم توغرا يېزىلىشى كېرەك.
sc-criteria-item-2 = جۈملىنىڭ گرامماتىكىسى چوقۇم توغرا بولۇشى كېرەك.
sc-criteria-item-3 = جۈملىنى سۆزلىگىلى بولىدىغان بولۇشى كېرەك.
sc-criteria-item-4 = ئەگەر جۈملە بۇ ئۆلچەمگە توشسا، ئوڭ تەرەپتىكى «تەستىقلا» توپچىسى بېسىلىدۇ.
sc-criteria-item-5-2 = ئەگەر بۇ جۈملە يۇقىرىقى ئۆلچەمگە توشمىسا، سول تەرەپتىكى «رەت قىل» توپچىسىنى چېكىڭ. ئەگەر بۇ جۈملىنى جەزملىيەلمىسىڭىز، ئۇنى ئاتلاپ كېيىنكى جۈملىگە يۆتكەلسىڭىزمۇ بولىدۇ.
sc-criteria-item-6 = ئەگەر تەكشۈرىدىغان جۈملە تۈگەپ كەتسە، تېخىمۇ كۆپ جۈملە توپلىشىمىزغا ياردەم قىلىڭ.

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = گىرامماتىكىسى توغرا چۈملە ئىكەنلىكىنى <icon></icon> تەكشۈرىدۇ
sc-review-rules-title = بۇ جۈملە كۆرسەتمىگە ئۇيغۇنمۇ؟
sc-review-empty-state = ھازىر بۇ تىلدا تەكشۈرىدىغان جۈملىلەر يوق.
report-sc-different-language = ئوخشىمىغان تىل
report-sc-different-language-detail = ئۇ مەن تەكشۈرۈۋاتقانغا ئوخشىمايدىغان تىلدا يېزىلغان.
sentences-fetch-error = جۈملىلەرگە ئېرىشىشتە خاتالىق كۆرۈلدى
review-error = بۇ جۈملىنى تەكشۈرۈشتە خاتالىق كۆرۈلدى
review-error-rate-limit-exceeded = بەك ئالدىراقسانلىق قىلماڭ. كۆپرەك ۋاقىت ئاجرىتىپ جۈملىنىڭ توغرا ئىكەنلىكىنى جەزملەشتۈرۈڭ.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = بىز بەزى چوڭ ئۆزگەرتىشلەرنى ئېلىپ بېرىۋاتىمىز
sc-redirect-page-subtitle-1 = جۈملە يىغقۇچ Common Voice سۇپىسىغا يۆتكىلىۋاتىدۇ. سىز ھازىر بىر جۈملە <writeURL>يېزىپ</writeURL> ياكى بىر جۈملە <reviewURL>تەكشۈرۈپ</reviewURL> ئۇنى Common Voice قا يوللىيالايسىز.
sc-redirect-page-subtitle-2 = <matrixLink>Matrix</matrixLink>، <discourseLink>Discourse</discourseLink> ياكى <emailLink>ئېلخەت</emailLink> ئارقىلىق بىزدىن سوئال سوراڭ.

