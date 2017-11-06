// Load required libraries 
const aws = require('aws-sdk');
const config = require('../config.json');

// Create an S3 client
var s3 = new aws.S3();

// Bucket parameters
const BUCKET_LOCATION = config.BUCKET_LOCATION || 'us-west-1'
const BUCKET_NAME = config.BUCKET_NAME || 'common-voice-corpus';

/**
 * Create the s3 bucket.
 */
function run(callback) {
  // Create bucket parameters
  var bucket_params = {
   Bucket: BUCKET_NAME, 
   CreateBucketConfiguration: {
     LocationConstraint: BUCKET_LOCATION
   }
  };

  // Create bucket BUCKET_NAME
  s3.createBucket(bucket_params, function(err, data) {
    if (err) {
      console.error('Unable to create s3 bucket', err);
      process.exitCode = 1;
      return;
    }
  });
}

// Allow running as a script and module.
if (require.main === module) {
  run(err => {
    if (!err) {
      console.log('Db created.');
    }
  });
} else {
  exports.run = run;
}
