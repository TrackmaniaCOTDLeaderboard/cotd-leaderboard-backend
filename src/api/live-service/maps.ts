import { z } from "zod";
import authentication from "./authentication";
import { get } from "../get-request";
import { chunkArray } from "../../util/chunks";
import { wait } from "../../util";

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

const MapLeaderboard = z.object({
    groupUid: z.string(),
    mapUid: z.string(),
    tops: z.array(MapZoneLeaderboard)
})

/**
 * 
 * @param length max idk
 * @param offset 
 * @returns 
 */
export const getTrackOfTheDays = async (length: number, offset: number) => {
    if (length < 0 || length > 100) {
        throw new Error(`IllegalArgument: length must be between 0 and 100 but was ${length}`);
    }

    if (offset < 0) {
        throw new Error(`IllegalArgument: offset must be bigger than 0 but was ${offset}`);
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://live-services.trackmania.nadeo.live/api/token/campaign/month?offset=${offset}&length=${length}`, token);
    return MonthListSchema.parse(response.data);
}

const CHUNK_SIZE_MAPS = 100;



export const getMapsInfo = async (mapUids: string[]) => {
    const chunks = chunkArray(mapUids, CHUNK_SIZE_MAPS);
    const mapInfoPromises = chunks.map(getMapsInfoChunk);
    const maps = await Promise.all(mapInfoPromises);
    return maps.flat();
}

const getMapsInfoChunk = async (mapUids: string[]) => {
    if (mapUids.length > CHUNK_SIZE_MAPS) {
        throw new Error(`Illegal Argument: Chunk max size is ${CHUNK_SIZE_MAPS} but chunk size was ${mapUids.length}.`);
    }

    const query = mapUids.join(",");
    const token = await authentication.getAccessToken();
    const response = await get(`https://live-services.trackmania.nadeo.live/api/token/map/get-multiple?mapUidList=${query}`, token);
    return MapListSchema.parse(response.data).mapList;
}


const CHUNK_SIZE_LEADERBOARD = 100;

/**
 * You can only access the first 10.000 entries.
 * @param mapUid 
 * @param groupUid "Personal_Best" for global leaderboard, seasonUid for locked leaderboard
 * @param amount  
 * @returns 
 */
export const getMapLeaderboard = async (mapUid: string, groupUid: string, amount: number) => {
    const data = [];
    for (let offset = 0; offset < amount; offset += CHUNK_SIZE_LEADERBOARD) {
        const token = await authentication.getAccessToken();
        const response = await get(`https://live-services.trackmania.nadeo.live/api/token/leaderboard/group/${groupUid}/map/${mapUid}/top?onlyWorld=true&length=${CHUNK_SIZE_LEADERBOARD}&offset=${offset}`, token)
        const result = MapLeaderboard.parse(response.data);
        const tops = result.tops[0];
        data.push(...tops.top);
        await wait(1);
    }
    return data.flat();
}