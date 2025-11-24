## Error pages

banner-error-slow-1 = Ne pare rău, momentan platforma Common Voice rulează lent. Vă mulțumim pentru înțelegere.
banner-error-slow-2 = Înregistrăm un trafic intens pe platforma noastră și lucrăm să remediem problemele.
banner-error-slow-link = Pagina de stare
error-something-went-wrong = Din păcate ceva nu a funcționat
error-clip-upload = Încărcarea acestui clip eșuează în continuare. Continui să încerci?
error-clip-upload-server = Încărcarea acestui clip eșuează în mod repetat pe server. Reîncarcă pagina sau încearcă din nou mai târziu.
error-title-404 = Nu am găsit pagina pe care o cauți
error-content-404 = Poate că te ajută <homepageLink>pagina noastră de start</homepageLink>? Pentru a adresa o întrebare, intră pe <matrixLink>chatul Matrix al comunității</matrixLink>. Poți monitoriza problemele site-ului prin <githubLink>GitHub</githubLink> și poți intra pe <discourseLink>forumurile noastre Discourse</discourseLink> pentru a discuta.
error-title-502 = Conexiune întreruptă
error-title-503 = Ne confruntăm cu opriri neașteptate
error-content-503 = Site-ul va deveni funcțional cât mai curând posibil. Pentru cele mai noi informații, intră pe <matrixLink>chatul comunității Matrix</matrixLink> sau pe <githubLink>GitHub</githubLink> sau pe <discourseLink>forumurile noastre Discourse</discourseLink> pentru a raporta și monitoriza probleme de utilizare a site-ului.
error-code = Eroare { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Nu am putut încărca înregistrarea pentru că a fost deja încărcată. Să continuăm cu următorul lot!
        [few] Nu am putut încărca { $total } înregistrări pentru că au fost deja încărcate. Să continuăm cu următorul lot!
       *[other] Nu am putut încărca { $total } înregistrări pentru că au fost deja încărcate. Să continuăm cu următorul lot!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Am încărcat { $uploaded } înregistrări pentru că celelalte au fost deja încărcate. Să continuăm cu următorul lot!
