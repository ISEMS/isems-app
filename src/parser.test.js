import {parseLine} from "./parser";

test('throws an exception if for malformed data', () => {
  expect(() => {parseLine("GARBAGE")}).toThrow()
});

test('does not throw for valid data', () => {
  const line = "Elektra-Solar1;1;1522935117;5;480;0;22.0;18.0;14.0;96;100;23;11.7;14.1;17;50;52.507454;13.458673";
  const result = parseLine(line);
  expect(Object.keys(result).length).toBe(18)
});
