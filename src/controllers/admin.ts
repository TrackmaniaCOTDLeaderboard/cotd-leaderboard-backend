import { RequestHandler } from "express";
import { database } from "../database";
import { serviceManager } from "../services";
import createHttpError from "http-errors";
import { getDateKey } from "../util";

const FIRST_COTD = new Date('2020-11-01');
const FIRST_TOTD = new Date('2020-07-01');


export const getCotDStatus: RequestHandler = async (request, response, next) => {
    try {
        const today = new Date();
        const cups = await database.cup.findMany();

        const key = (year: number, month: number, day: number, version: number) => `${getDateKey(year, month, day)} #${version}`

        const record: Record<string, boolean> = {};
        const dateSet = new Set(cups.map(cup => key(cup.year, cup.month, cup.day, cup.version)));

        for (let d = new Date(FIRST_COTD); d <= today; d.setDate(d.getDate() + 1)) {
            for (let version = 1; version <= 3; version++) {
                const cup = key(d.getFullYear(), d.getMonth() + 1, d.getDate(), version);
                record[cup] = dateSet.has(cup);
            }
        }
        response.status(200).json(record);
    } catch (error) {
        console.error(error);
        next(createHttpError(500, "Failed to calculate COTD status."));
    }
}

export const getTotDStatus: RequestHandler = async (request, response, next) => {
    try {
        const today = new Date();
        const maps = await database.map.findMany();

        const record: Record<string, boolean> = {};
        const dateSet = new Set(maps.map(map => getDateKey(map.year, map.month, map.day)));

        for (let d = new Date(FIRST_TOTD); d <= today; d.setDate(d.getDate() + 1)) {
            const challenge = getDateKey(d.getFullYear(), d.getMonth(), d.getDate());
            record[challenge] = dateSet.has(challenge);
        }

        response.status(200).json(record);
    } catch (error) {
        console.error(error);
        next(createHttpError(500, "Failed to calculate TOTD status."));
    }

}

export const getStatus: RequestHandler = (request, response) => {
    const states = serviceManager.getStatus();
    const errors = serviceManager.getErrors();
    response.status(200).json({ states, errors });
}

export const clearErrors: RequestHandler = (request, response) => {
    const size = serviceManager.getErrors().length;
    serviceManager.clearErrors();
    response.status(200).json({ message: "Success", amount: size });
}