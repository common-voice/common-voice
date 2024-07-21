## REVIEW

sc-review-title = Pregledaj rečenice
sc-review-loading = Učitavanje rečenica …
sc-review-select-language = Odaberi jezik za pregled rečenica.
sc-review-no-sentences = Nema rečenica za pregled. <addLink>Dodaj još rečenica sada!</addLink>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Izvor: { $sentenceSource }
sc-review-form-button-reject = Odbij
sc-review-form-button-skip = Preskoči
sc-review-form-button-approve = Odobri
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = D
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-button-submit =
    .submitText = Završi pregled
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nijedna rečenica nije pregledana.
        [one] Pregledana je jedna jedna rečenica. Hvala!
        [few] Pregledane su { $sentences } rečenice. Hvala!
       *[other] Pregledano je { $sentences } rečenica. Hvala!
    }
sc-review-form-review-failure = Pregled se nije mogao spremiti. Pokušaj kasnije ponovo.
sc-review-link = Pregledaj

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Kriteriji pregleda
sc-criteria-title = Kriteriji pregleda
sc-criteria-make-sure = Provjeri je li rečenica ispunjava sljedeće kriterije:
sc-criteria-item-1 = Rečenica mora biti točno napisana.
sc-criteria-item-2 = Rečenica mora biti gramatički točna.
sc-criteria-item-3 = Rečenica se mora može izgovoriti.
sc-review-rules-title = Je li je rečenica u skladu sa smjernicama?
sc-review-empty-state = Trenutačno nema rečenica za pregled na ovom jeziku.
report-sc-different-language = Drugi jezik
report-sc-different-language-detail = Napisana je drugačijim jezikom od onog koji pregledavam.
sentences-fetch-error = Greška prilikom dohvaćanja rečenica
review-error = Greška prilikom pregleda ove rečenice
sc-redirect-page-subtitle-2 = Pitaj nas na platformi <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ili putem <emailLink>e-pošte</emailLink>.
