## Error pages

banner-error-slow-1 = Жао нам је, Common Voice тренутно ради спорије. Хвала што се интересујете!
banner-error-slow-2 = Страница прима густ саобраћај и тренутно истражујемо проблеме.
banner-error-slow-link = Статусна страница
error-something-went-wrong = Жао нам је, дошло је до грешке
error-clip-upload = Овај исечак не успева да се отпреми. Покушати поново?
error-clip-upload-server = Отпремање овог исечка и даље не успева на серверу. Поново учитајте страницу или покушајте поново касније.
error-clip-upload-too-large = Ваш снимак је превелик за отпремање. Покушајте да снимите краћи исечак.
error-clip-upload-server-error = Грешка на серверу приликом обраде вашег снимка. Освежите страницу или покушајте поново касније.
error-title-404 = Нисмо могли да вам пронађемо ту страницу
error-content-404 = Можда ће наша <homepageLink>почетна страница</homepageLink> помоћи? Да бисте поставили питање, придружите се <matrixLink>ћаскању Matrix заједнице</matrixLink>, пратите проблеме преко <githubLink>GitHub-а</githubLink> или посетите <discourseLink>наше Discourse форуме</discourseLink>.
error-title-500 = Жао нам је, дошло је до грешке
error-content-500 = Дошло је до неочекиване грешке. Покушајте поново касније. За помоћ, придружите се <matrixLink>ћаскању Matrix заједнице</matrixLink>, пратите проблеме преко <githubLink>GitHub-а</githubLink> или посетите <discourseLink>наше Discourse форуме</discourseLink>.
error-title-502 = Веза је прекинута
error-content-502 = Тренутно не можете да успоставите стабилну везу са нашим серверима. Покушајте поново касније. За помоћ, придружите се <matrixLink>ћаскању Matrix заједнице</matrixLink>, пратите проблеме преко <githubLink>GitHub-а</githubLink> или посетите <discourseLink>наше Discourse форуме</discourseLink>.
error-title-503 = Страница је неочекивано привремено недоступна
error-content-503 = Страница ће бити доступна што је пре могуће. За најновије информације, придружите се <matrixLink>ћаскању Matrix заједнице</matrixLink> или посетите <githubLink>GitHub</githubLink> или <discourseLink>наше Discourse форуме</discourseLink> да пријавите и пратите проблеме.
error-title-504 = Време захтева је истекло
error-content-504 = Захтев је трајао предуго. Ово је обично привремено. Покушајте поново. За помоћ, придружите се <matrixLink>ћаскању Matrix заједнице</matrixLink>, пратите проблеме преко <githubLink>GitHub-а</githubLink> или посетите <discourseLink>наше Discourse форуме</discourseLink>.
error-code = Грешка { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Нисмо могли да отпремимо ваш снимак. Већ је раније отпремљен. Наставимо са следећом групом!
        [few] Нисмо могли да отпремимо { $total } снимка. Већ су раније отпремљени. Наставимо са следећом групом!
       *[other] Нисмо могли да отпремимо { $total } снимака. Већ су раније отпремљени. Наставимо са следећом групом!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Отпремили смо { $uploaded } ваша снимка — остатак је већ раније отпремљен. Наставимо са следећом групом!
