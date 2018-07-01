import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { checkAll } from "./checks";
import { Node, getStatus } from "./NodeList";

configure({ adapter: new Adapter() });

jest.mock("./checks");

describe("getStatus", () => {
  it("should return `ok` message if no messages defined", () => {
    checkAll.mockReturnValue([]);
    const status = getStatus({ initial: "data" });
    expect(status.status.type).toBe("info");
    expect(status.status.name).toBe("ok");
    expect(status.data).toEqual({ initial: "data" });
  });

  it("should return first error", () => {
    checkAll.mockReturnValue([
      { type: "error", name: "error-message" },
      { type: "warning", name: "warning-message" },
      { type: "info", name: "info-message" }
    ]);
    const status = getStatus({ initial: "data" });
    expect(status.status.type).toBe("error");
    expect(status.status.name).toBe("error-message");
    expect(status.data).toEqual({ initial: "data" });
  });

  it("should return first warning if no error present", () => {
    checkAll.mockReturnValue([
      { type: "warning", name: "warning-message" },
      { type: "info", name: "info-message" }
    ]);
    const status = getStatus({ initial: "data" });
    expect(status.status.type).toBe("warning");
    expect(status.status.name).toBe("warning-message");
    expect(status.data).toEqual({ initial: "data" });
  });
});

describe("Node", () => {
  it("should render data", () => {
    const status = { type: "info", name: "ok", message: "Everything is fine!" };
    const data = { nodeId: "Example Node" };
    const wrapper = shallow(<Node status={status} data={data} />);

    expect(wrapper.hasClass("info")).toBe(true);
    expect(wrapper.hasClass("error")).toBe(false);
    expect(wrapper.hasClass("warning")).toBe(false);

    expect(wrapper.find(".icon").exists()).toBe(true);
    expect(wrapper.find(".name").text()).toContain("Example Node");
    expect(wrapper.find(".status").text()).toBe("Everything is fine!");
  });
});