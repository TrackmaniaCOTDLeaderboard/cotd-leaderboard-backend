import { parentPort } from "worker_threads";
import { updateChallenges } from "../challenges";
import { updateCompetitions } from "../competitions";
import { updateMaps } from "../maps";
import { updateMapperLeaderboard } from "../mapper-leaderboard";
import { Log } from "../../util";
import { updateGlobalChallengeLeaderboard } from "../challenge-leaderboard";
import { updateGlobalTimeAttackLeaderboard } from "../time-attack-leaderboard";
import { updateGlobalCupLeaderboard } from "../cup-leaderboard";

const main = async (config: { challenges?: number, competitions?: number }) => {
    const amountChallenges = config.challenges ?? 50;
    const amountCompetitions = config.competitions ?? 50;

    await updateChallenges(amountChallenges, 0, "periodical-update");
    Log.complete(`Finished "update-challenges"`, "periodical-update");

    await updateCompetitions(amountCompetitions, 0, "periodical-update");
    Log.complete(`Finished "update-competitions"`, "periodical-update");

    await updateMaps(2, 0, 2, "periodical-update");
    Log.complete(`Finished "update-maps"`, "periodical-update");

    await updateMapperLeaderboard();
    Log.complete(`Finished "update-mapper-leaderboard"`, "periodical-update");

    await updateGlobalChallengeLeaderboard();
    Log.complete(`Finished "update-global-challenge-leaderboard"`, "periodical-update");

    await updateGlobalTimeAttackLeaderboard();
    Log.complete(`Finished "update-global-time-attack-leaderboard"`, "periodical-update");

    await updateGlobalCupLeaderboard();
    Log.complete(`Finished "update-global-cup-leaderboard"`, "periodical-update");

    // TODO update montly leaderboards

    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}

if (parentPort !== null) {
    parentPort.on("message", main);
}

