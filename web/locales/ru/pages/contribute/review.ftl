## REVIEW

sc-review-lang-not-selected = Вы не указали ни один язык. Чтобы их выбрать, пожалуйста, перейдите в свой <profileLink>Профиль</profileLink>.
sc-review-title = Проверить предложения
sc-review-loading = Загрузка предложений...
sc-review-select-language = Пожалуйста, выберите язык предложений, которые вы будете проверять.
sc-review-no-sentences = Сейчас нет предложений, которые нужно проверить, но <addLink>вы можете добавить новые!</addlink>
sc-review-form-prompt =
    .message = Рецензированные предложения не отправлены, вы уверены?
sc-review-form-usage = Проведите вправо, чтобы принять предложение. Влево, чтобы отклонить. Вверх, чтобы пропустить. <strong>Не забывайте подтверждать свою оценку!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Источник: { $sentenceSource }
sc-review-form-button-reject = Отклонить
sc-review-form-button-skip = Пропустить
sc-review-form-button-approve = Принять
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Вы также можете использовать горячие клавиши: { sc-review-form-button-approve-shortcut } чтобы принять, { sc-review-form-button-reject-shortcut } чтобы отклонить, { sc-review-form-button-skip-shortcut } чтобы пропустить
sc-review-form-button-submit =
    .submitText = Завершить проверку
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Вы пока не проверили ни одного предложения.
        [one] Вы проверили { $sentences } предложение. Спасибо вам!
        [few] Вы проверили { $sentences } предложения. Спасибо вам!
       *[many] Вы проверили { $sentences } предложений. Спасибо вам!
    }
sc-review-form-review-failure = Не удалось сохранить рецензию. Пожалуйста, попробуйте позже.
sc-review-link = Проверить

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Критерии проверки
sc-criteria-title = Критерии проверки
sc-criteria-make-sure = Удостоверьтесь, что предложения соответствуют следующим требованиям:
sc-criteria-item-1 = Предложение должно быть орфографически верным.
sc-criteria-item-2 = Предложение должно быть грамматически верным.
sc-criteria-item-3 = Предложение должно быть таким, чтобы его можно было произнести.
sc-criteria-item-4 = Если предложение соответствует критериям, нажмите на &quot;Принять&quot;.
sc-criteria-item-5-2 = Если предложение не соответствует критериям, нажмите &quot;Отклонить&quot;. Если вы не уверены, можете воспользоваться кнопкой &quot;Пропустить&quot;, тем самым перейдя к следующему предложению.
sc-criteria-item-6 = Если у вас закончились предложения для проверки, помогите нам собрать больше предложений!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Проверьте <icon></icon>, является ли это предложение лингвистически правильным?
sc-review-rules-title = Соответствует ли предложение принципам из руководства?
sc-review-empty-state = В настоящее время нет предложений для оценки на этом языке.
report-sc-different-language = Другой язык
report-sc-different-language-detail = Это написано на языке, отличном от того, что я рецензирую.
sentences-fetch-error = Произошла ошибка при получении предложений
review-error = При оценке этого предложения произошла ошибка
review-error-rate-limit-exceeded = Вы слишком торопитесь. Просмотрите предложение внимательнее, чтобы убедиться, что оно правильно.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = У нас большие перемены
sc-redirect-page-subtitle-1 = Сборщик предложений переходит на основную платформу Common Voice. Теперь вы можете <writeURL>написать</writeURL> предложение или <reviewURL>просмотреть</reviewURL> одно предложение на Common Voice.
sc-redirect-page-subtitle-2 = Задавайте нам вопросы в <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> или по <emailLink>электронной почте</emailLink>.

