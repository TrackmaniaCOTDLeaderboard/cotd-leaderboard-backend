import fs from "fs";
import { Challenge } from "./api/live-service/challenges";
import { Competition } from "./api/live-service/competitions";
import app from "./app";
import { updateChallenges } from "./services/update-challenges";
import { updateCups } from "./services/update-cups";
import { env } from "./util/";

app.listen(env.PORT, () => console.log("Running on port " + env.PORT));

const main = async () => {
    const cache = fs.readFileSync("./assets/challenges.cache", "utf-8");
    const challenges = JSON.parse(cache) as Challenge[];
    await updateChallenges(challenges);

    const cache2 = fs.readFileSync("./assets/competitions.cache", "utf-8");
    const competitions = JSON.parse(cache2) as Competition[];
    await updateCups(competitions);

}



main();