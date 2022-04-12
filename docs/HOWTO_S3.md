# Setting up S3 Storage

If you don't already have one you will need a configured S3 account, and a bucket
in which to store voice clips.

** Note ** Making requests to s3 is subject to their [pricing policy](https://aws.amazon.com/s3/pricing/).

#### Set up an Amazon Services Account

1. Visit https://aws.amazon.com/s3/
2. Create a new personal account and complete verification.

#### Create a new S3 bucket:

1. Log into your new Amazon Services account:
2. Choose "S3" under the "Storage" category in the "Services" drop down.
3. Click "Create bucket"
4. Choose a bucket name. For this example guide we'll choose "voice-web".
5. Choose a region.
6. Make note of the region's associated endpoint and region from the list at https://docs.aws.amazon.com/general/latest/gr/rande.html
7. Click next twice to skip over "Set properties".
8. Give yourself full permissions.
9. Verify that public read access is disabled.
10. Do not grant Amazon S3 Log Delivery group write access to the bucket.
11. Click next to verify the permissions.
12. Click "Create Bucket" to finish.

#### Create a new AWS IAM user with S3 Credentials:

1. Choose "IAM" under the "Security, Identity & Compliance" section of the "Services" drop down.
2. Under "Groups" select "Create New Group"
3. Name your group "S3FullAccess"
4. Filter for and select "AmazonS3FullAccess"
5. Click "Next Step" and then "Create Group"
6. Under "Users" select "Add user"
7. Name the user "voice-web" and select "Programmatic Access"
8. Click "Next: Permissions"
9. Select the group "S3FullAccess" we created earlier.
10. Click "Next: Review"
11. Click "Create user"
12. Record the keys for this user for use in the aws command line ui.

#### Install and configure the aws command line ui

1. Install the AWS command line UI. https://aws.amazon.com/cli/
2. Run `aws configure` to configure credentials via the aws command line ui.
3. Set the default signature version to be version 4: `aws configure set default.s3.signature_version s3v4`

#### Add options to local `config.json`

1. Create a file in your repository folder called `config.json`
2. Add a key `BUCKET_NAME`, and enter a value of the bucket we chose earlier "voice-web"
3. Add a key `AWS_REGION` with Region corresponding to your region name listed here: https://docs.aws.amazon.com/general/latest/gr/rande.html
