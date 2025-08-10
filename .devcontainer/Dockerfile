FROM node:20-alpine

# Install dependencies with explicit verification
RUN apk update && \
    apk add --no-cache \
        curl \
        wget \
        git \
        openssh \
        bash \
        ca-certificates \
        && rm -rf /var/cache/apk/* \
        && which wget \
        && which curl \
        && wget --version \
        && curl --version

# Install aws cli
RUN apk add --no-cache aws-cli

# Create node user if it doesn't exist and set permissions
RUN addgroup -g 1000 node && \
    adduser -D -s /bin/bash -u 1000 -G node node

# Set working directory
WORKDIR /workspace

# Change ownership to node user
RUN chown -R node:node /workspace

# Verify tools are available to node user
USER node
RUN which wget && which curl
USER root