/**
 * Generates a function to calculate the points awarded based on the position of a player.
 *
 * This function takes the maximum number of players that can be awarded points, the maximum points,
 * and the minimum points. It returns a function that calculates the points for a given position
 * using a logarithmic distribution.
 *
 * @param maxAwardedPlayers - The maximum number of players that can be awarded points. Must be at least 2.
 * @param maxPoints - The maximum points that can be awarded to the top player.
 * @param minPoints - The minimum points that can be awarded to the last awarded player.
 * @returns A function that takes a player's position and returns the points awarded.
 * @throws Throws an error if `maxAwardedPlayers` is less than 2.
 *
 * @example
 * const pointDistribution = calculatePointDistribution(10, 100, 10);
 * const pointsForFirstPlace = pointDistribution(1);
 * console.log(pointsForFirstPlace); // Outputs: 100
 * const pointsForTenthPlace = pointDistribution(10);
 * console.log(pointsForTenthPlace); // Outputs: 10
 */
export const calculatePointDistribution = (maxAwardedPlayers: number, maxPoints: number, minPoints: number) => {

    if (maxAwardedPlayers < 2) throw new Error();

    return (position: number) => {
        if (position < 1 || position > maxAwardedPlayers) return 0;

        const points = minPoints + (maxPoints - minPoints) * (1 - Math.log10(position) / Math.log10(maxAwardedPlayers));
        return Math.round(points);
    }
}
