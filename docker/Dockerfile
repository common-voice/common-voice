FROM node:18-bookworm

ARG COMMIT="local-build"
ARG TAG=""

LABEL commit=${COMMIT}
LABEL tag=$TAG

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
    apt-get install -y apt-transport-https build-essential cmake && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install --no-install-recommends -y yarn ffmpeg

ENV GIT_COMMIT_SHA=${COMMIT}

# Install yarn dependencies
RUN yarn

# Run build
RUN yarn build

# Default command to start the server
CMD yarn start 2>&1 | tee /code/logs/voice-server.log
