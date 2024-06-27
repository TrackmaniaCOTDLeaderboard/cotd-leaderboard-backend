import { RequestHandler } from "express";
import { database } from "../database";
import createHttpError from "http-errors";

export const getGlobalCupLeaderboard: RequestHandler = async (request, response, next) => {
    const { name, version } = request.query;

    if (version === undefined || typeof version !== "string") {
        return next(createHttpError(400, `Please provide a valid cup version (main: 1, night: 2, morning: 3)`))
    }

    const versionAsNumber = parseInt(version);

    if (versionAsNumber < 1 || versionAsNumber > 3 || Number.isNaN(versionAsNumber)) {
        return next(createHttpError(400, `Please provide a valid cup version (main: 1, night: 2, morning: 3)`))
    }

    const leaderboard = await database.globalCupLeaderboard.findMany({
        where: {
            player: typeof name === "string" ? {
                name: {
                    contains: name
                }
            } : undefined,
            version: versionAsNumber
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
    });

    response.status(200).json(leaderboard);
}

export const getGlobalTimeAttackLeaderboard: RequestHandler = async (request, response, next) => {
    const { name } = request.query;

    const leaderboard = await database.globalTimeAttackLeaderboard.findMany({
        where: {
            player: typeof name === "string" ? {
                name: {
                    contains: name
                }
            } : undefined,
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
    });

    response.status(200).json(leaderboard);
}

export const getMonthlyCupLeaderboard: RequestHandler = async (request, response, next) => {
    const { name, version } = request.query;
    const { year, month } = request.params;

    if (version === undefined || typeof version !== "string") {
        return next(createHttpError(400, `Please provide a valid cup version (main: 1, night: 2, morning: 3)`))
    }

    const versionAsNumber = parseInt(version);
    const yearAsNumber = parseInt(year);
    const monthAsNumber = parseInt(month);

    if (versionAsNumber < 1 || versionAsNumber > 3 || Number.isNaN(versionAsNumber)) {
        return next(createHttpError(400, `Please provide a valid cup version (main: 1, night: 2, morning: 3)`))
    }

    const leaderboard = await database.monthlyCupLeaderboard.findMany({
        where: {
            player: typeof name === "string" ? {
                name: {
                    contains: name
                }
            } : undefined,
            version: versionAsNumber,
            year: yearAsNumber,
            month: monthAsNumber
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
    });

    response.status(200).json(leaderboard);
}