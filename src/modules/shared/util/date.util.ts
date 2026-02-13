export const setTime = (
  date: Date,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
  millisecond: number = 0,
) => {
  const newDate = new Date(date);
  newDate.setHours(hour, minute, second, millisecond);
  return newDate;
};
