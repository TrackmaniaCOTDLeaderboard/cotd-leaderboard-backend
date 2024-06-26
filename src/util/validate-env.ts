import "dotenv/config";
import { cleanEnv, port, str, url } from "envalid";

export default cleanEnv(process.env, {
    PORT: port(),
    MONITOR_USERNAME: str(),
    MONITOR_PASSWORD: str(),
    DATABASE_URL: str(),
    USER_AGENT: str(),
    UBI_USERNAME: str(),
    UBI_PASSWORD: str(),
    UBI_AUTHENTICATION_URL: url(),
    UBI_REFRESH_URL: url(),
    TRACKMANIA_OAUTH_CLIENT_ID: str(),
    TRACKMANIA_OAUTH_CLIENT_SECRET: str(),
    JWT_SECRET: str()
});