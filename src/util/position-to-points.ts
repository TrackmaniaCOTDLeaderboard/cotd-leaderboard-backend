export const calculatePointDistribution = (maxAwardedPlayers: number, maxPoints: number, minPoints: number) => {

    if (maxAwardedPlayers < 2) throw new Error();

    return (position: number) => {
        if (position < 1 || position > maxAwardedPlayers) return 0;

        const points = minPoints + (maxPoints - minPoints) * (1 - Math.log10(position) / Math.log10(maxAwardedPlayers));
        return Math.round(points);
    }
}
