import axios from "axios";
import env from "../util/validate-env";

interface GetConfig {
    params?: Record<string, unknown>;
    token?: string;
}

export const get = (url: string, { params = {}, token }: GetConfig = {}) => {
    return axios.get(url, {
        params,
        headers: {
            "User-Agent": env.USER_AGENT,
            "Authorization": token
        }
    });
}