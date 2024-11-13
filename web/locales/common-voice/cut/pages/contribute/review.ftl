## REVIEW

sc-review-lang-not-selected = Abte tndanude ama dbaku. Kue'de <profileLink> namna yi’i koo </profileLink> tndanude ama o ubbi dbaku.
sc-review-title = Kuinbekuended ndodo
sc-review-loading = Iynundee ndodo naa koo
sc-review-select-language = Tndanud ama ndodo dbaku kuinone nbekuendede de’e a’a
sc-review-no-sentences = Abte ndodo se nbekuendede. ¡ <addLink> Fndodnekad ndodo </addLink> !
sc-review-form-prompt =
    .message = Nwe cho’o s nindedeme, ¿kuaku?
sc-review-form-usage = Kuinngo ndade naakuaku ndetes a ndebe ndodo. Kuinngo ndade naskue ndestes nwe ndebe ndodo. Kuingo ndade kuayaku mekan nwe nwefnede. <strong> ¡ Nwe kunfgnaade see nbekuendenoo ndiñuyi’ide! </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Tibchii: { $sentenceSource }
sc-review-form-button-reject = Nwe
sc-review-form-button-skip = Kayakude
sc-review-form-button-approve = A ndebe
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = T
sc-review-form-keyboard-usage-custom = Nome kugbi kamade ndi na koo { sc-review-form-button-approve-shortcut } ndetes a ndebe, { sc-review-form-button-reject-shortcut } o nwe ndebe, { sc-review-form-button-skip-shortcut } o ndetes ne kade.
sc-review-form-button-submit =
    .submitText = Kuinno nbekuendede
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Ndi ama ndodo bte nbekuendede
        [one] A nbekuended ama. ¡Yondibede!
       *[other] { $sentences } A nbekuendede tndubee. ¡Yondibede!
    }
sc-review-form-review-failure = Nwe chii fnunde mu'u na koo. Ndi a chinnu dikuitude.
sc-review-link = Nbekuendede

## REVIEW CRITERIA

sc-criteria-modal = De'es ndikchinno tase nbekuendeno
sc-criteria-title = De'es ndikchinno tase nbekuendeno
sc-criteria-make-sure = Ndoskue'e ndodone tuka ne'ese fnu mu'u:
sc-criteria-item-1 = Ne'es ndebe de'ese iydude.
sc-criteria-item-2 = Dindi dindi ndodo se fnuu mu'u
sc-criteria-item-3 = Ne’ese kugbi nde’oo ndodo se fnuu mu'u naa kó.
sc-criteria-item-4 = Ndetes a ndebe ndoskue’e ndodo se gnu mu’une, ndetad mu’u  &quot;  Cho'o &quot; nas kuaku ndetad.
sc-criteria-item-5-2 = Ndetes nwe ndebe ndodotene, ndetat nase a’a &quot; Se nwe ndebe &quot; lad kuee. Ndetes nwe dbenode kugbi kade tamkuaa.
sc-criteria-item-6 = Ndetes abtee ndoodo see nbekuendede, ¡Fgtaneednnuu sdidamanuu ndodo!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Dkueekud mu’u <icon></icon>. ¿A ndebe de’es a’a mu’u, tika iynde’e o iyduu inña?
sc-review-rules-title = ¿A ndebes ndokas a’a o ndokas se iynde’e?
sc-review-empty-state = Nmiñune a bte ndodo dbaku see nbekuendoo
report-sc-different-language = Tamma dbaku
report-sc-different-language-detail = De’se iydudene nwe iyne’te a tamma dbaku
sentences-fetch-error = Akote ii iynunna ndodo
review-error = Akote ii nbekuende ndodo
review-error-rate-limit-exceeded = Tet kanni iydide. Dka dka nbekuendede tomeme kugbi dbenode ndetes a ndebe ndodote.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Aà ibekunnuu
sc-redirect-page-subtitle-1 = Sentence Collector a iycho’o naa Common Voice. Mane akugbi <writeURL> iyduud </writeURL> ama ndodo o <reviewURL> o a kugbi nbekuendoo </reviewURL> de’e ndodo se iyndaa mu’u naa Common Voice.
sc-redirect-page-subtitle-2 = Mane tomunine mu’u chet ko <matrixLink> Matrix </matrixLink>, <discourseLink>, mu’u nase gnuu ndodoku,</discourseLink> o <emailLink> nase iycho’o kaka<emailLink> email </emailLink>.
# menu item
review-sentences = Kuinbekuended ndodo
