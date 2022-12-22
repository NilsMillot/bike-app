FROM node:16.17-alpine3.15
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
# RUN npm i
# RUN chown -R node /app/node_modules
RUN mkdir /app/node_modules/.cache \
    && chown -R node:node /app/node_modules/.cache
USER node
CMD ["npm", "run", "start"]