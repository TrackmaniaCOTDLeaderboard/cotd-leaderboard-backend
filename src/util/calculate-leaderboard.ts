import { calculatePointDistribution } from "./position-to-points";

/** Represents a result in a competition/challenge.*/
export type Result = {
    /** The unique identifier of the player.*/
    playerId: string;
    /** The position the player achieved in the competition.*/
    position: number;
    /** The score the player achieved in the competition. This can either be the position in the cup or the time in the seeding.*/
    score: number;
}

/** Represents the statistics calculated from a set of results.*/
export type Statistics = {
    /** The best position achieved by the player.*/
    bestResult: number;
    /** The average position achieved by the player.*/
    average: number;
    /** The number of first place finishes. */
    first: number;
    /** The number of second place finishes. */
    second: number;
    /** The number of third place finishes. */
    third: number;
    /** The number of finishes from 4th to 8th. */
    top8: number;
    /** The number of finishes from 9th to 16th. */
    top16: number;
    /** The number of finishes from 17th to 32nd. */
    top32: number;
    /** The number of finishes from 33rd th to 64th. */
    top64: number;
    /** The number of finishes from 65th to 128th. */
    top128: number;
    /** The total number of results. */
    amount: number;
    /** The total points accumulated based on the position.  */
    points: number;
}


// TODO write tests for this function
/**
 * Calculates statistics from an array of results.
 * 
 * @param results - An array of results of a player.
 * @param  pointDistribution - A function that takes a position and returns the corresponding points. See {@link calculatePointDistribution}.
 * @returns The calculated statistics, or null if no results are provided.
 *
 * @example
 * const results = [
 *     { playerId: "player1", position: 1, score: 100 },
 *     { playerId: "player2", position: 2, score: 90 },
 *     { playerId: "player3", position: 3, score: 80 }
 * ];
 * const pointDistribution = position => 100 - position;
 * const stats = getStatisticsByResults(results, pointDistribution);
 * console.log(stats);
 */
export const getStatisticsByResults = (results: Result[], pointDistribution: (position: number) => number): Statistics | null => {
    if (results.length === 0) return null;

    const bestResult = results.reduce((minPosition, result) => Math.min(minPosition, result.position), results[0].position);
    const sumOfPositions = results.reduce((sum, result) => sum + result.position, 0);
    const points = results.reduce((totalPoints, result) => totalPoints + pointDistribution(result.position), 0);

    let first = 0, second = 0, third = 0, top8 = 0, top16 = 0, top32 = 0, top64 = 0, top128 = 0;

    results.forEach(result => {
        const position = result.position;

        switch (true) {
            case (position === 1): first++; break;
            case (position === 2): second++; break;
            case (position === 3): third++; break;
            case (position > 3 && position <= 8): top8++; break;
            case (position > 8 && position <= 16): top16++; break;
            case (position > 16 && position <= 32): top32++; break;
            case (position > 32 && position <= 64): top64++; break;
            case (position > 64 && position <= 128): top128++; break;
            default: break;
        }
    });

    const amount = results.length;
    const average = sumOfPositions / amount;

    return {
        bestResult,
        average,
        first,
        second,
        third,
        top8,
        top16,
        top32,
        top64,
        top128,
        amount,
        points
    };
};


/**
 * Assigns ranks to a leaderboard based on points.
 * 
 * @param leaderboard - An array of leaderboard entries with points and positions.
 * @returns The leaderboard array with updated positions based on points.
 *
 * @example
 * const leaderboard = [
 *     { points: 100, position: 0 },
 *     { points: 90, position: 0 },
 *     { points: 90, position: 0 },
 *     { points: 80, position: 0 }
 * ];
 * const rankedLeaderboard = assignRanks(leaderboard);
 * console.log(rankedLeaderboard);
 * // [{ points: 100, position: 1 }, { points: 90, position: 2 }, { points: 90, position: 2 }, { points: 80, position: 4 }];
 */
export const assignRanks = (leaderboard: { points: number, position: number }[]) => {

    leaderboard.sort((a, b) => b.points - a.points);

    let currentRank = 1;
    let previousAmount: number | undefined = undefined;
    let rankCount = 0;

    leaderboard.forEach((entry) => {

        if (previousAmount !== entry.points) {
            currentRank += rankCount;
            rankCount = 1;
        } else {
            rankCount++;
        }

        entry.position = currentRank;
        previousAmount = entry.points;
    });

    return leaderboard;
}



