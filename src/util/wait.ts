/**
 * Pauses the execution for a specified number of seconds.
 *
 * This function returns a promise that resolves after the specified number of seconds.
 *
 * @param seconds - The number of seconds to wait.
 * @returns A promise that resolves after the specified number of seconds.
 *
 * @example
 * // Wait for 2 seconds
 * await wait(2);
 */
export const wait = async (seconds: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
};