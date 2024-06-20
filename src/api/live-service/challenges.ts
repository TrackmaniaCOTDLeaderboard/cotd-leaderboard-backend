import { z } from "zod";
import authentication from "./authentication";
import { get } from "../get-request";
import { wait } from "../../util";

const ChallengeSchema = z.object({
    id: z.number(),
    name: z.string(),
    leaderboardId: z.number(),
    startDate: z.number(),
    endDate: z.number()
});

export type Challenge = z.infer<typeof ChallengeSchema>;

const ChallengeResultSchema = z.object({
    player: z.string(),
    rank: z.number(),
    score: z.number()
});

const ChallengeResponseSchema = z.object({
    results: z.array(ChallengeResultSchema)
})

const CHUNK_SIZE_CHALLENGES = 100;

export const getChallenges = async (length: number, offset: number = 0) => {
    if (length < 0) {
        throw new Error(`IllegalArgument: length must be between 0 and 100 but was ${length}`);
    }
    const data = [];
    const totalChunks = Math.ceil(length / CHUNK_SIZE_CHALLENGES);

    for (let chunk = 0; chunk < totalChunks; chunk++) {
        const token = await authentication.getAccessToken();

        const remaining = length - data.length;
        const chunkSize = Math.min(CHUNK_SIZE_CHALLENGES, remaining);

        const response = await get(`https://meet.trackmania.nadeo.club/api/challenges?length=${chunkSize}&offset=${offset}`, token);
        const result = z.array(ChallengeSchema).parse(response.data);
        data.push(...result);

        offset += CHUNK_SIZE_CHALLENGES;
        await wait(1);
    }
    return data;
}

const CHUNK_SIZE_LEADERBOARD = 100;

export const getChallengeLeaderboard = async (id: number, length: number) => {

    if (length < 0) {
        throw new Error("Length must be greater than 0.")
    }
    const data = [];
    for (let offset = 0; offset < length; offset += CHUNK_SIZE_LEADERBOARD) {
        const token = await authentication.getAccessToken();
        const response = await get(`https://meet.trackmania.nadeo.club/api/challenges/${id}/leaderboard?length=${CHUNK_SIZE_LEADERBOARD}&offset=${offset}`, token);
        const result = ChallengeResponseSchema.parse(response.data).results;
        data.push(...result);
        await wait(1);
    }
    return data.flat();

}