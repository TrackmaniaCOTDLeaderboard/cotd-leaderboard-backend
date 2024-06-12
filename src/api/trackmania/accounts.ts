import { z } from "zod";
import { get } from "../get-request";
import authentication from "./authentication";
import { getZonesOfPlayers } from "../core-service/zones";
import { wait, chunkArray } from "../../util";

const AccountNamesSchema = z.record(z.string());

const CHUNK_SIZE = 50;

export const getAccountNames = async (accountIds: string[]) => {
    const chunks = chunkArray(accountIds, CHUNK_SIZE);
    const accountDetailsPromises = chunks.map(getAccountNamesChunk);
    const accounts = await Promise.all(accountDetailsPromises);
    return accounts.reduce((acc, record) => {
        return { ...acc, ...record };
    }, {})
}

const getAccountNamesChunk = async (accountIds: string[]) => {
    if (accountIds.length > CHUNK_SIZE) {
        throw new Error(`Illegal State: Too many account ids passed: ${accountIds.length}`)
    }

    const token = await authentication.getBearerToken();
    const queryNames = accountIds.map(id => `accountId[]=${id}`).join('&');
    const responseNames = await get(`https://api.trackmania.com/api/display-names?${queryNames}`, token);
    return AccountNamesSchema.parse(responseNames.data);
}
