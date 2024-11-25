## REVIEW

sc-review-lang-not-selected = Зи бзэ къыхэпхыгъэп. Бзэ къыхэпхыным пае  <profileLink>уипрофиль</profileLink> кӏожьба.
sc-review-title = Гущыӏэухыгъэхэм яплъыжь
sc-review-loading = Гущыӏэухыгъэхэр трегъэуцо…
sc-review-select-language = Сыолъэӏу, гущыӏэухыгъэм уеплъыжьыным пае зы бзэ къыхэх
sc-review-no-sentences = Уеплъыжьынэу гущыӏэухыгъэ щыӏэп. <addLink>Джы нахьыбэ гущыӏэухыгъэ хэгъахъу!</addLink>
sc-review-form-prompt =
    .message = Узэплъыжьыгъэ гущыӏэухыгъэхэр ыгъэхьыгъэп, уицыхьэ телъа?
sc-review-form-usage = Гущыӏэухыгъэм уезэгъыным пае джабгъумкӏэ лъыгъэкӏуат. Щыбгъэзыеным пае сэмэгумкӏэ лъыгъэкӏуат. Блэбгъэкӏыным пае ышъхьагъ дэгъэкӏуай. <strong>Узэплъыжьыгъэр бгъэхьынэу зыщымыгъэгъупш!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Гъэфедэгъэр: { $sentenceSource }
sc-review-form-button-reject = Щыгъэзый
sc-review-form-button-skip = Блэкӏ
sc-review-form-button-approve = Езэгъ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = А
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = Х
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = Г
sc-review-form-keyboard-usage-custom = Ащ фэдэу жъугъэфедэн шъулъэкӏыщт зэдиштэрэ клавишэхэу: { sc-review-form-button-approve-shortcut } Езэгъ, { sc-review-form-button-reject-shortcut } Щыгъэзый, { sc-review-form-button-skip-shortcut } Блэгъэкӏ
sc-review-form-button-submit =
    .submitText = Еплъыжьыныр ух
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Зы гущыӏэухыгъи еплъыжьыгъэп.
        [one] 1 гущыӏэухыгъэ еплъыжьыгъ. Опсэу!
       *[other] { $sentences } гущыӏэухыгъэхэм яплъыжьыгъэх. Опсэу!
    }
sc-review-form-review-failure = Еплъыжьыныр ыгъэпытэшъурэп. Сыолъэӏу, етӏанэ джыри зэ еплъ.
sc-review-link = Еплъыжьын

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Еплъыжьыным ишапхъэхэр
sc-criteria-title = Еплъыжьыным ишапхъэхэр
sc-criteria-make-sure = Гущыӏэухыгъэр къэтыгъэ шапхъэхэм атефэмэ ишъыпкъапӏэ зэгъашӏ:
sc-criteria-item-1 = Гущыӏэухыгъэр тэрэзэу тхыгъэн фае.
sc-criteria-item-2 = Гущыӏэухыгъэр грамматикэмкӏэ тэрэзэу хъун фае.
sc-criteria-item-3 = Гущыӏэухыгъэр къэпӏон плъэкӏынэу щытын фае.
sc-criteria-item-4 = Гущыӏэухыгъэр шапхъэм дештэмэ, джабгъумкӏэ чыӏоу &quot;Езэгъын&quot; теӏункӏ.
sc-criteria-item-5-2 = Гущыӏэухыгъэр шапхъэм демыштэмэ, джабгъумкӏэ чыӏоу &quot;Щыгъэзыен&quot; теӏункӏ. Гущыӏэухыгъэм уицыхьэ темылъмэ, блэбгъэкӏын плъэкӏыщт ыкӏи къыкӏэлъыкӏорэм ыуж ихь.
sc-criteria-item-6 = Узэплъыжьын фэе гущыӏэухыгъэхэр уухыгъэмэ, сыолъэӏу, нахьыбэ гущыӏэухыгъэ къэтыугъоинэу къыддэӏэпыӏ!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Шъууплъэкӏужь <icon></icon>, мы гущыӏэухыгъэр лингвистикэмкӏэ тэрэза?
sc-review-rules-title = Гущыӏэухыгъэр унашъоу пылъхэм адешта?
sc-review-empty-state = Джыдэдэм мы бзэмкӏэ уеплъыжьыным пае зи гущыӏэухыгъэ щыӏэп.
report-sc-different-language = Фэшъхьаф бзэ
report-sc-different-language-detail = Ар сызэплъыжьырэм фэшъхьаф бзэкӏэ тхыгъэ.
sentences-fetch-error = Гущыӏэухыгъэхэр тригъэуцозэ зы хэукъоныгъэ хъугъэ.
review-error = Гущыӏэухыгъэхэр еплъыжъызэ зы хэукъоныгъэ хъугъэ.
review-error-rate-limit-exceeded = Псынкӏащэу окӏо. Сыолъэӏу, охътэ тӏэкӏу къыхэгъэкӏ гущыӏэухыгъэр къыкӏэтӏотыкӏыжьынышъ зэрэтэрэзым ишъыпкъапӏэ тшӏэнэу.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Заулэ зэхъокӏыныгъэшхохэр тэшӏы.
sc-redirect-page-subtitle-1 = Гущыӏэухыгъэу Коллекторыр Камон Войс платформым икупкӏ техьажьы. Джы гущыӏэухыгъэ <writeURL>птхын</writeURL> плъэкӏыщт е Камон Войсым къыщытыгъэ гущыӏэухъыгъэ зырызхэм <reviewURL>уахэплъэщт</reviewURL>.
sc-redirect-page-subtitle-2 = <matrixLink>Матрикс</matrixLink>ымкӏэ упчӏэхэр къытэшъут,  <discourseLink>зэхэфын</discourseLink> е <emailLink>епочта</emailLink>.
# menu item
review-sentences = Гущыӏэухыгъэхэм яплъыжь
