## Contribution

action-click = 揤
action-tap = 點選
## Languages

contribute = 貢獻
skip = 略過
shortcuts = 捷徑
clips-with-count-pluralized =
    { $count ->
        [one] <bold>{ $count }</bold> 個片段
       *[other] <bold>{ $count }</bold> 個片段
    }
goal-help-recording = 您已幫助 Common Voice 完成 <goalPercentage></goalPercentage> 的每日 { $goalValue } 錄音目標！
goal-help-validation = 您已幫助 Common Voice 完成 <goalPercentage></goalPercentage> 的每日 { $goalValue } 筆驗證目標！
contribute-more = 準備好再作 { $count } 筆了嗎？
speak-empty-state = 我們已經沒有這種語言的文字可以錄音了…
speak-empty-state-cta = 貢獻語句
speak-loading-error = 我們無法取得句子讓您錄音，請稍候再試。
record-button-label = 共你的聲音錄下來
share-title-new = <bold>請幫助我們</bold>找到更多聲音
keep-track-profile = 註冊帳號來追蹤個人貢獻進度
login-to-get-started = 請登入或註冊，即可開始使用
target-segment-first-card = 您正在朝我們的第一組目標段落數貢獻錄音
target-segment-generic-card = 您正在朝目標段落數貢獻錄音
target-segment-first-banner = 幫助 Common Voice 設定 { $locale } 的第一組目標段落數
target-segment-add-voice = 加入您的聲音
target-segment-learn-more = 了解更多

## Contribution Nav Items


## Reporting

report = 回報
report-title = 回報問題
report-ask = 這句話有什麼問題？
report-offensive-language = 冒犯人的語言
report-offensive-language-detail = 這句話當中有不尊重他人或冒犯性的語言。
report-grammar-or-spelling = 文法 / 拼字錯誤
report-grammar-or-spelling-detail = 這句話的文法或拼法有誤。
report-different-language = 其他語言
report-different-language-detail = 這句話是其他語言的句子。
report-difficult-pronounce = 難以發音
report-difficult-pronounce-detail = 這句話內底有真歹發音的文字抑是語詞。
report-offensive-speech = 冒犯人的錄音片段
report-offensive-speech-detail = 這個片段中有不尊重他人或冒犯性的語言。
report-other-comment =
    .placeholder = 附註
success = 成功
continue = 繼續
report-success = 成功送出回報內容

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = 錄音/停止
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = 重新錄製這个片節
shortcut-discard-ongoing-recording = ESC
shortcut-discard-ongoing-recording-label = 捨棄目前錄音
shortcut-submit = 轉去
shortcut-submit-label = 送出片節
request-language-text = Common Voice 敢揣無你的語言？
request-language-button = 要求新的語言

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

contribution-criteria-nav = 準則
contribution-criteria-link = 了解貢獻準則
contribution-criteria-page-title = 貢獻準則
contribution-criteria-page-description = 了解在聆聽語音片段時要注意什麼，並幫助您能錄下更多聲音！
contribution-for-example = 舉例來說
contribution-misreadings-title = 誤讀
contribution-misreadings-description = 聆聽錄音時，仔細確認錄下的語音內容與畫面上顯示的文字完全相符，有任何一點錯誤就退回更正。<br />以下是常見的錯誤類型：
contribution-misreadings-description-extended-list-1 = 錄音內容缺少了語尾助詞，例如<strong>「啦」</strong>或<strong>「了」</strong>。
contribution-misreadings-description-extended-list-2 = 缺少<strong>「們」</strong>等量詞或複數型態錯誤。
contribution-misreadings-description-extended-list-3 = 閱讀時略過或多了某些字。例如「錄音的注意事項」一句中，只唸出「錄音注意事項」（未唸出「的」字），或唸成「錄音時的注意事項」（多出「時」字）。
contribution-misreadings-description-extended-list-4 = 因為太快按下停止錄音而導致句尾被截斷。
contribution-misreadings-description-extended-list-5 = 錄音中多次嘗試念出某些文字。
contribution-misreadings-example-1-title = 三疊紀的大恐龍。
contribution-misreadings-example-2-title = 三疊紀的恐龍。
contribution-misreadings-example-2-explanation = （少了「大」字）
contribution-misreadings-example-3-title = 三疊紀的大恐...。
contribution-misreadings-example-3-explanation = （錄音的句尾被截斷）
contribution-misreadings-example-4-title = 三疊紀的好大恐龍。
contribution-misreadings-example-4-explanation = （錄音內容比實際的句子多了某些字）
contribution-misreadings-example-5-title = 我們要出去買咖啡。
contribution-misreadings-example-6-title = 我們要去買咖啡。
contribution-misreadings-example-6-explanation = （少了「出」）
contribution-misreadings-example-7-title = 我們要出去買杯咖啡。
contribution-misreadings-example-7-explanation = （原句中沒有「杯」）
contribution-misreadings-example-8-title = 大黃蜂路過。
contribution-misreadings-example-8-explanation = （內容完全不符）
contribution-varying-pronunciations-title = 確認發音
contribution-varying-pronunciations-description = 因為發音錯誤而拒絕某些錄音時，請特別小心。例如捲舌不捲舌、一字多音的常見讀法⋯⋯等，世界各地都有華語使用者，某些地區的口音或習慣讀音可能與你的所在地相差甚遠。對於不同口音的錄音者，請保持一定的彈性。
contribution-varying-pronunciations-description-extended = 另一方面，如果你很肯定錄音者根本不認識這個字，只是在有邊讀邊、亂猜讀音，請果斷拒絕。如果無法確定，請按略過鈕。
contribution-varying-pronunciations-example-1-title = 主角戴了一頂法國貝雷帽。
contribution-varying-pronunciations-example-1-explanation = （念為「主 ㄐㄩㄝˊ」或「主 ㄐㄧㄠˇ」、「ㄈㄚˇ國」或「ㄈㄚˋ國」皆可）
contribution-varying-pronunciations-example-2-title = 只是一杯蜂蜜
contribution-varying-pronunciations-example-2-explanation = （念成「ㄗˇ」是或「ㄓˇ」是，「ㄈㄥ」蜜或「ㄏㄨㄥ」蜜，基本上只是錄音者的口音發音習慣，不應視為錯誤）
contribution-background-noise-title = 背景噪音
contribution-background-noise-description = 我們希望機器模型能適應多樣化的背景噪音（甚至是很大的聲音），只要你仍然能聽見每一個字即可。錄到小聲的背景音樂也沒問題，但太大聲讓你無法聽出每一個字就不行。
contribution-background-noise-description-extended = 除非你仍可完整聽到每一個字，否則請拒絕聽起來斷斷續續的錄音。
contribution-background-noise-example-1-fixed-title = <strong>[噴嚏聲]</strong> 三疊紀的大 <strong>[咳嗽聲]</strong> 恐龍。
contribution-background-noise-example-2-fixed-title = 三疊ㄐ... <strong>[咳]</strong> 大恐龍。
contribution-background-noise-example-2-explanation = （聽不清楚某些字）
contribution-background-noise-example-3-fixed-title = <strong>[沒聲音]</strong> 疊紀的 <strong>[爆音]</strong> 龍。
contribution-background-voices-title = 背景噪音
contribution-background-voices-description = 背景有一些模糊人聲沒關係，但我們不希望讓機器誤聽到多餘的字。如果你聽到錄音中混入了不在句子中的字，請拒絕該錄音。通常是錄音時開著電視、或者旁邊有人說話時發生。
contribution-background-voices-description-extended = 除非你仍可完整聽到每一個字，否則請拒絕聽起來斷斷續續的錄音。
contribution-background-voices-example-1-title = 三疊紀的大恐龍 <strong>（錄音者正在錄音）</strong>
contribution-background-voices-example-1-explanation = 你要不要來？<strong>（其他人在背後說話）</strong>
contribution-volume-title = 音量大小
contribution-volume-description = 不同的錄音者自然會有音量差異。如果音量過大讓語音爆掉，或者（更常見）太小聲，不看句子就聽不懂時，請拒絕該錄音。
contribution-reader-effects-title = 聲音的表現
contribution-reader-effects-description = 大部分的錄音者是以日常說話的方式錄製。當你偶而聽到「不正常」的錄音，例如用喊的、氣音、或者「戲劇性」的演出時，仍可以接受。但請拒絕把句子唱出來，或是由電腦合成的聲音。
contribution-just-unsure-title = 無法決定嗎？
contribution-just-unsure-description = 如果你遇到本指南中沒有涵蓋的狀況，還請自行盡力判斷。如果真的很難決定，直接按下「略過」到下一句去吧。
see-more = <chevron></chevron>看更多
see-less = <chevron></chevron>看更少

