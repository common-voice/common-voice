## Error pages

banner-error-slow-1 = Извините, Common Voice работает медленно. Спасибо за ваш интерес.
banner-error-slow-2 = Мы испытываем высокую нагрузку и в данный момент изучаем проблему.
banner-error-slow-link = Страница состояния
error-something-went-wrong = Ой, что-то пошло не так
error-clip-upload = Не удаётся загрузить этот клип. Повторить попытку?
error-clip-upload-server = Ни одна попытка выгрузки этого клипа на сервер не удалась. Перезагрузите страницу или повторите попытку позже.
error-clip-upload-too-large = Ваш файл записи слишком большой для выгрузки. Пожалуйста, попробуйте записать более короткий клип.
error-clip-upload-server-error = Ошибка сервера при обработке вашего клипа. Пожалуйста, обновите страницу или попробуйте ещё раз позже.
error-title-404 = Мы не смогли найти эту страницу
error-content-404 = Возможно, поможет наша <homepageLink>домашняя страница</homepageLink>? Чтобы задать вопрос, пожалуйста, присоединитесь к <matrixLink>чату сообщества в Matrix</matrixLink>, отслеживайте проблемы на сайте через <githubLink>GitHub</githubLink> или посетите <discourseLink>наши Discourse-форумы</discourseLink>.
error-title-500 = Ой, что-то пошло не так
error-content-500 = Произошла непредвиденная ошибка. Подождите некоторое время и попробуйте снова. Для получения помощи, пожалуйста, присоединитесь к <matrixLink>чату сообщества в Matrix</matrixLink>, отслеживайте проблемы на сайте через <githubLink>GitHub</githubLink> или посетите <discourseLink>наши Discourse-форумы</discourseLink>.
error-title-502 = Соединение прервано
error-content-502 = Сейчас вы не можете установить стабильное соединение с нашими серверами. Подождите некоторое время и попробуйте снова. Для получения помощи, пожалуйста, присоединитесь к <matrixLink>чату сообщества в Matrix</matrixLink>, отслеживайте проблемы на сайте через <githubLink>GitHub</githubLink> или посетите <discourseLink>наши Discourse-форумы</discourseLink>.
error-title-503 = У нас неожиданный простой
error-content-503 = Работа сайта будет возобновлена в ближайшее время. Для получения последней информации присоединяйтесь к <matrixLink>чату сообщества в Matrix</matrixLink>, посетите <githubLink>GitHub</githubLink> или <discourseLink>наши Discourse-форумы</discourseLink>, чтобы сообщать о проблемах и отслеживать их.
error-title-504 = Время ожидания запроса истекло
error-content-504 = Запрос занял слишком много времени. Обычно это временно. Повторите попытку. Для получения помощи, пожалуйста, присоединитесь к <matrixLink>чату сообщества в Matrix</matrixLink>, отслеживайте проблемы на сайте через <githubLink>GitHub</githubLink> или посетите <discourseLink>наши Discourse-форумы</discourseLink>.
error-code = Код ошибки: { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Мы не смогли загрузить ваш клип. Он уже был загружен ранее. Давайте продолжим со следующей пачкой!
        [few] Мы не смогли загрузить { $total } клипа. Они уже были загружены ранее. Давайте продолжим со следующей пачкой!
       *[many] Мы не смогли загрузить { $total } клипов. Они уже были загружены ранее. Давайте продолжим со следующей пачкой!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Мы выгрузили { $uploaded } ваших клипов — остальные уже загружены. Давайте продолжим со следующей пачкой!
