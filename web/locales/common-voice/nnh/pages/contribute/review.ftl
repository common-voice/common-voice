## REVIEW

sc-review-lang-not-selected = Pi kaa káŋa tsɔ́ shwóŋe láʼ wɔ́. Tsetsɔ́ʼ pi gʉ́a na  <profileLink>mmo gie me gyá  ndwo ndiŋ ngie aa gu</profileLink>  páʼ pi ge káŋ meshwóŋe meláʼ
sc-review-title = Pi tsáʼa me phrase ngyá
sc-review-loading = Meshʉ́ŋ ne ngÿo páʼ mephrase  ge kẅɛ...
sc-review-select-language = Tsetsɔ́ʼ pi káŋa taʼa shwóŋe láʼ páʼ pi ge tsáʼa phrase e lie.
sc-review-no-sentences = Atsɔ́ phrase gie me ge tsaʼ á te gwɔ́ wɔ. Ngwɔ́ pi  <addLink>kẅiʼi nzẅiŋ mephrase</addLink>.
sc-review-form-prompt =
    .message = Mephrases mie me tsǎʼ, me kaa túm tà e gʉa wɔ. Tà pi ne nkwoŋo lelɔg ngee mvfo?
sc-review-form-usage = Pi gÿo mmo lɔg ye gwoŋo pwo kibɛ leɔg nkwaʼ nzẅiŋe phrase. Pi gÿo mmo lɔg ye gwoŋo pwo tʉ  leɔg  ndʉʼ .Pi gÿo mmo lɔg ye kwóŋ leɔg ḿmóŋe. <strong>Tà pi lege letumo mmó gie pi giŋ mbiŋe na mmó gie pi ne ngyá ńgẅiin !</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Jʉʼ gie á ka fó wó : { $sentenceSource }
sc-review-form-button-reject = Me gwaʼá
sc-review-form-button-skip = Á cʉ̌a
sc-review-form-button-approve = Me zẅǐŋ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = O
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Ngwɔ́ pi giŋ ndɔgɔ nzsemvɔgɔ gie ee na membaŋ lɔg ncwóte mmó : { sc-review-form-button-approve-shortcut } lelɔg nzẅíŋ, { sc-review-form-button-reject-shortcut }Lelɔg ndʉ́ʼ { sc-review-form-button-skip-shortcut } lelɔg ńcʉa ngʉ́a.
sc-review-form-button-submit =
    .submitText = Pi mege ntsáʼ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Atsɔ́ phrase gie me tsǎʼ a te wo wɔ́
        [one] Tàʼ phrase gie me tsǎʼ. Ndǎg !
       *[other] phrase gie me tsǎʼ ndi. Ndǎg !
    }
sc-review-form-review-failure = Mmó gie me tsǎʼ, mashʉ́ŋ a kaa leʼe. Pi lɔɔn mbiŋ pi giŋ efʉʼte.
sc-review-link = Legiŋ mbiŋe na mmó gie me zɔ̌ɔn ngyá

## REVIEW CRITERIA

sc-criteria-modal = Metwo meno mie me ge lie tá lɔg piŋe na mmó gie me zɔ̌ɔn ngyá
sc-criteria-title = Metwo meno mie me ge lie tá lɔg piŋe na mmó gie me zɔ̌ɔn ngyá
sc-criteria-make-sure = Pi vɔg faʼ tà ngyá ngie phrase aa páʼ metwo meno mie mɔɔn tsiŋe ssé:
sc-criteria-item-1 = Á zɛte me ŋweʼe phrase na páʼ me la ye me záʼte mendu púʼu
sc-criteria-item-2 = Á zɛte me ŋweʼe phrase na páʼmbʉ̌ shwóŋe ne nzɛté
sc-criteria-item-3 = Á zɛte me ŋweʼe phrase na páʼ me ge gɔɔn ngye kẅɛ
sc-criteria-item-4 = Phrase lɔɔn ngwɔ́ páʼ metwo meno mie me ne nzáb ne nzɛte, pi nɔʼɔ mbaŋ lɔg «Nzẅíŋ» gie ee na gwoŋo pwo tʉ.
sc-criteria-item-5-2 = Phrase lɔɔn te ngwɔ́ páʼ metwo meno mie me ne nzáb mie ee tsiŋe ssé ne nzɛte wɔ́, pi nɔʼɔ mbaŋ lɔg «Ntsó ngwáʼ» gie ee na gwoŋo pwo kyɛbɛ. Pi lɔɔn ne mʉʼte, mba à lɔɔn ngwɔ́ pi zyɛ́ʼ, ńcʉa ngʉa le na mvfo.
sc-criteria-item-6 = Pi lɔɔn te gẅiin phrase gie pi gee ntsáʼa wɔ, pi kẅete weg lekẅiʼi ńgẅiin me phrase!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Pi tsáʼ <icon></icon> ngie phrase aa paʼ sekud lɔg ŋweʼe me shwóŋ la zíʼi púʼu.
sc-review-rules-title = Phrase aa paʼɔɔn ngwɔ́ páʼ me ne ngie a gwɔ?
sc-review-empty-state = Atsɔ́ phrase gie me ge tsaʼ á te wo na yɔɔn shwoŋe láʼ  a na fʉʼɔɔn wɔ.
report-sc-different-language = Tsɔ́ shwóŋe láʼ
report-sc-different-language-detail = Me la ŋweʼe phrase na tsɔ́ shwoŋe gie á te gie meŋ  tóŋo wɔ.
sentences-fetch-error = Me ne faʼa shÿo legiŋ ngẅiin phrase atsɔ́ lɔ́ʼ kẅɛ
review-error = Me ne ngiŋe ndie phrase, atsɔ́ lɔ́ʼ  kẅɛ
review-error-rate-limit-exceeded = Pi ne giŋe letʉ tɛʼ. Tsetsɔ́ʼ pi náʼa ndɔg ndɔɔn ndɔɔn, ńgiŋ ńtóŋo phrase tà ngyá ngie aa mboŋ.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Peg ne gÿo legwɔ́ gie eshúm kube mmó tɛʼ
sc-redirect-page-subtitle-1 = Ammó gie me phrase cuʼte ngee tsó a gʉa le na jʉʼ gie shúm Common Voice cuʼte mbúmo wó. Afʉʼɔɔn la, ngwɔ́ pi <writeURL>ŋweʼe</writeURL> taʼ phrase <reviewURL>ntsáʼ</reviewURL> mephrase mie ee tsɛ Common Voice.
sc-redirect-page-subtitle-2 = Pi zɛte meno na <matrixLink>Matelik</matrixLink>, <discourseLink>Discourse</discourseLink> kà <emailLink>ntúmo na e-mail</emailLink>.
