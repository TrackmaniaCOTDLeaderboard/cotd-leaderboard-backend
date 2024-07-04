import { calculateChunksDetails, chunkArray } from "../../src/util/chunks";

describe('chunkArray', () => {
    it('should split array into chunks of given size', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const chunkSize = 3;
        const expectedOutput = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];
        expect(chunkArray(input, chunkSize)).toEqual(expectedOutput);
    });

    it('should handle arrays that do not divide evenly', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8];
        const chunkSize = 3;
        const expectedOutput = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8]
        ];
        expect(chunkArray(input, chunkSize)).toEqual(expectedOutput);
    });

    it('should return an empty array when input is empty', () => {
        const input: number[] = [];
        const chunkSize = 3;
        const expectedOutput: number[][] = [];
        expect(chunkArray(input, chunkSize)).toEqual(expectedOutput);
    });

    it('should handle chunk size larger than array length', () => {
        const input = [1, 2, 3];
        const chunkSize = 5;
        const expectedOutput = [
            [1, 2, 3]
        ];
        expect(chunkArray(input, chunkSize)).toEqual(expectedOutput);
    });

    it('should handle empty input list', () => {
        const input: number[] = [];
        const chunkSize = 5;
        const expectedOutput: number[] = [];
        expect(chunkArray(input, chunkSize)).toEqual(expectedOutput);
    });

    it('should throw an error if chunk size is less than or equal to 0', () => {
        const input = [1, 2, 3, 4, 5];
        expect(() => chunkArray(input, 0)).toThrow('Chunk size must be greater than 0');
        expect(() => chunkArray(input, -1)).toThrow('Chunk size must be greater than 0');
    });
});


describe('calculateChunks', () => {
    it('should generate correct chunks when length is divisible by chunkSize', () => {
        const length = 30;
        const chunkSize = 10;
        const expectedOutput = [
            { length: 10, offset: 0 },
            { length: 10, offset: 10 },
            { length: 10, offset: 20 }
        ];
        expect(calculateChunksDetails(chunkSize, length)).toEqual(expectedOutput);
    });

    it('should generate correct chunks when length is not divisible by chunkSize', () => {
        const length = 28;
        const chunkSize = 10;
        const expectedOutput = [
            { length: 10, offset: 0 },
            { length: 10, offset: 10 },
            { length: 8, offset: 20 }
        ];
        expect(calculateChunksDetails(chunkSize, length)).toEqual(expectedOutput);
    });

    it('should handle chunkSize larger than length', () => {
        const length = 5;
        const chunkSize = 10;
        const expectedOutput = [
            { length: 5, offset: 0 }
        ];
        expect(calculateChunksDetails(chunkSize, length)).toEqual(expectedOutput);
    });

    it('should handle length of 0', () => {
        const length = 0;
        const chunkSize = 10;
        const expectedOutput: { length: number, offset: number }[] = [];
        expect(calculateChunksDetails(chunkSize, length)).toEqual(expectedOutput);
    });

    it('should handle chunkSize of 0 or negative (optional)', () => {
        const length = 28;
        expect(() => calculateChunksDetails(0, length)).toThrow('Chunk size must be greater than 0');
        expect(() => calculateChunksDetails(-10, length)).toThrow('Chunk size must be greater than 0');
    });

    it('should generate correct chunks with an initial offset', () => {
        const length = 28;
        const chunkSize = 10;
        const initialOffset = 5;
        const expectedOutput = [
            { length: 10, offset: 5 },
            { length: 10, offset: 15 },
            { length: 8, offset: 25 }
        ];
        expect(calculateChunksDetails(chunkSize, length, initialOffset)).toEqual(expectedOutput);
    });

    it('should throw error with negative initial offset', () => {
        const length = 28;
        const chunkSize = 10;
        const initialOffset = -1;
        const expectedOutput = [
            { length: 10, offset: 5 },
            { length: 10, offset: 15 },
            { length: 8, offset: 25 }
        ];
        expect(() => calculateChunksDetails(chunkSize, length, initialOffset)).toThrow();
    });
});

