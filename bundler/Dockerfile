FROM node:18-bullseye

RUN apt-get update && \
    apt-get install python3-pip vim -y && \
    pip3 install --upgrade setuptools

USER node

RUN mkdir -p /home/node/code && \
    cd /home/node && \
    git clone --depth 1 -b release-v1.0.0 https://github.com/common-voice/CorporaCreator.git && \
    cd CorporaCreator && \
    python3 setup.py install --user

ENV PATH "$PATH:/home/node/.local/bin/"

WORKDIR /home/node/code

COPY --chown=node ./package.json ./

# Install dependencies
RUN npm install

COPY --chown=node ./ ./

RUN npm run build

CMD ["npm", "run", "start"]
