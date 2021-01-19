import { combineReducers } from "redux";

import settings from "./settings";
import session from "./session";
import user from "./user";
import ui from "./ui";
import views from "./views";

export default combineReducers({
  session,
  settings,
  user,
  ui,
  views,
});
