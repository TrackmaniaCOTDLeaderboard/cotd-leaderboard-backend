/**
 * Generates a date string in the format "YYYY-MM-DD" from the given year, month, and day.
 *
 * This function takes a year, month, and day and returns a string formatted as `YYYY-MM-DD`,
 * where the month and day are zero-padded if they are less than 10.
 *
 * @param year - The year to be included in the date string.
 * @param month - The month to be included in the date string. Should be between 1 and 12.
 * @param day - The day to be included in the date string. Should be between 1 and 31.
 * @returns A string representing the date in the format `YYYY-MM-DD`.
 *
 * @example
 * const dateKey = getDateKey(2024, 7, 2);
 * console.log(dateKey); // Outputs: "2024-07-02"
 */
export const getDateKey = (year: number, month: number, day: number) => {
    const dayAsString = day < 10 ? `0${day}` : `${day}`;
    const monthAsString = month < 10 ? `0${month}` : `${month}`;
    return `${year}-${monthAsString}-${dayAsString}`;
}