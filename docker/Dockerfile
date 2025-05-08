FROM node:18-bookworm

ARG COMMIT="local-build"
ARG TAG=""
ARG UID=10001
ARG GID=10001

LABEL commit=${COMMIT}
LABEL tag=$TAG

# Allow exposing HTTP endpoint
EXPOSE 9090

# Install dependencies
RUN apt-get update && \
    apt-get install -y apt-transport-https build-essential cmake && \
    apt-get install --no-install-recommends -y ffmpeg vim

# Prepare for nonroot user
RUN groupadd -g $GID app; \
    useradd -g $GID -u $UID -m -d /code -s /usr/sbin/nologin app

USER app

# Add project source
COPY --chown=app:app . /code

# Setup work directory
WORKDIR /code

# Create directory for storing logs
RUN mkdir /code/logs

ENV GIT_COMMIT_SHA=${COMMIT}

# Install dependencies
RUN npm install

# Run build
RUN npm run build

RUN cp -r /code/web/img /code/web/dist/

# Default command to start the server
CMD npm run start 2>&1 | tee /code/logs/voice-server.log
