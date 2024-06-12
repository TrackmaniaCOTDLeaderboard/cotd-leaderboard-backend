export const encodeBase64 = (input: string) => Buffer.from(input, "binary").toString("base64");
export const decodeBase64 = (input: string) => Buffer.from(input, "base64").toString("binary");