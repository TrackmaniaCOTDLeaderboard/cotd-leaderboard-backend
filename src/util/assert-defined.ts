/** Asserts that a value is defined (i.e., not null or undefined).
 *
 * This function is a type guard that throws an error if the provided value is null or undefined.
 * It helps ensure that the value is non-nullable in subsequent code.
 *
 * @template T - The type of the value to be checked.
 * @param val - The value to be checked for being defined.
 * @param [name="variable"] - The name of the variable for the error message (optional).
 * @throws Throws an error if the value is null or undefined.
 *
 * @example
 * const maybeValue: string | undefined = getValue();
 * assertIsDefined(maybeValue, 'maybeValue');
 * // From this point, TypeScript knows that `maybeValue` is not null or undefined
 * console.log(maybeValue.toUpperCase());
 */

export function assertIsDefined<T>(val: T, name = "variable"): asserts val is NonNullable<T> {
    if (!val) {
        throw Error(`Expected ${name} to be defined, but received ${val}`);
    }
}