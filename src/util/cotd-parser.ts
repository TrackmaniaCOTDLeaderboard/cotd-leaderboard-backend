import { Competition } from "../api/live-service/competitions";
import { Challenge } from "../api/live-service/challenges";

const PATTERN_COMPETITIONS = [
    // Cup of the Day 2020-11-02
    // Cup of the Day 2021-09-17 #1
    /^Cup of the Day (\d{4})-(\d{2})-(\d{2})(?: #(\d+))?$/,
    // COTD 2023-03-19 #1
    /^COTD (\d{4})-(\d{2})-(\d{2}) #(\d+)$/
];

export const parseCompetition = (competition: Competition) => {

    const name = competition.name;
    for (const pattern of PATTERN_COMPETITIONS) {
        const match = name.match(pattern);
        if (match) {
            const [_, yearStr, monthStr, dayStr, divisionStr] = match;
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10);
            const day = parseInt(dayStr, 10);
            const division = divisionStr ? parseInt(divisionStr, 10) : 1;
            return { year, month, day, division };
        }
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

export const parseChallenge = (challenge: Challenge) => {

    const name = challenge.name;
    for (const pattern of PATTERNS_CHALLENGE) {
        const match = name.match(pattern);
        if (match) {
            const [_, yearStr, monthStr, dayStr, divisionStr] = match;
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10);
            const day = parseInt(dayStr, 10);
            const division = divisionStr ? parseInt(divisionStr, 10) : 1;
            return { year, month, day, division };
        }
    }

    // If no match found, return null
    return null;

}