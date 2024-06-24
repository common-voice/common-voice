## Contribution

action-click = 撳
action-tap = 敲
## Languages

contribute = 貢獻
skip = 跳過
shortcuts = 捷徑
clips-with-count-pluralized =
    { $count ->
       *[one] 片段
    }
goal-help-recording = 閣下已幫助 Common Voice 完成每日 { $goalValue } 錄音目標嘅<goalPercentage></goalPercentage>！
goal-help-validation = 閣下已幫助 Common Voice 達到我哋每日 { $goalValue } 驗證目標嘅 <goalPercentage></goalPercentage>！
contribute-more =
    { $count ->
       *[one] 準備好做多{ $count } 個未？
    }
speak-empty-state = 呢個語言可以錄嘅句子已經錄晒啦⋯⋯
speak-empty-state-cta = 貢獻句子
speak-loading-error = 我哋冇晒句子畀你讀嘞，遲啲再試啦。
record-button-label = 錄低你把聲
share-title-new = <bold>幫我哋</bold>揾多啲聲音
keep-track-profile = 建立個人檔案，紀錄閣下嘅進度
login-to-get-started = 登入或注冊嚟開始
target-segment-first-card = 閣下正為我哋第一條目標細分群體貢獻錄音
target-segment-generic-card = 你現正貢獻緊錄音畀一個目標細分群體
target-segment-first-banner = 幫 Common Voice 創立 { $locale } 嘅第一個目標細分群體
target-segment-add-voice = 加入你嘅聲音
target-segment-learn-more = 了解更多

## Contribution Nav Items


## Reporting

report = 報告
report-title = 提交一個報告
report-ask = 呢句有咩問題？
report-offensive-language = 冒犯性言語
report-offensive-language-detail = 呢句唔尊重人或者語帶冒犯。
report-grammar-or-spelling = 文法 / 串法錯誤
report-grammar-or-spelling-detail = 呢句有文法或串法錯誤。
report-different-language = 另一種語言
report-different-language-detail = 呢句係另一種語言嘅句子。
report-difficult-pronounce = 好難發音
report-difficult-pronounce-detail = 句野含有一啲好難閲讀同發音嘅字。
report-offensive-speech = 冒犯性言論
report-offensive-speech-detail = 呢個片段中有唔尊重人哋或冒犯性語言。
report-other-comment =
    .placeholder = 註解
success = 成功
continue = 繼續
report-success = 成功送出報告

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = 錄音/停止
shortcut-rerecord-toggle = [1-5]
shortcut-rerecord-toggle-label = 重新錄音
shortcut-discard-ongoing-recording = 退出
shortcut-discard-ongoing-recording-label = 捨棄當前錄音
shortcut-submit = 返回
shortcut-submit-label = 提交錄音
request-language-text = 喺 Common Voice 度見唔到你嘅語言？
request-language-button = 申請增加一種語言

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
contribution-criteria-page-description = 了解聽錄音嘅時候要注意啲乜，同埋令你嘅錄音片段更加豐富！
contribution-for-example = 譬如
contribution-misreadings-title = 錯讀
contribution-misreadings-description = 聽緊錄音嘅時候，認真睇下啲字同錄音係咪完全一致；有少少錯就唔可以批准通過。<br />常見嘅錯誤包括：
contribution-misreadings-description-extended-list-1 = 漏咗詞頭嘅量詞，例如「<strong>個</strong>」或者「<strong>啲</strong> 」。
contribution-misreadings-description-extended-list-2 = 漏咗詞尾嘅<strong>咗</strong>或者句尾嘅<strong>㗎、喇、咋、啊、喎</strong>。
contribution-misreadings-description-extended-list-3 = 讀咗啲冇寫出嚟嘅縮略，例如寫住「唔係」但係讀咗做「咪」。
contribution-misreadings-description-extended-list-4 = 太早停咗個錄音，搞到最後一隻字斷咗錄唔到
contribution-misreadings-description-extended-list-5 = 錄咗幾次先至錄得到個字
contribution-misreadings-example-1-title = 嗰啲三疊紀嘅巨型恐龍
contribution-misreadings-example-2-title = 啲三疊紀嘅巨型恐龍
contribution-misreadings-example-2-explanation = [應該係「嗰啲」唔係「啲」，讀漏咗字所以唔啱]
contribution-misreadings-example-3-title = 嗰啲三疊紀嘅巨型恐-。
contribution-misreadings-example-3-explanation = [未講完最後嗰隻字就斷咗錄音]
contribution-misreadings-example-4-title = 嗰啲三疊紀嘅巨型恐龍。好。
contribution-misreadings-example-4-explanation = [錄埋啲原句以外嘅字入去]
contribution-misreadings-example-5-title = 我哋唔係出去飲咖啡。
contribution-misreadings-example-6-title = 我哋咪出去飲咖啡。
contribution-misreadings-example-6-explanation = [應該要係「唔係」]
contribution-misreadings-example-7-title = 我哋唔係出去飲咖啡啊。
contribution-misreadings-example-7-explanation = [原本冇「啊」]
contribution-misreadings-example-8-title = 噷……
contribution-misreadings-example-8-explanation = [唔關事嘅內容]
contribution-varying-pronunciations-title = 發音差異
contribution-varying-pronunciations-description = 拒批錄音嗰陣要審慎一啲，尤其係因為讀錯，文白異讀，變調，漏咗個問號拉高等等問題。世界上有好多唔同嘅發音，有啲人嘅習慣同你可能有啲啲唔同。請理解同包容一啲講嘢方式同你有少少唔同嘅朋友。
contribution-varying-pronunciations-description-extended = 另一方面，如果你覺得個朗讀者可能唔識隻字，又估錯隻字點讀，請拒批。唔肯定嘅話，就撳跳過掣。
contribution-varying-pronunciations-example-1-title = 佢去咗銀行。
contribution-varying-pronunciations-example-1-explanation = [「銀行」第二個字讀第4調陽平，或者變調第2調陰上都得]
contribution-varying-pronunciations-example-2-title = 我有一支<strong>千 (cin1) </strong>筆。
contribution-varying-pronunciations-example-2-explanation = [喺邊一度嘅粵語入面，「鉛」同「簽」都係唔同音]
contribution-background-noise-title = 背景嘈音
contribution-background-noise-description = 我哋想啲機械學習演算法可以處理到唔同嘅背景雜音，甚至係有少少大聲嘅噪音都可以接受。前題係啲聲唔會影響到你你聽清楚錄音嘅文字。靜靜地嘅背景音樂都可以。但係音樂聲大到聽唔清講咩嘅話就唔得。
contribution-background-noise-description-extended = 如果個錄音斷開咗或者有沙沙聲，除非啲文字可以完整聽得到，否則就唔好批。
contribution-background-noise-example-1-fixed-title = <strong>[乞嚏]</strong> 三疊紀嘅 <strong>[咳]</strong> 大恐龍。
contribution-background-noise-example-2-fixed-title = 三疊紀嘅 <strong>[咳]</strong> 大恐龍。
contribution-background-noise-example-2-explanation = [部份文字聽唔到]
contribution-background-noise-example-3-fixed-title = 大<strong>[嘞嘞聲]</strong> 恐 <strong>[嘞嘞聲]</strong> 龍。
contribution-background-voices-title = 背景聲音
contribution-background-voices-description = 背景有安靜嘅人聲雜音都可以接受，但係唔可以有一把聲太突出，令機器演算法認出一啲原文冇嘅字。如果你聽到原文冇嘅字句，嗰段錄音就要拒批。一般有呢個情況就係背景開住咗電視，或者附近有其他人喺度傾偈。
contribution-background-voices-description-extended = 如果段錄音斷開咗，或者沙沙聲，除非啲字聽得清楚，否則唔好批。
contribution-background-voices-example-1-title = 嗰啲三疊紀嘅巨型恐龍。<strong>[由一把聲音讀出]</strong>
contribution-background-voices-example-1-explanation = 你嚟唔嚟㗎？<strong>[背景度有另一把聲嗌佢]</strong>
contribution-volume-title = 聲量
contribution-volume-description = 唔同嘅朗讀者自然會有聲量嘅偏差。淨係聲量大到個錄音會斷開，或者（更常見）係聲量細到冇字幕就聽唔清嗰陣，先至好唔批
contribution-reader-effects-title = 朗讀效果
contribution-reader-effects-description = 大部份錄音都係用正常聲線去錄。如果間中有啲唔標準嘅錄法，例如係大叫，細聲講嘢，或者好有「戲劇效果」噉讀，都可以接受嘅。唱歌或者電腦合成嘅錄音，就請你拒批。
contribution-just-unsure-title = 單係唔確定？
contribution-just-unsure-description = 如果你遇到呢份指引冇列出嘅情況，請用你嘅判斷去投票。如果真係決定唔到，可以用跳過掣去聽下一段錄音。
see-more = <chevron></chevron>睇多啲
see-less = <chevron></chevron>睇少啲

