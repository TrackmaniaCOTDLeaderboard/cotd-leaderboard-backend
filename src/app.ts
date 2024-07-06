import cors from "cors";
import "dotenv/config";
import express, { json, NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import { AdminRouter, AuthenticationRouter, ImagesRouter, LeaderboardRouter, PlayerRouter, ResultsRouter, ServiceRouter, TotdRouter } from "./routes";
import { Log } from "./util";

const app = express();

app.use(cors());
app.use(json());

app.use("/admin", AdminRouter);
app.use("/authentication", AuthenticationRouter);
app.use("/totd", TotdRouter);
app.use("/img", ImagesRouter);
app.use("/leaderboard", LeaderboardRouter);
app.use("/service", ServiceRouter);
app.use("/player", PlayerRouter);
app.use("/results", ResultsRouter);

// Handling of unknown endpoints
app.use((request, response, next) => {
    next(createHttpError(404, "Endpoint not found."));
})

// Error handling
app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    const errorMessage = isHttpError(error) ? error.message : "An unknown error occured.";
    const errorStatus = isHttpError(error) ? error.status : 500;
    Log.error(`Status ${errorStatus}: ${errorMessage}`);
    response.status(errorStatus).json({ error: errorMessage });
});

export default app;