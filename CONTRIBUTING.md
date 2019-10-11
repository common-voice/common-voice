# Contributing to Common Voice

🎉 First off, thanks for taking the time to contribute! This project would not be possible without people like you. 🎉

## Code of Conduct

By participating in this project, you're agreeing to uphold the [Mozilla Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/). If you need to report a problem, please see our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) guide.

## How Can I Contribute?

### Add More Sentences

Help us add more sentences for other volunteers to read. See [this topic](https://discourse.mozilla.org/t/readme-how-to-see-my-language-on-common-voice/31530) for details.

### Bug Fixes and Feature Enhancements

All of our current issues can be found here on GitHub. Anything with a [help wanted](https://github.com/mozilla/voice-web/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag is definitely up for grabs. If you're interested in an issues without this tag, best to ask first to make sure our vision of it aligns.

#### Project requirements

- [NodeJS](https://nodejs.org) (v8.10 or higher)
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

Either create a MySQL superuser that that uses the default `DB_ROOT_USER` and `DB_ROOT_PASS` values from `/server/src/config-helper.ts` or [create your own config](https://github.com/mozilla/voice-web/blob/master/CONTRIBUTING.md#configuration).

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

You can find configurable options, like the port Common Voice is running on, in `/server/src/config-helper.ts`. Just create a `/config.json` with the config you want to override. If you're using Docker, you may need to modify the file `/docker/local-docker-config.json` instead.

#### Authentication

If you want to work with login-related features (Profile, Dashboard, Goals, ...) you'll need to set up authentication:

1. Create an [Auth0](https://auth0.com/) account.
2. Click "Applications" from the dashboard. Create a new one, or use the default application.
3. Add `http://localhost:9000/callback` to the "Allowed Callback URLs" list.
4. If you add any social integrations, make sure they request the user's email.
5. Copy the following keys from the Auth0 application into `config.json` or `local-docker-config.json`:

```
"AUTH0": {
 "DOMAIN": "<domain_here>",
 "CLIENT_ID": "<client_id_here>",
 "CLIENT_SECRET": "<client_secret_here>"
}
```

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

#### Import languages

To update the list of locales run:

```
yarn import-locales
```

This creates/updates files in `/locales`:

- fetch locale codes & names from Pontoon and save them in `all.json`
- based on Pontoon translated data and a threshold defined in the script, save "completed" locales to `translated.json`
- add codes that have a sentence folder in `/server/data` and at least 5k sentences to `contributable.json`

#### Need Help?

For more options, just type:

```
yarn run
```

#### Project Directory Structure

The project is organized into the following directories:

- _android_: The Android app, a simple webview wrapper of voice.mozilla.org. This app is currently not published.
- _docs_: Design and data specifications for Common Voice.
- _ios_: The iOS app. This is a simple wrapper app for the website, as a workaround for a microphone issue in Safari.
- _nubis_: Configuration files for [Nubis](https://github.com/nubisproject), our deployment tool.
- _server_: The server-side app logic, written in [TypeScript](http://www.typescriptlang.org/).
- _tools_: Some scripts for managing data.
- _web_: The Common Voice website files, written in [TypeScript](http://www.typescriptlang.org/). We use [React](https://reactjs.org/) to build the website.

## Submitting an Issue

Did you notice a bug? Do you have a feature request? Please file an issue [here on GitHub](https://github.com/mozilla/voice-web/issues).

## Something Else?

Want to talk about something but can't find a home for it here? Head to our [Discourse Category](https://discourse.mozilla-community.org/c/voice) to discuss everything from feedback and ideas to questions and random musings.
