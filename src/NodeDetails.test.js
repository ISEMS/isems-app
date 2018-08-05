import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NodeDetails, {
  Message,
  MessageGroups,
  MessageList
} from "./NodeDetails";
import { fetchDetails } from "./api";
import { checkAll } from "./checks";

configure({ adapter: new Adapter() });

jest.mock("./api");
jest.mock("./checks");

describe("NodeDetails", () => {
  it("should convert server response to list of statuses", async () => {
    const fakeData = [{ status: "0x941" }];
    fetchDetails.mockReturnValue(Promise.resolve(fakeData));
    checkAll.mockReturnValue([{ type: "error", name: "test-status" }]);

    const wrapper = shallow(
      <NodeDetails match={{ params: { nodeId: "My Node" } }} />
    );

    expect(wrapper.find(MessageGroups).length).toBe(1);

    await wrapper.instance().componentDidMount();
    wrapper.update();
    const expectedProps = {
      displayMessages: {
        info: [],
        warning: [],
        error: [{ type: "error", name: "test-status" }]
      }
    };
    expect(wrapper.find(MessageGroups).props()).toEqual(expectedProps);
  });
});

describe("MessageGroups", () => {
  it("should render three MessageLists", async () => {
    const displayMessages = { info: [], warning: [], error: [] };

    const wrapper = shallow(
      <MessageGroups displayMessages={displayMessages} />
    );

    expect(wrapper.find(MessageList).length).toBe(3);
  });
});

describe("MessageList", () => {
  it("should render a list of messages", async () => {
    const messages = [{ type: "error", name: "test-status" }];

    const wrapper = shallow(<MessageList messages={messages} type="error" />);
    expect(wrapper.find(".status.error").length).toBe(1);
    expect(wrapper.find(Message).length).toBe(1);
  });
});

import { Error, Warning } from "@material-ui/icons";

describe("Message", () => {
  it("should render", async () => {
    const status = { type: "error", message: "something is really wrong" };
    const wrapper = shallow(<Message status={status} />);
    expect(wrapper.contains(<Error />)).toBe(true);
    expect(wrapper.contains(<Warning />)).toBe(false);
    expect(wrapper.find("span").text()).toBe("something is really wrong");
  });
});
