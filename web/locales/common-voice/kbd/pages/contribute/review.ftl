## REVIEW

sc-review-lang-not-selected = Зы бзэ ауэ къыхэпхакъым. Бзэхэр къыхэпхын щхьэкӏэ уи <profileLink>профилым</profileLink> кӀуэ.
sc-review-title = Псалъэухахэм еплъыж
sc-review-loading = Псалъэухахэр къох…
sc-review-select-language = Кхъыӏэ, псалъэухахэм уеплъыжын щхьэкӏэ бзэ къыхэх.
sc-review-no-sentences = Къэпщытэн хуей псалъэуха щыӏэкъым. <addLink>Иджыпсту псалъэуха нэхъыбэ къыхэгъэхьэ!</addLink>
sc-review-form-prompt =
    .message = Узэплъыжа псалъэухахэр егъэхьа хъуакъым. Укъыхэкӏыну ухуей?
sc-review-form-usage = Псалъэухар бдэн щхьэкӏэ ижьымкӏэ гъакӏуэ. Умыдэн щхьэкӏэ сэмэгумкӏэ гъакӏуэ. Блэбгъэкӏын щхьэкӏэ ищхьэмкӏэ гъакӏуэ. <strong>Уи къэлъытэкӏэр ебгъэхьыну зыщомыгъэгъупщэ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Хэкӏыпӏэр: { $sentenceSource }
sc-review-form-button-reject = Умыдэ
sc-review-form-button-skip = Блэгъэкӏ
sc-review-form-button-approve = Къащтэ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Н
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = Хь
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = Б
sc-review-form-keyboard-usage-custom = Абы къыщынэмыщӏауэ къэвгъэсэбэп хъунущ клавишэхэу: { sc-review-form-button-approve-shortcut } къэщтэн { sc-review-form-button-reject-shortcut } мыдэн { sc-review-form-button-skip-shortcut } блэгъэкlын
sc-review-form-button-submit =
    .submitText = Еплъыжыныр ух
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] псалъэуха хэплъащ.
        [one] псалъэуха хэплъащ. ФIыщIэ пхудощI.
       *[other] псалъэуха хэплъащ. ФIыщIэ пхудощI.
    }
sc-review-form-review-failure = Хэплъа псалъэухар мыхъумэжащ. КхъыIэ, итIанэ еплъыж.
sc-review-link = Еплъыж

## REVIEW CRITERIA

sc-criteria-modal = Еплъыжыным и щапхъэхэр
sc-criteria-title = Еплъыжыным и щапхъэхэр
sc-criteria-make-sure = ФIэщ щIы псалъэухар къыкIэлъыкIуэ критерием тету зэрыщытым:
sc-criteria-item-1 = Псалъэухар тэмэму тхын хуейщ.
sc-criteria-item-2 = Псалъэухар грамматикэмкӀэ тэмэму хъун хуейщ.
sc-criteria-item-3 = Псалъэухар макъкӀэ еджэгъуафӀэу щытын хуейщ.
sc-criteria-item-4 = Псалъэухар критерием тету щытмэ, ижьрабгъум щыт кнопкэр &quot; текъузи&quot; щыхьэт техъуэ.
sc-criteria-item-5-2 = Псалъэухар критерием темыту щытмэ, сэмэгурабгъум щыт &quot;Reddet&quot; кнопкэр текъузэ. Уи фӀэщ щымыӀэмэ, ар къыпхыпщӀыкӀынкӀи хъунущ, къыкӀэлъыкӀуэ абы кӀэлъыпхъуэну.
sc-criteria-item-6 = Къызэрапщытэну псалъэухахэр къыфщӀэфхмэ, псалъэуха нэхъыбэ зэхуэхьэсын къыдэфӀэӀуэху!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Мы псалъэухар <icon></icon> бзэхабзэмкӀэ тэмэм хъуауэ къэпщытэжын?
sc-review-rules-title = Дауэ псалъэухар гъуазэ хуэхъурэ?
sc-review-empty-state = Мы бзэмкIэ хэплъыхьын псалъэуха щыӀэкъым.
report-sc-different-language = НэгъуэщӀыбзэ
report-sc-different-language-detail = Ар сэ сыхэплъыхь бзэм фӀэкӀа сфӀэмыӀуэху бзэкӀэ тхащ.
sentences-fetch-error = Псалъэухар къыщыIэрыхьэм, щыуагъэ къэхъуащ.
review-error = Мы псалъэухар  щызэхагъэкIым, щыуагъэ къэхъуащ.
review-error-rate-limit-exceeded = Псынщӏэӏуэу уокӏуэ. Кхъыӏэ, тэмэму зэрыщытыр къэпщытэн папщӏэ псалъэухахэм еплъыжыным зы напӏэзыпӏэ ет.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ЗэхъуэкIыныгъэшхуэ зыбжанэ дощӏ
sc-redirect-page-subtitle-1 = Псалъэуха зэхуэхьэсакӏуэр Common Voice и платформэ нэхъыщхьэмкӏэ мэӏэпхъуэ. Иджы Common Voice-м псалъэуха <writeURL>щыботхыф</writeURL> хьэмэрэ къырагъэхьа псалъэухахэм <reviewURL>уоплъыжыф</reviewURL>.
sc-redirect-page-subtitle-2 = <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> е <emailLink>э-пощткӏэ</emailLink> упщӏэ къыдэфт.
# menu item
review-sentences = Псалъэухахэм еплъыж
