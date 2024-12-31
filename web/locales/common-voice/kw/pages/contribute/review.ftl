## REVIEW

sc-review-lang-not-selected = Ny dhewissowgh yethow. Kewgh dh’agas <profileLink>Profil</profileLink>, mar pleg, rag dewis yethow.
sc-review-title = Dasweles Lavarow
sc-review-loading = Owth ughkarga lavarow…
sc-review-select-language = Dewisewgh yeth mar pleg rag dasweles lavarow.
sc-review-no-sentences = Nyns eus lavarow rag daswel. <addLink>Keworrewgh lavarow lemmyn!</addLink>
sc-review-form-prompt =
    .message = Ny veu danvenys lavarow daswelys. Owgh hwi sur?
sc-review-form-usage = Skubyewgh a-dhyghow rag komendya an lavar. Skubyewgh a-gledh rag y dhenagha. Skubyewgh war-vann rag y hepkor. <strong>Na ankevewgh danvon agas daswel!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Pennfenten: { $sentenceSource }
sc-review-form-button-reject = Denagha
sc-review-form-button-skip = Hepkor
sc-review-form-button-approve = Komendya
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = H
sc-review-form-keyboard-usage-custom = Hwi a yll devnydhya skochfordhow bysowek ynwedh: { sc-review-form-button-approve-shortcut } rag Komendya, { sc-review-form-button-reject-shortcut } rag Denagha, { sc-review-form-button-skip-shortcut } rag Hepkor
sc-review-form-button-submit =
    .submitText = Gorfenna Daswel
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Nyns eus lavarow daswelys.
        [zero] Nyns eus lavarow daswelys.
        [one] 1 lavar daswelys. Meur ras!
        [two] { $sentences } lavar daswelys. Meur ras!
        [few] { $sentences } lavar daswelys. Meur ras!
        [many] { $sentences } lavar daswelys. Meur ras!
       *[other] { $sentences } lavar daswelys. Meur ras!
    }
sc-review-form-review-failure = Ny allas an dhaswel bos gwithys. Assayewgh arta diwettha mar pleg.
sc-review-link = Dasweles

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Breusverkyow Daswel
sc-criteria-title = Breusverkyow Daswel
sc-criteria-make-sure = Surhewgh yth hedh an lavar an breusverkyow a syw:
sc-criteria-item-1 = Res yw bos an lavar lytherennys yn kewar.
sc-criteria-item-2 = Res yw bos kewar gramasek an lavar.
sc-criteria-item-3 = Res yw bos an lavar kewsadow.
sc-criteria-item-4 = Mar hedh an lavar an breusverkyow, klickyewgh an boton "Komendya" a-barth dyghow.
sc-criteria-item-5-2 = Mar ny hedh an lavar an breusverkyow, klickyewgh an boton "Denagha" a-barth kledh. Mar nyns owgh sur a-dro dhe’n lavar, hwi a yll y hepkor ynwedh ha mos dhe’n nessa huni.
sc-criteria-item-6 = Mar kevowgh bos difygyes an lavarow rag daswel, gweresewgh ni dhe guntel moy a lavarow!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Checkyewgh <icon></icon> yw hemma lavar kewar yn yethel?
sc-review-rules-title = A hedh an lavar an breusverkyow?
sc-review-empty-state = A-lemmyn nyns eus lavarow rag daswel y’n yeth ma.
report-sc-different-language = Yeth dhyffrans
report-sc-different-language-detail = Skrifys yw yn yeth yw dyffrans dhe’n huni a dhaswelav.
sentences-fetch-error = Gwall a hwarva ha lavarow ow pos kerghys.
review-error = Gwall a hwarva ha’n lavar ma ow pos daswelys.
review-error-rate-limit-exceeded = Re uskis yth ewgh yn-rag. Powesewgh pols mar pleg rag dasweles an lavar ha surhe y vos kewar.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Yth eson ow kul nebes chanjyow bras.
sc-redirect-page-subtitle-1 = Yma’n Kunteller Lavarow ow remova dhe blatform kresel Common Voice. Lemmyn hwi a yll <writeURL>skrifa</writeURL> lavar po <reviewURL>dasweles</reviewURL> profyansow a unn lavar yn Common Voice.
sc-redirect-page-subtitle-2 = Govynnewgh orthyn yn <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> po <emailLink>ebost</emailLink>.
