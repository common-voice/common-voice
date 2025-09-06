## Error pages

banner-error-slow-1 = Lamentablement, el Common Voice està funcionant lentament. Gràcies pel vostre interès.
banner-error-slow-2 = Estem rebent molt trànsit. Actualment estem investigant els problemes.
banner-error-slow-link = Pàgina d’estat
error-something-went-wrong = Hi ha hagut un problema
error-clip-upload = La pujada d'aquest tall continua fallant. Voleu reintentar-ho?
error-clip-upload-server = La pujada d'aquest tall continua fallant en el servidor. Torneu a carregar la pàgina o proveu-ho més tard.
error-title-404 = No s’ha trobat aquesta pàgina
error-content-404 = Potser us pot ajudar la nostra <homepageLink>pàgina d'inici</homepageLink>? Si teniu alguna pregunta, uniu-vos al <matrixLink>xat de la comunitat a Matrix</matrixLink>, superviseu els problemes del lloc mitjançant el <githubLink>GitHub</githubLink> o visiteu els nostres <discourseLink>fòrums del Discourse</discourseLink>.
error-title-503 = El lloc web no està disponible temporalment
error-content-503 = El lloc tornarà a estar disponible al més aviat possible. Per veure la informació més actual, uniu-vos al <matrixLink>xat de la comunitat a Matrix</matrixLink>, o visiteu el <githubLink>GitHub</githubLink> o els nostres <discourseLink>fòrums del Discourse</discourseLink> per enviar i supervisar els problemes que experimenteu en el lloc.
error-code = Error { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] No s’ha pogut pujar el vostre tall perquè ja s’havia pujat prèviament. Seguim amb el següent lot!
       *[other] No s’han pogut pujar { $total } talls perquè ja s’havien pujat prèviament. Seguim amb el següent lot!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = S’han pujat { $uploaded } dels vostres talls. La resta ja s’havien pujat. Seguim amb el següent lot!
