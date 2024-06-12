import { get } from "../get-request";
import authentication from "./authentication";
import { z } from "zod";

const CompetitionSchema = z.object({
    id: z.number(),
    name: z.string(),
    nbPlayers: z.number(),
    startDate: z.number(),
    endDate: z.number(),
    leaderboardId: z.number()
});

const CompetitionResultSchema = z.object({
    participant: z.string(),
    rank: z.number(),
    score: z.number()
});

/**
 * 
 * @param length max 100 
 * @param offset 
 * @returns
 */
export const getCompetitions = async (length: number, offset: number = 0) => {
    if (length < 0 || length > 100) {
        throw new Error(`IllegalArgument: length must be between 0 and 100 but was ${length}`);
    }

    if (offset < 0) {
        throw new Error(`IllegalArgument: offset must be bigger than 0 but was ${offset}`);
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://meet.trackmania.nadeo.club/api/competitions?length=${length}&offset=${offset}`, token);
    return z.array(CompetitionSchema).parse(response.data);
}

/**
 * 
 * @param id CompetitionId
 * @param length max 255
 * @returns 
 */
export const getCompetitionLeaderboard = async (id: number, length: number, offset: number = 0) => {
    if (length < 0 || length > 255) {
        throw new Error(`IllegalArgument: length must be between 0 and 255 but was ${length}`);
    }

    if (offset < 0) {
        throw new Error(`IllegalArgument: offset must be bigger than 0 but was ${offset}`);
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://meet.trackmania.nadeo.club/api/competitions/${id}/leaderboard?length=${length}&offset=${offset}`, token);
    return z.array(CompetitionResultSchema).parse(response.data);
}