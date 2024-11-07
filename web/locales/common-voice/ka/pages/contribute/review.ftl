## REVIEW

sc-review-lang-not-selected =
    ენა ჯერ არ აგირჩევიათ. გადადით თქვენს
    <profileLink>პროფილზე</profileLink> ენის მისათითებლად.
sc-review-title = წინადადებების შემოწმება
sc-review-loading = იტვირთება წინადადებები…
sc-review-select-language = გთხოვთ, აირჩიოთ ენა, წინადადებების შესამოწმებლად.
sc-review-no-sentences =
    შესამოწმებელი წინადადებები აღარაა.
    <addLink>თავად დაამატეთ ახლავე!</addLink>
sc-review-form-prompt =
    .message = გადამოწმებული წინადადებები არ გაგზავნილა, დარწმუნებული ხართ?
sc-review-form-usage =
    გადასწიეთ მარჯვნივ წინადადების მისაღებად. გადასწიეთ მარცხნივ, უარსაყოფად.
    ასწიეთ ზემოთ, გამოსატოვებლად. <strong>არ დაგავიწყდეთ გადამოწმებულების წარდგენა!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = წყარო: { $sentenceSource }
sc-review-form-button-reject = უარყოფა
sc-review-form-button-skip = გამოტოვება
sc-review-form-button-approve = მიღება
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = d
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = a
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = t
sc-review-form-keyboard-usage-custom = შეგიძლიათ ღილაკებიც გამოიყენოთ სამართავად: { sc-review-form-button-approve-shortcut } არის დასამოწმებლად, { sc-review-form-button-reject-shortcut } – უარსაყოფად და { sc-review-form-button-skip-shortcut } – გამოსატოვებლად.
sc-review-form-button-submit =
    .submitText = შემოწმების დასრულება
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] წინადადებები შეუმოწმებელია.
        [one] 1 წინადადებაა შემოწმებული. გმადლობთ!
       *[other] { $sentences } წინადადებაა შემოწმებული. გმადლობთ!
    }
sc-review-form-review-failure = შემოწმებული ვერ შეინახა. გთხოვთ სცადოთ მოგვიანებით.
sc-review-link = შემოწმება

## REVIEW CRITERIA

sc-criteria-modal = ⓘ სწორად შემოწმების შესახებ
sc-criteria-title = როგორ მოწმდება
sc-criteria-make-sure = უნდა აკმაყოფილებდეს შემდეგ მოთხოვნებს:
sc-criteria-item-1 = მართლწერის კუთხით გამართულია.
sc-criteria-item-2 = გრამატიკულად სწორადაა შედგენილი.
sc-criteria-item-3 = მისი წარმოთქმა სიძნელეს არ წარმოადგენს.
sc-criteria-item-4 = თუ წინადადება აკმაყოფილებს პირობებს, დაწკაპეთ „მიღება", ქვემოთ და მარჯვნივ.
sc-criteria-item-5-2 =
    თუ ვერ აკმაყოფილებს ზემოაღნიშნულ პირობებს, დაწკაპეთ „უარყოფა“ მარცხენა მხარეს.
    თუ გიჭირთ გადაწყვეტა, შეგიძლიათ გამოტოვოთ და სხვაზე გადახვიდეთ.
sc-criteria-item-6 = თუ ამოიწურება შესამოწმებელი წინადადებები, გთხოვთ დაგვეხმაროთ ახლის მოძიებასა და შეგროვებაში!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = შეამოწმეთ, <icon></icon> ენობრივად გამართულია თუ არა წინადადებები.
sc-review-rules-title = აკმაყოფილებს მითითებულ მოთხოვნებს?
sc-review-empty-state = ამ ენისთვის შესამოწმებელი წინადადებები ამოიწურა.
report-sc-different-language = განსხვავებული ენა
report-sc-different-language-detail = დაწერილია ჩემი სასაუბრო ენისგან განსხვავებულ ენაზე.
sentences-fetch-error = შეცდომა წინადადებების მიღებისას
review-error = შეცდომა წინადადებების შემოწმებისას
review-error-rate-limit-exceeded = ზედმეტად ჩქარობთ. გთხოვთ, დრო მეტი დაუთმოთ წინადადების გარჩევას, რომ კარგად გადაამოწმოთ მისი სისწორე.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = მნიშვნელოვანი ცვლილებებია
sc-redirect-page-subtitle-1 = წინადადებების შემგროვებელი გადადის Common Voice-ის ძირითად საიტზე. ახლა შეგიძლიათ <writeURL>შეადგინოთ</writeURL> წინადადება ან <reviewURL>შეამოწმოთ</reviewURL> ცალკეულად დამატებული წინადადებები პირდაპირ Common Voice-ზე.
sc-redirect-page-subtitle-2 = კითხვების დასასმელად გამოიყენეთ <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ან <emailLink>ელფოსტა</emailLink>.
