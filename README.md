## Project Common Voice [![Travis Status](https://travis-ci.org/mozilla/voice-web.svg?branch=master)](https://travis-ci.org/mozilla/voice-web)
This is a web, android and iOS app for collection speech
donations for Project Common Voice.

### Official Website
[voice.mozilla.org](https://voice.mozilla.org)

### Contribution
[Non-code] Please help us add sentences to read. See [issue 341](https://github.com/mozilla/voice-web/issues/341) for details.

[Code] Check out our list of [help wanted bugs](https://github.com/mozilla/voice-web/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

Did you notice a bug? Do you have a feature request? Please file an issue [here on GitHub](https://github.com/mozilla/voice-web/issues).

For general discussion (feedback, ideas, random musings), check out our [Discourse Category](https://discourse.mozilla-community.org/c/voice).

### Development
```
npm install
npm install -g gulp
gulp
```
This will:
1. Install all JavaScript dependencies.
1. Build and serve files located in the `web` folder on localhost.
1. Listen for and save voice clips onto Amazon's S3.
1. Lint and rebuild all js files on every change.

### Help

For more options type:
```
gulp help
```

### Project directory structure

The project is organized into the following directories:

- *android*: The Android app, simple webview wrapper of voice.mozilla.org. This app is not currently published.
- *docs*: Design and data specifications for Common Voice.
- *ios*: The iOS app. At the time of it's publishing, this was a workaround for Safari not supporting getUserMedia.
- *nubis*: Configuration files for [Nubis](https://github.com/nubisproject), our deployment tool.
- *server*: The server-side code app logic written in NodeJS.
- *tools*: Just some scripts for managing data.
- *web*: The Common Voice website files.
