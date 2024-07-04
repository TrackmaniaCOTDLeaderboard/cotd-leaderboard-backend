import { getRecentKeys } from "../../src/util/get-recent-keys";

describe("getRecentKeys", () => {
    const sortedDays = {
        "2024-06-30": "Map2",
        "2024-06-29": "Map3",
        "2024-06-28": "Map4",
        "2024-07-01": "Map1",
    };

    it("should return all values when length is undefined", () => {
        const result = getRecentKeys(sortedDays);
        expect(result).toEqual(["Map1", "Map2", "Map3", "Map4"]);
    });

    it("should return the most recent maps up to the specified length", () => {
        const result = getRecentKeys(sortedDays, 2);
        expect(result).toEqual(["Map1", "Map2"]);
    });

    it("should return an empty array when sortedDays is empty", () => {
        const result = getRecentKeys({}, 2);
        expect(result).toEqual([]);
    });

    it("should return all values if length is greater than the number of maps", () => {
        const result = getRecentKeys(sortedDays, 10);
        expect(result).toEqual(["Map1", "Map2", "Map3", "Map4"]);
    });

    it("should return the correct number of maps when length is exactly the number of maps", () => {
        const result = getRecentKeys(sortedDays, 4);
        expect(result).toEqual(["Map1", "Map2", "Map3", "Map4"]);
    });

    it("should handle length of 0 correctly", () => {
        const result = getRecentKeys(sortedDays, 0);
        expect(result).toEqual([]);
    });
});
