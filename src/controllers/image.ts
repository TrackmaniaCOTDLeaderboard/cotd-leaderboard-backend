import { RequestHandler } from "express";
import { database } from "../database";
import path from "path";
import createHttpError from "http-errors";
import fs from "fs";
import { Log } from "../util";

/**
 * Retrieves the flag image file for a zone based on zone ID.
 *
 * @param request - The Express Request object.
 * @param response - The Express Response object.
 * @param next - The Express Next function.
 * @throws `404` - If the zone with the specified ID does not exist or the flag image file is not found.
 * @throws `500` - If there's an error retrieving or sending the flag image file.
 */
export const getFlag: RequestHandler = async (request, response, next) => {
    const zoneId = request.params.zoneId;

    try {
        const zone = await database.zone.findUnique({
            where: {
                id: zoneId
            }
        });

        if (zone === null) {
            return next(createHttpError(404, `Zone with the id ${zoneId} doesn't exist.`));
        }

        const filePath = path.join(__dirname, `../../assets/${zone.flag}`);

        if (!fs.existsSync(filePath)) {
            Log.error(`"${filePath}" doesnt exist. "${zone.name}"`);
            return next(createHttpError(404, `Failed to load zone flag.`));
        }

        response.status(200).sendFile(filePath);
    } catch (error) {
        console.error(error);
        next(createHttpError(500, `Failed to get image of zone ${zoneId}`))
    }
}