## General

yes-receive-emails = Да, отправляйте мне письма. Я хочу быть в курсе новостей проекта Common Voice.
stayintouch = Мы в Mozilla создаём сообщество по языковым технологиям. Мы хотим, чтобы вы были в курсе всех новостей, новых источников данных, а также хотели бы знать больше о том, как вы используете такого рода данные.
privacy-info = Мы обещаем, что будет обрабатывать вашу информацию с осторожностью. Подробнее в нашей <privacyLink>политике приватности</privacyLink>.
return-to-cv = Вернуться к Common Voice
email-input =
    .label = Эл. почта
submit-form-action = Отправить

## Layout

speak = Запись
datasets = Наборы данных
profile = Профиль
help = Справка
contact = Контакты
privacy = Приватность
terms = Условия
cookies = Куки
faq = ЧЗВ
content-license-text = Содержимое доступно под <licenseLink>лицензией Creative Commons</licenseLink>
share-title = Помогите нам, найдя других желающих записать свой голос!

## Home Page

home-title = Common Voice — проект Mozilla, направленный на то, чтобы научить машины разговаривать, как люди.
home-cta = Помогите нам, сделав запись своего голоса!
wall-of-text-start = Голос - естественен, голос - человечен. Вот почему мы стремимся создать удобную языковую технологию для наших машин. Но чтобы создавать голосовые системы, требуется очень большой объём языковых данных.
wall-of-text-more-mobile = Большинство данных, используемое корпорациями, недоступно для большинства людей. Мы думаем, что это подавляет развитие инноваций. Поэтому мы запустили проект Common Voice, призванный помочь стать распознаванию голоса открытым и доступным для всех и каждого.
wall-of-text-more-desktop = Теперь вы можете отправить нам свой голос, чтобы помочь создать открытую языковую базу данных, которую сможет использовать любой разработчик для создания своих инновационных приложений и сайтов.<lineBreak></lineBreak> Произносите фразы, чтобы помочь машинам понять, как говорят реальные люди. Проверяйте работу других волонтёров, чтобы улучшить качество. Это просто!
show-wall-of-text = Подробнее
help-us-title = Помогите нам, проверяя записанное!
help-us-explain = Включите запись, послушайте и расскажите нам: хорошо ли озвучена фраза, расположенная ниже?
request-language-text = Пока не видите ваш язык в Common Voice?
request-language-button = Запросить язык

## ProjectStatus

status-title = Общий статус проекта: посмотрите, как далеко мы ушли!
status-contribute = Запишите свой голос
loading = Загрузка…
status-hours =
    { $hours ->
        [one] Пока проверен { $hours } час!
        [few] Пока проверено { $hours } часа!
       *[other] Пока проверено { $hours } часов!
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = Следующая цель: { $goal }
status-more-soon = Скоро добавим ещё больше языков!

## ProfileForm

profile-form-username =
    .label = Имя пользователя
profile-form-language =
    .label = Язык
profile-form-more-languages = Скоро добавим ещё больше языков!
profile-form-accent =
    .label = Акцент
profile-form-age =
    .label = Возраст
profile-form-gender =
    .label = Пол

## FAQ

faq-title = Часто задаваемые вопросы
faq-what-q = Что такое Common Voice?
faq-important-q = Почему это важно?
faq-get-q = Как я могу загрузить данные Common Voice?
faq-mission-q = Почему Common Voice является частью миссии Mozilla?

## Profile

profile-why-title = Зачем нужен профиль?

## NotFound

notfound-title = Страница не найдена
notfound-content = Я боюсь, что не знаю, что вы ищете.

## Privacy

privacy-title = Политика приватности Common Voice
privacy-effective = На дату { DATETIME($date, day: "numeric", month: "long", year: "numeric") }
privacy-more = <more>Подробнее</more>

## Terms

terms-privacy-title = Приватность
terms-privacy-content = Наша <privacyLink>политика приватности</privacyLink> объясняет, как мы получаем и обрабатываем ваши данные.

## Data

data-download-button = Загрузить данные Common Voice
data-download-license = Лицензия: <licenseLink>CC-0</licenseLink>
data-download-modal = Вы собираетесь совершить загрузку <size>{ $size } ГБ</size>, продолжить?
data-get-started = <speechBlogLink>Начало работы с распознаванием речи</speechBlogLink>
data-other-goto = Перейти на { $name }
data-other-download = Загрузить данные
license = Лицензия: <licenseLink>{ $license }</licenseLink>

## Record Page

record-platform-not-supported = Нам жаль, в настоящее время ваша платформа не поддерживается.
record-platform-not-supported-desktop = На настольных компьютерах, вы можете загрузить последний:
record-platform-not-supported-ios = Пользователи <bold>iOS</bold> могут загрузить наше бесплатное приложение:
record-must-allow-microphone = Вы должны разрешить доступ к микрофону.
record-error-too-short = Запись слишком короткая.
record-error-too-long = Запись слишком длинная.
record-error-too-quiet = Запись слишком тихая.
record-submit-success = Запись отправлена! Хотите записать ещё раз?
record-help = Щёлкните для записи, затем громко произнесите фразу выше.
record-cancel = Отменить перезапись
review-terms = Используя Common Voice, вы соглашаетесь с нашими <termsLink>условиями использования</termsLink> и <privacyLink>политикой приватности</privacyLink>
review-aborted = Загрузка прервана. Хотите ли вы удалить ваши записи?
review-submit-title = Проверить и отправить
review-submit-msg = Спасибо за запись!<lineBreak></lineBreak>Теперь проверьте и отправьте ваши записи ниже.
review-recording = Проверить
review-rerecord = Перезаписать
review-cancel = Отменить отправку

## Download Modal

download-title = Ваша загрузка началась.
download-helpus = Помогите нам создать сообщество по языковым технологиям, оставайтесь с нами на связи по электронной почте.
download-form-email =
    .label = Введите ваш адрес эл. почты
    .value = Спасибо, мы будем на связи.
download-back = Вернуться к наборам данных Common Voice
download-no = Нет, спасибо

## Contact Modal

contact-title = Форма связи
contact-cancel = Отмена
contact-form-name =
    .label = Имя
contact-form-message =
    .label = Сообщение
contact-required = *обязательно

## Request Language Modal

request-language-title = Запрос языка
request-language-cancel = Закрыть форму
request-language-form-language =
    .label = Язык
request-language-success-title = Запрос о добавлении языка успешно отправлен, спасибо.
request-language-success-text = Мы свяжемся с вами, и запросим дополнительную информацию о вашем языке, когда он станет доступным.

## Help Translate Modal

help-translate-title = Помочь перевести на { $language }
help-translate-cancel = Закрыть
language-updates-title = Подписаться на обновления для { $language }
help-translate-link = Перейти на Pontoon
language-updates-success-title = Запрос об обновлении для { $language } успешно отправлен, спасибо.
language-updates-success-text = Мы отправим вам больше информации, когда она станет доступна.
language-updates-success-collapsed-title = Вы подписались на обновления для { $language }
