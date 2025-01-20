## REVIEW

sc-review-lang-not-selected = ნინა დიო ვეგშაიგორუნანო. გინილით თქვან <profileLink> პროფილშა </profileLink> ნინაშ მიოთითებელო.
sc-review-title = ზიტყვასქვილეფიშ გინოჯინა
sc-review-loading = ზიტყვასქვილეფი ქითმიაძინუ...
sc-review-select-language = ქორთხინთ, გეჲშაგორით ნინა ზიტყვასქვილეფიშ გინაჯინალო.
sc-review-no-sentences = ვარე გინაჯინალი ზიტყვასქილეფი. <addLink> სი ქიგუძინი ასე! </addLink>
sc-review-form-prompt =
    .message = გინოჯინელი ზიტყვასქვილეფი ვაჯღონელე, ქორეთო დარწუმებული?
sc-review-form-usage = გინუკინით მარძგვანჷშე ზიტყვასქვილეფი ქიმიღათჷნი. გინუკინით კვარჩხანჷშე ვარია ქოთქუათჷნი. ეუკინი ჟი, გიშატებელო. <strong> ვაგგოჭყორდანი გინოჯინელეფიშ წუმორინაფაქ!</strong>
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
sc-review-form-keyboard-usage-custom = შეილებუნა ღილაკეფ გიმირინუათ ომართალო: { sc-review-form-button-approve-shortcut } რე დასამოწმებელო, { sc-review-form-button-reject-shortcut } ოვარებელო, { sc-review-form-button-skip-shortcut } გიშატებელო
sc-review-form-button-submit =
    .submitText = გინოჯინაშ თება
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] ზიტყვასქვილეფიშ გინოჯინა.
        [one] 1ზიტყვასქვილე გინოჯინელ რე. მარდი!
       *[other] { $sentences } ზიტყვასქვილი გინოჯინელ რე. მარდი!
    }
sc-review-form-review-failure = გინოჯინელი ვეშინახჷ, ქორთხინთ ქოცადათ კინოხ.
sc-review-link = გინოჯინა

## REVIEW CRITERIA

sc-criteria-modal = ⓘ გინოჯინაშ კრიტერიუმეფი
sc-criteria-title = გინოჯინაშ კრიტერიუმეფი
sc-criteria-make-sure = დერწმუნით, ნამდა ზიტყვასქვილეფი აყმაყოფილენს მოჩამილ კრიტერიუმეფს:
sc-criteria-item-1 = ზიტყვასქვილეფი წორას ოკო რდას ჭარილი.
sc-criteria-item-2 = ზიტყვასქვილეფი გრამატიკულო წორი ოკო რდას.
sc-criteria-item-3 = ზიტყვასქვილეფი ორაგადე ოკო რდას.
sc-criteria-item-4 = ზიტყვასქვილი ქაყმაყოფილენს პირობენსდა, ქიგუკაკეთ "მეღება", თუდო დო მარძგვანჷშე.
sc-criteria-item-5-2 = ვაყმაყოფილენს ჟიდონი პირობენსდა, ქიგუკაკეთ "ვარება" კვარჩხანშე. გინოჭყვადუა ქოიჭირადა, შეილებუნა გაქშეტუათ დო გინილათ შხვაშა.
sc-criteria-item-6 = გინაჯინალ ზიტყვასქვილეფქ დელიუ-და, ქორთხინთ, ქიდმეხვარათ ახალიშ გორუას დო კორობუასჷნი!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ქიგნაჯინით <icon></icon> ზიტყვასქვილეფი წორი ქორე თუ ვარ?
sc-review-rules-title = აყმაყოფილენს თუ ვარ მოჩამილ მოთხუალას?
sc-review-empty-state = გინაჯინალ ზიტყვასქვილეფქ გეშელიუ თე ნინაშო.
report-sc-different-language = შხვანერი ნინა
report-sc-different-language-detail = ჩქიმ ოჩიებე ნინაშე განსხვავებულ ნინათ რე ჭარილი.
sentences-fetch-error = ჩილათა რე ზიტყვასქვილეფიშ მეღებას
review-error = ჩილათა რე ზიტყვასქვილეფიშ გინოჯინაშ ბორჯის
review-error-rate-limit-exceeded = ჩქარენთ. ქორთხინთ, ართ წუთი დუთმათ ზიტყვასქვილეფიშ გინოჯინასჷნი, ჯგირო დერწმუნით ნამდა თე ზიტყვა წორი რე.
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = ბრელ მუთუნს დოფთირანთ
sc-redirect-page-subtitle-1 = ზიტყვასქვილეფიშ მაკორობალი გინმურს Common Voice თარ საიტშა. ასე შეილებუნა <writeURL> დოჭარათ </writeURL> ზიტყვასქვილი ვარდა <reviewURL> ქიგნაჯინათ </reviewURL> ზოხო გეძინელ ზიტყვასქვილეფს Common Voice-ის
sc-redirect-page-subtitle-2 = ქუმოპჭარით ოკითხურეფი <matrixLink> Matrix <discourseLink> </matrixLink> Discourse </discourseLink> ვარდა <emailLink> ელფოსტა </emailLink>.
# menu item
review-sentences = ზიტყვასქვილეფიშ გინოჯინა
