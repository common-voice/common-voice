## WRITE PAGE

write = Écrire
write-instruction = Ajoutez <icon></icon> une phrase du domaine public
write-page-subtitle = Les phrases fournies ici seront ajoutées à un jeu de données public sous licence cc-0.
sentence =
    .label = Phrase
sentence-input-placeholder = Saisissez votre phrase du domaine public ici
small-batch-sentence-input-placeholder = Saisissez vos phrases du domaine public ici
citation-input-placeholder = Spécifiez la source de votre phrase (obligatoire)
citation =
    .label = Citation
sc-write-submit-confirm = Je confirme que cette phrase est du <wikipediaLink>domaine public</wikipediaLink> et que j’ai la permission de l’envoyer.
sc-review-write-title = Quelles phrases puis-je ajouter ?
sc-review-small-batch-title = Comment ajouter plusieurs phrases
new-sentence-rule-1 = <noCopyright>Aucune restriction de droit d’auteur</noCopyright> (<cc0>cc-0</cc0>)
new-sentence-rule-2 = Moins de 15 mots
new-sentence-rule-3 = La grammaire doit être correcte
new-sentence-rule-4 = L’orthographe et la ponctuation doivent être correctes
new-sentence-rule-5 = Pas de chiffres ni de caractères spéciaux
new-sentence-rule-6 = Pas de lettre étrangère
new-sentence-rule-7 = La citation appropriée doit être incluse
new-sentence-rule-8 = La phrase doit idéalement être naturelle et conversationnelle (elle doit être facile à lire)
login-instruction-multiple-sentences = <loginLink>Connectez-vous</loginLink> ou <loginLink>inscrivez-vous</loginLink> pour ajouter plusieurs phrases
how-to-cite = Comment faire une citation ?
how-to-cite-explanation-bold = Citez en incluant un lien ou le nom complet de l’œuvre.
how-to-cite-explanation = Si ce sont vos propres mots, mentionnez simplement <italicizedText>« auto-citation »</italicizedText>. Nous avons besoin de connaître la provenance de ce contenu afin de pouvoir vérifier qu’il est dans le domaine public et qu’aucune restriction de droit d’auteur ne s’applique. Pour plus d’informations sur les citations, consultez <guidelinesLink>nos consignes</guidelinesLink>.
guidelines = Consignes
contact-us = Nous contacter
add-sentence-success = 1 phrase collectée
add-sentence-error = Erreur lors de l’ajout de la phrase
required-field = Veuillez compléter ce champ.
single-sentence-submission = Envoi de phrase unique
small-batch-sentence-submission = Envoi de petit lot de phrases
bulk-sentence-submission = Envoi de plusieurs phrases
single-sentence = Phrase unique
small-batch-sentence = Petit lot
bulk-sentence = Grand nombre
sentence-domain-combobox-label = Domaine de la phrase
sentence-domain-select-placeholder = Sélectionnez jusqu’à trois domaines
# Sentence Domain dropdown option
agriculture_food = Agriculture et agroalimentaire
# Sentence Domain dropdown option
automotive_transport = Automobile et transport
# Sentence Domain dropdown option
finance = Finance
# Sentence Domain dropdown option
service_retail = Services et vente au détail
# Sentence Domain dropdown option
general = Général
# Sentence Domain dropdown option
healthcare = Santé
# Sentence Domain dropdown option
history_law_government = Histoire, droit et gouvernement
# Sentence Domain dropdown option
language_fundamentals = Principes de base des langues (chiffres, lettres, argent)
# Sentence Domain dropdown option
media_entertainment = Médias et divertissement
# Sentence Domain dropdown option
nature_environment = Nature et environnement
# Sentence Domain dropdown option
news_current_affairs = Actualités
# Sentence Domain dropdown option
technology_robotics = Technologie et robotique
sentence-variant-select-label = Variante de phrase
sentence-variant-select-placeholder = Sélectionnez une variante (facultatif)
sentence-variant-select-multiple-variants = Généralités sur la langue / plusieurs variantes

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = Envoyez <icon></icon> des phrases du domaine public
sc-bulk-upload-instruction = Faites glisser votre fichier ici ou <uploadButton>cliquez pour l’envoyer</uploadButton>
sc-bulk-upload-instruction-drop = Déposez le fichier ici pour l’envoyer
bulk-upload-additional-information = Si vous souhaitez fournir des informations supplémentaires à propos de ce fichier, veuillez contacter <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = Si vous souhaitez fournir des informations supplémentaires à propos de ce fichier, qui ne sont pas incluses dans le modèle, veuillez contacter <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = Réessayez en faisant glisser votre fichier ici
try-upload-again-md = Essayer à nouveau d’envoyer
select-file = Sélectionner un fichier
select-file-mobile = Sélectionnez un fichier à envoyer
accepted-files = Types de fichiers acceptés : .tsv uniquement
minimum-sentences = Nombre minimum de phrases dans le fichier : 1 000
maximum-file-size = Taille maximale du fichier : 25 Mo
what-needs-to-be-in-file = Que doit contenir mon fichier ?
what-needs-to-be-in-file-explanation = Veuillez consulter notre <templateFileLink>modèle</templateFileLink>. Vos phrases doivent être libres de droit (CC0 ou travail original autorisé par l’auteur·trice) et être claires, grammaticalement correctes et faciles à lire. Les phrases envoyées doivent prendre environ 10-15 secondes à lire et doivent éviter d’inclure des chiffres, des noms propres et des caractères spéciaux.
upload-progress-text = Envoi en cours…
sc-bulk-submit-confirm = Je confirme que ces phrases sont du <wikipediaLink>domaine public</wikipediaLink> et que j’ai la permission de les envoyer.
bulk-upload-success-toast = Phrases envoyées
bulk-upload-failed-toast = Échec de l’envoi, veuillez réessayer.
bulk-submission-success-header = Merci d’avoir participé en envoyant plusieurs phrases !
bulk-submission-success-subheader = Vous aidez Common Voice à atteindre ses objectifs quotidiens de phrases !
upload-more-btn-text = Envoyer d’autres phrases ?
file-invalid-type = Fichier non valide
file-too-large = Le fichier est trop volumineux
file-too-small = Le fichier est trop petit
too-many-files = Trop de fichiers

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> Ajouter plusieurs phrases du domaine public
multiple-sentences-error = Vous ne pouvez pas ajouter plusieurs phrases lors d’un envoi unique
exceeds-small-batch-limit-error = Impossible de soumettre plus de 1 000 phrases
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes =
    { $retryLimit ->
        [one] Limite dépassée. Veuillez réessayer dans 1 minute.
       *[other] Limite dépassée. Veuillez réessayer dans { $retryLimit } minutes.
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds =
    { $retryLimit ->
        [one] Limite dépassée. Veuillez réessayer dans 1 seconde.
       *[other] Limite dépassée. Veuillez réessayer dans { $retryLimit } secondes.
    }
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes =
    { $retryLimit ->
        [one] Vous avez atteint la limite d’envoi pour cette page. Veuillez attendre 1 minute avant d’envoyer une autre phrase. Merci pour votre patience !
       *[other] Vous avez atteint la limite d’envoi pour cette page. Veuillez attendre { $retryLimit } minutes avant d’envoyer une autre phrase. Merci pour votre patience !
    }
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds =
    { $retryLimit ->
        [one] Vous avez atteint la limite d’envoi pour cette page. Veuillez attendre 1 seconde avant d’envoyer une autre phrase. Merci pour votre patience !
       *[other] Vous avez atteint la limite d’envoi pour cette page. Veuillez attendre { $retryLimit } secondes avant d’envoyer une autre phrase. Merci pour votre patience !
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success =
    { $uploadedSentences ->
        [one] { $uploadedSentences } phrase collectée sur { $totalSentences }
       *[other] { $uploadedSentences } phrases collectées sur { $totalSentences }
    }
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message =
    { $uploadedSentences ->
        [one] { $uploadedSentences } phrase collectée sur { $totalSentences }. Cliquez <downloadLink>ici</downloadLink> pour télécharger les phrases rejetées.
       *[other] { $uploadedSentences } phrases collectées sur { $totalSentences }. Cliquez <downloadLink>ici</downloadLink> pour télécharger les phrases rejetées.
    }
small-batch-sentences-rule-1 = Suivez les directives de la section « Quelles phrases puis-je ajouter ? »
small-batch-sentences-rule-2 = Ajoutez une phrase par ligne
small-batch-sentences-rule-3 = Séparez les phrases en appuyant une fois sur « Entrée »
small-batch-sentences-rule-4 = Ajoutez jusqu’à 1 000 phrases
small-batch-sentences-rule-5 = Toutes les phrases doivent avoir le même domaine
small-batch-sentences-rule-6 = Toutes les phrases doivent avoir la même citation
