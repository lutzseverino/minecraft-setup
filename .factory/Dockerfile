FROM node:24-bookworm-slim

# The factory supplies its agent tooling and user in a separate layer.
RUN npm install --global npm@11.6.2 \
    && node --version \
    && npm --version
