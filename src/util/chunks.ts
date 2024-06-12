export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let index = 0; index < array.length; index += chunkSize) {
        chunks.push(array.slice(index, index + chunkSize));
    }
    return chunks;
}