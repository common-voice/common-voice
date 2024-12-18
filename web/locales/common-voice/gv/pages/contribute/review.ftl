## REVIEW

sc-review-lang-not-selected = Cha nel oo er reih çhengaghyn erbee. Gow dys <profileLink>dty Ghuillag</profileLink> dy reih çhengaghyn.
sc-review-title = Scrutee Raaghyn
sc-review-loading = Laadey raaghyn…
sc-review-select-language = Reih çhengey dy scrutaghey raaghyn.
sc-review-no-sentences = Cha nel raaghyn erbee ayn dy scrutaghey. <addLink>Faag tooilley raaghyn nish!</addLink>
sc-review-form-prompt =
    .message = Cha nel ny raaghyn scrutit er nyn gur stiagh, vel oo shickyr?
sc-review-form-usage = Tayrn my yesh dy choontey mie jeh raa. Tayrn my hoshtal dy yiooldey eh. Tayrn heose dy gholl shaghey. <strong>Ny jean jarrood dy chur dty scrutaght stiagh!</strong>
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Foddee oo jannoo ymmyd jeh Aagherridyn Mairchlaare: { sc-review-form-button-approve-shortcut } dy choardail, { sc-review-form-button-reject-shortcut } dy yiooldey, { sc-review-form-button-skip-shortcut } dy gholl shaghey
sc-review-form-button-submit =
    .submitText = Cur jerrey er scrutaghey
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Cha nel raa er ny scrutaghey.
        [one] 1 raa scrutit. Gura mie ayd!
        [two] 2 raa scrutit. Gura mie ayd!
        [few] { $sentences } raaghyn scrutit. Gura mie ayd!
        [many] { $sentences } raaghyn scrutit. Gura mie ayd!
       *[other] { $sentences } raaghyn scrutit. Gura mie ayd!
    }
sc-review-form-review-failure = Cha dod y scrutaght goll er sauail. Prow reesht ny s'anmey.
sc-review-link = Scrutee

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Reillyn Scrutee
sc-criteria-title = Reillyn Scrutee
sc-criteria-make-sure = Jean shickyr dy vel y raa cordeil rish ny reillyn shoh:
sc-criteria-item-1 = Shegin da'n raa goll er lettraghey dy kiart.
sc-criteria-item-2 = Shegin da grammeydys y raa ve kiart.
sc-criteria-item-3 = Shegin da ve jantagh fockley magh y raa.
sc-criteria-item-4 = My vees y raa cordeil rish ny reillyn, broo er y chramman &quot;Coard rish&quot; er y çheu yesh.
sc-criteria-item-5-2 = Mannagh vees y raa cordeil rish ny reillyn harrish, broo er y chramman &quot;Jiooldee&quot; er y çheu hoshtal. Mannagh bee oo shickyr mychione raa, foddee oo goll shaghey neeshtagh as goll er dys y nah 'er.
sc-criteria-item-6 = My jean oo roie magh ass raaghyn dy scrutaghey, cooin lhien, my sailt, lesh çhaglym tooilley raaghyn!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Jean shickyr <icon></icon> vel çhengey y raa shoh kiart?
sc-review-rules-title = Vel y raa shoh cordeil rish ny reillyn?
sc-review-empty-state = Cha nel raaghyn erbee ayn dy scrutaghey ayns y çhengey shoh ec y traa t'ayn.
report-sc-different-language = Çhengey elley
report-sc-different-language-detail = T'eh scruit ayns çhengey nagh nee yn fer ta mee scrutaghey.
sentences-fetch-error = Va boirey ayn geddyn raaghyn
review-error = Va boirey ayn scrutaghey y raa shoh
review-error-rate-limit-exceeded = T'ou goll ro tappee. Gow tullagh dy scrutaghey y raa dy yannoo shickyr dy vel eh kiart.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Ta shin caghlaa ram
sc-redirect-page-subtitle-1 = Ta'n Çhaghleyder Raaghyn gleashagh dys ardan cadjin Chommon Voice. Nish foddee oo <writeURL>screeu</writeURL> raa ny <reviewURL>scrutaghey</reviewURL> raaghyn er Common Voice.
sc-redirect-page-subtitle-2 = Brie feyshtyn jin er <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ny <emailLink>post-l</emailLink>.
# menu item
review-sentences = Scrutee Raaghyn
