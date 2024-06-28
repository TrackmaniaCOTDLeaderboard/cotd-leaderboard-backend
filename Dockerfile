FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/TrackmaniaCOTDLeaderboard/cotd-leaderboard-backend.git .

RUN npm ci --only=production
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

ENV PORT 3000

EXPOSE $PORT

CMD [ "npm", "start" ]