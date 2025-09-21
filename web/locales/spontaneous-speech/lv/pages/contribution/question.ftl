## Question Page

question-page-instruction = Pievienojiet jautājumu <icon></icon> { $currentLocale } valodā, lai cilvēki varētu atbildēt uz to
add-question-textarea-placeholder = piemēram, “Kam jūs vēlētos izmantot nākotnes tehnoloģijas?”
add-questions-terms-checkbox = * Es apstiprinu, ka šis jautājums ir <publicDomainLink>bez autortiesībām</publicDomainLink>, un man ir atļauja to pievienot.
question-dataset-language = Datu kopa: { $datasetLanguage }
add-question-success-toast-message =
    { $totalQuestions ->
        [zero] { $uploadedQuestions } no 0 jautājumiem pievienoti
        [one] { $uploadedQuestions } no 1 jautājuma pievienoti
       *[other] { $uploadedQuestions } no { $totalQuestions } jautājumiem pievienoti
    }
add-question-error-message = Pievienošana neizdevās, lūdzu, mēģiniet vēlreiz.
add-question-too-many-questions-error = Pārsniegts 500 jautājumu limits. Samaziniet jautājumu skaitu un mēģiniet vēlreiz.
partial-questions-upload-message =
    { $totalQuestions ->
        [zero] { $uploadedQuestions } no 0 jautājumiem pievienoti. Apskatiet <guidelinesLink>vadlīniju</guidelinesLink> lapas, lai uzzinātu vairāk par jautājumu pievienošanu
        [one] { $uploadedQuestions } no 1 jautājuma pievienoti. Apskatiet <guidelinesLink>vadlīniju</guidelinesLink> lapas, lai uzzinātu vairāk par jautājumu pievienošanu
       *[other] { $uploadedQuestions } no { $totalQuestions } jautājumiem pievienoti. Apskatiet <guidelinesLink>vadlīniju</guidelinesLink> lapas, lai uzzinātu vairāk par jautājumu pievienošanu
    }
# Guidelines
add-question-guidelines-title = Kādus jautājumus varu pievienot?
do-section-title = dariet tā
do-section-guideline-1 = Izmantojiet pareizu pareizrakstību un gramatiku
do-section-guideline-2 = Izvēlieties vienkāršus jautājumus, ko viegli saprast ikvienam neatkarīgi no pieredzes vai konteksta
do-section-guideline-3 = Pārliecinieties, ka uz jautājumiem var atbildēt pāris teikumos
do-not-section-title = nedariet tā
do-not-section-guideline-1 = Mudiniet iesniegt personu identificējošu informāciju (piemēram vārdus vai finanšu datus)
do-not-section-guideline-2 = Paudiet vai mudiniet paust aizspriedumus vai aizskarošus apgalvojumus
do-not-section-guideline-3 = Uzdodiet sensitīvus jautājumus
# Code switching Guidelines
cs-do-section-guideline-1 = Izmantojiet divvalodu jautājumus vai kontekstu
cs-do-section-guideline-2 = Izpētiet neformālus scenārijus, situācijas vai to atveidojumus
cs-do-not-section-guideline-1 = Pieprasīt personu identificējošu informāciju (piemēram, vārdus vai finanšu informāciju) vai aizskarošus uzskatus
cs-do-not-section-guideline-2 = Lūdziet koda maiņu vai pieprasiet tulkojumu
cs-do-not-section-guideline-3 = Nelietojiet pārāk formālu valodu
