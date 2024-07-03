import { RequestHandler } from "express";
import { database } from "../database";
import createHttpError from "http-errors";

export const getTotdsByYearAndMonth: RequestHandler = async (request, response, next) => {
    const { year, month } = request.params;

    if (year === undefined || month === undefined) {
        return next(createHttpError(400, "Please provide a 'year' and a 'month' parameter."));
    }

    const yearAsInt = parseInt(year);
    const monthAsInt = parseInt(month);

    if (Number.isNaN(yearAsInt)) {
        return next(createHttpError(400, `"${year}" is not a valid year.`));
    }

    if (Number.isNaN(monthAsInt)) {
        return next(createHttpError(400, `"${month}" is not a valid month.`));
    }

    const result = await database.map.findMany({
        where: {
            year: yearAsInt,
            month: monthAsInt
        },
        include: {
            author: true,
        }
    });

    response.status(200).json(result);
}

export const getTotdsByYear: RequestHandler = async (request, response, next) => {
    const { year } = request.params;

    if (year === undefined) {
        return next(createHttpError(400, "Please provide a 'year' parameter."));
    }

    const yearAsInt = parseInt(year);

    if (Number.isNaN(yearAsInt)) {
        return next(createHttpError(400, `"${year}" is not a valid year.`));
    }

    const result = await database.map.findMany({
        where: {
            year: yearAsInt,
        },
        include: {
            author: true,
        }
    });

    response.status(200).json(result);

}

export const getTotdsByYearMonthAndDay: RequestHandler = async (request, response, next) => {
    const { year, month, day } = request.params;

    if (year === undefined || month === undefined || day === undefined) {
        next(createHttpError(400, "Please provide a 'year', 'month' and 'day' parameter."));
        return;
    }

    const yearAsInt = parseInt(year);
    const monthAsInt = parseInt(month);
    const dayAsInt = parseInt(day);

    if (Number.isNaN(yearAsInt)) {
        next(createHttpError(400, `"${year}" is not a valid year.`));
        return;
    }

    if (Number.isNaN(monthAsInt)) {
        next(createHttpError(400, `"${month}" is not a valid month.`));
        return;
    }

    if (Number.isNaN(dayAsInt)) {
        next(createHttpError(400, `"${day}" is not a valid day.`));
        return;
    }


    const result = await database.map.findUnique({
        where: {
            year_month_day: {
                year: yearAsInt,
                month: monthAsInt,
                day: dayAsInt
            }
        },
        include: {
            author: {
                include: {
                    zone: true
                }
            },
            timeAttack: {
                include: {
                    player: {
                        include: {
                            zone: true
                        }
                    }
                }
            }
        }
    });

    response.status(200).json(result);
}