## REVIEW

sc-review-lang-not-selected = Manaraqmi ima shimitapis aklaqrunkichu. Ama haynuulla, kayman rii <profileLink>Perfil</profileLink> huk uutak achaka shimikunata aklanaykipaq.
sc-review-title = Rimaykunata rikaykuy
sc-review-loading = Rimaykunata apamushtin...
sc-review-select-language = Huk shimita aklay rimaykunata rikaykunaykipaq.
sc-review-no-sentences = Manañam rimaykuna rikaykunapaq kanchu. ¡<addLink>rimaykunata yapay!</addLink>
sc-review-form-prompt =
    .message = Manam rikashqakunata apachikunchu, ¿Awninki?
sc-review-form-usage = Rimayta awninaykipaq alliqman shullway. Mana awninaykipaq ichuqman shullway. Pachkanaykipaq hanayman shullway. <strong>¡rikashqaykita apachiyta ama qunqaychu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Source: { $sentenceSource }
sc-review-form-button-reject = Mana awniy
sc-review-form-button-skip = Pashkay
sc-review-form-button-approve = Awniy
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = A
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = M
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Wayralla rulanapaq tecladokunawanpis rulaykuchwanmi: { sc-review-form-button-approve-shortcut } awninapaq, { sc-review-form-button-reject-shortcut } mana awninapaq, y { sc-review-form-button-skip-shortcut } pachkanapaq
sc-review-form-button-submit =
    .submitText = Rikayta kamakaykuy
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] No sentences reviewed.
        [one] 1 sentence reviewed. Thank you!
       *[other] { $sentences } sentences reviewed. Thank you!
    }
sc-review-form-review-failure = Manam rikashqata chulayta atipanchikchu. Qipaskaman kallpanchakuy.
sc-review-link = Rikapay

## REVIEW CRITERIA

sc-criteria-modal = ⓘ Imakunata tantiyaykul rikaykunapaq
sc-criteria-title = Imakunata tantiyaykul rikaykunapaq
sc-criteria-make-sure = Kaynuumi llapa rimaykuna kanan:
sc-criteria-item-1 = Rimaykaq allin qillqashqa kananmi.
sc-criteria-item-2 = Rimaykaq allin aypuykushqa kananmi.
sc-criteria-item-3 = Rimaykaq rimaykunalla kananmi.
sc-criteria-item-4 = Rimaykaq rasunpa haynu kaptin, kaychu ñitiy &quot;Aprobar&quot; alliqman.
sc-criteria-item-5-2 = Mana kamachishqanuuchu rimaykaq kaptinqa, kaychu ñitiy &quot;Rechazar&quot; ichuqman. Mana yachalqa, pachakay haypiqta hukkaq kaqman riy.
sc-criteria-item-6 = Manaña rimaykuna rikanapaq kaptinqa, ¡rimaykunata huntuyta yanapakuy!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Rachkay <icon></icon> ¿allin rimashqanu allinchu kay rimaykaq?
sc-review-rules-title = ¿Nishqan kamachishqanuuchum?
sc-review-empty-state = Manam kay shimikaqchu rikaykunapaq rimaykuna kanchu.
report-sc-different-language = Huk shimi
report-sc-different-language-detail = Rikahqaapiqta huknilaq shimichuumi qillqahqa kaykan.
sentences-fetch-error = Rimaykunata ashiyalmi pantaqrun.
review-error = Huk pantaymi yuriqmun kay rimaykunata rikapayal.
review-error-rate-limit-exceeded = Llumpay wayram riyanchik. Hamaykuy rimaykunata rikaykunaykipaq rasunpa allinlla kananpaq.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Hatun tiklaykunata rurayanchik
sc-redirect-page-subtitle-1 = Sentence Collectormi Common Voicepa allinnin plataformanman riyan. Kanan atipanki  <writeURL>escribir</writeURL> huk rimayta <reviewURL>revisar</reviewURL> Common Voiceman hukhuklla rimaykunata apachiyta.
sc-redirect-page-subtitle-2 = Kaychu tapukushun <matrixrink>Matrix</matrixrink>, <discourserink>Discourse</discourserink> o <emaillink>email</emaillink>.
# menu item
review-sentences = Rimaykunata rikaykuy
