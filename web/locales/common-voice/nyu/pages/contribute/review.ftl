## REVIEW

sc-review-lang-not-selected = Imwe mukanati kusankhula cilewedwe. Ndokoni uku <profileLink>Dzina</profileLink> kuti musankhule bzilewedwe.
sc-review-title = Kubwerezera mifolo-fala
sc-review-loading = Kubulusa mifolo-fala
sc-review-select-language = Sankhulani cilewedwe  cibodzi kuti mubwerezere mifolo-fala.
sc-review-no-sentences = Palibe nfolo-fala wakubwerezera. <addLink>Ikhani pomwe mifolo-fala inango tsapano!</addLink>
sc-review-form-prompt =
    .message = Mifolo-fala yomwe yamala kubwerezeriwa irbe kutumiziwa, muna cadidi ?
sc-review-form-usage = Fambisani kumbali ya madidi kuti mubvumize miflo-fala. Fambisani kumbali ya madzere kuti mulambe. Fambisani kumbali ya kudzawulu kuti mumoge. <strong>Lekani kuyebwa kutumiza nyabwerezera wanu!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = Kwakubukira: { $sentenceSource }
sc-review-form-button-reject = Kulamba
sc-review-form-button-skip = Kumoga
sc-review-form-button-approve = Kubvumiza
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = S
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = P
sc-review-form-keyboard-usage-custom = Imwe mungaphatise basa athandizi wa matobo ya nchini wa ndzeru: { sc-review-form-button-approve-shortcut } kuti mubvumize, { sc-review-form-button-reject-shortcut } kuti mulambe, { sc-review-form-button-skip-shortcut } kuti mumoge
sc-review-form-button-submit =
    .submitText = Kumaliza kubwerezera
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] Palibe folo-fala yomwe udabwerezeriwa.
        [one] 1 folo-fala wa bwerezeriwa. Ndatenda!
       *[other] { $sentences } mifolo-fala ya bwerezeriwa. Ndatenda!
    }
sc-review-form-review-failure = Kubwerezeriwa kungalekiwe kukoyiwa. Yezereni pomwe nthawe inango.
sc-review-link = Bwerezera

## REVIEW CRITERIA

sc-criteria-modal = Masankhulidwe ya kubwerezera
sc-criteria-title = Masankhulidwe ya kubwerezera
sc-criteria-make-sure = Phatisani kuti nfolo-fala una misankhulo iyi:
sc-criteria-item-1 = Nfolo-fola unembiwe mwa bwinobwino.
sc-criteria-item-2 = Nfolo-fala utoweze mwa bwinobwino ntemo wa cilewedwe.
sc-criteria-item-3 = Ukwanisiwe kuwerengiwa nfolo-falawo.
sc-criteria-item-4 = Pangakhaka kuti nfolo-fala ukutoweza masankhuliro awa, tinya pa butawu &quot;Kubvumiza&quot; ku madidi.
sc-criteria-item-5-2 = Pangakhaka kuti nfolo-fala ukutoweza masankhuliro awa, tinya pa butawu &quot;Kulamba&quot; ku madzere. Ngakhala mukudziwa lini bwinobwino kwa  nfolo-falawo, imwe mungamoge kuyenda kunfolo-fala anango.
sc-criteria-item-6 = Imwe mungasaya mifolo-fala kuti mubwerezere, tithandizeni kuyikha mifolo-fala inango!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Mwawona<icon></icon> ngati nfolo-falawo wanembiwa mwa bwinobwino?
sc-review-rules-title = Nfolo-fala ukutoweza masankhuliro?
sc-review-empty-state = Mpaka pano, neye, palibe nfolo-fala yomwe unfunika kuti ubwerezeriwe pacilewedwe ici.
report-sc-different-language = Cilewedwe cinango
report-sc-different-language-detail = Idanembiwa na cilewedwe cinango cakusiyana na cilewedwe comwe ndikubwerezera.
sentences-fetch-error = Pakuwoneka kuphonyeka pakusaka mifolo-fala
review-error = Pakuwoneka kuphonyeka pakubwerezera mifolo-fala
review-error-rate-limit-exceeded = Imwe mukuyenda mwakuthamanga kwenekwene. Sakani na cheru kuti mubwerezere mwa bwinobwino mwakusaya kuthamanga.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = Tikucinja bzinthu bzikulu
sc-redirect-page-subtitle-1 = Nyakulokota ayayi nyakusaka miflo-fala alikubwera kupalataforoma ya kuyamba ya  Common Voice. Tsapano imwe munga <writeURL>kunebma</writeURL> nfolo-fala ubodzi ayayi<reviewURL>kubwerezera</reviewURL> kutumiza kwa nfolo-fala ubodzi kwa Common Voice.
sc-redirect-page-subtitle-2 = Ticiteni mibvundzo mu <matrixLink>Matirijhi</matrixLink>, <discourseLink>mafala</discourseLink></discourseLink> ayayi <emailLink>email</emailLink>.
# menu item
review-sentences = Kubwerezera mifolo-fala
