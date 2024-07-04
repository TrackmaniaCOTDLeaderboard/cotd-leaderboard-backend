import { RequestHandler } from "express";
import { database } from "../database";
import createHttpError from "http-errors";

import Joi from 'joi';

const challengeQuerySchema = Joi.object({
    version: Joi.number().integer().min(1).max(3).default(1)
});

const challengeParameterSchema = Joi.object({
    year: Joi.number().integer().min(2020).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    day: Joi.number().integer().min(1).max(31).required(),
});

/**
 * Retrieves a challenge from the database based on year, month, day, and version.
 *
 * @param request - The Express Request object.
 * @param response - The Express Response object.
 * @param next - The Express Next function.
 * @throws `400` - If query or parameter validation fails.
 * @throws `500` - If there's an error retrieving the challenge from the database.
 */
export const getChallengeByYearAndMonthAndDay: RequestHandler = (request, response, next) => {
    const parsedQuery = challengeQuerySchema.validate(request.query);
    if (parsedQuery.error) {
        return next(createHttpError(400, parsedQuery.error.message));
    }

    const parsedParams = challengeParameterSchema.validate(request.params);
    if (parsedParams.error) {
        return next(createHttpError(400, parsedParams.error.message));
    }

    const { version } = parsedQuery.value;
    const { year, month, day } = parsedParams.value;

    database.challenge.findUnique({
        where: {
            year_month_day_version: { year, month, day, version }
        },
        include: {
            challengeResults: {
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
            },
        }
    }).then(challenge => response.status(200).json(challenge))
        .catch(error => {
            console.error(error);
            next(createHttpError(500, `Failed to get challenge ${year}-${month}-${day} #${version}.`))
        });

}