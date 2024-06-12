import { RequestHandler, response } from "express";
import { getAllZones } from "../api/core-service/zones";

export const refreshCupOfTheDay: RequestHandler = (request, response, next) => {
    response.status(200).json({ hallo: "hallo" })
}

export const refreshTracksOfMonth: RequestHandler = async (request, response, next) => {

}

export const refreshZones: RequestHandler = async () => {
    await getAllZones();
    response.status(200).json({ message: "Successfully updated Zones." })
}