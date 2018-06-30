import {DateTime} from "luxon";

const getFormattedDate = (timestamp) => {
  const dt = DateTime.fromRFC2822(timestamp);
  return dt.toLocaleString(DateTime.DATETIME_SHORT);
};

export {
  getFormattedDate
}

export function prettyTimeDifference(time, reference) {
  const differenceDays = time.diff(reference, "days").toObject().days;
  if (Math.abs(differenceDays) >= 1) {
    return {unit: "days", count: differenceDays.toFixed(0)};
  }
  const differenceHours = time.diff(reference, "hours").toObject().hours;
  if (Math.abs(differenceHours) >= 1) {
    return {unit: "hours", count: differenceHours.toFixed(0)};
  }
  const differenceMinutes = time.diff(reference, "minutes").toObject().minutes;
  return {unit: "minutes", count: differenceMinutes.toFixed(0)};
}