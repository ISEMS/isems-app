import { DateTime } from "luxon";
import { generateSolarBatteryData } from "./data-fakes";

const deltas = {
  "Solar Irrigation System": 0,
  "Freifunk Hop": 5,
  "Weather Station": 100,
};

const fetchData = (loadAll = false) => {
  const data = [
    {
      batteryChargeEstimate: 95.0,
      batteryHealthEstimate: 100.0,
      batteryTemperature: 27.84,
      batteryVoltage: 12.999,
      id: 33875815,
      isPowerSaveMode: false,
      isemsRevision: "1",
      latitude: 52.47388,
      longitude: 13.39051,
      lowVoltageDisconnectVoltage: 11.9,
      mppVoltage: 13.588,
      nodeId: "Solar Irrigation System",
      openCircuitVoltage: 13.513,
      openMPPTFirmwareVersion: "ESP_2.0",
      rateBatteryCapacity: 50.0,
      ratedSolarModuleCapacity: 50.0,
      status: "0x100",
      temperatureCorrectedVoltage: 14.014,
      timeToShutdown: 3592.0,
      timestamp: DateTime.now().toISO(),
    },
    {
      batteryChargeEstimate: 74.0,
      batteryHealthEstimate: 100.0,
      batteryTemperature: 21.1,
      batteryVoltage: 12.729,
      id: 12277731,
      isPowerSaveMode: false,
      isemsRevision: "1",
      latitude: 52.52,
      longitude: 13.4,
      lowVoltageDisconnectVoltage: 11.9,
      mppVoltage: 0.0,
      nodeId: "Freifunk Hop",
      openCircuitVoltage: 0.0,
      openMPPTFirmwareVersion: "ESP_2.0",
      rateBatteryCapacity: 200.0,
      ratedSolarModuleCapacity: 300.0,
      status: "0x500",
      temperatureCorrectedVoltage: 14.216,
      timeToShutdown: 3262.0,
      timestamp: DateTime.now().minus({ days: deltas["Freifunk Hop"] }).toISO(),
    },
  ];

  if (loadAll) {
    data.push({
      batteryChargeEstimate: 98.0,
      batteryHealthEstimate: 100.0,
      batteryTemperature: 19.5,
      batteryVoltage: 12.699,
      id: 11264552,
      isPowerSaveMode: false,
      isemsRevision: "1",
      latitude: -22.89,
      longitude: -45.83,
      lowVoltageDisconnectVoltage: 11.9,
      mppVoltage: 0.0,
      nodeId: "Weather Station",
      openCircuitVoltage: 0.0,
      openMPPTFirmwareVersion: "ESP_2.0",
      rateBatteryCapacity: 7.0,
      ratedSolarModuleCapacity: 140.0,
      status: "0x440",
      temperatureCorrectedVoltage: 14.865,
      timeToShutdown: 3445.0,
      timestamp: DateTime.now()
        .minus({ days: deltas["Weather Station"] })
        .toISO(),
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 250);
  });
};

const fetchDetails = (nodeId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        generateSolarBatteryData(DateTime.now().minus({ days: deltas[nodeId] }))
      );
    }, 250);
  });
};

export { fetchData, fetchDetails };
