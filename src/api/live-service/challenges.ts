import { z } from "zod";
import authentication from "./authentication";
import { get } from "../get-request";

const ChallengeSchema = z.object({
    id: z.number(),
    name: z.string(),
    leaderboardId: z.number(),
    startDate: z.number(),
    endDate: z.number()
});

const ChallengeResultSchema = z.object({
    participant: z.string(),
    rank: z.number(),
    score: z.number()
});

/**
 * 
 * @param length max 100
 * @param offset 
 */
export const getChallenges = async (length: number, offset: number = 0) => {
    if (length < 0 || length > 100) {
        throw new Error(`IllegalArgument: length must be between 0 and 100 but was ${length}`);
    }

    if (offset < 0) {
        throw new Error(`IllegalArgument: offset must be bigger than 0 but was ${offset}`);
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://meet.trackmania.nadeo.club/api/challenges?length=${length}&offset=${offset}`, token);
    return z.array(ChallengeSchema).parse(response.data);
}

/**
 * 
 * @param id ChallengeId
 * @param length max 100
 */
export const getChallengeLeaderboard = async (id: number, length: number, offset: number = 0) => {
    if (length < 0 || length > 100) {
        throw new Error(`IllegalArgument: length must be between 0 and 100 but was ${length}`);
    }

    if (offset < 0) {
        throw new Error(`IllegalArgument: offset must be bigger than 0 but was ${offset}`);
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://meet.trackmania.nadeo.club/api/competitions/${id}/leaderboard?length=´${length}&offset=${offset}`, token);
    return z.array(ChallengeResultSchema).parse(response.data);
}