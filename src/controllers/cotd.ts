import { RequestHandler } from "express";
import { database } from "../database";

export const test: RequestHandler = async (request, response, next) => {
    const zones = await database.map.findMany({
        include: {
            author: {
                include: {
                    zone: true
                }
            },
            TimeAttack: {
                include: {
                    player: true
                }
            }
        }
    });
    response.status(200).json(zones);
};