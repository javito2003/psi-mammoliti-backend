export const setStartDay = (
  date: Date,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
  millisecond: number = 0,
) => date.setHours(hour, minute, second, millisecond);
