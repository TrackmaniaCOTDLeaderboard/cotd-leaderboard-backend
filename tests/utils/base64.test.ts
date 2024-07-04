import { encodeBase64, decodeBase64 } from "../../src/util/base64";

describe("encodeBase64 function", () => {
    it("should encode a string to base64 correctly", () => {
        const input = "Hello, World!";
        const expectedOutput = "SGVsbG8sIFdvcmxkIQ==";
        const encoded = encodeBase64(input);
        expect(encoded).toEqual(expectedOutput);
    });

    it("should return an empty string when input is empty", () => {
        const input = "";
        const encoded = encodeBase64(input);
        expect(encoded).toEqual("");
    });
});

describe("decodeBase64 function", () => {
    it("should decode a base64 string correctly", () => {
        const input = "SGVsbG8sIFdvcmxkIQ==";
        const expectedOutput = "Hello, World!";
        const decoded = decodeBase64(input);
        expect(decoded).toEqual(expectedOutput);
    });

    it("should return an empty string when input is empty", () => {
        const input = "";
        const decoded = decodeBase64(input);
        expect(decoded).toEqual("");
    });
});

