import { RequestHandler, response } from "express";
import { getAllZones } from "../api/core-service/zones";
import { database } from "../database";

export const refreshCupOfTheDay: RequestHandler = (request, response, next) => {
    response.status(200).json({ hallo: "hallo" })
}

export const refreshTracksOfMonth: RequestHandler = async (request, response, next) => {

}

export const refreshZones: RequestHandler = async () => {
    await getAllZones();
    response.status(200).json({ message: "Successfully updated Zones." })
}

const firstCotD = new Date('2020-11-01');



export const getCotDStatus: RequestHandler = async (request, response) => {
    const today = new Date();
    const cups = await database.cup.findMany();

    const record: Record<string, boolean> = {};
    const dateSet = new Set(cups.map(cup => `${cup.year}-${cup.month}-${cup.day}`));

    for (let d = new Date(firstCotD); d <= today; d.setDate(d.getDate() + 1)) {
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        record[key] = dateSet.has(key);
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

export const test: RequestHandler = async (request, response) => {
    const stats = await database.player.findUnique({
        where: {
            id: "53533000-79f5-4ac3-9831-46d107b55e9f"
        },
        include: {
            CupResults: {
                include: {
                    cup: {
                        select: {
                            month: true,
                            year: true,
                            day: true,
                            version: true
                        }
                    },
                }
            },
            zone: true,
            Maps: true
        }
    })

    response.status(200).json(stats);
}