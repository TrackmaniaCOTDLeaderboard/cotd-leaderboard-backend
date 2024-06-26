import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../util/validate-env";

export const requiresAuthentication: RequestHandler = (request, response, next) => {
    const token = request.headers.authorization;
    if (token === undefined) {
        return next(createHttpError(401, "Please provide a valid token."));
    }

    jwt.verify(token, env.JWT_SECRET, (error, decoded) => {
        if (error !== null || decoded === undefined || typeof decoded === "string" || decoded.exp === undefined) {
            return next(createHttpError(401, "Please provide a valid token."));
        }

        if (decoded.exp <= Date.now() / 1000) {
            return next(createHttpError(401, "Token has expired."));
        }
        next();
    });

}