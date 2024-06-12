import axios, { AxiosResponse } from "axios";
import { env, decodeBase64, encodeBase64 } from "./";

const USERNAME = env.UBI_USERNAME;
const PASSWORD = env.UBI_PASSWORD;

const BASE64_ENCODED = encodeBase64(`${USERNAME}:${PASSWORD}`);
const BASIC_AUTHENTICATION = `Basic ${BASE64_ENCODED}`;

export class TokenManager {

    private accessToken?: string;
    private refreshToken?: string;
    private expires?: number;

    constructor(private readonly authenticationUrl: string, private readonly refreshUrl: string, private readonly audience: string) { }

    public async initialize() {
        const response = await getTokens(this.authenticationUrl, this.audience);
        return this.updateTokens(response);
    }

    public isInitialized() {
        return this.expires !== undefined;
    }

    public isExpired() {
        if (this.expires === undefined) {
            throw new Error("IllegalState: 'expires' is undefined.");
        }
        return Date.now() > this.expires;
    }

    public async getAccessToken() {
        if (!this.isInitialized()) {
            await this.initialize();
        }
        if (this.isExpired()) {
            await this.refresh();
        }
        if (this.accessToken === undefined) {
            throw new Error("IllegalState: AccessToken is undefined.")
        }
        return `nadeo_v1 t=${this.accessToken}`;
    }

    public async refresh() {
        const response = await refreshTokens(this.refreshUrl, this.getRefreshToken());
        this.updateTokens(response);
    }

    private updateTokens(response: AxiosResponse<any, any>) {
        const { accessToken, refreshToken, exp, rat } = validateResponse(response);

        this.expires = exp * 1000;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        return rat * 1000;
    }

    public getRefreshToken() {
        if (this.refreshToken === undefined) {
            throw new Error("IllegalState: RefreshToken is undefined.")
        }
        return this.refreshToken;
    }


}

export const getTokens = async (url: string, audience: string) => {
    return await axios.post(url, { "audience": audience }, {
        headers: {
            "User-Agent": env.USER_AGENT,
            "Authorization": BASIC_AUTHENTICATION
        }
    });
}

export const refreshTokens = async (url: string, currentRefreshToken: string) => {
    return await axios.post(url, {}, {
        headers: {
            "User-Agent": env.USER_AGENT,
            "Authorization": `nadeo_v1 t=${currentRefreshToken}`
        }
    });
}

export const validateResponse = (response: AxiosResponse<any, any>) => {
    const { accessToken, refreshToken } = response.data;

    if (accessToken === undefined || refreshToken === undefined) {
        throw new Error("Failed to authenticate with Ubisoft API.");
    }

    const payload = accessToken.split(".")[1];
    if (payload === undefined) {
        throw new Error("Unexpected payload of accessToken.");
    }

    const payloadAsJSON = JSON.parse(decodeBase64(payload));
    const { exp, rat } = payloadAsJSON;

    if (typeof exp !== "number" || typeof rat !== "number") {
        throw new Error(`Payload has invalid 'exp' (${exp}) or rat (${rat}).`);
    }
    return { accessToken, refreshToken, exp, rat };
}