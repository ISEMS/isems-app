import {
  checkBatteryHealth,
  checkCapacity,
  checkCharge, checkServerStatus,
  checkSolarControllerCommunication,
  checkTemperature,
  checkTime
} from "./lib";

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
