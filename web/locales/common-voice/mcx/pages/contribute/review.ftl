## REVIEW

sc-review-lang-not-selected = bi aa sayɛ gan atavɔ. kɛndɔra ri ɓandi <profileLink>jinɔ yen</profileLink> kolɔ sayɛ mɛtavɔ
sc-review-title = aɓɛɛ ndi binjē mɛnkyɔla
sc-review-loading = akagɔlɔ binjē mɛnkyɔla
sc-review-select-language = sayɛga atavɔ wɔrɔ kolɔ ɓɛɛ ndi binjē mɛnkyɔla
sc-review-no-sentences = gan njē mɛnkyɔla kolɔ ɓɛɛ ndi. Bi nɛ jala <addLink>kala ndi binjē mɛnkyɔla</addLink>.
sc-review-form-prompt =
    .message = binjē mɛnkyɔla ɓɛ ɓɛɛ ndi gɔ ya kɛndi aa, bi ri kwali duyɔ ndi nɛɛ?
sc-review-form-usage = jɛndalaga kendɔ agwomɔ kolɔ mɛgɔlɔ njē mɛnkyɔla. Jɛndalaga kendɔ amyali kolɔ pili. Jɛndalaga kendɔ ako kolɔ peŋɔlɔ. <strong>Bii ja akɛndi mogaa bi benjagɔ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ɓandi jwi nu san { $sentenceSource }
sc-review-form-button-reject = apili
sc-review-form-button-skip = alena
sc-review-form-button-approve = amɛgɔlɔ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = bi nɛ jala nɔ ɓɔɓɔnɔ nkye sagɔ nkayɛ nkyɔla: { sc-review-form-button-approve-shortcut } kolɔ mɛgɔlɔ, { sc-review-form-button-reject-shortcut } kolɔ pili, { sc-review-form-button-skip-shortcut } kolɔ lena
sc-review-form-button-submit =
    .submitText = asili aɓɛɛ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] gan njē mɛnkyɔla aɓɛɛ ndi.
        [one] njē mɛnkyɔla wɔrɔ aɓɛɛ ndi. bubuli ɛhɛŋ !
       *[other] { $sentences } bi nu binjē mɛnkyɔla aɓɛɛ ndi. bubuli ɛhɛŋ !
    }
sc-review-form-review-failure = aɓɛɛ ndi ya ɓagɔlaa. ɓaalɔ wegɔga muu.
sc-review-link = asaa ndi

## REVIEW CRITERIA

sc-criteria-modal = ⓘ binkye asaa ndi
sc-criteria-title = binkye asaa ndi
sc-criteria-make-sure = saga nɛ njē mɛnkyɔla i jayɛ nɛ binkye jɛ gɔ:
sc-criteria-item-1 = njē mɛnkyɔla i ɓɛ nkyɔlaa nyuwaya
sc-criteria-item-2 = njē mɛnkyɔla i goŋini nyuwaya
sc-criteria-item-3 = njē mɛnkyɔla i jala tuwaa
sc-criteria-item-4 = ti njē mɛnkyɔla jayɛ nɛ nkye, nyamɔga ri«amɛgɔlɔ» agwomɔ.
sc-criteria-item-5-2 = ti njē mɛnkyɔla ya jayɛ nɛ nkye yi ɓako, nyamɔ ga ri «apili» amyali. Ti ɓɛ nɛ nyoli yen i jilaa, bi nɛ nkuli kevɔ nɛ lena ri jɛya.
sc-criteria-item-6 = ti bi aa ɓɛ ge nɛ njē mɛnkyɔla aɓɛɛ ndi, kamga ɓeyɔ tɔgi bwaa binjē mɛnkyɔla!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ɓɛga ndi <icon></icon> di ɓɛ nɛ njē mɛnkyɔla i nyuwaa kendɔ akyɔli atavɔ
sc-review-rules-title = njē mɛnkyɔla i duwɔ bisagɔ a sa?
sc-review-empty-state = ya ɓɛ nɛ nu njē mɛnkyɔla aɓɛɛ ndi sisiŋ to atavɔ yi
report-sc-different-language = swi atavɔ
report-sc-different-language-detail = njē mɛnkyɔla i nkyɔlaa to nu swi atavɔ nɛ mogaa mɛ ɓalɔ laŋ.
sentences-fetch-error = nu ajili yɔ jɔɔ mɔɔ atɔgi binjē mɛnkyɔla
review-error = nu ajili yɔ saha ntimɔ aɓɛɛ njē mɛnkyɔla yi
review-error-rate-limit-exceeded = bi kɛ kunaa. Nɔga mɔmɔnɔ kolɔ ɓalɔ laŋ ndi njē mɛnkyɔla nɛ aɓɛɛ jiɓɛ nɛ i nyuwaa.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = hɛ ri sa vaŋ bipenja
sc-redirect-page-subtitle-1 = mori atɔgi binjē mɛnkyɔla mɔ kɛ kendɔ njɔɔ mɛsala Common Voice. bi nɛ jala  <writeURL>nkyɔli</writeURL> njē mɛnkyɔla wɔrɔ jee <reviewURL>aɓɛ ndi</reviewURL> binjē mɛnkyɔla ɓɔya Common Voice.
sc-redirect-page-subtitle-2 = jiga ɓeyɔ binja wen <matrixLink>Matrix</matrixLink>, <discourseLink>alayɛ</discourseLink> jee <emailLink>nɛ jinɔ</emailLink>.
# menu item
review-sentences = aɓɛɛ binjē mɛnkyɔla
