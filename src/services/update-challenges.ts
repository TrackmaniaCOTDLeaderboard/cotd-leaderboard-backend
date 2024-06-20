import { Challenge, getChallengeLeaderboard } from "../api/live-service/challenges";
import { database } from "../database";
import { parseChallenge, wait } from "../util";
import { updatePlayers } from "./update-players";

export const updateChallenges = async (challenges: Challenge[]) => {
    for (const challenge of challenges) {
        const success = await updateChallenge(challenge);
        if (!success) continue;
        await wait(1);
        console.log(challenge.name);
    }
}

const MAIN_CUP_PLAYERS = 640;
const RERUN_CUP_PLAYERS = 128;

const updateChallenge = async (challenge: Challenge) => {
    const result = parseChallenge(challenge);
    if (result === null) return false;

    await database.challenge.upsert({
        where: {
            id: challenge.id
        },
        create: {
            year: result.year,
            month: result.month,
            day: result.day,
            version: result.division,
            id: challenge.id,
            name: challenge.name,
            leaderboardId: challenge.leaderboardId
        },
        update: {}
    });

    const leaderboardSize = result.division === 1 ? MAIN_CUP_PLAYERS : RERUN_CUP_PLAYERS;
    const results = await getChallengeLeaderboard(challenge.id, leaderboardSize);
    const userIds = results.map(result => result.player);
    await updatePlayers(userIds);

    const data = results.map(result => {
        return {
            position: result.rank,
            time: result.score,
            challengeId: challenge.id,
            playerId: result.player
        }
    })
    await database.challengeResult.createMany({
        data: data,
        skipDuplicates: true
    });

    return true;
}