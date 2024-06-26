import { z } from "zod";
import { get } from "../get-request";
import authentication from "./authentication";

const AccountNamesSchema = z.record(z.string());

export const CHUNK_SIZE_ACCOUNT_NAMES = 50;

/**
 * Retrieves the account name for a given list of account IDs.
 *
 * @param accountIds The IDs of the account you want to retrieve the name for. *Max length:* {@link CHUNK_SIZE_ACCOUNT_NAMES}
 * @returns Mapping of `accountId` to `displayName`
 */
export const getAccountNames = async (accountIds: string[]) => {
    if (accountIds.length === 0) return {};

    if (accountIds.length > CHUNK_SIZE_ACCOUNT_NAMES) {
        throw new Error(`Illegal State: Too many account ids passed: ${accountIds.length}`)
    }

    const token = await authentication.getBearerToken();
    const queryNames = accountIds.map(id => `accountId[]=${id}`).join('&');
    const responseNames = await get(`https://api.trackmania.com/api/display-names?${queryNames}`, { token });
    return AccountNamesSchema.parse(responseNames.data);
}
