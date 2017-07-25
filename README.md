## Project Common Voice ![Travis Status](https://travis-ci.org/mozilla/voice-web.svg?branch=master "Travis Status")
This is a web, android and iOS app for collection speech
donations for Project Common Voice.

### Official Website
[voice.mozilla.org](https://voice.mozilla.org)

### Contribution
Did you notice a bug? Do you have a feature request? Please file an issue [here on GitHub](https://github.com/mozilla/voice-web/issues)

For general discussion (feedback, ideas, random musings), check out our [Discourse Category](https://discourse.mozilla-community.org/c/voice)

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

### Project directory structure

The project is organized into the following directories:

- *android*: The Android app. This app is not currently used as it is just a wrapper for the website.
- *docs*: Design specifications for Common Voice.
- *ios*: The iOS app. The iOS app is just a wrapper for the website as well, but it was published on the App Store because of an issue in Safari which made recording audio impossible.
- *nubis*: Configuration files for [Nubis](https://github.com/nubisproject), which is used for deploying the website.
- *server*: The server-side program for the Common Voice website.
- *tools*: Some scripts for managing the server and the database.
- *web*: The Common Voice website.

### Help

For more options type:
```
gulp help
```
