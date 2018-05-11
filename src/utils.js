import {DateTime} from "luxon";

const getFormattedDate = (timestamp) => {
  const dt = DateTime.fromRFC2822(timestamp);
  return dt.toLocaleString(DateTime.DATETIME_SHORT);
};

export {
  getFormattedDate
}