
export const getRecentKeys = (sortedDays: Record<string, string>, length?: number) => {
    const sortedKeys = Object.keys(sortedDays).sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
    });

    const recentKeys = sortedKeys.slice(0, length ?? sortedKeys.length);
    return recentKeys.map(key => sortedDays[key]);
}