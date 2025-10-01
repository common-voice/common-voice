## Error pages

banner-error-slow-1 = За съжаление Common Voice работи бавно. Благодаря за проявения интерес.
banner-error-slow-2 = Получаваме много трафик и в момента проучваме проблемите.
banner-error-slow-link = Страница за състоянието
error-something-went-wrong = Съжаляваме, но нещо се обърка
error-clip-upload = Качването на този клип продължава да се проваля,. Искате ли да продължите да опитвате отново?
error-clip-upload-server = Качването на този клип продължава да се проваля на сървъра. Презаредете страницата или опитайте отново по-късно.
error-title-404 = Страницата, която търсите липсва
error-content-404 = Може би нашата <homepageLink>начална страница</homepageLink> ще помогне? За да зададете въпрос, моля, присъединете се към <matrixLink>общността в Matrix</matrixLink>, наблюдавайте дефектита чрез <githubLink>GitHub</githubLink> или посетете <discourseLink>нашите дискусионни форуми</discourseLink>.
error-title-503 = Възникна неочакван проблем
error-content-503 = Страницата ще бъде отново достъпна възможно най-скоро. За последната информация се присъединете към <matrixLink>общността в Matrix</matrixLink>, посетете <githubLink>GitHub</githubLink> или <discourseLink>нашите дискусионни форуми</discourseLink>, за да съобщите и наблюдавате за проблеми с работата на страницата.
error-code = Грешка { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Не можахме да качим вашия запис. Той вече е бил качван и преди. Да продължим със следващата партида!
       *[other] Не можахме да качим { $total } oт записите. Те вече са били качвани и преди. Да продължим със следващата партида!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Качихме { $uploaded } от ваши записи — останалите вече са качени. Да продължим със следващата партида!
