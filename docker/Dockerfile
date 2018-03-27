FROM node:stretch

# Allow exposing HTTP endpoint
EXPOSE 9000

# Add project source
COPY . /code

# Setup work directory
WORKDIR /code

# Install dependencies
RUN apt-get update && \
    apt-get install -y apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install --no-install-recommends -y yarn ffmpeg

# Install yarn dependencies
RUN yarn

# Default command to start the server
CMD yarn start
