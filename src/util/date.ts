

export const getDateKey = (year: number, month: number, day: number) => {
    const dayAsString = day < 10 ? `0${day}` : `${day}`;
    const monthAsString = month < 10 ? `0${month}` : `${month}`;
    return `${year}-${monthAsString}-${dayAsString}`;
}