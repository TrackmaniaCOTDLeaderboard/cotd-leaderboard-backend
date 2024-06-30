import { RequestHandler } from "express";
import { database } from "../database";
import { serviceManager } from "../services";

const firstCotD = new Date('2020-11-01');

export const getCotDStatus: RequestHandler = async (request, response) => {
    const today = new Date();
    const cups = await database.cup.findMany();

    const key = (year: number, month: number, day: number, version: number) => `${year}-${month}-${day} #${version}`

    const record: Record<string, boolean> = {};
    const dateSet = new Set(cups.map(cup => key(cup.year, cup.month, cup.day, cup.version)));

    for (let d = new Date(firstCotD); d <= today; d.setDate(d.getDate() + 1)) {
        for (let version = 1; version <= 3; version++) {
            const cup = key(d.getFullYear(), d.getMonth() + 1, d.getDate(), version);
            record[cup] = dateSet.has(cup);
        }

    }
    response.status(200).json(record);

}

const firstTotD = new Date('2020-07-01');

export const getTotDStatus: RequestHandler = async (request, response) => {
    const today = new Date();
    const maps = await database.map.findMany();

    const record: Record<string, boolean> = {};
    const dateSet = new Set(maps.map(map => `${map.year}-${map.month}-${map.day}`));

    for (let d = new Date(firstTotD); d <= today; d.setDate(d.getDate() + 1)) {
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        record[key] = dateSet.has(key);
    }

    response.status(200).json(record);
}

export const getStatus: RequestHandler = async (request, response) => {
    const states = serviceManager.getStatus();
    const errors = serviceManager.getErrors();
    response.status(200).json({ states, errors });
}

export const clearErrors: RequestHandler = async (request, response) => {
    const size = serviceManager.getErrors().length;
    serviceManager.clearErrors();
    response.status(200).json({ message: "Success", amount: size });
}