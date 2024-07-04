import { getDateKey } from "../../src/util/date";

describe('getDateKey', () => {
    it('should return a formatted date string with leading zeros for single digit month and day', () => {
        expect(getDateKey(2023, 1, 5)).toBe('2023-01-05');
        expect(getDateKey(2023, 9, 9)).toBe('2023-09-09');
    });

    it('should return a formatted date string without leading zeros for double digit month and day', () => {
        expect(getDateKey(2023, 10, 15)).toBe('2023-10-15');
        expect(getDateKey(2023, 11, 30)).toBe('2023-11-30');
    });

    it('should handle edge cases with minimum values', () => {
        expect(getDateKey(0, 1, 1)).toBe('0-01-01');
    });

    it('should handle edge cases with maximum values', () => {
        expect(getDateKey(9999, 12, 31)).toBe('9999-12-31');
    });
});
