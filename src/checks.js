import DateTime from "luxon/src/datetime";

export function checkTime(data) {
  const now = DateTime.local();
  const measurementTime = DateTime.fromRFC2822(data.timestamp);
  const differenceDays = now.diff(measurementTime, "days").toObject().days;
  if (differenceDays > 1) {
    return {
      type: "timeOffset",
      message: `No data since ${differenceDays.toFixed(0)} days.`
    };
  }
}

export function checkBatteryHealth(data) {
  if (data.batteryHealthEstimate && (data.batteryHealthEstimate < 0.5)) {
    return {
      type: "batteryHealth",
      message: `The battery might need to be replaced.`
    };
  }
}
