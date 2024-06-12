import axios from "axios";
import { env } from "../../util";

class TrackmaniaAPITokenManager {

    private bearerToken?: string;
    private expires?: number;

    public async refresh() {
        const response = await getToken();
        const { access_token, expires_in } = response.data;

        if (access_token === undefined || expires_in === undefined) {
            throw new Error("Invalid response from trackmania api.")
        };

        this.bearerToken = access_token;
        this.expires = Date.now() + (expires_in * 1000);
    }

    public isExpired() {
        return this.expires === undefined || Date.now() > this.expires;
    }

    public async getBearerToken() {
        if (this.isExpired()) {
            await this.refresh();
        }
        if (this.bearerToken === undefined) {
            throw new Error("IllegalState: AccessToken is undefined.")
        }
        return `Bearer ${this.bearerToken}`;
    }
}

const getToken = async () => {
    const body = `grant_type=client_credentials&client_id=${env.TRACKMANIA_OAUTH_CLIENT_ID}&client_secret=${env.TRACKMANIA_OAUTH_CLIENT_SECRET}`;
    return await axios.post("https://api.trackmania.com/api/access_token", body, {
        headers: {
            "User-Agent": env.USER_AGENT,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
}

export default new TrackmaniaAPITokenManager();