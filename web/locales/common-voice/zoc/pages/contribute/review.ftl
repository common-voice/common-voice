## REVIEW

sc-review-lang-not-selected = Jamgobiwädi tumä 'ode. Tsäkä wäbä, mawä te' <profileLink>wi'nanhmba'tkumyä<profileLink> wa'a mgobiku tumä-metsa 'ode.<profileLink>
sc-review-title = Tu'nä te' jayeda'm
sc-review-loading = Nä kyi'mä te' jaye...
sc-review-select-language = Kobiwä tumä 'ode wa'a mgosjayu te' jyaye.
sc-review-no-sentences = Ja'idä'am jaye mgo'spabä. ¡<addLink>Kojta'nhä jaye<addLink>!
sc-review-form-prompt =
    .message = Jakyä'wejyadi te' tyu'nyajubä'a (jaye), ¿Wiyunhsede te'?
sc-review-form-usage = Jäkä kädä mdsä'nanh'omobä mgä' 'uka te'sede te' jaye. Jäkä kädä 'maknya'omobä mgä' 'uka ji'nde tye'se. Jäkä ki'mä mgä' wa'a mgo'nhgädu. <strong>¡'U mjambä'u wa'a mgä'weju te' mdu'nubä'a!<strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Käme'tskumyä: { $sentenceSource }
sc-review-form-button-reject = JI't mbäjkisytsyowe
sc-review-form-button-skip = Ko'nhgätku't (Ko'nhgädä)
sc-review-form-button-approve = Pojkisytsyonhgu'y
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = T
sc-review-form-keyboard-usage-custom = Mujspadi yajkyoskeda te' jatyäjkis tumä jyi'bi wa'a mawe tsäjku: { sc-review-form-button-approve-shortcut } wa'a mbäjkisytsyoku, { sc-review-form-button-reject-shortcut } wa'a jana mbäjkisytsyok, yajkti { sc-review-form-button-skip-shortcut } wa'a mgo'nhgädu.
sc-review-form-button-submit =
    .submitText = Tu'nä wa'a kyo'yaju'a
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Jatyu'nya nitumä'k jaye.
        [one] Tumä jaye tyu'nyaju. ¡Yäskodoya!
       *[other] { $sentences } Tyu'nyajubä jaye. ¡Yäskodoya!
    }
sc-review-form-review-failure = Jamusä kyojtanhne'kya te' tu'nubä'a jaye. Tsäjkiswätsäkä 'usyanh'orakäsi.
sc-review-link = Tu'nisä

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Juts wa'a ndu'nisu
sc-criteria-title = Juts wa'a ndu'nisu
sc-criteria-make-sure = 'Ijtuse te' jaye, yä'sede wäbä wa'a jyayaju:
sc-criteria-item-1 = Te' jaye sunyide wa'a jyayaju.
sc-criteria-item-2 = Te' jaye sunyide'e wa'a näjktyäyu.
sc-criteria-item-3 = Te' jaye wa'ade mujsu ndsamä.
sc-criteria-item-4 = 'Uka te' jaye sa'sya jyatyäju, pena te'  &quot;mbäjkisytsyokpamä&quot;  te' 'maknya'omo.
sc-criteria-item-5-2 = 'Uka te' jaye jamusä tsyäjkya, pena te' &quot;ji'nde mbäjkisytsyowemä&quot; te' mdsä'nanh'omo. 'Uka ji' mujsi sunyi, mujspa mgo'nhgädä yajkti mujspa nhgyädä 'emä.
sc-criteria-item-6 = 'Uka ja'idä'am 'eyabä jaye wa'a mdu'nisu, ¡kotsokya'tsi wa'a ndsäjka'nhäyu te' jaye!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Ji'bä <icon></icon> ¿Wäbajayä yä' jaye, mujspa'ksyä yajk'ona?
sc-review-rules-title = ¿Yospa'ksyä tikoda tsyäjkyaju te' jaye?
sc-review-empty-state = Yäti,  yä' ode'omo ja'idä jaye wa'a ndu'nisu.
report-sc-different-language = 'Eyabä 'ode
report-sc-different-language-detail = Eyabä 'ode'omode jayubä, jinde'e nä't ndu'nusebä 'ode.
sentences-fetch-error = Tujku ji' wyäbä tiyä nä't me'tsu'k te' jaye.
review-error = Tujku ji' wyäbä tiyä nä'käjt ndu'nisu'k te' jaye.
review-error-rate-limit-exceeded = Nimeke nä nyikujä'näju. Sujkä 'usya'nhomo wa'a mujsu mdu'nisä te' jaye, ko'sa sa'sya'k 'uka te'de'e nä sutnubä mjayä.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Nä't ndsäjkyaju mäjabäda'mbä käkajku'y.
sc-redirect-page-subtitle-1 = Te' kyobikpabä'is te' jaye, nä myaku te' kommon Vo'yis wyina'nhmba'tkumyä . Yäti muspa <writeURL>mjayä<writeURL><reviewURL> tumä jaye, <reviewURL>muspa mdu'nisä<reviewURL> te' jaye kyä'wejyajpabä tumä pätkodadi te' kommon voice'omo.
sc-redirect-page-subtitle-2 = Käme'tsotya'mide te' <matrixLink>Matrix'omo<matrixLink>, <discourseLink>Discurse'omo<discourseLink> yajkti <emailLink>email'omo<emailLink>.
# menu item
review-sentences = Tu'nisyä te' jayeda'm
