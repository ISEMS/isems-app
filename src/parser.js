// 01 Node-ID;
// 02 ISEMS-Paket-Format-Revision;
// 03 Epoch-Timestamp;
// 04 FREIFUNK-OPEN-MPPT-Firmware-Version;
// 05 Time-until-next-scheduled-power-shutdown (in minutes);
// 06 Power-save-mode-of-Router On=1/Off=0;
// 07 Measured Solarmodule-Open-Circuit-Voltage V_oc, Value Volt DC;
// 08 Measured Solar-MPP-Voltage V_in, Value Volt DC ;
// 09 Battery voltage V_out, Value Volt DC;
// 10 Battery Charge State estimate (in percent);
// 11 Battery Health estimate (in percent);
// 12 Battery temperature in Celsius;
// 13 Low Voltage Disconnect Voltage, Value Volt DC;
// 14 Temperature corrected charge end Voltage, Value Volt DC;
// 15 Rated Battery_Capacity in Amperehours Ah;
// 16 Rated Solar module capacity in W;
// 17 Latitude;
// 18 Longitude

const parseData = data => {
  const lines = data.split("\n");

  const actualLines = lines.filter(line => line !== "");
  const converted = actualLines.map(line => {
    try {
      return parseLine(line);
    } catch (error) {
      console.warn(`Ignoring malformed line: ${line}`);
      return null;
    }
  });
  return converted.filter(line => line !== null);
};

const parseLine = line => {
  const parts = line.split(";");
  if (parts.length !== 18) {
    throw new Error("Line must have 18 semicolon separated fields");
  }
  return {
    nodeId: parts[0],
    isemsRevision: parts[1],
    timestamp: parts[2],
    openMPPTFirmwareVersion: parts[3],
    timeToShutdown: parts[4],
    isPowerSaveMode: parts[5],
    openCircuitVoltage: parts[6],
    mppVoltage: parts[7],
    batteryVoltage: parts[8],
    batteryChargeEstimate: parts[9],
    batteryHealthEstimate: parts[10],
    batteryTemperature: parts[11],
    lowVoltageDisconnectVoltage: parts[12],
    temperatureCorrectedVoltage: parts[13],
    rateBatteryCapacity: parts[14],
    ratedSolarModuleCapacity: parts[15],
    latitude: parseFloat(parts[16]),
    longitude: parseFloat(parts[17])
  };
};

export { parseData, parseLine };
