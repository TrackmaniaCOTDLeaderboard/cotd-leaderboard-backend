import { parentPort } from "worker_threads";
import { updateZones } from "../zones";

const main = async () => {
    await updateZones();
    if (parentPort !== null) {
        parentPort.postMessage("done");
    }
}

if (parentPort !== null) {
    parentPort.on("message", main);
}

