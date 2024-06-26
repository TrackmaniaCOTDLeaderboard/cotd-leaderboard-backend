import { parentPort } from "worker_threads";
import { Log } from "../../util";
import { updateChallenges } from "../challenges";

const main = async (config: { length?: number, offset?: number }) => {
    const length = config.length ?? 100;
    const offset = config.offset ?? 0;

    Log.info(`length: "${length}" | offset: "${offset}"`, "update-challenges")

    await updateChallenges(length, offset, "update-challenges");
    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}


if (parentPort !== null) {
    parentPort.on("message", main);
}