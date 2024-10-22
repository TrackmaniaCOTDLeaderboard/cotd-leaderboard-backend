import { NadeoLiveService } from "../api";
import { database } from "../database";
import { calculateChunksDetails, Log, parseChallenge, wait } from "../util";
import { updatePlayers } from "./players";
import { Service } from "./service-manager";

const MAIN_CUP_PLAYERS = 640;
const RERUN_CUP_PLAYERS = 128;

const MAIN_CUP_VERSION = 1;

const getChallenges = async (length: number, offset: number) => {
    const challengeChunks = calculateChunksDetails(NadeoLiveService.CHUNK_SIZE_CHALLENGES, length, offset);

    const challenges: NadeoLiveService.Challenge[] = [];
    for (const challengeChunk of challengeChunks) {
        const result = await NadeoLiveService.getChallenges(challengeChunk.length, challengeChunk.offset);
        if (result.length === 0) break;
        challenges.push(...result);
        await wait(0.5);
    }
    return challenges;
}

const getChallengeResults = async (challengeId: number, length: number) => {
    const resultsChunks = calculateChunksDetails(NadeoLiveService.CHUNK_SIZE_CHALLENGE_RESULTS, length);

    const results: NadeoLiveService.ChallengeResult[] = [];

    let count = 0;
    for (const resultChunk of resultsChunks) {
        const result = await NadeoLiveService.getChallengeResults(challengeId, resultChunk.length, resultChunk.offset);
        results.push(...result);
        count++;
        if (count % 5 === 0) {
            await wait(1);
        }
    }
    return results;
}

const updateChallenge = async (challenge: NadeoLiveService.Challenge) => {
    const challengeMetaData = parseChallenge(challenge.name);
    if (challengeMetaData === null) return false;

    await database.challenge.upsert({
        where: {
            id: challenge.id
        },
        create: {
            ...challengeMetaData,
            id: challenge.id,
            name: challenge.name,
            leaderboardId: challenge.leaderboardId
        },
        update: {}
    });

    const leaderboardSize = challengeMetaData.version === MAIN_CUP_VERSION
        ? MAIN_CUP_PLAYERS
        : RERUN_CUP_PLAYERS;

    const results = await getChallengeResults(challenge.id, leaderboardSize);

    const userIds = results.map(result => result.player);
    await updatePlayers(userIds);

    try {
        await database.$transaction([
            database.challengeResult.deleteMany({
                where: {
                    challengeId: challenge.id
                }
            }),
            database.challengeResult.createMany({
                data: results.map(result => {
                    return {
                        position: result.rank,
                        score: result.score,
                        challengeId: challenge.id,
                        playerId: result.player
                    }
                })
            })
        ]);
    } catch (error) {
        console.error(error);
        Log.warn(`Failed ${challenge.name} because of ${error}`);
    }

    return true;
}

// TODO count
export const updateChallenges = async (length: number, offset: number, service: Service) => {
    const challenges = await getChallenges(length, offset);
    let count = 0;
    for (const challenge of challenges) {
        const success = await updateChallenge(challenge);
        if (!success) continue;
        await wait(1);

        Log.info(`Updated "${challenge.name}"`, service);
        count++;
    }

    Log.complete(`Updated "${count}" competitions.`, service);
}


