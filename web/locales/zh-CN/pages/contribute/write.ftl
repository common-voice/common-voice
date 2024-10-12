## WRITE PAGE

write = 撰写
write-instruction = 添加 <icon></icon> 公有领域的语句
write-page-subtitle = 此处贡献的语句将被添加到采用 cc-0 许可证的公开数据集中。
sentence =
    .label = 语句
sentence-input-placeholder = 请在此输入您的公有领域语句
small-batch-sentence-input-placeholder = 请在此输入您的公有领域语句
citation-input-placeholder = 引用语句出处（必填）
citation =
    .label = 引用
sc-write-submit-confirm = 我确认这句话以<wikipediaLink>公有领域</wikipediaLink>授权并且我有权上传。
sc-review-write-title = 我可以添加什么语句？
sc-review-small-batch-title = 批量添加语句的方法
new-sentence-rule-1 = <noCopyright>无版权</noCopyright>限制（<cc0>cc-0</cc0>）
new-sentence-rule-2 = 少于 15 个字
new-sentence-rule-3 = 使用正确的语法
new-sentence-rule-4 = 使用正确的拼写和标点符号
new-sentence-rule-5 = 没有数字和特殊字符
new-sentence-rule-6 = 没有外国字母
new-sentence-rule-7 = 引用恰当
new-sentence-rule-8 = 语句通俗自然（便于阅读）
login-instruction-multiple-sentences = <loginLink>登录</loginLink>或<loginLink>注册</loginLink>以批量添加语句
how-to-cite = 如何引用？
how-to-cite-explanation-bold = 引用 URL 链接或作品全名。
how-to-cite-explanation = 如果来源于您自己，则只需注明<italicizedText>“Self Citation”</italicizedText>。我们需要知道您在哪里得到这些内容，以便检查其是否处于公有领域并且无版权限制。有关引用的更多信息，请参阅我们的<guidelinesLink>准则页面</guidelinesLink>。
guidelines = 准则
contact-us = 联系我们
add-sentence-success = 已收集 1 条语句
add-sentence-error = 添加语句时报错
required-field = 请填写此字段。
single-sentence-submission = 提交单句
small-batch-sentence-submission = 小批量语句提交
bulk-sentence-submission = 批量提交语句
single-sentence = 单句
small-batch-sentence = 小批量
bulk-sentence = 大批量
sentence-domain-combobox-label = 语句领域
sentence-domain-select-placeholder = 最多选择三个领域
# Sentence Domain dropdown option
agriculture_food = 农业与食品
# Sentence Domain dropdown option
automotive_transport = 汽车与交通
# Sentence Domain dropdown option
finance = 金融
# Sentence Domain dropdown option
service_retail = 服务与零售
# Sentence Domain dropdown option
general = 常规
# Sentence Domain dropdown option
healthcare = 医疗
# Sentence Domain dropdown option
history_law_government = 历史、法律与政府
# Sentence Domain dropdown option
language_fundamentals = 语言基础（例如数字、字母、货币）
# Sentence Domain dropdown option
media_entertainment = 媒体与娱乐
# Sentence Domain dropdown option
nature_environment = 自然与环境
# Sentence Domain dropdown option
news_current_affairs = 新闻与时事
# Sentence Domain dropdown option
technology_robotics = 技术与机器人
sentence-variant-select-label = 语句变体
sentence-variant-select-placeholder = 选择一个变体（非必选）
sentence-variant-select-multiple-variants = 通用语言/多个变体

## BULK SUBMISSION 

# <icon></icon> will be replaced with an icon that represents upload
sc-bulk-upload-header = 上传 <icon></icon> 公有领域的句子
sc-bulk-upload-instruction = 将文件拖放到此处或<uploadButton>点此上传</uploadButton>
sc-bulk-upload-instruction-drop = 将文件拖放到此处即可上传
bulk-upload-additional-information = 若要提供关于此文件的附加信息，请联系 <emailFragment>commonvoice@mozilla.com</emailFragment>
template-file-additional-information = 若要提供模板中未包括的关于此文件的附加信息，请联系 <emailFragment>commonvoice@mozilla.com</emailFragment>
try-upload-again = 将文件拖至此处重试
try-upload-again-md = 请尝试重新上传
select-file = 选择文件
select-file-mobile = 选择要上传的文件
accepted-files = 文件类型：仅接受 .tsv
minimum-sentences = 文件内语句数下限：1000 条
maximum-file-size = 文件最大：25 MB
what-needs-to-be-in-file = 文件要包含什么？
what-needs-to-be-in-file-explanation = 请查看我们的<templateFileLink>模板文件</templateFileLink>。您的语句应该清晰易读、语法正确且不受版权保护（CC0或经原创作者许可）。提交的语句长度在 10-15 秒并且避免包含数字、专有名词和特殊字符。
upload-progress-text = 正在上传...
sc-bulk-submit-confirm = 我确认这些句子都以<wikipediaLink>公有领域条款</wikipediaLink>授权公开，并且我有权上传。
bulk-upload-success-toast = 已批量上传语句
bulk-upload-failed-toast = 上传失败，请重试。
bulk-submission-success-header = 感谢您的批量提交！
bulk-submission-success-subheader = 您正在帮助 Common Voice 达到我们的每日语句目标！
upload-more-btn-text = 上传更多语句吗？
file-invalid-type = 文件无效
file-too-large = 文件太大
file-too-small = 文件太小
too-many-files = 文件过多

## SMALL BATCH SUBMISSION

# <icon></icon> will be replaced with an icon that represents writing a sentence
small-batch-instruction = <icon></icon> 批量添加公有领域语句
multiple-sentences-error = 您无法一次提交多条语句
exceeds-small-batch-limit-error = 无法提交超过 1000 条语句
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-toast-message-minutes = 速率超限，请在 { $retryLimit } 分钟后再试
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-toast-message-seconds = 速率超限，请在 { $retryLimit } 秒后再试
# $retryLimit represents the amount of time in minutes a user has to wait to retry an upload
rate-limit-message-minutes = 您已达此页面的提交限制，请过 { $retryLimit } 分钟再提交其他语句。感谢您的耐心等候！
# $retryLimit represents the amount of time in seconds a user has to wait to retry an upload
rate-limit-message-seconds = 您已达此页面的提交限制，请过 { $retryLimit } 秒再提交其他语句。感谢您的耐心等候！
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
add-small-batch-success = 已收集 { $totalSentences } 条语句中的 { $uploadedSentences } 条
# $uploadedSentences represents the number of sentences accepted from the small batch submission, $totalSentences represents the total number of sentences in the small batch submission
small-batch-response-message = 已收集 { $totalSentences } 条语句中的 { $uploadedSentences } 条。<downloadLink>点此</downloadLink>下载被驳回的语句。
small-batch-sentences-rule-1 = 请遵照“我可以添加什么语句？”章节中的准则
small-batch-sentences-rule-2 = 每行一条语句
small-batch-sentences-rule-4 = 最多可添加 1,000 条语句
