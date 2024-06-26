import { parentPort } from "worker_threads";
import { updateMapperLeaderboard } from "../mapper-leaderboard";

const main = async () => {
    await updateMapperLeaderboard();
    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}

if (parentPort !== null) {
    parentPort.on("message", main);
}