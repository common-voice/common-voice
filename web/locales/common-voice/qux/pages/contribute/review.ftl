## REVIEW

sc-review-lang-not-selected = Manalaqmi ima shimitapis aklaqlunkichu. Ama haynuulla, kayman lii <profileLink>Perfil</profileLink> huk uutak achaka shimikunata aklanaykipaq.
sc-review-title = Rimaykunata Rikaykuy
sc-review-loading = Rimaykunata apamuśhtin...
sc-review-select-language = Huk shimita aklay limaykunata rikaykunaykipaq.
sc-review-no-sentences = Manañam limaykuna likaykunapaq kanchu. ¡<addLink>Limaykunata yapay</addLink>!
sc-review-form-prompt =
    .message = Manam likaśhqakunata apachikunchu, ¿Awninki?
sc-review-form-usage = Rimayta awninaykipaq alliqman śhullway. Mana awninaykipaq ichuqman śhullway. Paćhkanaykipaq hanayman śhullway. <strong>¡Likaśhqaykita apachiyta ama qunqaychu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Source: { $sentenceSource }
sc-review-form-button-reject = Mana awniy
sc-review-form-button-skip = Pachkay
sc-review-form-button-approve = Awniy
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = A
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = M
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Wayralla lulanapaq tecladokunawanpis lulaykuchwanmi: { sc-review-form-button-approve-shortcut } awninapaq, { sc-review-form-button-reject-shortcut } mana awninapaq, y { sc-review-form-button-skip-shortcut } paćhkanapaq
sc-review-form-button-submit =
    .submitText = Rikayta kamakaykuy
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Mana ima limaypiq likaśhqachu.
        [one] 1 rimay likaśhqa. ¡Yusulpaa!
       *[other] { $sentences } rikahqa rimaykuna. ¡Yusulpaa!
    }
sc-review-form-review-failure = Manam likaśhqata ćhulayta atipanchikchu. Qipaskaman kallpanchakuy.
sc-review-link = Rikapay

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Imakunata tantiyaykul likaykunapaq
sc-criteria-title = Imakunata tantiyaykul likaykunapaq
sc-criteria-make-sure = Kaynuumi llapa limaykuna kanan:
sc-criteria-item-1 = Rimaykaq allin qillqaśhqa kananmi.
sc-criteria-item-2 = Rimaykaq allin aypuykuśhqa kananmi.
sc-criteria-item-3 = Rimaykaq limaykunalla kananmi.
sc-criteria-item-4 = Rimaykaq rasunpa haynu kaptin, kayćhu ñitiy &quot;Aprobar&quot; alliqman.
sc-criteria-item-5-2 = Mana kamachiśhqanuuchu limaykaq kaptinqa, kayćhu ñitiy &quot;Rechazar&quot; ichuqman. Mana yaćhalqa, paćhakay haypiqta hukkaq kaqman liy.
sc-criteria-item-6 = manaña limaykuna likanapaq kaptinqa, ¡limaykunata huntuyta yanapakuy!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Check <icon></icon> is this a linguistically correct sentence?
sc-review-rules-title = ¿Nishqan kamachishqanuuchum?
sc-review-empty-state = Manam kay shimikaqćhu likaykunapaq limaykuna kanchu.
report-sc-different-language = Huk shimi
report-sc-different-language-detail = Likahqaapiqta huknilaq shimićhuumi qillqahqa kaykan.
sentences-fetch-error = Rimaykunata ashiyalmi pantaqlun.
review-error = Huk pantaymi yuliqmun kay limaykunata likapayal.
review-error-rate-limit-exceeded = Llumpay wayram liyanchik. Hamaykuy limaykunata likaykunaykipaq rasunpa allinlla kananpaq.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Hatun tiklaykunata lulayanchik
sc-redirect-page-subtitle-1 = Sentence Collectormi Common Voicepa allinnin plataformanman liyan. Kanan atipanki  <writeURL>escribir</writeURL> huk limayta <reviewURL>revisar</reviewURL> Common Voiceman hukhuklla limaykunata apachiyta.
sc-redirect-page-subtitle-2 = Kayćhu tapukuśhun <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> o <emailLink>email</emailLink>.
# menu item
review-sentences = Rimaykunata Rikaykuy
