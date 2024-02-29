#!/bin/bash

checkAndCreateBucket () {
    # Check if bulk submission bucket exists if not create it
    echo "Checking if $1 exists..."
    status=$(curl -X GET http://storage:8080/storage/v1/b/$1 --write-out "%{http_code}\n" --output /dev/null --silent)

    echo "GET bucket code: $status"

    if [ $status == "200" ]
    then 
        echo "Bucket $1 exists!"
    else
        echo "Bucket does not exist. Creating one..."
        status=$(curl -X POST -d '{"name":"'$1'"}' http://storage:8080/storage/v1/b?project=local --write-out "%{http_code}\n" --output /dev/null --silent)
        echo "PUT bucket code: $status"
    fi
}

checkAndCreateBucket common-voice-bulk-submissions
checkAndCreateBucket common-voice-clips
checkAndCreateBucket common-voice-datasets
checkAndCreateBucket common-voice-bundler

echo "Done!"
