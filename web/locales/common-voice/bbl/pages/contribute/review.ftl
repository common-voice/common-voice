## REVIEW

sc-review-lang-not-selected = მოტტ ცო ბა ჩა́ვარბიენო̆. დაჰ̦ დო́ტათ შეჲრ <profileLink> პრო́ფილმაქ</profileLink> მოტტ დაწე́რადბაჼ
sc-review-title = წინა́დადებ შემო́წმადჲარ
sc-review-loading = ტვირთოლა წინადა́დბი
sc-review-select-language = დეხო́თხ მოტტ ჩა́ვარბებათ წინადა́დბი შემო́წმადჲაჼ
sc-review-no-sentences = შემო́წმადუჲნი̆ წინადა́დბი ცო დაგეგ.<addLink>ეჲშ ლა́ტდებათ ინცაჸ!</addLink>
sc-review-form-prompt =
    .message = დაყყდიენო̆ წინადა́დბი ცო დახეჼ (გაგზა́ვნოდალინ). ბაყეჸ იშტი́ დაკლივა?
sc-review-form-usage = ა́ტტეხ ო́წდებათ წინადა́დებ მიღე́ბადჲაჼ. ა́რლეხ ო́წდებათ უარ ა́ლ'აჼ. ჰ̦ალო̆ ო́წდებათ მაქა ეჴჴაჼ (გამოტო́ვებადაჼ).<strong>მა დიცდოთ დაყყდინუჲ წარდგე́ნოდარ
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = წყარო{ $sentenceSource }
sc-review-form-button-reject = უარ ალ'არ (დაწუნბადარ)
sc-review-form-button-skip = მაქა ეჴჴარ (გამოტოვებადარ)
sc-review-form-button-approve = მიღებადარ
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = d
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = a
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = t
sc-review-form-keyboard-usage-custom = მაკ შუჼ ღილაკივ მუშებადალაჼ: { sc-review-form-button-approve-shortcut } - დამოწმებ, { sc-review-form-button-reject-shortcut } უარ ა́ლარ (დაწუნბადარ), { sc-review-form-button-skip-shortcut } - მაქა́ ეჴჴარ (გამოტო́ვებადარ)
sc-review-form-button-submit =
    .submitText = დაყყდარ (შემოწმებ) ცერ და́ლ'არ
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] წინადა́დბი ცო და დაყყდიენო̆ (შემო́წმადიენო̆)
        [one] 1 წინადა́დებ ჲა დაყყჲიენო̆  (შემო́წმადიენო̆). მადლობ!
       *[other] { $sentences } წინადა́დებ ჲა დაყყჲიენო̆. (შემო́წმადიენო̆). მადლობ!
    }
sc-review-form-review-failure = შემო́წმადიენო ცო გა́გჲალიჼ. დეხო́თხ ჴეჼკაჸ ტყო́ჸ ცადლიბათ
sc-review-link = შემოწმადარ

## REVIEW CRITERIA

sc-criteria-modal = ნიფსიშ დაყყდარ (შემო́წმებადარ)
sc-criteria-title = მოჰ̦ დე́ყყლა (შემო́წმებეჼ მოთხოვნი)
sc-criteria-make-sure = და́ცოდჲუჲნი̆ ჲა აჰ̦ ლა́რლ'ინო̆ მოთხო́ვნი:
sc-criteria-item-1 = ორთოგრაფია ნიფს ჲეწ ხილ'აჼ
sc-criteria-item-2 = გრამატიკა ნიფსიჼ ჲეწ ხილ'აჼ
sc-criteria-item-3 = ჰ̦ალო̆ ალ'არ ჭირვეჼ ცო დეწ ხილ'აჼ
sc-criteria-item-4 = ე მოთხო́ვნი და́ცოდიენო̆ ჲაჰ̦, წკაპ ბა́ჴითათ "მიღე́ბადარ" (დარ ალ'არ), ლახუშა́ჲ, ა́ტტივხაჲ
sc-criteria-item-5-2 = ე მოთხო́ვნი და́ცოდიენო̆ ცო ჲაჰ̦, წკაპ ბა́ჴითათ "უარ ალ'არ" (დაწუნბადჲარ) ა́რლეჩო̆ ფენივჰ̦. დოკჴირა́ დაშ მაკ შუჼ მაქა ეჴჴაჼ (გამოტოვბადჲაჼ) ნე ჴეჩონმაქ დოტაჼ
sc-criteria-item-6 = დაყყდუჲნი (შემო́წმადუჲნი) წინადა́დბი ჰ̦ალო̆ ჴა́ჩდელჩე დეხო́თხ  ლა́ტლეთ თხოჼ წი́ნში ლახარ-ვაშა́რ დარელო.
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = დაყყდებათ (შემო́წმადებათ), წინადადბა́ჼ მოტტ ნიფსინი́ ბა ლე ცო (ე́ნობრივ ნიფსხოლ)
sc-review-rules-title = პა́სუხ თელ'უჲ ლა́რ'ლუჲჩ მოთხოვნა́ხ (პირბახ)?
sc-review-empty-state = ეჴ მატტანაჲნო̆ დაყყდუჲნი̆ წინადა́დბი ჰ̦ალო̆ ჴა́ჩდალიჼ
report-sc-different-language = ჴენაჸ მოტტ
report-sc-different-language-detail = დაწე́რადიენო̆ და ას ა́მბუი ჲოჩო̆ მატტახ ცოთარ'ლენო̆ ჴე́ჩო̆ მატტავ
sentences-fetch-error = შეცდო́მ ჲა ხილ'ენო̆ წინადა́დებ მიღე́ბადჲოშ
review-error = შეცდო́მ ჲა ხილ'ენო̆ წინადა́დებ დეყყჲოშ (შემო́წმადჲოშ)
review-error-rate-limit-exceeded = წყეგეჸ ქასტლეჲში̆. დეხო́თხ სოუბო̆ დროჰ̦-ე́ დაკრეშ ხა́ტტლოთ წინა́დადებ, მე ღაზი́შ ხოჸოლო̆ შუჼ ნიფსხოლ მოლლა́ხუჼ ჲა.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ტა́ლამბუჲნი̆ ხარცხილ'რი და
sc-redirect-page-subtitle-1 = ჰ̦ანასა́ წინადა́დბი ვაშა́რ დუჲცი̆, ო დაჰ̦ დუჲტო̆ Common Voice-ეჼ ძირითად სა́იტმაქ, ინც მაკ შუჼ <writeURL> შედგე́ნადოლოთ </writeURL>წინადა́დებ, ლე მა́ <reviewURL>დაყყდო́ლოთ</reviewURL> ცჰ̦აც მაქ ლა́ტდიენო̆ წინადა́დებ ნიფს Common Voice-ე.
sc-redirect-page-subtitle-2 = უმ ხატტანაჲნო ები ჴმარბადებათ:<matrixLink>Matrix</matrixLink><discourseLink>Discourse ლე მა <emailLink>ელფოსტ</emailLink>
# menu item
review-sentences = წინა́დადებ შემო́წმადჲარ
