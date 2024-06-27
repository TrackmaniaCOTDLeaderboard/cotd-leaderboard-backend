import { database } from "../database";
import { calculatePointDistribution } from "../util";
import { assignRanks, getStatisticsByResults, Result, Statistics } from "../util/calculate-leaderboard";


const pointDistribution = calculatePointDistribution(256, 1000, 1);

type ResultWithChallenge = Result & {
    map: {
        year: number;
        month: number;
    }
}

type PlayerWithResult = {
    id: string;
    TimeAttack: ResultWithChallenge[];
}

type LeaderboardEntry = Statistics & {
    position: number;
    playerId: string;
}


const calculateLeaderboardEntryOfPlayers = (playerId: string, results: ResultWithChallenge[]): LeaderboardEntry | null => {
    const statistic = getStatisticsByResults(results, pointDistribution);

    if (statistic === null) return null;

    const position = 0;
    return {
        ...statistic,
        playerId,
        position
    }
}

export const calculateLeaderboard = (players: PlayerWithResult[]) => {
    const leaderboardEntries: LeaderboardEntry[] = [];

    players.forEach(player => {
        const main = calculateLeaderboardEntryOfPlayers(player.id, player.TimeAttack);
        if (main !== null) leaderboardEntries.push(main);
    })

    assignRanks(leaderboardEntries);
    return leaderboardEntries;
}

export const updateMonthlyTimeAttackLeaderboard = async (year: number, month: number) => {
    const players = await database.player.findMany({
        include: {
            TimeAttack: {
                where: {
                    map: { year, month },
                },
                include: {
                    map: { select: { year: true, month: true } }
                }
            }
        }
    });

    const leaderboard = calculateLeaderboard(players).map(entry => { return { ...entry, month, year } });
    if (leaderboard.length === 0) return;
    await database.$transaction([
        database.monthlyTimeAttackLeaderboard.deleteMany({
            where: {
                year: year,
                month: month
            }
        }),
        database.monthlyTimeAttackLeaderboard.createMany({
            data: leaderboard
        })
    ]);

}

export const updateGlobalTimeAttackLeaderboard = async () => {
    const players = await database.player.findMany({
        include: {
            TimeAttack: {
                include: {
                    map: { select: { year: true, month: true } }
                }
            }
        }
    });

    const leaderboard = calculateLeaderboard(players);
    if (leaderboard.length === 0) return;
    await database.$transaction([
        database.globalTimeAttackLeaderboard.deleteMany(),
        database.globalTimeAttackLeaderboard.createMany({
            data: leaderboard
        })
    ]);
}