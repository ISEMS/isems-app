const fetchData = () => {
  return Promise.reject()
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${baseUrl}/measurements/latest`;
  return fetch(url)
  .then(response => response.json())
  .then(json => json.measurements);
};

const fakefetchData = () => {
  return Promise.resolve([{
    batteryChargeEstimate : 95,
    batteryHealthEstimate : 100,
    batteryTemperature : 23,
    batteryVoltage : 13.9,
    isPowerSaveMode : false,
    isemsRevision : 1,
    latitude : 52.507454,
    longitude : 13.458673,
    lowVoltageDisconnectVoltage : 11.7,
    mppVoltage : 18.0,
    nodeId : "Example Node",
    openCircuitVoltage : 22.0,
    openMPPTFirmwareVersion : 5,
    rateBatteryCapacity : 17,
    ratedSolarModuleCapacity : 50,
    temperatureCorrectedVoltage : 14.1,
    timeToShutdown : 480,
    timestamp : "Sun, 01 Jul 2018 08:23:27 GMT",
    status: "0x500",
  }])
};

const fetchDetails = nodeId => {
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${backendUrl}/measurements/${nodeId}/latest`;
  return fetch(url)
    .then(response => response.json())
    .then(json => json.measurements);
};

export {fetchData, fakefetchData, fetchDetails}
