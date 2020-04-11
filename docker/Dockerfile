FROM node:10-stretch

ARG MAINTAINER="Alberto del Barrio <alberto@mozilla.com>"
ARG BRANCH="master"
ARG COMMIT="local-build"
ARG TAG=""
ARG REPO="local"

LABEL branch=${BRANCH}
LABEL commit=${COMMIT}
LABEL tag=$TAG
LABEL repo=https://github.com/${REPO}
LABEL maintainer=${MAINTAINER}

MAINTAINER ${MAINTAINER}

# Allow exposing HTTP endpoint
EXPOSE 9000

# Add project source
COPY . /code

# Setup work directory
WORKDIR /code

# Create directory for storing logs
RUN mkdir /code/logs

# Install dependencies
RUN apt-get update && \
    apt-get install -y apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install --no-install-recommends -y yarn ffmpeg

ENV GIT_COMMIT_SHA=${COMMIT}
ENV GIT_COMMIT_BRANCH=${BRANCH}
ENV GIT_SLUG=${REPO}

# Install yarn dependencies
RUN yarn

# Run build
RUN yarn build --profile

# Default command to start the server
CMD yarn start 2>&1 | tee /code/logs/voice-server.log
