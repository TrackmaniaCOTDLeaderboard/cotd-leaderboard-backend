import { database } from "../database";
import { calculatePointDistribution } from "../util";
import { assignRanks, getStatisticsByResults, Result, Statistics } from "../util/calculate-leaderboard";

const MAIN_VERSION = 1;
const NIGHT_RERUN_VERSION = 2;
const MORNING_RERUN_VERSION = 3;

const pointDistributionMainCup = calculatePointDistribution(640, 1000, 1);
const pointDistributionRerunCup = calculatePointDistribution(128, 200, 1);


type ResultWithCup = Result & {
    cup: {
        version: number;
    }
}

type PlayerWithResult = {
    id: string;
    CupResults: ResultWithCup[];
}

type LeaderboardEntry = Statistics & {
    version: number;
    position: number;
    playerId: string;
}


const calculateLeaderboardEntryOfPlayers = (playerId: string, results: ResultWithCup[], version: number): LeaderboardEntry | null => {

    const pointDistribution = version === MAIN_VERSION ? pointDistributionMainCup : pointDistributionRerunCup;

    const filteredResults = results.filter(result => result.cup.version === version);
    const statistic = getStatisticsByResults(filteredResults, pointDistribution);

    if (statistic === null) return null;

    const position = 0;
    return {
        ...statistic,
        version,
        playerId,
        position
    }
}

export const calculateLeaderboard = (players: PlayerWithResult[]) => {
    const mainLeaderboardEntries: LeaderboardEntry[] = [];
    const nightRerunLeaderboardEntries: LeaderboardEntry[] = [];
    const morningRerunLeaderboardEntries: LeaderboardEntry[] = [];

    players.forEach(player => {
        const main = calculateLeaderboardEntryOfPlayers(player.id, player.CupResults, MAIN_VERSION);
        const nightRerun = calculateLeaderboardEntryOfPlayers(player.id, player.CupResults, NIGHT_RERUN_VERSION);
        const morningRerun = calculateLeaderboardEntryOfPlayers(player.id, player.CupResults, MORNING_RERUN_VERSION);

        if (main !== null) mainLeaderboardEntries.push(main);
        if (nightRerun !== null) nightRerunLeaderboardEntries.push(nightRerun);
        if (morningRerun !== null) morningRerunLeaderboardEntries.push(morningRerun);
    })

    assignRanks(mainLeaderboardEntries);
    assignRanks(nightRerunLeaderboardEntries);
    assignRanks(morningRerunLeaderboardEntries);

    return [...mainLeaderboardEntries, ...nightRerunLeaderboardEntries, ...morningRerunLeaderboardEntries]
}

export const updateMonthlyCupLeaderboard = async (year: number, month: number) => {
    const players = await database.player.findMany({
        include: {
            CupResults: {
                where: {
                    cup: { year, month },
                },
                include: {
                    cup: { select: { version: true } }
                }
            }
        }
    });

    const leaderboard = calculateLeaderboard(players).map(entry => { return { ...entry, month, year } });
    if (leaderboard.length === 0) return;
    await database.$transaction([
        database.monthlyCupLeaderboard.deleteMany({
            where: { year, month }
        }),
        database.monthlyCupLeaderboard.createMany({
            data: leaderboard
        })
    ]);

}

export const updateGlobalCupLeaderboard = async () => {
    const players = await database.player.findMany({
        include: {
            CupResults: {
                include: {
                    cup: { select: { version: true } }
                }
            }
        }
    });

    const leaderboard = calculateLeaderboard(players);
    if (leaderboard.length === 0) return;
    await database.$transaction([
        database.globalCupLeaderboard.deleteMany(),
        database.globalCupLeaderboard.createMany({
            data: leaderboard
        })
    ]);
}