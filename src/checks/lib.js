import { DateTime } from "luxon";
import { filter } from "lodash";
import { prettyTimeDifference } from "../utils";

const hexStatusToBitArray = statusCode => {
  // coverts hex value (e.g. 0x941) to list of bits
  // digit:     ___9___   ___4___   ___1___
  // bit-value: 8 4 2 1   8 4 2 1   8 4 2 1
  // binary:    1 0 0 1   0 1 0 0   0 0 0 1
  // [ 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1 ]
  return parseInt(statusCode, 16).toString(2).padStart(12, "0").split("").map(x => parseInt(x, 10));
};

export function checkServerStatus(data) {
  const statusBits = [
    "charging", // INFO
    "discharging", // INFO
    "fully_charged", // INFO
    "healthy", // INFO
    "battery_level_low", // WARNING
    "energy_capacity_too_small", // ERROR
    "temp_sensor_not_connected", // WARNING
    "no_solar_communication", // CRITICAL
    "batter_overheating", // ERROR
    "low_battery_temperature", // WARNING
    null, // TBS
    null // TBS
  ];
  const bitList = hexStatusToBitArray(data.status);
  return filter(statusBits, (status, index) => bitList[index] === 1);
}

export function checkTime(data) {
  const now = DateTime.local();
  const measurementTime = DateTime.fromISO(data.timestamp);
  const differenceDays = now.diff(measurementTime, "days").toObject().days;
  if (differenceDays > 1) {
    return {
      name: "timeOffset",
      type: "critical",
      messageKey: "noDataForDays",
      payload: {days: differenceDays.toFixed( 0 )},
    };
  }
  const timeSince = prettyTimeDifference(now, measurementTime);
  return {
    name: "timeOffset",
    type: "info",
    messageKey: "sendingData",
    payload: {count: timeSince.count, unit: timeSince.unit},

  };
}

export function checkBatteryHealth(data, statuses) {
  if (statuses.includes("battery_level_low")) {
    return {
      type: "warning",
      name: "batteryHealth",
      messageKey: "batteryLevelLow"
    };
  }
}

export function checkCharge(data, statuses) {
  const params = {
    name: "charge",
    type: "info"
  };
  if (statuses.includes("fully_charged")) {
    return {
      ...params,
      messageKey: "fullyCharged",
    };
  }

  const chargePercentage = data.batteryChargeEstimate.toFixed(0);

  if (statuses.includes("charging")) {
    return {
      ...params,
      messageKey: "charging",
      payload: {chargePercentage}
    };
  }
  if (statuses.includes("discharging")) {
    return {
      ...params,
      messageKey: "discharging",
      payload: {chargePercentage}
    };
  }
}

export function checkCapacity(data, statuses) {
  if (statuses.includes("energy_capacity_too_small")) {
    return {
      type: "error",
      name: "batteryCapacity",
      messageKey: "lowBatteryCapacity"
    };
  }
}

export function checkTemperature(data, statuses) {
  if (statuses.includes("temp_sensor_not_connected")) {
    return {
      type: "warning",
      name: "temperature",
      messageKey: "noTemperatureSensor"
    };
  }
  if (statuses.includes("battery_overheating")) {
    return {
      type: "warning",
      name: "temperature",
      messageKey: "overheating",
      payload: {batteryTemperature: data.batteryTemperature}
    };
  }
  if (statuses.includes("low_battery_temperature")) {
    return {
      type: "warning",
      name: "temperature",
      messageKey: "tooCold",
      payload: {batteryTemperature: data.batteryTemperature}

    };
  }
  return {
    type: "info",
    name: "temperature",
    messageKey: "ok",
    payload: {batteryTemperature: data.batteryTemperature}
  };
}

export function checkSolarControllerCommunication(data, statuses) {
  if (statuses.includes("no_solar_communication")) {
    return {
      type: "critical",
      name: "solar_controller_communication",
      messageKey: "error"
    };
  }
  return {
    type: "info",
    name: "solar_controller_communication",
    messageKey: "ok"
  };
}

export { hexStatusToBitArray };
export default {
  checkBatteryHealth,
  checkCharge,
  checkCapacity,
  checkTemperature,
  checkSolarControllerCommunication
};
