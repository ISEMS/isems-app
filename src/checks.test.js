import { checkServerStatus, hex, hexStatusToBitArray } from "./checks";

describe("checks", () => {
  describe("hexStatusToBitArray", () => {
    it("returns expected array", () => {
      // prettier-ignore
      const expected = [ 1, 0, 0, 1,
                       0, 0, 1, 0,
                       1, 0, 0, 0 ];

      expect(hexStatusToBitArray("0x941")).toEqual(expected);
    });
  });

  describe("checkServerStatus", () => {
    it("returns a list of statuses", () => {
      const statuses = checkServerStatus({ status: "0x941" });
      const expected = [
        "charging",
        "healthy",
        "temp_sensor_not_connected",
        "batter_overheating"
      ];
      expect(statuses).toEqual(expected);
    });
  });
});
