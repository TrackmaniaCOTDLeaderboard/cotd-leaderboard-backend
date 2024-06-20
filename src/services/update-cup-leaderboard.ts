import { GlobalCupLeaderboard, MonthlyCupLeaderboard } from "@prisma/client";
import { database } from "../database";
import { getPointsForPosition } from "../util/position-to-points";

type Result = {
    cup: {
        version: number;
    };
} & {
    position: number;
    points: number;
    cupId: number;
    playerId: string;
};

type PlayerWithResults = {
    CupResults: Result[];
} & {
    id: string;
    name: string;
    zoneId: string;
};

const COMBINED_CUP_VERSION = 0;
const MAIN_CUP_VERSION = 1;
const NIGHT_RERUN_VERSION = 2;
const MORNING_RERUN_VERSION = 3;

const assignRanks = (leaderboard: (GlobalCupLeaderboard | MonthlyCupLeaderboard)[]) => {
    leaderboard.sort((a, b) => b.points - a.points);

    let currentRank = 1;
    let previousPoints: number | undefined = undefined;
    let rankCount = 0;

    leaderboard.forEach((entry, index) => {
        if (previousPoints !== entry.points) {
            currentRank += rankCount;
            rankCount = 1;
        } else {
            rankCount++;
        }

        entry.position = currentRank;
        previousPoints = entry.points;
    });

    return leaderboard;
}

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
        points += getPointsForPosition(position, result.cup.version !== MAIN_CUP_VERSION)
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

    const combinedResults = player.CupResults;
    const mainCupResults = player.CupResults.filter(result => result.cup.version === MAIN_CUP_VERSION);
    const nightRerunCupResults = player.CupResults.filter(result => result.cup.version === NIGHT_RERUN_VERSION);
    const morningRerunCupResults = player.CupResults.filter(result => result.cup.version === MORNING_RERUN_VERSION);

    const playerId = player.id;

    return [
        getStatisticsByResult(playerId, combinedResults, COMBINED_CUP_VERSION),
        getStatisticsByResult(playerId, mainCupResults, MAIN_CUP_VERSION),
        getStatisticsByResult(playerId, nightRerunCupResults, NIGHT_RERUN_VERSION),
        getStatisticsByResult(playerId, morningRerunCupResults, MORNING_RERUN_VERSION),
    ]
}


export const updateMonthlyCupLeaderboard = async (year: number, month: number) => {
    const players = await database.player.findMany({
        include: {
            CupResults: {
                where: {
                    cup: {
                        year: year,
                        month: month,
                    },
                },
                include: {
                    cup: {
                        select: {
                            version: true
                        }
                    }
                }
            }
        }
    });

    const combinedLeaderboardEntries: MonthlyCupLeaderboard[] = [];
    const mainLeaderboardEntries: MonthlyCupLeaderboard[] = [];
    const nightRerunLeaderboardEntries: MonthlyCupLeaderboard[] = [];
    const morningRerunLeaderboardEntries: MonthlyCupLeaderboard[] = [];
    players.forEach(player => {
        const [combined, main, night, morning] = getStatisticsOfPlayer(player);

        if (combined !== null) combinedLeaderboardEntries.push({ year, month, ...combined });
        if (main !== null) mainLeaderboardEntries.push({ year, month, ...main });
        if (night !== null) nightRerunLeaderboardEntries.push({ year, month, ...night });
        if (morning !== null) morningRerunLeaderboardEntries.push({ year, month, ...morning });
    });

    assignRanks(combinedLeaderboardEntries);
    assignRanks(mainLeaderboardEntries);
    assignRanks(nightRerunLeaderboardEntries);
    assignRanks(morningRerunLeaderboardEntries);

    await database.$transaction([
        database.monthlyCupLeaderboard.deleteMany({
            where: {
                year: year,
                month: month
            }
        }),
        database.monthlyCupLeaderboard.createMany({
            data: [
                ...combinedLeaderboardEntries,
                ...mainLeaderboardEntries,
                ...nightRerunLeaderboardEntries,
                ...morningRerunLeaderboardEntries]
        })
    ]);

}

export const updateGlobalCupLeaderboard = async () => {
    const players = await database.player.findMany({
        include: {
            CupResults: {
                include: {
                    cup: {
                        select: {
                            version: true
                        }
                    }
                }
            }
        }
    });

    const combinedLeaderboardEntries: GlobalCupLeaderboard[] = [];
    const mainLeaderboardEntries: GlobalCupLeaderboard[] = [];
    const nightRerunLeaderboardEntries: GlobalCupLeaderboard[] = [];
    const morningRerunLeaderboardEntries: GlobalCupLeaderboard[] = [];
    players.forEach(player => {
        const [combined, main, night, morning] = getStatisticsOfPlayer(player);

        if (combined !== null) combinedLeaderboardEntries.push(combined);
        if (main !== null) mainLeaderboardEntries.push(main);
        if (night !== null) nightRerunLeaderboardEntries.push(night);
        if (morning !== null) morningRerunLeaderboardEntries.push(morning);
    });

    assignRanks(combinedLeaderboardEntries);
    assignRanks(mainLeaderboardEntries);
    assignRanks(nightRerunLeaderboardEntries);
    assignRanks(morningRerunLeaderboardEntries);

    await database.$transaction([
        database.globalCupLeaderboard.deleteMany(),
        database.globalCupLeaderboard.createMany({
            data: [
                ...combinedLeaderboardEntries,
                ...mainLeaderboardEntries,
                ...nightRerunLeaderboardEntries,
                ...morningRerunLeaderboardEntries]
        })
    ]);
}