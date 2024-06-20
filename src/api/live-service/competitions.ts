import { get } from "../get-request";
import authentication from "./authentication";
import { wait } from "../../util";
import { z } from "zod";

const CompetitionSchema = z.object({
    id: z.number(),
    name: z.string(),
    nbPlayers: z.number(),
    startDate: z.number(),
    endDate: z.number(),
    leaderboardId: z.number()
});

export type Competition = z.infer<typeof CompetitionSchema>;

const CompetitionResultSchema = z.object({
    participant: z.string(),
    rank: z.number(),
    score: z.number()
});

const CHUNK_SIZE_COMPETITION = 100;

/**
 * 
 * @param length max 100 
 * @param offset 
 * @returns
 */
export const getCompetitions = async (length: number) => {
    if (length < 0) {
        throw new Error("Length must be greater than 0.")
    }

    const data = [];
    for (let offset = 0; offset < length; offset += CHUNK_SIZE_COMPETITION) {
        const token = await authentication.getAccessToken();
        const response = await get(`https://meet.trackmania.nadeo.club/api/competitions?length=${CHUNK_SIZE_COMPETITION}&offset=${offset}`, token);
        const result = z.array(CompetitionSchema).parse(response.data);
        if (result.length === 0) break;
        data.push(...result);
        await wait(1);
    }
    return data;
}


const CHUNK_SIZE_LEADERBOARD = 255;
/**
 * 
 * @param id CompetitionId
 * @param length max 255
 * @returns 
 */
export const getCompetitionLeaderboard = async (id: number, length: number, offset: number = 0) => {
    if (length < 0) {
        throw new Error("Length must be greater than 0.")
    }

    const totalChunks = Math.ceil(length / CHUNK_SIZE_LEADERBOARD);

    const data = [];
    for (let chunk = 0; chunk < totalChunks; chunk++) {
        const token = await authentication.getAccessToken();

        const remaining = length - data.length;
        const chunkSize = Math.min(CHUNK_SIZE_COMPETITION, remaining);
        const response = await get(`https://meet.trackmania.nadeo.club/api/competitions/${id}/leaderboard?length=${chunkSize}&offset=${offset}`, token);
        const result = z.array(CompetitionResultSchema).parse(response.data);
        data.push(...result);

        offset += CHUNK_SIZE_LEADERBOARD;
        await wait(1);
    }
    return data;
}