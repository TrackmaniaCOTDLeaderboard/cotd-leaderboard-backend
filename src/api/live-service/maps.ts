import { z } from "zod";
import { get } from "../get-request";
import authentication from "./authentication";

const DaySchema = z.object({
    campaignId: z.number(),
    mapUid: z.string(),
    monthDay: z.number(),
    day: z.number(), // week day
    seasonUid: z.string(),
})

const MonthSchema = z.object({
    year: z.number(),
    month: z.number(),
    lastDay: z.number(),
    days: z.array(DaySchema)
});

export type Month = z.infer<typeof MonthSchema>;

const MonthListSchema = z.object({
    monthList: z.array(MonthSchema)
});

const MapSchema = z.object({
    uid: z.string(),
    mapId: z.string(),
    name: z.string(),
    author: z.string(),
    authorTime: z.number(),
    goldTime: z.number(),
    silverTime: z.number(),
    bronzeTime: z.number(),
    thumbnailUrl: z.string(),
    mapStyle: z.string(),
    mapType: z.string()
});

export type Map = z.infer<typeof MapSchema>;

const MapListSchema = z.object({
    mapList: z.array(MapSchema)
});

const MapLeaderboardEntry = z.object({
    accountId: z.string(),
    zoneId: z.string(),
    zoneName: z.string(),
    position: z.number(),
    score: z.number()
})

const MapZoneLeaderboard = z.object({
    zoneId: z.string(),
    zoneName: z.string(),
    top: z.array(MapLeaderboardEntry)
})

export type TimeAttackResult = z.infer<typeof MapLeaderboardEntry>;

const MapLeaderboard = z.object({
    groupUid: z.string(),
    mapUid: z.string(),
    tops: z.array(MapZoneLeaderboard)
})

export const CHUNK_SIZE_MONTHS = 12;

/**
 * Gets Tracks of the Day by month. There is also the possibility to get the royal maps via this endpoint but its not implemented in this project.
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/live/campaigns/totds).
 * 
 * @param length The number of months to retrieve. *Max*: {@link CHUNK_SIZE_MONTHS},*Default*: `0`. Note that the given max is not officially documented! 
 * @param offset The number of months to skip (looking backwards from the current month. Current month is offset `0`. Month before offset `1`, etc.). *Default*: `0`;
 * @returns List of months with all their Track of the Days
 */
export const getTracksOfAMonths = async (length?: number, offset?: number) => {
    if (length !== undefined && (length < 1 || length > CHUNK_SIZE_MONTHS)) {
        throw new Error(`IllegalArgument: length must be between 0 and ${CHUNK_SIZE_MONTHS} but was ${length}`);
    }

    if (offset !== undefined && offset < 0) {
        throw new Error(`IllegalArgument: offset must be bigger than 0 but was ${offset}`);
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://live-services.trackmania.nadeo.live/api/token/campaign/month`, {
        token,
        params: { offset, length }
    });
    return MonthListSchema.parse(response.data).monthList;
}

export const CHUNK_SIZE_MAPS = 100;

/**
 * Gets information about multiple maps via their UIDs. Invalid UIDs will be ignored in the result without any visible errors. 
 * If a `mapUid` is invalid, that map will not be returned in the response.
 * 
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/live/maps/info-multiple).
 * 
 * @param mapUids A list of map UIDs. *Max length*: {@link CHUNK_SIZE_MAPS}
 * @returns List of informations of the requested maps.
 */
export const getMapsInfo = async (mapUids: string[]) => {
    if (mapUids.length === 0) return [];

    if (mapUids.length > CHUNK_SIZE_MAPS) {
        throw new Error(`Illegal Argument: Chunk max size is ${CHUNK_SIZE_MAPS} but chunk size was ${mapUids.length}.`);
    }

    const mapUidList = mapUids.join(",");
    const token = await authentication.getAccessToken();
    const response = await get(`https://live-services.trackmania.nadeo.live/api/token/map/get-multiple`, {
        token,
        params: { mapUidList }
    });
    return MapListSchema.parse(response.data).mapList;
}


export const CHUNK_SIZE_MAP_LEADERBOARD = 100;

/**
 * Gets records from a map's leaderboard.
 * 
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/live/leaderboards/top).
 * 
 * @param mapUid The UID of the map.
 * @param groupUid The ID of the group/season. `Personal_Best` for global leaderboard, `seasonUid` for locked leaderboard
 * @param length The number of records to retrieve. *Max*: {@link CHUNK_SIZE_MAP_LEADERBOARD}, Default: `5`
 * @param offset The number of records to skip. *Default*: 0
 * @returns Map leaderboard of the request map. 
 */
export const getTimeAttackResults = async (mapUid: string, groupUid: string, length?: number, offset?: number) => {
    if (length !== undefined && (length < 1 || length > CHUNK_SIZE_MAP_LEADERBOARD)) {
        throw new Error(`IllegalArgument: length must be between 1 and ${CHUNK_SIZE_MAP_LEADERBOARD} but was ${length}`);
    }

    if (offset !== undefined && offset < 0) {
        throw new Error(`IllegalArgument: offset must be bigger than 0 but was ${offset}`);
    }

    // onlyWorld is required to retrieve more than the first five records. Without it, length and offset will have no effect.
    const onlyWorld = true;
    const token = await authentication.getAccessToken();
    const response = await get(`https://live-services.trackmania.nadeo.live/api/token/leaderboard/group/${groupUid}/map/${mapUid}/top`, {
        token,
        params: { onlyWorld, length, offset }
    })
    const result = MapLeaderboard.parse(response.data);
    return result.tops[0].top;
}