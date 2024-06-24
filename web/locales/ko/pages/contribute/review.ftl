## REVIEW

sc-review-lang-not-selected = 언어를 선택하지 않았습니다. 언어를 선택하려면 <profileLink>프로필</profileLink>로 이동하십시오.
sc-review-title = 문장 검토
sc-review-loading = 문장 로드 중…
sc-review-select-language = 문장을 검토할 언어를 선택하세요.
sc-review-no-sentences = 검토할 문장이 없습니다. <addLink>지금 더 많은 문장을 추가하세요!</addLink>
sc-review-form-prompt =
    .message = 검토된 문장이 제출되지 않았습니까?
sc-review-form-usage = 문장을 승인하려면 오른쪽으로 스와이프하세요. 거부하려면 왼쪽으로 스와이프하세요. 건너뛰려면 위로 스와이프하세요. <strong>리뷰를 제출하는 것을 잊지 마세요!</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = 출처: { $sentenceSource }
sc-review-form-button-reject = 거부
sc-review-form-button-skip = 건너뛰기
sc-review-form-button-approve = 승인하기
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = 또한 키보드 단축키를 사용할 수도 있습니다: 승인 { sc-review-form-button-approve-shortcut }, 거부 { sc-review-form-button-reject-shortcut }, 건너뛰기 { sc-review-form-button-skip-shortcut }
sc-review-form-button-submit =
    .submitText = 검토 완료
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] 검토한 문장이 없습니다.
       *[other] { $sentences } 문장을 검토했습니다. 감사합니다!
    }
sc-review-form-review-failure = 검토를 저장할 수 없습니다. 나중에 다시 시도 해주십시오.
sc-review-link = 검토

## REVIEW CRITERIA

sc-criteria-modal = ⓘ 검토 기준
sc-criteria-title = 검토 기준
sc-criteria-make-sure = 문장이 다음 기준을 충족하는지 확인하십시오:
sc-criteria-item-1 = 문장의 철자가 정확해야 합니다.
sc-criteria-item-2 = 문장은 문법적으로 정확해야 합니다.
sc-criteria-item-3 = 문장은 말할 수 있어야 합니다.
sc-criteria-item-4 = 문장이 기준을 충족하면 &quot;승인&quot; 버튼을 클릭합니다.
sc-criteria-item-5-2 = 문장이 위의 기준에 맞지 않으면 좌측의 &quot;거부&quot;버튼을 클릭하십시오. 문장이 확실하지 않은 경우 건너뛰고 다음 문장으로 넘어갈 수도 있습니다.
sc-criteria-item-6 = 검토할 문장이 부족하면 더 많은 문장을 수집할 수 있도록 도와주세요!

## REVIEW PAGE

report-sc-different-language = 다른 언어
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = 몇 가지 큰 변화를 만들고 있습니다
sc-redirect-page-subtitle-1 = Sentence Collector는 핵심 Common Voice 플랫폼으로 이동하고 있습니다. 이제 Common Voice에서 문장을 <writeURL>작성</writeURL>하거나 단일 문장 제출을 <reviewURL>검토</reviewURL>할 수 있습니다.

