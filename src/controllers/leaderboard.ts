import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { database } from "../database";

const leaderboardVersionQuerySchema = Joi.object({
    version: Joi.number().integer().min(1).max(3).default(1),
    name: Joi.string().min(3).optional()
});

const leaderboardQuerySchema = Joi.object({
    name: Joi.string().min(3).optional()
});


const monthlyLeaderboardParamsSchema = Joi.object({
    year: Joi.number().integer().min(2020).required(),
    month: Joi.number().integer().min(1).max(12).required(),
});

export const getGlobalCupLeaderboard: RequestHandler = (request, response, next) => {

    const parsedQuery = leaderboardVersionQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const { name, version } = parsedQuery.value;

    database.globalCupLeaderboard.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
            version
        },
        include: {
            player: {
                include: {
                    zone: true
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error);
        next(createHttpError(500, "Failed to get global cup leaderboard."))
    });
}

export const getGlobalTimeAttackLeaderboard: RequestHandler = (request, response, next) => {
    const parsedQuery = leaderboardQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }
    const { name } = parsedQuery.value;

    database.globalTimeAttackLeaderboard.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
        },
        include: {
            player: {
                include: {
                    zone: true
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error);
        next(createHttpError(500, "Failed to get global time attack leaderboard."))
    });
}

export const getGlobalChallengeLeaderboard: RequestHandler = (request, response, next) => {
    const parsedQuery = leaderboardVersionQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const { name, version } = parsedQuery.value;

    database.globalChallengeLeaderboard.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
            version
        },
        include: {
            player: {
                include: {
                    zone: true
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, "Failed to get global challenge leaderboard."))
    });
}

export const getMonthlyCupLeaderboard: RequestHandler = (request, response, next) => {
    const parsedQuery = leaderboardVersionQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = monthlyLeaderboardParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { name, version } = parsedQuery.value;
    const { year, month } = parsedParams.value;

    database.monthlyCupLeaderboard.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
            version,
            year,
            month
        },
        include: {
            player: {
                include: {
                    zone: true
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, `Failed to get montlhy cup leaderboard of ${year}-${month}.`))
    });
}

export const getMonthlyChallengeLeaderboard: RequestHandler = (request, response, next) => {
    const parsedQuery = leaderboardVersionQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = monthlyLeaderboardParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { name, version } = parsedQuery.value;
    const { year, month } = parsedParams.value;

    database.monthlyChallengeLeaderboard.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
            version,
            year,
            month
        },
        include: {
            player: {
                include: {
                    zone: true
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error);
        next(createHttpError(500, `Failed to get monthly challenge leaderboard of ${year}-${month}.`))
    });
}

export const getMonthlyTimeAttackLeaderboard: RequestHandler = (request, response, next) => {
    const parsedQuery = leaderboardQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = monthlyLeaderboardParamsSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { name } = parsedQuery.value;
    const { year, month } = parsedParams.value;

    database.monthlyTimeAttackLeaderboard.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            },
            year,
            month
        },
        include: {
            player: {
                include: {
                    zone: true
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error);
        next(createHttpError(500, `Failed to get monthly time attack leaderboard of ${year}-${month}.`))
    });
}

export const getMapperLeaderboard: RequestHandler = (request, response, next) => {
    const parsedQuery = leaderboardQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const { name } = parsedQuery.value;

    database.mapperLeaderboard.findMany({
        where: {
            player: {
                name: {
                    contains: name
                }
            }
        },
        include: {
            player: {
                include: {
                    zone: true
                }
            }
        },
        orderBy: {
            position: "asc"
        }
    }).then(leaderboard => response.status(200).json(leaderboard)).catch(error => {
        console.error(error)
        next(createHttpError(500, "Failed to get mapper leaderboard"))
    });
}