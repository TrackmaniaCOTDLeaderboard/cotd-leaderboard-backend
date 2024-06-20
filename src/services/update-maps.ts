import { getMapsInfo, getTrackOfTheDays } from "../api/live-service/maps";
import { database } from "../database";
import { wait } from "../util";
import { updatePlayers } from "./update-players";
import { updateTimeAttack } from "./update-time-attack";

type TrackOfTheDayDetails = {
    year: number;
    month: number;
    day: number;
    seasonUid: string;
}

export const updateMaps = async (offset: number) => {
    const trackOfTheDays = await getTrackOfTheDays(1, offset);
    await wait(2);
    const mapUids: string[] = [];

    const mapping: Record<string, TrackOfTheDayDetails> = {};
    trackOfTheDays.monthList.forEach(month => {
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
    await wait(2);

    const accountIds = maps.map(map => map.author);
    await updatePlayers(accountIds);

    await wait(2);

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
        console.log("DOne Map");
    };
    console.log("DOne");

}