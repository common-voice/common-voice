FROM node:18-bullseye

USER node

RUN mkdir -p /home/node/code

WORKDIR /home/node/code

COPY --chown=node ./package.json ./

# Install dependencies
RUN npm install

COPY --chown=node ./ ./

RUN npm run build

CMD ["npm", "run", "start"]
