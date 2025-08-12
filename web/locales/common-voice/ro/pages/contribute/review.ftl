## REVIEW

sc-review-title = Verifică propozițiile
sc-review-select-language = Alege o limbă pentru a verifica propozițiile.
sc-review-no-sentences = Nicio propoziție de verificat. <addLink>Adaugă mai multe propoziții acum.</addLink>
sc-review-form-prompt =
    .message = Propozițiile verificate nu au fost trimise? Chiar așa?
sc-review-form-usage = Glisează spre dreapta pentru a aproba propoziția. Glisează spre stânga pentru a o respinge. Glisează în sus pentru a sări peste ea. <strong>Nu uita să trimiți și justificările tale!</strong>
sc-review-form-button-skip = Sari peste
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
sc-criteria-item-5-2 = Dacă propoziția nu îndeplinește criteriile de mai sus, apasă pe butonul &quot;Respinge&quot; din stânga. Dacă ai dubii legate de propoziție, o poți sări și poți trece la următoarea.
sc-criteria-item-6 = Dacă termini de verificat toate propozițiile, te rugăm să ne ajuți să adunăm mai multe!
sc-review-empty-state = Deocamdată nu există propoziții de verificat în această limbă.
report-sc-different-language-detail = Propoziția este scrisă într-o limbă diferită față de cea pe care o verific.
review-error = A apărut o eroare în timpul verificării acestei propoziții
review-error-rate-limit-exceeded = Avansezi prea repede. Verifică propoziția cu mai multă atenție ca să te asiguri că este corectă.
# menu item
review-sentences = Examinează propozițiile
