import { DateTime } from "luxon";
import { unionBy, filter, flatMap, partialRight, ary } from "lodash";

const parseDecimal = ary(partialRight(parseInt, 10), 1);

const hexStatusToBitArray = statusCode => {
  // coverts hex value (e.g. 0x941) to list of bits
  // digit:     ___9___   ___4___   ___1___
  // bit-value: 1 2 4 8   1 2 4 8   1 2 4 8
  // binary:    1 0 0 1   0 0 1 0   1 0 0 0
  // [ 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0 ]
  const parts = parseInt(statusCode, 16)
    .toString(2)
    .match(/.{1,4}/g);
  const toBigEndianArray = x => x.split("").reverse();
  return flatMap(parts, toBigEndianArray).map(parseDecimal);
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
    "no_solar_communication", // ERROR
    "batter_overheating", // ERROR
    "low_battery_temperature", // WARNING
    null, // TBS
    null // TBS
  ];
  const bitList = hexStatusToBitArray(data.status);
  return filter(statusBits, (status, index) => bitList[index] === 1);
}

function prettyTimeDifference(time, reference) {
  const differenceDays = reference.diff(time, "days").toObject().days;
  if (differenceDays >= 1) {
    return { unit: "days", count: differenceDays.toFixed(0) };
  }
  const differenceHours = reference.diff(time, "hours").toObject().hours;
  if (differenceHours >= 24) {
    return { unit: "hours", count: differenceHours.toFixed(0) };
  }
  const differenceMinutes = reference.diff(time, "minutes").toObject().minutes;
  return { unit: "minutes", count: differenceMinutes.toFixed(0) };
}

export function checkTime(data) {
  const now = DateTime.local();
  const measurementTime = DateTime.fromRFC2822(data.timestamp);
  const differenceDays = now.diff(measurementTime, "days").toObject().days;
  if (differenceDays > 1) {
    return {
      name: "timeOffset",
      type: "error",
      message: `The module did not send data since ${differenceDays.toFixed(
        0
      )} days.`
    };
  }
  const timeSince = prettyTimeDifference(measurementTime, now);
  return {
    name: "timeOffset",
    type: "info",
    message: `The module is sending data. The latest transmission was ${
      timeSince.count
    } ${timeSince.unit} ago.`
  };
}

function checkBatteryHealth(data, statuses) {
  if (statuses.includes("battery_level_low")) {
    return {
      type: "warning",
      name: "batteryHealth",
      message: `The battery capacity level is low. It might need to be replaced.`
    };
  }
}

function checkCharge(data, statuses) {
  const params = {
    name: "charge",
    type: "info"
  };
  if (statuses.includes("fully_charged")) {
    return {
      ...params,
      message: "The battery is fully charged."
    };
  }

  const chargePercentage = data.batteryChargeEstimate.toFixed(0);

  if (statuses.includes("charging")) {
    return {
      ...params,
      message: `The battery is charging. The current charge is approximately ${chargePercentage}%`
    };
  }
  if (statuses.includes("discharging")) {
    return {
      ...params,
      message: `The battery is discharging. The current charge is approximately ${chargePercentage}%`
    };
  }
}

function checkCapacity(data, statuses) {
  if (statuses.includes("energy_capacity_too_small")) {
    return {
      type: "error",
      name: "batteryCapacity",
      message: `The battery does not hold enough charge. You might have to install a bigger one.`
    };
  }
}

function checkTemperature(data, statuses) {
  if (statuses.includes("temp_sensor_not_connected")) {
    return {
      type: "warning",
      name: "temperature",
      message: `The battery temperature sensor is not connected. Connect it to make sure to get more information.`
    };
  }
  if (statuses.includes("battery_overheating")) {
    return {
      type: "warning",
      name: "temperature",
      message: `The battery is overheating (${
        data.batteryTemperature
      }°C). Try moving it to a cooler place or increasing ventilation.`
    };
  }
  if (statuses.includes("low_battery_temperature")) {
    return {
      type: "warning",
      name: "temperature",
      message: `The battery is too cold (${
        data.batteryTemperature
      }°C). Ideally it should not be below 25. Try adding some isolation.`
    };
  }
  return {
    type: "info",
    name: "temperature",
    message: `The battery temperature is OK (${data.batteryTemperature} °C).`
  };
}

function checkSolarControllerCommunication(data, statuses) {
  if (statuses.includes("no_solar_communication")) {
    return {
      type: "error",
      name: "solar_controller_communication",
      message: `Cannot communicate with solar controller. Make sure the devices are properly connected.`
    };
  }
  return {
    type: "info",
    name: "solar_controller_communication",
    message: `Communication with solar controller successfully established.`
  };
}

export function checkAll(data) {
  const statusChecks = [
    checkBatteryHealth,
    checkCharge,
    checkCapacity,
    checkTemperature,
    checkSolarControllerCommunication
  ];
  const statuses = checkServerStatus(data);

  const messages = statusChecks
    .map(check => check(data, statuses))
    .filter(message => message !== undefined);
  messages.push(checkTime(data));
  return messages;
}

export {hexStatusToBitArray}
