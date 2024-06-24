## REVIEW

sc-review-lang-not-selected = No heu seleccionat cap llengua. Aneu al vostre <profileLink>Perfil</profileLink> per a triar alguna llengua.
sc-review-title = Revisa les frases
sc-review-loading = S'estan carregant les frases…
sc-review-select-language = Trieu una llengua per a revisar-ne les frases.
sc-review-no-sentences = No hi ha cap frase per revisar. <addLink>Afegiu més frases ara!</addLink>
sc-review-form-prompt =
    .message = No s'han enviat les frases revisades, n'esteu segur?
sc-review-form-usage = Llisqueu cap a la dreta per a aprovar la frase. Llisqueu cap a l'esquerra per a rebutjar-la. Llisqueu cap amunt per a ometre-la. <strong>No oblideu de trametre la revisió!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Font:  { $sentenceSource }
sc-review-form-button-reject = Rebutja
sc-review-form-button-skip = Omet
sc-review-form-button-approve = Aprova
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = O
sc-review-form-keyboard-usage-custom = També podeu utilitzar les dreceres de teclat: { sc-review-form-button-approve-shortcut } per a aprovar, { sc-review-form-button-reject-shortcut } per a rebutjar, { sc-review-form-button-skip-shortcut } per a ometre
sc-review-form-button-submit =
    .submitText = Acaba la revisió
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] No heu revisat cap frase.
        [one] Heu revisat una frase. Gràcies!
       *[other] Heu revisat { $sentences } frases. Gràcies!
    }
sc-review-form-review-failure = No s'ha pogut desar la revisió. Torneu-ho a provar més tard.
sc-review-link = Revisa

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Criteris de revisió
sc-criteria-title = Criteris de revisió
sc-criteria-make-sure = Assegureu-vos que la frase compleix els criteris següents:
sc-criteria-item-1 = La frase és escrita correctament, sense faltes d'ortografia.
sc-criteria-item-2 = La frase és gramaticalment correcta.
sc-criteria-item-3 = La frase és pronunciable.
sc-criteria-item-4 = Si la frase compleix els criteris, feu clic en el botó «Aprova».
sc-criteria-item-5-2 = Si la frase no compleix els criteris anteriors, feu clic en el botó «Rebutja». Si no n'esteu segur, també podeu saltar-la i passar a la següent.
sc-criteria-item-6 = Si us quedeu sense frases per revisar, ajudeu-nos a recollir-ne més!

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Comproveu <icon></icon> Aquesta frase és lingüísticament correcta?
sc-review-rules-title = La frase compleix les directrius?
sc-review-empty-state = Actualment no hi cap frase per revisar en aquesta llengua.
report-sc-different-language = Una altra llengua
report-sc-different-language-detail = Està escrita en una llengua diferent de la que reviso.
sentences-fetch-error = S'ha produït un error en obtenir les frases
review-error = S'ha produït un error en revisar aquesta frase
review-error-rate-limit-exceeded = Aneu massa ràpid. Dediqueu un moment a revisar la frase per assegurar-vos que és correcta.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Estem fent alguns canvis importants
sc-redirect-page-subtitle-1 = El Sentence Collector es trasllada a la plataforma bàsica de Common Voice. Ara podeu <writeURL>escriure</writeURL> una frase o <reviewURL>revisar</reviewURL> enviaments d'una sola frase a Common Voice.
sc-redirect-page-subtitle-2 = Feu-nos preguntes a <matrixLink>Matrix</matrixLink>, <discourseLink>Discurs</discourseLink> o per <emailLink>correu electrònic</emailLink>.

