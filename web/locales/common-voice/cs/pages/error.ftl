## Error pages

banner-error-slow-1 = Omlouváme se za pomalý běh Common Voice a děkujeme za váš zájem.
banner-error-slow-2 = Zaznamenali jsme velký provoz a problém zkoumáme.
banner-error-slow-link = Stavová stránka
error-something-went-wrong = Nastala chyba. Omlouváme se.
error-clip-upload = Stále se nedaří nahrát záznam. Pokoušet se i nadále?
error-clip-upload-server = Nahrávání záznamu na serveru se stále nedaří. Znovu načtěte stránku nebo to zkuste později.
error-clip-upload-too-large = Vaše nahrávka je pro nahrání příliš velká. Zkuste nahrát kratší klip.
error-clip-upload-server-error = Chyba serveru při zpracování klipu. Obnovte prosím stránku nebo to zkuste později.
error-title-404 = Tuto stránku se nám nepodařilo najít
error-content-404 = Možná vám pomůže naše <homepageLink>domovská stránka</homepageLink>. Pro případné položení dotazu se prosím připojte do naší <matrixLink>skupiny na Matrix serveru</matrixLink>. Nahlášené chyby můžete sledovat na <githubLink>GitHubu</githubLink> nebo na <discourseLink>fóru Discourse</discourseLink>.
error-title-500 = Nastala chyba. Omlouváme se.
error-content-500 = Došlo k neočekávané chybě. Zkuste to prosím znovu později. Pro pomoc se prosím připojte do <matrixLink>komunitního chatu na Matrixu</matrixLink>, monitorujte problémy na webu skrze <githubLink>GitHub</githubLink> nebo navštivte <discourseLink>naše fórum Discourse</discourseLink>.
error-title-502 = Spojení přerušeno
error-content-502 = V tuto chvíli se vám nedaří navázat stabilní připojení k našim serverům. Zkuste to prosím později. Chcete-li získat pomoc, připojte se k chatu komunity <matrixLink>Matrix</matrixLink>, sledujte problémy webu prostřednictvím <githubLink>GitHub</githubLink> nebo navštivte <discourseLink>naše fórum Discourse</discourseLink>.
error-title-503 = Stránka je neočekávaně dočasně nedostupná
error-content-503 = Budeme zpět jak nejdříve to půjde. Pro nahlášení problému se prosím připojte do naší <matrixLink>skupiny na Matrix serveru</matrixLink>. Nahlášené chyby můžete sledovat také na <githubLink>GitHubu</githubLink> nebo na <discourseLink>fóru Discourse</discourseLink>.
error-title-504 = Vypršel časový limit požadavku
error-content-504 = Vyplnění žádosti trvalo příliš dlouho. Obvykle se jedná o dočasný stav. Zkuste to prosím znovu. Chcete-li získat pomoc, připojte se k chatu komunity <matrixLink>Matrix</matrixLink>, sledujte problémy webu prostřednictvím <githubLink>GitHub</githubLink> nebo navštivte <discourseLink>naše fórum Discourse</discourseLink>.
error-code = Chyba { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Váš klip se nám nepodařilo nahrát. Byl již nahrán dříve. Pokračujeme další várkou!
        [few] Nepodařilo se nám nahrát { $total } klipy. Byly již nahrány dříve. Pokračujme další dávkou!
        [many] Nepodařilo se nám nahrát { $total } klipů. Byly již nahrány dříve. Pokračujme další dávkou!
       *[other] Nepodařilo se nám nahrát { $total } klipů. Byly již nahrány dříve. Pokračujme další dávkou!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Nahráli jsme vaše záznamy ({ $uploaded } ) — Zbytek již nahrán byl. Pojďme pokračovat s další várkou!
