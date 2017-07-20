## Project Common Voice ![Travis Status](https://travis-ci.org/mozilla/voice-web.svg?branch=master "Travis Status")
This is a web, android and ios app for collection speech
donations for Project Common Voice.

### Official Website
[voice.mozilla.org](https://voice.mozilla.org)

### Contribution
Did you notice a bug? Do you have a feature request? Please file an issue [here on GitHub](https://github.com/mozilla/voice-web/issues)

For general discussion (feedback, ideas, random musings), check out our [Discorse Category](https://discourse.mozilla-community.org/c/voice)

### Development
```
npm install
npm install -g gulp
gulp
```
This will:
1. Install all dependencies, and Mysql
1. Serve files located in the `client` folder on localhost
1. Listen for and save voice clips into the `server/upload` folder
1. Lint all js files on every change

### Help

For more options type:
```
gulp help
```
