FROM node:16.13.2-alpine3.15

WORKDIR /usr/src/app
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
COPY . .
RUN yarn

EXPOSE 8080

CMD ["yarn", "start"]