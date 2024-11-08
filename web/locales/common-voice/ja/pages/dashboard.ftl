## Dashboard

your-languages = あなたの言語
toward-next-goal = 次の目標に向けて
goal-reached = 目標を達成しました
clips-you-recorded = 音声の録音件数
clips-you-validated = 音声の検証件数
todays-recorded-progress = 今日の Common Voice に録音された数
todays-validated-progress = 今日の Common Voice で検証された数
stats = 活動状況
awards = 受賞歴
you = 自分
everyone = 全員
contribution-activity = 貢献活動
top-contributors = 上位の貢献者
recorded-clips = 録音件数
validated-clips = 検証件数
total-approved = 承認された合計時間
overall-accuracy = 全体の精度
set-visibility = 進捗の可視性を設定
visibility-explainer = この設定は、リーダーボードに進捗を公開するかどうかを制御します。非公開にすると、進行状況が隠されます。つまり、あなたのアイコン、ユーザー名、進行状況がリーダーボードに表示されなくなります。リーダーボードの更新には、変更を取り込むため { $minutes } 分程度かかります。
visibility-overlay-note = 補足: 「公開」に設定すると、この設定を<profileLink>プロファイルページ</profileLink>から変更できます
show-ranking = ランキングを表示する

## Custom Goals

get-started-goals = 目標を持って始めましょう
create-custom-goal = 自分の目標を作成する
both-speak-and-listen = 両方
both-speak-and-listen-long = 両方（話すと聴く）
daily-goal = 毎日の目標
weekly-goal = 週間目標
easy-difficulty = やさしい
average-difficulty = ふつう
difficult-difficulty = 難しい
pro-difficulty = 専門家
lose-goal-progress-warning = 目標を編集すると、既存の進捗が失われる可能性があります。
want-to-continue = 続けますか？
finish-editing = 最初に編集を終了しますか？
lose-changes-warning = ページを離れると変更が失われます
build-custom-goal = 自分の目標を作成する
set-a-goal = 目標を設定します
cant-decide = 決められない？
how-many-per-day = すばらしいです！ 1日あたりのクリップ数は？
how-many-a-week = すばらしいです！週にいくつのクリップですか？
which-goal-type = 話す、聴く、またはその両方をしたいですか？
receiving-emails-info = 現在、目標リマインダーや Common Voice に関する進捗の更新、ニュースレターなどのメールを受信するように設定されています。
not-receiving-emails-info = 現在、目標リマインダーや Common Voiceに関する進捗の更新とニュースレターなどのメールを <bold>受信しない</bold> ように設定されています。
n-clips-pluralized =
    { NUMBER($count) ->
       *[other] { $count } 個の音声クリップ
    }
help-share-goal = より多くの音声を集めて、目標を共有しましょう
confirm-goal = 目標を確認
goal-interval-weekly = 毎週
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = 「{ $type }」の毎日の目標 { $count } クリップを共有する
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = 「{ $type }」の毎週の目標 { $count } クリップを共有する
share-goal-type-speak = 話す
share-goal-type-listen = 聴く
share-goal-type-both = 話すと聴く
# LINK will be replaced with the current URL
goal-share-text = #CommonVoice に寄贈する音声の個人目標を作成しました。あなたも参加して、機械に人の話し方を教えるのを手伝ってください { $link }
weekly-goal-created = 毎週の目標が作成されました
daily-goal-created = 毎日の目標が作成されました
track-progress = ここと統計ページで進捗状況を追跡します。
return-to-edit-goal = ここに戻って、いつでも目標を編集できます。
share-goal = 目標を共有する

## Goals

streaks = 連続した期間
days =
    { $count ->
       *[other] 日間
    }
recordings =
    { $count ->
       *[other] 件録音
    }
validations =
    { $count ->
       *[other] 件検証
    }
