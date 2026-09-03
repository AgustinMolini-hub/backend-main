FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads/users uploads/receipts logs \
    && chown -R node:node /app

USER node

EXPOSE 8080

CMD ["npm", "start"]