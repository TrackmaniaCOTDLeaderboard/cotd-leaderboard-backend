import app from "./app";
import { serviceManager } from "./services";
import { env, Log } from "./util";

Log.info("Booting ...");
app.listen(env.PORT, () => Log.complete(`Running on port "${env.PORT}"`));

setInterval(() => serviceManager.start("periodical-update"), 1000 * 60 * 20);