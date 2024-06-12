import { get } from "../get-request";
import { z } from "zod";
import authentication from "./authentication";
import { chunkArray } from "../../util";

const ZoneSchema = z.object({
    parentId: z.string().nullable(),
    zoneId: z.string(),
    icon: z.string(),
    name: z.string()
});

const AccountZoneSchema = z.object({
    zoneId: z.string(),
    accountId: z.string()
});


/**
 * Get a list of all the Zones in the game.
 * @returns List of all the zones in the game.
 */
export const getAllZones = async () => {
    const response = await get("https://prod.trackmania.core.nadeo.online/zones/");
    return z.array(ZoneSchema).parse(response.data);
}

const CHUNK_SIZE = 100;

export const getZonesOfPlayers = async (accountIds: string[]) => {
    const chunks = chunkArray(accountIds, CHUNK_SIZE);
    const accountZonesPromises = chunks.map(getZonesOfPlayersChunk);
    const zones = await Promise.all(accountZonesPromises);
    const zonesAsArray = zones.flat();
    const zoneByAccountId: Record<string, string> = {};
    zonesAsArray.forEach(zone => {
        zoneByAccountId[zone.accountId] = zone.zoneId
    });
    return zoneByAccountId;
}

const getZonesOfPlayersChunk = async (accountIds: string[]) => {
    if (accountIds.length > CHUNK_SIZE) {
        throw new Error(`Illegal State: Too many account ids passed: ${accountIds.length}`)
    }
    const queryAccountZones = accountIds.join(",");
    const token = await authentication.getAccessToken();
    const responseZones = await get(`https://prod.trackmania.core.nadeo.online/accounts/zones/?accountIdList=${queryAccountZones}`, token);
    return z.array(AccountZoneSchema).parse(responseZones.data);
}