import { parentPort } from "worker_threads";
import { Log } from "../../util";
import { updateChallenges } from "../challenges";
import { updateCompetitions } from "../competitions";

const main = async (config: { challenges?: number, competitions?: number, months?: number }) => {
    const amountChallenges = config.challenges ?? 100;
    const amountCompetitions = config.competitions ?? 100;

    await updateChallenges(amountChallenges, 0, "initialize");
    Log.complete(`Finished "update-challenges"`, "initialize");

    await updateCompetitions(amountCompetitions, 0, "initialize");
    Log.complete(`Finished "update-competitions"`, "initialize");
    // TODO maps
    // TODO leaderboard

    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}

if (parentPort !== null) {
    parentPort.on("message", main);
}