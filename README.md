## Common Voice [![Travis Status](https://travis-ci.org/mozilla/voice-web.svg?branch=master)](https://travis-ci.org/mozilla/voice-web)
This is a web, android and iOS app for collecting speech
donations for the Common Voice project.

### Official Website
[voice.mozilla.org](https://voice.mozilla.org)

### Contributing
From adding sentences to read to enhancing our front end architecture, there are many ways to get involved with Common Voice. For more information, check out [CONTRIBUTING.md](https://github.com/mozilla/voice-web/blob/master/CONTRIBUTING.md).

Or for general discussion (feedback, ideas, random musings), head to our [Discourse Category](https://discourse.mozilla-community.org/c/voice).

### Project Directory Structure

The project is organized into the following directories:

- *android*: The Android app, simple webview wrapper of voice.mozilla.org. This app is not currently published.
- *docs*: Design and data specifications for Common Voice.
- *ios*: The iOS app. At the time of it's publishing, this was a workaround for Safari not supporting getUserMedia.
- *nubis*: Configuration files for [Nubis](https://github.com/nubisproject), our deployment tool.
- *server*: The server-side code app logic written in NodeJS.
- *tools*: Just some scripts for managing data.
- *web*: The Common Voice website files.
