## Error pages

banner-error-slow-1 = 感謝汝使用 Common Voice，失禮阮這陣網站小可仔慢。
banner-error-slow-2 = 收着大量接線流量，阮隨共相關問題開拆。
banner-error-slow-link = 狀態頁面
error-something-went-wrong = 歹勢，有一屑仔物仔怪怪
error-clip-upload = 上傳這段聲音失敗，欲繼續無？
error-clip-upload-server = 上傳這段聲音到服侍器失敗，閣來上傳抑是等一下閣試一改。
error-clip-upload-too-large = 你錄音的檔案傷大矣，請閣試一改較細的片斷。
error-clip-upload-server-error = 服侍器處理你的片斷的時發生錯誤，請重新整理頁面抑是閣試一改。
error-title-404 = 找不到您想要開啟的頁面
error-content-404 = 嘛是對咱的<homepageLink>頭頁</homepageLink>重新開始會當幫贊？若是欲詢問問題，會當加入<matrixLink>Matrix 社里開講頻道</matrixLink>、關注 <githubLink>GitHub</githubLink> 頂懸的網站問題回報，抑是到<discourseLink>咱的 Discourse 討論區</discourseLink>予阮知影。
error-title-429-no-time = 你傷緊矣，請較慢一寡，等一下閣試一改。
error-title-429-with-time =
    { $retryAfter ->
        [one] 你傷緊矣，請較慢一寡，等{ $retryAfter }秒閣試一改。
       *[other] 你傷緊矣，請較慢一寡，等{ $retryAfter }秒閣試一改。
    }
error-title-500 = 歹勢，有一屑仔物仔怪怪
error-content-500 = 一个無預期的錯誤發生矣，請你小等一下閣試一改。若是欲幫贊，請加入<matrixLink>Matrix 社里開講</matrixLink>，透過<githubLink>GitHub</githubLink> 監視網站狀況，抑是檢視<discourseLink>咱的 Discourse 線頂論壇</discourseLink>。
error-title-502 = 連線出問題矣
error-content-502 = 這馬你無法度建立穩定的網路連線到服侍器，請你小等一下閣試一改。若是欲幫贊，請加入<matrixLink>Matrix 社里開講</matrixLink>，透過<githubLink>GitHub</githubLink> 監視網站狀況，抑是檢視<discourseLink>咱的 Discourse 線頂論壇</discourseLink>。
error-title-503 = 咧發生意外的停機時間
error-content-503 = 網站欲盡量恢復作業。請到咱的 <matrixLink>Matrix 社里開講頻道</matrixLink>、<githubLink>GitHub</githubLink> 頂懸的網站問題回報，抑是到 <discourseLink>Discourse 討論區</discourseLink>回報予咱我們，抑是閱讀上新資訊。
error-title-504 = 請求的時間無去矣
error-content-504 = 請求的時間傷久矣，這通常是暫時的，請閣試一改。若是需要鬥腳手，請你加入<matrixLink>Matrix 社里開講</matrixLink>，透過<githubLink>GitHub</githubLink> 監視網站狀況，抑是檢視<discourseLink>咱的 Discourse 線頂論壇</discourseLink>。
error-code = 錯誤 { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] 咱無法度上傳你的錄音，進前捌上傳過矣。咱繼續進行！
       *[other] 咱無法度上傳{ $total }錄音，進前捌上傳過矣。咱繼續進行！
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = 咱上傳{ $uploaded }你的錄音片段—偆的已經上傳完成矣。咱繼續進行！
