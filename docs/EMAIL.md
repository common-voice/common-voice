# Email

For basic email sending we're using Amazon Simple Email Service (SES), an Amazon Web Service (AWS).

## Development

When running this project locally we don't want to use AWS. We're using the test service [Ethereal](https://ethereal.email/). This means no actual emails are sent but we get a preview instead.

You should see a `📧 Email preview URL: http://example.com` log whenever a email is sent.

> ⚠️ When sending emails Ethereal, emails are essentially public on their site. Consider this when testing.

## Production

In production (or testing production) we need to have the `CV_AWS_SES_CONFIG` environment variable set to something like:

```json
{
  "credentials": {
    "accessKeyId": "fake-access-key-id",
    "secretAccessKey": "fake-secret-access-key"
  }
}
```

The user created for this needs the `AmazonSESFullAccess` policy permission.
