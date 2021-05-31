FROM node:alpine

ENV CI=true

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY ./ ./

EXPOSE 5000

CMD ["npm", "run", "start:dev"]