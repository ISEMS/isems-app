import {parseLine} from "./parser";
import {checkServerStatus} from "./checks";

test('throws an exception if for malformed data', () => {
  const value = checkServerStatus({status: "0x941"});
  const expected = ["charging", "healthy", "temp_sensor_not_connected", "batter_overheating"]
  expect(value).toEqual(expected);
});


