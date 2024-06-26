import { record } from "zod";
import { NadeoLiveService } from "../api";
import { database } from "../database";
import { calculateChunksDetails, chunkArray, wait } from "../util";
import { updatePlayers } from "./players";
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


export const updateMaps = async (length: number, offset: number) => {
    const tracksOfMonths = await getTracksOfMonths(length, offset);

    const mapUids: string[] = [];
    const sortedDays: Record<string, string> = {}
    const mapping: Record<string, TrackOfTheDayDetails> = {};

    tracksOfMonths.forEach(month => {
        month.days.forEach(day => {
            mapUids.push(day.mapUid);
            mapping[day.mapUid] = {
                year: month.year,
                month: month.month,
                day: day.monthDay,
                seasonUid: day.seasonUid
            }
        });
    });

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
    };

}