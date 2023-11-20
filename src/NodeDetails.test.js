import React from "react";
import { configure, mount, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import NodeDetails, {
  Message,
  MessageGroups,
  MessageList,
} from "./NodeDetails";
import Loader from "./Loader";
import { fetchDetails } from "./api";
import { checkAll } from "./checks";

configure({ adapter: new Adapter() });

jest.mock("./api");
jest.mock("./checks");

describe("NodeDetails", () => {
  it("should convert server response to list of statuses", async () => {
    const fakeData = [{ status: "0x941" }];
    fetchDetails.mockResolvedValueOnce(fakeData);
    checkAll.mockReturnValue([{ type: "error", name: "test-status" }]);

    let wrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <NodeDetails match={{ params: { nodeId: "My Node" } }} />
        </MemoryRouter>
      );
    });

    expect(wrapper.find(Loader).length).toBe(1);
    expect(wrapper.find(MessageGroups).length).toBe(0);

    await wrapper.update();

    const expectedProps = {
      displayMessages: {
        info: [],
        warning: [],
        critical: [],
        error: [{ type: "error", name: "test-status" }],
      },
    };
    expect(wrapper.find(Loader).length).toBe(0);
    expect(wrapper.find(MessageGroups).length).toBe(1);
    expect(wrapper.find(MessageGroups).props()).toEqual(expectedProps);
  });
});

describe("MessageGroups", () => {
  it("should render four MessageLists", async () => {
    const displayMessages = { info: [], warning: [], error: [], critical: [] };

    const wrapper = shallow(
      <MessageGroups displayMessages={displayMessages} />
    );

    expect(wrapper.find(MessageList).length).toBe(4);
  });
});

describe("MessageList", () => {
  it("should render a list of messages", async () => {
    const messages = [{ type: "error", name: "test-status" }];

    const wrapper = shallow(<MessageList messages={messages} type="error" />);
    expect(wrapper.find(".status").length).toBe(1);
    expect(wrapper.find(Message).length).toBe(1);
  });
});

import Error from "@material-ui/icons/Error";
import Warning from "@material-ui/icons/Warning";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

describe("Message", () => {
  it("should render", async () => {
    const status = {
      type: "error",
      name: "batteryCapacity",
      messageKey: "lowBatteryCapacity",
    };
    const wrapper = shallow(<Message status={status} />);
    expect(wrapper.contains(<Error style={{ fill: "#FF4136" }} />)).toBe(true);
    expect(wrapper.contains(<Warning />)).toBe(false);
    expect(wrapper.find("span").text()).toBe(
      "status.batteryCapacity.lowBatteryCapacity"
    );
  });
});
