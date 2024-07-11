## REVIEW

sc-review-lang-not-selected = 您尚未选择任何语言，请到<profileLink>个人资料页</profileLink>选择要贡献的语言。
sc-review-title = 审核句子
sc-review-loading = 正在加载句子...
sc-review-select-language = 请选择审核句子的语言。
sc-review-no-sentences = 沒有需要审核的句子。<addLink>现在添加新句子！</addLink>
sc-review-form-prompt =
    .message = 尚未提交句子审核结果，确定吗？
sc-review-form-usage = 向右滑通过句子、向左滑驳回、向上滑跳过。<strong>别忘记提交您的审核结果！</strong>
# Variables:
#   $sentenceSource (Number) - Associated source the user filled out when uploading the sentence
sc-review-form-source = 来源：{ $sentenceSource }
sc-review-form-button-reject = 驳回
sc-review-form-button-skip = 跳过
sc-review-form-button-approve = 通过
# Keyboard shortcut to use to approve a sentence (sc-review-form-button-approve)
sc-review-form-button-approve-shortcut = Y
# Keyboard shortcut to use to reject a sentence (sc-review-form-button-reject)
sc-review-form-button-reject-shortcut = N
# Keyboard shortcut to use to skip a sentence (sc-review-form-button-skip)
sc-review-form-button-skip-shortcut = S
sc-review-form-keyboard-usage-custom = 您可以使用键盘快捷键：{ sc-review-form-button-approve-shortcut } 键 - 通过，{ sc-review-form-button-reject-shortcut } 键 - 驳回，{ sc-review-form-button-skip-shortcut } 键 - 跳过
sc-review-form-button-submit =
    .submitText = 完成审核
# Variables:
#   $sentences (Number) - Number of sentences the user has reviewed in this session
sc-review-form-reviewed-message =
    { $sentences ->
        [0] 未审核句子。
       *[other] 已审核 { $sentences } 句，感谢您！
    }
sc-review-form-review-failure = 无法保存审核结果，请稍候重试。
sc-review-link = 审核

## REVIEW CRITERIA

sc-criteria-modal = ⓘ 审核标准
sc-criteria-title = 审核标准
sc-criteria-make-sure = 请确保句子符合以下标准：
sc-criteria-item-1 = 句子用字必须正确。
sc-criteria-item-2 = 句子必须语法正确。
sc-criteria-item-3 = 句子必须说得出来。
sc-criteria-item-4 = 若句子符合上述标准，请点击右方的“通过”按钮。
sc-criteria-item-5-2 = 若句子未达到上述条件，请点击“驳回”按钮。若您不确定句子是否可用，也可以略过，跳到下一句。
sc-criteria-item-6 = 若您已经没有句子可以审核了，请帮助我们收集更多句子！
# <icon></icon> will be replace with an icon that represents review
sc-review-instruction = 检查 <icon><icon> 语句语法是否正确
sc-review-rules-title = 该语句是否符合准则？
sc-review-empty-state = 该语言目前没有需要审核的语句。
report-sc-different-language = 其他语言
report-sc-different-language-detail = 它与我正在审查的语言不同。
sentences-fetch-error = 获取语句时出错
review-error = 审阅语句时发生错误
review-error-rate-limit-exceeded = 别太匆忙。请多花些时间来审核语句，确认其是否正确。
# SENTENCE-COLLECTOR-REDIRECT PAGE
sc-redirect-page-title = 重磅更新
sc-redirect-page-subtitle-1 = 语句收集工具已迁移到 Common Voice 主平台，您现在可以直接在 Common Voice 上<writeURL>撰写</writeURL>和<reviewURL>审核</reviewURL>语句。
sc-redirect-page-subtitle-2 = 在 <matrixLink>Matrix</matrixLink>、<discourseLink>Discourse</discourseLink> 上，或<emailLink>发邮件</emailLink>向我们提问。
