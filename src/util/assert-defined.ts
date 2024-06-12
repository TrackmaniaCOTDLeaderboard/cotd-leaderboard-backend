export function assertIsDefined<T>(val: T, name = "variable"): asserts val is NonNullable<T> {
    if (!val) {
        throw Error(`Expected ${name} to be defined, but received ${val}`);
    }
}