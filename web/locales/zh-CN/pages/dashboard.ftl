## Dashboard

your-languages = 您的语言
toward-next-goal = 距离下一个目标
goal-reached = 目标达成
clips-you-recorded = 您录制的片段
clips-you-validated = 您验证的片段
todays-recorded-progress = 今日 Common Voice 已录片段进度
todays-validated-progress = 今日 Common Voice 已录片段进度
stats = 统计
awards = 成就
you = 您自己
everyone = 所有人
contribution-activity = 贡献记录
top-contributors = 杰出贡献者
recorded-clips = 录制的片段
validated-clips = 验证的片段
total-approved = 总核准数
overall-accuracy = 总体准确度
set-visibility = 设置是否在排行榜显示自己
visibility-explainer = 此设置项控制您的排行榜可见性。若设为“隐藏”，您的进度将仅自己可见。这意味着您的照片、用户名和贡献进度均不会出现在排行榜上。请注意，排行榜信息的刷新需等待约 { $minutes } 分钟，以生效作出的更改。
visibility-overlay-note = 注意：设为“可见”时，可在<profileLink>个人资料页面</profileLink>调整此设置
show-ranking = 显示我的排名

## Custom Goals

get-started-goals = 从设定目标开始
create-custom-goal = 创建自定义目标
goal-type = 您想要达到怎样的目标？
both-speak-and-listen = 两者
both-speak-and-listen-long = 两者（说与听）
daily-goal = 每日目标
weekly-goal = 每周目标
easy-difficulty = 简单
average-difficulty = 普通
difficult-difficulty = 困难
pro-difficulty = 硬核
lose-goal-progress-warning = 因编辑目标，您可能会丢失现有进度。
want-to-continue = 是否继续？
finish-editing = 要先完成编辑吗？
lose-changes-warning = 若现在离开，将丢失所有更改
build-custom-goal = 建立自定义目标
help-reach-hours-pluralized =
    助力{ $language }的片段达到{ NUMBER($hours) ->
       *[other] { $hours } 小时
    }的个人目标
help-reach-hours-general-pluralized =
    助力 Common Voice 的任一语言达到{ NUMBER($hours) ->
       *[other] { $hours } 小时
    }的个人目标
set-a-goal = 设定目标
cant-decide = 无法决定？
activity-needed-calculation-plural =
    若有 { NUMBER($people) ->
       *[other] { $people } 个人
    }每天录下 { NUMBER($clipsPerDay) ->
       *[other] { $clipsPerDay } 个片段
    }，就可以在 { NUMBER($periodMonths) ->
       *[other] { $periodMonths } 个月
    }内达成{ NUMBER($totalHours) ->
       *[other] { $totalHours } 小时
    }录音片段的目标。
how-many-per-day = 好的，每天要贡献几个片段？
how-many-a-week = 好的，每周要贡献几个片段？
which-goal-type = 想要录音、聆听确认，还是两者都要？
receiving-emails-info = 您当前已设为接收目标提醒、我的进度更新、Common Voice 新闻通讯等邮件
not-receiving-emails-info = 您当前已设为<bold>拒绝</bold>接收诸如目标提醒、我的进度更新与 Common Voice 的相关新闻通讯。
n-clips-pluralized =
    { NUMBER($count) ->
        [one] { $count } 个片段
       *[other] { $count } 个片段
    }
help-share-goal = 帮助我们找到更多人献声，分享您的目标
confirm-goal = 确认目标
goal-interval-weekly = 每周
# $type is one of share-goal-type-*
share-n-daily-contribution-goal = 分享您的每日 { $type } 目标：{ $count } 个片段
# $type is one of share-goal-type-*
share-n-weekly-contribution-goal = 分享您的每周 { $type } 目标：{ $count } 个片段
share-goal-type-speak = 说话
share-goal-type-listen = 聆听
share-goal-type-both = 说话和聆听
# LINK will be replaced with the current URL
goal-share-text = 我刚刚为 #CommonVoice 设立了献声目标 -- 请与我一同，帮助教会机器真人的说话方式。{ $link }
weekly-goal-created = 您的每周目标已创建
daily-goal-created = 您的每日目标已创建
track-progress = 您可以在此或到统计页面，跟踪进度。
return-to-edit-goal = 您可随时返回此处修改目标。
share-goal = 分享我的目标

## Goals

streaks = 连续第
days =
    { $count ->
       *[other] 天
    }
recordings =
    { $count ->
       *[other] 录音
    }
validations =
    { $count ->
       *[other] 验证
    }
