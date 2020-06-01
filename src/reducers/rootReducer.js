import { combineReducers } from "redux";

import settings from "./settings";
import session from "./session";
import user from "./user";
import ui from "./ui";

export default combineReducers({
  session,
  settings,
  user,
  ui,
});
