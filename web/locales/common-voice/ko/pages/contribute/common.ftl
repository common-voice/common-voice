action-click = 클릭
action-tap = 탭
contribute = 기여하기
review = 검토
skip = 건너뛰기
shortcuts = 바로 가기
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> 클립
       *[other] <bold>{ $count }</bold> 클립
    }
goal-help-recording = 방금 오늘 Common Voice 일간 녹음 목표 { $goalValue }의 <goalPercentage></goalPercentage>를 달성하였습니다!
goal-help-validation = 방금 오늘 Common Voice 일간 검증 목표 { $goalValue }의 <goalPercentage></goalPercentage>를 달성하였습니다!
contribute-more =
    { $count ->
       *[other] { $count } 번 더 할 준비가 되셨습니까?
    }
speak-empty-state = 이 언어로 녹음 할 문장이 부족합니다...
no-sentences-for-variants = 언어 변형에 더 이상 사용할 문장이 없을 수 있습니다! 괜찮으시다면 설정을 변경하여 동일한 언어 내의 다른 문장을 볼 수 있습니다.
speak-empty-state-cta = 문장 기여하기
speak-loading-error =
    말할 수 있는 문장을 하나도 가져오지 못했습니다.
    나중에 다시 시도해 주세요.
record-button-label = 목소리 녹음
share-title-new = 더 많은 목소리를 찾게 <bold>도와주세요</bold>
keep-track-profile = 프로필로 진행 상황을 추적
login-to-get-started = 시작하려면 로그인 또는 가입을 하세요.
target-segment-first-card = 첫 번째 대상 세그먼트에 기여하고 있습니다.
target-segment-generic-card = 대상 세그먼트에 기여하고 있습니다.
target-segment-first-banner = { $locale }로 Common Voice의 첫 번째 대상 세그먼트 만드는 것을 도와주세요.
target-segment-add-voice = 내 목소리 추가
target-segment-learn-more = 더 알아보기
change-preferences = 설정 변경

## Contribution Nav Items

contribute-voice-collection-nav-header = 음성 모음
contribute-sentence-collection-nav-header = 문장 모음
login-signup = 로그인 / 회원가입
vote-yes = 네
vote-no = 아니오
datasets = 데이터세트
languages = 언어
about = 소개
partner = 파트너
submit-form-action = 제출

## Reporting

report = 보고서
report-title = 보고서 제출
report-ask = 이 문장에 어떤 문제가 있습니까?
report-offensive-language = 공격적인 언어
report-offensive-language-detail = 이 문장에 무례하거나 모욕적인 글이 있습니다.
report-grammar-or-spelling = 문법 / 철자 오류
report-grammar-or-spelling-detail = 문장에 문법 또는 철자 오류가 있습니다.
report-different-language = 다른 언어
report-different-language-detail = 내가 사용하는 언어와 다른 언어로 작성되었습니다.
report-difficult-pronounce = 발음 어려움
report-difficult-pronounce-detail = 읽거나 발음이 어려운 단어나 문구가 포함되어 있습니다.
report-offensive-speech = 공격적인 말
report-offensive-speech-detail = 클립에 무례하거나 모욕적인 말이 있습니다.
report-other-comment =
    .placeholder = 코멘트
success = 성공
continue = 계속
report-success = 보고서가 성공적으로 전달되었습니다.

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = 녹음/멈추기
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = 클립 다시 녹음
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = 진행 중인 녹음 취소
shortcut-submit = 돌아가기
shortcut-submit-label = 클립 제출
request-language-text = 아직도 사용하는 언어가 Common Voice에서 보이지 않나요?
request-language-button = 언어 요청하기

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = 재생/멈추기
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = 기준
contribution-criteria-link = 기여 기준 이해하기
contribution-criteria-page-title = 기여 기준
contribution-criteria-page-description = 음성 클립을 들을 때 무엇을 찾아야 하는지 이해하고 음성 녹음을 풍부하게 만드세요!
contribution-for-example = 예를 들어
contribution-misreadings-title = 오독
contribution-misreadings-description = 들을 때 쓰여진 내용이 정확히 녹음 되었는지 매우 주의 깊게 확인하십시오. 사소한 오류라도 있으면 거부하십시오. <br />아주 흔한 실수는 다음과 같습니다.
contribution-misreadings-description-extended-list-1 = 녹음 시작 부분에 <strong>'A'</strong> 또는 <strong>'The'</strong>가 누락되었습니다.
contribution-misreadings-description-extended-list-2 = 단어 끝에 <strong>복수형</strong>이 없습니다.
contribution-misreadings-description-extended-list-3 = "We are"를 "We're"로 읽는 것과 같이 실제로 존재하지 않는 축약형을 읽고 있습니다.
contribution-misreadings-description-extended-list-4 = 녹음을 너무 빨리 중단해 마지막 단어의 끝 부분을 놓치는 것.
contribution-misreadings-description-extended-list-5 = 한 단어를 여러 번 읽는 것.
contribution-misreadings-example-1-title = 트라이아스기의 거대 공룡들
contribution-misreadings-example-2-title = 트라이아스기의 거대 공룡
contribution-misreadings-example-2-explanation = ['공룡'이어야 합니다.]
contribution-misreadings-example-3-title = 트라이아스기의 거대 공룡.
contribution-misreadings-example-3-explanation = [마지막 단어가 끝나기 전에 녹음이 중단됨]
contribution-misreadings-example-4-title = 트라이아스기의 거대 공룡들. 네.
contribution-misreadings-example-4-explanation = [요청한 텍스트보다 더 많은 것이 녹음되었음]
contribution-misreadings-example-5-title = We are going out to get coffee.
contribution-misreadings-example-6-title = We’re going out to get coffee.
contribution-misreadings-example-6-explanation = [“We are”이어야 합니다.]
contribution-misreadings-example-7-title = We are going out to get a coffee.
contribution-misreadings-example-7-explanation = [원문에 ‘a’가 없음]
contribution-misreadings-example-8-title = 범블비가 쏜살같이 달려왔습니다.
contribution-misreadings-example-8-explanation = [내용이 일치하지 않음]
contribution-varying-pronunciations-title = 다양한 발음
contribution-varying-pronunciations-description = 읽는 사람이 단어를 잘못 발음했거나, 강세를 잘못된 위치에 넣었거나, 물음표를 무시했다면 클립을 거부하기 전에 확인해주세요. 전 세계에서 사용되는 발음은 매우 다양하며, 그 중 일부는 지역 사회에서 들어보지 못한 것일 수 있습니다. 다르게 말하는 사람들을 위한 이해의 여백을 남겨 주세요.
contribution-varying-pronunciations-description-extended = 반면에 읽는 사람이 단어를 이전에 본 적이 없는 것 같고 발음에 대해 잘못된 추측을 하고 있다고 생각되면 거부하세요. 확실하지 않은 경우 건너뛰기 버튼을 사용하세요.
contribution-varying-pronunciations-example-1-title = 머리에는 베레모를 쓰고 있었습니다.
contribution-varying-pronunciations-example-1-explanation = ['Beret'은 강세가 첫 음절(영국)이든 두 번째 음절(미국)이든 괜찮습니다.]
contribution-varying-pronunciations-example-2-title = 그의 손이 올라갔다(rais-ed).
contribution-varying-pronunciations-example-2-explanation = [영어의 'Raised'는 항상 2음절이 아닌 1음절로 발음합니다.]
contribution-background-noise-title = 배경 소음
contribution-background-noise-description = 우리는 기계 학습 알고리즘이 다양한 배경 소음을 처리할 수 있기를 원하며, 텍스트 전체를 듣는 데 방해가 되지 않는다면 비교적 큰 소음도 수용할 수 있습니다. 조용한 배경 음악은 괜찮습니다. 모든 단어가 들리지 않을 정도로 큰 음악은 그렇지 않습니다.
contribution-background-noise-description-extended = 녹음이 깨지거나 딱딱거리는 소리가 난다면, 텍스트 전체가 잘 들리지 않는 한 거부합니다.
contribution-background-noise-example-1-fixed-title = <strong>[재채기]</strong> 트라이아스기 <strong>[기침]</strong>의 거대한 공룡.
contribution-background-noise-example-2-fixed-title = 트라이아스기의 거대한 공룡 <strong>[기침]</strong> 입니다.
contribution-background-noise-example-2-explanation = [텍스트의 일부가 들리지 않음]
contribution-background-noise-example-3-fixed-title = <strong>[탁탁하는 소리]</strong> 거대한 공룡 <strong>[탁탁하는 소리]</strong> -아스기.
contribution-background-voices-title = 배경 목소리
contribution-background-voices-description = 조용한 배경 소음은 괜찮지만, 쓰여진 텍스트에 없는 단어를 기계 알고리즘이 식별할 수 있는 추가 음성은 그렇지 않습니다. 텍스트와 별개의 다른 말이 들린다면 클립을 거부해야 합니다. 일반적으로 이것은 TV가 켜져 있거나 근처에서 대화가 진행되고 있을 때 발생합니다.
contribution-background-voices-description-extended = 녹음이 깨지거나 딱딱거리는 소리가 난다면, 텍스트 전체가 잘 들리지 않는 한 거부합니다.
contribution-background-voices-example-1-title = 트라이아스기의 거대한 공룡. <strong>[한 목소리로 읽는다]</strong>
contribution-background-voices-example-1-explanation = 오고 있어? <strong>[다른 사람이 부르는 소리]</strong>
contribution-volume-title = 소리 크기
contribution-volume-description = 읽는 사람들 사이엔 소리 크기의 자연스러운 변화가 있을 것입니다. 목소리가 너무 커서 녹음이 끊기거나 (더 흔하게는) 너무 작아 원문을 참조하지 않으면 무슨 말을 하는지 들리지 않는 경우에만 거부하십시오.
contribution-reader-effects-title = 리더 효과
contribution-reader-effects-description = 대부분의 녹음은 사람들의 자연스러운 목소리입니다. 소리지르거나 속삭이거나 명백히 '극적인' 목소리로 전달한 비표준 녹음을 허용할 수 있습니다. 노래하는 녹음 및 컴퓨터 합성 음성을 사용한 녹음 등은 거부하십시오.
contribution-just-unsure-title = 그냥 잘 모르겠다면?
contribution-just-unsure-description = 이 지침에서 다루지 않는 것을 발견하면 최선의 판단에 따라 결정하십시오. 정말 결정하기 어려우면 건너뛰기 버튼을 누르고 다음 녹음으로 넘어가십시오.
see-more = <chevron></chevron>더 보기
see-less = <chevron></chevron>덜 보기
