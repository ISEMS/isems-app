import Noty from "noty";
import "noty/lib/noty.css";
import "noty/lib/themes/light.css"

Noty.overrideDefaults({
  theme: "light",
  closeWith: ['click', 'button'],
  timeout: 2000,
});

const toast = {
  error(text) { new Noty({text, type: "error"}).show() },
  success(text) { new Noty({text, type: "success"}).show() },
  info(text) { console.log(text); new Noty({text, type: "success"}).show() },
}

export default toast;