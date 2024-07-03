-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "parentId" TEXT,
    "displayId" TEXT,
    CONSTRAINT "Zone_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Zone" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Zone_displayId_fkey" FOREIGN KEY ("displayId") REFERENCES "Zone" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    CONSTRAINT "Player_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "participants" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "leaderboardId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CupResult" (
    "position" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "cupId" INTEGER NOT NULL,
    "playerId" TEXT NOT NULL,

    PRIMARY KEY ("cupId", "playerId"),
    CONSTRAINT "CupResult_cupId_fkey" FOREIGN KEY ("cupId") REFERENCES "Cup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CupResult_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "leaderboardId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ChallengeResult" (
    "playerId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "challengeId"),
    CONSTRAINT "ChallengeResult_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChallengeResult_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Map" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "seasonUid" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authorTime" INTEGER NOT NULL,
    "goldTime" INTEGER NOT NULL,
    "silverTime" INTEGER NOT NULL,
    "bronzeTime" INTEGER NOT NULL,
    "exchangeId" TEXT,
    "style" TEXT,
    "type" TEXT,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "upvotes" INTEGER NOT NULL,
    "downvotes" INTEGER NOT NULL,
    CONSTRAINT "Map_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimeAttack" (
    "locked" BOOLEAN NOT NULL,
    "position" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "playerId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,

    PRIMARY KEY ("playerId", "mapId", "locked"),
    CONSTRAINT "TimeAttack_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeAttack_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GlobalCupLeaderboard" (
    "playerId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "first" INTEGER NOT NULL,
    "second" INTEGER NOT NULL,
    "third" INTEGER NOT NULL,
    "top8" INTEGER NOT NULL,
    "top16" INTEGER NOT NULL,
    "top32" INTEGER NOT NULL,
    "top64" INTEGER NOT NULL,
    "top128" INTEGER NOT NULL,
    "bestResult" INTEGER NOT NULL,
    "average" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "version"),
    CONSTRAINT "GlobalCupLeaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlyCupLeaderboard" (
    "playerId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "first" INTEGER NOT NULL,
    "second" INTEGER NOT NULL,
    "third" INTEGER NOT NULL,
    "top8" INTEGER NOT NULL,
    "top16" INTEGER NOT NULL,
    "top32" INTEGER NOT NULL,
    "top64" INTEGER NOT NULL,
    "top128" INTEGER NOT NULL,
    "bestResult" INTEGER NOT NULL,
    "average" REAL NOT NULL,
    "position" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "year", "month", "version"),
    CONSTRAINT "MonthlyCupLeaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MapperLeaderboard" (
    "playerId" TEXT NOT NULL PRIMARY KEY,
    "points" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "MapperLeaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GlobalTimeAttackLeaderboard" (
    "playerId" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "first" INTEGER NOT NULL,
    "second" INTEGER NOT NULL,
    "third" INTEGER NOT NULL,
    "top8" INTEGER NOT NULL,
    "top16" INTEGER NOT NULL,
    "top32" INTEGER NOT NULL,
    "top64" INTEGER NOT NULL,
    "top128" INTEGER NOT NULL,
    "bestResult" INTEGER NOT NULL,
    "average" REAL NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "GlobalTimeAttackLeaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlyTimeAttackLeaderboard" (
    "playerId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "first" INTEGER NOT NULL,
    "second" INTEGER NOT NULL,
    "third" INTEGER NOT NULL,
    "top8" INTEGER NOT NULL,
    "top16" INTEGER NOT NULL,
    "top32" INTEGER NOT NULL,
    "top64" INTEGER NOT NULL,
    "top128" INTEGER NOT NULL,
    "bestResult" INTEGER NOT NULL,
    "average" REAL NOT NULL,
    "position" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "year", "month"),
    CONSTRAINT "MonthlyTimeAttackLeaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GlobalChallengeLeaderboard" (
    "playerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "first" INTEGER NOT NULL,
    "second" INTEGER NOT NULL,
    "third" INTEGER NOT NULL,
    "top8" INTEGER NOT NULL,
    "top16" INTEGER NOT NULL,
    "top32" INTEGER NOT NULL,
    "top64" INTEGER NOT NULL,
    "top128" INTEGER NOT NULL,
    "bestResult" INTEGER NOT NULL,
    "average" REAL NOT NULL,
    "position" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,

    PRIMARY KEY ("version", "playerId"),
    CONSTRAINT "GlobalChallengeLeaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlyChallengeLeaderboard" (
    "playerId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "first" INTEGER NOT NULL,
    "second" INTEGER NOT NULL,
    "third" INTEGER NOT NULL,
    "top8" INTEGER NOT NULL,
    "top16" INTEGER NOT NULL,
    "top32" INTEGER NOT NULL,
    "top64" INTEGER NOT NULL,
    "top128" INTEGER NOT NULL,
    "bestResult" INTEGER NOT NULL,
    "average" REAL NOT NULL,
    "position" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "version", "month", "year"),
    CONSTRAINT "MonthlyChallengeLeaderboard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cup_year_month_day_version_key" ON "Cup"("year", "month", "day", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_year_month_day_version_key" ON "Challenge"("year", "month", "day", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Map_year_month_day_key" ON "Map"("year", "month", "day");
