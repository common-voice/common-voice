## Question Page

question-page-instruction = Adjon hozzá egy kérdést <icon></icon> { $currentLocale } nyelven, hogy a mások megválaszolhassák
add-question-textarea-placeholder = például „Mire használná a technológiát?”
add-questions-terms-checkbox = * Megerősítem, hogy ez a mondat <wikipediaLink>közkincs</wikipediaLink>, és engedéllyel töltöm fel.
question-dataset-language = Adatkészlet: { $databaseLanguage }
add-question-success-toast-message =
    { $totalQuestions ->
        [one] { $uploadedQuestions } / 1 kérdés összegyűjtve
       *[other] { $uploadedQuestions } / { $totalQuestions } kérdés összegyűjtve
    }
add-question-error-message = A feltöltés sikertelen, próbálja újra.
add-question-too-many-questions-error = Túllépte az 500 kérdést. Csökkentse a kérdések számát, és próbálja újra.
partial-questions-upload-message =
    { $totalQuestions ->
        [one] { $uploadedQuestions } / 1 kérdés összegyűjtve. Tekintse meg az <guidelinesLink>irányelvek</guidelinesLink> oldalait, hogy többet tudjon meg a kérdések hozzáadásáról
       *[other] { $uploadedQuestions } / { $totalQuestions } kérdés összegyűjtve. Tekintse meg az <guidelinesLink>irányelvek</guidelinesLink> oldalait, hogy többet tudjon meg a kérdések hozzáadásáról
    }
# Guidelines
add-question-guidelines-title = Milyen kérdéseket adhatok hozzá?
do-section-title = igen
do-section-guideline-1 = Írjon helyesen
do-section-guideline-2 = Válasszon egyszerű kérdéseket, amelyek bárki számára könnyen érthetőek, kultúrától és kontextustól függetlenül
do-section-guideline-3 = Győződjön meg róla, hogy néhány mondatban megválaszolhatóak
do-not-section-title = ne
do-not-section-guideline-1 = Kérjen személyazonosításra alkalmas adatokat (például neveket vagy pénzügyi információkat)
do-not-section-guideline-2 = Fejezzen ki előítéletes vagy sértő érzéseket
do-not-section-guideline-3 = Tegyen fel kényes kérdéseket
# Code switching Guidelines
cs-do-section-guideline-1 = Kétnyelvű kérdések vagy környezet használata
