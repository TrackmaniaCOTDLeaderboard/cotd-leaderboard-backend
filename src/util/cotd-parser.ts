const PATTERN_COMPETITIONS = [
    // Cup of the Day 2020-11-02
    // Cup of the Day 2021-09-17 #1
    /^Cup of the Day (\d{4})-(\d{2})-(\d{2})(?: #(\d+))?$/,
    // COTD 2023-03-19 #1
    /^COTD (\d{4})-(\d{2})-(\d{2}) #(\d+)$/
];

/**
 * Get meta data from the name of a competition. This function extracts the `year`, `month`, `day` and `rerun` version of the competition.
 * @param competitionName Name of the competition.
 * @returns `year`, `month`, `day` and `rerun` version of the competition. Null if the challenge name has an invalid/unknown format.
 */
export const parseCompetition = (competitionName: string) => {
    for (const pattern of PATTERN_COMPETITIONS) {
        const match = competitionName.match(pattern);

        if (match === null) continue;

        const [_, yearStr, monthStr, dayStr, versionStr] = match;
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        const version = versionStr ? parseInt(versionStr, 10) : 1;
        return { year, month, day, version };
    }

    // If no match found, return null
    return null;

}

const PATTERNS_CHALLENGE = [
    // Cup of the Day 2020-11-02 - Challenge
    // Cup of the Day 2021-09-17 #1 - Challenge
    /^Cup of the Day (\d{4})-(\d{2})-(\d{2})(?: #(\d+))? - Challenge$/,
    // COTD 2023-03-19 #1 - Challenge
    /^COTD (\d{4})-(\d{2})-(\d{2}) #(\d+) - Challenge$/
];

/**
 * Get meta data from the name of a challenge. This function extracts the `year`, `month`, `day` and `rerun` version of the challenge.
 * @param challengeName Name of the challenge
 * @returns `year`, `month`, `day` and `rerun` version of the challenge. Null if the challenge name has an invalid/unknown format.
 */
export const parseChallenge = (challengeName: string) => {

    for (const pattern of PATTERNS_CHALLENGE) {
        const match = challengeName.match(pattern);
        if (match === null) continue;

        const [_, yearStr, monthStr, dayStr, versionStr] = match;
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        const version = versionStr ? parseInt(versionStr, 10) : 1;
        return { year, month, day, version };
    }

    // If no match found, return null
    return null;

}