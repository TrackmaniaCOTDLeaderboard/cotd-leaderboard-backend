/**
 * Encodes a given string to Base64.
 * 
 * This function converts the input string into a binary buffer and then encodes it into a Base64 string.
 *
 * @param input - The input string to be encoded.
 * @returns The Base64 encoded string.
 *
 * @example
 * const encoded = encodeBase64("Hello, World!");
 * console.log(encoded); // Outputs: "SGVsbG8sIFdvcmxkIQ=="
 */

export const encodeBase64 = (input: string) => Buffer.from(input, "binary").toString("base64");

/**
 * Decodes a given Base64 encoded string.
 * 
 * This function converts the input Base64 string into a binary buffer and then decodes it back into a regular string.
 *
 * @param input - The Base64 encoded string to be decoded.
 * @returns The decoded string.
 *
 * @example
 * const decoded = decodeBase64("SGVsbG8sIFdvcmxkIQ==");
 * console.log(decoded); // Outputs: "Hello, World!"
 */
export const decodeBase64 = (input: string) => Buffer.from(input, "base64").toString("binary");