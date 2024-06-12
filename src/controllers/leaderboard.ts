import { RequestHandler } from "express"
import createHttpError from "http-errors";
import { database } from "../database";

export const getGlobalPlayerDetails: RequestHandler = async (request, response, next) => {
    const id = request.params.id;

    const cups = request.query.cups === "true";
    const maps = request.query.maps === "true";
    const challenges = request.query.challenges === "true";
    const mapResults = request.query.mapResults === "true";

    if (id === undefined) {
        next(createHttpError(400, "Please provide a player id. ('id')"));
        return;
    }

    const details = await database.player.findUnique({
        where: {
            id: id,
        }
    });

    response.status(200).json(details);
}

export const getGlobalCotdLeaderboard: RequestHandler = async (request, response, next) => {

}