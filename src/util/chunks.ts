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

export type ChunkDetails = {
    length: number;
    offset: number
}

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