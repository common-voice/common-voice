## Error pages

banner-error-slow-1 = Ymddiheuriadau, mae Common Voice yn rhedeg yn araf. Diolch am eich cefnogaeth.
banner-error-slow-2 = Rydym yn derbyn llawer o draffig ac ar hyn o bryd yn ymchwilio i'r materion.
banner-error-slow-link = Tudalen Statws
error-something-went-wrong = Ymddiheuriadau, aeth rhywbeth o'i le
error-clip-upload = Mae llwytho'r clip hwn yn dal i fethu, parhau i roi cynnig arall arni?
error-clip-upload-server = Mae llwytho'r clip hwn yn parhau i fethu ar y gweinydd. Ail-lwythwch y dudalen neu ceisiwch eto yn nes ymlaen.
error-title-404 = Nid oedd modd i ni ddod o hyd i'r dudalen honno i chi
error-content-404 = Efallai y bydd ein <homepageLink>tudalen cartref</homepageLink> yn gallu eich helpu? I ofyn cwestiwn, ymunwch â'n sgwrs gymunedol yn <matrixLink>Matrix</matrixLink>, monitro materion gwefan trwy <githubLink>GitHub</githubLink> neu ewch i'n <discourseLink>fforymau Discours</discourseLink>.
error-title-503 = Rydym yn profi toriad darpariaeth annisgwyl
error-content-503 = Bydd y wefan yn ôl at ei gilydd cyn gynted â phosibl. Am y wybodaeth ddiweddaraf, ymunwch â'n  sgwrs gymunedol yn <matrixLink>Matrix</matrixLink> neu ewch i <githubLink>GitHub</githubLink> neu'n <discourseLink>fforymau Discourse</discourseLink> i gyflwyno a monitro materion profiad gwefan.
error-code = Gwall { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [zero] Doedd dim modd i ni lwytho { $total } clipiau. Maen nhw eisoes wedi'u llwytho o'r blaen. Gadewch i ni barhau gyda'r swp nesaf!
        [one] Doedd dim modd i ni lwytho { $total } clip. Maen nhw eisoes wedi'u llwytho o'r blaen. Gadewch i ni barhau gyda'r swp nesaf!
        [two] Doedd dim modd i ni lwytho { $total } glip. Maen nhw eisoes wedi'u llwytho o'r blaen. Gadewch i ni barhau gyda'r swp nesaf!
        [few] Doedd dim modd i ni lwytho { $total } clip. Maen nhw eisoes wedi'u llwytho o'r blaen. Gadewch i ni barhau gyda'r swp nesaf!
        [many] Doedd dim modd i ni lwytho { $total } chlip. Maen nhw eisoes wedi'u llwytho o'r blaen. Gadewch i ni barhau gyda'r swp nesaf!
       *[other] Doedd dim modd i ni lwytho { $total } clip. Maen nhw eisoes wedi'u llwytho o'r blaen. Gadewch i ni barhau gyda'r swp nesaf!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = Rydym wedi { $uploaded } o'ch clipiau. — Mae'r gweddill eisoes wedi'u llwytho o'r blaen. Gadewch i ni barhau gyda'r swp nesaf!
