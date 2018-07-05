## General

yes-receive-emails = はい、Common Voice プロジェクトに関する最新の情報をメールで受け取ります。
stayintouch = Mozillaは音声技術のコミュニティを立ち上げています。更新情報や新しいデータ、データの利用方法などについて気軽にお問い合わせください。
privacy-info = 私たちは個人情報の取扱に細心の注意を払っています。詳細については「<privacyLink>プライバシーについて</privacyLink>」をご覧ください。
return-to-cv = Common Voiceに戻る
email-input =
    .label = メールアドレス
submit-form-action = 送信
loading = 読み込み中…

# Don't rename the following section, its contents are auto-inserted based on the name (see scripts/pontoon-languages-to-ftl.js)
# [Languages]


## Languages

de = ドイツ語
el = ギリシャ語
en = 英語
es = スペイン語
fr = フランス語
it = イタリア語
ko = 韓国語
ro = ルーマニア語
ru = ロシア語
th = タイ語

# [/]


## Layout

speak = 話す
speak-now = 話してください
datasets = データセット
languages = 言語
profile = プロファイル
help = ヘルプ
contact = お問い合わせ
privacy = プライバシー
terms = 利用規約
cookies = Cookies
faq = FAQ
content-license-text = 本コンテンツは<licenseLink>クリエイティブ・コモンズ・ライセンス</licenseLink>で提供しています。
share-title = 他の人にも音声の提供を呼びかけてください！
share-text = 機械が人の話を理解できるようにするため、あなたの音声を提供してください。{ $link }
back-top = 先頭へ戻る
contribution-banner-text = 貢献のためのUIを一新しました
contribution-banner-button = 見てみる
report-bugs-link = バグを報告

## Home Page

home-title = Common Voiceプロジェクトは機械が人の話を理解できるようにする、Mozillaの新たな取り組みです。
home-cta = あなたの声で貢献を始めましょう！
wall-of-text-start = 音声を使ったコミニケーションは自然で人間的です。人と機械が音声を使ったコミュニケーションができればどれほど素晴らしいでしょうか？この実現にむけて、人々は機械が使える音声技術の開発を行っています。しかし、音声技術の開発には非常に多くの音声データが必要です。
wall-of-text-more-mobile = 大企業が利用している多くの音声データは一般の人が利用できません。このままでは、音声技術の発展が停滞してしまう。そう考え、私達は誰もが音声技術を利用できるようにするため、Common Voiceプロジェクトを立ち上げました。
wall-of-text-more-desktop = Common Voiceプロジェクトは誰もが参加または利用できる、オープンな音声データベースです。皆さんの声をデータベースへ登録する事で、このデータベースを使うアプリやwebサービスをよりすばらしいものにできます。<lineBreak></lineBreak>参加は簡単です。文章を読んで、あなたの声をデータベースに登録してください！もしくは、データベースの品質を向上するため、他の人が登録した声をチェックしてしてください！
show-wall-of-text = 続きを読む
help-us-title = 音声の検証を手伝ってください！
help-us-explain = 再生ボタンを押すと音声が流れます。流れた音声が次の文章と一致しているか教えてください。
no-clips-to-validate = この言語で再生する音声が無いようです。まず、あなたの音声を録音させてください。
vote-yes = はい
vote-no = いいえ
toggle-play-tooltip = { shortcut-play-toggle } を押すと再生が始まります。

## Speak & Listen Shortcuts

# Must be one letter that appears in the translated { skip } string.
shortcut-skip = s

## Listen Shortcuts

# Must be one letter that appears in the translated play-string inside of { shortcut-play-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-play-toggle = p
shortcut-play-toggle-label = 再生/停止
# Must be one letter that appears in the { vote-yes } string.
# Must be different from { shortcut-skip }, { shortcut-vote-no } and { shortcut-play-toggle }
shortcut-vote-yes = y
# Must be one letter that appears in the { vote-no } string.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-play-toggle }
shortcut-vote-no = n

## Speak Shortcuts

# Must be one letter that appears in the translated record-string inside of { shortcut-record-toggle-label }.
# Must be different from { shortcut-skip }, { shortcut-vote-yes } and { shortcut-vote-no }
shortcut-record-toggle = r
shortcut-record-toggle-label = 録音/停止
request-language-text = あなたの使っている言語が Common Voice にありませんでしたか？
request-language-button = 言語の追加をリクエスト

## ProjectStatus

status-title = プロジェクトの進捗: どれくらい音声が集まったか見てください！
status-contribute = 音声の収集に協力する
status-hours =
    { $hours ->
       *[other] { $hours }時間の音声が検証されました！
    }
# Variables:
# $goal - number of hours representing the next goal
status-goal = 次の目標: { $goal } 時間
english = 英語

## ProfileForm

profile-form-cancel = フォームを閉じる
profile-form-delete = プロファイルの削除
profile-form-username =
    .label = ユーザ名
profile-form-language =
    .label = 言語
profile-form-accent =
    .label = 方言
profile-form-age =
    .label = 年齢
profile-form-gender =
    .label = 性別
profile-form-submit-save = 保存
profile-form-submit-saved = 保存済み
profile-keep-data = 削除しない
profile-delete-data = 削除する
male = 男性
female = 女性
# Gender
other = その他
why-profile-title = なぜプロファイルが必要ですか？
why-profile-text = Common Voice に提供いただく音声データにあなたの情報を加えることで、このデータを利用する音声認識エンジンの精度を向上できます。
edit-profile = プロファイルの編集
profile-create = プロファイルの作成
profile-create-success = プロファイルの作成に成功しました！
profile-close = 閉じる
profile-clear-modal = プロファイルを削除すると、音声を記録した際に、統計情報が Common Voice に送信されなくなります。
profile-explanation = プロファイルを登録すると進捗の把握や、音声データの品質向上に役立ちます。

## FAQ

faq-title = よくある質問
faq-what-q = Common Voice とは？
faq-source-q = 文章はどこから入手していますか？
faq-source-a1 = 現在はコントリビュータの寄付、または、<italic>素晴らしき哉、人生! </italic>のようなパブリックドメインの映画の会話から文章を得ています。

## Profile


## NotFound


## Data


## Record Page


## Download Modal


## Contact Modal


## Request Language Modal


## Languages Overview


## New Contribution

