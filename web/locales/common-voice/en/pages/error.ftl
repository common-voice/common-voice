## Error pages

banner-error-slow-1 = Sorry, Common Voice is running slowly. Thanks for your interest.
banner-error-slow-2 = We're receiving a lot of traffic and are currently investigating the issues.
banner-error-slow-link = Status Page
error-something-went-wrong = Sorry, something went wrong
error-clip-upload = Upload of this clip keeps failing, keep retrying?
error-clip-upload-server = Upload of this clip keeps failing at server. Reload the page or try again later.
error-clip-upload-too-large = Your recording file is too large to upload. Please try recording a shorter clip.
error-clip-upload-server-error = Server error processing your clip. Please reload the page or try again later.
error-title-404 = We couldn’t find that page for you
error-content-404 = Maybe our <homepageLink>homepage</homepageLink> will help? To ask a question, please join the <matrixLink>Matrix community chat</matrixLink>, monitor site issues via <githubLink>GitHub</githubLink> or visit <discourseLink>our Discourse forums</discourseLink>.
error-title-500 = Sorry, something went wrong
error-content-500 = An unexpected error occurred. Please try again later. For help, please join the <matrixLink>Matrix community chat</matrixLink>, monitor site issues via <githubLink>GitHub</githubLink> or visit <discourseLink>our Discourse forums</discourseLink>.
error-title-502 = Connection interrupted
error-content-502 = You are unable to establish a stable connection to our servers right now. Please try again later. For help, please join the <matrixLink>Matrix community chat</matrixLink>, monitor site issues via <githubLink>GitHub</githubLink> or visit <discourseLink>our Discourse forums</discourseLink>.
error-title-503 = We’re experiencing unexpected downtime
error-content-503 = The site will be back up as soon as possible. For the latest information, please join the <matrixLink>Matrix community chat</matrixLink> or visit <githubLink>GitHub</githubLink> or <discourseLink>our Discourse forums</discourseLink> to submit and monitor site experience issues.
error-title-504 = Request timeout
error-content-504 = The request took too long to complete. This is usually temporary. Please try again. For help, please join the <matrixLink>Matrix community chat</matrixLink>, monitor site issues via <githubLink>GitHub</githubLink> or visit <discourseLink>our Discourse forums</discourseLink>.

error-code = Error { $code }

# Warning message shown when none of the clips could be uploaded
error-duplicate-clips-all =
  We could not upload { NUMBER($total) ->
    [one] your clip. It has already been uploaded before.
    *[other] { $total } clips. They have already been uploaded before.
  } Let’s continue with the next batch!
# Warning message shown when only some of the clips could be uploaded (uploaded count will be <5)
error-duplicate-clips-some =
  We uploaded { $uploaded } of your clips — The remainder have already been uploaded. Let’s continue with the next batch!
