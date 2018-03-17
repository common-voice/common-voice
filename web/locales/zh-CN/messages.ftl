## General

yes-receive-emails = 是的，给我发送邮件，我想了解 Common Voice 项目。
stayintouch = 我们在 Mozilla 正围绕语音技术建立一个社区。 我们想与新技术、新数据来源保持联系，也想知道您会如何使用这些数据。
privacy-info = 我们承诺谨慎处理您的信息。阅读我们的<privacyLink>隐私声明</privacyLink>详细了解。
return-to-cv = 返回 Common Voice

## Layout

speak = 说话
datasets = 数据集
profile = 用户资料
help = 帮助
contact = 联系我们
privacy = 隐私
terms = 使用条款
cookies = Cookies
faq = 常见问题
content-license-text = 内容遵循<licenseLink>Creative Commons 许可</licenseLink>授权使用
share-title = 帮助我们找到更多人贡献他们的声音！

## Home Page

home-title = Common Voice 项目是 Mozilla 的倡议，旨在帮助训练机器像真人一样说话。
home-cta = 大声说出来，贡献于此！
wall-of-text-start = 语音应该是自然、人性的。我们因此着迷于为我们的机器创造实用的语音技术。但要创造一个语音系统，需要大量的语音数据。
wall-of-text-more-mobile = 大公司使用的大部分数据对大多数人来说都无法取得。我们认为这会扼杀创新，因而推出了 Common Voice 项目。这个项目旨在促进语音识别对所有人的开放。
wall-of-text-more-desktop = 现在，您可以贡献出您的声音，帮助我们建立一个开源的语音数据库，任何人都可以使用它来为设备和网络制作创新的应用程序。<lineBreak> </lineBreak> 朗读一个句子以帮助计算机学习真人说话。复查其他贡献者的工作以提高质量。就这么简单!
show-wall-of-text = 了解更多
help-us-title = 帮助我们验证语句！
help-us-explain = 请点击播放，仔细聆听并告诉我们：他们是否准确地说出了下面的句子？
request-language-text = 没在 Common Voice 看到您的语言吗？
request-language-button = 请求新语言

## ProjectStatus

status-title = 总体项目状态：看看我们已经走了多远！
status-contribute = 贡献您的声音
status-loading = 加载中…
status-hours =
    { $hours ->
       *[other] 目前已验证 { $hours } 小时！
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = 下个目标：{ $goal }
status-more-soon = 更多语言即将到来！

## ProfileForm

profile-form-email =
    .label = 电子邮箱
profile-form-username =
    .label = 用户名
profile-form-language =
    .label = 语言
profile-form-more-languages = 更多语言即将到来！
profile-form-accent =
    .label = 口音
profile-form-age =
    .label = 年龄
profile-form-gender =
    .label = 性别

## FAQ

faq-title = 常见问题
faq-what-q = Common Voice 是什么？
faq-what-a = 语音识别技术可能会革命性地改变我们与机器的交互方式，但现存的系统既昂贵又由个体私有。Common Voice 旨在使每个人都能容易地利用语音识别技术。人们自发贡献语音而打造出的庞大数据库将能确保任何人都能快速、轻松地训练出支持语音识别的应用程序。所有语音数据都将可供开发人员使用。
faq-important-q = 为什么很重要？
faq-important-a = 语音是自然的，语音是人类的。这是最容易且最自然的沟通方式。我们希望开发者能够从实时翻译器到支持语音的行政助理中构建惊人的内容。但是，目前还没有足够的公开数据来构建这些类型的应用程序。我们希望 Common Voice 能给予开发者他们创新所需要的东西。
faq-get-q = 我要如何取得 Common Voice 的数据？
faq-get-a = 目前该数据集可在<licenseLink> CC-0 </licenseLink>许可下的<downloadLink>下载页面</downloadLink>上获取。
faq-mission-q = 为什么 Common Voice 是 Mozilla 使命的一部分？
faq-mission-a = Mozilla 致力于保持网络开放且人人可用。要做到这一点，我们需要通过像 Common Voice 这样的项目来增强 Web 创造者的力量。随着语音技术扩散到小众应用领域，我们相信他们必须为所有用户提供同样好的服务。在构建和测试语音技术时，我们认为需要囊括更多的语言、口音和人口特征。Mozilla 希望看到一个健康、充满活力的互联网。我们须要让新的创想家们能获得语音数据，来打造全新的非凡项目。Common Voice 将成为公共资源，有力支持 Mozilla 团队和世界各地的开发者们。
faq-native-q = 我的母语不是{ $lang }，而且我说话带有口音，你们需要这样的语音吗？
faq-native-a = 是的，我们绝对需要您的语音！Common Voice 的目的之一就是尽可能多地收集不同的口音，让计算机能更好地理解<bold>每个人</bold>的话语。
faq-firefox-q = Firefox 会通过 Common Voice 项目增加语音转文本功能吗？
faq-firefox-a = Common Voice 具有无限潜力，我们的确在探索 Firefox 等 Mozilla 产品中语音方面的交互。
faq-quality-q = 什么品质的录音会被使用？
faq-quality-a = 我们希望面向语音转文本引擎将在自然环境下遇到的音频质量。因此，我们需要各种质量的音频来训练引擎。这将使语音转文本引擎遇到各种情况时不出错—不论是周围有人谈话，还是有汽车噪声、风扇噪声。
faq-hours-q = 为什么捕获音频的目标是 10,000 小时？
faq-hours-a = 这是训练出可供利用的 STT 系统所需的大约小时数。
faq-source-q = 原始文本来自何处？
faq-source-a1 = 目前是通过贡献者捐赠语料给我们，我们也会利用来自公有领域电影剧本的对话（如 <italic>It’s a Wonderful Life</italic>）。
faq-source-a2 = 您可以在<dataLink>这个 GitHub 文件夹</dataLink>参考我们的语料源码。

## Profile

profile-why-title = 为什么要创建用户资料？
profile-why-content = 凭借您提供一些有关本人的信息，您提交给 Common Voice 的音频数据能更有助于使用这些数据来提高其语音识别引擎的准确性。 

## NotFound

notfound-title = 未找到
notfound-content = 很抱歉，找不到您想找的东西。

## Privacy

privacy-title = Common Voice 隐私声明
privacy-effective = 有效期至 { DATETIME($date, month: "long", year: "numeric", day: "numeric") }
privacy-policy = 我们的 <policy>Mozilla 隐私政策</policy>描述了我们如何处理所收到的您的信息。
privacy-data-demographic = <name>人口特征。</name>您可以选择向我们发送您的口音、年龄等信息。这有助于我们和其他研究人员改进并打造语音转文本技术和工具。
privacy-data-account = <name>账户数据。</name>您可以选择创建账户，在这种情况下我们会收到您的电子邮件地址。这将与您的人口特征和互动数据关联，但不会向公众分享。
privacy-data-recordings = <name>声音录音。</name>声音录音及任何相关的人口特征数据，可在公共语音数据库中供公众消费和使用。
privacy-data-interaction = <name>交互数据。</name>我们使用谷歌分析服务更好地了解您如何 Common Voice 应用程序或网站交互。例如您录制或收听的语音样本数量、与按钮和菜单的交互、会话长度。
privacy-data-technical = <name>技术数据。</name>我们使用谷歌分析服务收集您访问的 Common Voice 网页的网址和标题。我们收集您的浏览器名称、视区大小和屏幕分辨率。我们还会收集您的地理位置以及浏览器中的语言设置。
privacy-more = <more>了解更多</more>

## Terms

terms-title = Common Voice 法律条款
terms-effective = 有效期至 { DATETIME($date, day: "numeric", month: "long", year: "numeric") }
terms-eligibility-title = 资格
terms-eligibility-content = 您必须已满 13 周岁，否则须在家长或监护人同意和监督下参与我们的众包项目。
terms-privacy-title = 隐私
terms-privacy-content = 我们的<privacyLink>隐私声明</privacyLink>说明了我们如何接收和处理您的数据。
terms-contributions-title = 您的贡献和发布的权利
terms-contributions-content = 提交您的录音，即视为您放弃您可能拥有的所有版权和相关权利，并且您同意将录音在遵循<licenseLink>CC-0</licenseLink>许可下发布给公众。这意味着您同意在全球范围内放弃录音在版权和数据库法律规定下的一切权利，包括道德和宣传权利，以及所有相关权利和邻接权利。
terms-communications-title = 交流
terms-communications-content = 如果您订阅接收我们的新闻稿或注册一个与 Common Voice 相关的账户，您可能会收到我们与您的账户相关的电子邮件 (例如，法律、隐私和安全更新)。
terms-general-title = 常规
terms-general-liability1 = 免责声明；责任限制：COMMON VOICE 及其包含的所有录制内容均按“原样”提供，不作任何形式的担保，无论明示或暗示。 对于您或任何其他用户或第三方使用 COMMON VOICE 进行发送或传输的任何录制内容，MOZILLA 不承担任何责任。
terms-general-liability2 = Mozilla 明确不作任何类型的担保，不保证适销性、适用性、无侵权等条件，以及任何在交易或使用过程中产生的任何担保。
terms-general-liability3 = 在适用法律允许的范围内，您同意释放和保护无害的 MOZILLA 公司及其各自的母公司、子公司、附属公司、董事、官员、雇员和代理人（“Mozilla 缔约方”），对任何直接或间接地、全部或部分地来自您参与 COMMON VOICE 造成的损坏，承担一切责任、损失或延误（包括人身伤害、死亡或财产损失）。
terms-general-liability4 = 除非法律要求，Mozilla 和 Mozilla 缔约方将不承担任何间接的、特殊的、附带的、相应的，或以任何方式与这些条款有关或使用或无法使用服务造成的损害赔偿责任，包括但不限于对商誉损失、停工、利润损失、数据丢失和计算机故障或故障的直接和间接损害的情况下，即使告知此种损害的可能性，不论其基于这种主张的理论 (合同、侵权或其它) 为何。Mozilla 和 Mozilla 缔约方根据本协议承担的集体责任不会超过 500 美元 (包括 500 美元 )。有些司法管辖区不允许排除或限制附带的、相应的或特殊的损害赔偿，因此这种排除和限制可能不适用于您。
terms-general-updates = 补充：Mozilla 可能不定期更新这些条款以解决服务的新功能或澄清某项条款。修改后的条款将在网上发布。 如果修改是实质性的，我们将通过 Mozilla 通常的渠道宣布修改，例如博客文章和论坛等。您在修改生效日期之后继续使用服务即表示您接受此类更改。为了让您方便检查，我们将在此页面的顶部标注生效日期。
terms-general-termination = 终止：我们可能会因任何原因暂停或终止您访问服务的权利，我们会尽力通过您账户下的电子邮件地址或在下一次您前来使用服务时通知您。不论为何终止，您提交给 Mozilla 的所有录音将继续公开可用。
terms-general-law = 管辖法律：这些法律条款构成您和 Mozilla 关于 Common Voice 的全部协议，并受美国加利福尼亚州的法律管辖。

## Data

data-download-button = 下载 Common Voice 数据
data-download-license = 许可协议：<licenseLink>CC-0</licenseLink>
data-download-modal = 将下载 <size>{ $size }GB</size> 的文件，要继续吗？
data-subtitle = 我们正在建立一个开放且公开的语音数据集，每个人都可以使用它来训练语音应用程序。
data-explanatory-text = 我们相信，大型和公开的语音数据集将促进基于机器学习的语音技术的创新和健康的商业竞争。这是一项全球性的努力，我们邀请所有人参加。我们的目标是帮助语音技术更具包容性，反映世界各地声音的多样性。
data-get-started = <speechBlogLink>开始进行语音识别</speechBlogLink>
data-other-title = 其他语音数据集…
data-other-goto = 前往 { $name }
data-other-download = 下载数据
data-other-librispeech-description = Librispeech 是从 Librivox 项目中得到的大约 1000 小时的 16khz 有声读物的英文语音语料库。
data-other-ted-name = TED-LIUM 语料库
data-other-ted-description = TED-LIUM 语料库由在 TED 网站上提供的讲话音频和转录文字制作而成。
data-other-voxforge-description = Voxforge 被设计来收集讲话转录文本，以供自由与开放源代码的语音识别引擎使用。
data-other-tatoeba-description = Tatoeba 是一个用于语言学习的句子、翻译和口语音频的大型数据库。此下载包含由其社区记录的所有口语。
data-bundle-button = 批量下载数据集
data-bundle-description = Common Voice 数据加上所有其他的语音数据集。
license = 许可协议：<licenseLink>{ $license }</licenseLink>

## Record Page

record-platform-not-supported = 很抱歉，尚不支持您的平台。
record-platform-not-supported-desktop = 您可以在桌面电脑上下载最新内容：
record-platform-not-supported-ios = <bold>iOS</bold> 用户可以下载我们的免费应用程序：
record-must-allow-microphone = 您必须允许访问麦克风。
record-error-too-short = 这份录音太短了。
record-error-too-long = 这份录音太长了。
record-error-too-quiet = 这份录音太安静了。
record-submit-success = 提交成功！要继续录音吗？
record-help = 请点按录音按钮，然后朗读上述句子。
record-cancel = 取消重新录音
review-terms = 使用 Common Voice 即代表您同意我们的<termsLink>条款</termsLink>和<privacyLink>隐私声明</privacyLink>
review-aborted = 上传中止。您要删除您的录音吗？
review-submit-title = 复查并提交
review-submit-msg = 感谢您的录制！<lineBreak></lineBreak>现在您可以复查并提交下面的片段。
review-recording = 复查
review-rerecord = 重新录音
review-cancel = 取消提交

## Download Modal

download-title = 您的下载已经开始。
download-helpus = 帮助我们建立一个围绕语音技术的社区，通过电子邮件保持联系。
download-form-email =
    .label = 输入您的电子邮件地址
    .value = 谢谢，我们会与您联系。
download-form-submit = 提交
download-back = 返回到 Common Voice 数据集
download-no = 不了，谢谢

## Contact Modal

contact-title = 联系表
contact-cancel = 取消
contact-form-email =
    .label = 电子邮箱
contact-form-name =
    .label = 姓名
contact-form-message =
    .label = 信息
contact-required = * 必填
contact-submit = 提交

## Request Language Modal

request-language-title = 语言请求
request-language-cancel = 退出表单
request-language-form-language =
    .label = 语言
request-language-form-email =
    .label = 电子邮箱
request-language-submit = 提交
request-language-success-title = 非常感谢，您的语言请求已成功提交。
request-language-success-text = 我们会在此语言上线时告知您。
