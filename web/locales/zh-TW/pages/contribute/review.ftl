## REVIEW

sc-review-lang-not-selected = 您尚未選擇任何語言，請到<profileLink>個人資料頁面</profileLink>選擇要貢獻的語言。
sc-review-title = 審核句子
sc-review-loading = 正在載入語句…
sc-review-select-language = 請選擇語言來審核句子。
sc-review-no-sentences = 沒有可以審核的語句。<addLink>馬上來加句子！</addLink>
sc-review-form-prompt =
    .message = 尚未送出語句審核結果，確定嗎？
sc-review-form-usage = 向右滑可以通過審核句子、向左滑拒絕、向上滑略過。<strong>別忘記送出您的審核結果！</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = 來源：{ $sentenceSource }
sc-review-form-button-reject = 退回
sc-review-form-button-skip = 略過
sc-review-form-button-approve = 通過
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = 您也可以使用快速鍵：{ sc-review-form-button-approve-shortcut } 來通過審核、{ sc-review-form-button-reject-shortcut } 來退回、{ sc-review-form-button-skip-shortcut } 來略過
sc-review-form-button-submit =
    .submitText = 完成審核
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] 未審核語句。
       *[other] 已審核 { $sentences } 句，感謝您！
    }
sc-review-form-review-failure = 無法儲存審核結果，請稍候再試。
sc-review-link = 審核

## REVIEW CRITERIA

sc-criteria-modal = ⓘ 審核標準
sc-criteria-title = 審核標準
sc-criteria-make-sure = 請確認句子符合下列條件：
sc-criteria-item-1 = 句子必須拼得正確。
sc-criteria-item-2 = 句子的文法必須正確。
sc-criteria-item-3 = 句子必須說得出來。
sc-criteria-item-4 = 若句子符合上述標準，請點擊右方的「通過」按鈕。
sc-criteria-item-5-2 = 若句子不符合上述條件，點擊「退回」按鈕。若您不確定句子可不可用，也可以略過，跳到下一句。
sc-criteria-item-6 = 若您已經沒有句子可以審核了，請幫助我們收集更多句子！
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = 確認 <icon></icon> 是一句符合語法的句子嗎？
sc-review-rules-title = 句子內容符合準則嗎？
sc-review-empty-state = 此語言目前沒有需要審核的語句。
report-sc-different-language = 其他語言
report-sc-different-language-detail = 這句話是用其他語言撰寫的句子。
sentences-fetch-error = 取得句子時發生錯誤
review-error = 審核此句子時發生錯誤
review-error-rate-limit-exceeded = 您操作得太快了，請花點時間確認句子內容是否正確。
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = 我們有些重大變更
