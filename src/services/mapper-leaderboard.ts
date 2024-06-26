import { MapperLeaderboard } from "@prisma/client";
import { database } from "../database"

const assignRanks = (leaderboard: MapperLeaderboard[]) => {
    leaderboard.sort((a, b) => b.amount - a.amount);

    let currentRank = 1;
    let previousAmount: number | undefined = undefined;
    let rankCount = 0;

    leaderboard.forEach((entry, index) => {
        if (previousAmount !== entry.amount) {
            currentRank += rankCount;
            rankCount = 1;
        } else {
            rankCount++;
        }

        entry.position = currentRank;
        previousAmount = entry.amount;
    });

    return leaderboard;
}

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
            amount: amountOfMaps,
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