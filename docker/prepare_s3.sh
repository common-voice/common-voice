#!/bin/bash

# Check if voice-web bucket exists if not create it
echo "Checking if s3 bucket exists..."
status=$(curl -XGET http://s3proxy/common-voice-clips --write-out "%{http_code}\n" --output /dev/null --silent)

echo "GET bucket code: $status"

if [ $status != "200" ]
then
    echo "Bucket does not exist. Creating one..."
    status=$(curl -XPUT http://s3proxy/common-voice-clips --write-out "%{http_code}\n" --output /dev/null --silent)
    echo "PUT bucket code: $status"
fi

echo "Done!"
