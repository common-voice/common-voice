## REVIEW

sc-review-lang-not-selected = N'hoc'h eus diuzet yezh ebet. Kit d'ho pajenn <profileLink>Profil</profileLink> ha diuzit ur yezh(où) bennak
sc-review-title = Gwiriañ Frazennoù
sc-review-loading = O kargañ frazennoù…
sc-review-select-language = Dibabit ur yezh evit gallout gwiriañ frazennoù
sc-review-no-sentences = N'eus frazenn ebet da wiriañ. <addLink>Ouzhpennit re nevez ma fell deoc'h</addLink>
sc-review-form-prompt =
    .message = N'eo ket bet kaset ar frazennoù gwiriet c'hoazh. Kenderc'hel memes tra ?
sc-review-form-usage = Riklañ a-zehoù evit aprouiñ ar frazenn. Riklañ a-gleiz evit disteurel anezhi. Riklañ war-laez evit lezel anezhi a-gostez. <strong>Arabat disoñjal pouezañ war kas evit ma vo kemeret ho soñj e kont !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Mammenn: { $sentenceSource }
sc-review-form-button-reject = Nac'hañ
sc-review-form-button-skip = Mont hebiou
sc-review-form-button-approve = Aprouiñ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = K
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = H
sc-review-form-keyboard-usage-custom = Gallout a rit implijout berradennoù klavier ivez : { sc-review-form-button-approve-shortcut } evit aprouiñ, { sc-review-form-button-reject-shortcut } evit disteurel, { sc-review-form-button-skip-shortcut } evit mont hebiou
sc-review-form-button-submit =
    .submitText = Echuiñ gwiriañ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Frazenn gwiriet ebet
        [one] 1 frazenn gwiriet, trugarez deoc'h !
        [two] 2 frazenn gwiriet, trugarez deoc'h !
        [few] 3 frazenn gwiriet, trugarez deoc'h !
        [many] a frazennoù gwiriet, trugarez deoc'h !
       *[other] { $sentences } frazenn gwiriet. Trugarez deoc'h !
    }
sc-review-form-review-failure = N'eus ket bet gallet enrollañ ho labour. Klaskit en-dro diwezhatoc'h.
sc-review-link = Gwiriañ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Dezverkoù gwiriañ
sc-criteria-title = Dezverkoù gwiriañ
sc-criteria-make-sure = Bezit sur e klot ar frazenn gant an dezverkoù da-heul:
sc-criteria-item-1 = Rankout a ra ar frazenn bezañ skrivet en un doare reizh.
sc-criteria-item-2 = Rankout a ra ar frazenn bezañ reizh he yezhadur.
sc-criteria-item-3 = Rankout a ra ar frazenn bezañ distagadus.
sc-criteria-item-4 = Ma touj ar frzenn d'an dezverkoù, klikit war ar bouton &quot;Aprouiñ&quot; a-zehoù.
sc-criteria-item-5-2 = Ma ne zouj ket ar frazenn ouzh an dezverkoù a-us, klikit war ar bouton &quot;Disteurel&quot; a-gleiz. Ma n'oc'h ket asur eus ar frazenn, lezit evel-se ha kit da blediñ gant ur frazenn all.
sc-criteria-item-6 = Ma ne chom ket frazennoù da wiriañ ken, skoazellit ac'hanomp da zastum frazennoù all !
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Gwiriit <icon></icon> ha savet eo ar frazenn-mañ en un doare reizh ?
sc-review-rules-title = Ha doujañ a ra ar frazenn ouzh an erbedadennoù ?
sc-review-empty-state = N'eus frazenn ebet da wiriañ evit ar yezh-mañ evit ar mare.
report-sc-different-language = Yezh all
report-sc-different-language-detail = Skrivet eo en ur yezh all diouzh an hini a wirian.
sentences-fetch-error = C'hoarvezet ez eus ur fazi en ur adtapout ar frazennoù
review-error = C'hoarvezet ez eus ur fazi en ur wiriañ ar frazenn
review-error-rate-limit-exceeded = Re vuan ez it ganti. Tapit ur pennadig amzer evit gwiriañ mat eo reizh ar frazenn.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Emaomp o tegas kemmoù bras
sc-redirect-page-subtitle-1 = Dilec'hiet e vo an dastumer frazennoù war savenn greiz Common Voice. Gallout a rit bremañ <writeURL>skrivañ</writeURL> ur frazenn pe <reviewURL>gwiriañ</reviewURL> frazennoù unan-hag-unan war Common Voice.
sc-redirect-page-subtitle-2 = Savit goulennoù ouzhimp e <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> pe dre <emailLink>bostel</emailLink>.
# menu item
review-sentences = Gwiriañ Frazennoù
