## REVIEW

sc-review-lang-not-selected = სი მა̄მ ჯითიშა ჟი ნინ. ქა̄დე ისგუ <profileLink> პროფილთე </profileLink> ნჷნრე ლა̈თიშდ.
sc-review-title = ქა̄თთერუ̂ა̄̈ლ წინადადება̄̈ლ
sc-review-loading = წინადადება̄ლე სგალიჲრი…
sc-review-select-language = ჟა̈ხითშ ნინ წინადადება̄ლე განხილუ̂აჟი̄შდ
sc-review-no-sentences = მა̄მ ა̈რიხ განსახილუ̂ელ წინადადება̄̈ლ. <addLink> ლახაქმ ხოფშირა წინადადება̄̈ლ ათხე!</addLink>
sc-review-form-prompt =
    .message = განხილულ წინადება̄̈ლ მა̄მ ლიხ ქა ლჷზზე, ხიმა დარწმუნებულ?
sc-review-form-usage = წინადადება̄̈ ჩულა̈მტკიცა̄̈უ̂დ ქა̄თფურცელ ლერსგუ̂ანთე, ჩულაწნა̄̈უ̂დ — ლერთანთე, ქალა̈ცუ̂რად — ჟიბა̄უ̂. <strong> ნომა აჯა̄̈შდჷნდე̄დს ისგუ მიმოხილუ̂ა̄̈ ქალიზზი! </strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = წყარო: { $sentenceSource }
sc-review-form-button-reject = უარყოფა
sc-review-form-button-skip = ქალიცუ̂რე
sc-review-form-button-approve = ლ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = ა̄
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = მ
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = ქ
sc-review-form-keyboard-usage-custom = აჯად ჩუჯა̈მჲე̄და, ერე ა̈ხჴჷმრა ჩქა̈რდლა̈ტუ̂ი̄ლნა: { sc-review-form-button-approve-shortcut } ლა̈მტკიცა̄̈უ̂, { sc-review-form-button-reject-shortcut } ლაწნა̈უ̂, { sc-review-form-button-skip-shortcut } ქალა̈ცუ̂რა
sc-review-form-button-submit =
    .submitText = ლითე̄რუ̂ე̄მი ქალისრულე
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] მა̄მ ლიხ წინადადება̄̈ლ განხილულ
        [one] 1 წინადადება ლი განხილულ. მაჴუ̂მა̄̈რ!
       *[other] განხილულ ლი { $sentences } წინადადება. მაჴუ̂მა̄̈რ!
    }
sc-review-form-review-failure = მიმოხილუ̂ა̄̈ ლიშხუ̂ნი დეშ ა̈ნჴჷრჴა̄̈ნ. ახეკუ̂ჰ ხოშილ გუ̂იანდ.
sc-review-link = ქალითე̄რუ̂ე

## REVIEW CRITERIA

sc-criteria-modal = მიმოხილუ̂ა̄̈ კრიტერიუმა̄̈ლ
sc-criteria-title = ლამოწმა̈ნჟი̄ კრიტერიუმა̈ლ
sc-criteria-make-sure = დარწმუნდი, ერე წინადადება სგახოსყე̄ნე ალ კრიტერიუმა̈ლს:
sc-criteria-item-1 = წინადადება სწორდ ხეკუ̂ეს ხეირე̄ნს.
sc-criteria-item-2 = წინადადება ხეკუ̂ესე ლესსუ̂ გრამატიკულდ სწორ.
sc-criteria-item-3 = წინადადება ხეკუ̂ესე ქა იქუ̂ო̄ლდე̄დს.
sc-criteria-item-4 = წინადადება კრიტერიუმა̈ლს სგა ჰემა ხოსყე̄ნე, ჟე̄სოთლ &quot; ჩულიმტკიცა̈უ̂ი &quot; ლერსგუ̂ენ ღილაკ.
sc-criteria-item-5-2 = წინადადება ჰემა მა̄მ აკმაყოფილე ჩულჷშჷლდანე კრიტერიუმა̈ლს, ჟე̄სოთლ ღილაკს &quot; უ̂არ&quot; წინადადებაისგა დარწმუნებულ ჰე მა̄მ ხი, ჩუ ჯა̈მჲე̄და ქალახცურა ი ქა̄ტეხ ეჩუნღუ̂ე̄შთე.
sc-criteria-item-6 = წინადადება̄̈ლ სგ'ე̄სა ლა̈ჯშდა̈ხ, ჯეჰრიდ, ერე ლა̈ნმა̈რჯუ̂ ხოფში̄რა წინადადება̄ლე ლაყუ̂ბას!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ჩუ̂ათმოწმა̈ნ <icon></icon> ალ წინადადება ლიმა სწორ?
sc-review-rules-title = ლიმა წინადადება რეკომენდაცია̄ლე მასყა?
sc-review-empty-state = ალწა̈მჟი ალ ნინჟი განსახილველ წინადადება̈ლ მა̄მ ა̈რიხ.
report-sc-different-language = იშგენ ნინ
report-sc-different-language-detail = ალა იშგენ ნინჟი ლი ლჷი̄რ, მი ერ ხუ̂ამოწმა̈ნი, ეჩეჟი მა̄დე.
sentences-fetch-error = წინადება̄̈ ლაკა̈დჟი̄ნ ათხუ̂იდდა შეცდომა
review-error = ალ წინადება̄̈ განხილუ̂აჟი ათხუ̂იდდა შეცდომა
review-error-rate-limit-exceeded = სურუ ჩქა̈რდ ესღრი. ეშხუ წუთს ჩულა̈ხჩარუ̂ა̈ნ ი ჩუ̂ათმოწმა̈ნ წინადება ლიმა სწორ.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ბჷგი ცვლილება̄̈ლს ლიჩოდ
sc-redirect-page-subtitle-1 = წინადადება̄ლე მუნზორე ქ'ე̄სტიხ  Common Voice პლატფორმათე. ათხე ჩუ ჯა̈მჲე̄და <writeURL> ჩუ̂ათი̄ჲრა</writeURL> წინადადება ჲედ <reviewURL> ჩუ̂ათსჷნჯუ̂ა </reviewURL> თუ̂ით-თუ̂ითჟი Common Voice-თე ნაზჷზ წინადება̄̈ლ.
sc-redirect-page-subtitle-2 = ლანო შეკითხვა̄̈ლ <matrixLink> მატრიცა</matrixLink>-ჟი, <discourseLink> Discourse </discourseLink> ჲედ<emailLink> მეილჟი</emailLink>.
# menu item
review-sentences = ქა̄თე̄თრუ̂ა̄̈ლ წინადადება̄̈ლ
