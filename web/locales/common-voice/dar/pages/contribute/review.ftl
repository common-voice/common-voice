## REVIEW

sc-review-lang-not-selected = ХӀушани цадехӀалра мез декӀардарили ахӀенра. Илди декӀардарес багьандан хӀушала <profileLink>бяхӀчибизлизи (профиллизи)</profileLink> кадухъеная.
sc-review-title = Предложениеби ахтардидарес
sc-review-loading = Предложениеби загрузитдарес...
sc-review-select-language = Башуста, хӀушани ахтардидирути предложениебала мез декӀардарая.
sc-review-no-sentences = Гьанна ахтардидарес гӀягӀнити предложениеби агара, амма <addLink>хӀушани сагати имцӀадарес дирудая!</addlink>
sc-review-form-prompt =
    .message = Рецензияладарибти предложениеби дархьили ахӀен, хӀуша дирхулраяв?
sc-review-form-usage = Предложениеби кьабулдарес балуй шайчи бетаая. Алгъай шайчи, кьабулхӀедарес багьандан. Чеди, урдатес багьандан. <strong>Хъуммартидая хӀушала кьимат тасдикьбирес!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Хьулчи: { $sentenceSource }
sc-review-form-button-reject = КьабулхӀебарес
sc-review-form-button-skip = Уббатес
sc-review-form-button-approve = Кьабулбарес
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = ХӀушани илкьяйдали хъапӀнира (клавишабира) пайдаладарес дирудая: { sc-review-form-button-approve-shortcut } кьабулбарес багьандан, { sc-review-form-button-reject-shortcut } кьабулхӀебарес багьандан, { sc-review-form-button-skip-shortcut } уббатес багьандан.
sc-review-form-button-submit =
    .submitText = Ахтардибирни таманбарес
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ХӀуни гьачамлис цалра предложение ахтардибарили ахӀенри.
        [one] ХӀуни 1 предложение ахтардибарилри. Баркалла хӀед!
       *[other] ХӀуни { $sentences } предложение ахтардидарилри. Баркалла хӀед!
    }
sc-review-form-review-failure = Рецензия бихӀес имканхӀебакӀиб. Башуста, гӀурхӀели халбарая.
sc-review-link = Ахтардибарес

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Ахтардила умцлаби
sc-criteria-title = Ахтардила умцлаби
sc-criteria-make-sure = ГӀергъити тӀалабуначи предложение балбикили биъни ахтардибарая:
sc-criteria-item-1 = Предложение орфографиялашал бархьсили биэс гӀягӀниси саби.
sc-criteria-item-2 = Предложение грамматикалашал бархьсили биэс гӀягӀниси саби.
sc-criteria-item-3 = Предложение бурес виэссили биэс гӀягӀниси саби.
sc-criteria-item-4 = Эгер предложение умцлабачи балбикили биалли, &quot;Кьабулбарес&quot;-личи гъяжбарая.
sc-criteria-item-5-2 =
    Эгер предложение умцлабачи балхӀебикили биалли, &quot;КьабулхӀебарес&quot;-личи гъяжбарая.
    Эгер хӀуша дирхули диаадалли, гӀергъиси предложениеличи детухъи, &quot;Уббатес&quot; ибси хъапӀа пайдалабарес дирудая.
sc-criteria-item-6 = Эгер хӀушала ахтардидирути предложениеби кадерхурли диалли, дахъал предложениеби цаладяхъес нушаб кумекбарая!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Ахтардибарая <icon></icon>, ил предложение лингвистикалашал бархьсили сабил?
sc-review-rules-title = Балбикилил предложение гьуни чедиахънила бетуцуначи?
sc-review-empty-state = Гьанна бусягӀят илди мезличир кьиматладарес предложениеби агара.
report-sc-different-language = ЦархӀилти мез
report-sc-different-language-detail = Илди нуни рецензияладирути мезлизирад декӀарти мезли белкӀи саби.
sentences-fetch-error = Предложениеби кайсухӀели хатӀа бетаурли саби
review-error = Ил предложение кьиматлабирухӀели хатӀа бетаурли саби
review-error-rate-limit-exceeded = ХӀуша хӀекьли къалабадикӀулра. Предложение чебетаахъили хӀербарая, ил бархьли биъниличи дирхес багьандан.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Нушала халати дарсдешуни лер
sc-redirect-page-subtitle-1 = Предложениеби цаладирхъян Common Voice-ла хьулчилибиубси платформаличи аркьули саби. Гьанна хӀушани дирудая <writeURL>белкӀес</writeURL> предложение яра <reviewURL>хӀербарес</reviewURL> Common Voice-личиб ца предложение.
sc-redirect-page-subtitle-2 = <matrixLink>Matrix</matrixLink>-лизир, <discourseLink>Discourse</discourseLink> яра <emailLink>электронна почта хӀясибли </emailLink> нушази суалти хьардаая.
# menu item
review-sentences = Предложениеби ахтардидарес
