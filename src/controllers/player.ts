import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { database } from "../database";
import { mapQuery, playerQuery, statisticsQuery } from "../util/queries";

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
                    version: true,
                    month: true,
                    year: true
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
                    version: true,
                    month: true,
                    year: true
                },
                orderBy: [
                    { year: "asc" },
                    { month: "asc" },
                    { version: "asc" }
                ]
            },
            monthlyTimeAttackLeaderboard: {
                select: {
                    ...statisticsQuery,
                    month: true,
                    year: true
                },
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

export const getMapsOfPlayer: RequestHandler = (request, response, next) => {
    const parsedParams = playerIdParamsSchema.validate(request.params);

    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { id } = parsedParams.value;

    database.map.findMany({
        where: { playerId: id },
        select: {
            ...mapQuery
        },
        orderBy: [
            { year: "desc" },
            { month: "desc" },
            { day: "desc" },
        ]
    }).then(player => response.status(200).json(player)).catch(error => {
        console.error(error);
        next(createHttpError(500, `Failed to load player with id ${id}`))
    });
}


const playerNameQuerySchema = Joi.object({
    name: Joi.string().min(3).optional(),
    page: Joi.number().min(0).default(0)
});

const PAGE_SIZE = 100;

export const getPlayersByName: RequestHandler = (request, response, next) => {
    const parsedQuery = playerNameQuerySchema.validate(request.query);

    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const { name, page } = parsedQuery.value;

    database.player.findMany({
        where: { name: { contains: name } },
        include: { zone: { select: { displayId: true } } },
        take: PAGE_SIZE,
        skip: page * PAGE_SIZE
    }).then(player => response.status(200).json(player)).catch(error => {
        console.error(error);
        next(createHttpError(500, `Failed to load player with name ${name}`))
    });
}