import { database } from "../database";
import { calculatePointDistribution } from "../util";
import { assignRanks, getStatisticsByResults, Result, Statistics } from "../util/calculate-leaderboard";


const COMBINED_VERSION = 0;
const MAIN_VERSION = 1;
const NIGHT_RERUN_VERSION = 2;
const MORNING_RERUN_VERSION = 3;

const pointDistributionMainChallenge = calculatePointDistribution(640, 1000, 1);
const pointDistributionRerunChallenge = calculatePointDistribution(128, 200, 1);


type ResultWithChallenge = Result & {
    challenge: {
        version: number;
    }
}

type PlayerWithResult = {
    id: string;
    ChallengeResults: ResultWithChallenge[];
}

type LeaderboardEntry = Statistics & {
    version: number;
    position: number;
    playerId: string;
}


const calculateLeaderboardEntryOfPlayers = (playerId: string, results: ResultWithChallenge[], version: number): LeaderboardEntry | null => {

    const pointDistribution = version === MAIN_VERSION ? pointDistributionMainChallenge : pointDistributionRerunChallenge;

    const filteredResults = results.filter(result => result.challenge.version === version);
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
        const main = calculateLeaderboardEntryOfPlayers(player.id, player.ChallengeResults, MAIN_VERSION);
        const nightRerun = calculateLeaderboardEntryOfPlayers(player.id, player.ChallengeResults, NIGHT_RERUN_VERSION);
        const morningRerun = calculateLeaderboardEntryOfPlayers(player.id, player.ChallengeResults, MORNING_RERUN_VERSION);

        if (main !== null) mainLeaderboardEntries.push(main);
        if (nightRerun !== null) nightRerunLeaderboardEntries.push(nightRerun);
        if (morningRerun !== null) morningRerunLeaderboardEntries.push(morningRerun);
    })

    assignRanks(mainLeaderboardEntries);
    assignRanks(nightRerunLeaderboardEntries);
    assignRanks(morningRerunLeaderboardEntries);

    return [...mainLeaderboardEntries, ...nightRerunLeaderboardEntries, ...morningRerunLeaderboardEntries]
}

export const updateMonthlyChallengeLeaderboard = async (year: number, month: number) => {
    const players = await database.player.findMany({
        include: {
            ChallengeResults: {
                where: {
                    challenge: { year, month },
                },
                include: {
                    challenge: { select: { version: true } }
                }
            }
        }
    });

    const leaderboard = calculateLeaderboard(players).map(entry => { return { ...entry, month, year } });
    if (leaderboard.length === 0) return;
    await database.$transaction([
        database.monthlyChallengeLeaderboard.deleteMany({
            where: {
                year: year,
                month: month
            }
        }),
        database.monthlyChallengeLeaderboard.create({
            data: leaderboard[0]
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

    const leaderboard = calculateLeaderboard(players);

    if (leaderboard.length === 0) return;
    await database.$transaction([
        database.globalChallengeLeaderboard.deleteMany(),
        database.globalChallengeLeaderboard.createMany({
            data: leaderboard
        })
    ]);
}