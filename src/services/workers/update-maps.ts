import { parentPort } from "worker_threads";
import { updateMaps } from "../maps";
import { Log } from "../../util";

const main = async (config: { length?: number, offset?: number }) => {
    const length = config.length ?? 1;
    const offset = config.offset ?? 0;

    Log.info(`length: "${length}" | offset: "${offset}"`, "update-maps");

    await updateMaps(length, offset);
    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}


if (parentPort !== null) {
    parentPort.on("message", main)
}