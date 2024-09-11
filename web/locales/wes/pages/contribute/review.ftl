## REVIEW

sc-review-lang-not-selected = You never choose any tok dem. We beg go for ya <profileLink>Profile</profileLink> select tok dem.
sc-review-title = Check de sentence dem
sc-review-loading = Flop de sentence dem
sc-review-select-language = We beg choose some tok for check yi sentence dem
sc-review-no-sentences = Sentence no still dey for check am. <addLink>Add oda sentence dem now!</addLink>
sc-review-form-prompt =
    .message = Sentence dem wey you don check dem never go?
sc-review-form-usage = Slide for man pikin hand for gree de sentence. Slide for woman hand for no gree am. Slide for up for jump am pass. <strong>No forget for send ya sentence dem wey you don check dem!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Place wey yi komot: { $sentenceSource }
sc-review-form-button-reject = No gree a,
sc-review-form-button-skip = Jump am pass
sc-review-form-button-approve = Gree am
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = G
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = NG
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = J
sc-review-form-keyboard-usage-custom = You fit daso use Keyboard kon short dem: { sc-review-form-button-approve-shortcut } for gree, { sc-review-form-button-reject-shortcut } for no gree, { sc-review-form-button-skip-shortcut } for jump am pass
sc-review-form-button-submit =
    .submitText = finish check am
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Sentence no dey for check am.
        [one] Dey don check 1 sentence. Thank you!
       *[other] dey don check de sentence dem. Thank you!
    }
sc-review-form-review-failure = Check
sc-review-link = ⓘ Check de law dem

## REVIEW CRITERIA

sc-criteria-modal = Check de law dem
sc-criteria-title = Make sure say de sentence di follow de law dem:
sc-criteria-make-sure = Dey must write de sentence fine fine
sc-criteria-item-1 = Grammar for de sentence must dey fine
sc-criteria-item-2 = De sentence must be for way wey dey fit tok am
sc-criteria-item-3 = If de sentence follow de law dem, press de &quot;gree&quot; button for man pikin hand.
sc-criteria-item-4 = If de sentence no follow de law dem for up, press de &quot;No gree&quot; button for woman hand. If you no sure for de sentence, you fit daso jump am pass den go for de wan wey yi di follow.
sc-criteria-item-5-2 = If you no still get sentence for check am, we beg helep we for find oda sentence dem!
sc-criteria-item-6 = Check <icon></icon> dis sentence dey fine for all tin?
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Check <icon></icon> dis sentence dey fine for all tin?
sc-review-rules-title = De sentence folloz de law dem?
sc-review-empty-state = Sentence dem no still dey for check dem for dis country tok now so.
report-sc-different-language = Different country tok
report-sc-different-language-detail = Dey write am for some different country tok wey no be yi wey I di check am.
sentences-fetch-error = Some mistake don komot time for find de sentence dem
review-error = Some mistake don komot time for check dis sentence
review-error-rate-limit-exceeded = You di over go quick quick. We beg find small time for check whether de sentence correct.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = We dey di make big big change dem
sc-redirect-page-subtitle-1 = De person for gather sentence dem di waka go for inside Common Voice dia place. Now you fit <writeURL>write</writeURL> some sentence or <reviewURL>check</reviewURL> wan wan sentence dem wey dey send am for Common Voice.
sc-redirect-page-subtitle-2 = You fit ask we question dem for <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> or <emailLink>email</emailLink>.
