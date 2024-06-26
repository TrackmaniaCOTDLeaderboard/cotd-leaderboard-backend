import { z } from "zod";
import { get } from "../get-request";
import authentication from "./authentication";

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

export type AccountZone = z.infer<typeof AccountZoneSchema>;


/**
 * Gets all available zones.
 * 
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/core/meta/zones)
 * 
 * @returns List of all the zones in the game.
 */
export const getAllZones = async () => {
    const response = await get("https://prod.trackmania.core.nadeo.online/zones/");
    return z.array(ZoneSchema).parse(response.data);
}

export const CHUNK_SIZE_ZONE_PLAYERS = 150;

/**
 * Gets player zones from account IDs.
 * 
 * This endpoint is only accessible with tokens authenticated through Ubisoft user accounts (as opposed to dedicated server accounts). If you encounter 401 errors using a dedicated server account, switch to using a Ubisoft account.
 * This endpoint has no intrinsic limit on the number of account IDs requested, but it will return a 414 error if the request URI length is 8220 characters or more (corresponding to just over 200 account IDs, depending on how you encode the URI).
 * Thats why the max value in this project is set to 150.
 * If an accountId is invalid, the response will contain an error message:
 * 
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/core/accounts/zones)
 * 
 * @param accountIds A list of account IDs. *Max length*: {@link CHUNK_SIZE_ZONE_PLAYERS}
 * @returns List of all the account IDs with the correct zone.
 */
export const getZonesOfPlayers = async (accountIds: string[]) => {
    if (accountIds.length === 0) return [];
    if (accountIds.length > CHUNK_SIZE_ZONE_PLAYERS) {
        throw new Error(`Illegal State: Too many account ids passed: ${accountIds.length} (Max: ${CHUNK_SIZE_ZONE_PLAYERS})`)
    }

    const accountIdList = accountIds.join(",");

    const token = await authentication.getAccessToken();
    const responseZones = await get(`https://prod.trackmania.core.nadeo.online/accounts/zones/`, {
        params: { accountIdList },
        token
    });
    return z.array(AccountZoneSchema).parse(responseZones.data);
}