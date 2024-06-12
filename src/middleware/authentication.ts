import { RequestHandler } from "express";
import createHttpError from "http-errors";
import env from "../util/validate-env";

export const requiresAuthentication: RequestHandler = (request, response, next) => {
    const token = request.query.token;
    if (token === undefined || token !== env.TOKEN) {
        next(createHttpError(401, "Please provide a valid token."));
        return;
    }

    next()
}