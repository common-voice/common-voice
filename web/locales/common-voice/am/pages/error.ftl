## Error pages

banner-error-slow-1 = ይቅርታ፥ የጋራ ልሳን በጣም ዘግይቷል። ስለፍላጎቶ እናመሰግናለን።
banner-error-slow-2 = በጣም ብዙ ትራፊክ እየተቀበልን ስለሆነ በአሁኑ ሰዓት ጉዳዪን በማጣራት ላይ እንገኛለን።
banner-error-slow-link = የሁኔታ ገፅ
error-something-went-wrong = ይቅርታ፣ የሆነ ችግር ተፈጥሯል
error-clip-upload = ይህን ክሊፕ ሲሰቅሉ አሁንም ካልተሳካ፣ እንደገና ይሞክሩ?
error-clip-upload-server = የዚህ ቅንጥብ መስቀል በአገልጋዩ ላይ አለመሳካቱን ቀጥሏል። ገጹን እንደገና ይጫኑ ወይም ቆይተው እንደገና ይሞክሩ።
error-clip-upload-too-large = የቀረጻ ፋይልዎ ለመስቀል በጣም ትልቅ ነው። እባክዎ አጭር ቅንጥብ ለመቅዳት ይሞክሩ።
error-clip-upload-server-error = የአገልጋይ ስህተት የእርስዎን ቅንጥብ በማስኬድ ላይ። እባክዎ ገጹን እንደገና ይጫኑ ወይም ቆይተው እንደገና ይሞክሩ።
error-title-404 = ያንን ገጽ ለእርስዎ ልናገኘው አልቻልንም።
error-content-404 = ምናልባት የእኛ <homepageLink>መነሻ ገጽ</homepageLink> ሊረዳ ይችላል? ጥያቄ ለመጠየቅ፣እባክዎ የ<matrixLink>ማትሪክስ የማህበረሰብ ውይይት</matrixLink>ን ይቀላቀሉ፣የጣቢያ ችግሮችን በ<githubLink>GitHub</githubLink> ይከታተሉ ወይም <discourseLink>የእኛ የንግግር መድረኮችን</discourseLink> ይጎብኙ።
error-title-500 = ይቅርታ፣ የሆነ ችግር ተፈጥሯል
error-content-500 = ያልተጠበቀ ስህተት ተከስቷል። እባክዎ ቆይተው እንደገና ይሞክሩ። ለእገዛ፣ እባክዎ የ<matrixLink>ማትሪክስ የማህበረሰብ ውይይት</matrixLink>ን ይቀላቀሉ፣ የጣቢያ ችግሮችን በ<githubLink>ጊትሀብ</githubLink> በኩል ይከታተሉ ወይም <discourseLink>የእኛን የዲስኮርስ መድረኮች</discourseLink>ን ይጎብኙ።
error-title-502 = ግንኙነት ተቋርጧል
error-content-502 = አሁን ከአገልጋዮቻችን ጋር የተረጋጋ ግንኙነት መፍጠር አይችሉም። እባክዎ ቆይተው እንደገና ይሞክሩ። ለእገዛ፣ እባክዎ <matrixLink>የማትሪክስ ማህበረሰብ ውይይት</matrixLink>ን ይቀላቀሉ፣ የጣቢያ ችግሮችን በ<githubLink>ጊትሀብ</githubLink> በኩል ይከታተሉ ወይም <discourseLink>የእኛን የዲስኮርስ መድረኮች</discourseLink>ን ይጎብኙ።
error-title-503 = ያልተጠበቀ የእረፍት ጊዜ እያጋጠመን ነው።
error-content-503 = ጣቢያው በተቻለ ፍጥነት ይመለሳል። የቅርብ ጊዜ መረጃ ለማግኘት እባክዎ የ<matrixLink>ማትሪክስ የማህበረሰብ ውይይት</matrixLink>ን ይቀላቀሉ ወይም <githubLink>GitHub</githubLink>ወይም <discourseLink>የእኛን የንግግር መድረኮች</discourseLink>ን ይጎብኙ እና የጣቢያ ልምድ ጉዳዮችን ይከታተሉ።
error-title-504 = የጥያቄ ጊዜ አብቅቷል
error-content-504 = ጥያቄው ለማጠናቀቅ በጣም ረጅም ጊዜ ፈጅቷል። ይህ አብዛኛውን ጊዜ ጊዜያዊ ነው። እባክዎ እንደገና ይሞክሩ። ለእገዛ፣ እባክዎ <matrixLink>የማትሪክስ ማህበረሰብ ውይይት</matrixLink>ን ይቀላቀሉ፣ የጣቢያ ችግሮችን በ<githubLink>ጊትሀብ</githubLink> በኩል ይከታተሉ ወይም <discourseLink>የእኛን የዲስኮርስ መድረኮች</discourseLink>ን ይጎብኙ።
error-code = ስህተት { $code }
# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
    { $total ->
        [one] ቅንጥቦችዎን መስቀል አልቻልንም። ከዚህ በፊት ተሰቅለዋል። በሚቀጥለው ባች እንቀጥል!
       *[other] የ{ $total } ቅንጥቦችን መስቀል አልቻልንም። ከዚህ በፊት ተሰቅለዋል። በሚቀጥለው ባች እንቀጥል!
    }
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some = ከቅንጥቦችዎ ውስጥ { $uploaded } ን ሰቅለናል — የተቀሩት አስቀድመው ተሰቅለዋል። በሚቀጥለው ባች እንቀጥል!
