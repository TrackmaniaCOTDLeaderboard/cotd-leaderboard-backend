import { NadeoLiveService } from "../api";
import { database } from "../database";
import { calculateChunksDetails, wait } from "../util";
import { updatePlayers } from "./players";

const TIME_ATTACK_PLAYERS = 256;

const getTimeAttackResults = async (mapUid: string, seasonUid: string, length: number) => {
    const timeAttackChunks = calculateChunksDetails(NadeoLiveService.CHUNK_SIZE_MAP_LEADERBOARD, length);
    const results: NadeoLiveService.TimeAttackResult[] = [];

    for (const timeAttackChunk of timeAttackChunks) {
        const result = await NadeoLiveService.getTimeAttackResults(mapUid, seasonUid, timeAttackChunk.length, timeAttackChunk.offset);
        results.push(...result);
        await wait(0.5);
    }
    return results;
}

export const updateTimeAttack = async (mapUid: string, mapId: string, seasonUid: string) => {
    const timeAttackResults = await getTimeAttackResults(mapUid, seasonUid, TIME_ATTACK_PLAYERS);
    const accountIds = timeAttackResults.map(result => result.accountId);

    await updatePlayers(accountIds);

    await database.$transaction([
        database.timeAttack.deleteMany({
            where: {
                mapId: mapId
            }
        }),
        database.timeAttack.createMany({
            data: timeAttackResults.map(result => {
                return {
                    playerId: result.accountId,
                    mapId: mapId,
                    position: result.position,
                    score: result.score,
                    locked: true
                }
            })
        })
    ]);
}