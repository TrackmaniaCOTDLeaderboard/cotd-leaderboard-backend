import { NadeoCoreService, NadeoLiveService, TrackmaniaOAuthAPI } from "../api";
import { database } from "../database";
import { chunkArray, wait } from "../util";

const mapAccountIdsToZone = (accountZones: NadeoCoreService.AccountZone[]) => {
    const mapping: Record<string, string> = {};
    accountZones.forEach(accountZone => mapping[accountZone.accountId] = accountZone.zoneId);
    return mapping;
}

/**
 * This service requests the zone details and display names of a list of account IDs. 
 * After the function receives the details the players with the corresponding account IDs are created/updated in the database.
 * @param accountIds Account IDs that the function will request details and update in the database.
 * @returns 
 */
export const updatePlayers = async (accountIds: string[]) => {
    if (accountIds.length === 0) return;

    const accountIdsChunks = chunkArray(accountIds, Math.min(NadeoCoreService.CHUNK_SIZE_ZONE_PLAYERS, TrackmaniaOAuthAPI.CHUNK_SIZE_ACCOUNT_NAMES));
    for (const accountIdsChunk of accountIdsChunks) {
        await updatePlayerChunk(accountIdsChunk);
        await wait(1);
    }
}

const updatePlayerChunk = async (accountIds: string[]) => {

    if (accountIds.length === 0) return;
    if (accountIds.length > NadeoCoreService.CHUNK_SIZE_ZONE_PLAYERS) {
        throw new Error(`IllegalArgument: chunk size exceed. Was: ${accountIds.length} but expected ${NadeoCoreService.CHUNK_SIZE_ZONE_PLAYERS}`)
    }

    // request the zones of all given players
    const accountZones = await NadeoCoreService.getZonesOfPlayers(accountIds);
    const accountZonesAsRecord = mapAccountIdsToZone(accountZones);

    // request the display names of all given players
    const names = await TrackmaniaOAuthAPI.getAccountNames(accountIds);

    // upsert player details
    for (const accountId of accountIds) {
        const name = names[accountId];
        const zoneId = accountZonesAsRecord[accountId];

        await database.player.upsert({
            where: {
                id: accountId
            },
            create: {
                id: accountId,
                name: name,
                zone: {
                    connect: { id: zoneId }
                }
            },
            update: {
                name: name,
                zone: {
                    connect: { id: zoneId }
                }
            }
        })
    }
}