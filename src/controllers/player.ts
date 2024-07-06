import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { database } from "../database";
import { playerQuery, statisticsQuery } from "../util/queries";

const playerIdParamsSchema = Joi.object({
    id: Joi.string().required(),
});

export const getPlayerById: RequestHandler = (request, response, next) => {
    const parsedParams = playerIdParamsSchema.validate(request.params);

    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { id } = parsedParams.value;

    database.player.findUnique({
        where: { id },
        select: {
            ...playerQuery,
            mapperLeaderboard: {
                select: {
                    points: true,
                    position: true
                }
            },
            monthlyCupLeaderboard: {
                select: {
                    ...statisticsQuery,
                    version: true
                },
                orderBy: [
                    { year: "asc" },
                    { month: "asc" },
                    { version: "asc" }
                ]
            },
            monthlyChallengeLeaderboard: {
                select: {
                    ...statisticsQuery,
                    version: true
                },
                orderBy: [
                    { year: "asc" },
                    { month: "asc" },
                    { version: "asc" }
                ]
            },
            monthlyTimeAttackLeaderboard: {
                select: statisticsQuery,
                orderBy: [
                    { year: "asc" },
                    { month: "asc" }
                ]
            },
            globalChallengeLeaderboard: {
                select: {
                    ...statisticsQuery,
                    version: true
                },
                orderBy: { version: "asc" }
            },
            globalCupLeaderboard: {
                select: {
                    ...statisticsQuery,
                    version: true
                },
                orderBy: { version: "asc" }
            },
            globalTimeAttackLeaderboard: {
                select: statisticsQuery
            },
        }
    }).then(player => response.status(200).json(player)).catch(error => {
        console.error(error);
        next(createHttpError(500, `Failed to load player with id ${id}`))
    });
}


const playerNameQuerySchema = Joi.object({
    name: Joi.string().min(3).optional()
});


export const getPlayersByName: RequestHandler = (request, response, next) => {
    const parsedQuery = playerNameQuerySchema.validate(request.query);

    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const { name } = parsedQuery.value;

    database.player.findMany({
        where: { name: { contains: name } },
        include: { zone: { select: { displayId: true } } }
    }).then(player => response.status(200).json(player)).catch(error => {
        console.error(error);
        next(createHttpError(500, `Failed to load player with name ${name}`))
    });
}