import {
  checkBatteryHealth,
  checkCapacity,
  checkCharge,
  checkServerStatus,
  checkSolarControllerCommunication,
  checkTemperature,
  checkTime,
} from "./lib";

import lib from "./lib";

import {checkAll} from "./index"

jest.mock("./lib");

describe("checks", () => {
  describe("checkAll", () => {


    it("calls all individual checks", () => {
      const batterySpy = jest.spyOn(lib, 'checkBatteryHealth').mockReturnValue(undefined);
      const chargeSpy = jest.spyOn(lib, 'checkCharge').mockReturnValue(undefined);
      const capacitySpy = jest.spyOn(lib, 'checkCapacity').mockReturnValue(undefined);
      const temperatureSpy = jest.spyOn(lib, 'checkTemperature').mockReturnValue(undefined);
      const communicationSpy = jest.spyOn(lib, 'checkSolarControllerCommunication').mockReturnValue(undefined);

      checkServerStatus.mockReturnValue([]);
      checkTime.mockReturnValue("time_check");

      const results = checkAll({});
      expect(batterySpy).toHaveBeenCalled();
      expect(chargeSpy).toHaveBeenCalled();
      expect(capacitySpy).toHaveBeenCalled();
      expect(temperatureSpy).toHaveBeenCalled();
      expect(communicationSpy).toHaveBeenCalled();
      expect(results).toEqual(["time_check"]);
    });
  });
});
