## REVIEW

sc-review-lang-not-selected = Nu ai ales nicio limbă. Te rugăm să-ți accesezi <profileLink>Profilul</profileLink> pentru a alege limbile cu care vei lucra.
sc-review-title = Verifică propoziții
sc-review-loading = Se încarcă propozițiile…
sc-review-select-language = Alege o limbă pentru a verifica propozițiile.
sc-review-no-sentences = Nicio propoziție de verificat. <addLink>Adaugă mai multe propoziții acum.</addLink>
sc-review-form-prompt =
    .message = Propozițiile verificate nu au fost trimise? Chiar așa?
sc-review-form-usage = Glisează spre dreapta pentru a aproba propoziția. Glisează spre stânga pentru a o respinge. Glisează în sus pentru a sări peste ea. <strong>Nu uita să trimiți și justificările tale!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Sursă: { $sentenceSource }
sc-review-form-button-reject = Respinge
sc-review-form-button-skip = Sari peste
sc-review-form-button-approve = Aprobă
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Poți utiliza și comenzile rapide din tastatură: { sc-review-form-button-approve-shortcut } pentru a Aproba, { sc-review-form-button-reject-shortcut } Respinge, { sc-review-form-button-skip-shortcut } sau Sări peste o înregistrare.
sc-review-form-button-submit =
    .submitText = Termină verificarea
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nicio propoziție verificată.
        [one] 1 propoziție verificată. Îți mulțumim!
        [few] { $sentences } propoziții verificate. Îți mulțumim!
       *[other] { $sentences } de propoziții verificate. Îți mulțumim!
    }
sc-review-form-review-failure = Verificarea nu a putut fi salvată. Te rugăm să încerci din nou mai târziu.
sc-review-link = Verificare

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Criterii de verificare
sc-criteria-title = Criterii de verificare
sc-criteria-make-sure = Asigură-te că propoziția îndeplinește următoarele criterii:
sc-criteria-item-1 = - este scrisă corect;
sc-criteria-item-2 = - este corectă și din punct de vedere gramatical;
sc-criteria-item-3 = - este ușor de pronunțat.
sc-criteria-item-4 = Dacă propoziția îndeplinește aceste criterii, apasă pe butonul „Aprobă” din dreapta.
sc-criteria-item-5-2 = Dacă propoziția nu îndeplinește criteriile de mai sus, apasă pe butonul &quot;Respinge&quot; din stânga. Dacă ai dubii legate de propoziție, o poți sări și poți trece la următoarea.
sc-criteria-item-6 = Dacă termini de verificat toate propozițiile, te rugăm să ne ajuți să adunăm mai multe!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Verifică  <icon></icon> dacă propoziția aceasta este corectă din punct de vedere lingvistic.
sc-review-rules-title = Respectă propoziția îndrumările proiectului?
sc-review-empty-state = Deocamdată nu există propoziții de verificat în această limbă.
report-sc-different-language = Limbă diferită
report-sc-different-language-detail = Propoziția este scrisă într-o limbă diferită față de cea pe care o verific.
sentences-fetch-error = A apărut o eroare în timpul preluării propozițiilor
review-error = A apărut o eroare în timpul verificării acestei propoziții
review-error-rate-limit-exceeded = Avansezi prea repede. Verifică propoziția cu mai multă atenție ca să te asiguri că este corectă.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Iată ultima schimbare majoră:
sc-redirect-page-subtitle-1 = Colecția de propoziții se mută pe platforma principală Common Voice. Acum poți <writeURL>scrie</writeURL> sau <reviewURL>verifica</reviewURL> propoziții pentru proiectul Common Voice.
sc-redirect-page-subtitle-2 = Întreabă-ne mai multe pe platformele <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink>, sau prin <emailLink>email</emailLink>.
# menu item
review-sentences = Verifică propoziții
