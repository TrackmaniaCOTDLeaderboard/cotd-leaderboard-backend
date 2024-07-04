import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { env } from "../util";
import jwt from "jsonwebtoken";
import Joi from "joi";

const loginBodySchema = Joi.object({
    password: Joi.string().required(),
    username: Joi.string().required()
});

/**
 * Handles user login authentication.
 *
 * @param request - The Express Request object.
 * @param response - The Express Response object.
 * @param next - The Express Next function.
 * @throws `400` - If request body validation fails.
 * @throws `401` - If authentication fails (wrong username or password).
 * @throws `500` - If there's an error during login process.
 */
export const login: RequestHandler = async (request, response, next) => {
    try {
        const parsedBody = loginBodySchema.validate(request.body);

        if (parsedBody.error) {
            return next(createHttpError(400, parsedBody.error));
        }

        const { username, password } = parsedBody.value;

        const adminPassword = await bcrypt.hash(env.MONITOR_PASSWORD, 10);
        const passwordMatch = await bcrypt.compare(password, adminPassword);
        if (!passwordMatch || username !== env.MONITOR_USERNAME) {
            return next(createHttpError(401, "Authentication failed."));
        }

        const token = jwt.sign({ username }, env.JWT_SECRET, { expiresIn: "1h" });
        response.status(200).json({ token });
    } catch (error) {
        console.error(error);
        next(createHttpError(500, "Failed to login."));
    }

}