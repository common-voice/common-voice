## REVIEW

sc-review-lang-not-selected = Manam ima simitapas akllarqankichu. Ama hina kaspa, <profileLink>Perfil</profileLink> nisqaman riy simikunata akllanaykipaq.
sc-review-title = Rimaykunata qawariy
sc-review-loading = Simikunata apamuspa...
sc-review-select-language = Ama hina kaspa, huk simita akllay rimaykunata qhawarinaykipaq.
sc-review-no-sentences = Mana rimaykuna kanchu qhawarinapaq. <addLink>Kunanqa aswan rimaykunata yapay!</addLink>
sc-review-form-prompt =
    .message = Kutin rikusqa rimaykuna mana apachisqachu, chiqachu kanki?
sc-review-form-usage = Pañaman llalliy chay rimayta chiqakanaykipaq. Lloq’iman llalliy mana chaskinaykipaq. Chayta saqinaykipaqqa wichayman llalliy. <strong>Ama qunqaychu yuyayniyki apachiyta!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Pukyu: { $sentenceSource }
sc-review-form-button-reject = Karunchay
sc-review-form-button-skip = Saqiy
sc-review-form-button-approve = Ariniy
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = A
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = M
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Llaqta ñankunatapas llamk'achiy atikunki: { sc-review-form-button-approve-shortcut } Arinipaq, { sc-review-form-button-reject-shortcut }  Karunchapaq, { sc-review-form-button-skip-shortcut } Saqipaq
sc-review-form-button-submit =
    .submitText = Qhawaspaq tukuna
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] mana rimaykuna qhawarisqa.
        [one] 1 rimayta qhawarisqa. Riqsikuyki!
       *[other] { $sentences } rimaytakuna qhawarisqa. Riqsikuyki!
    }
sc-review-form-review-failure = Qhawarisqa nisqataqa manam waqaychayta atirqakuchu. Ama hina kaspa, qhipaman hukmanta kallpachakuy.

## REVIEW CRITERIA

# menu item
review-sentences = Rimaykunata qawariy
