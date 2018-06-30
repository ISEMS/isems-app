import { prettyTimeDifference } from "./utils";
import { DateTime } from "luxon";

describe("prettyTimeDifference", () => {
  const reference = DateTime.fromISO("2018-01-01");

  it("returns correct result for hours", () => {
    const time = DateTime.fromISO("2018-01-04");
    const difference = prettyTimeDifference(time, reference);
    expect(difference).toEqual({ unit: "days", count: "3"});
  });

  it("returns correct result for hours", () => {
    const time = DateTime.fromISO("2018-01-01T12:20:00");
    const difference = prettyTimeDifference(time, reference);
    expect(difference).toEqual({ unit: "hours", count: "12"});
  });

  it("returns correct result for minutes", () => {
    const time = DateTime.fromISO("2018-01-01T00:30:00");
    const difference = prettyTimeDifference(time, reference);
    expect(difference).toEqual({ unit: "minutes", count: "30"});
  });
});
