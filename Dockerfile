FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npx prisma generate

RUN npx prisma migrate deploy

RUN npm run build

ENV PORT 3000

EXPOSE $PORT

CMD [ "npm", "start" ]