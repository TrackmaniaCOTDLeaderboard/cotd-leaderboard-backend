import { TokenManager, env } from "../../util";

const AUTHENTICATION_URL = env.UBI_AUTHENTICATION_URL;
const REFRESH_URL = env.UBI_REFRESH_URL;

export default new TokenManager(AUTHENTICATION_URL, REFRESH_URL, "NadeoServices");