## REVIEW

sc-review-lang-not-selected = mekweii kuti age tugul.Gaigai wiiy<profileLink>Profilit</profileLink> ak ikwey kuti
sc-review-title = Geer ngalalutik
sc-review-loading = miten koloadeni sentensishek...
sc-review-select-language = Gaigai kweei kutit neboishen asigeer sentensichoto
sc-review-no-sentences = mamiten sentensi chegirevieweni.<addLink>tesyin sentensi alak nguno!</addLink>
sc-review-form-prompt =
    .message = ngalalutik chegigegeer kotomo kegoito,tos ingen?
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = kagonyorunen { $sentenceSource }
sc-review-form-button-reject = esheen
sc-review-form-button-skip = sogorte
sc-review-form-button-approve = ipitishan
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-button-submit =
    .submitText = taar igeere
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] mamiten sentensi chegagereviewen
        [one] 1sentensi chegagereviewen.Kongoi!
       *[other] { $sentences }sentensi chegagereviwen.Kongoi!
    }
sc-review-form-review-failure = magikonor kereet.Gaigai,tyem kogeny koi

## REVIEW CRITERIA

sc-criteria-modal = olegigertoi
sc-criteria-title = olegigertoi
sc-criteria-make-sure = geer kole sentensi ichoto  kogisup olegimoktoi ku ni:
sc-criteria-item-1 = magaat kogigispellen ngalek komnyei
sc-criteria-item-2 = grammer negigiboishen komagaat ko miten komnyei
sc-criteria-item-3 = magaat kengalal sentensi ichotok
sc-criteria-item-6 = ngomaitinye sentensi alak cheigeere,gaigai,toretech iyuum ngalalutik alak !

## REVIEW PAGE

# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = Geer <icon></icon>nda miten komnyei olegigingalalda sentesinoto?
sc-review-rules-title = tos ngalalutik kogigisiir olemagaat?
sc-review-empty-state = mamiten ngalalutik chegigere kogeny eng kuti nito
report-sc-different-language = kutii age
report-sc-different-language-detail = kigisiir eng kutit age eng nagere
sentences-fetch-error = kagobit latutyet kanganyoru ngalaluti choto
review-error = kagobiit latutyet kangageere ngalalet ni
review-error-rate-limit-exceeded = iwendineng' chokchinet missing ip kasarta igeer ng'alalutik chu asinai nda mi komnyei
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = mi kechope walet neo
sc-redirect-page-subtitle-1 = yumsetab ngalalutik kowendi sautit nenaat neo,eng nguno much<writeURL>isiir</writeURL> ngolyo <reviewURL>igeer kogeny</reviewURL> ngolyo agenge chegigiyum eng sauti nenayat.
sc-redirect-page-subtitle-2 = ndaitinye tebut iteb eng <matrixLink>Matrix</matrixLink><discourseLink>Discourse</discourseLink> or <emailLink>emailit</emailLink>.

