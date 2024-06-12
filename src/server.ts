import app from "./app";
import { updateMaps } from "./services/update-maps";
import { env } from "./util/";
import { getPointsForPosition } from "./util/position-to-points";

app.listen(env.PORT, () => console.log("Running on port " + env.PORT));

const main = async () => {
    console.log(getPointsForPosition(1, true), getPointsForPosition(200, true));
    console.log(getPointsForPosition(1, false), getPointsForPosition(1000, false));
    //await updateMaps(0);
}

main();