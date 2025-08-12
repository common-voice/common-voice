## REVIEW

sc-review-lang-not-selected =
    wǝ ɓan zaa ma ki ko voŋno ah .Wǝ dan pu
     <profileLink>fan mai mu jurmo</profileLink> .mor ka ɓan zahra
sc-review-title = mgbei mur ɓu faara
sc-review-loading = teitel ɓu fah
sc-review-select-language =
    wǝ gak ka ɓan zah ma kiya mur ka gbei
     mur ɓu faa ah ra
sc-review-no-sentences =
    ɓu fah mai ka gbei mura keka ko buŋno
    <addLink>wi ɓedda ɓu fah ma ki fara</addLink> .
sc-review-form-prompt =
    .message = ɓu fah mai mu ne mgbei mor lua pii ko vuŋno ya wǝ ya ka cii gah pel ne none ?
sc-review-form-usage = mo kook ne jol ke sah mor ka iŋ ɓu faa ah ye .Mo kook ne jol ke leɓyei mor ka ɓu gelahle .Mo kook ne ke siŋ mur ka kan cii ya ka .<strong>wǝ yantel pii fan mai wǝ lua ne cok yeb ɓi ka !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = puu giŋ : { $sentenceSource }
sc-review-form-button-reject = ɓuu ge lahle
sc-review-form-button-skip = zalni
sc-review-form-button-approve = zii ɓu ah ye
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = o
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = A
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = z
sc-review-form-keyboard-usage-custom =
    wǝ gak no ka ɓan fah ma guari cok ngal
     fane:{ sc-review-form-button-approve-shortcut }.  ka ziini,{ sc-review-form-button-reject-shortcut }. ka ɓuuni { sc-review-form-button-skip-shortcut } kah zalni
sc-review-form-button-submit =
    .submitText = ezah gbei murahye
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] gbei mur ɓu fahya ko buŋno
        [one] ɓu fah buŋno mai mu gbei murɓe
       *[other] { $sentences }ɓu fah mai mu gbei murɓe . soko
    }
sc-review-form-review-failure = mgei mur ɓu ah luaa gbo ke tetel yah
sc-review-link = jiŋ ǝǝfane

## REVIEW CRITERIA

sc-criteria-modal = faali ka ǝǝfane
sc-criteria-title = faali siil mur mgbei ɓu
sc-criteria-make-sure = wǝ te riak riak ɓu faa ah a cii te faali mai no
sc-criteria-item-1 = ɓu faa ah mu yah nen ka ɗii ke zah pu sah ye
sc-criteria-item-2 = ɓu faa ah mu yah ko te wuu pu sahye
sc-criteria-item-3 = ɓu faa ah mu yah nen ka ɗii ke zah pu sah ye
sc-criteria-item-4 =
    "ne cok ɓu faa ah mu cii te faa ah ɓe mo 
    ngal pu«zii ni»ne jol ke sãã"
sc-criteria-item-5-2 = ne con ɓu faa ah mu cii te fah mai ya ɓe mo ngal te«ɓu ge lahle»ne jol ke leɓei .Wǝ se cel pu ziil ɓe wǝ gak ka juuni
sc-criteria-item-6 = wǝ ka ne ɓu fah ka mgei mur ah yao ɓe  ,wǝ gbah jol ɓuu ka tee ɓu fah ma kii ah ra gah pǝlle
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = wǝ mgbei<icon></icon>ɓu faa ah a jan pu ɓu faa sah
sc-review-rules-title = ɓu faa ah ɓyaŋ ki ne fii ah ra ɓe ne ?
sc-review-empty-state =
    ɓu faa ki ka ko vuŋ no ka mgbei mur ah pu 
    zaa mai ya
report-sc-different-language = zaa ma ki cam
report-sc-different-language-detail =
    ɓu faa ah wuu ne zah ki cam ne mai mi 
    ten mur kii ah faɗa
sentences-fetch-error =
    fan ma ɓia ah puu su ne cok ɓan 
    ɓu faa ah ye
review-error =
    fan ma ɓia ah puu su ne cok mai mi jin gi
     te ɓu faa ah fara
review-error-rate-limit-exceeded = wǝ hyee puli .wǝ ɓan cok ka jiŋ kii ɓu faa ah faɗa ka wii te riak riak wuu pu sah ɓe
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ru kun fan ma tǝsǝp
sc-redirect-page-subtitle-1 = fan tei ɓu faa tǝrgi pu kul yeɓe Common Voice. wǝ gak cum ki<writeURL>wiini</writeURL> ɓu faa <reviewURL>mgbei mur</reviewURL> ɓu faa soo Common Voice.
sc-redirect-page-subtitle-2 = wǝ fi fii zah ɓuu ru <matrixLink>Matrix</matrixLink>, <discourseLink>ɓuu fah zah kal pele</discourseLink> wala <emailLink>pu cok mai deb mu pii ɓu fah gah nyi deb kii gŋ </emailLink>.
# menu item
review-sentences = mgbei mur ɓu faa ah ra
