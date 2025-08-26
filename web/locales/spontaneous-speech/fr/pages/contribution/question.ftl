## Question Page

question-page-instruction = Ajoutez une question <icon></icon> en { $currentLocale } pour que d’autres personnes puissent y répondre
add-question-textarea-placeholder = par exemple, « Qu’aimeriez-vous pouvoir faire avec la technologie ? »
add-questions-terms-checkbox = * Je confirme que cette question est du <publicDomainLink>domaine public</publicDomainLink> et que j’ai la permission de l’envoyer.
question-dataset-language = Jeu de données : { $datasetLanguage }
add-question-success-toast-message =
    { $totalQuestions ->
        [one] { $uploadedQuestions } question collectée sur { $totalQuestions }
       *[other] { $uploadedQuestions } questions collectées sur { $totalQuestions }
    }
add-question-error-message = Échec de l’envoi, veuillez réessayer.
add-question-too-many-questions-error = Dépassement des 500 questions. Diminuez le nombre de questions puis réessayez.
partial-questions-upload-message =
    { $uploadedQuestions ->
        [one] { $uploadedQuestions } question collectée sur { $totalQuestions }. Consultez nos  <guidelinesLink>consignes</guidelinesLink> pour savoir comment ajouter des questions.
       *[other] { $uploadedQuestions } questions collectées sur { $totalQuestions }. Consultez nos  <guidelinesLink>consignes</guidelinesLink> pour savoir comment ajouter des questions.
    }
# Guidelines
add-question-guidelines-title = Quelles questions puis-je ajouter ?
do-section-title = Ce qu’il faut faire
do-section-guideline-1 = L’orthographe et la grammaire doivent être correctes
do-section-guideline-2 = Choisir des questions simples et compréhensibles par tout le monde, quels que soient la culture ou le contexte.
do-section-guideline-3 = S’assurer que l’on peut y répondre en quelques phrases seulement
do-not-section-title = Ce qu’il ne faut pas faire
do-not-section-guideline-1 = Demander des informations personnelles (comme des noms ou des informations financières)
do-not-section-guideline-2 = Exprimer ou encourager des sentiments préjudiciables ou offensants.
do-not-section-guideline-3 = Poser des questions sensibles
# Code switching Guidelines
cs-do-section-guideline-1 = Utiliser des questions bilingues ou le contexte
cs-do-section-guideline-2 = Se servir de scénarios informels, de mises en situation ou de reproductions de situations
cs-do-not-section-guideline-1 = Encourager le partage de données personnelles (telles que des noms ou des informations financières) ou de propos  insultants
cs-do-not-section-guideline-2 = Demander à changer de langue ou à traduire
cs-do-not-section-guideline-3 = Employer un langage trop soutenu
