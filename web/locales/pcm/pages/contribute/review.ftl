## REVIEW

sc-review-lang-not-selected = Yu neva selek eni langwej. Abeg go yur<profileLink>Profile</profileLink> mek yu selek langwej.
sc-review-title = Revyu Sentens
sc-review-loading = Di sentens-dem de lod…
sc-review-select-language = Abeg selek langwej we yu wan tek revyu sentens.
sc-review-no-sentences = No sentens to revyu  <addLink>Add mor sentens naow!</addLink>
sc-review-form-prompt =
    .message = Sentes we yu don revyu neva sobmit, yu sho?
sc-review-form-usage = Swipe rait mek yu apruv di sentens. Swipe left mek yu rijekt am. Swipe up mek yu skip am  <strong>  No forget to sobmit yur revyu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Sos: { $sentenceSource }
sc-review-form-button-reject = Rijekt
sc-review-form-button-skip = Skip
sc-review-form-button-approve = Apruv
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Yu fit still use Keyboard Shortcut:  { sc-review-form-button-approve-shortcut } to appruv, { sc-review-form-button-reject-shortcut } to rijekt, { sc-review-form-button-skip-shortcut } to skip
sc-review-form-button-submit =
    .submitText = Finish Revyu
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] No sentens we dem don revyu.
        [one] 1 sentens we dem don revyu. Tank yu!
       *[other] { $sentences } sentens we dem don revyu. Tank yu!
    }
sc-review-form-review-failure = Revyu no fit save. Abeg try agen leta.
sc-review-link = Revyu

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Revyu Kriteria
sc-criteria-title = Revyu Kriteria
sc-criteria-make-sure = Mek sho sey di sentens mit dis kriteria:
sc-criteria-item-1 = Di sentens must spell Korrekt.
sc-criteria-item-2 = Di sentens must grammatically korrekt
sc-criteria-item-3 = Di sentens must fit speak wel.
sc-criteria-item-4 = If di sentens mit di kriteria, klik &quot "Apruv"&quot button for di right.
sc-criteria-item-5-2 = If di sentens no mit di kriteria, klik &quot"Rijekt" &quot button for di left. If yu no sho abwat di sentens, yu fit skip am go di nex wan.!
sc-criteria-item-6 = If yu run out of sentens to revyu, abeg helep os kolekt mor sentens
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Chek <icon></icon>dis one na linguistically korrekt sentens?
sc-review-rules-title = Di sentens mit di guidelain?
sc-review-empty-state = No sentens to revyu for dis langwej naow.
report-sc-different-language = Difrent langwej
report-sc-different-language-detail = Difrent langwej e rait for langwej wey no be di wan wey I de revyu.
sentences-fetch-error = Error wey hapun as dem dey fetch sentens
review-error = Error wey hapun as dem dey revyu di sentens
review-error-rate-limit-exceeded = Yu dey go too fast. Abeg slow down mek yu chek di sentens wel to mek sho sey e korrekt.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Wi de mek big chenj.
sc-redirect-page-subtitle-1 = Di Sentens Kolẹktọ de move go di kor Common Voice platform. Yu fit naow <writeURL>rait</writeURL> a sentens or <reviewURL>revyu</reviewURL>
sc-redirect-page-subtitle-2 = Ask os kweshon for <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> or <emailLink>email</emailLink>
