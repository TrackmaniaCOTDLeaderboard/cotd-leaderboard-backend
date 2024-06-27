import { parentPort } from "worker_threads";
import { Log } from "../../util";
import { updateChallenges } from "../challenges";
import { updateCompetitions } from "../competitions";
import { updateMaps } from "../maps";
import { updateMapperLeaderboard } from "../mapper-leaderboard";
import { updateGlobalChallengeLeaderboard } from "../challenge-leaderboard";
import { updateGlobalTimeAttackLeaderboard } from "../time-attack-leaderboard";
import { updateGlobalCupLeaderboard } from "../cup-leaderboard";

const main = async (config: { challenges?: number, competitions?: number, months?: number }) => {
    const amountChallenges = config.challenges ?? 20000;
    const amountCompetitions = config.competitions ?? 30000;
    const amountMonths = config.months ?? 4 * 12;

    await updateChallenges(amountChallenges, 0, "initialize");
    Log.complete(`Finished "update-challenges"`, "initialize");

    await updateCompetitions(amountCompetitions, 0, "initialize");
    Log.complete(`Finished "update-competitions"`, "initialize");

    await updateMaps(amountMonths, 0, undefined, "initialize");
    Log.complete(`Finished "update-maps"`, "initialize");

    await updateMapperLeaderboard();
    Log.complete(`Finished "update-mapper-leaderboard"`, "initialize");

    await updateGlobalChallengeLeaderboard();
    Log.complete(`Finished "update-global-challenge-leaderboard"`, "initialize");

    await updateGlobalTimeAttackLeaderboard();
    Log.complete(`Finished "update-global-time-attack-leaderboard"`, "initialize");

    await updateGlobalCupLeaderboard();
    Log.complete(`Finished "update-global-cup-leaderboard"`, "initialize");

    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}

if (parentPort !== null) {
    parentPort.on("message", main);
}