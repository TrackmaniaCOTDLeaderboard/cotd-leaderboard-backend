import { assignRanks } from "../../src/util/calculate-leaderboard";

describe("assignRanks function", () => {
    it("should correctly assign ranks to a sorted leaderboard", () => {
        const leaderboard = [
            { points: 100, position: 0 },
            { points: 90, position: 0 },
            { points: 80, position: 0 },
            { points: 80, position: 0 },
            { points: 70, position: 0 },
        ];

        const expectedOutput = [
            { points: 100, position: 1 },
            { points: 90, position: 2 },
            { points: 80, position: 3 },
            { points: 80, position: 3 },
            { points: 70, position: 5 },
        ];

        const result = assignRanks(leaderboard);

        expect(result).toEqual(expectedOutput);
    });

    it("should handle a single entry leaderboard", () => {
        const leaderboard = [{ points: 50, position: 0 }];
        const expectedOutput = [{ points: 50, position: 1 }];

        const result = assignRanks(leaderboard);

        expect(result).toEqual(expectedOutput);
    });

    it("should handle ties correctly", () => {
        const leaderboard = [
            { points: 90, position: 0 },
            { points: 80, position: 0 },
            { points: 80, position: 0 },
            { points: 70, position: 0 },
        ];

        const expectedOutput = [
            { points: 90, position: 1 },
            { points: 80, position: 2 },
            { points: 80, position: 2 },
            { points: 70, position: 4 },
        ];

        const result = assignRanks(leaderboard);

        expect(result).toEqual(expectedOutput);
    });

    it("should handle descending order leaderboard", () => {
        const leaderboard = [
            { points: 70, position: 0 },
            { points: 60, position: 0 },
            { points: 50, position: 0 },
            { points: 50, position: 0 },
            { points: 40, position: 0 },
        ];

        const expectedOutput = [
            { points: 70, position: 1 },
            { points: 60, position: 2 },
            { points: 50, position: 3 },
            { points: 50, position: 3 },
            { points: 40, position: 5 },
        ];

        const result = assignRanks(leaderboard);

        expect(result).toEqual(expectedOutput);
    });

    it("should handle empty leaderboard", () => {
        const leaderboard: { points: number; position: number }[] = [];
        const expectedOutput: { points: number; position: number }[] = [];

        const result = assignRanks(leaderboard);

        expect(result).toEqual(expectedOutput);
    });
});
