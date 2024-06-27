import { MapperLeaderboard } from "@prisma/client";
import { database } from "../database"
import { assignRanks } from "../util/calculate-leaderboard";

export const updateMapperLeaderboard = async () => {
    const players = await database.player.findMany({
        include: {
            Maps: {
                select: {
                    name: true
                }
            }
        }
    });

    const mapperLeaderboard: MapperLeaderboard[] = [];

    players.forEach(player => {
        const amountOfMaps = player.Maps.length;
        if (amountOfMaps === 0) return;
        mapperLeaderboard.push({
            playerId: player.id,
            points: amountOfMaps,
            position: 0
        })
    });

    assignRanks(mapperLeaderboard);

    await database.$transaction([
        database.mapperLeaderboard.deleteMany(),
        database.mapperLeaderboard.createMany({
            data: mapperLeaderboard
        })
    ])
}