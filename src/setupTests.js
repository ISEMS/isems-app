import { configure } from "enzyme";

import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      // Just return plain translation strings wherever they are used in tests
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));
