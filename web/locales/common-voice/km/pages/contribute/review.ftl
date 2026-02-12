## REVIEW

sc-review-lang-not-selected = អ្នកមិនទាន់បានជ្រើសរើសភាសាណាមួយនៅឡើយទេ។ សូមចូលទៅកាន់ <profileLink>ProfileLink> របស់អ្នក ដើម្បីជ្រើសរើសភាសា។
sc-review-title = ប្រយោគពិនិត្យឡើងវិញ
sc-review-loading = កំពុងផ្ទុកប្រយោគ…
sc-review-select-language = សូមជ្រើសរើសភាសាដើម្បីពិនិត្យមើលប្រយោគ។
sc-review-no-sentences = គ្មានប្រយោគណាមួយដើម្បីពិនិត្យទេ។ <addLink>បន្ថែមប្រយោគបន្ថែមទៀតឥឡូវនេះ!</addLink>
sc-review-form-prompt =
    .message = ប្រយោគដែលបានពិនិត្យមិនទាន់បានដាក់ជូនទេ តើប្រាកដទេ?
sc-review-form-usage = អូសទៅស្តាំដើម្បីយល់ព្រមលើប្រយោគ។ អូសទៅឆ្វេងដើម្បីបដិសេធវា។ អូសឡើងលើដើម្បីរំលងវា។ <strong>កុំភ្លេចដាក់ស្នើការវាយតម្លៃរបស់អ្នក!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = ប្រភព៖ { $sentenceSource }
sc-review-form-button-reject = បដិសេធ
sc-review-form-button-skip = រំលង
sc-review-form-button-approve = យល់ព្រម
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = អ្នកក៏អាចប្រើផ្លូវកាត់ក្ដារចុចផងដែរ៖ { sc-review-form-button-approve-shortcut } ដើម្បីយល់ព្រម, { sc-review-form-button-reject-shortcut } ដើម្បីបដិសេធ, { sc-review-form-button-skip-shortcut } ដើម្បីរំលង
sc-review-form-button-submit =
    .submitText = ការពិនិត្យឡើងវិញបញ្ចប់
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] គ្មាន​ប្រយោគ​ណាមួយ​ត្រូវ​បាន​ពិនិត្យ​ឡើងវិញ​ទេ។
        [one] ប្រយោគ { $sentences } ត្រូវបានពិនិត្យ។ សូមអរគុណ!
       *[other] { $sentences } sentences reviewed. Thank you!
    }
sc-review-form-review-failure = មិនអាចរក្សាទុកការវាយតម្លៃបានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។
sc-review-link = ពិនិត្យឡើងវិញ

## REVIEW CRITERIA

sc-criteria-modal = ⓘ លក្ខណៈវិនិច្ឆ័យពិនិត្យឡើងវិញ
sc-criteria-title = លក្ខណៈវិនិច្ឆ័យពិនិត្យឡើងវិញ
sc-criteria-make-sure = ត្រូវប្រាកដថាប្រយោគនេះបំពេញតាមលក្ខណៈវិនិច្ឆ័យដូចខាងក្រោម៖
sc-criteria-item-1 = ប្រយោគនេះត្រូវតែសរសេរបានត្រឹមត្រូវ។
sc-criteria-item-2 = ប្រយោគនេះត្រូវតែត្រឹមត្រូវតាមវេយ្យាករណ៍។
sc-criteria-item-3 = ឃ្លានេះត្រូវតែអាចនិយាយបាន។
sc-criteria-item-4 = ប្រសិនបើប្រយោគនេះបំពេញតាមលក្ខណៈវិនិច្ឆ័យ សូមចុចប៊ូតុង "យល់ព្រម" នៅខាងស្តាំ។
sc-criteria-item-5-2 = ប្រសិនបើប្រយោគមិនបំពេញតាមលក្ខណៈវិនិច្ឆ័យខាងលើ សូមចុចប៊ូតុង "បដិសេធ" នៅខាងឆ្វេង។ ប្រសិនបើអ្នកមិនប្រាកដអំពីប្រយោគនោះ អ្នកក៏អាចរំលងវា ហើយបន្តទៅប្រយោគបន្ទាប់បានដែរ។
sc-criteria-item-6 = ប្រសិនបើអ្នកអស់ប្រយោគដែលត្រូវពិនិត្យឡើងវិញ សូមជួយយើងប្រមូលប្រយោគបន្ថែមទៀត!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = ពិនិត្យមើល <icon></icon> តើនេះជាប្រយោគត្រឹមត្រូវខាងភាសាវិទ្យាដែរឬទេ?
sc-review-rules-title = តើប្រយោគនេះបំពេញតាមគោលការណ៍ណែនាំដែរឬទេ?
sc-review-empty-state = បច្ចុប្បន្នមិនមានប្រយោគណាមួយដើម្បីពិនិត្យឡើងវិញជាភាសានេះទេ។
report-sc-different-language = ភាសាខុសគ្នា
report-sc-different-language-detail = វាត្រូវបានសរសេរជាភាសាខុសពីអ្វីដែលខ្ញុំកំពុងវាយតម្លៃ។
sentences-fetch-error = មានកំហុសកើតឡើងនៅពេលទាញយកប្រយោគ
review-error = កំហុសមួយបានកើតឡើងនៅពេលពិនិត្យមើលប្រយោគនេះ
review-error-rate-limit-exceeded = អ្នកកំពុងបើកបរលឿនពេក។ សូមចំណាយពេលមួយភ្លែតដើម្បីពិនិត្យមើលប្រយោគនេះឡើងវិញ ដើម្បីប្រាកដថាវាត្រឹមត្រូវ។
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = យើងកំពុងធ្វើការផ្លាស់ប្តូរធំៗមួយចំនួន
sc-redirect-page-subtitle-1 = កម្មវិធី Sentence Collector កំពុងផ្លាស់ទីទៅវេទិកាស្នូល Common Voice។ ឥឡូវនេះ អ្នកអាច <writeURL>សរសេរ</writeURL> ប្រយោគមួយ ឬ <reviewURL>ពិនិត្យ</reviewURL> ការដាក់ស្នើប្រយោគតែមួយនៅលើ Common Voice បាន។
sc-redirect-page-subtitle-2 = សួរសំណួរមកយើងតាមរយៈ <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> ឬ <emailLink>email</emailLink>។
# menu item
review-sentences = ប្រយោគពិនិត្យឡើងវិញ
