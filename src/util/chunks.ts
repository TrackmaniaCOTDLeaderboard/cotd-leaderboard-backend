/**
 * Splits an array into chunks of a specified size.
 *
 * This function takes an array and divides it into smaller arrays (chunks) of the specified size.
 * 
 * @template T
 * @param array - The array to be chunked.
 * @param chunkSize - The size of each chunk. Must be greater than 0.
 * @returns An array of chunks, where each chunk is an array of elements.
 * @throws Throws an error if the chunk size is less than or equal to 0.
 *
 * @example
 * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const chunks = chunkArray(data, 3);
 * console.log(chunks);
 * // Outputs: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 */
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    if (chunkSize <= 0) {
        throw new Error(`Chunk size must be greater than 0 but was ${chunkSize}`);
    }
    if (array.length === 0) {
        return [];
    }

    const chunks: T[][] = [];
    for (let index = 0; index < array.length; index += chunkSize) {
        chunks.push(array.slice(index, index + chunkSize));
    }
    return chunks;
}

/** Represents the details of a chunk returned by {@link calculateChunksDetails}*/
export type ChunkDetails = {
    /** The length of the chunk. */
    length: number;
    /** The offset of the chunk in the original data. */
    offset: number
}

/**
 * Calculates the details of chunks for a given length and chunk size.
 *
 * This function calculates the chunks required to cover the specified length, starting from an initial offset.
 * 
 * This is especially used while requesting chunks of leaderboards from the Ubisoft Nadeo Trackmania API.
 *
 * @param chunkSize - The size of each chunk. Must be greater than 0.
 * @param length - The total length of the data to be chunked.
 * @param [initialOffset=0] - The initial offset to start chunking from (optional, defaults to 0). Must be non-negative.
 * @returns An array of objects containing the details of each chunk.
 * @throws Throws an error if the chunk size is less than or equal to 0 or if the initial offset is negative.
 *
 * @example
 * const chunksDetails = calculateChunksDetails(10, 100, 5);
 * console.log(chunksDetails);
 * // Outputs: [{ length: 10, offset: 5 }, { length: 10, offset: 15 }, ..., { length: 5, offset: 95 }]
 */
export const calculateChunksDetails = (chunkSize: number, length: number, initialOffset = 0) => {
    if (chunkSize <= 0) {
        throw new Error('Chunk size must be greater than 0');
    }

    if (initialOffset < 0) {
        throw new Error('Chunk size must be greater than 0');
    }

    const chunks: ChunkDetails[] = [];
    for (let offset = initialOffset; offset < length + initialOffset; offset += chunkSize) {
        const currentChunkSize = Math.min(chunkSize, length + initialOffset - offset);
        chunks.push({ length: currentChunkSize, offset });
    }

    return chunks;
}