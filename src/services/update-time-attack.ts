import { getMapLeaderboard } from "../api/live-service/maps"
import { database } from "../database";
import { updatePlayers } from "./update-players";


export const updateTimeAttack = async (mapUid: string, mapId: string, seasonUid: string) => {
    const timeAttackResults = await getMapLeaderboard(mapUid, seasonUid, 200);
    const ids = timeAttackResults.map(result => result.accountId);

    await updatePlayers(ids);

    const timeAttacksToInsert = timeAttackResults.map(result => {
        return {
            playerId: result.accountId,
            mapId: mapId,
            position: result.position,
            time: result.score
        }
    });

    await database.$transaction([
        database.timeAttack.deleteMany({
            where: {
                mapId: mapId
            }
        }),
        database.timeAttack.createMany({
            data: timeAttacksToInsert
        })
    ]);
}