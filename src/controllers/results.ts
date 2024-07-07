import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { database } from "../database";
import { playerQuery } from "../util/queries";

const resultsVersionQuerySchema = Joi.object({
    version: Joi.number().integer().min(1).max(3).default(1),
    name: Joi.string().min(3).optional(),
    page: Joi.number().min(0).default(0)
});

const resultsQuerySchema = Joi.object({
    name: Joi.string().min(3).optional(),
    page: Joi.number().min(0).default(0)
});

const resultsParamsSchema = Joi.object({
    year: Joi.number().integer().min(2020).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    day: Joi.number().integer().min(1).max(31).required()
});

const PAGE_SIZE = 64;

const resultQuery = {
    position: true,
    score: true,
    player: {
        select: playerQuery
    }
};

export const getChallengeResults: RequestHandler = (request, response, next) => {
    const parsedQuery = resultsVersionQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = resultsParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { name, version, page } = parsedQuery.value;
    const { year, month, day } = parsedParams.value;

    database.challengeResult.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
            challenge: {
                year, month, day, version
            }
        },
        select: resultQuery,
        orderBy: {
            position: "asc"
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, `Failed to get challenge results of ${year}-${month}-${day} #${version}.`))
    });
}

export const getCupResults: RequestHandler = (request, response, next) => {
    const parsedQuery = resultsVersionQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = resultsParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { name, version, page } = parsedQuery.value;
    const { year, month, day } = parsedParams.value;

    database.cupResult.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
            cup: {
                year, month, day, version
            }
        },
        select: resultQuery,
        orderBy: {
            position: "asc"
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, `Failed to get cup results of ${year}-${month}-${day} #${version}.`))
    });
}

export const getTimeAttackResults: RequestHandler = (request, response, next) => {
    const parsedQuery = resultsQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = resultsParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { name, page } = parsedQuery.value;
    const { year, month, day } = parsedParams.value;

    database.timeAttack.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
            map: {
                year, month, day
            }
        },
        select: resultQuery,
        orderBy: {
            position: "asc"
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, `Failed to get time attack results of ${year}-${month}-${day}.`))
    });
}


const resultsVersionPlayerQuerySchema = Joi.object({
    page: Joi.number().min(0).default(0),
    version: Joi.number().integer().min(1).max(3).default(1)
});

const resultsPlayerQuerySchema = Joi.object({
    page: Joi.number().min(0).default(0)
});

const resultsPlayerParamsSchema = Joi.object({
    id: Joi.string().required()
});

export const getCupResultsOfPlayer: RequestHandler = (request, response, next) => {
    const parsedQuery = resultsVersionPlayerQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = resultsPlayerParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { version, page } = parsedQuery.value;
    const { id } = parsedParams.value;

    database.cupResult.findMany({
        where: {
            player: { id },
            cup: { version }
        },
        select: {
            ...resultQuery,
            cup: {
                select: {
                    year: true,
                    month: true,
                    day: true,
                    version: true
                }
            }
        },
        orderBy: [
            { cup: { year: "desc" } },
            { cup: { month: "desc" } },
            { cup: { day: "desc" } },
        ],
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, `Failed to get cup results of ${id} #${version}.`))
    });
}

export const getChallengeResultsOfPlayer: RequestHandler = (request, response, next) => {
    const parsedQuery = resultsVersionPlayerQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = resultsPlayerParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { version, page } = parsedQuery.value;
    const { id } = parsedParams.value;

    database.challengeResult.findMany({
        where: {
            player: { id },
            challenge: { version }
        },
        select: {
            ...resultQuery,
            challenge: {
                select: {
                    year: true,
                    month: true,
                    day: true,
                    version: true
                }
            }
        },
        orderBy: [
            { challenge: { year: "desc" } },
            { challenge: { month: "desc" } },
            { challenge: { day: "desc" } },
        ],
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, `Failed to get challenge results of ${id} #${version}.`))
    });
}

export const getTimeAttackResultsOfPlayer: RequestHandler = (request, response, next) => {
    const parsedQuery = resultsPlayerQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = resultsPlayerParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { page } = parsedQuery.value;
    const { id } = parsedParams.value;

    database.timeAttack.findMany({
        where: {
            player: { id },
        },
        select: {
            ...resultQuery,
            map: {
                select: {
                    year: true,
                    month: true,
                    day: true,
                }
            }
        },
        orderBy: [
            { map: { year: "desc" } },
            { map: { month: "desc" } },
            { map: { day: "desc" } },
        ],
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, `Failed to get time attack results of ${id}.`))
    });
}

