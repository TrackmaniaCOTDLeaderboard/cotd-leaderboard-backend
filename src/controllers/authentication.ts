import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { env } from "../util";
import jwt from "jsonwebtoken";

export const login: RequestHandler = async (request, response, next) => {
    const { username, password } = request.body;

    if (username === undefined || password === undefined || username !== env.MONITOR_USERNAME) {
        return next(createHttpError(401, "Authentication failed."));
    }

    const adminPassword = await bcrypt.hash(env.MONITOR_PASSWORD, 10);
    const passwordMatch = await bcrypt.compare(password, adminPassword);
    if (!passwordMatch) {
        return next(createHttpError(401, "Authentication failed."));
    }

    const token = jwt.sign({ username: env.MONITOR_USERNAME }, env.JWT_SECRET, { expiresIn: "1h" });
    response.status(200).json({ token });
}