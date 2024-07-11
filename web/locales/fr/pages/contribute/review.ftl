## REVIEW

sc-review-lang-not-selected = Vous n’avez sélectionné aucune langue. Veuillez accéder à <profileLink>votre profil</profileLink> pour sélectionner des langues.
sc-review-title = Vérifier les phrases
sc-review-loading = Chargement des phrases…
sc-review-select-language = Veuillez sélectionner une langue pour vérifier les phrases.
sc-review-no-sentences = Aucune phrase à vérifier. Vous pouvez <addLink>ajouter plus de phrases</addLink>.
sc-review-form-prompt =
    .message = Les phrases vérifiées n’ont pas été envoyées, voulez-vous continuer ?
sc-review-form-usage = Faites glisser vers la droite pour approuver la phrase. Faites glisser vers la gauche pour la rejeter. Faites glisser vers le haut pour l’ignorer. <strong>N’oubliez pas d’envoyer le résultat de votre révision !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Source : { $sentenceSource }
sc-review-form-button-reject = Rejeter
sc-review-form-button-skip = Passer
sc-review-form-button-approve = Approuver
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Vous pouvez également utiliser des raccourcis clavier : { sc-review-form-button-approve-shortcut } pour approuver, { sc-review-form-button-reject-shortcut } pour rejeter, { sc-review-form-button-skip-shortcut } pour passer
sc-review-form-button-submit =
    .submitText = Terminer la vérification
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Aucune phrase vérifiée.
        [1] Une phrase vérifiée. Merci !
       *[other] { $sentences } phrases vérifiées. Merci !
    }
sc-review-form-review-failure = La vérification n’a pas pu être enregistrée. Veuillez réessayer plus tard.
sc-review-link = Révision

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Critères de révision
sc-criteria-title = Critères de révision
sc-criteria-make-sure = Assurez-vous que la phrase répond aux critères suivants :
sc-criteria-item-1 = La phrase doit être orthographiée correctement.
sc-criteria-item-2 = La phrase doit être grammaticalement correcte.
sc-criteria-item-3 = La phrase doit être prononçable.
sc-criteria-item-4 = Si la phrase répond aux critères, cliquez sur le bouton « Approuver » à droite.
sc-criteria-item-5-2 = Si la phrase ne répond pas aux critères ci-dessus, cliquez sur le bouton « Rejeter » à gauche. Si vous avez un doute, vous pouvez également la sauter et passer à la suivante.
sc-criteria-item-6 = Si vous n’avez plus de phrases à vérifier, aidez-nous à collecter davantage de phrases !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Vérifiez <icon></icon> que la phrase est correcte sur le plan linguistique
sc-review-rules-title = La phrase est-elle conforme aux consignes ?
sc-review-empty-state = Il n’y a actuellement aucune phrase à vérifier dans cette langue.
report-sc-different-language = Autre langue
report-sc-different-language-detail = La phrase est écrite dans une langue différente de celle que je relis.
sentences-fetch-error = Une erreur est survenue lors de la récupération des phrases
review-error = Une erreur s’est produite lors de la revue de cette phrase
review-error-rate-limit-exceeded = Vous allez trop vite. Veuillez prendre quelques instants pour relire la phrase et vous assurer qu’elle est correcte.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Nous effectuons d’importants changements
sc-redirect-page-subtitle-1 = Le collecteur de phrases est déplacé vers la plateforme Common Voice. Vous pouvez désormais <writeURL>écrire</writeURL> une phrase ou <reviewURL>vérifier</reviewURL> des phrases depuis Common Voice.
sc-redirect-page-subtitle-2 = Posez-nous vos questions sur <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ou <emailLink>par e-mail</emailLink>.
