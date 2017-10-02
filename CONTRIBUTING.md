# Contributing to Common Voice

🎉 First off, thanks for taking the time to contribute! This project would not be possible without people like you. 🎉

## Code of Conduct
By participating in this project, you're agreeing to uphold the [Mozilla Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/).

## How Can I Contribute?

### Non-code
Help us add more sentences for other volunteers to read. See [issue 341](https://github.com/mozilla/voice-web/issues/341) for details.

### Bug fixes and feature enhancements
All of our current issues can be found here on GitHub. Anything with a [help wanted](https://github.com/mozilla/voice-web/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag is up for grabs.

#### Requirements
- [NodeJS](https://nodejs.org/en/) (v7 or higher)
- [npm](https://www.npmjs.com/) (4 or higher)

#### Local Development
```
npm install
npm install -g gulp
gulp
```
This will:
1. Install all JavaScript dependencies.
1. Build and serve files located in the `web` folder on localhost.
1. Save uploaded voice clips onto Amazon's S3.
1. Lint and rebuild all js files on every change.

#### Need Help?
For more options, just type:
```
gulp help
```

## Submitting an Issue
Did you notice a bug? Do you have a feature request? Please file an issue [here on GitHub](https://github.com/mozilla/voice-web/issues).

## Something Else?
Want to talk about something but can't find a home for it here? Head to our [Discourse Category](https://discourse.mozilla-community.org/c/voice) to discuss everything from feedback and ideas to questions and random musings.
