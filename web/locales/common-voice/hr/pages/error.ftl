## Error pages

banner-error-slow-1 = Nažalost, Common Voice radi sporo. Hvala ti na interesu.
banner-error-slow-2 = Trenutačno primamo veliku količinu podataka i istražujemo probleme.
banner-error-slow-link = Stranica stanja
error-something-went-wrong = Oprosti, dogodila se greška
error-clip-upload = Prijenos ovog isječka ne uspijeva. Nastaviti pokušavati?
error-clip-upload-server = Prijenos ovog isječka ne uspijeva na serveru. Ponovo učitaj stranicu ili pokušaj kasnije ponovo.
error-title-404 = Nismo mogli pronaći tu stranicu
error-content-404 = Možda će naša <homepageLink>početna stranica</homepageLink> biti od pomoći? Za postavljanje pitanja, pridruži se razgovorima zajednice putem <matrixLink>Matrixa</matrixLink>, prati probleme web stranica putem <githubLink>GitHuba</githubLink> ili posjeti <discourseLink>naše forume za diskusiju</discourseLink>.
error-title-500 = Oprosti, dogodila se greška
error-content-500 = Dogodila se neočekivana greška. Pokušaj ponovo kasnije. Za pomoć se pridruži <matrixLink>Matrix chatu zajednice</matrixLink>, prati probleme web-stranice putem <githubLink>GitHub-a</githubLink> ili posjeti <discourseLink>naše Discourse forume</discourseLink>.
error-title-502 = Veza je prekinuta
error-content-502 = Trenutačno ne možeš uspostaviti stabilnu vezu s našim serverima. Pokušaj ponovo kasnije. Za pomoć se pridružite <matrixLink>Matrix chatu zajednice</matrixLink>, prati probleme s web-stranice putem <githubLink>GitHub-a</githubLink> ili posjeti<discourseLink>naše Discourse forume</discourseLink>.
error-title-503 = Došlo je do neočekivanog prekida rada
error-content-503 = Stranica će biti dostupna što je prije moguće. Za najnovije informacije, pridruži se razgovorima zajednice putem <matrixLink>Matrixa</matrixLink> posjeti <githubLink>GitHub</githubLink> ili <discourseLink>naše forume za diskusiju</discourseLink> za prijavljivanje i praćenje problema s web stranicom.
error-title-504 = Istek vremena zahtjeva
error-content-504 = Obrada zahtjeva je trajala predugo. Ovo je obično privremeno. Pokušaj ponovo. Za pomoć se pridružite <matrixLink>Matrix chatu zajednice</matrixLink>, prati probleme s web-stranice putem <githubLink>GitHub-a</githubLink> ili posjeti<discourseLink>naše Discourse forume</discourseLink>.
error-code = Greška { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Nismo mogli prenijeti { $total } isječak. Već je prije prenesen. Nastavimo sa sljedećim skupom!
        [few] Nismo mogli prenijeti { $total } isječka. Već su prije preneseni. Nastavimo sa sljedećim skupom!
       *[other] Nismo mogli prenijeti { $total } isječaka. Već su prije preneseni. Nastavimo sa sljedećim skupom!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Broj tvojih isječaka koje smo prenijeli: { $uploaded } – Ostali su već preneseni. Nastavimo sa sljedećom skupom!
