## REVIEW

sc-review-lang-not-selected = မိတ်ဆွေ ဘာသာစကားတခုခုကို မရွီးရသိမ့်ပါ။ ဘာသာစကားတိကို ရွေးချယ်ဖို့ မိတ်ဆွေ <profileLink>ပြိုဖိုင်း</profileLink>ကို လားပါ။
sc-review-title = စာကြောင်းတိကို ပြန်ပနာ သုံးသပ်ပီးပါ
sc-review-loading = စာကြောင်းတိကို တင်ပီးနိန်ပါယေ…
sc-review-select-language = စာကြောင်းတိကို ပြန်ပနာ သုံးသပ်ဖို့ ဘာသာစကားတခုကို ရွီးချယ်ပါ။
sc-review-no-sentences = ပြန်ပနာ သုံးသပ်ဖို့ စာကြောင်းတိ မဟိပါ။ <addLink>အဂု စာကြောင်းတိ ထပ်ထည့်ပီးပါ။</addLink>
sc-review-form-prompt =
    .message = ပြန်ပနာ သုံးသပ်ထားယေ စာကြောင်းတိကို မတင်ပီးရသိမ့်ပါ၊ သေချာပါဗျာလ်လာ?
sc-review-form-usage = စာကြောင်းကို အတည်ပြုဖို့ဆိုကေ ညာဘက်ကို ပွတ်ဆွဲပါ။ ငြင်းပယ်ဖို့ဆိုကေ ဘယ်ဘက်ကို ပွတ်ဆွဲပါ။ ကျော်လားဖို့ဆိုကေ အထက်ကို ပွတ်ဆွဲပါ။ <strong>မိတ်ဆွေ သုံးသပ်ချက်ကို တင်ပီးဖို့ မမိပါကဲ့။</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ရင်းမြစ် - { $sentenceSource }
sc-review-form-button-reject = ငြင်းပယ်ပါ
sc-review-form-button-skip = ကျော်လားပါ
sc-review-form-button-approve = အတည်ပြုပါ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = Keyboard Shortcuts တိကိုလည်း အသုံးပြုနိုင်ပါယေ - အတည်ပြုဖို့ { sc-review-form-button-approve-shortcut }၊ ငြင်းပယ်ဖို့ { sc-review-form-button-reject-shortcut }၊ ကျော်လားဖို့ { sc-review-form-button-skip-shortcut }
sc-review-form-button-submit =
    .submitText = သုံးသပ်ချက် အဗြီးသတ်ပါ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] စာကြောင်းတိကို ပြန်ပနာ သုံးသပ်စွာ မဟိပါ။
        [one] စာကြောင်း 1 ကြောင်းကို ပြန်ပနာ သုံးသပ်ထားဗြီးပါဗျာလ်။ ကျေးဇူးတင်ပါယေ။
       *[other] စာကြောင်း { $sentences } ကြောင်းကို  ပြန်ပနာ သုံးသပ်ထားဗြီးပါဗျာလ်။ ကျေးဇူးတင်ပါယေ။
    }
sc-review-form-review-failure = သုံးသပ်ချက်ကို သိမ်းဆည်းလို့ မရပါ။ နောက်မှ ထပ်ပနာ ကြိုးစားကြည့်ပါ။
sc-review-link = ပြန်ပနာ သုံးသပ်ပါ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ ပြန်ပနာ သုံးသပ်ဖို့ သတ်မှတ်ချက်တိ
sc-criteria-title = ပြန်ပနာ သုံးသပ်ဖို့ သတ်မှတ်ချက်တိ
sc-criteria-make-sure = အေစာကြောင်းစွာ အောက်က သတ်မှတ်ချက်တိနန့် ကိုက်ညီယေလို့ သေချာဘာဇီ။
sc-criteria-item-1 = စာကြောင်းကို မှန်မှန်ကန်ကန် စာလုံးပေါင်းရပါဖို့။
sc-criteria-item-2 = စာကြောင်းစွာ သဒ္ဒါအရ မှန်ကန်ရပါဖို့။
sc-criteria-item-3 = စာကြောင်းကို စကား ပြောလို့ရအောင် ရီးရပါဖို့။
sc-criteria-item-4 = စာကြောင်းစွာ သတ်မှတ်ချက်တိနန့် ကိုက်ညီကေ ညာဘက်က "အတည်ပြုပါ" ခလုတ်ကို နှိပ်ပါ။
sc-criteria-item-5-2 = အထက်က သတ်မှတ်ချက်တိနန့် မကိုက်ညီကေ ဘယ်ဘက်က &quot;ငြင်းပယ်ပါ&quot; ခလုတ်ကို နှိပ်ပါ။ သတ်မှတ်ချက်တိနန့် ပတ်သတ်လို့ မသေချာကေ ကျော်လားပနာ နောက်တခုကို ဆက်လားနိုင်ပါယေ။
sc-criteria-item-6 = ပြန်ပနာ သုံးသပ်ဖို့ စာကြောင်းတိ ကုန်လားကေ၊ နောက်ထပ် စာကြောင်းတိ စုဆောင်းဖို့ အကျွန်ရို့ကို ကူညီပါ။
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = အေဟင့် <icon></icon> က ဘာသာစကားအရ မှန်ကန်ယေ စာကြောင်း ဟုတ်မဟုတ် စစ်ဆေးပီးပါ။
sc-review-rules-title = စာကြောင်းက လမ်းညွှန်ချက်တိနန့် ကိုက်ညီပါယင့်လား။
sc-review-empty-state = ဒေဘာသာစကားမှာ ပြန်ပနာ သုံးသပ်ဖို့ လောလောဆယ် စာကြောင်းတိ မဟိသိမ့်ပါ။
report-sc-different-language = တခြား ဘာသာစကား
report-sc-different-language-detail = အကျွန် သုံးသပ်နိန်ယေ ဘာသာစကားနန့် မတူယေ ဘာသာစကားတခုနန့် ရီးသားထားပါယေ။
sentences-fetch-error = စာကြောင်းတိကို ရယူစွာမှာ အမှားတခု ဖြစ်ခပါယေ
review-error = အေစာကြောင်းကို ပြန်ပနာ သုံးသပ်စွာမှာ အမှားအယွင်းတခု ဖြစ်ခပါယေ။
review-error-rate-limit-exceeded = မိတ်ဆွေ ကကောင်း ယင်ပါယေ။ အချိန်ယူပနာ စာကြောင်း မှန်ကန်ယေလို့ သေချာအောင်  ပြန်သုံးသပ်ပါ။
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = အကျွန်ရို့ ပြောင်းလဲမှု ကြီးကြီးမားမား အချို့ ပြုလုပ်နိန်ပါယေ
sc-redirect-page-subtitle-1 = Sentence Collector စွာ Common Voice က အဓိက ပလက်ဖောင်းကို ပြောင်းလာပါယေ။ အဂုအခါ Common Voice မှာ စာကြောင်းတကြောင်း <writeURL>ရီးသား</writeURL>စွာ ဝါ စာကြောင်းတကြောင်းတည်း တင်သွင်းစွာတိကို <reviewURL>ပြန်ပနာ သုံးသပ်</reviewURL>စွာ ပြုလုပ်နိုင်ပါဗျာလ်။
sc-redirect-page-subtitle-2 = အကျွန်ရို့ကို<matrixLink>Matrix</matrixLink>၊ <discourseLink>Discourse</discourseLink> ဝါ <emailLink>email</emailLink>နန့် မေးခွန်းတိ မိန်းပါ။
# menu item
review-sentences = စာကြောင်းတိကို ပြန်ပနာ သုံးသပ်ပါ
