import { RequestHandler } from "express";
import { ServiceConfigsSchemas, serviceManager, ServiceSchema } from "../services/service-manager";
import createHttpError from "http-errors";

export const startService: RequestHandler = (request, response, next) => {
    const { service } = request.params;

    const serviceParsed = ServiceSchema.safeParse(service);

    if (!serviceParsed.success) {
        return next(createHttpError(400, `Unknown service ${service}.`));
    }

    const configSchema = ServiceConfigsSchemas[serviceParsed.data];

    const bodyParsed = configSchema.safeParse(request.body);

    if (!bodyParsed.success) {
        return next(createHttpError(400, `${bodyParsed.error.message}`));
    }

    const started = serviceManager.start(serviceParsed.data, bodyParsed.data);

    const message = started
        ? `Successfully started '${serviceParsed.data}' service.`
        : `Service '${serviceParsed.data}' is already running.`

    response.status(200).json({ message, started });
}