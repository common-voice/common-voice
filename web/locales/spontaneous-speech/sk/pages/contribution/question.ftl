## Question Page

question-page-instruction = Pridajte otázku <icon></icon> v jazyku { $currentLocale }, aby na ňu ľudia odpovedali
add-question-textarea-placeholder = napr.: "Na čo by ste chceli použiť technológiu?"
add-questions-terms-checkbox = Potvrdzujem, že táto veta je dostupná <publicDomainLink>pod verejne dostupnou licenciou</publicDomainLink> a mám povolenie na jej nahratie.
question-dataset-language = Kolekcia údajov: { $datasetLanguage }
add-question-success-toast-message =
    { $totalQuestions ->
        [one] Zozbierané otázky: { $uploadedQuestions } z 1
        [few] Zozbierané otázky: { $uploadedQuestions } z { $totalQuestions }
        [many] Zozbierané otázky: { $uploadedQuestions } z { $totalQuestions }
       *[other] Zozbierané otázky: { $uploadedQuestions } z { $totalQuestions }
    }
add-question-error-message = Odoslanie zlyhalo, skúste to znova.
add-question-too-many-questions-error = Prekročili ste 500 otázok. Znížte počet otázok a skúste to znova.
partial-questions-upload-message =
    { $totalQuestions ->
        [one] Zozbierané otázky: { $uploadedQuestions } z 1. Pozrite si naše <guidelinesLink>pokyny</guidelinesLink>, kde sa dozviete viac o pridávaní otázok
        [few] Zozbierané otázky: { $uploadedQuestions } z { $totalQuestions }. Pozrite si naše <guidelinesLink>pokyny</guidelinesLink>, kde sa dozviete viac o pridávaní otázok
        [many] Zozbierané otázky: { $uploadedQuestions } z { $totalQuestions }. Pozrite si naše <guidelinesLink>pokyny</guidelinesLink>, kde sa dozviete viac o pridávaní otázok
       *[other] Zozbierané otázky: { $uploadedQuestions } z { $totalQuestions }. Pozrite si naše <guidelinesLink>pokyny</guidelinesLink>, kde sa dozviete viac o pridávaní otázok
    }
# Guidelines
add-question-guidelines-title = Aké otázky môžem pridať?
do-section-title = áno:
do-section-guideline-1 = Používajte správny pravopis a gramatiku
do-section-guideline-2 = Vyberte si jednoduché otázky, ktoré sú ľahko zrozumiteľné pre každého, bez ohľadu na kultúru alebo kontext
do-section-guideline-3 = Uistite sa, že na ne možno odpovedať iba niekoľkými vetami
do-not-section-title = nie:
do-not-section-guideline-1 = Nežiadajte informácie umožňujúce osobnú identifikáciu (ako sú mená alebo finančné informácie)
do-not-section-guideline-2 = Nevyjadrujte alebo vyvolávajte predsudky alebo urážlivé pocity
do-not-section-guideline-3 = Nepýtajte sa citlivé otázky
# Code switching Guidelines
cs-do-section-guideline-1 = Používajte dvojjazyčné otázky alebo kontext
cs-do-section-guideline-2 = Preskúmajte neformálne scenáre, situácie alebo konštrukcie
