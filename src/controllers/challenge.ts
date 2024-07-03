import { RequestHandler } from "express";
import { database } from "../database";
import createHttpError from "http-errors";

export const getChallengesByYearAndMonthAndDay: RequestHandler = async (request, response, next) => {
    const { year, month, day } = request.params;
    const { version } = request.query;

    if (year === undefined || day === undefined || month === undefined || version === undefined || typeof version !== "string") {
        return next(createHttpError(400, "Please provide a 'year' and a 'month' parameter."));
    }

    const yearAsInt = parseInt(year);
    const monthAsInt = parseInt(month);
    const versionAsInt = parseInt(version);
    const dayAsInt = parseInt(day);

    if (Number.isNaN(yearAsInt)) {
        return next(createHttpError(400, `"${year}" is not a valid year.`));
    }

    if (Number.isNaN(monthAsInt)) {
        return next(createHttpError(400, `"${month}" is not a valid month.`));
    }

    if (Number.isNaN(dayAsInt)) {
        return next(createHttpError(400, `"${day}" is not a valid day.`));
    }

    if (versionAsInt < 1 || versionAsInt > 3) {
        return next(createHttpError(400, `${version} is not a valid version.`))
    }

    const result = await database.challenge.findUnique({
        where: {
            year_month_day_version: {
                year: yearAsInt,
                month: monthAsInt,
                day: dayAsInt,
                version: versionAsInt
            }
        },
        include: {
            challengeResults: {
                include: {
                    player: {
                        include: {
                            zone: true
                        }
                    }
                }
            },
        }
    });

    response.status(200).json(result);
}