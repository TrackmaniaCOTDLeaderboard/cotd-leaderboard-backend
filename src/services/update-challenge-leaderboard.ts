import { GlobalChallengeLeaderboard, MonthlyChallengeLeaderboard } from "@prisma/client";
import { database } from "../database";
import { getPointsForPosition } from "../util/position-to-points";

type Result = {
    challenge: {
        version: number;
    };
} & {
    playerId: string;
    position: number;
    time: number;
    challengeId: number;
}

type PlayerWithResults = {
    ChallengeResults: Result[];
} & {
    id: string;
    name: string;
    zoneId: string;
};

const COMBINED_CUP_VERSION = 0;
const MAIN_CUP_VERSION = 1;
const NIGHT_RERUN_VERSION = 2;
const MORNING_RERUN_VERSION = 3;

const getStatisticsByResult = (playerId: string, results: Result[], version: number) => {
    if (results.length === 0) return null;

    let bestResult = results[0].position;
    let sumOfPositions = 0;
    let first = 0;
    let second = 0;
    let third = 0;
    let top8 = 0;
    let top16 = 0;
    let top32 = 0;
    let top64 = 0;
    let top128 = 0;
    let points = 0;

    for (const result of results) {

        const position = result.position;
        if (position === 1) {
            first++;
        }
        if (position === 2) {
            second++;
        }
        if (position === 3) {
            third++;
        }
        if (position > 3 && position <= 8) {
            top8++;
        }
        if (position > 8 && position <= 16) {
            top16++;
        }
        if (position > 16 && position <= 32) {
            top32++;
        }
        if (position > 32 && position <= 64) {
            top64++;
        }
        if (position > 64 && position <= 128) {
            top128++;
        }
        if (bestResult === undefined || position < bestResult) {
            bestResult = position;
        }
        sumOfPositions += position;
        points += getPointsForPosition(position, result.challenge.version !== MAIN_CUP_VERSION)
    }

    const amount = results.length;
    const average = sumOfPositions / amount;

    return {
        playerId,
        version,
        bestResult,
        average,
        first,
        second,
        third,
        top8,
        top16,
        top32,
        top64,
        top128,
        amount,
        points,
        position: 0
    }
}


const getStatisticsOfPlayer = (player: PlayerWithResults) => {

    const combinedResults = player.ChallengeResults;
    const mainCupResults = player.ChallengeResults.filter(result => result.challenge.version === MAIN_CUP_VERSION);
    const nightRerunCupResults = player.ChallengeResults.filter(result => result.challenge.version === NIGHT_RERUN_VERSION);
    const morningRerunCupResults = player.ChallengeResults.filter(result => result.challenge.version === MORNING_RERUN_VERSION);

    const playerId = player.id;

    return [
        getStatisticsByResult(playerId, combinedResults, COMBINED_CUP_VERSION),
        getStatisticsByResult(playerId, mainCupResults, MAIN_CUP_VERSION),
        getStatisticsByResult(playerId, nightRerunCupResults, NIGHT_RERUN_VERSION),
        getStatisticsByResult(playerId, morningRerunCupResults, MORNING_RERUN_VERSION),
    ]
}


export const updateMonthlyChallengeLeaderboard = async (year: number, month: number) => {
    const players = await database.player.findMany({
        include: {
            ChallengeResults: {
                where: {
                    challenge: {
                        year: year,
                        month: month,
                    },
                },
                include: {
                    challenge: { select: { version: true } }
                }
            }
        }
    });

    const leaderboardEntries: MonthlyChallengeLeaderboard[] = [];
    players.forEach(player => {
        const statistics = getStatisticsOfPlayer(player);
        statistics.forEach(statistic => {
            if (statistic === null) return;
            leaderboardEntries.push({ year, month, ...statistic })
        });
    });

    await database.$transaction([
        database.monthlyChallengeLeaderboard.deleteMany({
            where: {
                year: year,
                month: month
            }
        }),
        database.monthlyChallengeLeaderboard.createMany({
            data: leaderboardEntries
        })
    ]);

}

export const updateGlobalChallengeLeaderboard = async () => {
    const players = await database.player.findMany({
        include: {
            ChallengeResults: {
                include: {
                    challenge: { select: { version: true } }
                }
            }
        }
    });

    const leaderboardEntries: GlobalChallengeLeaderboard[] = [];
    players.forEach(player => {
        const statistics = getStatisticsOfPlayer(player);
        statistics.forEach(statistic => {
            if (statistic === null) return;
            leaderboardEntries.push(statistic);
        });
    });

    await database.$transaction([
        database.globalChallengeLeaderboard.deleteMany(),
        database.globalChallengeLeaderboard.createMany({
            data: leaderboardEntries
        })
    ]);
}