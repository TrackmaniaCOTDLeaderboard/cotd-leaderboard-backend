import { z } from "zod";
import { get } from "../get-request";
import authentication from "./authentication";

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

export type CompetitionResult = z.infer<typeof CompetitionResultSchema>;

export const CHUNK_SIZE_COMPETITION = 100;

/** 
 * Gets a list of competitions. The response includes Super Royal and COTD instances as well as community-made competitions.
 * 
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/meet/competitions/competitions).
 * 
 * @param length The number of competitions to retrieve. *Max*: {@link CHUNK_SIZE_COMPETITION}, *Default*: `10`
 * @param offset The number of competitions to skip. *Default*: `0`
 * @returns List of competitions.
 */
export const getCompetitions = async (length?: number, offset?: number) => {
    if (length !== undefined && (length < 1 || length > CHUNK_SIZE_COMPETITION)) {
        throw new Error(`IllegalArgument: length must be between 1 and ${CHUNK_SIZE_COMPETITION} but was ${length}`);
    }

    if (offset !== undefined && offset < 0) {
        throw new Error("Offset must be greater than 0.")
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://meet.trackmania.nadeo.club/api/competitions`, {
        token,
        params: { length, offset }
    });
    return z.array(CompetitionSchema).parse(response.data);
}


export const CHUNK_SIZE_COMPETITION_RESULTS = 255;

/**
 * Gets leaderboard for a competition ID. There are two different competition IDs which are both supported by this endpoint - the primary id is always numerical, while the `liveId` is a string typically starting with `"LID-COMP-"`.
 * If a competition hasn't started yet, all `score` values will be `0`, but there will still be `rank` values assigned to each player.
 * 
 * For more information, see the [OpenPlanet Documentation](https://webservices.openplanet.dev/meet/competitions/leaderboard).
 * 
 * @param competitonId A valid competition ID.
 * @param length The number of participants to retrieve. *Max*: {@link CHUNK_SIZE_COMPETITION_RESULTS}, *Default*: `10`
 * @param offset The number of participants to skip. *Default*: `0`
 * @returns Leaderboard entries of competition with the given id.
 */
export const getCompetitionResults = async (competitonId: number, length?: number, offset?: number) => {
    if (length !== undefined && (length < 1 || length > CHUNK_SIZE_COMPETITION_RESULTS)) {
        throw new Error(`IllegalArgument: length must be between 1 and ${CHUNK_SIZE_COMPETITION_RESULTS} but was ${length}`);
    }

    if (offset !== undefined && offset < 0) {
        throw new Error("Offset must be greater than 0.")
    }

    const token = await authentication.getAccessToken();
    const response = await get(`https://meet.trackmania.nadeo.club/api/competitions/${competitonId}/leaderboard`, {
        token,
        params: { length, offset }
    });
    return z.array(CompetitionResultSchema).parse(response.data);
}