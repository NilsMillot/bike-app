FROM node:16.17-alpine3.15
WORKDIR /app
COPY package.json ./
# COPY package-lock.json ./
COPY ./ ./
RUN npm i
# RUN npm install -g sequelize-cli && npm install -g sequelize
# RUN npm install -g pg
# FOLOWING INSTRUCTIONS ARE NEEDED FOR WSL ENVIRONMENT
# RUN chown -R node /app/node_modules
# USER node
CMD ["npm", "run", "start"]