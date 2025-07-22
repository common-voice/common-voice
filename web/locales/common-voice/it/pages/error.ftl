## Error pages

banner-error-slow-1 = Ci dispiace, il funzionamento di Common Voice è rallentato. Grazie per il tuo interesse.
banner-error-slow-2 = Stiamo ricevendo molto traffico e stiamo attualmente analizzando il problema.
banner-error-slow-link = Pagina di stato
error-something-went-wrong = Siamo spiacenti, si è verificato un errore
error-clip-upload = Si continua a verificare un errore con il caricamento di questa registrazione. Riprovare ancora?
error-clip-upload-server = Si continua a verificare un errore con il caricamento sul server di questa registrazione. Ricarica la pagina o riprova più tardi.
error-title-404 = Pagina non trovata
error-content-404 = Vuoi tornare alla <homepageLink>pagina iniziale</homepageLink>? Puoi anche chiedere assistenza nella <matrixLink>chat della community Matrix</matrixLink>, consultare i problemi noti del sito su <githubLink>GitHub</githubLink> o seguire la discussione sul <discourseLink>forum Discourse</discourseLink>.
error-title-503 = Si è verificata un’interruzione imprevista
error-content-503 = Questo sito verrà ripristinato il prima possibile. Per rimanere aggiornato sugli ultimi sviluppi accedi alla <matrixLink>chat della community Matrix</matrixLink>. Per segnalare o monitorare i problemi di funzionamento del sito web visita <githubLink>GitHub</githubLink> o l’apposito <discourseLink>forum su Discourse</discourseLink>.
error-code = Errore { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] Non è stato possibile caricare la registrazione in quanto era già stata caricata. Continua con il prossimo lotto.
       *[other] Non è stato possibile caricare { $total } registrazioni in quanto erano già state caricate. Continua con il prossimo lotto.
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Sono state caricate { $uploaded } registrazioni, le restanti erano già state caricate. Continua con il prossimo lotto.
