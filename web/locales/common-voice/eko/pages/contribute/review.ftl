## REVIEW

sc-review-lang-not-selected = Weeyo khunathawule nne luuka. Olawe operifili waawe <profileLink>Perifili</profileLink>para othawula luuka.
sc-review-title = Orutela woona farasi
sc-review-loading = Othuula farasz...
sc-review-select-language = Muthawule luuka moote para orutela yoona farazi.
sc-review-no-sentences = Khiivo farazi para orutela woona. <addLink>Mwekezele farazi nasaapi!</addLink>
sc-review-form-prompt =
    .message = Farazi soorutela woona khazinviyariweeni, mwakhupali?
sc-review-form-usage = Nthitthe  laato tireeto yoori mwaporovari farazi. Nthitthe para eskereta yoori mukatthale . Nthitthe para ottulu yooro mwiirukhe<strong> Mwihisahawu operekha etile muruteliyeyo woona!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Nphattuwelo: { $sentenceSource }
sc-review-form-button-reject = Okathala
sc-review-form-button-skip = Wiirukha
sc-review-form-button-approve = Yaaporovari
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Weeyo pooti okholana khaazi atalyo za putawu: { sc-review-form-button-approve-shortcut } para waaporovari, { sc-review-form-button-reject-shortcut } para okathala, { sc-review-form-button-skip-shortcut } para wurukha
sc-review-form-button-submit =
    .submitText = Wiixixa oruttela woona
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Khiruteleeni wooniwa nne farazi
        [one] Yaruteliwa wooniwa farazi moote. Kaxukhuru!
       *[other] { $sentences } Yarutela wooniya farazi zooxi. Kaxukhuru!
    }
sc-review-form-review-failure = Ohipwehe epile ooruteliyeeyo woona. Omananise woora nkina,
sc-review-link = Orutela woona

## REVIEW CRITERIA

sc-criteria-modal = Tarikhi zooxapweya ovira yoori  murutele woona
sc-criteria-title = Tarikhi zooxapweya ovira yoori  murutele woona
sc-criteria-make-sure = Onaaye olipiserya yoori farazi ziiyane wiiyana tarikhi zooxapweya ovira nkhama epi ninlottaye:
sc-criteria-item-1 = Farazi enaye waatikhiwa saanene.
sc-criteria-item-2 = Farazi enaaye wiiya kramatikalmenti yoolikana saana.
sc-criteria-item-3 = Esala elupeya farazi.
sc-criteria-item-4 = Mmana farazi etana tarikhi zooxapweya ovira, nthitthe potayu  &quot; waporovari &quot; eri tireyita.
sc-criteria-item-5-2 = Farazi mmana ehitana tarikhi zooxapweya ovira nkhama epile zaatikhile otulu, nthitthe potayu &quot; Okathala &quot; latu eskereta. Mmana moona woori khamuujuwa saana, mweeyo poti wiirukha khulawa enlottanaye.
sc-criteria-item-6 = Walani, mmana ihiyeni farazi para oruttela yoona, munajutari otana farazi sikina!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Moonesesa<icon></icon> nkhama farazi yaatikhiha saanene?
sc-review-rules-title = Farazi enlottisela tarikhi?
sc-review-empty-state = Nasapi eti, luuka eti khina farazi yoori nirevisari.
report-sc-different-language = Luuka kiina
report-sc-different-language-detail = Yaatikhiwa luuka kiina yoovirikana etile kiirevisaraye.
sentences-fetch-error = Neettelaka othula farazi yavonyeya etthu.
review-error = Neettelakha orevizari farazi yavonyeya etthu.
review-error-rate-limit-exceeded = Khunstawene  waakuva. Weemele vattithiri  para orutele osoma ni woone nkhama zalikana sooxhi.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Niiretta zooxhapweya khuluyeene
sc-redirect-page-subtitle-1 = Namalokotthela farazi ontta waaza yeetta mpalataforuma wa huula yaatthu . Nasaapi etiti poti <writeURL>waatikha</writeURL> farazi moote wala <reviewURL>orutela woona</reviewURL> Operekha farazi moote ya huula yaatthu.
sc-redirect-page-subtitle-2 = Munuuzele <matrixLink>Matrix</matrixLink>, <discourseLink>Ottakhula</discourseLink>  wala ni <emailLink>email</emailLink>.
# menu item
review-sentences = Oruttela woona farazi
