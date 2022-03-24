# Google reCAPTCHA

We're using Google's reCAPTCHA. It requires some set-up.

When a user completes the reCAPTCHA clientside we take that value and send it our server to verify it's legitimacy.

## Environment variables

You can get the enviornment variables on the [admin site](https://www.google.com/recaptcha/admin).

- The serverside private key `CV_GOOGLE_RECAPTCHA_SECRET_KEY`. This is not expected to be public to our users and only used on the server.
- The clientside public key `CV_GOOGLE_RECAPTCHA_SITE_KEY`. This is expected to be visible to a user and is injected into our clientside code with Webpack.

There are some test reCAPTCHA keys in our 1Password Common Voice group.
