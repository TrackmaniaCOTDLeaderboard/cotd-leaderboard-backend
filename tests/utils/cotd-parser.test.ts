import { parseCompetition, parseChallenge } from "../../src/util/cotd-parser";
import { Competition } from "../../src/api/live-service/competitions";
import { Challenge } from "../../src/api/live-service/challenges";

describe("parseCompetition", () => {
    it("should correctly parse a valid competition name with date and version", () => {
        const expectedOutput = { year: 2021, month: 9, day: 17, version: 1 };
        expect(parseCompetition("Cup of the Day 2021-09-17 #1")).toEqual(expectedOutput);
    });

    it("should correctly parse a valid competition name with date only", () => {
        const expectedOutput = { year: 2020, month: 11, day: 2, version: 1 };
        expect(parseCompetition("Cup of the Day 2020-11-02")).toEqual(expectedOutput);
    });

    it("should correctly parse a valid short form competition name with date and version", () => {
        const expectedOutput = { year: 2023, month: 3, day: 19, version: 1 };
        expect(parseCompetition("COTD 2023-03-19 #1")).toEqual(expectedOutput);
    });

    it("should return null for an invalid competition name", () => {
        expect(parseCompetition("Invalid Competition Name")).toBeNull();
        expect(parseCompetition("")).toBeNull();
        expect(parseCompetition("COTD 2023-03-19 #1 - Challenge")).toBeNull();
        expect(parseCompetition("Cup of the Day 2020-11-02 - Challenge")).toBeNull();
        expect(parseCompetition("Cup of the Day 2021-09-17 #1 - Challenge")).toBeNull();
    });
});

describe("parseChallenge", () => {
    it("should correctly parse a valid challenge name with date and version", () => {
        const expectedOutput = { year: 2021, month: 9, day: 17, version: 1 };
        expect(parseChallenge("Cup of the Day 2021-09-17 #1 - Challenge")).toEqual(expectedOutput);
    });

    it("should correctly parse a valid challenge name with date only", () => {
        const expectedOutput = { year: 2020, month: 11, day: 2, version: 1 };
        expect(parseChallenge("Cup of the Day 2020-11-02 - Challenge")).toEqual(expectedOutput);
    });

    it("should correctly parse a valid short form challenge name with date and version", () => {
        const expectedOutput = { year: 2023, month: 3, day: 19, version: 1 };
        expect(parseChallenge("COTD 2023-03-19 #1 - Challenge")).toEqual(expectedOutput);
    });

    it("should return null for an invalid challenge name", () => {
        expect(parseChallenge("Invalid Competition Name")).toBeNull();
        expect(parseChallenge("")).toBeNull();
        expect(parseChallenge("COTD 2023-03-19 #1")).toBeNull();
        expect(parseChallenge("Cup of the Day 2020-11-02")).toBeNull();
        expect(parseChallenge("Cup of the Day 2021-09-17 #1")).toBeNull();
    });
});
