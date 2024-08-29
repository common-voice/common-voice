action-click = 点击
action-tap = 点按
contribute = 参与贡献
review = 审核
skip = 跳过
shortcuts = 快捷键
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> 个片段
       *[other] <bold>{ $count }</bold> 个片段
    }
goal-help-recording = 您已帮助 Common Voice 达成 <goalPercentage></goalPercentage> 的每日 { $goalValue } 录音目标！
goal-help-validation = 您已帮助 Common Voice 达成 <goalPercentage></goalPercentage> 的每日 { $goalValue } 验证目标！
contribute-more = 准备好再来 { $count } 条了吗？
speak-empty-state = 我们已经没有这种语言的文本可以录音了…
no-sentences-for-variants = 您的语言变体的语句已经处理完了！如果方便，您可以更改设置以查看您的语言中的其他语句。
speak-empty-state-cta = 贡献语句
speak-loading-error = 暂无语句供您录音，请稍后再试。
record-button-label = 录下您的声音
share-title-new = <bold>请帮助我们</bold>找到更多声音
keep-track-profile = 创建账户跟踪个人贡献进度
login-to-get-started = 请完成登录或注册，即可开始使用
target-segment-first-card = 您为我们的第一段目标细分录音作出了贡献
target-segment-generic-card = 您正朝着目标段落数贡献录音
target-segment-first-banner = 帮助在 Common Voice 创建 { $locale } 的第一段目标细分语音
target-segment-add-voice = 添加您的声音
target-segment-learn-more = 详细了解
change-preferences = 更改首选项

## Contribution Nav Items

contribute-voice-collection-nav-header = 收集语音
contribute-sentence-collection-nav-header = 收集语句

## Reporting

report = 反馈
report-title = 提交反馈
report-ask = 这句话存在什么问题？
report-offensive-language = 冒犯性的语言
report-offensive-language-detail = 这句话有不尊重或冒犯性的语言。
report-grammar-or-spelling = 语法 / 拼写错误
report-grammar-or-spelling-detail = 这句话的语法或拼写有误。
report-different-language = 其他语言
report-different-language-detail = 这句话是其他语言的句子。
report-difficult-pronounce = 难以发音
report-difficult-pronounce-detail = 其中包含难以阅读或发音的单词或短语。
report-offensive-speech = 冒犯性的录音片段
report-offensive-speech-detail = 这个片段中有不尊重或冒犯性的语言。
report-other-comment =
    .placeholder = 备注
success = 成功
continue = 继续
report-success = 反馈提交成功

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = 录音/停止
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = 重新录制片段
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = 丢弃进行中的录音
shortcut-submit = 返回
shortcut-submit-label = 提交片段
request-language-text = 没在 Common Voice 看到您的语言吗？
request-language-button = 请求新语言

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = 播放/停止
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Validation criteria

contribution-criteria-nav = 准则
contribution-criteria-link = 了解贡献准则
contribution-criteria-page-title = 贡献准则
contribution-criteria-page-description = 了解在聆听语音片段时需注意些什么，此举有助于您录制更多片段。
contribution-for-example = 例如
contribution-misreadings-title = 误读
contribution-misreadings-description = 聆听语音片段时，请仔细核对语音片段中的内容是否与屏幕上显示的文字完全一致。哪怕只有微小的不一致，都请驳回它。<br />下面列出了一些非常常见的错误：
contribution-misreadings-description-extended-list-1 = 录音内容缺少句首的<strong>“A”</strong>或<strong>“The”</strong>。
contribution-misreadings-description-extended-list-2 = 词尾缺少 <strong>'s'</strong>。
contribution-misreadings-description-extended-list-3 = 阅读实际并不存在的缩写，例如是“We're”而不是“We are”，反之亦然。
contribution-misreadings-description-extended-list-4 = 由于过快地结束录音而没有录入最后一个词。
contribution-misreadings-description-extended-list-5 = 朗读某个词语时多次尝试。
contribution-misreadings-example-1-title = The giant dinosaurs of the Triassic.
contribution-misreadings-example-2-title = The giant dinosaur of the Triassic.
contribution-misreadings-example-2-explanation = [应该是“dinosaurs”]
contribution-misreadings-example-3-title = The giant dinosaurs of the Triassi-.
contribution-misreadings-example-3-explanation = [录音在最后一个词结束前终止]
contribution-misreadings-example-4-title = The giant dinosaurs of the Triassic. Yes.
contribution-misreadings-example-4-explanation = [所录内容多于要求文本]
contribution-misreadings-example-5-title = We are going out to get coffee.
contribution-misreadings-example-6-title = We’re going out to get coffee.
contribution-misreadings-example-6-explanation = [应该是“We are”]
contribution-misreadings-example-7-title = We are going out to get a coffee.
contribution-misreadings-example-7-explanation = [原文里没有“a”]
contribution-misreadings-example-8-title = The bumblebee sped by.
contribution-misreadings-example-8-explanation = [内容不符]
contribution-varying-pronunciations-title = 不同发音
contribution-varying-pronunciations-description = 在以朗读者发音错误、将重音放在错误的地方或明显忽略了问号为由驳回片段之前要谨慎行事。世界各地有各种各样的发音，其中一些您可能在当地社区没有听到。请为那些可能与您发音不同的人提供欣赏的空间。
contribution-varying-pronunciations-description-extended = 另一方面，如果你认为朗读者此前从未遇到过这个词，并且单纯的对它的发音进行了错误的猜测，请将其驳回。如果你不确定，请按“跳过”按钮。
contribution-varying-pronunciations-example-1-title = On his head he wore a beret.
contribution-varying-pronunciations-example-1-explanation = [“Beret”的重音无论是在第一个音节（英式英语）或是第二个（美式英语）都可以]
contribution-varying-pronunciations-example-2-title = His hand was rais-ed.
contribution-varying-pronunciations-example-2-explanation = [英语中的“Raised”的发音一直为一个音节，而不是两个]
contribution-background-noise-title = 背景噪音
contribution-background-noise-description = 我们希望机器学习算法能够处理多样的背景噪音。一定程度的噪音是可接受的，只要它不妨碍您辨识整段文字。可接受安静的背景音乐，过于嘈杂以至于影响您辨识任何词语的音乐则不可以。
contribution-background-noise-description-extended = 如果录音中断或有噪音，除非仍可听清整段文字，否则请将其驳回。
contribution-background-noise-example-1-fixed-title = <strong>[喷嚏]</strong> The giant dinosaurs of the </strong>[咳嗽]</strong> Triassic.
contribution-background-noise-example-2-fixed-title = The giant dino <strong>[咳嗽]</strong> the Triassic.
contribution-background-noise-example-2-explanation = [听不清部分文字]
contribution-background-noise-example-3-fixed-title = <strong>[噼啪声]</strong> giant dinosaurs of <strong>[噼啪声]</strong> -riassic.
contribution-background-voices-title = 背景噪音
contribution-background-voices-description = 一定程度的噪音是可接受的，但我们不希望有太大的声音，这可能导致机器算法识别出书面文本中没有的词。如果您能听到明显的文字以外的词语，这个片段应该被驳回。这种情况常发生在电视开着，或者附近有谈话的地方。
contribution-background-voices-description-extended = 如果录音中断，或有噼啪声，请驳回，除非仍能听到全部的文字。
contribution-background-voices-example-1-title = The giant dinosaurs of the Triassic. <strong>[其他声源]</strong>
contribution-background-voices-example-1-explanation = Are you coming? <strong>[被另一人打断]</strong>
contribution-volume-title = 音量
contribution-volume-description = 朗读者之间的声音大小会有自然差异。仅当音量太高以至于录音中断，或（更常见的情况）音量太小以至于不参考书面文字您就听不到正在说的内容时，才驳回。
contribution-reader-effects-title = 朗读者因素
contribution-reader-effects-description = 大多数录音都是人们用自然的声音说话。但您可以偶尔接受非标准录音，即大喊大叫、低声说话或明显用“抑扬顿挫”的声音说话。请驳回唱出来的录音和那些使用计算机合成的声音。
contribution-just-unsure-title = 仍有不解之处？
contribution-just-unsure-description = 如果遇到了这些准则没有涵盖的内容，请根据您的最佳判断来投票。如果真的无法决定，请使用跳过按钮，继续下一个录音。
see-more = <chevron></chevron>查看更多
see-less = <chevron></chevron>折叠
