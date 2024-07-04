import { assertIsDefined } from '../../src/util/assert-defined';

describe('assertIsDefined', () => {
    it('should not throw an error if the value is defined', () => {
        expect(() => assertIsDefined(1)).not.toThrow();
        expect(() => assertIsDefined('hello')).not.toThrow();
        expect(() => assertIsDefined(true)).not.toThrow();
        expect(() => assertIsDefined({})).not.toThrow();
        expect(() => assertIsDefined([])).not.toThrow();
    });

    it('should throw an error if the value is undefined or null', () => {
        expect(() => assertIsDefined(undefined)).toThrow('Expected variable to be defined, but received undefined');
        expect(() => assertIsDefined(null)).toThrow('Expected variable to be defined, but received null');
    });

    it('should throw an error with the custom variable name', () => {
        expect(() => assertIsDefined(undefined, 'myVar')).toThrow('Expected myVar to be defined, but received undefined');
        expect(() => assertIsDefined(null, 'myVar')).toThrow('Expected myVar to be defined, but received null');
    });

    it('should throw an error for falsy values except for null and undefined', () => {
        expect(() => assertIsDefined(false)).toThrow('Expected variable to be defined, but received false');
        expect(() => assertIsDefined(0)).toThrow('Expected variable to be defined, but received 0');
        expect(() => assertIsDefined(NaN)).toThrow('Expected variable to be defined, but received NaN');
        expect(() => assertIsDefined('')).toThrow('Expected variable to be defined, but received ');
    });

    it('should not throw an error for truthy values', () => {
        expect(() => assertIsDefined('false')).not.toThrow();
        expect(() => assertIsDefined('0')).not.toThrow();
        expect(() => assertIsDefined(1)).not.toThrow();
        expect(() => assertIsDefined(true)).not.toThrow();
        expect(() => assertIsDefined({})).not.toThrow();
        expect(() => assertIsDefined([])).not.toThrow();
    });
});
