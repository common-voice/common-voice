# Contributing to Common Voice

🎉 First off, thanks for taking the time to contribute! This project would not be possible without people like you. 🎉

## Code of Conduct
By participating in this project, you're agreeing to uphold the [Mozilla Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/). If you need to report a problem, please contact [mikey@mozilla.com](mailto:mikey@mozilla.com).

## How Can I Contribute?

### Add More Sentences
Help us add more sentences for other volunteers to read. See [issue 341](https://github.com/mozilla/voice-web/issues/341) for details.

### Bug Fixes and Feature Enhancements
All of our current issues can be found here on GitHub. Anything with a [help wanted](https://github.com/mozilla/voice-web/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag is up for grabs.

#### Project requirements
- [NodeJS](https://nodejs.org) (v7 or higher)
- [npm](https://www.npmjs.com) (v4 or higher)
- [yarn](https://yarnpkg.com) (v1 or higher)
- [ffmpeg](https://www.ffmpeg.org/download.html)
- [MariaDB](https://mariadb.org/download/) (v10 or higher) or [MySQL](https://www.mysql.com/downloads/) (v5.6 or higher)

#### Docker setup

We provide a [docker-compose](https://docs.docker.com/compose/) setup to orchestrate the local development environment configuration using [docker](https://www.docker.com/).

##### Requirements

- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)

##### Setup

[Fork](https://help.github.com/articles/fork-a-repo/) and [clone](https://help.github.com/articles/cloning-a-repository/) the repository onto your computer.
Then run the following commands to spin off `voice-web`:


```
> cd voice-web
> docker-compose up
```

This is going to:

- Launch a mysql instance configured for `voice-web`
- Launch an s3proxy instance to store files locally and avoid going through setting up AWS S3.
- Mount the project using a docker volume to allow reflecting changes to the codebase directly to the container.
- Launch `voice-web` server

You can visit the website at [http://localhost:9000](http://localhost:9000).

#### Local setup

###### Requirements

[Fork](https://help.github.com/articles/fork-a-repo/) and [clone](https://help.github.com/articles/cloning-a-repository/) the repository onto your computer.

Either create a MySQL root user that conforms to the default `DB_ROOT_USER` and `DB_ROOT_PASS` in `/server/src/config-helper.ts` or [create your own config](https://github.com/mozilla/voice-web/blob/master/CONTRIBUTING.md#configuration). 

Then `cd` into the project directory and enter the following commands:
```
yarn
yarn start
```
This will:
1. Install all JavaScript dependencies.
2. Build and serve files located in the `web` folder on localhost.
3. Save uploaded voice clips onto Amazon's S3.
4. Lint and rebuild all js files on every change.

You can then access the website at [http://localhost:9000](http://localhost:9000).

#### Configuration
You can find configurable options, like the port CommonVoice is running on, in `/server/src/config-helper.ts`. Just create a `/server/config.json` with the config you want to override.

#### Setting up Amazon S3 for development
The Common Voice project uses S3 for voice clip storage. If you need help configuring
S3, check out [HOWTO_S3.md](./docs/HOWTO_S3.md)

#### Adding migrations
We use [db-migrate](https://github.com/db-migrate/node-db-migrate) for running database migrations.

To add a migration run:
`yarn migrate create <MIGRATION_NAME>`.
At the moment you manually have to change the migration file extension to `.ts`. A migration has to expose the following API:
```typescript
export const up = async function(db: any): Promise<any> {
  return null;
};

export const down = async function(): Promise<any> {
  return null;
};

```

Migrations are always run when the server is started.

#### Making Strings localizable
We're using [Fluent](http://projectfluent.org/) to localize strings. You can find examples all over the frontend code. Strings that appear in the [english message files](https://github.com/mozilla/voice-web/tree/master/web/locales/en), can then be translated on [Pontoon](https://pontoon.mozilla.org/projects/common-voice/). Some things to note regarding string changes are documented on [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_content_best_practices#Changing_existing_strings).

#### Need Help?
For more options, just type:
```
yarn run
```

#### Project Directory Structure
The project is organized into the following directories:

- *android*: The Android app, a simple webview wrapper of voice.mozilla.org. This app is currently not published.
- *docs*: Design and data specifications for Common Voice.
- *ios*: The iOS app. This is a simple wrapper app for the website, as a workaround for a microphone issue in Safari.
- *nubis*: Configuration files for [Nubis](https://github.com/nubisproject), our deployment tool.
- *server*: The server-side app logic, written in [TypeScript](http://www.typescriptlang.org/).
- *tools*: Some scripts for managing data.
- *web*: The Common Voice website files, written in [TypeScript](http://www.typescriptlang.org/). We use [React](https://reactjs.org/) to build the website.

## Submitting an Issue
Did you notice a bug? Do you have a feature request? Please file an issue [here on GitHub](https://github.com/mozilla/voice-web/issues).

## Something Else?
Want to talk about something but can't find a home for it here? Head to our [Discourse Category](https://discourse.mozilla-community.org/c/voice) to discuss everything from feedback and ideas to questions and random musings.
