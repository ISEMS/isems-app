import React from "react";
import {configure, shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NodeDetails, {Message} from "./NodeDetails";
import {fetchDetails} from "./api";
import { checkAll } from "./checks";

configure({ adapter: new Adapter() });

jest.mock("./api");
jest.mock("./checks");

describe("NodeDetails", () => {
  it("should render if properties are visible", async () => {
    const fakeData = [{ status: "0x941" }];
    fetchDetails.mockReturnValue(Promise.resolve(fakeData));
    checkAll.mockReturnValue([{type: "error", name:"test-status"}]);

    const wrapper = shallow(<NodeDetails match={{ params: {nodeId: "My Node"} }} />);
    expect(wrapper.find(".status").length).toBe(3);

    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(".errors").find(Message).length).toBe(1);
    expect(wrapper.find(".warnings").find(Message).length).toBe(0);
    expect(wrapper.find(".infos").find(Message).length).toBe(0);
  });
});
