import { wait } from "../../util";
import { getChallengeResults, getChallenges } from "./challenges";

describe("getChallenges", () => {
    it("should reject and throw error on illegal length", async () => {
        await expect(getChallenges(-1)).rejects.toThrow();
        await expect(getChallenges(0)).rejects.toThrow();
        await expect(getChallenges(101)).rejects.toThrow();
        await expect(getChallenges(NaN)).rejects.toThrow();
        await expect(getChallenges(Infinity)).rejects.toThrow();
        await expect(getChallenges(50)).resolves.not.toThrow();
    });
    it("should reject and throw error on illegal offset", async () => {
        await expect(getChallenges(100, -1)).rejects.toThrow();
        await expect(getChallenges(100, NaN)).rejects.toThrow();
        await expect(getChallenges(100, Infinity)).rejects.toThrow();
    });
    it("should parse result as array of challenges on valid input parameters", async () => {
        await expect(getChallenges(50, 50)).resolves.not.toThrow();
        const result100 = await getChallenges(100, 0);
        expect(result100.length).toEqual(100);
        await wait(1);
        const result1 = await getChallenges(1, 0);
        expect(result1.length).toEqual(1);
    });
});

const validChallengeId = 9782;

describe("getChallengeLeaderboard", () => {
    it("should throw error on illegal length", async () => {
        await expect(getChallengeResults(validChallengeId, -1)).rejects.toThrow();
        await expect(getChallengeResults(validChallengeId, 0)).rejects.toThrow();
        await expect(getChallengeResults(validChallengeId, 101)).rejects.toThrow();
        await expect(getChallengeResults(validChallengeId, NaN)).rejects.toThrow();
        await expect(getChallengeResults(validChallengeId, Infinity)).rejects.toThrow();
    });
    it("should throw error on illegal offset", async () => {
        await expect(getChallengeResults(validChallengeId, 100, -1)).rejects.toThrow();
        await expect(getChallengeResults(validChallengeId, 100, NaN)).rejects.toThrow();
        await expect(getChallengeResults(validChallengeId, 100, Infinity)).rejects.toThrow();
    });
    it("should parse result as array of challenge leaderboard entries on valid input parameters", async () => {
        await expect(getChallengeResults(validChallengeId, 50, 50)).resolves.not.toThrow();
    });
});

