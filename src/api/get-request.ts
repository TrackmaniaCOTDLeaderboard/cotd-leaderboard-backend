import axios from "axios";
import env from "../util/validate-env";

export const get = (url: string, authorization?: string) => {
    return axios.get(url, {
        headers: {
            "User-Agent": env.USER_AGENT,
            "Authorization": authorization
        }
    });
}