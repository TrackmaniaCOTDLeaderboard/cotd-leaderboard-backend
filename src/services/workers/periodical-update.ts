import { parentPort } from "worker_threads";
import { updateChallenges } from "../challenges";
import { updateCompetitions } from "../competitions";
import { updateMaps } from "../maps";
import { updateMapperLeaderboard } from "../mapper-leaderboard";
import { Log } from "../../util";

const main = async (config: { challenges?: number, competitions?: number, months?: number }) => {
    const amountChallenges = config.challenges ?? 100;
    const amountCompetitions = config.competitions ?? 100;

    await updateChallenges(amountChallenges, 0, "periodical-update");
    Log.complete(`Finished "update-challenges"`, "periodical-update");

    await updateCompetitions(amountCompetitions, 0, "periodical-update");
    Log.complete(`Finished "update-competitions"`, "periodical-update");

    // TODO only last two days
    await updateMaps(2, 0);
    Log.complete(`Finished "update-maps"`, "periodical-update");

    await updateMapperLeaderboard();
    Log.complete(`Finished "update-mapper-leaderboard"`, "periodical-update");

    // TODO leaderboard

    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}

if (parentPort !== null) {
    parentPort.on("message", main);
}

