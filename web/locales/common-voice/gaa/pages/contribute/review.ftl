## REVIEW

sc-review-lang-not-selected = Ohalaaa wiemɔi komɛi. Ofainɛ yaa o<profileLink>Profile</profileLink> ni ohala wiemɔi.
sc-review-title = Kwɛmɔ Wiemɔi Amli
sc-review-loading = Miiwo mli
sc-review-select-language = Ofainɛ halamɔ wiemɔ ni okɛbaakwɛ wiemɔ kukuji amli.
sc-review-no-sentences = Wiemɔi kukuji komɛi bɛ ni esa akɛ akwɛ mli. <addLink>>Kɛ wiemɔ kukuji krokomɛi afata he bianɛ!</addLink>>
sc-review-form-prompt =
    .message = Akɛ wiemɔ kukuji ni akwɛ mli lɛ emajeee, ani oyɛ nɔmimaa?
sc-review-form-usage = Swipe ninejurɔgbɛ koni okpɛlɛ wiemɔ kuku lɛ nɔ. Swipe abɛkugbɛ koni okpoo. Swipe kɛya ŋwɛi koni otsɔ nɔ. <strong>Kaaha ohiɛ miikpa nɔ akɛ okɛ osusumɔ lɛ baaha!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = He ni jɛ:{ $sentenceSource }
sc-review-form-button-reject = kpoo
sc-review-form-button-skip = skip
sc-review-form-button-approve = ŋmɛɛ gbɛ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Obaanyɛ okɛ Keyboard Shortcuts lɛ hu atsu nii:{ sc-review-form-button-approve-shortcut }kɛkpɛlɛ nɔ, { sc-review-form-button-reject-shortcut } Kpoomɔ, { sc-review-form-button-skip-shortcut } kɛha Skip
sc-review-form-button-submit =
    .submitText = Gbemɔ Kwɛmɔ lɛ Naa
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Akwɛɛɛ wiemɔ kukuji komɛi amli.
        [one] ekome akwɛ wiemɔ kuku 1 mli. Oyiwaladɔŋŋ!
       *[other] ekrokomei { $sentences } wiemɔ kukuji ni akwɛ mli. Oyiwaladɔŋŋ!
    }
sc-review-form-review-failure = Anyɛɛɛ akɛ niiaŋkwɛmɔ lɛ ato. Ofainɛ kaa ekoŋŋ sɛɛ mli.
sc-review-link = tsɔɔmɔ

## REVIEW CRITERIA

sc-criteria-modal = tsɔɔmɔ gbɛjianɔtoo
sc-criteria-title = kwɛmɔ gbɛjianɔtoo
sc-criteria-make-sure = Kwɛmɔ akɛ wiemɔ kuku lɛ kɛ shishitoo mlai ni nyiɛ sɛɛ nɛɛ kpãa gbee:
sc-criteria-item-1 = Esa akɛ aŋmala wiemɔ kuku lɛ jogbaŋŋ.
sc-criteria-item-2 = Esa akɛ wiemɔ kuku lɛ afee nɔ ni ja yɛ wiemɔ he mla naa.
sc-criteria-item-3 = Esa akɛ wiemɔ kuku lɛ afee nɔ ni awieɔ.
sc-criteria-item-4 = Kɛji wiemɔ kuku lɛ kɛ shishitoo mlai lɛ kpãa gbee lɛ, nyɛɛ &quot;Kpɛlɛmɔ nɔ&quot; button ni yɔɔ ninejurɔgbɛ lɛ.
sc-criteria-item-5-2 = Kɛji wiemɔ kuku lɛ kɛ shishitoo mlai ni yɔɔ ŋwɛi nɛɛ kpaaa gbee lɛ, nyɛɛ &quot;Kpoo &quot; button ni yɔɔ abɛkugbɛ lɛ. Kɛji oleee wiemɔ kuku lɛ, obaanyɛ otsi mli hu ni oya nɔ ni nyiɛ sɛɛ lɛ nɔ.
sc-criteria-item-6 = Kɛji wiemɔ kukuji ni obaakwɛ mli lɛ eho lɛ, ofainɛ ye obua wɔ ni wɔbua wiemɔ kukuji krokomɛi anaa!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kwɛmɔ <icon></icon> ani wiemɔ kuku ni ja nɛ?
sc-review-rules-title = Ani wiemɔ kuku lɛ kɛ gbɛtsɔɔmɔi lɛ kpãa gbee?
sc-review-empty-state = Amrɔ nɛɛ, wiemɔ kukuji komɛi bɛ ni esa akɛ akwɛ mli yɛ wiemɔ nɛɛ mli.
report-sc-different-language = Wiemɔi srɔtoi
report-sc-different-language-detail = Aŋma yɛ wiemɔ ko ni yɔɔ srɔto fe nɔ ni mikwɛɔ mli lɛ mli.
sentences-fetch-error = Tɔmɔ ko ba yɛ wiemɔ kukuji ni ajieɔ lɛ mli
review-error = Tɔmɔ ko ba yɛ wiemɔ kuku nɛɛ mlikwɛmɔ mli
review-error-rate-limit-exceeded = Oyaa oya tsɔ. Ofainɛ ŋɔɔ be fioo ni okwɛ wiemɔ kuku lɛ mli koni ona nɔmimaa akɛ eja lo.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Wɔmiifee tsakemɔi wuji komɛi
sc-redirect-page-subtitle-1 = The Sentence Collector amrɔ nɛɛ obaanyɛ core Common Voice platform. <writeURL>ŋma</writeURL>> wiemɔ kuku loo <reviewURL>>kwɛ</reviewURL>> wiemɔ kuku kome ni akɛbaatsu nii yɛ Common Voice nɔ.
sc-redirect-page-subtitle-2 = Bi wɔ saji yɛ <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> or <emailLink>email</emailLink>.
# menu item
review-sentences = Kwɛmɔ Wiemɔi Amli
