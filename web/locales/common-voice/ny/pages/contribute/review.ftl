## REVIEW

sc-review-lang-not-selected = Simunasankhe zilankhulo zilizonse. Chonde pitani ku <profileLink>Profile</profileLink> yanu kuti musankhe zilankhulo.
sc-review-title = unikilalani (onesesani) chiganizo
sc-review-loading = kukonzekeresa ziganizo
sc-review-select-language = Chonde sankhani chilankhulo kuti muwunikile ziganizo
sc-review-no-sentences = palibe ziganizo zoti muunikire<addLink> ikani ziganizo zina<addLink>
sc-review-form-prompt =
    .message = ziganizo mwawunikila sizinaperekedwe, mukusimikiza?
sc-review-form-usage = Yendetsani kumanja kuti muvomereze chiganizocho. Yendetsani kumanzere kuti mukane. Yendetsani mmwamba kuti mudumphe. <strong>Musaiwale kutumiza ndemanga yanu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Kochokera : { $sentenceSource }
sc-review-form-button-reject = Kanani
sc-review-form-button-skip = Dumpha
sc-review-form-button-approve = Vomela
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Mungagwiritsenso ntchito njira zazifupi za kiyibodi: { sc-review-form-button-approve-shortcut } kuti muvomereze, { sc-review-form-button-reject-shortcut } kuti mukane, { sc-review-form-button-skip-shortcut } kuti musinthe
sc-review-form-button-submit =
    .submitText = malizitsan kuwunikila
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] { "" }
        [one] ziganizo za { $sentences } zawunikilidwa
       *[other] { "" }
    }
sc-review-form-review-failure = zowunikila zanu sizinasungidwe. Chonde yesaniso nthawi ina
sc-review-link = Unikila

## REVIEW CRITERIA

sc-criteria-modal = kuwonesesa ndondomeko
sc-criteria-title = kuwonesesa ndondomeko
sc-criteria-make-sure = onesetsani kuti chiganizo chikhale ndi zoziyenereza izi
sc-criteria-item-1 = chiganizo chiyenera kuwerengadwa molondola
sc-criteria-item-2 = chiganizo chiyenera kukhala cholondola
sc-criteria-item-3 = Chiganizo chiyenela kukhala cholankhulika
sc-criteria-item-4 = Ngati chiganizocho chikukwaniritsa zofunikira, dinani batani la "Bvomerezani" kumanja.
sc-criteria-item-5-2 = Ngati chiganizocho sichikukwaniritsa zofunikira zomwe zili pamwambapa, dinani batani la "Kanani" kumanzere. Ngati simukudziwa bwino za chiganizocho, mutha kuchidumphanso ndikupita ku china.
sc-criteria-item-6 = Ngat ziganizo zofunika kuwunika zatha, chonde tithandizeni kupeza ziganizo zina
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = onani ngati chiganizochi chili cholondola<icon></icon>
sc-review-rules-title = kodi chiganizochi chikugwilizana ndi ndondomeko yake?
sc-review-empty-state = Pakadali pano palibe ziganizo zoti ziwunikidwenso m'chinenerochi.
report-sc-different-language = Chilankhulo chosiyana
report-sc-different-language-detail = Yalembedwa m'chinenero chosiyana ndi chimene ndimalankhula.
sentences-fetch-error = panali zolakwika potenga ziganizo
review-error = pachitika cholakwika powunikila ziganizo
review-error-rate-limit-exceeded = mukuchita mofulumila kwambiri. chonde tengani kamphindi kuti muwunikileso chiganizocho kut muwonesese kuti ndi cholondola
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Tikupanga kusintha kwakukulu
sc-redirect-page-subtitle-1 = Wosonkhanitsa Ziganizo akusamukira ku nsanja yayikulu ya Common Voice. Tsopano mutha <writeURL>kulemba</writeURL> chiganizo kapena <reviewURL>kuwunikira</reviewURL> kutumiza chiganizo chimodzi pa Common Voice.
sc-redirect-page-subtitle-2 = Tifunseni mafunso pa <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> kapena <emailLink>imelo</emailLink>.
# menu item
review-sentences = unikilalani (onesesani) chiganizo
