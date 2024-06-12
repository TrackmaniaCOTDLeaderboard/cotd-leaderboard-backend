import { getZonesOfPlayers } from "../api/core-service/zones";
import { getAccountNames } from "../api/trackmania/accounts"
import { database } from "../database";
import { wait } from "../util";

export const updatePlayers = async (accountIds: string[]) => {
    const names = await getAccountNames(accountIds);
    await wait(2);
    const zones = await getZonesOfPlayers(accountIds);
    for (const accountId of accountIds) {
        const name = names[accountId];
        const zone = zones[accountId];
        await database.player.upsert({
            where: {
                id: accountId
            },
            create: {
                id: accountId,
                name: name,
                zone: {
                    connect: { id: zone }
                }
            },
            update: {
                name: name,
                zone: {
                    connect: { id: zone }
                }
            }
        })
    }
}