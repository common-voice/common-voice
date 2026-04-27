## REVIEW

sc-review-lang-not-selected = Сірер пiр дее тiл кӧзіт пирбезер. Оларны таллап алар ӱчӱн, постарыңның <profileLink> Профильзер </profileLink> иртіңер.
sc-review-title = Чоохтағларны сыныхтабызарға
sc-review-loading = Чоохтағларны кирері...
sc-review-select-language = Сірер сыныхтир чоохтағларның тілін таллап алыңардах.
sc-review-no-sentences = Амды сыныхтирға киректелчеткен чӧптер чоғыл, че <addLink> сiрер нааларны хос поларзар!</addlink>
sc-review-form-prompt =
    .message = Сыныхтал парған чоохтағлар ызылбааннар, сірер пілінчезер?
sc-review-form-usage = Чоохтағны алар ӱчӱн, оң саринзар иртіріңер. Сол саринзар, хыйа идер ӱчӱн. Ӱстӱнзер, иртір салар ӱчӱн. <strong> Постарыңның паалағларыңны киречілирге ундубаңар! </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Источник: { $sentenceSource }
sc-review-form-button-reject = Хыйа идібізеррге
sc-review-form-button-skip = Иртiрiбiзерге
sc-review-form-button-approve = Аларға
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Сірерге ізіг клавишаларнаң тузаланарға чарир: { sc-review-form-button-approve-shortcut }-ны алып аларға тiп, { sc-review-form-button-reject-shortcut }-ны хыйа идiбiзерге тiп, { sc-review-form-button-skip-shortcut }-ны иртірiбiзерге тiп.
sc-review-form-button-submit =
    .submitText = Cыныхтағ тоозыбызарға
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Сірер сағам пір даа чоохтағны сыныхтабазар.
        [one] Сірер 1 чоохтағ сыныхтабысхазар. Алғыс сірерге.
       *[other] Сірер { $sentences } чоохтағ сыныхтабысхазар. Алғыс сірерге.
    }
sc-review-form-review-failure = Рецензияны хайраллап халарға киліспеен. Сурынчабыс, соонаң сынап кӧріңер.
sc-review-link = Сыныхтабызарға

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Сыныхтачаң критерийлар
sc-criteria-title = Сыныхтачаң критерийлар
sc-criteria-make-sure = Чоохтағларның пазағы кирексіністерге килісчеткенін сыныхтабызыңар:
sc-criteria-item-1 = Чоохтағ орфография саринаң орта поларға кирек.
sc-criteria-item-2 = Чоохтағ грамматика саринаң орта поларға кирек.
sc-criteria-item-3 = Чоохтағ аны адап полар пӱдістіг поларға кирек.
sc-criteria-item-4 = Чӧптер кирексіністерге килісчетсе, «Аларға» пазыбызыңар.
sc-criteria-item-5-2 = Чоохтағ критерийлерге киліспинчетсе, «Хыйа идiбiзерге» пазыбызыңар. Ікінҷiлепчетсер, «Иртiрiбiзерге» кнопканаң тузаланарға чарир, аның сылтаанда пазағы чоохтағзар иртіп.
sc-criteria-item-6 = Сірернің сыныхтаҷаң чоохтағлар тоозыл парған полза, піске кӧп арах чоохтағлар чыырға полыс пиріңер!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Сыныхтабызыңар <icon></icon>, пу чоохтағ тіл саринаң орта полча ба?
sc-review-rules-title = Чоохтағ устағ-пастағдағы тӧстеглерге килісче бе?
sc-review-empty-state = Амғы туста пу тілде паалаға чӧптер чоғыл.
report-sc-different-language = Пасха тіл
report-sc-different-language-detail = Ол мин сыныхтапчатхан тілдең пасха тілнең пазыл парған.
sentences-fetch-error = Чоохтағларны аларында алҷаас пол парған.
review-error = Пу чоохтағны паалирында алҷаас пол парған.
review-error-rate-limit-exceeded = Сірер иртіре маңзырапчазар. Чоохтағның орта полчатханын піліп алар ӱчӱн, аны ситкіп кӧріңер.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Пістің улуғ алызығлар
sc-redirect-page-subtitle-1 = Чоохтағларны чыыпчатханы Common Voice платформазар кӧсче. Амды  чоохтағ <writeURL> пас </writeURL> поларзар алай чоохтағны Common Voice-те <reviewURL> кӧр </reviewURL> поларзар.
sc-redirect-page-subtitle-2 = Піске <matrixLink> Matrix </matrixLink>, <discourseLink>Discourse</discourseLink> алай <emailLink> электроннай почтаҷа </emailLink> сурығлар пиріңер.
# menu item
review-sentences = Чоохтағларны сыныхтабызарға
