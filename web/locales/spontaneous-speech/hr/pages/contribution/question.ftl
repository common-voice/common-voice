## Question Page

question-page-instruction = Dodaj pitanje <icon></icon> na jeziku { $currentLocale } na koje ljudi trebaju odgovoriti
add-question-textarea-placeholder = npr. „Za što želiš koristiti tehnologiju?”
add-questions-terms-checkbox = Potvrđujem da je ovo pitanje u <publicDomainLink>javnom vlasništvu</publicDomainLink> i da je smijem prenijeti.
question-dataset-language = Skup podataka: { $datasetLanguage }
add-question-success-toast-message =
    { $totalQuestions ->
        [one] { $uploadedQuestions } od jednog pitanja sakupljeno
        [few] { $uploadedQuestions } od { $totalQuestions } pitanja sakupljeno
       *[other] { $uploadedQuestions } od { $totalQuestions } pitanja sakupljeno
    }
add-question-error-message = Prijenos nije uspio, pokušaj ponovo.
add-question-too-many-questions-error = Premašeno je 25 pitanja. Smanji broj pitanja i pokušaj ponovo.
partial-questions-upload-message =
    { $totalQuestions ->
        [one] Sakupljeno je { $uploadedQuestions } od { $totalQuestions } pitanja. Pogledaj naše stranice <guidelinesLink>smjernica</guidelinesLink> za informacije o tome kako dodati pitanja
        [few] Sakupljena su { $uploadedQuestions } od { $totalQuestions } pitanja. Pogledaj naše stranice <guidelinesLink>smjernica</guidelinesLink> za informacije o tome kako dodati pitanja
       *[other] Sakupljeno je { $uploadedQuestions } od { $totalQuestions } pitanja. Pogledaj naše stranice <guidelinesLink>smjernica</guidelinesLink> za informacije o tome kako dodati pitanja
    }
# Guidelines
add-question-guidelines-title = Koja pitanja mogu dodati?
do-section-guideline-1 = Koristi ispravan pravopis i gramatiku
do-section-guideline-2 = Odaberi jednostavna pitanja koja svatko može razumjeti, bez obzira na kulturu ili kontekst
do-section-guideline-3 = Osiguraj da se na njih može odgovoriti u samo par rečenica
do-not-section-guideline-3 = Postavljaj osjetljiva pitanja
