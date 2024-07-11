## REVIEW

sc-review-lang-not-selected =
    तपाईंले कुनै पनि भाषाहरू छनौट गर्नुभएको छैन। कृपया भाषाहरू चयन गर्न आफ्नो
    <profileLink>प्रोफाइल</profileLink> मा जानुहोस् ।
sc-review-title = वाक्यहरुको समीक्षा गर्नुहोस्
sc-review-loading = वाक्यहरु लोड गरिदै…
sc-review-select-language = कृपया वाक्यहरू समीक्षा गर्न भाषा छनौट गर्नुहोस्।
sc-review-no-sentences =
    समीक्षा गर्न कुनै वाक्यहरु छैनन्।
    <addLink>अहिले थप वाक्यहरू थप्नुहोस्!</addLink>
sc-review-form-prompt =
    .message = समीक्षा गरिएका वाक्यहरू पेश गरिएका छैनन्, निश्चित हुनुहुन्छ?
sc-review-form-usage = वाक्य अनुमोदन गर्न दायाँ स्वाइप गर्नुहोस्। यसलाई अस्वीकार गर्न बायाँ स्वाइप गर्नुहोस्। यसलाई छोड्न माथि स्वाइप गर्नुहोस्। <strong>आफ्नो समीक्षा पेश गर्न नबिर्सनुहोस्!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = स्रोत: { $sentenceSource }
sc-review-form-button-reject = अस्वीकार गर्नुहोस्
sc-review-form-button-skip = छोड्नुहोस्
sc-review-form-button-approve = अनुमोदन गर्नुहोस्
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = तपाईंले किबोर्ड सर्टकटहरू पनि प्रयोग गर्न सक्नुहुन्छ:{ sc-review-form-button-approve-shortcut } अनुमोदन गर्न, { sc-review-form-button-reject-shortcut }अस्वीकार गर्न, { sc-review-form-button-skip-shortcut } सर्टकट छोड्न
sc-review-form-button-submit =
    .submitText = समीक्षा समाप्त गर्नुहोस्
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] कुनै वाक्य समीक्षा गरिएको छैन।
        [one] 1 वाक्य समीक्षा गरियो। धन्यवाद!
       *[other] { $sentences } वाक्यहरू समीक्षा गरिए। धन्यवाद!
    }
sc-review-form-review-failure = समीक्षा सुरक्षित गर्न सकिएन। फेरी प्रयास गर्नु होला।
sc-review-link = समीक्षा गर्नुहोस्

## REVIEW CRITERIA

sc-criteria-modal = ⓘ समीक्षा मापदण्ड
sc-criteria-title = समीक्षाको मापदण्ड
sc-criteria-make-sure = वाक्यले निम्न मापदण्डहरू पालना गर्दछ भनि निश्चित गर्नुहोस् :
sc-criteria-item-1 = यस वाक्यको हिज्जे सही हुनुपर्छ।
sc-criteria-item-2 = वाक्य व्याकरणिक रूपमा सही हुनुपर्छ।
sc-criteria-item-3 = वाक्य बोल्न सक्ने हुनुपर्छ।
sc-criteria-item-4 = यदि वाक्यले मापदण्ड पूरा गर्छ भने, दायाँको &quot;अनुमोदन&quot; बटनमा क्लिक गर्नुहोस्।।
sc-criteria-item-5-2 = यदि वाक्यले माथिको मापदण्ड पूरा गर्दैन भने,बायाँको  &quot;अस्वीकार&quot; बटनमा क्लिक गर्नुहोस्। यदि तपाईं वाक्यको बारेमा अनिश्चित हुनुहुन्छ भने, तपाईं यसलाई छोडेर अर्कोमा जान सक्नुहुन्छ।
sc-criteria-item-6 = यदि तपाइँसँग समीक्षा गर्न वाक्यहरू समाप्त भएमा, कृपया हामीलाई थप वाक्यहरू सङ्कलन गर्न मद्दत गर्नुहोस्!
