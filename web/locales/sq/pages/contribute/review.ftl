## REVIEW

sc-review-lang-not-selected = S’keni përzgjedhur ndonjë gjuhë. Ju lutemi, kaloni te <profileLink>Profili</profileLink> juaj, që të përzgjidhni gjuhë.
sc-review-title = Shqyrtoni Togfjalësha
sc-review-loading = Po ngarkohen togfjalësha…
sc-review-select-language = Ju lutemi, përzgjidhni një gjuhë që të shqyrtoni togfjalësha.
sc-review-no-sentences = S’ka togfjalësha për shqyrtim. <addLink>Shtoni më tepër togfjalësha tani!</addLink>
sc-review-form-prompt =
    .message = Togfjalësha të shqyrtuar jo të parashtruar, jeni i sigurt?
sc-review-form-usage = Fërkojeni për djathtas që ta miratoni togfjalëshin. Fërkojeni për majtas që ta hidhni poshtë. Fërkojeni për sipër që ta anashkaloni. <strong>Mos harroni të parashtroni shqyrtimin tuaj!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Burim: { $sentenceSource }
sc-review-form-button-reject = Hidhe poshtë
sc-review-form-button-skip = Anashkaloje
sc-review-form-button-approve = Miratoje
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = P
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = J
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = K
sc-review-form-keyboard-usage-custom = Mund të përdorni edhe Shkurtore Tastiere: { sc-review-form-button-approve-shortcut } për Miratim, { sc-review-form-button-reject-shortcut } për Hedhje poshtë, { sc-review-form-button-skip-shortcut } për Anashkalim
sc-review-form-button-submit =
    .submitText = Përfundojeni Shqyrtimin
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Pa togfjalësha të shqyrtuar.
        [one] 1 togfjalësh i shqyrtuar. Faleminderit!
       *[other] { $sentences } togfjalësha të shqyrtuar. Faleminderit!
    }
sc-review-form-review-failure = Shqyrtimi s’u ruajt dot. Ju lutemi, riprovoni më vonë.
sc-review-link = Shqyrtojeni

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kritere Shqyrtimi
sc-criteria-title = Kritere Shqyrtimi
sc-criteria-make-sure = Sigurohuni se togfjalëshi plotëson kushtet vijuese:
sc-criteria-item-1 = Togfjalëshi duhet shkruar si duhet.
sc-criteria-item-2 = Togfjalëshi duhet të jetë i saktë gramatikisht.
sc-criteria-item-3 = Togfjalëshi duhet të jetë i shqiptueshëm.
sc-criteria-item-4 = Nëse togfjalëshi plotëson kushtet, klikoni butonin “Miratojeni” në të djathtë.
sc-criteria-item-5-2 = Nëse togfjalëshi nuk pajtohet me kriteret më sipër, klikoni mbi butonin “Hidhe poshtë” në të djathtë. Nëse jeni i pasigurt për togfjalëshin, mundeni edhe ta anashkaloni dhe të vazhdoni me pasuesin.
sc-criteria-item-6 = Nëse mbarohen togfjalëshat për shqyrtim, ju lutemi, ndihmonani të grumbullojmë më tepër togfjalësha!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Kontrolloni <icon></icon> a është togfjalësh i saktë nga ana gjuhësore?
sc-review-rules-title = A është në pajtim me udhëzimet fraza?
sc-review-empty-state = Aktualisht s’ka fraza për shqyrtim në këtë gjuhë.
report-sc-different-language = Gjuhë tjetër
report-sc-different-language-detail = Është e shkruar në tjetër gjuhë nga ajo për të cilën po shqyrtoj.
sentences-fetch-error = Ndodhi një gabim teksa silleshin frazat
review-error = Ndodhi një gabim teksa shqyrtohej ky togfjalësh
review-error-rate-limit-exceeded = Po ecni shumë shpejt. Ju lutemi, ndaluni një çast të shqyrtoni togfjalëshin, për t’u siguruar se është i saktë.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Po bëjmë disa ndryshime të mëdha
sc-redirect-page-subtitle-1 = Grumbulluesi i Togfjalëshave po kalon te platforma bazë e Common Voice-it. Tani mund të <writeURL>shkruani</writeURL> në togfjalësh, ose të <reviewURL>shqyrtoni</reviewURL> parashtrime togfjalëshash njësh te Common Voice.
sc-redirect-page-subtitle-2 = Na bëni një pyetje në <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ose me <emailLink>email</emailLink>.

