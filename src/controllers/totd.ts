import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { database } from "../database";
import { mapQuery } from "../util/queries";

const totdDayParameterSchema = Joi.object({
    year: Joi.number().integer().min(2020).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    day: Joi.number().integer().min(1).max(31).required(),
});

const totdMonthParameterSchema = Joi.object({
    year: Joi.number().integer().min(2020).required(),
    month: Joi.number().integer().min(1).max(12).required(),
});

export const getTotdsByYearAndMonth: RequestHandler = (request, response, next) => {
    const parsedParams = totdMonthParameterSchema.validate(request.params);

    if (parsedParams.error) {
        return next(createHttpError(400, "Please provide a 'year' and a 'month' parameter."));
    }

    const { year, month } = parsedParams.value;

    const query = {
        where: { year, month },
        select: mapQuery
    };

    database.map.findMany(query)
        .then(totdsOfMonth => response.status(200).json(totdsOfMonth))
        .catch(error => {
            console.error(error);
            next(createHttpError(500, `Failed to get tracks of month ${year}-${month}`))
        });
}

export const getTotdsByYearMonthAndDay: RequestHandler = (request, response, next) => {
    const parsedParams = totdDayParameterSchema.validate(request.params);

    if (parsedParams.error) {
        return next(createHttpError(400, "Please provide a 'year' and a 'month' parameter."));
    }

    const { year, month, day } = parsedParams.value;

    database.map.findUnique({
        where: {
            year_month_day: { year, month, day }
        },
        select: mapQuery
    }).then(map => response.status(200).json(map)).catch(error => {
        console.error(error);
        next(createHttpError(500, `Failed to get track of the day ${year}-${month}-${day}`))
    })


}