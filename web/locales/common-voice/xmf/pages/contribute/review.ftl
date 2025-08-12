## REVIEW

sc-review-lang-not-selected = ნინა დიო ვეგშაიგორუნანო. გინილით თქვანი <profileLink> პროფილშა </profileLink> ნინაში მიოწურაფალო.
sc-review-title = ზიტყვასქვილეფიში გინოჯინა
sc-review-loading = ზიტყვასქვილეფი გითმიაძინუ...
sc-review-select-language = ქორთხინთ, გეჲშაგორით ნინა ზიტყვასქვილეფიში გინაჯინალო.
sc-review-no-sentences = ვარე გინაჯინალი ზიტყვასქილეფი. <addLink> სი ქიგუძინი ასე! </addLink>
sc-review-form-prompt =
    .message = გინოჯინელი ზიტყვასქვილეფი ვაჯღონელე, ქორეთო დარწუმებული?
sc-review-form-usage = გინუკინით მარძგვანჷშე ზიტყვასქვილეფი ქიმიღათჷნი. გინუკინით კვარჩხანჷშე ვარია ქოთქუათჷნი. ეუკინი ჟი, გიშატებელო. <strong> ვაგგოჭყორდანი გინოჯინელეფიში წუმორინაფაქ!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = წყუ: { $sentenceSource }
sc-review-form-button-reject = ვარება
sc-review-form-button-skip = გიშატება
sc-review-form-button-approve = მეღება
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = q
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = v
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = g
sc-review-form-keyboard-usage-custom = შეილებუნა ღილაკეფი გიმირინუათ ომართალო: { sc-review-form-button-approve-shortcut } რე დასამოწმებელო, { sc-review-form-button-reject-shortcut } ოვარებელო, { sc-review-form-button-skip-shortcut } გიშატებელო
sc-review-form-button-submit =
    .submitText = გინოჯინაში თება
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ზიტყვასქვილეფიში გინოჯინა.
        [one] 1ზიტყვასქვილი გინოჯინელი რე. მარდი!
       *[other] { $sentences } ზიტყვასქვილი გინოჯინელი რე. მარდი!
    }
sc-review-form-review-failure = გინოჯინელი ვეშინახჷ, ქორთხინთ კინ ქოცადათჷნი.
sc-review-link = გინოჯინა

## REVIEW CRITERIA

sc-criteria-modal = ⓘ გინოჯინაში კრიტერიუმეფი
sc-criteria-title = გინოჯინაში კრიტერიუმეფი
sc-criteria-make-sure = დერწმუნით, ნამდა ზიტყვასქვილეფი აყმაყოფილენს მოჩამილი კრიტერიუმეფს:
sc-criteria-item-1 = ზიტყვასქვილეფი წორას ოკო რდას ჭარილი.
sc-criteria-item-2 = ზიტყვასქვილეფი გრამატიკულო წორი ოკო რდას.
sc-criteria-item-3 = ზიტყვასქვილეფი ორაგადე ოკო რდას.
sc-criteria-item-4 = ზიტყვასქვილი ქაყმაყოფილენს პირობენსდა, ქიგუკაკეთ "მეღება", თუდო დო მარძგვანჷშე.
sc-criteria-item-5-2 = ვაყმაყოფილენს ჟიდონი პირობენსდა, ქიგუკაკეთ "ვარება" კვარჩხანშე. გინოჭყვადუა ქოიჭირადა, შეილებუნა გაქშეტუათ დო გინილათ შხვაშა.
sc-criteria-item-6 = გინაჯინალი ზიტყვასქვილეფქ დელიუ-და, ქორთხინთ, ქიდმეხვარათ ახალიში გორუას დო კორობუასჷნი!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ქიგნაჯინით <icon></icon> ზიტყვასქვილეფი წორი ქორე თუ ვარ?
sc-review-rules-title = აყმაყოფილენს თუ ვარ მოჩამილი მოთხუალას?
sc-review-empty-state = გინაჯინალი ზიტყვასქვილეფქ გეშელიუ თე ნინაშო.
report-sc-different-language = შხვანერი ნინა
report-sc-different-language-detail = ჩქიმ ოჩიებე ნინაშე განსხვავებულ ნინათ რე ჭარილი.
sentences-fetch-error = ჩილათა რე ზიტყვასქვილეფიში მეღებას
review-error = ჩილათა რე ზიტყვასქვილეფიში გინოჯინაში ბორჯის
review-error-rate-limit-exceeded = ჩქარენთ. ქორთხინთ, ართ წუთი დუთმათ ზიტყვასქვილეფიში გინოჯინასჷნი, ჯგირო დერწმუნით ნამდა თე ზიტყვა წორი რე.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ბრელ მუთუნს დოფთირანთ
sc-redirect-page-subtitle-1 = ზიტყვასქვილეფიში მაკორობალი გინმურს Common Voice თარ საიტშა. ასე შეილებუნა <writeURL> დოჭარათ </writeURL> ზიტყვასქვილი ვარდა <reviewURL> ქიგნაჯინათ </reviewURL> ზოხო გეძინელი ზიტყვასქვილეფს Common Voice-ის
sc-redirect-page-subtitle-2 = ქუმოპჭარით ოკითხურეფი <matrixLink> Matrix <discourseLink> </matrixLink> Discourse </discourseLink> ვარდა <emailLink> ელფოსტა </emailLink>.
# menu item
review-sentences = ზიტყვასქვილეფიში გინოჯინა
