## Question Page

question-page-instruction = Добавьте вопрос <icon></icon> в { $currentLocale }, чтобы люди могли ответить
add-question-textarea-placeholder = например, «Для чего вы хотели бы использовать технологии?»
add-questions-terms-checkbox = * Я подтверждаю, что этот вопрос является <publicDomainLink>общественным достоянием</publicDomainLink> и у меня есть разрешение на его загрузку.
question-dataset-language = Набор данных: { $datasetLanguage }
add-question-success-toast-message =
    { $totalQuestions ->
        [one] { $uploadedquestions } из 1 вопроса собрано
        [few] { $uploadedquestions } из { $totalquestions } вопросов собрано
       *[many] { $uploadedquestions } из { $totalquestions } вопросов собрано
    }
add-question-error-message = Загрузка не удалась, повторите попытку.
add-question-too-many-questions-error = Превышено ограничение в 500 вопросов. Уменьшите число вопросов и повторите попытку.
partial-questions-upload-message =
    { $totalQuestions ->
        [one] { $uploadedquestions } из 1 вопроса собрано. Просмотрите наши страницы <guidelinesLink>Руководств</guidelinesLink>, чтобы узнать больше о том, как добавлять вопросы
        [few] { $uploadedquestions } из { $totalquestions } вопросов собрано. Просмотрите наши страницы <guidelinesLink>Руководств</guidelinesLink>, чтобы узнать больше о том, как добавлять вопросы
       *[many] { $uploadedquestions } из { $totalquestions } вопросов собрано. Просмотрите наши страницы <guidelinesLink>Руководств</guidelinesLink>, чтобы узнать больше о том, как добавлять вопросы
    }
# Guidelines
add-question-guidelines-title = Какие вопросы я могу добавить?
do-section-title = сделать
do-section-guideline-1 = Используйте правильную орфографию и грамматику
do-section-guideline-2 = Выберите простые вопросы, которые может легко понять любой, независимо от страны и контекста
do-section-guideline-3 = Убедитесь, что на них можно ответить всего парой предложений
do-not-section-title = не делать
do-not-section-guideline-1 = Запрашивать личную информацию (например, имена или финансовую информацию)
do-not-section-guideline-2 = Выражать или вызывать предвзятые или оскорбительные выражения
do-not-section-guideline-3 = Задавать деликатные вопросы
# Code switching Guidelines
cs-do-section-guideline-1 = Используйте билингвальные вопросы или контекст
cs-do-section-guideline-2 = Изучите неформальные сценарии, ситуации или реконструкции
cs-do-not-section-guideline-1 = Запрашивать личную информацию (например, имена или финансовую информацию) или допускать оскорбительные высказывания
