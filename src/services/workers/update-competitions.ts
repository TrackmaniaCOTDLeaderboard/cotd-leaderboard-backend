import { parentPort } from "worker_threads";
import { Log } from "../../util";
import { updateCompetitions } from "../competitions";

const main = async (config: { length?: number, offset?: number }) => {
    const length = config.length ?? 100;
    const offset = config.offset ?? 0;

    Log.info(`length: "${length}" | offset: "${offset}"`, "update-competitions");

    await updateCompetitions(length, offset, "update-competitions");
    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}

if (parentPort !== null) {
    parentPort.on("message", main);
}

