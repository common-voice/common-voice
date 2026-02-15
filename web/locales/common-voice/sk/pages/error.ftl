## Error pages

banner-error-slow-1 = Ospravedlňujeme sa, Common Voice beží pomaly. Ďakujeme za Váš záujem.
banner-error-slow-2 = Zaznamenávame veľkú návštevnosť a momentálne problémy skúmame.
banner-error-slow-link = Stavová stránka
error-something-went-wrong = Ospravedlňujeme sa, niečo sa pokazilo
error-clip-upload = Odoslanie tejto nahrávky neustále zlyháva, skúšať to znova?
error-clip-upload-server = Odoslanie tejto nahrávky na server neustále zlyháva. Znova načítajte stránku alebo to skúste znova neskôr.
error-clip-upload-too-large = Váš súbor nahrávky je na nahranie príliš veľký. Skúste nahrať kratší klip.
error-clip-upload-server-error = Chyba servera pri spracovaní vášho klipu. Znova načítajte stránku alebo to skúste neskôr.
error-title-404 = Túto stránku sa nám nepodarilo nájsť
error-content-404 = Možno pomôže naša <homepageLink>domovská stránka</homepageLink>? Ak chcete položiť otázku, pripojte sa k četu na <matrixLink>Matrixe</matrixLink>, monitorujte problémy prostredníctvom <githubLink>GitHubu</githubLink> alebo navštívte <discourseLink>naše diskusné fóra</discourseLink>.
error-title-500 = Ospravedlňujeme sa, niečo sa pokazilo
error-content-500 = Vyskytla sa neočakávaná chyba. Skúste to znova neskôr. Ak potrebujete pomoc, pripojte sa k <matrixLink>komunitnému chatu Matrix</matrixLink>, sledujte problémy stránky na <githubLink>GitHube</githubLink> alebo navštívte <discourseLink>naše fóra Discourse</discourseLink>.
error-title-502 = Spojenie prerušené
error-content-502 = Momentálne sa vám nepodarilo nadviazať stabilné pripojenie k našim serverom. Skúste to znova neskôr. Ak potrebujete pomoc, pripojte sa k <matrixLink>komunitnému chatu Matrix</matrixLink>, sledujte problémy so stránkou na <githubLink>GitHube</githubLink> alebo navštívte <discourseLink>naše fóra Discourse</discourseLink>.
error-title-503 = Zaznamenali sme neočakávaný výpadok
error-content-503 = Stránka bude čo najskôr obnovená. Ak chcete získať najnovšie informácie, pripojte sa k četu na <matrixLink>Matrixe</matrixLink>, navštívte stránku na <githubLink>GitHube</githubLink> alebo si pozrite <discourseLink>naše diskusné fóra</discourseLink>.
error-title-504 = Časový limit žiadosti
error-content-504 = Splnenie požiadavky trvalo príliš dlho. Toto je zvyčajne dočasné. Skúste to znova. Ak potrebujete pomoc, pripojte sa k <matrixLink>komunitnému chatu Matrix</matrixLink>, sledujte problémy stránky na <githubLink>GitHube</githubLink> alebo navštívte <discourseLink>naše fóra Discourse</discourseLink>.
error-code = Chyba { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Nepodaril sa nám nahrať { $total } klip. Už bol predtým nahraný. Pokračujeme s ďalšou dávkou!
        [few] Nepodarili sa nám nahrať { $total } klipy. Už boli predtým nahrané. Pokračujeme s ďalšou dávkou!
        [many] Nepodarilo sa nám nahrať { $total } klipov. Už boli predtým nahrané. Pokračujeme s ďalšou dávkou!
       *[other] Nepodarilo sa nám nahrať { $total } klipov. Už boli predtým nahrané. Pokračujeme s ďalšou dávkou!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Nahrali sme { $uploaded } vaše klipy — zvyšok už bol nahraný. Pokračujeme s ďalšou várkou!
