## Dashboard

your-languages = 나의 언어
toward-next-goal = 다음 목표를 향해
goal-reached = 목표 달성
clips-you-recorded = 녹음한 레코드 클립
clips-you-validated = 검증한 레코드 클립
todays-recorded-progress = 오늘의 Common Voice 레코드 클립 녹음 진행 현황
todays-validated-progress = 오늘의 Common Voice 레코드 클립 검증 진행 현황
stats = 통계
awards = 상
you = 나
everyone = 모두
contribution-activity = 기여 활동
top-contributors = 상위 공헌자
recorded-clips = 녹음된 클립
validated-clips = 검증된 클립
total-approved = 승인 전체
overall-accuracy = 종합적 정확도
set-visibility = 공개 설정
visibility-explainer = 이 설정은 리더 보드 표시를 제어합니다. 숨기면 진행 상황이 비공개가 됩니다. 이는 이미지나 사용자 이름, 진행률이 리더 보드에 나타나지 않음을 의미합니다. 리더 보드 새로 고침하면 변경 사항이 적용되는 데에 ~ { $minutes } 분이 걸립니다.
visibility-overlay-note = 참고: '표시'로 설정하면 <profileLink>프로필 페이지</profileLink>에서 이 설정을 변경할 수 있습니다.
show-ranking = 내 순위 표시

## Custom Goals

get-started-goals = 목표로 시작하기
create-custom-goal = 맞춤 목표 만들기
goal-type = 어떤 목표를 세우고 싶은가요?
both-speak-and-listen = 둘 다
both-speak-and-listen-long = 둘 다(말하기와 듣기)
daily-goal = 일일 목표
weekly-goal = 주간 목표
easy-difficulty = 쉬운
average-difficulty = 보통
difficult-difficulty = 어려운
pro-difficulty = 전문가 수준
lose-goal-progress-warning = 목표를 편집하면 현재 진행 상황이 없어지게 됩니다.
want-to-continue = 계속 하시겠습니까?
finish-editing = 먼저 편집을 완료 하시겠습니까?
lose-changes-warning = 지금 떠나면 변경 사항을 잃게됩니다.
build-custom-goal = 맞춤 목표를 만들기
help-reach-hours-pluralized =
    도움 주기{ NUMBER($hours) ->
       *[other] { $hours } 시간
    }{ $language } 개인 목표
help-reach-hours-general-pluralized =
    Common Voice 돕기{ NUMBER($hours) ->
       *[other] { $hours } 시간
    }언어별 개인 목표
set-a-goal = 목표를 설정하기
cant-decide = 결정할 수 없습니까?
activity-needed-calculation-plural =
    { NUMBER($totalHours) ->
       *[other] { $totalHours } 시간
    }완료 가능 { $periodMonths }{ NUMBER($periodMonths) ->
       *[other] { $periodMonths } 개월
    }만약{ NUMBER($people) ->
       *[other] { $people } 명
    }기록{ NUMBER($clipsPerDay) ->
       *[other] { $clipsPerDay } 개
    }일간
how-many-per-day = 좋습니다! 하루에 몇 개의 클립을 하시겠습니까?
how-many-a-week = 좋습니다! 일주일에 몇 개의 클립을 하시겠습니까?
which-goal-type = 말하기, 듣기 또는 둘 다를 원하십니까?
receiving-emails-info =
    목표 알림이나 내 진행 업데이트, Common Voice 뉴스레터와 같은
    이메일을 수신하도록 설정되어 있습니다.
not-receiving-emails-info =
    목표 알림이나 내 진행 업데이트, Common Voice 뉴스레터와 같은
    이메일을 수신하지 <bold>않도록</bold> 설정되어 있습니다.
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } 클립
       *[other] { $count } 클립
    }
help-share-goal = 더 많은 목소리를 찾게 도와 주세요. 목표를 공유하세요.
confirm-goal = 목표 확인
goal-interval-weekly = 주간
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = { $type }에 { $count } 개의 클립을 완료하는 일일목표를 공유하기
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = { $type }에 { $count } 개의 클립을 완료하는 주간목표를 공유하기
share-goal-type-speak = 말하기
share-goal-type-listen = 듣기
share-goal-type-both = 말하기와 듣기
# LINK will be replaced with the current URL
goal-share-text = 방금 #CommonVoice 에 음성 기여에 대한 나만의 목표를 만들었습니다. 나와 함께 기계에게 실제 사람이 말하는 방법을 가르쳐주세요. { $link }
weekly-goal-created = 주간 목표가 생성되었습니다
daily-goal-created = 일일 목표가 생성되었습니다
track-progress = 여기와 통계 페이지에서 진행 상황을 추적하세요.
return-to-edit-goal = 언제든지 목표를 수정하려면 여기로 돌아 오십시오.
share-goal = 내 목표 공유

## Goals

streaks = 목표
days =
    { $count ->
       *[other] 일
    }
recordings =
    { $count ->
       *[other] 녹음
    }
validations =
    { $count ->
       *[other] 검증
    }
