FROM node:18-bullseye

RUN apt-get update && \
    apt-get install python3-pip vim -y && \
    pip3 install --upgrade setuptools

RUN groupmod -g 10001 node && usermod -u 10001 -g 10001 node

RUN mkdir /cache && chmod 777 /cache

USER node

RUN mkdir -p /home/node/code && \
    cd /home/node && \
    curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    git clone --depth 1 -b release-v1.2.1 https://github.com/common-voice/CorporaCreator.git && \
    git clone --depth 1 -b release-v1.0.0 https://github.com/common-voice/mp3-duration-reporter.git && \
    cd CorporaCreator && \
    python3 setup.py install --user && \
    cd /home/node/mp3-duration-reporter && \
    /home/node/.cargo/bin/cargo install --path .

ENV PATH "$PATH:/home/node/.local/bin/:/home/node/.cargo/bin"
ENV npm_config_cache "/home/node/"

WORKDIR /home/node/code

COPY --chown=node ./package.json ./
COPY --chown=node ./package-lock.json ./

# Install dependencies
RUN npm ci

COPY --chown=node ./ ./

RUN npm run build

CMD ["npm", "run", "start"]
