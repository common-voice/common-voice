## REVIEW

sc-review-lang-not-selected = kazamabá kwatar fətekilek.  numoro kazləɓamal <profileLink> mindze gukəle</profileLink> ta kazamaba kwatar kəsa.
sc-review-title = cəkem kwatar aŋa
sc-review-loading = mapəlavara kwatar aŋa
sc-review-select-language = zamaba kwatar kəsa fətek ta kecəkem kwatar aŋa
sc-review-no-sentences = kwa kwatar fətek ene ya micəkwe da. Kembem<addLink> mafarakala vvaɗ ga kwatar </addLink>
sc-review-form-prompt =
    .message = kwatar micəkwé aŋa tene mopoloro aŋa da, koŋgovom ana kunomoro akama yaw?
sc-review-form-usage = bamara aka ahal ga ele ta kakasəkaba kwatar. Bamara aka ahal gedzer ta kambəram. Bamara a vəla ta kefemala ŋgar da. <strong>midzekakwəle ya moploro da </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = aslam aŋa : { $sentenceSource }
sc-review-form-button-reject = mbəram
sc-review-form-button-skip = bamkala
sc-review-form-button-approve = kəsamkaba
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Vous pouvez également utiliser des raccourcis clavier : { sc-review-form-button-approve-shortcut } pour approuver, { sc-review-form-button-reject-shortcut } pour rejeter, { sc-review-form-button-skip-shortcut } pour passer
sc-review-form-button-submit =
    .submitText = ndavamara micəkwe aŋa
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] [ene da] kwa kwatar fətek ene da.
        [one] [fətek] Kwatar fətek micəkwé aŋa. Use gukwa!
       *[other] kwatar micəkwé aŋa. Use gukwa!
    }
sc-review-form-review-failure = micəkwe aŋa azaɗavá tam. Kwamənam vvaɗ
sc-review-link = micəkwe aŋa vvaɗ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ makəsakaba aŋa ga micəkwe aŋa
sc-criteria-title = makəsakaba aŋa ga micəkwe aŋa
sc-criteria-make-sure = səlam ana kwtar aŋa urovavara henne:
sc-criteria-item-1 = kwatar aŋa miné mapakalavara aŋa lele kaɗa
sc-criteria-item-2 = kwatar miné lele kaɗa
sc-criteria-item-3 = kwatar aŋa mambaɗava lele kaɗa
sc-criteria-item-4 = Tandzaba kwatar aŋa urovavara ma, ɓəlamkal « makəsakaba» aka ahal ge ele
sc-criteria-item-5-2 = Tandzaba kwatar urovavara a murovavara ya vəla henne ma, ɓəlamkal aka«mambəra» aka ahal gedzer. Tandzaba guɓar akazam kwəle ma, bamkala, numoro aka kwatar ana iŋefiŋere.
sc-criteria-item-6 = Tandzaba kenemara kwatar ya micəkwe da ma, zlakam nile ya matakalavara kwatar vvaɗ!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = cəkem <icon></icon> ana kwatar aŋa eke lele eve mapakalavava aŋa
sc-review-rules-title = kwatar aŋa urofaŋ afa miɗekabara aŋa yaw?
sc-review-empty-state = kwatar fətek ene ya  micəkwe eve kwatar kəsa henne naka da
report-sc-different-language = kwatar kəsa enne
report-sc-different-language-detail = kwatar aŋa apakalavá ara kwatar kəsa ana andza gəra gəra ara kwatar ane nakambaɗa vvaɗ.
sentences-fetch-error = eɗe ana arawa da adavara afalaŋa ana takahaba kwatar aŋa
review-error = eɗe ana arawa da adavara afalaŋa ya micəkwe kwatar aŋa vvaɗ
review-error-rate-limit-exceeded = kunomoro piŋ piŋ. Zama sarta kiye ta kambaɗam vvaɗ gata kasəlam ana kwatar aŋa eke lele
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = nakambəɗamkaba azlam dik lele haŋ
sc-redirect-page-subtitle-1 = mbəre maɗəbaba kwatar aŋa aslabá, udoro adav ga  awazlaha cii. Kembem mahəzlaraŋa<writeURL>mapakala</writeURL>kwatar fətek<reviewURL>micəkwe</reviewURL>kwatar epefeŋevire afa awazlaha cii
sc-redirect-page-subtitle-2 = demeŋfinile aka<matrixLink> Ammaŋ aŋa</matrixLink>, <discourseLink>mʉde aŋa</discourseLink>bi <emailLink> eve shek ava aŋa</emailLink>
