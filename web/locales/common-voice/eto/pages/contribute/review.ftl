## REVIEW

sc-review-lang-not-selected = mina njə tɔb nkɔlɔ. Timinə <profileLink> iyəm yɔ <profileLink> o tɔb minkɔlɔ.
sc-review-title = bəbəngan bipia.
sc-review-loading = njəŋəni bipia
sc-review-select-language = tɔb nkɔlɔ asu naa o tə tal bipia
sc-review-no-sentences = təgə ipia; o nə jam <addLink> bag bipia bipəbə <addLink>
sc-review-form-prompt =
    .message = ba nji lom bipia e gbɛl tal, də mine kə osu?
sc-review-form-usage = keni evɛl məjom amu naa o jəbələ ipia. Keni evɛl məyal amu naa o bɛn ipia.Bɛd ngə o tə dimi. <strong>mini bə vuuni lom isugulu isa. <strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = mətari { $sentenceSource }
sc-review-form-button-reject = a bɛn
sc-review-form-button-skip = a lod
sc-review-form-button-approve = ajəbələ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = mini nə pə jam gbɛləni ai bitun bi zen mi ncina  { sc-review-form-button-approve-shortcut } asu naa o tə jəbələ  { sc-review-form-button-reject-shortcut }, o tə bɛn,  { sc-review-form-button-skip-shortcut } o tə lod.
sc-review-form-button-submit =
    .submitText = məmana mə ibəbə
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] tee ipia.
        [one] mbəbəni ipia ivɔg
       *[other] Ngaaŋ  "ipəbə" { $sentences }  mbəbəni bipia. Ngaaŋ
    }
sc-review-form-review-failure = mbənəni wa njə bagəlan. Timinəngan vəg ambus
sc-review-link = timinə tal

## REVIEW CRITERIA

sc-criteria-modal = ⓘ məsuləni məbəbə
sc-criteria-title = məsuləni məbəbə
sc-criteria-make-sure = bəbəngan ngə ipia i tə gbɛləni ai məsuləni məbəbə ma:
sc-criteria-item-1 = ipia i gbɛlə tiliban məŋ
sc-criteria-item-2 = ipia i gbɛlə bagəla ekɔg məmbeni
sc-criteria-item-3 = ipia i gbɛlə laŋəban məŋ
sc-criteria-item-4 = ngə ipia i tə gbɛləni ai məsuləsi, ban a "jəbələ" evɛl məjom
sc-criteria-item-5-2 = ngə ipia yaa tə gbɛləni ai məsuləsi ma, ban a "bɛn" evɛl məyal.ngə wa bod, lod.
sc-criteria-item-6 = ngə mina gbɛlə pə pipia mine tal, vɔli bya jəŋ bipəbə
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = bəbəngan <icon></icon> ngə ipia inə nloŋəni məŋ
sc-review-rules-title = ndə ipia i tə bagəla məmbeni?
sc-review-empty-state = ipia ziŋ be tal isə nkɔlɔ vi
report-sc-different-language = nkɔlɔ mpəbə
report-sc-different-language-detail = ipia isə ntiləni nkɔlɔ mə tə laŋ
sentences-fetch-error = ivus i pam idali bipia
review-error = ivus i pam ibəbə ipia yi
review-error-rate-limit-exceeded = mini tə kə mməə avol. Nɔŋəngan bɔ binutɛn mini timinə laŋ ai mini tal pə naa ipia i nə ntilinə məŋ
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = e tə soan isa.
sc-redirect-page-subtitle-1 = njəŋə bipia a mogo aya a Common voice. Mini nə jam <writeURL>til <writeURL> ngə <reviewURL> tal <reviewURL> bipias a Common Voice.
sc-redirect-page-subtitle-2 = bologan bi mibolo myaani a  <matrixLink> Matrix  <matrixLink>,<discourseLink> Discourse <discourseLink> ngə <emailLink> a e-mail <emailLink>
