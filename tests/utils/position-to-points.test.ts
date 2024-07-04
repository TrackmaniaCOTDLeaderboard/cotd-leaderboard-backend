import { calculatePointDistribution } from "../../src/util/position-to-points";

describe("pointDistribution", () => {
    it("should distribute points correctly", () => {
        const maxAwardedPlayers = 10;
        const maxPoints = 100;
        const minPoints = 10;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(1)).toBe(100); // The top player should get maxPoints
        expect(getPoints(10)).toBe(10); // The last awarded player should get minPoints
    });

    it("should handle positions correctly", () => {
        const maxAwardedPlayers = 5;
        const maxPoints = 50;
        const minPoints = 5;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(1)).toBe(50); // The top player should get maxPoints
        expect(getPoints(2)).toBe(31); // The second player should get calculated points rounded
        expect(getPoints(3)).toBe(19); // The third player should get calculated points rounded
        expect(getPoints(4)).toBe(11); // The fourth player should get calculated points rounded
        expect(getPoints(5)).toBe(5); // The last awarded player should get minPoints
    });

    it("should handle edge cases", () => {
        const maxAwardedPlayers = 1;
        const maxPoints = 100;
        const minPoints = 50;
        expect(() => calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints)).toThrow();
    });

    it("should handle players outside range", () => {
        const maxAwardedPlayers = 10;
        const maxPoints = 100;
        const minPoints = 50;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(0)).toBe(0);
        expect(getPoints(11)).toBe(0);
        expect(getPoints(1000)).toBe(0);
    });

    it("should handle large numbers of players", () => {
        const maxAwardedPlayers = 1000;
        const maxPoints = 1000;
        const minPoints = 1;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(1)).toBe(1000); // The top player should get maxPoints
        expect(getPoints(1000)).toBe(1); // The last awarded player should get minPoints
    });

    it("should return integer values", () => {
        const maxAwardedPlayers = 10;
        const maxPoints = 100;
        const minPoints = 10;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        for (let i = 1; i <= maxAwardedPlayers; i++) {
            expect(Number.isInteger(getPoints(i))).toBe(true); // All returned points should be integers
        }
    });

    it("should handle time attack scenario", () => {
        const maxAwardedPlayers = 256;
        const maxPoints = 1000;
        const minPoints = 1;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(1)).toBe(1000); // The top player should get maxPoints
        expect(getPoints(256)).toBe(1); // The last awarded player should get minPoints
    });

    it("should handle cup scenario", () => {
        const maxAwardedPlayers = 640;
        const maxPoints = 1000;
        const minPoints = 1;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(1)).toBe(1000); // The top player should get maxPoints
        expect(getPoints(640)).toBe(1); // The last awarded player should get minPoints
    });

    it("should handle cup_rerun scenario", () => {
        const maxAwardedPlayers = 128;
        const maxPoints = 200;
        const minPoints = 1;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(1)).toBe(200); // The top player should get maxPoints
        expect(getPoints(128)).toBe(1); // The last awarded player should get minPoints
    });

    it("should handle challenge scenario", () => {
        const maxAwardedPlayers = 640;
        const maxPoints = 1000;
        const minPoints = 1;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(1)).toBe(1000); // The top player should get maxPoints
        expect(getPoints(640)).toBe(1); // The last awarded player should get minPoints
    });

    it("should handle challenge_rerun scenario", () => {
        const maxAwardedPlayers = 128;
        const maxPoints = 200;
        const minPoints = 1;
        const getPoints = calculatePointDistribution(maxAwardedPlayers, maxPoints, minPoints);

        expect(getPoints(1)).toBe(200); // The top player should get maxPoints
        expect(getPoints(128)).toBe(1); // The last awarded player should get minPoints
    });
});
