FROM node:16.17-alpine3.15
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN mkdir node_modules/.cache \
    && chmod -R 777 node_modules/.cache \
    && chown -R node node_modules
USER node
CMD ["npm", "run", "start"]