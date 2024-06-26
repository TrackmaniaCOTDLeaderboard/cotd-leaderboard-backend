import { z } from "zod";
import { get } from "../get-request";
import authentication from "./authentication";

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

export type ChallengeResult = z.infer<typeof ChallengeResultSchema>;

const ChallengeResponseSchema = z.object({
    results: z.array(ChallengeResultSchema)
});


export const CHUNK_SIZE_CHALLENGES = 100;

/**
 * Gets a list of challenges. Note that challenges are different from competitions - challenges are separate leaderboard structures that can be part of a competition (for example in the form of a qualifying session).
 * 
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/meet/challenges/challenges)
 * 
 * @param length The number of challenges to retrieve. *Max*: {@link CHUNK_SIZE_CHALLENGES}, *Default*: `10`
 * @param offset The number of challenges to skip. *Default*: `0`
 * @returns List of challenges.
 */
export const getChallenges = async (length?: number, offset?: number) => {
    if (length !== undefined && (length < 1 || length > CHUNK_SIZE_CHALLENGES)) {
        throw new Error(`IllegalArgument: length must be between 1 and ${CHUNK_SIZE_CHALLENGES} but was ${length}`);
    }

    if (offset !== undefined && offset < 0) {
        throw new Error(`IllegalArgument: offset must be greater than 0 but was ${offset}.`);
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://meet.trackmania.nadeo.club/api/challenges`, {
        params: { length, offset },
        token
    });
    return z.array(ChallengeSchema).parse(response.data);
}

export const CHUNK_SIZE_CHALLENGE_RESULTS = 100;

/**
 * Gets leaderboard entries for a challenge ID. Note that challenges are different from competitions - challenges are separate leaderboard structures that can be part of a competition (for example in the form of a qualifying session).
 * Typically challenges are used for qualifiers in larger competitions - the relevant challengeId can be retrieved using the competition rounds endpoint.
 * 
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/meet/challenges/leaderboard).
 * 
 * @param challengeId A valid challenge ID.
 * @param length The number of leaderboard entries to retrieve. *Max*: {@link CHUNK_SIZE_CHALLENGE_RESULTS}, *Default*: `10`
 * @param offset The number of leaderboard entries to skip. *Default*: `0`
 * @returns Leaderboard of challenge with the given id.
 */
export const getChallengeResults = async (challengeId: number, length?: number, offset?: number) => {
    if (length !== undefined && (length < 1 || length > CHUNK_SIZE_CHALLENGE_RESULTS)) {
        throw new Error(`IllegalArgument: length must be between 1 and ${CHUNK_SIZE_CHALLENGE_RESULTS} but was ${length}`);
    }

    if (offset !== undefined && offset < 0) {
        throw new Error(`IllegalArgument: offset must be greater than 0 but was ${offset}.`);
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://meet.trackmania.nadeo.club/api/challenges/${challengeId}/leaderboard`, {
        params: { length, offset },
        token
    });

    return ChallengeResponseSchema.parse(response.data).results;
}