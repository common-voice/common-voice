# Builder — compile native tools, install deps, build
# ===================================================
FROM node:24-trixie AS builder

RUN apt-get update && apt-get install -y \
    python3 python3-venv python3-dev build-essential \
    git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip setuptools wheel

WORKDIR /build

# Rust toolchain + mp3-duration-reporter binary => /usr/local/bin
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"
RUN git clone --depth 1 -b release-v1.0.0 \
        https://github.com/common-voice/mp3-duration-reporter.git && \
    cd mp3-duration-reporter && \
    cargo install --path . --root /usr/local && \
    cd .. && rm -rf mp3-duration-reporter

# CorporaCreator into the virtual environment (new v1.4.0 install method)
RUN git clone --depth 1 -b release-v1.4.0 \
        https://github.com/common-voice/CorporaCreator.git && \
    cd CorporaCreator && \
    pip install . && \
    cd .. && rm -rf CorporaCreator

# Node.js application
WORKDIR /home/node/code
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --audit=false --cache /tmp/npm-cache && rm -rf /tmp/npm-cache
COPY ./ ./
RUN npm run build

# Runtime — image with only what's needed
# =======================================
FROM node:24-trixie-slim

# Minimal runtime deps: python3 interpreter for CorporaCreator
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 9001

# mp3-duration-reporter binary (compiled Rust, accessible to all users)
COPY --from=builder /usr/local/bin/mp3-duration-reporter /usr/local/bin/

# Python virtual environment with CorporaCreator + dependencies
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Application code — owned by node user, no slow chown -R needed
WORKDIR /home/node/code
COPY --from=builder --chown=node:node /home/node/code ./

USER node

CMD ["npm", "run", "start"]
