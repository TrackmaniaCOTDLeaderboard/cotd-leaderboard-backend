import { Competition, getCompetitionLeaderboard } from "../api/live-service/competitions";
import { database } from "../database";
import { parseCompetition, wait } from "../util";
import { updatePlayers } from "./update-players";

const MAIN_CUP_PLAYERS = 640;
const RERUN_CUP_PLAYERS = 128;

export const updateCups = async (competitions: Competition[]) => {
    for (const competition of competitions) {
        const success = await updateCup(competition);
        if (!success) continue;

        await wait(1);
    }
};

const updateCup = async (competition: Competition) => {
    const result = parseCompetition(competition);
    if (result === null) return false;

    await database.cup.upsert({
        where: {
            id: competition.id
        },
        create: {
            participants: competition.nbPlayers,
            year: result.year,
            month: result.month,
            day: result.day,
            version: result.division,
            id: competition.id,
            name: competition.name,
            leaderboardId: competition.leaderboardId
        },
        update: {}
    });

    const leaderboardSize = result.division === 1 ? MAIN_CUP_PLAYERS : RERUN_CUP_PLAYERS;
    const results = await getCompetitionLeaderboard(competition.id, leaderboardSize);
    const userIds = results.map(result => result.participant);
    await updatePlayers(userIds);

    const data = results.map(result => {
        return {
            position: result.rank,
            points: result.score,
            cupId: competition.id,
            playerId: result.participant
        }
    })
    await database.cupResult.createMany({
        data: data,
        skipDuplicates: true
    });

    return true;
}