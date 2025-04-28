## REVIEW

sc-review-lang-not-selected = i ten wuri nzak mbuŋna a ɓoru ya. Kɔkrɔ ya rih <profileLink>tem woiri </profileLink> ɓay sȩn nzak mbuŋnari
sc-review-title = fakla ka̧w ɓayri
sc-review-loading = soh ka̧w ɓayri
sc-review-select-language = lu wuri nzak mbuŋna ɓay fakla feri kɔkro ya
sc-review-no-sentences = ka̧w ɓay ké mah fakla-u ta-a. I mah <addLink>dɔm ka̧w ɓay ɓáy</addLink>.
sc-review-form-prompt =
    .message = ka̧w ɓayri kenah fakla ziŋ mah ful pih-u ya?
sc-review-form-usage = loh wuri ma lakna ɓay ko suki-u. Loh wuri m kperu ɓay i vbu kpah. Loh wuri ma fál síɓa ɓay i yȩkre <strong>yȩkre wuri pih ke ko fál pihna woiri ya !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = sa̧wu: { $sentenceSource }
sc-review-form-button-reject = sah
sc-review-form-button-skip = kal
sc-review-form-button-approve = ya
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = K
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = K
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = K
sc-review-form-keyboard-usage-custom = i mah laɓ pihna ke mahful a pehya-u:{ sc-review-form-button-approve-shortcut } ya, { sc-review-form-button-reject-shortcut } sah, { sc-review-form-button-skip-shortcut } kal
sc-review-form-button-submit =
    .submitText = fe fakla ɔh ɗa
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ka̧w ɓay mbew ke nah fakla ya.
        [one] Tumbɔl ka̧w mbew fakla. da !
       *[other] ka̧w ɓayri ke fakla. Tumbɔl !
    }
sc-review-form-review-failure = fe fakla ziŋ mah ful mgba-u ya
sc-review-link = el kefe firma

## REVIEW CRITERIA

sc-criteria-modal = el kefe firma tul toh feri
sc-criteria-title = el kefe firma tul toh feri
sc-criteria-make-sure = ka̧ne ɓayri sɔk ketina toh feri
sc-criteria-item-1 = su-su ɓay ka̧w ɓayri ɓa vbeh ɓa suki
sc-criteria-item-2 = su-su ɓay tú nzak ka̧w ɓay ɓa su-su
sc-criteria-item-3 = ka̧w ɓay ɓá ki̧ ɓa suki
sc-criteria-item-4 = gelke ka̧w ɓay si ke toh feri le ik wuri tul gun fe "sɔk ɓayri" ma la kna.
sc-criteria-item-5-2 = gelke ka̧w ɓay si ke tohferi ya le, ik wuri guŋ fe "poŋ wuri" ma kperu. Gelke law woiri tehreɓay le, i mah ɓay zo mini kal tulu si ma pol.
sc-criteria-item-6 = gelke ita ke ka̧w ɓayri ɓay fakla,so wuri na ɓay -u mba
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = fakla wuri <icon></icon> ɓay ka̧w ɓay ɓá na ɓa suki ɓil nzak rim
sc-review-rules-title = ka̧w ɓay si mbew ke vbi ɓay le?
sc-review-empty-state = aŋa̧yka̧w ɓay ke mah fakla-u ta mba
report-sc-different-language = nzak mbuŋna a ɓoru
report-sc-different-language-detail = ka̧w ɓay nzak mbuŋna a ɓoru ké vbeh si mah hani ke
sentences-fetch-error = gun fe zɔklɔ ten mun
review-error = gun fe zɔklɔ ten mun ke sa̧w se ki̧ te
review-error-rate-limit-exceeded = sina woiri gah mbamba. Kɔkrɔ ya mbih wuri sa̧w seh ndi̧h ɓay lek gel ki̧ ka̧w ɓay tu bahri ke ƴo ɓa suki.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = nah sɔɓ feri mba ngi̧-u
sc-redirect-page-subtitle-1 = feh mbuh ka̧w ɓayri loh ma fal gel ziŋ hani Common voice. I mah tu mgbaŋ <writeURL>vbeh</writeURL> ka̧w ɓay mbew mini <reviewURL>fakla</reviewURL> ka̧w ɓayri lew sa Common Voice.
sc-redirect-page-subtitle-2 = vbi wuri na ɓay woiri tul <matrixLink>Matrix</matrixLink>, <discourseLink>sɔk ɓay</discourseLink> mini <emailLink>gel tu nzuk mini ziŋ nzuk</emailLink>.
# menu item
review-sentences = fakla ka̧w ɓayri
