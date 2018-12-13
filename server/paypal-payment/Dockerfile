# Stage 1 - the build process
FROM node:10.14.1-alpine as builder

RUN mkdir -p /usr/src/builder

WORKDIR /usr/src/builder

ARG PORT
ARG PAYPAL_MODE
ARG PAYPAL_CLIENT_ID
ARG PAYPAL_CLIENT_SECRET

ENV PORT=$PORT
ENV PAYPAL_MODE=$PAYPAL_MODE
ENV PAYPAL_CLIENT_ID=$PAYPAL_CLIENT_ID
ENV PAYPAL_CLIENT_SECRET=$PAYPAL_CLIENT_SECRET

COPY . .

RUN npm install && npm run build && rm -rf node_modules


# Stage 2 - the production environment
FROM keymetrics/pm2:latest-alpine
LABEL author="Ohm Piromrak"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=builder /usr/src/builder/build .

EXPOSE 80

CMD ["pm2-runtime", "start", "index.js"]
