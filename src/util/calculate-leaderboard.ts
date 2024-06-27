export type Result = {
    playerId: string;
    position: number;
    score: number;
}

export type Statistics = {
    bestResult: number;
    average: number;
    first: number;
    second: number;
    third: number;
    top8: number;
    top16: number;
    top32: number;
    top64: number;
    top128: number;
    amount: number;
    points: number;
}

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



