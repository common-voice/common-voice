# SCS image: multi-stage, Node 24, Debian 13 (trixie). The last stage is production.

# Toolchain for native addons. @sentry/profiling-node 8.x has no Node 24 prebuilt,
# so it compiles from source and the server crashes on boot without these.
FROM node:24.21.0-trixie AS toolchain

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential cmake python3 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# The e2e runner binary is not used in containers
ENV CYPRESS_INSTALL_BINARY=0

WORKDIR /code

# Local development (docker-compose target): source is bind-mounted, deps install at start
FROM toolchain AS dev

RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 9000

CMD ["yarn", "start"]

# Builder
FROM toolchain AS builder

COPY . /code

RUN yarn --frozen-lockfile

# Substituted into the web bundle at build time
ARG COMMIT="local-build"
ENV GIT_COMMIT_SHA=${COMMIT}

RUN yarn build

# Runtime
FROM node:24.21.0-trixie-slim

ARG COMMIT="local-build"
ARG TAG=""
ARG UID=10001
ARG GID=10001

LABEL commit=${COMMIT}
LABEL tag=${TAG}

# Runtime media dependency
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Application user
RUN groupadd -g $GID app; \
    useradd -g $GID -u $UID -m -d /code -s /usr/sbin/nologin app

WORKDIR /code

# Application source, build output, and installed dependencies
COPY --from=builder --chown=app:app /code /code

# Create directory for storing logs
RUN mkdir -p /code/logs && chown app:app /code/logs

USER app

ENV GIT_COMMIT_SHA=${COMMIT}

EXPOSE 9000

CMD ["yarn", "start:prod"]
