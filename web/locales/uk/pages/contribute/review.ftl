## REVIEW

sc-review-lang-not-selected =
    Ви не вибрали жодної мови. Перейдіть до свого
    <profileLink>Профілю</profileLink>, щоб обрати мови.
sc-review-title = Перевірити речення
sc-review-loading = Завантаження речень…
sc-review-select-language = Виберіть мову для перевірки речень.
sc-review-no-sentences =
    Немає речень для перевірки.
    <addLink>Додайте ще речення зараз!</addLink>
sc-review-form-prompt =
    .message = Перевірені речення не надіслано, ви впевнені?
sc-review-form-usage =
    Проведіть пальцем вправо, щоб затвердити речення. Проведіть пальцем ліворуч, щоб відхилити.
    Проведіть пальцем вгору, щоб пропустити. <strong>Не забудьте надіслати перевірку!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Джерело: { $sentenceSource }
sc-review-form-button-reject = Відхилити
sc-review-form-button-skip = Пропустити
sc-review-form-button-approve = Затвердити
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Т
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = Н
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = П
sc-review-form-keyboard-usage-custom = Ви також можете використовувати комбінації клавіш: { sc-review-form-button-approve-shortcut } для схвалення, { sc-review-form-button-reject-shortcut } для відхилення, { sc-review-form-button-skip-shortcut }, щоб пропустити
sc-review-form-button-submit =
    .submitText = Завершити перевірку
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Немає перевірених речень.
        [one] Перевірено { $sentences } речення. Спасибі!
        [few] Перевірено { $sentences } речення. Спасибі!
       *[many] Перевірено { $sentences } речень. Спасибі!
    }
sc-review-form-review-failure = Не вдалося зберегти перевірку. Повторіть спробу пізніше.
sc-review-link = Перевірити

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Критерії перевірки
sc-criteria-title = Критерії перевірки
sc-criteria-make-sure = Переконайтеся, що речення відповідає таким критеріям:
sc-criteria-item-1 = Речення має бути написано правильно.
sc-criteria-item-2 = Речення має бути граматично правильним.
sc-criteria-item-3 = Речення має бути вимовним.
sc-criteria-item-4 = Якщо речення відповідає критеріям, натисніть кнопку &quot;Затвердити&quot; праворуч.
sc-criteria-item-5-2 =
    Якщо речення не відповідає наведеним критеріям, натисніть кнопку &quot;Відхилити&quot; ліворуч.
    Якщо ви не впевнені щодо речення, ви також можете пропустити його та перейти до наступного.
sc-criteria-item-6 = Якщо у вас закінчилося речення для перегляду, допоможіть нам зібрати більше речень!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Перевірте <icon></icon>, чи це лінгвістично правильне речення?
sc-review-rules-title = Чи відповідає речення настановам?
sc-review-empty-state = Зараз немає речень цією мовою для розгляду.
report-sc-different-language = Інша мова
report-sc-different-language-detail = Написано мовою, відмінною від тої, яку я розглядаю.
sentences-fetch-error = Під час отримання речень сталася помилка
review-error = Під час розгляду цього речення сталася помилка
review-error-rate-limit-exceeded = Ви надто поспішаєте. Перегляньте речення уважніше, щоб переконатися, що воно правильне.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Ми робимо великі зміни
sc-redirect-page-subtitle-1 = Sentence Collector переходить на основну платформу Common Voice. Тепер ви можете <writeURL>написати</writeURL> речення або <reviewURL>розглянути</reviewURL> окремі пропозиції на Common Voice.
sc-redirect-page-subtitle-2 = Ставте нам запитання на <matrixLink>Matrix</matrixLink>, на <discourseLink>Discourse</discourseLink> або <emailLink>електронною поштою</emailLink>.

