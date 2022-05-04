import { combineReducers } from "redux";

import settings from "./settings";
import session from "./session";
import ui from "./ui";

export default combineReducers({
  session,
  settings,
  ui,
});
