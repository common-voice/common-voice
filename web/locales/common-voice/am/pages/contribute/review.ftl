## REVIEW

sc-review-lang-not-selected = ምንም ቋንቋ አልመረጡም። ቋንቋዎችን ለመምረጥ እባክዎ ወደ <profileLink>መገለጫዎ</profileLink> ይሂዱ።
sc-review-title = ዓረፍተ ነገሮችን ይገምግሙ
sc-review-loading = ዓረፍተ ነገሮችን በመጫን ላይ…
sc-review-select-language = እባክዎን ዓረፍተ ነገሮችን ለመገምገም ቋንቋ ይምረጡ።
sc-review-no-sentences = ምንም የሚገመገሙ ዓረፍተ ነገሮች የሉም። <addLink>አሁን ተጨማሪ ዓረፍተ ነገሮችን አክል!</ addLink>
sc-review-form-prompt =
    .message = የተገመገሙ ዓረፍተ ነገሮች አልገቡም፣ እርግጠኛ ናቸው?
sc-review-form-usage = ዓረፍተ ነገሩን ለማጽደቅ ወደ ቀኝ ያንሸራትቱ። ላለመቀበል ወደ ግራ ያንሸራትቱ። ለመዝለል ወደ ላይ ያንሸራትቱ። <strong>ግምገማህን ማስገባትህን አትርሳ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ምንጭ፡ { $sentenceSource }
sc-review-form-button-reject = ውድቅ አድርግ
sc-review-form-button-skip = ዝለል
sc-review-form-button-approve = አጽድቅ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ዓ
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = ው
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = ዝ
sc-review-form-keyboard-usage-custom = እንዲሁም የቁልፍ ሰሌዳ አቋራጮችን መጠቀም ይችላሉ፡ { sc-review-form-button-approve-shortcut } ለማጽደቅ፣ { sc-review-form-button-reject-shortcut } ውድቅ ለማድረግ፣ { sc-review-form-button-skip-shortcut } ለመዝለል
sc-review-form-button-submit =
    .submitText = ግምገማን ጨርስ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ምንም ዓረፍተ ነገር አልተገመገመም።
        [one] 1 ዓረፍተ ነገር ተገምግሟል። አመሰግናለሁ!
       *[other] { $sentences } ዓረፍተ ነገሮች ተገምግመዋል። አመሰግናለሁ!
    }
sc-review-form-review-failure = ግምገማ ሊቀመጥ አልቻለም። እባክዎ ቆየት ብለው ይሞክሩ።
sc-review-link = ይገምግሙ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ የግምገማ መስፈርቶች
sc-criteria-title = የግምገማ መስፈርቶች
sc-criteria-make-sure = ዓረፍተ ነገሩ የሚከተሉትን መመዘኛዎች የሚያሟላ መሆኑን ያረጋግጡ።
sc-criteria-item-1 = አረፍተ ነገሩ በትክክል መፃፍ አለበት።
sc-criteria-item-2 = አረፍተ ነገሩ በሰዋሰው ትክክለኛ መሆን አለበት።
sc-criteria-item-3 = አረፍተ ነገሩ የሚነገር መሆን አለበት።
sc-criteria-item-4 = ዓረፍተ ነገሩ መስፈርቱን የሚያሟላ ከሆነ &quot;አጽድቅ&quot; የሚለውን በቀኝ በኩል ያለውን አዝራር ጠቅ ያድርጉ።
sc-criteria-item-5-2 = ዓረፍተ ነገሩ ከላይ የተጠቀሱትን መመዘኛዎች የማያሟላ ከሆነ፣ "ውድቅ" የሚለውን ቁልፍ ጠቅ ያድርጉ። ስለ ዓረፍተ ነገሩ እርግጠኛ ካልሆኑ፣ እሱንም መዝለል እና ወደሚቀጥለው መቀጠል ይችላሉ።
sc-criteria-item-6 = ለመገምገም ዓረፍተ ነገሮች ካለቀብዎት፣ እባክዎን ተጨማሪ ዓረፍተ ነገሮችን እንድንሰበስብ ያግዙን!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = አረጋግጥ <icon></icon> ይህ በቋንቋ ትክክል የሆነ ዓረፍተ-ነገር ነውን?
sc-review-rules-title = ዓረፍተ-ነገሩ መመሪያዎቹን ያሟላል?
sc-review-empty-state = በአሁኑ ጊዜ በዚህ ቋንቋ የሚገመገሙ ዓረፍተ-ነገሮች የሉም።
report-sc-different-language = የተለያየ ቋንቋ
report-sc-different-language-detail = እኔ እየገመገምኩት ካለው በተለየ ቋንቋ ነው የተፃፈው።
sentences-fetch-error = ዓረፍተ-ነገሮችን ማምጣት ላይ ስህተት ተፈጥሯል
review-error = ይህን ዓረፍተ-ነገር በመገምገም ላይ ስህተት ተፈጥሯል
review-error-rate-limit-exceeded = በጣም በፍጥነት እያስኼዱት ነው። አረፍተነገሩ ትክክል መሆኑን ለማረጋገጥ እባክዎን ትንሽ ጊዜ ይውሰዱ።
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = አንዳንድ ትልልቅ ለውጦችን እያደረግን ነው።
sc-redirect-page-subtitle-1 = ዓረፍተ ነገር ሰብሳቢው ወደ ዋናው የጋራ ድምጽ መድረክ እየሄደ ነው። አሁን በጋራ ድምጽ ላይ የገባውን አንድ ዓረፍተ ነገር <writeURL>መጻፍ</writeURL> ወይም ነጠላ ዓረፍተ ነገር <reviewURL>መገምገም</reviewURL> ይችላሉ።
sc-redirect-page-subtitle-2 = ጥያቄዎችን በ<matrixLink>ማትሪክስ</matrixLink>፣ <discourseLink>ዲስኩር</discourseLink> ወይም <emailLink>ኢሜል</emailLink> ላይ ይጠይቁን።
