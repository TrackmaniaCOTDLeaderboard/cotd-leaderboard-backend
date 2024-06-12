import "dotenv/config";
import express, { json, Request, Response, NextFunction } from "express";
import cors from "cors";
import { AdminRouter, CotdRouter, TotdRouter, ImagesRouter } from "./routes";
import { requiresAuthentication } from "./middleware/authentication";
import createHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(cors());
app.use(json());

app.use("/admin", requiresAuthentication, AdminRouter);
app.use("/cotd", CotdRouter);
app.use("/totd", TotdRouter);
app.use("/img", ImagesRouter);

// Handling of unknown endpoints
app.use((request, response, next) => {
    next(createHttpError(404, "Endpoint not found."));
})

// Error handling
app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    console.error(error);
    const errorMessage = isHttpError(error) ? error.message : "An unknown error occured.";
    const errorStatus = isHttpError(error) ? error.status : 500;
    response.status(errorStatus).json({ error: errorMessage });
});

export default app;