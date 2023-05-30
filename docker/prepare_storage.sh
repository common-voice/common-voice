#!/bin/bash

# Check if bulk submission bucket exists if not create it
echo "Checking if bulk submission bucket exists..."
status=$(curl -X GET http://storage:8080/storage/v1/b/common-voice-bulk-submissions --write-out "%{http_code}\n" --output /dev/null --silent)

echo "GET bucket code: $status"

if [ $status != "200" ]
then
    echo "Bucket does not exist. Creating one..."
    status=$(curl -X POST -d '{"name":"common-voice-bulk-submissions"}' http://storage:8080/storage/v1/b?project=local --write-out "%{http_code}\n" --output /dev/null --silent)
    echo "PUT bucket code: $status"
fi

echo "Done!"
