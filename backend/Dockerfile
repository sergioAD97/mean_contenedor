FROM node:14-alpine

RUN apk --no-cache -U upgrade

RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN npm install -g pm2

COPY package*.json process.yml ./

USER node

RUN npm install --only=production

COPY --chown=node:node . .

ARG PORT=4100

ENV NODE_ENV production

EXPOSE ${PORT}

ENTRYPOINT [ "pm2-runtime", "./process.yml" ]

# docker build -t citagendab:prod .
