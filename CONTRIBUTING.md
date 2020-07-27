# Contributing to Common Voice

🎉 First off, thanks for taking the time to contribute! This project would not be possible without people like you. 🎉

## Code of Conduct

By participating in this project, you're agreeing to uphold the [Mozilla Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/). If you need to report a problem, please see our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) guide.

## How Can I Contribute?

### Add More Sentences

Help us add more sentences for other volunteers to read. We've written [a detailed guide on Discourse on how to contribute new sentences](https://discourse.mozilla.org/t/readme-how-to-see-my-language-on-common-voice/31530).

**Please note**, we do **not** accept any direct pull requests for adding new sentences or changing localization content. All of that is managed and merged through Mozilla's Pontoon localization system. If you have any suggestions for adding or editing translations, please check out your language on the [Common Voice project on Pontoon](https://pontoon.mozilla.org/projects/common-voice/). A community reviewer will check and approve them, and then they will be auto-incorporated into the website in our next deployment. If you find wrong sentences, please file an issue and we will take care of it, please do not create a Pull Request with corrections.

### Bug Fixes and Feature Enhancements

All of our current issues can be found here on GitHub. Anything with a [help wanted](https://github.com/mozilla/voice-web/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag is definitely up for grabs. If you're interested in an issues without this tag, best to ask first to make sure our vision of it aligns.

#### Project requirements

- [NodeJS](https://nodejs.org) (v8.10 or higher)
- [yarn](https://yarnpkg.com) (v1 or higher)
- [ffmpeg](https://www.ffmpeg.org/download.html)
- [MariaDB](https://mariadb.org/download/) (v10 or higher) or [MySQL](https://www.mysql.com/downloads/) (v5.6 or higher)

#### Docker setup

We provide a [docker-compose](https://docs.docker.com/compose/) setup to orchestrate the local development environment configuration using [Docker](https://www.docker.com/).

##### Requirements

- [Docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)

##### Setup

[Fork](https://help.github.com/articles/fork-a-repo/) and [clone](https://help.github.com/articles/cloning-a-repository/) the repository onto your computer. Then run the following commands to spin off `voice-web`:

```
> cd voice-web
> docker-compose up
```

This is going to:

- Launch a mysql instance configured for `voice-web`
- Launch an s3proxy instance to store files locally and avoid going through setting up AWS S3.
- Mount the project using a Docker volume to allow reflecting changes to the codebase directly to the container.
- Launch `voice-web` server

You can visit the website at [http://localhost:9000](http://localhost:9000).

**Note: running the development server is a memory-intensive process. If you notice intermittent failures, or if features like auto-rebuilding crash, try increasing Docker's available memory from within Docker's _Preferences > Resources_ settings.**

##### Importing sentences

To decrease the workload for your machine, by default sentence importing is deactivated for the Docker setup. This means that
by default you won't have any sentences to be recorded. If you want to fix any bug that occurs within the "Speak" part of the
app, you will first need to import sentences. To do so, set `IMPORT_SENTENCES` in `/.env-local-docker` to `true`.
Note that this might take quite some time.

##### Docker daemon error

If you get an error like the following when running native Docker (not Docker for Desktop),

```
ERROR: Couldn't connect to Docker daemon at http+docker://localhost - is it running?
```

You may need to build a new image. You can do that by issuing the following commands:

```
> cd docker/
> docker build .
```

Then after this you can:

```
> cd ..
> docker-compose up
```

You may have to run these commands as root/superuser.

#### Local setup

###### Requirements

[Fork](https://help.github.com/articles/fork-a-repo/) and [clone](https://help.github.com/articles/cloning-a-repository/) the repository onto your computer.

Either create a MySQL superuser that that uses the default `DB_ROOT_USER` and `DB_ROOT_PASS` values from `/server/src/config-helper.ts` or [create your own config](https://github.com/mozilla/voice-web/blob/master/CONTRIBUTING.md#configuration).

Then `cd` into the project directory and enter the following commands:

```
> yarn
> yarn start
```

This will:

1. Install all JavaScript dependencies.
2. Build and serve files located in the `web` folder on localhost.
3. Save uploaded voice clips onto Amazon's S3.
4. Lint and rebuild all js files on every change.

You can then access the website at [http://localhost:9000](http://localhost:9000).

#### Configuration

You can find configurable options, like the port Common Voice is running on, in `/server/src/config-helper.ts`. Just create a `/config.json` with the config you want to override. If you're using Docker, you may need to modify the file `/.env-local-docker` instead.
At its basic form, the 'config.json' file should look like this:

```
{
    "IMPORT_SENTENCES": false,
    "MYSQLUSER": <root_username_here>,
    "MYSQLPASS": <root_password_here>,
    "DB_ROOT_USER": <root_username_here>,
    "DB_ROOT_PASS": <root_password_here>,
    "MYSQLDBNAME": "voice",
    "MYSQLHOST": "127.0.0.1",
    "MYSQLPORT": 3306
  }
```

##### NewRelic error during startup

If you get a NewRelic error during startup, you can safely ignore it.

```
web        | [BE] Error: New Relic requires that you name this application!
web        | [BE] Set app_name in your newrelic.js file or set environment variable
web        | [BE] NEW_RELIC_APP_NAME. Not starting!
```

You do not need to set up NewRelic, except if you fix anything related to that.

##### MySQL error during startup

During the server start (after running ‘yarn start’), you might notice an error log similar to this:

```
at Class.exports.up (/Users/admin/Desktop/myprojects/mozilla/voice-web-master/server/src/lib/model/db/migrations/20180910121256-user-sso-fields.ts:2:13)
....
[BE]       at /Users/admin/Desktop/myprojects/mozilla/voice-web-master/node_modules/db-migrate/lib/migrator.js:237:31 {
[BE]     code: 'ER_BLOB_CANT_HAVE_DEFAULT',
[BE]     errno: 1101,
[BE]     sqlMessage: "BLOB, TEXT, GEOMETRY or JSON column 'username' can't have a default value",
[BE]     sqlState: '42000',
[BE]     index: 0,
[BE]     sql: '\n' +
[BE]       '      ALTER TABLE user_clients\n' +
[BE]       '        ADD COLUMN sso_id VARCHAR(255) UNIQUE,\n' +
[BE]       "        ADD COLUMN username TEXT NOT NULL DEFAULT '',\n" +
[BE]       '        ADD COLUMN basket_token TEXT;\n' +
[BE]       '    '
```

First make sure you have the correct version of MySQL installed. If the problem still persists, the following will prove useful:
**You only need to follow these steps once. After that be sure to discard all changes made to the relevant files after migrations are successful.**

1. In the error log, locate and open the associated migrations file (localed in the `/migrations` directory). In this case, the file is named `20180910121256-user-sso-fields.ts`.
2. Locate the affected column declaration - revealed by the “sqlMessage” string in the error log - and remove the default declaration value i.e In our case, the column username will have a new declaration `ADD COLUMN username TEXT NOT NULL` instead of `ADD COLUMN username TEXT NOT NULL DEFAULT ‘ ’`
3. Fixing one migration error will uncover another error in another migration file. Repeat the same process until there are no more migration errors.
4. Discard all changes made to the relevant migration files.

#### Authentication

If you want to work with login-related features (Profile, Dashboard, Goals, ...) you'll need to set up authentication:

1. Create an [Auth0](https://auth0.com/) account.
2. Click "Applications" from the dashboard. Create a new one, or use the default application.
3. Go to "Applications" and click on the Settings icon next to your application.
4. Add `http://localhost:9000/callback` to the "Allowed Callback URLs" list.
5. If you're using Docker, copy the following keys from the Auth0 application into `/.env-local-docker`. These are found in the same Settings tab as the "Allowed Callback URLs".

```env
CV_AUTH0_DOMAIN = "<domain_here>"
CV_AUTH0_CLIENT_ID = "<client_id_here>"
CV_AUTH0_CLIENT_SECRET = "<client_secret_here>"
```

If you're not using Docker, copy the same keys into `/config.json`.

```json
"AUTH0": {
 "DOMAIN": "<domain_here>",
 "CLIENT_ID": "<client_id_here>",
 "CLIENT_SECRET": "<client_secret_here>"
}
```

6. You can add more login options to your app from the "Connections" tab
7. Restart your local Common Voice instance
8. You will now be able to create a new user by clicking on "Log in" on your Common Voice instance and then switching over to the "Sign Up" tab on the login dialog.

#### Setting up Amazon S3 for development

The Common Voice project uses S3 for voice clip storage. If you need help configuring
S3, check out [HOWTO_S3.md](./docs/HOWTO_S3.md)

#### Adding migrations

We use [db-migrate](https://github.com/db-migrate/node-db-migrate) for running database migrations.

To add a migration run:
`yarn migrate create <MIGRATION_NAME>`.
At the moment you manually have to change the migration file extension to `.ts`. A migration has to expose the following API:

```typescript
export const up = async function (db: any): Promise<any> {
  return null;
};

export const down = async function (): Promise<any> {
  return null;
};
```

Migrations are always run when the server is started.

#### Making Strings localizable

We're using [Fluent](http://projectfluent.org/) to localize strings. You can find examples all over the frontend code. Strings that appear in the [english message files](https://github.com/mozilla/voice-web/tree/master/web/locales/en), can then be translated on [Pontoon](https://pontoon.mozilla.org/projects/common-voice/). Some things to note regarding string changes are documented on [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_content_best_practices#Changing_existing_strings).

#### Import languages

To update the list of locales run:

```
> yarn import-locales
```

This creates/updates files in `/locales`:

- fetch locale codes & names from Pontoon and save them in `all.json`
- based on Pontoon translated data and a threshold defined in the script, save "completed" locales to `translated.json`
- add codes that have a sentence folder in `/server/data` and at least 5k sentences to `contributable.json`

#### Need Help?

For more options, just type:

```
> yarn run
```

#### Project Directory Structure

The project is organized into the following directories:

- _android_: The Android app, a simple webview wrapper of voice.mozilla.org. This app is currently not published.
- _docs_: Design and data specifications for Common Voice.
- _ios **(deprecated)**_: We used to maintain a native iOS app as a workaround for microphone issues in mobile Safari. As of early 2020, we officially support voice recording in iOS Safari. The Common Voice iOS app has been decommissioned.
- _server_: The server-side app logic, written in [TypeScript](http://www.typescriptlang.org/).
- _tools_: Some scripts for managing data.
- _web_: The Common Voice website files, written in [TypeScript](http://www.typescriptlang.org/). We use [React](https://reactjs.org/) to build the website.

## Submitting an Issue

Did you notice a bug? Do you have a feature request? Please file an issue [here on GitHub](https://github.com/mozilla/voice-web/issues).

## Something Else?

Want to talk about something but can't find a home for it here? Head to our [Discourse Category](https://discourse.mozilla-community.org/c/voice) to discuss everything from feedback and ideas to questions and random musings.
