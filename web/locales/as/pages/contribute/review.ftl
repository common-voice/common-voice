## REVIEW

sc-review-lang-not-selected = আপুনি কোনো ভাষা বাছনি কৰা নাই। ভাষা বাছনি কৰিবলৈ অনুগ্ৰহ কৰি আপোনাৰ <profileLink>প্ৰ’ফাইল</profileLink>লৈ যাওক।
sc-review-title = বাক্যবোৰ পৰ্যালোচনা কৰক
sc-review-loading = বাক্যবোৰ ল’ড কৰি থকা হৈছে…
sc-review-select-language = অনুগ্ৰহ কৰি বাক্যবোৰ পৰ্যালোচনা কৰিবলৈ এটা ভাষা বাছনি কৰক।
sc-review-no-sentences = পৰ্যালোচনা কৰিবলৈ কোনো বাক্য নাই। <addLink>এতিয়াই অধিক বাক্য যোগ কৰক!</addLink>
sc-review-form-prompt =
    .message = পৰ্যালোচনা কৰা বাক্যকেইটা দাখিল কৰা হোৱা নাই, নিশ্চিতনে?
sc-review-form-usage = বাক্যটো অনুমোদিত কৰিবলৈ সোঁফালে ছোৱাইপ কৰক। ইয়াক নাকচ কৰিবলৈ বাঁওফালে ছোৱাইপ কৰক। ইয়াক বাদ দিবলৈ ওপৰলৈ ছোৱাইপ কৰক। <strong>আপোনাৰ পৰ্যালোচনা দাখিল কৰিবলৈ নাপাহৰিব!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = উৎস: { $sentenceSource }
sc-review-form-button-reject = নাকচ কৰক
sc-review-form-button-skip = বাদ দিয়ক
sc-review-form-button-approve = অনুমোদন জনাওক
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = আপুনি কী-ব’ৰ্ড শ্বৰ্টকাটকেইটাও ব্যৱহাৰ কৰিব পাৰে: অনুমোদন জনাবলৈ { sc-review-form-button-approve-shortcut }, নাকচ কৰিবলৈ { sc-review-form-button-reject-shortcut }, বাদ দিবলৈ { sc-review-form-button-skip-shortcut }
sc-review-form-button-submit =
    .submitText = পৰ্যালোচনা শেষ কৰক
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] এটাও বাক্য পৰ্যালোচনা কৰা হোৱা নাই।
        [one] এটা বাক্য পৰ্যালোচনা কৰা হৈছে। ধন্যবাদ!
        [two] দুটা বাক্য পৰ্যালোচনা কৰা হৈছে। ধন্যবাদ!
       *[other] { $sentences }টা বাক্য পৰ্যালোচনা কৰা হৈছে। ধন্যবাদ!
    }
sc-review-form-review-failure = পৰ্যালোচনা সাঁচি থ’ব পৰা নগ’ল। অনুগ্ৰহ কৰি পাছত পুনৰ চেষ্টা কৰিব।
sc-review-link = পৰ্যালোচনা কৰক

## REVIEW CRITERIA

sc-criteria-modal = ⓘ পৰ্যালোচনাৰ মাপকাঠী
sc-criteria-title = পৰ্যালোচনাৰ মাপকাঠী
sc-criteria-make-sure = বাক্যটোৱে তলত উল্লেখ কৰা মাপকাঠীকেইটা পূৰণ কৰাটো নিশ্চিত কৰক:
sc-criteria-item-1 = বাক্যটোৰ বানান শুদ্ধ হ’ব লাগিব।
sc-criteria-item-2 = বাক্যটো ব্যাকৰণগতভাৱে শুদ্ধ হ’ব লাগিব।
sc-criteria-item-3 = বাক্যটো ক’ব পৰা যাব লাগিব।
sc-criteria-item-4 = যদি বাক্যটোৱে মাপকাঠী পূৰণ কৰে, তেন্তে সোঁফালে থকা &quot;অনুমোদন জনাওক&quot; বুটামটোত ক্লিক কৰিব।
sc-criteria-item-5-2 = যদি বাক্যটোৱে ওপৰত উল্লেখ কৰা মাপকাঠী পূৰণ নকৰে, তেন্তে বাঁওফালে থকা &quot; নাকচ কৰক&quot; বুটামটোত ক্লিক কৰিব। যদি আপুনি বাক্যটোৰ বিষয়ে নিশ্চিত নহয়, তেন্তে আপুনি বাক্যটো এৰি পৰৱৰ্তী বাক্যলৈও যাব পাৰে।
sc-criteria-item-6 = যদি পৰ্যালোচনা কৰিবলৈ আপোনাৰ বাক্য শেষ হৈ যায়, তেন্তে অনুগ্ৰহ কৰি আমাক অধিক বাক্য সংগ্ৰহ কৰাত সহায় কৰিব!
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = পৰীক্ষা কৰক <icon></icon> এইটো ভাষিক ৰূপত শুদ্ধ বাক্য নেকি?
sc-review-rules-title = বাক্যটোৱে নিৰ্দেশনাৱলী পূৰণ কৰিছেনে?
sc-review-empty-state = বৰ্তমান এই ভাষাত পৰ্যালোচনা কৰিবলগীয়া এটাও বাক্য নাই।
report-sc-different-language = বেলেগ ভাষা
report-sc-different-language-detail = এয়া মই পৰ্যালোচনা কৰি থকা ভাষাতকৈ কোনো বেলেগ ভাষাত লিখা আছে।
sentences-fetch-error = বাক্যবোৰ আনোতে কিবা ত্ৰুটি ঘটিছে
review-error = এই বাক্যটো পৰ্যালোচনা কৰোঁতে এটা ত্ৰুটি ঘটিছে
review-error-rate-limit-exceeded = আপুনি বৰ বেগাই গৈ আছে। অনুগ্ৰহ কৰি অলপমান সময় লৈ বাক্যটো পৰ্যালোচনা কৰি ইয়াৰ শুদ্ধতা নিশ্চিত কৰক।
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = আমি কেতবোৰ ডাঙৰ সাল-সলনি কৰি আছোঁ
sc-redirect-page-subtitle-1 = বাক্য-সংগ্ৰাহকটো মূল কমন ভইচ মঞ্চলৈ স্থানান্তৰিত হৈ আছে। আপুনি এতিয়া কমন ভইচত বাক্য <writeURL>লিখিব</writeURL> পাৰে নাইবা একক বাক্যৰ দাখিলবোৰ <reviewURL>পৰ্যালোচনা</reviewURL> কৰিব পাৰে।
sc-redirect-page-subtitle-2 = <matrixLink>Matrix</matrixLink>, <discourseLink>Discourse</discourseLink> নাইবা <emailLink>ইমেইল</emailLink>ত আমাক প্ৰশ্ন সোধক।
