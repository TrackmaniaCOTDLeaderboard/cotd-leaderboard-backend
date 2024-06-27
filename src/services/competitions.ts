import { NadeoLiveService } from "../api";
import { database } from "../database";
import { calculateChunksDetails, Log, parseCompetition, wait } from "../util";
import { updatePlayers } from "./players";
import { Service } from "./service-manager";

const MAIN_CUP_PLAYERS = 640;
const RERUN_CUP_PLAYERS = 128;
const MAIN_CUP_VERSION = 1;

const getCompetitions = async (length: number, offset: number) => {
    const competitionChunks = calculateChunksDetails(NadeoLiveService.CHUNK_SIZE_COMPETITION, length, offset);

    const competitions: NadeoLiveService.Competition[] = [];
    for (const competitionChunk of competitionChunks) {
        const result = await NadeoLiveService.getCompetitions(competitionChunk.length, competitionChunk.offset);
        competitions.push(...result);
        await wait(0.5);
    }
    return competitions;
}

const getCompetitionResults = async (challengeId: number, length: number) => {
    const resultsChunks = calculateChunksDetails(NadeoLiveService.CHUNK_SIZE_COMPETITION_RESULTS, length);

    const results: NadeoLiveService.CompetitionResult[] = [];
    for (const resultChunk of resultsChunks) {
        const result = await NadeoLiveService.getCompetitionResults(challengeId, resultChunk.length, resultChunk.offset);
        results.push(...result);
        await wait(0.5)
    }
    return results;
}

const updateCup = async (competition: NadeoLiveService.Competition) => {
    const result = parseCompetition(competition.name);
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
            version: result.version,
            id: competition.id,
            name: competition.name,
            leaderboardId: competition.leaderboardId
        },
        update: {}
    });

    const leaderboardSize = result.version === MAIN_CUP_VERSION
        ? MAIN_CUP_PLAYERS
        : RERUN_CUP_PLAYERS;

    const results = await getCompetitionResults(competition.id, leaderboardSize);

    const userIds = results.map(result => result.participant);
    await updatePlayers(userIds);


    await database.$transaction([
        database.cupResult.deleteMany({
            where: {
                cupId: competition.id
            }
        }),
        database.cupResult.createMany({
            data: results.map(result => {
                return {
                    position: result.rank,
                    score: result.score,
                    cupId: competition.id,
                    playerId: result.participant
                }
            })
        })
    ]);

    return true;
}

export const updateCompetitions = async (length: number, offset: number, service: Service) => {

    const competitions = await getCompetitions(length, offset);

    let count = 0;
    for (const competition of competitions) {
        const success = await updateCup(competition);
        if (!success) continue;

        Log.info(`Updated "${competition.name}"`, service);
        count++;

        await wait(1);
    }
    Log.complete(`Updated "${count}" competitions.`, service)
};