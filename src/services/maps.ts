import { NadeoLiveService } from "../api";
import { database } from "../database";
import { calculateChunksDetails, chunkArray, getDateKey, Log, wait } from "../util";
import { updatePlayers } from "./players";
import { Service } from "./service-manager";
import { updateTimeAttack } from "./time-attack";

type TrackOfTheDayDetails = {
    year: number;
    month: number;
    day: number;
    seasonUid: string;
}

const getTracksOfMonths = async (length: number, offset: number) => {
    const monthCunks = calculateChunksDetails(NadeoLiveService.CHUNK_SIZE_MONTHS, length, offset);
    const tracksOfMonths: NadeoLiveService.Month[] = [];
    for (const monthCunk of monthCunks) {
        const result = await NadeoLiveService.getTracksOfAMonths(monthCunk.length, monthCunk.offset);
        tracksOfMonths.push(...result);
        await wait(0.5)
    }
    return tracksOfMonths;
}

const getMapsInfo = async (mapUids: string[]) => {
    const mapUidChunks = chunkArray(mapUids, NadeoLiveService.CHUNK_SIZE_MAPS);
    const tracks: NadeoLiveService.Map[] = []
    for (const mapUidChunk of mapUidChunks) {
        const result = await NadeoLiveService.getMapsInfo(mapUidChunk);
        tracks.push(...result);
    }
    return tracks;
}

export const filterMaps = (sortedDays: Record<string, string>, length?: number) => {
    const sortedKeys = Object.keys(sortedDays).sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
    });

    const recentKeys = sortedKeys.slice(0, length ?? sortedKeys.length);
    return recentKeys.map(key => sortedDays[key]);
}


export const updateMaps = async (months: number, offset: number, length?: number, service?: Service) => {

    if (length !== undefined && length < 1) throw new Error("Illegal Argument: length must be at least 1.")

    const tracksOfMonths = await getTracksOfMonths(months, offset);

    const sortedDays: Record<string, string> = {}
    const mapping: Record<string, TrackOfTheDayDetails> = {};

    tracksOfMonths.forEach(month => {
        month.days.forEach(day => {
            if (day.mapUid === "") return;
            sortedDays[getDateKey(month.year, month.month, day.monthDay)] = day.mapUid;

            mapping[day.mapUid] = {
                year: month.year,
                month: month.month,
                day: day.monthDay,
                seasonUid: day.seasonUid
            }
        });
    });

    const mapUids = filterMaps(sortedDays, length);

    const maps = await getMapsInfo(mapUids);

    const accountIds = maps.map(map => map.author);
    await updatePlayers(accountIds);

    await wait(1);

    for (const map of maps) {
        const details = mapping[map.uid];
        await database.map.upsert({
            where: {
                id: map.mapId
            },
            create: {
                uid: map.uid,
                id: map.mapId,
                name: map.name,
                authorTime: map.authorTime,
                goldTime: map.goldTime,
                silverTime: map.silverTime,
                bronzeTime: map.bronzeTime,
                year: details.year,
                month: details.month,
                day: details.day,
                thumbnail: map.thumbnailUrl,
                upvotes: 0,
                downvotes: 0,
                seasonUid: details.seasonUid,
                style: map.mapStyle,
                type: map.mapType,
                author: { connect: { id: map.author } }
            },
            update: {
                name: map.name,
                authorTime: map.authorTime,
                goldTime: map.goldTime,
                silverTime: map.silverTime,
                bronzeTime: map.bronzeTime,
                author: { connect: { id: map.author } }
            }
        });

        await updateTimeAttack(map.uid, map.mapId, details.seasonUid);
        Log.complete(`${details.year}-${details.month}-${details.day} "${map.name}" updated.`, service)
    };

}