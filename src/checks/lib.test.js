import {
  checkBatteryHealth,
  checkCapacity,
  checkCharge,
  checkServerStatus,
  checkSolarControllerCommunication,
  checkTemperature,
  checkTime,
  hexStatusToBitArray
} from "./lib";

import { Settings } from "luxon";

describe("checks", () => {
  describe("hexStatusToBitArray", () => {
    it("returns expected array", () => {
      // prettier-ignore
      const expected = [ 1, 0, 0, 1,   // 9
                         0, 1, 0, 0,   // 4
                         0, 0, 0, 1 ]; // 1

      expect(hexStatusToBitArray("0x941")).toEqual(expected);
    });

    it("returns expected array for 2 digit numbers", () => {
      // prettier-ignore
      const expected = [ 0, 0, 0, 0,   // 0
                         0, 1, 1, 1,   // 7
                         0, 0, 1, 0 ]; // 2

      expect(hexStatusToBitArray("0x072")).toEqual(expected);
    });
  });

  describe("checkServerStatus", () => {
    it("returns a list of statuses", () => {
      const statuses = checkServerStatus({ status: "0x941" });
      const expected = [
        "charging",
        "healthy",
        "energy_capacity_too_small",
        null
      ];
      expect(statuses).toEqual(expected);
    });

    it("returns list with just one status", () => {
      const statuses = checkServerStatus({ status: "0x040" });
      const expected = [
        "energy_capacity_too_small",
      ];
      expect(statuses).toEqual(expected);
    });

    it("returns correct statues when individual digits ar zero padded", () => {
      const statuses = checkServerStatus({ status: "0x440" });
      const expected = [
        "discharging",
        "energy_capacity_too_small"
      ];
      expect(statuses).toEqual(expected);
    });
  });

  describe("checkBatteryHealth", () => {
    it("returns information about battery health", () => {
      const info = checkBatteryHealth({}, ["battery_level_low"]);
      expect(info.type).toBe("warning");
      expect(info.name).toBe("batteryHealth");
    });

    it("returns nothing if not battery level status", () => {
      const info = checkBatteryHealth({}, []);
      expect(info).toBeUndefined();
    });
  });

  describe("checkCharge", () => {
    it("shows fully charged info", () => {
      const info = checkCharge({}, ["fully_charged"]);
      expect(info.name).toBe("charge");
      expect(info.type).toBe("info");
      expect(info.message).toBe("The battery is fully charged.");
    });

    it("shows charging info", () => {
      const info = checkCharge({ batteryChargeEstimate: 10 }, ["charging"]);
      expect(info.name).toBe("charge");
      expect(info.type).toBe("info");
      expect(info.message).toEqual(
        expect.stringContaining("The battery is charging")
      );
    });

    it("shows discharging info", () => {
      const info = checkCharge({ batteryChargeEstimate: 10 }, ["discharging"]);
      expect(info.name).toBe("charge");
      expect(info.type).toBe("info");
      expect(info.message).toEqual(
        expect.stringContaining("The battery is discharging")
      );
    });
  });

  describe("checkCapacity", () => {
    it("returns information about capacity", () => {
      const info = checkCapacity({}, ["energy_capacity_too_small"]);
      expect(info.type).toBe("error");
      expect(info.name).toBe("batteryCapacity");
    });

    it("returns nothing if not battery level status", () => {
      const info = checkCapacity({}, []);
      expect(info).toBeUndefined();
    });
  });

  describe("checkTemperature", () => {
    it("returns warning if sensor is not connected", () => {
      const info = checkTemperature({}, ["temp_sensor_not_connected"]);
      expect(info.type).toBe("warning");
      expect(info.name).toBe("temperature");
    });

    it("returns warning if battery is overheating", () => {
      const info = checkTemperature({}, ["battery_overheating"]);
      expect(info.type).toBe("warning");
      expect(info.name).toBe("temperature");
      expect(info.message).toEqual(expect.stringContaining("is overheating"));
    });

    it("returns warning if battery is too cold", () => {
      const info = checkTemperature({}, ["low_battery_temperature"]);
      expect(info.type).toBe("warning");
      expect(info.name).toBe("temperature");
      expect(info.message).toEqual(expect.stringContaining("is too cold"));
    });

    it("returns info if everything is fine", () => {
      const info = checkTemperature({ batteryTemperature: 29 }, []);
      expect(info.type).toBe("info");
      expect(info.name).toBe("temperature");
      expect(info.message).toEqual("The battery temperature is OK (29 °C).");
    });
  });

  describe("checkSolarControllerCommunication", () => {
    it("returns error if communication with solar controller is not possible", () => {
      const info = checkSolarControllerCommunication({}, [
        "no_solar_communication"
      ]);
      expect(info.type).toBe("critical");
      expect(info.name).toBe("solar_controller_communication");
    });

    it("returns info if no negative information about communication", () => {
      const info = checkSolarControllerCommunication({}, []);
      expect(info.type).toBe("info");
      expect(info.name).toBe("solar_controller_communication");
    });
  });

  describe("checkTime", () => {
    Settings.now = () => new Date(2018, 0, 8).valueOf();

    it("return warning long time since last transmission", () => {
      const info = checkTime({ timestamp: "2018-01-01T11:51:28" });
      expect(info.type).toBe("critical");
      expect(info.name).toBe("timeOffset");
    });

    it("returns info if last communication within 24 hours", () => {
      const info = checkTime({ timestamp: "2018-01-08T11:51:28" });
      expect(info.type).toBe("info");
      expect(info.name).toBe("timeOffset");
    });
  });
});
