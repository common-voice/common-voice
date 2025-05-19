## REVIEW

sc-review-lang-not-selected = Nigi mè dek vun di ,kalgui hai <profilelink>nagnu</profilelink> deki vun nonkaf
sc-review-title = Duaida ta dida
sc-review-loading = Op dida ...
sc-review-select-language = Deki vun ma nigui duaid dida
sc-review-no-sentences = Did ma duaida maidi nigi as <addLink> vul did maraha</addLink>.
sc-review-form-prompt =
    .message = Dida ma nigi duaida mè tchoydi , nigi min lum lō ?
sc-review-form-usage = Digey gulu la nang min dida .digey djufu la nang mè minim di . Digey guloho la nang mè mindi . <strong>met djok hotkida di !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Hara  ma nang sluma : { $sentenceSource }
sc-review-form-button-reject = Hinimu
sc-review-form-button-skip = Digeya
sc-review-form-button-approve = Awa da
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = A
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = M
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = D
sc-review-form-keyboard-usage-custom = Nigi asa redeng hai nede zi bama : { sc-review-form-button-approve-shortcut } vulang awa,{ sc-review-form-button-reject-shortcut } hinimu, { sc-review-form-button-skip-shortcut }digeya
sc-review-form-button-submit =
    .submitText = Ma nang uhumu vadeya
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Dida duaida maidi
        [one] Dida kêp duaida. Gigidebè !
       *[other] { $sentences } Dida duaida. Gigidebè !
    }
sc-review-form-review-failure = Duaida mè fi tapna di. Lum lō
sc-review-link = Hodom uhumu

## REVIEW CRITERIA

sc-criteria-modal = Slena ma uhumu
sc-criteria-title = Slena ma uhumu
sc-criteria-make-sure = Uhang la ka zi slen nong kaf :
sc-criteria-item-1 = Dida doy gnaha
sc-criteria-item-2 = Dida doy gnaha.
sc-criteria-item-3 = Dida lawam mèy boney di.
sc-criteria-item-4 = La dida ka gnaha "redeng" ta awa da.
sc-criteria-item-5-2 = La dida mèy gnadi redeng "minim di" gulu  la nang mey widi nang asa hinimu nang digey hai maraha.
sc-criteria-item-6 = La dida mèy gnadi redeng "minim di" gulu  la nang mey widi nang asa hinimu nang digey hai maraha !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Duaida <icon></icon> dida doy gnaha zi hatna valamu
sc-review-rules-title = Dida gnaha na nigi min nala ?
sc-review-empty-state = Wilin ken duaida ta dida zi vuna ken maidi
report-sc-different-language = Vun maraha
report-sc-different-language-detail = Dida ka’a zi vun ma nen mè wun di.
sentences-fetch-error = Law ka hai dida nem min sluma.
review-error = Law ka hai dida.
review-error-rate-limit-exceeded = Nang  ka lum koleyo .uwang la dida doy gnaha.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Numa ka mudumu.
sc-redirect-page-subtitle-1 = Vada ta tap dida mudi hai commin voice .nigi asa <writeURL>dōmu</writeURL>dida kep <reviewURL>duaida</reviewURL>dida hai Common Voice.
sc-redirect-page-subtitle-2 = Djob ma nang minima zi <matrixLink>Matrix</matrixLink>,<discourseLink>Ma duma</discourseLink> <emailLink> zi vat ta hot dida zi bama</emailLink>.
# menu item
review-sentences = Duaida dida
