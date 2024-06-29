FROM node:20

WORKDIR /usr/src/app

ENV DATABASE_URL file:./cotd.db
COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

ENV PORT 3000

EXPOSE $PORT

CMD [ "npm", "start" ]